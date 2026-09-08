// api/agreements.js - Digital Service Contract & E-Signature Processing
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

    const agreement = db.getAgreement(order_id);
    const order = db.getOrder(order_id);
    return res.status(200).json({ agreement, order });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        orderId,
        clientName,
        signatureDataUrl,
        termsAccepted,
        eventDate,
        location,
        agreedPrice,
        depositAmount
      } = body;

      if (!orderId || !signatureDataUrl || !termsAccepted) {
        return res.status(400).json({ error: 'Missing required signature fields' });
      }

      const order = db.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const agreementId = 'HOPE-AGR-' + Math.floor(10000 + Math.random() * 90000);
      const signedAt = new Date().toISOString();

      const agreement = db.saveAgreement({
        id: agreementId,
        orderId,
        clientName: clientName || order.clientName,
        signatureDataUrl,
        eventDate: eventDate || order.eventDate,
        location: location || order.location,
        packageName: order.packageName,
        agreedPrice: agreedPrice || order.negotiatedPrice || order.totalPrice,
        depositAmount: depositAmount || Math.round((agreedPrice || order.totalPrice) * 0.3),
        termsVersion: 'v2.1-2026',
        verificationHash: 'SHA256:' + Buffer.from(`${orderId}-${signedAt}-${clientName}`).toString('hex').substring(0, 16),
        signedAt
      });

      // Update order status to signed
      db.updateOrder(orderId, {
        status: 'signed',
        agreementId: agreement.id,
        signedAt: agreement.signedAt
      });

      // Insert system record into chat
      db.addMessage(orderId, {
        sender: 'system',
        senderName: 'Contract Verification Authority',
        type: 'agreement_signed',
        text: `📜 Official Digital Service Agreement signed by ${agreement.clientName}!\nContract Ref: ${agreement.id}\nVerification: ${agreement.verificationHash}\nAdvance Deposit (30%): ${agreement.depositAmount.toLocaleString()} ETB.`,
        data: { agreementId: agreement.id, verificationHash: agreement.verificationHash }
      });

      return res.status(201).json({ success: true, agreement });
    } catch (e) {
      console.error('Agreement error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
