// api/settings.js - Dynamic Configuration & Admin Control API
import { db, notifyAdmins, sendTelegramMessage } from './_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const settings = db.getSettings();
    const { includeAdminData, pin } = req.query;

    if (includeAdminData === 'true' && pin === (settings.adminPin || 'HOPE2026')) {
      const orders = db.getOrders();
      const messages = db.getAllMessages();
      const agreements = db.getAgreements();
      return res.status(200).json({
        settings,
        orders,
        messages,
        agreements
      });
    }

    // Public settings (hide admin pin)
    const { adminPin, ...publicSettings } = settings;
    return res.status(200).json({ settings: publicSettings });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const clientPin = req.headers['x-admin-pin'] || body.adminPin;
      const currentSettings = db.getSettings();

      if (clientPin !== (currentSettings.adminPin || 'HOPE2026')) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
      }

      // Handle specific action types
      const { action, payload } = body;

      if (action === 'update_package_price') {
        const { packageId, newPrice } = payload;
        const packages = [...currentSettings.packages];
        const idx = packages.findIndex(p => p.id === packageId);
        if (idx !== -1) {
          packages[idx].price = Number(newPrice);
          db.updateSettings({ packages });
          await notifyAdmins(`⚙️ <b>ADMIN UPDATE:</b> Price for <b>${packages[idx].titleEn}</b> updated to <b>${Number(newPrice).toLocaleString()} ETB</b>.`);
          return res.status(200).json({ success: true, packages });
        }
        return res.status(404).json({ error: 'Package not found' });
      }

      if (action === 'update_packages') {
        const { packages } = payload;
        db.updateSettings({ packages });
        await notifyAdmins(`⚙️ <b>ADMIN UPDATE:</b> Package deliverables & prices updated across the catalog.`);
        return res.status(200).json({ success: true, packages });
      }

      if (action === 'add_custom_service') {
        const { newService } = payload;
        const addons = [...currentSettings.addons, newService];
        db.updateSettings({ addons });
        await notifyAdmins(`⚙️ <b>NEW SERVICE ADDED:</b> <b>${newService.name}</b> (+${Number(newService.price).toLocaleString()} ETB).`);
        return res.status(200).json({ success: true, addons });
      }

      if (action === 'update_addons') {
        const { addons } = payload;
        db.updateSettings({ addons });
        return res.status(200).json({ success: true, addons });
      }

      if (action === 'reply_to_customer') {
        const { orderId, text, senderName } = payload;
        const message = db.addMessage(orderId, {
          sender: 'admin',
          senderName: senderName || 'HOPE Management',
          text
        });

        const order = db.getOrder(orderId);
        if (order?.telegramUserId) {
          await sendTelegramMessage(order.telegramUserId, `💬 <b>Message from HOPE Studio Management:</b>\n\n"${text}"`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: '💬 Open Chat in Mini App', web_app: { url: `https://hope-photo-velo-jade.vercel.app/?tma=1&order_id=${orderId}&tab=chat` } }]
              ]
            }
          });
        }

        return res.status(200).json({ success: true, message });
      }

      if (action === 'grant_discount') {
        const { orderId, discountAmount } = payload;
        const order = db.getOrder(orderId);
        if (order) {
          const original = order.negotiatedPrice || order.totalPrice;
          const newPrice = Math.max(0, original - Number(discountAmount));
          db.updateOrder(orderId, {
            discountAmount: (order.discountAmount || 0) + Number(discountAmount),
            negotiatedPrice: newPrice,
            status: 'discount_offered'
          });

          db.addMessage(orderId, {
            sender: 'admin',
            senderName: 'HOPE Studio Director',
            type: 'discount_offer',
            text: `🎉 A special discount of ${Number(discountAmount).toLocaleString()} ETB was granted! Your new total is ${newPrice.toLocaleString()} ETB.`,
            data: { discountAmount: Number(discountAmount), newPrice }
          });

          if (order.telegramUserId) {
            await sendTelegramMessage(order.telegramUserId, `🎉 <b>Special Discount Approved!</b>\n\nOrder: <code>${order.id}</code>\nDiscount: <b>-${Number(discountAmount).toLocaleString()} ETB</b>\nNew Total: <b>${newPrice.toLocaleString()} ETB</b>\n\nTap below to review and sign:`, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: '✍️ Open Contract & Sign', web_app: { url: `https://hope-photo-velo-jade.vercel.app/?tma=1&order_id=${order.id}&tab=agreement` } }]
                ]
              }
            });
          }

          return res.status(200).json({ success: true, order: db.getOrder(orderId) });
        }
        return res.status(404).json({ error: 'Order not found' });
      }

      // General settings update
      const updated = db.updateSettings(payload || {});
      return res.status(200).json({ success: true, settings: updated });
    } catch (e) {
      console.error('Settings error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
