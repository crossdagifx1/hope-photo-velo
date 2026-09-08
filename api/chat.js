// api/chat.js - Live Telegram Bot Negotiation & Mini App Chat Bridge
import { db, notifyAdmins, sendTelegramMessage } from './_store.js';

const APP_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://hope-photo-velo-jade.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── GET: LIST CHATS OR FETCH SPECIFIC CHAT / ORDER ──
  if (req.method === 'GET') {
    const { list, action, chat_id, order_id, mark_read } = req.query;

    // 1. List all active conversations that talked to the bot
    if (list === '1' || action === 'list_chats') {
      const chats = db.getAllChats();
      return res.status(200).json({ chats });
    }

    // 2. Fetch specific chat by chatId
    if (chat_id) {
      if (mark_read === '1') {
        db.markChatRead(chat_id);
      }
      const chat = db.getChat(chat_id) || db.getOrCreateChat(chat_id);
      let linkedOrder = null;
      if (chat.orderId) {
        linkedOrder = db.getOrder(chat.orderId);
      }
      return res.status(200).json({
        chat,
        order: linkedOrder,
        messages: chat.messages || []
      });
    }

    // 3. Fetch specific order chat
    if (order_id) {
      const messages = db.getMessages(order_id);
      const order = db.getOrder(order_id);
      return res.status(200).json({ messages, order });
    }

    return res.status(400).json({ error: 'chat_id, order_id, or list=1 required' });
  }

  // ── POST: SEND MESSAGE (ADMIN OR CLIENT) ──
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const targetChatId = body.chat_id || body.chatId;
      const targetOrderId = body.order_id || body.orderId;
      const { text, sender, senderName, type, data } = body;

      if (!text || (!targetChatId && !targetOrderId)) {
        return res.status(400).json({ error: 'text and (chat_id or order_id) required' });
      }

      let message = null;
      let effectiveChatId = targetChatId;
      let order = targetOrderId ? db.getOrder(targetOrderId) : null;

      if (!effectiveChatId && order?.telegramUserId) {
        effectiveChatId = String(order.telegramUserId);
      }

      // Record message in Chat Store if chatId is known
      if (effectiveChatId) {
        message = db.addChatMessage(effectiveChatId, {
          sender: sender || 'client',
          senderName: senderName || (sender === 'admin' ? 'HOPE Studio Director' : 'Client'),
          text,
          type: type || 'text',
          data: data || null
        });

        if (targetOrderId && !order) {
          order = db.getOrder(targetOrderId);
        }
      }

      // Record in Order Store if orderId is provided
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

      return res.status(201).json({ success: true, message });
    } catch (e) {
      console.error('Chat error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

