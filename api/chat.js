// api/chat.js - Live Negotiation & Chat Bridge
import { db, notifyAdmins, sendTelegramMessage } from './_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { order_id } = req.query;
    if (!order_id) return res.status(400).json({ error: 'order_id required' });

    const messages = db.getMessages(order_id);
    const order = db.getOrder(order_id);
    return res.status(200).json({ messages, order });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { order_id, text, sender, senderName, type, data } = body;

      if (!order_id || !text) {
        return res.status(400).json({ error: 'order_id and text required' });
      }

      const message = db.addMessage(order_id, {
        sender: sender || 'client',
        senderName: senderName || 'Client',
        text,
        type: type || 'text',
        data: data || null
      });

      const order = db.getOrder(order_id);

      // If client is asking for a discount or sending a message, ping admins on Telegram
      if (sender !== 'admin') {
        const isDiscountRequest = type === 'discount_request' || text.toLowerCase().includes('discount') || text.toLowerCase().includes('ዋጋ');
        const header = isDiscountRequest 
          ? `🏷️ <b>CLIENT REQUESTED A DISCOUNT!</b>`
          : `💬 <b>NEW CLIENT MESSAGE (Mini App)</b>`;

        const alertText = `${header}\n\n` +
          `🆔 <b>Order:</b> <code>${order_id}</code>\n` +
          `👤 <b>From:</b> ${senderName} ${order?.telegramUsername ? `(@${order.telegramUsername})` : ''}\n` +
          `💬 <i>"${text}"</i>\n\n` +
          `Current Quote: <b>${(order?.negotiatedPrice || order?.totalPrice || 0).toLocaleString()} ETB</b>`;

        await notifyAdmins(alertText, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🏷️ Offer Discount', callback_data: `discount:${order_id}` },
                { text: '💬 Reply to Client', callback_data: `reply:${order_id}` }
              ]
            ]
          }
        });
      } else if (order?.telegramUserId) {
        // If admin sent message from somewhere else, notify client
        await sendTelegramMessage(order.telegramUserId, `💬 <b>HOPE Studio Management:</b>\n\n"${text}"`);
      }

      return res.status(201).json({ success: true, message });
    } catch (e) {
      console.error('Chat error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
