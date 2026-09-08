// api/orders.js - Order Management API with Telegram Verification Alerts
import { db, notifyAdmins, notifyAdminsPhoto } from './_store.js';

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
        signatureDataUrl: body.signatureDataUrl || null,
        termsAccepted: Boolean(body.termsAccepted),
        notes: body.notes || '',
        status: body.status || (body.paymentProof ? 'PENDING_VERIFICATION' : 'DRAFT'),
        createdAt: new Date().toISOString()
      });

      // If proof of payment attached at creation, dispatch alert
      if (order.paymentProof) {
        await dispatchPaymentAlert(order);
      }

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

      const prevOrder = db.getOrder(id);
      if (!prevOrder) return res.status(404).json({ error: 'Order not found' });

      // If payment proof newly uploaded or status changed to PENDING_VERIFICATION
      const isNewReceipt = patch.paymentProof && patch.paymentProof !== prevOrder.paymentProof;
      const isPendingVerif = patch.status === 'PENDING_VERIFICATION' && prevOrder.status !== 'PENDING_VERIFICATION';

      const updated = db.updateOrder(id, patch);

      if (isNewReceipt || isPendingVerif) {
        await dispatchPaymentAlert(updated);
      }

      return res.status(200).json({ success: true, order: updated });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
