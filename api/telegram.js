// api/telegram.js - Telegram Webhook Handler & Admin Review Bot
import { db, BOT_TOKEN, ADMIN_CHAT_IDS, sendTelegramMessage } from './_store.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. One-Click Setup / Diagnostics
  if (req.method === 'GET') {
    const host = req.headers.host || 'hope-photo-velo-jade.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const webhookUrl = `${proto}://${host}/api/telegram`;

    if (req.query.setup === '1') {
      try {
        const whRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ['message', 'callback_query']
          })
        });
        const setupResult = await whRes.json();
        return res.status(200).json({ success: true, webhookUrl, setupResult });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    try {
      const info = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`).then(r => r.json());
      const me = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`).then(r => r.json());
      return res.status(200).json({ ok: true, me, webhookInfo: info });
    } catch (e) {
      return res.status(200).json({ ok: true, status: 'Telegram endpoint active' });
    }
  }

  // 2. Handle Telegram Webhook Updates
  if (req.method === 'POST') {
    try {
      const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!update) return res.status(200).json({ ok: true });

      // ── A. Handle Callback Query (Approve / Reject Buttons) ──
      if (update.callback_query) {
        const cq = update.callback_query;
        const callbackId = cq.id;
        const data = cq.data || '';
        const fromUser = cq.from || {};
        const adminName = fromUser.username ? `@${fromUser.username}` : (fromUser.first_name || 'Studio Director');
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        const [action, orderId] = data.split(':');
        const order = db.getOrder(orderId);

        if (action === 'approve') {
          if (order) {
            db.updateOrder(orderId, {
              status: 'CONFIRMED',
              paymentStatus: 'deposit_confirmed',
              approvedAt: new Date().toISOString(),
              approvedBy: adminName
            });
          }

          // Answer callback toast
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackId,
              text: `✅ Order ${orderId} has been Officially Approved & Confirmed!`,
              show_alert: true
            })
          });

          // Edit message caption or text to show approved state
          const updatedCaption = `✅ <b>BOOKING OFFICIALLY CONFIRMED!</b>\n\n` +
            `🆔 <b>Order:</b> <code>${orderId}</code>\n` +
            `👤 <b>Client:</b> ${order?.clientName || 'Valued Client'}\n` +
            `📞 <b>Phone:</b> ${order?.phone || 'N/A'}\n` +
            `📅 <b>Event Date:</b> ${order?.eventDate || 'N/A'}\n` +
            `📦 <b>Package:</b> ${order?.packageName || 'N/A'}\n` +
            `💰 <b>Deposit Received:</b> ${order?.depositAmount ? Number(order.depositAmount).toLocaleString() + ' ETB' : 'Verified'}\n\n` +
            `✨ <i>Verified & Approved by ${adminName} on ${new Date().toLocaleTimeString()}</i>`;

          if (cq.message?.photo) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                caption: updatedCaption,
                parse_mode: 'HTML'
              })
            });
          } else {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: updatedCaption,
                parse_mode: 'HTML'
              })
            });
          }

          return res.status(200).json({ ok: true });
        }

        if (action === 'reject') {
          if (order) {
            db.updateOrder(orderId, {
              status: 'NEEDS_INFO',
              rejectedAt: new Date().toISOString(),
              rejectedBy: adminName
            });
          }

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackId,
              text: `⚠️ Order ${orderId} marked as Needs Information / Rejected.`,
              show_alert: true
            })
          });

          const updatedCaption = `⚠️ <b>BOOKING FLAGGED / NEEDS INFO</b>\n\n` +
            `🆔 <b>Order:</b> <code>${orderId}</code>\n` +
            `👤 <b>Client:</b> ${order?.clientName || 'Valued Client'}\n` +
            `📞 <b>Phone:</b> ${order?.phone || 'N/A'}\n` +
            `Status updated to <b>NEEDS_INFO</b> by ${adminName}. Please contact the client.`;

          if (cq.message?.photo) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                caption: updatedCaption,
                parse_mode: 'HTML'
              })
            });
          }

          return res.status(200).json({ ok: true });
        }
      }

      // ── B. Handle Text Messages ──
      if (update.message) {
        const msg = update.message;
        const text = (msg.text || '').trim();
        const chatId = msg.chat.id;

        // /start discuss_ORDERID
        if (text.startsWith('/start')) {
          const parts = text.split(' ');
          const param = parts[1] || '';

          if (param.startsWith('discuss_')) {
            const orderId = param.replace('discuss_', '');
            const order = db.getOrder(orderId);

            // Record discussion start
            if (order) {
              db.updateOrder(orderId, {
                status: 'IN_DISCUSSION',
                telegramChatId: chatId,
                telegramUsername: msg.from?.username || null
              });
            }

            const welcomeMsg = `🌸 <b>Welcome to HOPE Photo & Velo Studio!</b>\n\n` +
              `You have initiated a consultation regarding Booking Inquiry <code>${orderId}</code>.\n\n` +
              `📦 <b>Requested Package:</b> ${order?.packageName || 'Wedding Service'}\n` +
              `📅 <b>Target Date:</b> ${order?.eventDate || 'To be finalized'}\n\n` +
              `Our senior directors are here to assist you with:\n` +
              `• Customizing photo/video deliverables\n` +
              `• Wedding gown, suit & studio wardrobe selection\n` +
              `• Date adjustments & scheduling\n\n` +
              `<i>Feel free to type your questions directly here, or call us at 09 10 52 69 62.</i>`;

            await sendTelegramMessage(chatId, welcomeMsg);

            // Notify Admin of new discussion session
            for (const adminId of ADMIN_CHAT_IDS) {
              if (String(adminId) !== String(chatId)) {
                await sendTelegramMessage(adminId, `💬 <b>NEW CLIENT CONSULTATION INITIATED:</b>\n\nOrder: <code>${orderId}</code>\nClient: ${msg.from?.first_name || 'Client'} (@${msg.from?.username || 'No username'})\nChat ID: <code>${chatId}</code>`);
              }
            }

            return res.status(200).json({ ok: true });
          }

          // Default /start
          await sendTelegramMessage(chatId, `✨ <b>HOPE Photo & Velo Notification Engine</b>\n\nThis bot automatically dispatches instant payment receipts, digital contract verifications, and interactive approval alerts for studio directors.`);
          return res.status(200).json({ ok: true });
        }

        // Admin command: /orders
        if (text === '/orders' && ADMIN_CHAT_IDS.includes(String(chatId))) {
          const orders = db.getOrders().slice(0, 8);
          if (orders.length === 0) {
            await sendTelegramMessage(chatId, '📋 No bookings recorded yet.');
          } else {
            const list = orders.map(o => `• <code>${o.id}</code> — <b>${o.clientName}</b> (${o.status})\n  📅 ${o.eventDate} | 💰 ${(o.totalPrice || 0).toLocaleString()} ETB`).join('\n\n');
            await sendTelegramMessage(chatId, `📋 <b>Recent Bookings:</b>\n\n${list}`);
          }
          return res.status(200).json({ ok: true });
        }
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Telegram webhook error:', err);
      return res.status(200).json({ ok: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
