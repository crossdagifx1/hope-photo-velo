// api/orders.js - Order Management API for Mini App
import { db, notifyAdmins } from './_store.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { id, user_id } = req.query;
    if (id) {
      const order = db.getOrder(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ order });
    }
    const orders = db.getOrders();
    if (user_id) {
      const filtered = orders.filter(o => String(o.telegramUserId) === String(user_id));
      return res.status(200).json({ orders: filtered });
    }
    return res.status(200).json({ orders });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const order = db.saveOrder({
        clientName: body.clientName || 'Valued Client',
        phone: body.phone || '',
        telegramUserId: body.telegramUserId || null,
        telegramUsername: body.telegramUsername || null,
        category: body.category || 'wedding',
        packageId: body.packageId || 'custom',
        packageName: body.packageName || 'Selected Package',
        eventDate: body.eventDate || '',
        location: body.location || 'Addis Ababa',
        basePrice: Number(body.basePrice) || 0,
        addons: body.addons || [],
        totalPrice: Number(body.totalPrice) || Number(body.basePrice) || 0,
        negotiatedPrice: Number(body.negotiatedPrice) || Number(body.totalPrice) || Number(body.basePrice) || 0,
        discountAmount: Number(body.discountAmount) || 0,
        notes: body.notes || '',
        status: 'pending_quote', // 'pending_quote' | 'discount_offered' | 'signed' | 'confirmed'
      });

      // Initial system message in chat
      db.addMessage(order.id, {
        sender: 'system',
        senderName: 'HOPE Studio System',
        text: `✨ Order created for ${order.packageName}! Total quote: ${order.totalPrice.toLocaleString()} ETB. You can chat here directly with our directors to ask questions or request special discounts.`
      });

      // Send instant rich alert to company owners on Telegram
      const alertMsg = `🌟 <b>NEW MINI APP BOOKING RECEIVED!</b>\n\n` +
        `🆔 <b>Order:</b> <code>${order.id}</code>\n` +
        `👤 <b>Client:</b> ${order.clientName} ${order.telegramUsername ? `(@${order.telegramUsername})` : ''}\n` +
        `📞 <b>Phone:</b> ${order.phone || 'TBD'}\n` +
        `📅 <b>Date:</b> ${order.eventDate || 'Not specified'}\n` +
        `📍 <b>Location:</b> ${order.location}\n` +
        `📦 <b>Package:</b> ${order.packageName} (${order.category.toUpperCase()})\n` +
        `💰 <b>Quote:</b> <b>${order.totalPrice.toLocaleString()} ETB</b>\n` +
        (order.addons?.length > 0 ? `➕ <b>Add-ons:</b> ${order.addons.map(a => a.name).join(', ')}\n` : '') +
        (order.notes ? `📝 <b>Notes:</b> <i>"${order.notes}"</i>\n` : '') +
        `\n👇 <b>Quick Actions:</b>`;

      await notifyAdmins(alertMsg, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏷️ Offer Discount', callback_data: `discount:${order.id}` },
              { text: '💬 Reply to Client', callback_data: `reply:${order.id}` }
            ],
            [
              { text: '📝 Send Agreement', callback_data: `agree:${order.id}` },
              { text: '✅ Confirm Deposit', callback_data: `confirm:${order.id}` }
            ]
          ]
        }
      });

      return res.status(201).json({ success: true, order });
    } catch (e) {
      console.error('Error creating order:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, ...patch } = body;
      if (!id) return res.status(400).json({ error: 'Order ID required' });

      const updated = db.updateOrder(id, patch);
      if (!updated) return res.status(404).json({ error: 'Order not found' });

      return res.status(200).json({ success: true, order: updated });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
