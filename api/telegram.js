// api/telegram.js - Advanced Telegram Bot Webhook & Interactive Command Engine
import { db, sendTelegramMessage, notifyAdmins, BOT_TOKEN, ADMIN_CHAT_IDS } from './_store.js';

const APP_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://hope-photo-velo-jade.vercel.app';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'HOPE Telegram Webhook Service is Active' });
  }

  try {
    const update = req.body;
    if (!update) {
      return res.status(200).json({ ok: true });
    }

    // ── 1. HANDLE INLINE BUTTON CALLBACKS ──
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return res.status(200).json({ ok: true });
    }

    // ── 2. HANDLE MESSAGES & COMMANDS ──
    if (update.message) {
      await handleMessage(update.message);
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Telegram Webhook Handler Error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat?.id ? String(msg.chat.id) : null;
  const text = msg.text?.trim() || '';
  const isAdmin = ADMIN_CHAT_IDS.includes(chatId);
  const fromUser = msg.from || {};

  if (!chatId) return;

  // Check if admin is in active state (e.g. waiting for discount amount or chat reply)
  if (isAdmin) {
    const adminState = db.getAdminState(chatId);
    if (adminState && !text.startsWith('/')) {
      if (adminState.action === 'awaiting_discount') {
        const amount = parseInt(text.replace(/[^0-9]/g, ''), 10);
        if (amount && amount > 0) {
          const order = db.getOrder(adminState.orderId);
          if (order) {
            const original = order.negotiatedPrice || order.totalPrice;
            const newPrice = Math.max(0, original - amount);
            db.updateOrder(order.id, {
              discountAmount: (order.discountAmount || 0) + amount,
              negotiatedPrice: newPrice,
              status: 'discount_offered'
            });

            db.addMessage(order.id, {
              sender: 'admin',
              senderName: fromUser.first_name || 'HOPE Management',
              type: 'discount_offer',
              text: `🎉 Special discount of ${amount.toLocaleString()} ETB approved! New total: ${newPrice.toLocaleString()} ETB.`,
              data: { discountAmount: amount, newPrice }
            });

            db.clearAdminState(chatId);

            await sendTelegramMessage(chatId, `✅ <b>Discount Applied!</b>\nOrder: <code>${order.id}</code>\nDiscount: -${amount.toLocaleString()} ETB\nNew Price: <b>${newPrice.toLocaleString()} ETB</b>\n\nClient notified inside the Mini App!`);
            
            // If client has telegramId, notify them
            if (order.telegramUserId) {
              await sendTelegramMessage(order.telegramUserId, `🎉 <b>HOPE Studio Discount Approved!</b>\n\nA special discount of <b>${amount.toLocaleString()} ETB</b> has been granted for your booking <code>${order.id}</code>!\nNew Total: <b>${newPrice.toLocaleString()} ETB</b>\n\nOpen your Mini App to review and sign the agreement.`, {
                reply_markup: {
                  inline_keyboard: [
                    [{ text: '🚀 Open Mini App', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}` } }]
                  ]
                }
              });
            }
            return;
          }
        }
      } else if (adminState.action === 'awaiting_reply') {
        const order = db.getOrder(adminState.orderId);
        if (order) {
          db.addMessage(order.id, {
            sender: 'admin',
            senderName: fromUser.first_name || 'HOPE Management',
            text: text
          });

          db.clearAdminState(chatId);
          await sendTelegramMessage(chatId, `💬 <b>Message sent to Client</b> (Order <code>${order.id}</code>):\n<i>"${text}"</i>`);

          if (order.telegramUserId) {
            await sendTelegramMessage(order.telegramUserId, `💬 <b>New message from HOPE Studio:</b>\n\n"${text}"`, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: '💬 Open Chat in Mini App', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}&tab=chat` } }]
                ]
              }
            });
          }
          return;
        }
      }
    }
  }

  // ── COMMAND: /start [payload] ──
  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const payload = parts[1] || '';

    let deepLinkText = '';
    let targetUrl = `${APP_URL}?tma=1`;

    if (payload.startsWith('order_')) {
      const orderId = payload.replace('order_', '');
      targetUrl = `${APP_URL}?tma=1&order_id=${orderId}`;
      deepLinkText = `\n\nDirect access to Order <b>${orderId}</b> ready.`;
    } else if (payload.startsWith('sign_')) {
      const orderId = payload.replace('sign_', '');
      targetUrl = `${APP_URL}?tma=1&order_id=${orderId}&tab=agreement`;
      deepLinkText = `\n\nYour digital contract for <b>${orderId}</b> is ready for signature.`;
    } else if (payload.startsWith('chat_')) {
      const orderId = payload.replace('chat_', '');
      targetUrl = `${APP_URL}?tma=1&order_id=${orderId}&tab=chat`;
      deepLinkText = `\n\nChat session for <b>${orderId}</b> opened.`;
    }

    const welcomeMsg = `✨ <b>Welcome to HOPE Photo & Velo!</b>\n` +
      `<i>Moments pass — we make them last forever.</i>\n\n` +
      `Explore our luxury photography & videography packages, customize your event coverage, negotiate live quotes, and sign official service agreements online.${deepLinkText}\n\n` +
      `👇 Tap below to launch the <b>HOPE Studio Mini App</b>:`;

    const keyboard = [
      [
        {
          text: '🚀 Launch HOPE Mini App',
          web_app: { url: targetUrl }
        }
      ],
      [
        { text: '📸 Our Packages', callback_data: 'cmd:packages' },
        { text: '📞 Call Studio', url: 'tel:+251910526962' }
      ]
    ];

    if (isAdmin) {
      keyboard.push([
        { text: '📊 Admin: View Orders', callback_data: 'admin:orders' }
      ]);
    }

    await sendTelegramMessage(chatId, welcomeMsg, {
      reply_markup: { inline_keyboard: keyboard }
    });
    return;
  }

  // ── COMMAND: /orders (Admins only) ──
  if (text === '/orders' && isAdmin) {
    await sendOrdersList(chatId);
    return;
  }

  // ── COMMAND: /discount <order_id> <amount> (Admins only) ──
  if (text.startsWith('/discount') && isAdmin) {
    const [, orderId, amountStr] = text.split(/\s+/);
    if (!orderId || !amountStr) {
      await sendTelegramMessage(chatId, '⚠️ Usage: <code>/discount &lt;order_id&gt; &lt;amount_in_etb&gt;</code>\nExample: <code>/discount HOPE-1024 2000</code>');
      return;
    }

    const amount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    const order = db.getOrder(orderId);
    if (!order) {
      await sendTelegramMessage(chatId, `❌ Order <code>${orderId}</code> not found.`);
      return;
    }

    const currentPrice = order.negotiatedPrice || order.totalPrice;
    const newPrice = Math.max(0, currentPrice - amount);
    db.updateOrder(order.id, {
      discountAmount: (order.discountAmount || 0) + amount,
      negotiatedPrice: newPrice,
      status: 'discount_offered'
    });

    db.addMessage(order.id, {
      sender: 'admin',
      senderName: fromUser.first_name || 'HOPE Management',
      type: 'discount_offer',
      text: `🎉 A discount of ${amount.toLocaleString()} ETB was granted! Final total: ${newPrice.toLocaleString()} ETB.`,
      data: { discountAmount: amount, newPrice }
    });

    await sendTelegramMessage(chatId, `✅ <b>Discount Applied!</b>\nOrder: <code>${order.id}</code>\nDiscount: -${amount.toLocaleString()} ETB\nNew Price: <b>${newPrice.toLocaleString()} ETB</b>`);
    return;
  }

  // ── COMMAND: /reply <order_id> <msg> (Admins only) ──
  if (text.startsWith('/reply') && isAdmin) {
    const parts = text.split(/\s+/);
    const orderId = parts[1];
    const replyText = parts.slice(2).join(' ');

    if (!orderId || !replyText) {
      await sendTelegramMessage(chatId, '⚠️ Usage: <code>/reply &lt;order_id&gt; &lt;message&gt;</code>\nExample: <code>/reply HOPE-1024 We have confirmed your wedding date!</code>');
      return;
    }

    const order = db.getOrder(orderId);
    if (!order) {
      await sendTelegramMessage(chatId, `❌ Order <code>${orderId}</code> not found.`);
      return;
    }

    db.addMessage(order.id, {
      sender: 'admin',
      senderName: fromUser.first_name || 'HOPE Management',
      text: replyText
    });

    await sendTelegramMessage(chatId, `✅ Reply sent to customer on order <code>${order.id}</code>.`);
    return;
  }

  // Default fallback help
  if (isAdmin) {
    await sendTelegramMessage(chatId, `👑 <b>HOPE Studio Admin Commands:</b>\n\n` +
      `• <code>/orders</code> - List all pending and active bookings\n` +
      `• <code>/discount &lt;id&gt; &lt;amount&gt;</code> - Apply discount (e.g. /discount HOPE-1024 2500)\n` +
      `• <code>/reply &lt;id&gt; &lt;message&gt;</code> - Send message to customer in Mini App\n` +
      `• <code>/start</code> - Launch the Mini App in testing mode`);
  } else {
    await sendTelegramMessage(chatId, `✨ Welcome to HOPE Photo & Velo! Tap below to open our Mini App and explore services:`, {
      reply_markup: {
        inline_keyboard: [[{ text: '🚀 Open HOPE Mini App', web_app: { url: `${APP_URL}?tma=1` } }]]
      }
    });
  }
}

async function handleCallbackQuery(cb) {
  const chatId = String(cb.message?.chat?.id);
  const data = cb.data || '';
  const queryId = cb.id;

  // Acknowledge callback immediately
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: queryId })
    });
  } catch (e) {}

  if (data === 'cmd:packages') {
    await sendTelegramMessage(chatId, `📸 <b>HOPE Studio Main Packages:</b>\n\n` +
      `1. <b>Studio Sessions</b> (from 10,000 ETB)\n` +
      `2. <b>Wedding Video Suites</b> (from 45,000 ETB)\n` +
      `3. <b>Luxury Mesk & Special</b> (from 16,000 ETB)\n\n` +
      `Tap below to customize your deliverables and view exact details:`, {
      reply_markup: {
        inline_keyboard: [[{ text: '✨ Open Mini App Customizer', web_app: { url: `${APP_URL}?tma=1` } }]]
      }
    });
    return;
  }

  if (data === 'admin:orders') {
    await sendOrdersList(chatId);
    return;
  }

  if (data.startsWith('discount:')) {
    const orderId = data.replace('discount:', '');
    db.setAdminState(chatId, { action: 'awaiting_discount', orderId });
    await sendTelegramMessage(chatId, `🏷️ <b>Apply Discount for Order <code>${orderId}</code></b>\n\nPlease type the discount amount in ETB to deduct (e.g. <code>2000</code> or <code>3500</code>):`);
    return;
  }

  if (data.startsWith('reply:')) {
    const orderId = data.replace('reply:', '');
    db.setAdminState(chatId, { action: 'awaiting_reply', orderId });
    await sendTelegramMessage(chatId, `💬 <b>Reply to Client (Order <code>${orderId}</code>)</b>\n\nPlease type your message below. It will appear instantly in the client's Mini App chat:`);
    return;
  }

  if (data.startsWith('agree:')) {
    const orderId = data.replace('agree:', '');
    const order = db.getOrder(orderId);
    if (order && order.telegramUserId) {
      await sendTelegramMessage(order.telegramUserId, `📝 <b>HOPE Studio Agreement Ready for Signature!</b>\n\nYour service agreement for order <code>${order.id}</code> is ready. Please tap below to review the contract terms and sign with your e-signature:`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✍️ Sign Agreement in Mini App', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}&tab=agreement` } }]
          ]
        }
      });
      await sendTelegramMessage(chatId, `✅ Agreement signing request dispatched to client for order <code>${orderId}</code>.`);
    } else {
      await sendTelegramMessage(chatId, `ℹ️ Agreement link: <code>${APP_URL}?tma=1&order_id=${orderId}&tab=agreement</code>`);
    }
    return;
  }

  if (data.startsWith('confirm:')) {
    const orderId = data.replace('confirm:', '');
    db.updateOrder(orderId, { status: 'confirmed' });
    await sendTelegramMessage(chatId, `✅ Order <code>${orderId}</code> marked as <b>Confirmed & Deposit Received</b>.`);
    return;
  }
}

async function sendOrdersList(chatId) {
  const orders = db.getOrders();
  if (!orders || orders.length === 0) {
    await sendTelegramMessage(chatId, '📋 No bookings recorded yet.');
    return;
  }

  let text = `📋 <b>HOPE Studio Recent Orders (${orders.length}):</b>\n\n`;
  const buttons = [];

  orders.slice(0, 8).forEach((o, i) => {
    const statusEmoji = o.status === 'confirmed' ? '✅' : o.status === 'signed' ? '📝' : o.status === 'discount_offered' ? '🏷️' : '⏳';
    const finalPrice = o.negotiatedPrice || o.totalPrice || 0;
    text += `${i + 1}. <code>${o.id}</code> ${statusEmoji} <b>${o.clientName || 'Client'}</b>\n` +
      `   📅 ${o.eventDate || 'Date TBD'} • ${o.packageName || 'Custom Package'}\n` +
      `   💰 ${finalPrice.toLocaleString()} ETB (Status: ${o.status})\n\n`;

    buttons.push([
      { text: `🏷️ Discount ${o.id}`, callback_data: `discount:${o.id}` },
      { text: `💬 Chat`, callback_data: `reply:${o.id}` },
      { text: `📝 Sign`, callback_data: `agree:${o.id}` }
    ]);
  });

  await sendTelegramMessage(chatId, text, {
    reply_markup: { inline_keyboard: buttons }
  });
}
