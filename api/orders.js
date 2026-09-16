// api/orders.js - Order Management API with Telegram Verification Alerts
import { db, notifyAdmins, notifyAdminsPhoto, sendTelegramMessage } from './_store.js';

// Function to dispatch instant admin alert with receipt photo & inline review buttons
async function dispatchPaymentAlert(order) {
  try {
    const deposit = order.depositAmount || Math.round((order.totalPrice || order.basePrice || 0) * 0.3);
    const alertCaption = `💳 <b>NEW PAYMENT RECEIPT UPLOADED!</b>\n\n` +
      `🆔 <b>Order:</b> <code>${order.id}</code>\n` +
      `👤 <b>Client:</b> ${order.clientName}\n` +
      `📞 <b>Phone:</b> ${order.phone || 'Not provided'}\n` +
      `📅 <b>Event Date:</b> <b>${order.eventDate || 'TBD'}</b>\n` +
      `📍 <b>Location:</b> ${order.location || 'Addis Ababa'}\n` +
      `📦 <b>Package:</b> ${order.packageName}\n` +
      `💰 <b>Total Investment:</b> ${Number(order.totalPrice || order.basePrice || 0).toLocaleString()} ETB\n` +
      `💵 <b>30% Deposit Paid:</b> <b>${Number(deposit).toLocaleString()} ETB</b>\n` +
      `🏦 <b>Method:</b> ${(order.paymentMethod || 'telebirr').toUpperCase()}\n` +
      (order.signatureDataUrl ? `✍️ <b>E-Signature:</b> Captured on contract\n` : '') +
      (order.notes ? `📝 <b>Client Note:</b> <i>"${order.notes}"</i>\n` : '') +
      `\n👇 <b>Director Action:</b>`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ Approve Booking', callback_data: `approve:${order.id}` },
          { text: '❌ Reject / Request Info', callback_data: `reject:${order.id}` }
        ]
      ]
    };

    if (order.paymentProof) {
      await notifyAdminsPhoto(order.paymentProof, alertCaption, { reply_markup: inlineKeyboard });
    } else {
      await notifyAdmins(alertCaption, { reply_markup: inlineKeyboard });
    }
  } catch (err) {
    console.error('Error dispatching payment alert to Telegram:', err);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sync latest orders and messages from Supabase Cloud on every request
  try {
    await db.syncFromCloud();
  } catch (syncErr) {
    console.warn('api/orders syncFromCloud warning:', syncErr.message);
  }

  if (req.method === 'GET') {
    const { id, user_id } = req.query;
    if (id) {
      const order = db.getOrder(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      const comments = db.getMessages(id) || [];
      return res.status(200).json({ order, comments });
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

      // Handle Customer Comment submission
      if (body.action === 'comment' || body.commentText) {
        const targetId = body.orderId || body.id;
        if (!targetId) return res.status(400).json({ error: 'Order ID required for comment' });
        const text = body.text || body.commentText || '';
        const sender = body.sender || 'client';
        const senderName = body.senderName || 'Valued Client';

        const newMsg = db.addMessage(targetId, { sender, senderName, text });
        
        // Notify Telegram Admin of customer comment
        try {
          await notifyAdmins(
            `💬 <b>NEW CLIENT NOTE ON ORDER</b> <code>${targetId}</code>\n\n` +
            `👤 <b>From:</b> ${senderName} (${sender})\n` +
            `📝 <b>Comment:</b> <i>"${text}"</i>\n` +
            `\n🔗 <a href="https://hope-photo-velo-jade.vercel.app/?order=${targetId}">Open Order Page</a>`
          );
        } catch (tgErr) {
          console.warn('Failed to dispatch comment alert:', tgErr.message);
        }

        const comments = db.getMessages(targetId);
        return res.status(201).json({ success: true, message: newMsg, comments });
      }

      const base = Number(body.basePrice) || 0;
      const total = Number(body.totalPrice) || base;
      const deposit = Number(body.depositAmount) || Math.round(total * 0.3);

      const order = db.saveOrder({
        id: body.id || ('HOPE-' + Math.floor(1000 + Math.random() * 9000)),
        clientName: body.clientName || 'Valued Client',
        phone: body.phone || '',
        telegramUserId: body.telegramUserId || null,
        telegramUsername: body.telegramUsername || null,
        category: body.category || 'wedding',
        packageId: body.packageId || 'custom',
        packageName: body.packageName || 'Selected Package',
        eventDate: body.eventDate || '',
        location: body.location || 'Addis Ababa',
        basePrice: base,
        addons: body.addons || [],
        totalPrice: total,
        depositAmount: deposit,
        remainingBalance: total - deposit,
        paymentMethod: body.paymentMethod || null,
        paymentProof: body.paymentProof || null,
        paymentReference: body.paymentReference || null,
        signatureDataUrl: body.signatureDataUrl || null,
        termsAccepted: Boolean(body.termsAccepted),
        notes: body.notes || '',
        status: body.status || (body.paymentProof ? 'PENDING_VERIFICATION' : 'DRAFT'),
        paymentStatus: body.paymentStatus || (body.paymentProof || body.paymentMethod ? 'PENDING_VERIFICATION' : 'UNPAID'),
        jobStatus: body.jobStatus || 'SCHEDULED',
        createdAt: new Date().toISOString()
      });

      // If client left an initial note in the booking form, save it as first comment
      if (body.notes && body.notes.trim()) {
        db.addMessage(order.id, {
          sender: 'client',
          senderName: order.clientName,
          text: body.notes.trim()
        });
      }

      // If proof of payment attached at creation, dispatch alert
      if (order.paymentProof) {
        await dispatchPaymentAlert(order);
      }

      const comments = db.getMessages(order.id) || [];
      return res.status(201).json({ success: true, order, comments });
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

      const prevOrder = db.getOrder(id);
      if (!prevOrder) return res.status(404).json({ error: 'Order not found' });

      // If payment proof newly uploaded or status changed to PENDING_VERIFICATION
      const isNewReceipt = patch.paymentProof && patch.paymentProof !== prevOrder.paymentProof;
      const isPendingVerif = patch.status === 'PENDING_VERIFICATION' && prevOrder.status !== 'PENDING_VERIFICATION';

      // Check if payment was just verified
      const isNewlyVerified = patch.paymentStatus === 'VERIFIED' && prevOrder.paymentStatus !== 'VERIFIED';
      // Check if job stage was updated
      const isJobStageChanged = patch.jobStatus && patch.jobStatus !== prevOrder.jobStatus;

      const updated = db.updateOrder(id, patch);

      if (isNewReceipt || isPendingVerif) {
        await dispatchPaymentAlert(updated);
      }

      // If client is connected to Telegram, send them live real-time notifications of admin updates!
      const clientChatId = updated.telegramChatId || updated.telegramUserId;
      if (clientChatId) {
        if (isNewlyVerified) {
          const deposit = updated.depositAmount || Math.round((updated.totalPrice || 0) * 0.5);
          sendTelegramMessage(clientChatId,
            `🎉 <b>PAYMENT VERIFIED & CONFIRMED!</b> 🥂\n\n` +
            `Dear <b>${updated.clientName}</b>,\n` +
            `Your deposit of <b>${deposit.toLocaleString()} ETB</b> for Order <code>${updated.id}</code> has been officially verified by our studio director!\n\n` +
            `📅 <b>Event Date Locked:</b> ${updated.eventDate || 'Scheduled'}\n` +
            `📦 <b>Package:</b> ${updated.packageName}\n\n` +
            `✨ Your date is secured. Our creative production team will contact you for pre-shoot preparations.\n\n` +
            `🔗 <a href="https://hope-photo-velo-jade.vercel.app/?order=${updated.id}">Track Live Status on Web Portal</a>`
          ).catch(e => console.warn('Failed to notify client of verification:', e.message));
        }

        if (isJobStageChanged) {
          const stageNames = {
            SCHEDULED: '📅 Booking Reserved',
            PREP: '👗 Pre-Shoot Preparation',
            IN_PRODUCTION: '📸 Shoot Day (In Production)',
            EDITING: '🎞️ Cinema Editing & Color Grading',
            COMPLETED: '🎉 Completed & Ready for Pickup'
          };
          const stageLabel = stageNames[updated.jobStatus] || updated.jobStatus;
          sendTelegramMessage(clientChatId,
            `🎬 <b>PROJECT STATUS UPDATE!</b>\n\n` +
            `Order <code>${updated.id}</code> has advanced to:\n` +
            `👉 <b>${stageLabel}</b>\n\n` +
            `🔗 <a href="https://hope-photo-velo-jade.vercel.app/?order=${updated.id}">Open Live Tracking Portal</a>`
          ).catch(e => console.warn('Failed to notify client of stage change:', e.message));
        }
      }

      const comments = db.getMessages(id) || [];
      return res.status(200).json({ success: true, order: updated, comments });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
