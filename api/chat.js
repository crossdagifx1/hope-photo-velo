// api/chat.js — Live Chat Bridge: Admin Panel ↔ Telegram Bot ↔ Clients
import { db, notifyAdmins, sendTelegramMessage } from './_store.js';

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://hope-photo-velo-jade.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: List chats / fetch specific chat or order ──
  if (req.method === 'GET') {
    const { list, action, chat_id, order_id, mark_read } = req.query;

    await db.syncFromCloud();

    if (list === '1' || action === 'list_chats') {
      return res.status(200).json({ chats: db.getAllChats() });
    }

    if (chat_id) {
      if (mark_read === '1') {
        db.markChatRead(chat_id);
        await db.syncToCloud();
      }
      const chat = db.getChat(chat_id) || db.getOrCreateChat(chat_id);
      const linkedOrder = chat.orderId ? db.getOrder(chat.orderId) : null;
      return res.status(200).json({ chat, order: linkedOrder, messages: chat.messages || [] });
    }

    if (order_id) {
      return res.status(200).json({ messages: db.getMessages(order_id), order: db.getOrder(order_id) });
    }

    return res.status(400).json({ error: 'chat_id, order_id, or list=1 required' });
  }

  // ── POST: Send messages, admin replies, agreement links ──
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, text, sender, senderName, type, data } = body;
      const targetChatId = body.chat_id || body.chatId;
      const targetOrderId = body.order_id || body.orderId;

      // ── ACTION: Admin sends reply to client (via Telegram + stored in DB) ──
      if (action === 'admin_reply') {
        if (!text || !targetChatId) return res.status(400).json({ error: 'text and chat_id required' });

        await db.syncFromCloud();

        // Store in DB
        const message = db.addChatMessage(String(targetChatId), {
          sender: 'admin',
          senderName: senderName || 'HOPE Studio Director',
          text,
          type: type || 'text',
          data: data || null
        });

        // Also store in order messages if linked
        const chat = db.getChat(String(targetChatId));
        if (chat?.orderId) {
          db.addMessage(chat.orderId, {
            sender: 'admin',
            senderName: senderName || 'HOPE Studio Director',
            text,
            type: type || 'text',
            data: data || null
          });
        }

        await db.syncToCloud();

        // Deliver via Telegram to the client
        await sendTelegramMessage(String(targetChatId),
          `📸 <b>HOPE Studio — Director Reply</b>\n\n${text}\n\n<i>📞 09 10 52 69 62</i>`
        );

        return res.status(201).json({ success: true, message, delivered: true });
      }

      // ── ACTION: Send custom agreement link to client via Telegram ──
      if (action === 'send_agreement_link') {
        const { agreementId } = body;
        if (!targetChatId || !agreementId) return res.status(400).json({ error: 'chat_id and agreementId required' });

        const agr = db.getCustomAgreement(agreementId);
        if (!agr) return res.status(404).json({ error: 'Custom agreement not found' });

        const signingUrl = `${APP_URL}?sign=${agreementId}`;
        const linkMsg = `📜 <b>Your HOPE Studio Service Agreement is Ready!</b>\n\n` +
          `Package: <b>${agr.packageTitle || agr.name}</b>\n` +
          `Total: <b>${(agr.price || 0).toLocaleString()} ETB</b>\n\n` +
          `Please review and sign your agreement:\n` +
          `👇 <a href="${signingUrl}">Click to Review & Sign Agreement</a>\n\n` +
          `<i>Questions? Reply here or call 09 10 52 69 62</i>`;

        const message = db.addChatMessage(String(targetChatId), {
          sender: 'admin',
          senderName: 'HOPE Studio Director',
          text: `📜 Agreement link sent: ${signingUrl}`,
          type: 'agreement_link',
          data: { agreementId, signingUrl }
        });

        await sendTelegramMessage(String(targetChatId), linkMsg);

        return res.status(201).json({ success: true, message, signingUrl });
      }

      // ── ACTION: Default — store message (client or admin, no Telegram delivery) ──
      if (!text || (!targetChatId && !targetOrderId)) {
        return res.status(400).json({ error: 'text and (chat_id or order_id) required' });
      }

      let message = null;
      let effectiveChatId = targetChatId;
      let order = targetOrderId ? db.getOrder(targetOrderId) : null;

      if (!effectiveChatId && order?.telegramUserId) {
        effectiveChatId = String(order.telegramUserId);
      }

      if (effectiveChatId) {
        message = db.addChatMessage(effectiveChatId, {
          sender: sender || 'client',
          senderName: senderName || (sender === 'admin' ? 'HOPE Studio Director' : 'Client'),
          text,
          type: type || 'text',
          data: data || null
        });
      }

      if (targetOrderId) {
        const orderMsg = db.addMessage(targetOrderId, {
          sender: sender || 'client',
          senderName: senderName || (sender === 'admin' ? 'HOPE Studio Director' : 'Client'),
          text,
          type: type || 'text',
          data: data || null
        });
        if (!message) message = orderMsg;
      }

      // If it's an admin message to a chat, also deliver via Telegram
      if (sender === 'admin' && effectiveChatId) {
        await sendTelegramMessage(String(effectiveChatId),
          `📸 <b>HOPE Studio — Director</b>\n\n${text}\n\n<i>📞 09 10 52 69 62</i>`
        );
      }

      return res.status(201).json({ success: true, message });
    } catch (e) {
      console.error('Chat error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
