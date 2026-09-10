// api/telegram.js — Full Bi-directional Chat + Agreement System
import { db, BOT_TOKEN, ADMIN_CHAT_IDS, sendTelegramMessage } from './_store.js';

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://hope-photo-velo-jade.vercel.app';

// ── Helper: Is this sender an admin? ──
const isAdmin = (chatId) => ADMIN_CHAT_IDS.includes(String(chatId));

// ── Helper: Forward user message to all admins with reply buttons ──
async function forwardToAdmins(userChatId, userFirstName, username, text, orderId) {
  const userHandle = username ? `@${username}` : userFirstName || 'Client';
  const order = orderId ? db.getOrder(orderId) : null;
  const orderInfo = order
    ? `\n📦 <b>Package:</b> ${order.packageName || 'N/A'}\n📅 <b>Date:</b> ${order.eventDate || 'TBD'}`
    : '';

  const msg = `💬 <b>NEW MESSAGE FROM CLIENT</b>\n\n` +
    `👤 <b>From:</b> ${userHandle}\n` +
    `🆔 <b>Chat ID:</b> <code>${userChatId}</code>${orderInfo}\n\n` +
    `📩 <b>Message:</b>\n${text}\n\n` +
    `<i>Reply from admin panel or use /reply ${userChatId} your_message</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '💬 Open Admin Chat', url: `${APP_URL}#admin-chat-${userChatId}` },
        orderId ? { text: '📋 View Order', url: `${APP_URL}#admin-order-${orderId}` } : null
      ].filter(Boolean),
    ]
  };

  for (const adminId of ADMIN_CHAT_IDS) {
    await sendTelegramMessage(adminId, msg, { reply_markup: inlineKeyboard });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Security Layer 1: Require bot token ──────────────────────────────────
  if (!BOT_TOKEN) {
    return res.status(503).json({ error: 'Service unavailable' });
  }

  // ── Security Layer 2: Admin key for diagnostic GET endpoints ─────────────
  // The ADMIN_API_KEY env var must be set in Vercel. Without it, GET requests
  // return a plain 404 so attackers cannot even confirm this endpoint exists.
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

  if (req.method === 'GET') {
    const providedKey = req.query.key;
    if (!ADMIN_API_KEY || providedKey !== ADMIN_API_KEY) {
      // Return 404 — do NOT hint that this route exists or is protected
      return res.status(404).end();
    }

    const host = req.headers.host || 'hope-photo-velo-jade.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const webhookUrl = `${proto}://${host}/api/telegram`;

    if (req.query.setup === '1') {
      try {
        // Optionally register a webhook secret so Telegram signs its requests
        const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
        const body = { url: webhookUrl, allowed_updates: ['message', 'callback_query'] };
        if (webhookSecret) body.secret_token = webhookSecret;

        const whRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        return res.status(200).json({ success: true, webhookUrl, setupResult: await whRes.json() });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    try {
      const info = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`).then(r => r.json());
      const me = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`).then(r => r.json());
      return res.status(200).json({ ok: true, me, webhookInfo: info, appUrl: APP_URL });
    } catch (e) {
      return res.status(200).json({ ok: true, status: 'Telegram endpoint active' });
    }
  }

  // ── Security Layer 3: POST — Telegram Webhook Secret Validation ──────────
  // If TELEGRAM_WEBHOOK_SECRET is set, every genuine Telegram update carries
  // X-Telegram-Bot-Api-Secret-Token. Requests without / with wrong token are
  // silently acknowledged (200) but ignored — Telegram won't spam-retry and
  // attackers learn nothing about whether validation succeeded.
  if (req.method === 'POST') {
    const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (WEBHOOK_SECRET) {
      const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
      if (incomingSecret !== WEBHOOK_SECRET) {
        console.warn('[SECURITY] Webhook request rejected — invalid or missing secret token.');
        return res.status(200).end(); // silently drop — don't reveal rejection
      }
    }

    try {
      const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!update) return res.status(200).json({ ok: true });

      // ── A. Callback Query (Approve / Reject Buttons) ──
      if (update.callback_query) {
        const cq = update.callback_query;
        const callbackId = cq.id;
        const data = cq.data || '';
        const fromUser = cq.from || {};
        const adminName = fromUser.username ? `@${fromUser.username}` : (fromUser.first_name || 'Studio Director');
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;
        const [action, param] = data.split(':');

        if (action === 'approve' || action === 'reject') {
          const order = db.getOrder(param);
          const newStatus = action === 'approve' ? 'CONFIRMED' : 'NEEDS_INFO';
          if (order) db.updateOrder(param, { status: newStatus, [`${action}edAt`]: new Date().toISOString(), [`${action}edBy`]: adminName });

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callbackId, text: action === 'approve' ? `✅ Order ${param} Approved!` : `⚠️ Order ${param} flagged.`, show_alert: true })
          });

          const updatedCaption = action === 'approve'
            ? `✅ <b>BOOKING CONFIRMED!</b>\n\n🆔 <b>Order:</b> <code>${param}</code>\n👤 <b>Client:</b> ${order?.clientName || 'Client'}\n📅 <b>Date:</b> ${order?.eventDate || 'N/A'}\n\n✨ <i>Approved by ${adminName}</i>`
            : `⚠️ <b>NEEDS INFO</b>\n\n🆔 <b>Order:</b> <code>${param}</code>\nStatus: NEEDS_INFO by ${adminName}`;

          const editMethod = cq.message?.photo ? 'editMessageCaption' : 'editMessageText';
          const editField = cq.message?.photo ? 'caption' : 'text';
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${editMethod}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, message_id: messageId, [editField]: updatedCaption, parse_mode: 'HTML' })
          });
        }

        return res.status(200).json({ ok: true });
      }

      // ── B. Text Messages ──
      if (update.message) {
        const msg = update.message;
        const text = (msg.text || '').trim();
        const chatId = String(msg.chat.id);
        const from = msg.from || {};
        const firstName = from.first_name || 'Client';
        const username = from.username || '';

        // Sync latest state from cloud
        await db.syncFromCloud();

        // Ensure chat record exists
        db.getOrCreateChat(chatId, { first_name: firstName, last_name: from.last_name || '', username });

        // ══ ADMIN COMMANDS ══════════════════════════════════════════════════
        if (isAdmin(chatId)) {

          // /orders — list recent bookings
          if (text === '/orders') {
            const orders = db.getOrders().slice(0, 8);
            if (orders.length === 0) {
              await sendTelegramMessage(chatId, '📋 No bookings recorded yet.');
            } else {
              const list = orders.map(o =>
                `• <code>${o.id}</code> — <b>${o.clientName}</b> (${o.status})\n  📅 ${o.eventDate} | 💰 ${(o.totalPrice || 0).toLocaleString()} ETB`
              ).join('\n\n');
              await sendTelegramMessage(chatId, `📋 <b>Recent Bookings:</b>\n\n${list}`);
            }
            return res.status(200).json({ ok: true });
          }

          // /chats — list all user conversations
          if (text === '/chats') {
            const chats = db.getAllChats().slice(0, 10);
            if (chats.length === 0) {
              await sendTelegramMessage(chatId, '💬 No conversations yet.');
            } else {
              const list = chats.map(c =>
                `• <code>${c.chatId}</code> — <b>${c.firstName} ${c.lastName || ''}</b>${c.username ? ' (@' + c.username + ')' : ''}\n  📩 ${c.lastMessage?.substring(0, 50) || 'No messages'}${c.unreadCount > 0 ? ` 🔴 ${c.unreadCount} unread` : ''}`
              ).join('\n\n');
              await sendTelegramMessage(chatId, `💬 <b>Active Conversations:</b>\n\n${list}\n\n<i>Use /reply &lt;chatId&gt; &lt;message&gt; to respond</i>`);
            }
            return res.status(200).json({ ok: true });
          }

          // /reply <chatId> <message> — reply to a specific user
          if (text.startsWith('/reply ')) {
            const parts = text.split(' ');
            const targetChatId = parts[1];
            const replyText = parts.slice(2).join(' ');
            if (!targetChatId || !replyText) {
              await sendTelegramMessage(chatId, '❌ Usage: /reply &lt;chatId&gt; &lt;message&gt;');
              return res.status(200).json({ ok: true });
            }
            // Store admin reply in DB
            db.addChatMessage(targetChatId, {
              sender: 'admin',
              senderName: 'HOPE Studio Director',
              text: replyText,
              type: 'text'
            });
            await db.syncToCloud();
            // Send via Telegram to client
            await sendTelegramMessage(targetChatId,
              `📸 <b>HOPE Studio — Director Reply</b>\n\n${replyText}\n\n<i>Call us: 09 10 52 69 62</i>`
            );
            await sendTelegramMessage(chatId, `✅ Reply sent to <code>${targetChatId}</code>`);
            return res.status(200).json({ ok: true });
          }

          // /sendlink <chatId> <customAgrId> — send custom agreement signing link to client
          if (text.startsWith('/sendlink ')) {
            const parts = text.split(' ');
            const targetChatId = parts[1];
            const agrId = parts[2];
            if (!targetChatId || !agrId) {
              await sendTelegramMessage(chatId, '❌ Usage: /sendlink &lt;chatId&gt; &lt;agreementId&gt;');
              return res.status(200).json({ ok: true });
            }
            const agr = db.getCustomAgreement(agrId);
            if (!agr) {
              await sendTelegramMessage(chatId, `❌ Agreement <code>${agrId}</code> not found.`);
              return res.status(200).json({ ok: true });
            }
            const signingUrl = `${APP_URL}?sign=${agrId}`;
            const linkMsg = `📜 <b>Your HOPE Studio Service Agreement is Ready!</b>\n\n` +
              `Package: <b>${agr.packageTitle || agr.name}</b>\n` +
              `Total: <b>${(agr.price || 0).toLocaleString()} ETB</b>\n\n` +
              `Please review and sign your agreement:\n👇 <a href="${signingUrl}">Click to Review & Sign Agreement</a>\n\n` +
              `<i>Questions? Reply here or call 09 10 52 69 62</i>`;

            db.addChatMessage(targetChatId, {
              sender: 'admin',
              senderName: 'HOPE Studio Director',
              text: `📜 Agreement link sent: ${signingUrl}`,
              type: 'agreement_link',
              data: { agreementId: agrId, signingUrl }
            });

            await sendTelegramMessage(targetChatId, linkMsg);
            await sendTelegramMessage(chatId, `✅ Agreement link sent to <code>${targetChatId}</code>\n🔗 ${signingUrl}`);
            return res.status(200).json({ ok: true });
          }

          // /chat <chatId> — view chat history
          if (text.startsWith('/chat ')) {
            const targetId = text.split(' ')[1];
            const chat = db.getChat(targetId);
            if (!chat) {
              await sendTelegramMessage(chatId, `❌ Chat <code>${targetId}</code> not found.`);
              return res.status(200).json({ ok: true });
            }
            const msgs = (chat.messages || []).slice(-10);
            if (msgs.length === 0) {
              await sendTelegramMessage(chatId, `💬 No messages in chat <code>${targetId}</code>.`);
            } else {
              const history = msgs.map(m =>
                `[${m.sender === 'admin' ? '🟦 Admin' : '🟩 Client'}] ${m.text?.substring(0, 100) || '—'}`
              ).join('\n');
              await sendTelegramMessage(chatId, `💬 <b>Chat with ${chat.firstName}:</b>\n\n${history}`);
            }
            return res.status(200).json({ ok: true });
          }

          // /help — show admin commands
          if (text === '/help' || text === '/start') {
            await sendTelegramMessage(chatId,
              `🎬 <b>HOPE Studio Admin Bot</b>\n\n` +
              `<b>Available Commands:</b>\n` +
              `/orders — List recent bookings\n` +
              `/chats — List all client conversations\n` +
              `/chat &lt;chatId&gt; — View chat history\n` +
              `/reply &lt;chatId&gt; &lt;message&gt; — Reply to a client\n` +
              `/sendlink &lt;chatId&gt; &lt;agrId&gt; — Send agreement signing link\n\n` +
              `<i>Tip: Use the Admin Panel at ${APP_URL} for full management.</i>`
            );
            return res.status(200).json({ ok: true });
          }

          // Admin plain message — check if there's a stored "reply target" state
          const adminState = db.getAdminState(chatId);
          if (adminState?.replyTarget && text && !text.startsWith('/')) {
            const targetChatId = adminState.replyTarget;
            db.addChatMessage(targetChatId, {
              sender: 'admin',
              senderName: 'HOPE Studio Director',
              text,
              type: 'text'
            });
            await sendTelegramMessage(targetChatId,
              `📸 <b>HOPE Studio — Director Reply</b>\n\n${text}\n\n<i>Call us: 09 10 52 69 62</i>`
            );
            await sendTelegramMessage(chatId, `✅ Replied to <code>${targetChatId}</code>`);
            return res.status(200).json({ ok: true });
          }

        // ══ USER / CLIENT MESSAGES ═══════════════════════════════════════════
        } else {
          // /start command
          if (text.startsWith('/start')) {
            const parts = text.split(' ');
            const param = parts[1] || '';

            // /start discuss_ORDERID — from booking flow "Talk to Director" button
            if (param.startsWith('discuss_')) {
              const orderId = param.replace('discuss_', '');
              const order = db.getOrder(orderId);
              if (order) {
                db.updateOrder(orderId, {
                  status: 'IN_DISCUSSION',
                  telegramChatId: chatId,
                  telegramUsername: from.username || null,
                  telegramUserId: chatId
                });
                db.linkChatToOrder(chatId, orderId);
              }
              db.addChatMessage(chatId, {
                sender: 'system',
                senderName: 'HOPE System',
                text: `Client started discussion for Order ${orderId}`,
                type: 'consultation_start'
              });
              await db.syncToCloud();
              const welcomeMsg = `🌸 <b>Welcome to HOPE Photo & Velo Studio!</b>\n\n` +
                `You have initiated a consultation regarding Booking <code>${orderId}</code>.\n\n` +
                `📦 <b>Package:</b> ${order?.packageName || 'Wedding Service'}\n` +
                `📅 <b>Target Date:</b> ${order?.eventDate || 'To be finalized'}\n\n` +
                `Feel free to type your questions directly here. Our directors will reply shortly.\n\n` +
                `<i>📞 You can also call us: 09 10 52 69 62</i>`;
              await sendTelegramMessage(chatId, welcomeMsg);
              for (const adminId of ADMIN_CHAT_IDS) {
                await sendTelegramMessage(adminId,
                  `💬 <b>NEW CLIENT CONSULTATION:</b>\n\nOrder: <code>${orderId}</code>\nClient: ${firstName} ${from.last_name || ''} (@${username || 'no username'})\nChat ID: <code>${chatId}</code>\nPackage: ${order?.packageName || 'N/A'}\n\n<i>Use /reply ${chatId} &lt;message&gt; to respond</i>`
                );
              }
              return res.status(200).json({ ok: true });
            }

            // /start sign_AGRID — user arrived from agreement signing link
            if (param.startsWith('sign_')) {
              const agrId = param.replace('sign_', '');
              const signingUrl = `${APP_URL}?sign=${agrId}`;
              await sendTelegramMessage(chatId,
                `📜 <b>HOPE Studio Agreement</b>\n\nOpen the link below to review and sign your service agreement:\n\n👇 <a href="${signingUrl}">Sign Agreement</a>\n\n<i>Call us: 09 10 52 69 62</i>`
              );
              return res.status(200).json({ ok: true });
            }

            // Default /start
            db.addChatMessage(chatId, {
              sender: 'client',
              senderName: firstName,
              text: '/start',
              type: 'text'
            });
            await db.syncToCloud();
            await sendTelegramMessage(chatId,
              `🌸 <b>HOPE Photo & Velo Studio</b>\n\n` +
              `📍 Tigat Building, Hayahulet, Addis Ababa\n` +
              `📞 09 10 52 69 62\n\n` +
              `You can:\n` +
              `• Type any message to chat with our directors\n` +
              `• Book online at: ${APP_URL}\n\n` +
              `/help — see available options`
            );
            return res.status(200).json({ ok: true });
          }

          // /help — show user options
          if (text === '/help') {
            await sendTelegramMessage(chatId,
              `🌸 <b>HOPE Studio Options</b>\n\n` +
              `• Type any question to chat with us\n` +
              `• 📅 Book online: ${APP_URL}\n` +
              `• 📞 Call: 09 10 52 69 62\n\n` +
              `<i>Our directors reply within minutes.</i>`
            );
            return res.status(200).json({ ok: true });
          }

          // Any other text — save as chat message + forward to admins
          if (text) {
            const chat = db.getChat(chatId);
            const orderId = chat?.orderId || null;

            db.addChatMessage(chatId, {
              sender: 'client',
              senderName: firstName,
              text,
              type: 'text'
            });

            if (orderId) {
              db.addMessage(orderId, {
                sender: 'client',
                senderName: firstName,
                text,
                type: 'text'
              });
            }

            await db.syncToCloud();

            await forwardToAdmins(chatId, firstName, username, text, orderId);
            await sendTelegramMessage(chatId,
              `✅ Message received! Our directors will reply shortly.\n📞 Or call: 09 10 52 69 62`
            );
          }
        }

        return res.status(200).json({ ok: true });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Telegram webhook error:', err);
      return res.status(200).json({ ok: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
