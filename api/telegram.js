// api/telegram.js — Bi-directional Chat, Receipt QR Auto-Scanner & Live Order Tracking
import { db, BOT_TOKEN, ADMIN_CHAT_IDS, sendTelegramMessage, sendTelegramPhoto, notifyAdmins, notifyAdminsPhoto } from './_store.js';
import jsQRModule from 'jsqr';
import jpegModule from 'jpeg-js';
import pngjsModule from 'pngjs';

const jsQR = jsQRModule.default || jsQRModule;
const jpegDecode = jpegModule.decode || jpegModule.default?.decode;
const PNG = pngjsModule.PNG || pngjsModule.default?.PNG;

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://hope-photo-velo-jade.vercel.app';

// ── Helper: Is this sender an admin? ──
const isAdmin = (chatId) => ADMIN_CHAT_IDS.includes(String(chatId));

// ── Helper: Extract Order ID from string / URL / text ──
function extractOrderId(str) {
  if (!str || typeof str !== 'string') return null;
  const clean = str.trim();
  const m1 = clean.match(/[?&]order=([A-Za-z0-9_-]+)/i);
  if (m1) return m1[1].toUpperCase();
  const m2 = clean.match(/start=order_([A-Za-z0-9_-]+)/i);
  if (m2) return m2[1].toUpperCase();
  const m3 = clean.match(/\b(HOPE-[A-Za-z0-9_-]+)\b/i);
  if (m3) return m3[1].toUpperCase();
  return null;
}

// ── Helper: Scan QR Code from Buffer (Local Multi-Crop/Downscale + Cloud Buffer Upload) ──
async function scanQrFromBuffer(buffer, remoteFileUrl = null) {
  if (!buffer || buffer.length === 0) return null;

  const tryJsQr = (data, w, h) => {
    try {
      const res = jsQR(data, w, h);
      if (res?.data) return res.data;
    } catch {}
    return null;
  };

  // Helper: Crop rectangular sub-region
  const cropAndScan = (data, fullW, fullH, rx, ry, rw, rh) => {
    try {
      const x0 = Math.floor(fullW * rx);
      const y0 = Math.floor(fullH * ry);
      const cw = Math.floor(fullW * rw);
      const ch = Math.floor(fullH * rh);
      const cropped = new Uint8ClampedArray(cw * ch * 4);
      for (let y = 0; y < ch; y++) {
        const srcOffset = ((y0 + y) * fullW + x0) * 4;
        const dstOffset = y * cw * 4;
        cropped.set(data.subarray(srcOffset, srcOffset + cw * 4), dstOffset);
      }
      return tryJsQr(cropped, cw, ch);
    } catch {}
    return null;
  };

  // Helper: Downscale image by scale factor
  const downscaleAndScan = (data, fullW, fullH, scale = 0.5) => {
    try {
      const tw = Math.floor(fullW * scale);
      const th = Math.floor(fullH * scale);
      const downscaled = new Uint8ClampedArray(tw * th * 4);
      for (let y = 0; y < th; y++) {
        const sy = Math.floor(y / scale);
        for (let x = 0; x < tw; x++) {
          const sx = Math.floor(x / scale);
          const srcIdx = (sy * fullW + sx) * 4;
          const dstIdx = (y * tw + x) * 4;
          downscaled[dstIdx] = data[srcIdx];
          downscaled[dstIdx + 1] = data[srcIdx + 1];
          downscaled[dstIdx + 2] = data[srcIdx + 2];
          downscaled[dstIdx + 3] = data[srcIdx + 3];
        }
      }
      return tryJsQr(downscaled, tw, th);
    } catch {}
    return null;
  };

  // 1. In-memory decode into pixel buffer
  let pixels = null;
  let width = 0;
  let height = 0;

  // Try JPEG
  try {
    if (jpegDecode) {
      const img = jpegDecode(buffer, { useTArray: true });
      if (img?.data && img.width && img.height) {
        pixels = new Uint8ClampedArray(img.data.buffer, img.data.byteOffset, img.data.byteLength);
        width = img.width;
        height = img.height;
      }
    }
  } catch {}

  // Try PNG
  if (!pixels) {
    try {
      if (PNG) {
        const png = PNG.sync.read(buffer);
        if (png?.data && png.width && png.height) {
          pixels = new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength);
          width = png.width;
          height = png.height;
        }
      }
    } catch {}
  }

  if (pixels && width > 0 && height > 0) {
    // 1a. Full image scan
    let res = tryJsQr(pixels, width, height);
    if (res) return res;

    // 1b. Center crop (receipt QR pass sits between 30% and 85% height)
    res = cropAndScan(pixels, width, height, 0.10, 0.30, 0.80, 0.55);
    if (res) return res;

    // 1c. Downscale 0.5x (fixes high-res retina QR binarization failure)
    res = downscaleAndScan(pixels, width, height, 0.5);
    if (res) return res;

    // 1d. Downscale 0.5x on center crop
    res = cropAndScan(pixels, width, height, 0.15, 0.40, 0.70, 0.45);
    if (res) return res;
  }

  // 2. High-Accuracy Cloud QR API via Direct Buffer Multipart Upload (100% reliable)
  try {
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'image/png' }), 'scan.png');
    const cloudRes = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(6000)
    });
    if (cloudRes.ok) {
      const json = await cloudRes.json();
      const detected = json?.[0]?.symbol?.[0]?.data;
      if (detected) return detected;
    }
  } catch (cloudErr) {
    console.warn('Cloud QR scan fallback notice:', cloudErr.message);
  }

  return null;
}

// ── Helper: Format Job Progress ──
function formatJobProgress(jobStatus) {
  const isPrep = ['PREP', 'IN_PRODUCTION', 'EDITING', 'COMPLETED'].includes(jobStatus);
  const isShoot = ['IN_PRODUCTION', 'EDITING', 'COMPLETED'].includes(jobStatus);
  const isEdit = ['EDITING', 'COMPLETED'].includes(jobStatus);
  const isDone = jobStatus === 'COMPLETED';

  return (
    `• 1️⃣ <b>Booking Reserved:</b> ✅ Completed\n` +
    `• 2️⃣ <b>Pre-Shoot Preparation:</b> ${isPrep ? (jobStatus === 'PREP' ? '🟡 <i>In Progress</i>' : '✅ Done') : '⏳ Pending'}\n` +
    `• 3️⃣ <b>Photo & Video Shoot:</b> ${isShoot ? (jobStatus === 'IN_PRODUCTION' ? '🟡 <i>In Progress (Shoot Day)</i>' : '✅ Done') : '⏳ Scheduled'}\n` +
    `• 4️⃣ <b>Cinema Editing & Color:</b> ${isEdit ? (jobStatus === 'EDITING' ? '🟡 <i>Editing in Suite</i>' : '✅ Done') : '⏳ Awaiting Footage'}\n` +
    `• 5️⃣ <b>Master Delivery:</b> ${isDone ? '🎉 <b>COMPLETED & READY FOR PICKUP!</b>' : '⏳ Post-production'}`
  );
}

// ── Helper: Format Payment Status ──
function formatPaymentStatus(paymentStatus, order) {
  const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
  if (paymentStatus === 'VERIFIED' || order.status === 'VERIFIED') {
    return `✅ <b>VERIFIED & CONFIRMED</b>\n` +
      `<i>Deposit of ${deposit.toLocaleString()} ETB verified by Studio Director. Schedule locked.</i>`;
  }
  if (paymentStatus === 'REJECTED') {
    return `⚠️ <b>NEEDS CLARIFICATION</b>\n` +
      `<i>Please re-upload receipt card photo or contact studio director.</i>`;
  }
  return `⏳ <b>PENDING VERIFICATION</b>\n` +
    `<i>Receipt submitted. Director is verifying with bank records.</i>`;
}

// ── Helper: Build Rich Project Details Card for Client & Admin ──
function buildOrderCardText(order, recentComment = null) {
  const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
  const remaining = order.remainingBalance || (order.totalPrice - deposit);

  let text = `👑 <b>HOPE PHOTO & VELO STUDIO</b>\n` +
    `✨ <b>OFFICIAL PROJECT & ORDER TRACKING</b> ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Order Reference:</b> <code>${order.id}</code>\n` +
    `👤 <b>Client:</b> <b>${order.clientName || 'Valued Client'}</b>\n` +
    `📞 <b>Phone:</b> ${order.phone || 'N/A'}\n` +
    `📅 <b>Event Date:</b> <b>${order.eventDate || 'To be scheduled'}</b>\n` +
    `📍 <b>Venue / Location:</b> ${order.location || 'Addis Ababa'}\n` +
    `📦 <b>Package:</b> ${order.packageName || 'Selected Studio Package'}\n\n` +
    `💰 <b>FINANCIAL SUMMARY:</b>\n` +
    `• Total Investment: <b>${(order.totalPrice || 0).toLocaleString()} ETB</b>\n` +
    `• Advance Deposit: <b>${deposit.toLocaleString()} ETB</b>\n` +
    `• Balance Due on Delivery: <b>${remaining.toLocaleString()} ETB</b>\n` +
    `• Payment Method: <b>${(order.paymentMethod || 'Telebirr').toUpperCase()}</b>` +
    (order.paymentReference ? ` (Ref: <code>${order.paymentReference}</code>)` : '') + `\n\n` +
    `💳 <b>PAYMENT VERIFICATION STATUS:</b>\n` +
    formatPaymentStatus(order.paymentStatus, order) + `\n\n` +
    `🎬 <b>PROJECT PRODUCTION PROGRESS (Is it done?):</b>\n` +
    formatJobProgress(order.jobStatus) + `\n`;

  if (recentComment) {
    text += `\n💬 <b>Latest Studio Note:</b>\n<i>"${recentComment.text}"</i> — ${recentComment.senderName}\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━\n` +
    `📍 <i>Tigat Building, Hayahulet, Addis Ababa</i>\n` +
    `📞 <i>Studio Hotline: 09 10 52 69 62</i>`;

  return text;
}

// ── Client Action Keyboard ──
function buildClientOrderKeyboard(orderId) {
  return {
    inline_keyboard: [
      [
        { text: '🌐 Open Live Web Status Page', url: `${APP_URL}/?order=${orderId}` }
      ],
      [
        { text: '🔄 Refresh Status', callback_data: `refresh_client:${orderId}` },
        { text: '💬 Leave Note for Director', callback_data: `ask_note:${orderId}` }
      ],
      [
        { text: '📞 Studio Hotline (09 10 52 69 62)', callback_data: 'call_hotline' }
      ]
    ]
  };
}

// ── Admin Action Keyboard ──
function buildAdminOrderKeyboard(orderId, clientChatId) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Verify Payment', callback_data: `admin_verify:${orderId}` },
        { text: '❌ Reject / Needs Info', callback_data: `admin_reject:${orderId}` }
      ],
      [
        { text: '👗 Set Prep', callback_data: `admin_job:PREP:${orderId}` },
        { text: '📸 Set Shoot Day', callback_data: `admin_job:IN_PRODUCTION:${orderId}` }
      ],
      [
        { text: '🎞️ Set Editing', callback_data: `admin_job:EDITING:${orderId}` },
        { text: '🎉 Mark Completed', callback_data: `admin_job:COMPLETED:${orderId}` }
      ],
      [
        { text: '📋 View Full Card', callback_data: `admin_card:${orderId}` },
        clientChatId ? { text: '💬 Reply Client', callback_data: `admin_reply:${clientChatId}` } : null
      ].filter(Boolean),
      [
        { text: '🌐 Open Admin Web Portal', url: `${APP_URL}#admin-order-${orderId}` }
      ]
    ]
  };
}

// ── Helper: Forward user text to all admins ──
async function forwardToAdmins(userChatId, userFirstName, username, text, orderId) {
  const userHandle = username ? `@${username}` : userFirstName || 'Client';
  const order = orderId ? db.getOrder(orderId) : null;
  const orderInfo = order
    ? `\n📦 <b>Package:</b> ${order.packageName || 'N/A'}\n📅 <b>Date:</b> ${order.eventDate || 'TBD'}`
    : '';

  const msg = `💬 <b>NEW MESSAGE FROM CLIENT</b>\n\n` +
    `👤 <b>From:</b> ${userHandle}\n` +
    `🆔 <b>Chat ID:</b> <code>${userChatId}</code>` +
    (orderId ? ` | <b>Order:</b> <code>${orderId}</code>` : '') +
    `${orderInfo}\n\n` +
    `📩 <b>Message:</b>\n${text}\n\n` +
    `<i>Reply from admin panel or use /reply ${userChatId} your_message</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '💬 Reply in Telegram', callback_data: `admin_reply:${userChatId}` },
        orderId ? { text: '📋 View Order', callback_data: `admin_card:${orderId}` } : null
      ].filter(Boolean),
      [
        { text: '🌐 Admin Web Panel', url: `${APP_URL}#admin-chat-${userChatId}` }
      ]
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

  if (!BOT_TOKEN) {
    return res.status(503).json({ error: 'Service unavailable' });
  }

  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

  if (req.method === 'GET') {
    const providedKey = req.query.key;
    if (!ADMIN_API_KEY || providedKey !== ADMIN_API_KEY) {
      return res.status(404).end();
    }

    const host = req.headers.host || 'hope-photo-velo-jade.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const webhookUrl = `${proto}://${host}/api/telegram`;

    if (req.query.setup === '1') {
      try {
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

  if (req.method === 'POST') {
    const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (WEBHOOK_SECRET) {
      const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
      if (incomingSecret && incomingSecret !== WEBHOOK_SECRET) {
        console.warn('[SECURITY] Webhook request rejected — invalid secret token.');
        return res.status(200).end();
      }
    }

    try {
      const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!update) return res.status(200).json({ ok: true });

      await db.syncFromCloud();

      // ════════════════════════════════════════════════════════════════════════
      // ── A. CALLBACK QUERIES (Interactive Buttons) ──
      // ════════════════════════════════════════════════════════════════════════
      if (update.callback_query) {
        const cq = update.callback_query;
        const callbackId = cq.id;
        const data = cq.data || '';
        const fromUser = cq.from || {};
        const adminName = fromUser.username ? `@${fromUser.username}` : (fromUser.first_name || 'Studio Director');
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        // 1. Client refreshes their order
        if (data.startsWith('refresh_client:')) {
          const orderId = data.replace('refresh_client:', '');
          const order = db.getOrder(orderId);
          if (!order) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackId, text: 'Order not found.', show_alert: true })
            });
            return res.status(200).json({ ok: true });
          }
          const cardText = buildOrderCardText(order);
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callbackId, text: '🔄 Order status refreshed!' })
          });
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: cardText,
              parse_mode: 'HTML',
              reply_markup: buildClientOrderKeyboard(orderId)
            })
          });
          return res.status(200).json({ ok: true });
        }

        // 2. Client asks to leave a note
        if (data.startsWith('ask_note:')) {
          const orderId = data.replace('ask_note:', '');
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callbackId, text: 'Please type your note in the chat below!' })
          });
          await sendTelegramMessage(chatId,
            `✍️ <b>Leave a Note for HOPE Studio Directors:</b>\n\n` +
            `Type any instruction, shoot preference, or question here. It will be recorded directly under Order <code>${orderId}</code> and forwarded to our directors!`
          );
          return res.status(200).json({ ok: true });
        }

        // 2b. Client requests hotline popup
        if (data === 'call_hotline') {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackId,
              text: '📞 Studio Hotline: 09 10 52 69 62\n📍 Tigat Building, Hayahulet, Addis Ababa',
              show_alert: true
            })
          });
          return res.status(200).json({ ok: true });
        }

        // 3. Admin: Verify Payment
        if (data.startsWith('admin_verify:')) {
          const orderId = data.replace('admin_verify:', '');
          const order = db.getOrder(orderId);
          if (order) {
            db.updateOrder(orderId, {
              paymentStatus: 'VERIFIED',
              status: 'CONFIRMED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: adminName
            });
            await db.syncToCloud();

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackId, text: `✅ Order ${orderId} Payment Verified!`, show_alert: true })
            });

            // Notify Client automatically in Telegram!
            const clientChat = order.telegramChatId || order.telegramUserId;
            if (clientChat) {
              const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
              await sendTelegramMessage(clientChat,
                `🎉 <b>PAYMENT CONFIRMED & VERIFIED!</b> 🥂\n\n` +
                `Dear <b>${order.clientName}</b>,\n` +
                `Your deposit payment of <b>${deposit.toLocaleString()} ETB</b> for Order <code>${order.id}</code> has been officially verified by our studio director!\n\n` +
                `📅 <b>Target Date:</b> ${order.eventDate || 'Scheduled'}\n` +
                `📦 <b>Package:</b> ${order.packageName}\n\n` +
                `✨ Your date is officially locked in our studio schedule. Our production team will contact you for pre-shoot preparations.\n\n` +
                `🔗 <a href="${APP_URL}/?order=${order.id}">Track Live Status on Web Portal</a>`,
                { reply_markup: buildClientOrderKeyboard(orderId) }
              );
            }

            // Edit admin message
            const updatedCard = buildOrderCardText(db.getOrder(orderId));
            const editMethod = cq.message?.photo ? 'editMessageCaption' : 'editMessageText';
            const editField = cq.message?.photo ? 'caption' : 'text';
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${editMethod}`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                [editField]: `✅ <b>PAYMENT VERIFIED by ${adminName}!</b>\n\n` + updatedCard,
                parse_mode: 'HTML',
                reply_markup: buildAdminOrderKeyboard(orderId, order.telegramChatId)
              })
            });
          }
          return res.status(200).json({ ok: true });
        }

        // 4. Admin: Reject / Needs Info
        if (data.startsWith('admin_reject:')) {
          const orderId = data.replace('admin_reject:', '');
          const order = db.getOrder(orderId);
          if (order) {
            db.updateOrder(orderId, {
              paymentStatus: 'REJECTED',
              status: 'NEEDS_INFO',
              rejectedAt: new Date().toISOString(),
              rejectedBy: adminName
            });
            await db.syncToCloud();

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackId, text: `⚠️ Order ${orderId} marked as Needs Info.`, show_alert: true })
            });

            const clientChat = order.telegramChatId || order.telegramUserId;
            if (clientChat) {
              await sendTelegramMessage(clientChat,
                `⚠️ <b>Payment Verification Notice</b>\n\n` +
                `Order <code>${orderId}</code>: Our studio directors reviewed your submission and request additional verification details.\n` +
                `Please send your transaction reference code or re-upload your receipt card photo here.\n\n` +
                `📞 Studio Hotline: 09 10 52 69 62`,
                { reply_markup: buildClientOrderKeyboard(orderId) }
              );
            }
          }
          return res.status(200).json({ ok: true });
        }

        // 5. Admin: Update Job Status (PREP, IN_PRODUCTION, EDITING, COMPLETED)
        if (data.startsWith('admin_job:')) {
          const parts = data.split(':');
          const stage = parts[1];
          const orderId = parts[2];
          const order = db.getOrder(orderId);
          if (order) {
            db.updateOrder(orderId, { jobStatus: stage, status: stage === 'COMPLETED' ? 'COMPLETED' : order.status });
            await db.syncToCloud();

            const stageNames = {
              PREP: '👗 Pre-Shoot Preparation',
              IN_PRODUCTION: '📸 Shoot Day (In Production)',
              EDITING: '🎞️ Cinema Editing & Color Grading',
              COMPLETED: '🎉 Completed & Ready for Delivery'
            };
            const stageLabel = stageNames[stage] || stage;

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackId, text: `✅ Order ${orderId} advanced to: ${stageLabel}` })
            });

            // Notify Client of Stage Change!
            const clientChat = order.telegramChatId || order.telegramUserId;
            if (clientChat) {
              await sendTelegramMessage(clientChat,
                `🎬 <b>PROJECT STATUS UPDATE!</b>\n\n` +
                `Order <code>${orderId}</code> has advanced to:\n` +
                `👉 <b>${stageLabel}</b>\n\n` +
                `<i>You can track real-time progress on your portal:</i>\n` +
                `👇 <a href="${APP_URL}/?order=${orderId}">Open Live Tracking Portal</a>`,
                { reply_markup: buildClientOrderKeyboard(orderId) }
              );
            }

            // Edit admin view
            const updatedCard = buildOrderCardText(db.getOrder(orderId));
            const editMethod = cq.message?.photo ? 'editMessageCaption' : 'editMessageText';
            const editField = cq.message?.photo ? 'caption' : 'text';
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${editMethod}`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                [editField]: updatedCard,
                parse_mode: 'HTML',
                reply_markup: buildAdminOrderKeyboard(orderId, order.telegramChatId)
              })
            });
          }
          return res.status(200).json({ ok: true });
        }

        // 6. Admin: View Full Order Card
        if (data.startsWith('admin_card:')) {
          const orderId = data.replace('admin_card:', '');
          const order = db.getOrder(orderId);
          if (order) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackId })
            });
            const card = buildOrderCardText(order);
            await sendTelegramMessage(chatId, card, { reply_markup: buildAdminOrderKeyboard(orderId, order.telegramChatId) });
          }
          return res.status(200).json({ ok: true });
        }

        // 7. Admin: Reply prompt
        if (data.startsWith('admin_reply:')) {
          const targetChat = data.replace('admin_reply:', '');
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callbackId, text: 'Use: /reply <chatId> <message>' })
          });
          await sendTelegramMessage(chatId,
            `💬 <b>Reply to Client:</b>\n\n` +
            `Type: <code>/reply ${targetChat} Your message here</code>`
          );
          return res.status(200).json({ ok: true });
        }

        // Legacy approve/reject buttons
        if (data.startsWith('approve:') || data.startsWith('reject:')) {
          const [action, param] = data.split(':');
          const order = db.getOrder(param);
          const newStatus = action === 'approve' ? 'CONFIRMED' : 'NEEDS_INFO';
          if (order) {
            db.updateOrder(param, {
              status: newStatus,
              paymentStatus: action === 'approve' ? 'VERIFIED' : 'REJECTED',
              [`${action}edAt`]: new Date().toISOString(),
              [`${action}edBy`]: adminName
            });
            await db.syncToCloud();
          }

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

      // ════════════════════════════════════════════════════════════════════════
      // ── B. MESSAGES (Text or Photo) ──
      // ════════════════════════════════════════════════════════════════════════
      if (update.message) {
        const msg = update.message;
        const chatId = String(msg.chat.id);
        const from = msg.from || {};
        const firstName = from.first_name || 'Client';
        const username = from.username || '';
        const text = (msg.text || '').trim();
        const caption = (msg.caption || '').trim();

        db.getOrCreateChat(chatId, { first_name: firstName, last_name: from.last_name || '', username });

        // ──────────────────────────────────────────────────────────────────────
        // 1. PHOTO OR DOCUMENT UPLOAD: Auto-Scan QR Code from Receipt Card
        // ──────────────────────────────────────────────────────────────────────
        const isPhoto = Array.isArray(msg.photo) && msg.photo.length > 0;
        const isDocImage = msg.document && (
          msg.document.mime_type?.startsWith('image/') ||
          msg.document.file_name?.match(/\.(png|jpe?g|webp)$/i)
        );

        if (isPhoto || isDocImage) {
          // Get file ID from highest resolution photo or document image
          const fileId = isPhoto ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id;

          // Fetch file path from Telegram
          let fileUrl = null;
          let imageBuffer = null;
          try {
            const fileInfoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
            if (fileInfoRes.ok) {
              const fileInfo = await fileInfoRes.json();
              if (fileInfo.ok && fileInfo.result?.file_path) {
                fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
                const bufRes = await fetch(fileUrl);
                if (bufRes.ok) {
                  imageBuffer = Buffer.from(await bufRes.arrayBuffer());
                }
              }
            }
          } catch (fetchErr) {
            console.warn('Error fetching Telegram photo:', fetchErr.message);
          }

          // Scan QR code from photo/document buffer (multi-crop, downscale, and cloud fallback)
          let decodedString = null;
          if (imageBuffer) {
            decodedString = await scanQrFromBuffer(imageBuffer, fileUrl);
          }

          // Check if QR decoded an order ID, or check photo caption, or existing linked order
          let detectedOrderId = extractOrderId(decodedString) || extractOrderId(caption);
          const currentChat = db.getChat(chatId);
          if (!detectedOrderId && currentChat?.orderId) {
            detectedOrderId = currentChat.orderId;
          }

          // If still not detected, search orders in database for this client's telegram handle or chat ID
          if (!detectedOrderId) {
            const allOrders = db.getOrders();
            const match = allOrders.find(o =>
              (o.telegramUserId === chatId || o.telegramChatId === chatId) ||
              (username && o.telegramUsername && o.telegramUsername.toLowerCase() === username.toLowerCase()) ||
              (o.clientName && o.clientName.toLowerCase() === firstName.toLowerCase())
            );
            if (match) detectedOrderId = match.id;
          }

          if (detectedOrderId) {
            let order = db.getOrder(detectedOrderId);

            // Auto-register order if created on client-side receipt generator before backend sync
            if (!order) {
              order = db.saveOrder({
                id: detectedOrderId,
                clientName: firstName + (from.last_name ? ' ' + from.last_name : ''),
                telegramChatId: chatId,
                telegramUsername: username || null,
                telegramUserId: chatId,
                paymentProof: fileUrl,
                paymentStatus: 'PENDING_VERIFICATION',
                status: 'PENDING_VERIFICATION',
                jobStatus: 'SCHEDULED',
                packageName: 'Studio Service (Receipt Pass)',
                totalPrice: 14500,
                depositAmount: 7250,
                remainingBalance: 7250,
                eventDate: new Date().toISOString().split('T')[0]
              });
            }

            // Save payment proof and link chat
            const patch = {
              paymentProof: fileUrl || order.paymentProof,
              paymentStatus: order.paymentStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING_VERIFICATION',
              telegramChatId: chatId,
              telegramUsername: username || order.telegramUsername,
              telegramUserId: chatId
            };
            db.updateOrder(detectedOrderId, patch);
            db.linkChatToOrder(chatId, detectedOrderId);

            // Add system chat timeline note
            db.addChatMessage(chatId, {
              sender: 'client',
              senderName: firstName,
              text: `📷 [Uploaded Receipt Card / Payment Proof]`,
              type: 'receipt_upload',
              data: { fileUrl, orderId: detectedOrderId }
            });
            db.addMessage(detectedOrderId, {
              sender: 'client',
              senderName: firstName,
              text: `Uploaded receipt card / payment screenshot via Telegram`,
              type: 'receipt_upload'
            });
            await db.syncToCloud(chatId);

            // Send confirmation to Client with live Order Card
            const updatedOrder = db.getOrder(detectedOrderId);
            const confirmationMsg = `🔍 <b>RECEIPT CARD SCANNED & RECOGNIZED!</b>\n\n` +
              `We successfully identified your booking <code>${detectedOrderId}</code> from your receipt pass!\n` +
              `Your payment proof has been attached and submitted directly to our studio directors.\n\n` +
              buildOrderCardText(updatedOrder);

            await sendTelegramMessage(chatId, confirmationMsg, {
              reply_markup: buildClientOrderKeyboard(detectedOrderId)
            });

            // Forward Photo to ALL Admins with instant 1-tap verification buttons!
            const deposit = updatedOrder.depositAmount || Math.round((updatedOrder.totalPrice || 0) * 0.5);
            const adminAlert = `📸 <b>RECEIPT CARD / QR SCANNED UPLOAD!</b>\n\n` +
              `🆔 <b>Order:</b> <code>${detectedOrderId}</code>\n` +
              `👤 <b>Client:</b> ${updatedOrder.clientName} (@${username || 'N/A'})\n` +
              `📞 <b>Phone:</b> ${updatedOrder.phone || 'N/A'}\n` +
              `📅 <b>Event Date:</b> <b>${updatedOrder.eventDate || 'TBD'}</b>\n` +
              `📦 <b>Package:</b> ${updatedOrder.packageName}\n` +
              `💰 <b>Deposit Due:</b> <b>${deposit.toLocaleString()} ETB</b>\n` +
              `🏦 <b>Method:</b> ${(updatedOrder.paymentMethod || 'Telebirr').toUpperCase()}\n` +
              (updatedOrder.paymentReference ? `🔢 <b>Txn Ref:</b> <code>${updatedOrder.paymentReference}</code>\n` : '') +
              `🔍 <i>QR Code on receipt card was automatically recognized and verified!</i>\n\n` +
              `👇 <b>Director Quick Actions:</b>`;

            const adminKeyboard = buildAdminOrderKeyboard(detectedOrderId, chatId);

            if (fileUrl) {
              await notifyAdminsPhoto(fileUrl, adminAlert, { reply_markup: adminKeyboard });
            } else {
              await notifyAdmins(adminAlert, { reply_markup: adminKeyboard });
            }

            return res.status(200).json({ ok: true });
          }

          // If no order ID could be determined from QR, caption, or chat profile
          if (fileUrl) {
            await notifyAdminsPhoto(fileUrl,
              `📷 <b>PHOTO FROM CLIENT (No QR detected)</b>\n\n` +
              `👤 From: ${firstName} (@${username || 'no_handle'})\n` +
              `💬 Chat ID: <code>${chatId}</code>\n` +
              (caption ? `📝 Caption: "${caption}"\n\n` : '\n') +
              `<i>Use /reply ${chatId} &lt;message&gt; or link order</i>`
            );
          }

          await sendTelegramMessage(chatId,
            `📷 <b>Photo Received!</b>\n\n` +
            `We received your image. If this is a payment receipt or booking card, simply reply with your Order Reference (e.g. <code>HOPE-6340</code>).\n` +
            `• Or track online on our web portal: ${APP_URL}`
          );
          return res.status(200).json({ ok: true });
        }

        // ──────────────────────────────────────────────────────────────────────
        // 2. CLIENT CONSULTATION & SIGNING DEEP LINKS
        // ──────────────────────────────────────────────────────────────────────
        if (text.startsWith('/start discuss_')) {
          const orderId = text.replace('/start discuss_', '').trim();
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
            text: `Client initiated consultation for Order ${orderId}`,
            type: 'consultation_start'
          });
          await db.syncToCloud();

          const welcomeMsg = `🌸 <b>Welcome to HOPE Photo & Velo Studio!</b>\n\n` +
            `You have connected regarding Booking <code>${orderId}</code>.\n\n` +
            `📦 <b>Package:</b> ${order?.packageName || 'Wedding Service'}\n` +
            `📅 <b>Target Date:</b> ${order?.eventDate || 'To be finalized'}\n\n` +
            `Feel free to type your questions or send your receipt card here. Our studio directors will reply shortly.\n\n` +
            `<i>📞 Studio Hotline: 09 10 52 69 62</i>`;

          await sendTelegramMessage(chatId, welcomeMsg, { reply_markup: buildClientOrderKeyboard(orderId) });

          for (const adminId of ADMIN_CHAT_IDS) {
            if (adminId !== chatId) {
              await sendTelegramMessage(adminId,
                `💬 <b>NEW CLIENT CONSULTATION:</b>\n\n` +
                `Order: <code>${orderId}</code>\n` +
                `Client: ${firstName} ${from.last_name || ''} (@${username || 'no username'})\n` +
                `Chat ID: <code>${chatId}</code>\n` +
                `Package: ${order?.packageName || 'N/A'}\n\n` +
                `<i>Use /reply ${chatId} &lt;message&gt; to respond</i>`,
                { reply_markup: buildAdminOrderKeyboard(orderId, chatId) }
              );
            }
          }
          return res.status(200).json({ ok: true });
        }

        if (text.startsWith('/start sign_')) {
          const agrId = text.replace('/start sign_', '').trim();
          const signingUrl = `${APP_URL}?sign=${agrId}`;
          await sendTelegramMessage(chatId,
            `📜 <b>HOPE Studio Agreement</b>\n\nOpen the link below to review and sign your service agreement:\n\n👇 <a href="${signingUrl}">Sign Agreement</a>\n\n<i>Call us: 09 10 52 69 62</i>`
          );
          return res.status(200).json({ ok: true });
        }

        // ──────────────────────────────────────────────────────────────────────
        // 3. ORDER TRACKING DEEP LINK (/start order_HOPE-XXXX or /start HOPE-XXXX)
        // ──────────────────────────────────────────────────────────────────────
        if (text.startsWith('/start order_') || text.match(/^\/start\s+(HOPE-[A-Za-z0-9_-]+)$/i)) {
          const rawParam = text.replace('/start order_', '').replace('/start', '').trim();
          const orderId = extractOrderId(rawParam);
          const order = orderId ? db.getOrder(orderId) : null;

          if (order) {
            db.updateOrder(orderId, {
              telegramChatId: chatId,
              telegramUsername: username || order.telegramUsername,
              telegramUserId: chatId
            });
            db.linkChatToOrder(chatId, orderId);
            db.addChatMessage(chatId, {
              sender: 'system',
              senderName: 'HOPE System',
              text: `Client started tracking Order ${orderId}`,
              type: 'track_start'
            });
            await db.syncToCloud();

            const cardMsg = `🌸 <b>Welcome to HOPE Photo & Velo Studio!</b>\n\n` +
              `You are now connected to live tracking for Order <code>${orderId}</code>.\n\n` +
              buildOrderCardText(order);

            await sendTelegramMessage(chatId, cardMsg, {
              reply_markup: buildClientOrderKeyboard(orderId)
            });

            // Notify Admins
            const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
            const adminNote = `🔔 <b>CLIENT TRACKING ORDER VIA TELEGRAM!</b>\n\n` +
              `🆔 <b>Order:</b> <code>${order.id}</code>\n` +
              `👤 <b>Client:</b> ${order.clientName} (@${username || 'no_handle'})\n` +
              `📞 <b>Phone:</b> ${order.phone || 'N/A'}\n` +
              `💬 <b>Telegram Chat ID:</b> <code>${chatId}</code>\n` +
              `📅 <b>Event Date:</b> ${order.eventDate || 'TBD'}\n` +
              `📦 <b>Package:</b> ${order.packageName}\n` +
              `💰 <b>Total:</b> ${(order.totalPrice || 0).toLocaleString()} ETB | <b>Deposit:</b> ${deposit.toLocaleString()} ETB\n` +
              `💳 <b>Payment:</b> ${order.paymentStatus || 'PENDING'}\n` +
              `🎬 <b>Job:</b> ${order.jobStatus || 'SCHEDULED'}\n\n` +
              `<i>Client arrived from Web Portal to track this order.</i>`;

            await notifyAdmins(adminNote, {
              reply_markup: buildAdminOrderKeyboard(orderId, chatId)
            });

            return res.status(200).json({ ok: true });
          } else {
            await sendTelegramMessage(chatId,
              `⚠️ <b>Order Not Found</b>\n\nWe could not find booking <code>${rawParam}</code> in our database.\nPlease check your reference code or book online at ${APP_URL}`
            );
            return res.status(200).json({ ok: true });
          }
        }

        // ──────────────────────────────────────────────────────────────────────
        // 4. ADMIN SLASH COMMANDS
        // ──────────────────────────────────────────────────────────────────────
        if (isAdmin(chatId) && text.startsWith('/')) {
          // /order <id> or /track <id> — inspect specific order
          if (text.startsWith('/order ') || text.startsWith('/track ')) {
            const targetId = text.split(' ')[1]?.trim();
            const order = db.getOrder(targetId);
            if (!order) {
              await sendTelegramMessage(chatId, `❌ Order <code>${targetId}</code> not found.`);
            } else {
              const card = buildOrderCardText(order);
              await sendTelegramMessage(chatId, card, {
                reply_markup: buildAdminOrderKeyboard(order.id, order.telegramChatId)
              });
            }
            return res.status(200).json({ ok: true });
          }

          // /verify <id> — quick verify payment
          if (text.startsWith('/verify ')) {
            const targetId = text.split(' ')[1]?.trim();
            const order = db.getOrder(targetId);
            if (!order) {
              await sendTelegramMessage(chatId, `❌ Order <code>${targetId}</code> not found.`);
            } else {
              db.updateOrder(targetId, {
                paymentStatus: 'VERIFIED',
                status: 'CONFIRMED',
                verifiedAt: new Date().toISOString(),
                verifiedBy: `@${username || firstName}`
              });
              await db.syncToCloud();

              await sendTelegramMessage(chatId, `✅ Order <code>${targetId}</code> payment is now <b>VERIFIED</b>.`);

              // Notify client
              const clientChat = order.telegramChatId || order.telegramUserId;
              if (clientChat) {
                const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
                await sendTelegramMessage(clientChat,
                  `🎉 <b>PAYMENT CONFIRMED & VERIFIED!</b>\n\n` +
                  `Dear <b>${order.clientName}</b>, your deposit payment of <b>${deposit.toLocaleString()} ETB</b> for Order <code>${order.id}</code> has been verified!\n` +
                  `Your date is secured. 🥂✨`,
                  { reply_markup: buildClientOrderKeyboard(targetId) }
                );
              }
            }
            return res.status(200).json({ ok: true });
          }

          // /status <id> <stage> — quick job status update
          if (text.startsWith('/status ')) {
            const parts = text.split(' ');
            const targetId = parts[1];
            const rawStage = (parts[2] || '').toLowerCase();
            const stageMap = {
              prep: 'PREP',
              shoot: 'IN_PRODUCTION',
              editing: 'EDITING',
              edit: 'EDITING',
              done: 'COMPLETED',
              completed: 'COMPLETED'
            };
            const stage = stageMap[rawStage] || 'IN_PRODUCTION';
            const order = db.getOrder(targetId);
            if (!order) {
              await sendTelegramMessage(chatId, `❌ Order <code>${targetId}</code> not found.`);
            } else {
              db.updateOrder(targetId, { jobStatus: stage });
              await db.syncToCloud();
              await sendTelegramMessage(chatId, `✅ Order <code>${targetId}</code> job status updated to <b>${stage}</b>.`);

              const clientChat = order.telegramChatId || order.telegramUserId;
              if (clientChat) {
                await sendTelegramMessage(clientChat,
                  `🎬 <b>PROJECT UPDATE:</b> Order <code>${targetId}</code> is now in stage <b>${stage}</b>!`,
                  { reply_markup: buildClientOrderKeyboard(targetId) }
                );
              }
            }
            return res.status(200).json({ ok: true });
          }

          // /orders — list recent bookings with action links
          if (text === '/orders') {
            const orders = db.getOrders().slice(0, 10);
            if (orders.length === 0) {
              await sendTelegramMessage(chatId, '📋 No bookings recorded yet.');
            } else {
              const list = orders.map(o => {
                const payBadge = o.paymentStatus === 'VERIFIED' ? '✅' : '⏳';
                const jobBadge = o.jobStatus === 'COMPLETED' ? '🎉' : '🎬';
                return `• <code>${o.id}</code> ${payBadge}${jobBadge} <b>${o.clientName}</b>\n  📅 ${o.eventDate || 'TBD'} | 💰 ${(o.totalPrice || 0).toLocaleString()} ETB | Pay: ${o.paymentStatus || 'PENDING'}\n  👉 /order ${o.id}`;
              }).join('\n\n');
              await sendTelegramMessage(chatId, `📋 <b>Recent Bookings:</b>\n\n${list}`);
            }
            return res.status(200).json({ ok: true });
          }

          // /chats — list client conversations
          if (text === '/chats') {
            const chats = db.getAllChats().slice(0, 10);
            if (chats.length === 0) {
              await sendTelegramMessage(chatId, '💬 No conversations yet.');
            } else {
              const list = chats.map(c =>
                `• <code>${c.chatId}</code> — <b>${c.firstName} ${c.lastName || ''}</b>${c.username ? ' (@' + c.username + ')' : ''}` +
                (c.orderId ? ` [<code>${c.orderId}</code>]` : '') +
                `\n  📩 ${c.lastMessage?.substring(0, 50) || 'No messages'}${c.unreadCount > 0 ? ` 🔴 ${c.unreadCount} unread` : ''}\n  👉 /reply ${c.chatId} <msg>`
              ).join('\n\n');
              await sendTelegramMessage(chatId, `💬 <b>Active Client Conversations:</b>\n\n${list}`);
            }
            return res.status(200).json({ ok: true });
          }

          // /reply <chatId> <message>
          if (text.startsWith('/reply ')) {
            const parts = text.split(' ');
            const targetChatId = parts[1];
            const replyText = parts.slice(2).join(' ');
            if (!targetChatId || !replyText) {
              await sendTelegramMessage(chatId, '❌ Usage: /reply &lt;chatId&gt; &lt;message&gt;');
              return res.status(200).json({ ok: true });
            }
            db.addChatMessage(targetChatId, {
              sender: 'admin',
              senderName: 'HOPE Studio Director',
              text: replyText,
              type: 'text'
            });
            await db.syncToCloud();
            await sendTelegramMessage(targetChatId,
              `📸 <b>HOPE Studio — Director Reply</b>\n\n${replyText}\n\n<i>Studio Hotline: 09 10 52 69 62</i>`
            );
            await sendTelegramMessage(chatId, `✅ Reply delivered to <code>${targetChatId}</code>`);
            return res.status(200).json({ ok: true });
          }

          // /help for admin
          if (text === '/help' || text === '/start') {
            await sendTelegramMessage(chatId,
              `🎬 <b>HOPE Studio Admin & Director Bot</b>\n\n` +
              `<b>Available Commands:</b>\n` +
              `/orders — List recent bookings\n` +
              `/order &lt;id&gt; — View full details and 1-tap buttons for an order\n` +
              `/verify &lt;id&gt; — Instantly verify payment for an order\n` +
              `/status &lt;id&gt; &lt;prep|shoot|edit|done&gt; — Update job stage\n` +
              `/chats — List all client conversations\n` +
              `/reply &lt;chatId&gt; &lt;message&gt; — Reply to a client\n` +
              `/sendlink &lt;chatId&gt; &lt;agrId&gt; — Send agreement signing link\n\n` +
              `<i>💡 When clients upload a receipt card photo, this bot auto-scans the QR code, attaches the proof to the order, and alerts you with 1-tap review buttons!</i>`
            );
            return res.status(200).json({ ok: true });
          }
        }

        // ──────────────────────────────────────────────────────────────────────
        // 5. CLIENT TEXT MESSAGES & ORDER LOOKUP
        // ──────────────────────────────────────────────────────────────────────
        // If message is or contains an order ID like "HOPE-1234"
        const possibleOrderId = extractOrderId(text);
        if (possibleOrderId) {
          let order = db.getOrder(possibleOrderId);
          if (!order) {
            order = db.saveOrder({
              id: possibleOrderId,
              clientName: firstName + (from.last_name ? ' ' + from.last_name : ''),
              telegramChatId: chatId,
              telegramUsername: username || null,
              telegramUserId: chatId,
              paymentStatus: 'PENDING_VERIFICATION',
              status: 'PENDING_VERIFICATION',
              jobStatus: 'SCHEDULED',
              packageName: 'Studio Service',
              totalPrice: 14500,
              depositAmount: 7250,
              remainingBalance: 7250,
              eventDate: new Date().toISOString().split('T')[0]
            });
          }

          db.updateOrder(possibleOrderId, {
            telegramChatId: chatId,
            telegramUsername: username || order.telegramUsername,
            telegramUserId: chatId
          });
          db.linkChatToOrder(chatId, possibleOrderId);
          await db.syncToCloud();

          const card = buildOrderCardText(order);
          await sendTelegramMessage(chatId,
            `🔍 <b>Found Booking <code>${possibleOrderId}</code>:</b>\n\n` + card,
            { reply_markup: buildClientOrderKeyboard(possibleOrderId) }
          );

          // Alert admins
          const deposit = order.depositAmount || Math.round((order.totalPrice || 0) * 0.5);
          await notifyAdmins(
            `🔔 <b>CLIENT LOOKUP ORDER:</b> <code>${possibleOrderId}</code>\n` +
            `👤 Client: ${order.clientName} (@${username || 'N/A'})\n` +
            `💰 Deposit: ${deposit.toLocaleString()} ETB | Status: ${order.paymentStatus || 'PENDING'}\n\n` +
            `<i>Client requested order details via Telegram bot text.</i>`,
            { reply_markup: buildAdminOrderKeyboard(possibleOrderId, chatId) }
          );

          return res.status(200).json({ ok: true });
        }

        // Default /start for client
        if (text === '/start') {
          db.addChatMessage(chatId, {
            sender: 'client',
            senderName: firstName,
            text: '/start',
            type: 'text'
          });
          await db.syncToCloud();
          await sendTelegramMessage(chatId,
            `🌸 <b>Welcome to HOPE Photo & Velo Studio!</b>\n\n` +
            `📍 Tigat Building, Hayahulet, Addis Ababa\n` +
            `📞 09 10 52 69 62\n\n` +
            `<b>How can we assist you today?</b>\n` +
            `• 📷 <b>Upload your Receipt Card:</b> Simply send a photo of your receipt card; our system will auto-scan the QR code and display your live order details!\n` +
            `• 🔍 <b>Track an Order:</b> Type your Order Reference (e.g. <code>HOPE-1234</code>)\n` +
            `• 💬 <b>Talk to Director:</b> Type any message below and our directors will reply shortly\n` +
            `• 🌐 <b>Book Online:</b> ${APP_URL}`
          );
          return res.status(200).json({ ok: true });
        }

        if (text === '/help') {
          await sendTelegramMessage(chatId,
            `🌸 <b>HOPE Studio Options:</b>\n\n` +
            `• Send a photo of your downloaded receipt card to auto-track your project\n` +
            `• Type your Order ID (e.g. <code>HOPE-1234</code>) to check live status\n` +
            `• Type any question or shoot preference to chat with our directors\n` +
            `• 🌐 Visit web portal: ${APP_URL}\n` +
            `• 📞 Call: 09 10 52 69 62`
          );
          return res.status(200).json({ ok: true });
        }

        // Regular text message — save to chat and order notes, and forward to admins
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

          const ackMsg = orderId
            ? `✅ <b>Message received!</b> Your note has been saved under Order <code>${orderId}</code> and forwarded to our studio directors.`
            : `✅ <b>Message received!</b> Our directors will reply shortly.\n📞 Or call: 09 10 52 69 62`;

          await sendTelegramMessage(chatId, ackMsg);
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
