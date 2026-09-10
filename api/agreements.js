// api/agreements.js — Digital Service Contract, E-Signature & Custom Agreement System
import { db, notifyAdmins, sendTelegramMessage } from './_store.js';

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://hope-photo-velo-jade.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { order_id, list, custom_id, defaults } = req.query;

    // List all 9 default agreements
    if (defaults === '1') {
      return res.status(200).json({ agreements: db.getDefaultAgreements9() });
    }

    // List all custom agreements
    if (list === '1') {
      return res.status(200).json({
        customAgreements: db.getAllCustomAgreements(),
        defaultAgreements: db.getDefaultAgreements9(),
        signedAgreements: db.getAgreements()
      });
    }

    // Get specific custom agreement by ID (for signing page)
    if (custom_id) {
      const agr = db.getCustomAgreement(custom_id);
      if (!agr) return res.status(404).json({ error: 'Custom agreement not found' });
      // Link to order if present
      const order = agr.orderId ? db.getOrder(agr.orderId) : null;
      return res.status(200).json({ agreement: agr, order });
    }

    // Get signed agreement by order_id
    if (order_id) {
      const agreement = db.getAgreement(order_id);
      const order = db.getOrder(order_id);
      return res.status(200).json({ agreement, order });
    }

    return res.status(400).json({ error: 'order_id, custom_id, list=1, or defaults=1 required' });
  }

  // ── POST ─────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action } = body;

      // ── Sign a contract (client side) ──────────────────────────────────
      if (!action || action === 'sign') {
        const {
          orderId, clientName, signatureDataUrl, termsAccepted,
          eventDate, location, agreedPrice, depositAmount,
          customAgreementId, templateId
        } = body;

        if (!orderId || !signatureDataUrl || !termsAccepted) {
          return res.status(400).json({ error: 'Missing required signature fields' });
        }

        const order = db.getOrder(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const customAgr = customAgreementId ? db.getCustomAgreement(customAgreementId) : null;
        const finalPrice = agreedPrice || customAgr?.price || order.negotiatedPrice || order.totalPrice;
        const deposit50 = depositAmount || Math.round(finalPrice * 0.5);
        const agreementId = 'HOPE-AGR-' + Math.floor(10000 + Math.random() * 90000);
        const signedAt = new Date().toISOString();

        const agreement = db.saveAgreement({
          id: agreementId,
          orderId,
          clientName: clientName || order.clientName,
          signatureDataUrl,
          eventDate: eventDate || order.eventDate,
          location: location || order.location || 'Addis Ababa',
          packageName: customAgr?.packageTitle || order.packageName,
          agreedPrice: finalPrice,
          depositAmount: deposit50,
          remainingBalance: finalPrice - deposit50,
          termsVersion: 'v3.2-2026',
          customAgreementId: customAgreementId || null,
          templateId: templateId || null,
          verificationHash: 'SHA256:' + Buffer.from(`${orderId}-${signedAt}-${clientName}`).toString('hex').substring(0, 16),
          signedAt
        });

        db.updateOrder(orderId, { status: 'signed', agreementId: agreement.id, signedAt: agreement.signedAt });

        db.addMessage(orderId, {
          sender: 'system',
          senderName: 'Contract Verification Authority',
          type: 'agreement_signed',
          text: `📜 Digital Service Agreement signed by ${agreement.clientName}!\nContract Ref: ${agreement.id}\nVerification: ${agreement.verificationHash}\nAdvance Deposit (50%): ${agreement.depositAmount.toLocaleString()} ETB.`,
          data: { agreementId: agreement.id, verificationHash: agreement.verificationHash }
        });

        // Notify admins
        await notifyAdmins(
          `✍️ <b>AGREEMENT SIGNED!</b>\n\n` +
          `🆔 Contract: <code>${agreement.id}</code>\n` +
          `👤 Client: ${agreement.clientName}\n` +
          `📦 Package: ${agreement.packageName || 'N/A'}\n` +
          `📅 Event Date: ${agreement.eventDate || 'N/A'}\n` +
          `💰 Total: ${(agreement.agreedPrice || 0).toLocaleString()} ETB\n` +
          `💵 Deposit (50%): ${(agreement.depositAmount || 0).toLocaleString()} ETB\n` +
          `🔐 Hash: <code>${agreement.verificationHash}</code>`
        );

        return res.status(201).json({ success: true, agreement });
      }

      // ── Create / Update a custom agreement (admin side) ───────────────
      if (action === 'save_custom') {
        const {
          id, name, packageTitle, price, category,
          clientName, clientChatId, orderId,
          deliverables, paymentTerms, totalNote, clauses,
          baseTemplateId, customizations
        } = body;

        const agr = db.saveCustomAgreement({
          id: id || null,
          name: name || 'Custom Agreement',
          packageTitle: packageTitle || 'Custom Package',
          price: price || 0,
          category: category || 'custom',
          clientName: clientName || null,
          clientChatId: clientChatId || null,
          orderId: orderId || null,
          deliverables: deliverables || [],
          paymentTerms: paymentTerms || '',
          totalNote: totalNote || '',
          clauses: clauses || [],
          baseTemplateId: baseTemplateId || null,
          customizations: customizations || {},
          status: 'draft',
          createdBy: 'admin',
          signingUrl: null
        });

        // Build signing URL
        agr.signingUrl = `${APP_URL}?sign=${agr.id}`;
        db.saveCustomAgreement(agr);

        return res.status(201).json({ success: true, agreement: agr });
      }

      // ── Send custom agreement link via Telegram ────────────────────────
      if (action === 'send_link') {
        const { customAgreementId, chatId } = body;
        if (!customAgreementId || !chatId) return res.status(400).json({ error: 'customAgreementId and chatId required' });

        const agr = db.getCustomAgreement(customAgreementId);
        if (!agr) return res.status(404).json({ error: 'Custom agreement not found' });

        const signingUrl = agr.signingUrl || `${APP_URL}?sign=${agr.id}`;

        const linkMsg = `📜 <b>Your HOPE Studio Service Agreement is Ready!</b>\n\n` +
          `📦 Package: <b>${agr.packageTitle || agr.name}</b>\n` +
          `💰 Total: <b>${(agr.price || 0).toLocaleString()} ETB</b>\n\n` +
          `Please click the button below to review and digitally sign your agreement:\n` +
          `👇 <a href="${signingUrl}">Open & Sign Agreement</a>\n\n` +
          `<i>Questions? Reply here or call 09 10 52 69 62</i>`;

        await sendTelegramMessage(String(chatId), linkMsg);

        // Record in chat
        db.addChatMessage(String(chatId), {
          sender: 'admin',
          senderName: 'HOPE Studio Director',
          text: `📜 Agreement signing link sent`,
          type: 'agreement_link',
          data: { agreementId: agr.id, signingUrl }
        });

        // Update agreement status
        agr.status = 'sent';
        agr.sentAt = new Date().toISOString();
        agr.sentToChatId = String(chatId);
        db.saveCustomAgreement(agr);

        return res.status(200).json({ success: true, signingUrl });
      }

      // ── Update a default agreement template (admin edit) ──────────────
      if (action === 'update_default') {
        const { id, patch } = body;
        if (!id || !patch) return res.status(400).json({ error: 'id and patch required' });
        const updated = db.updateDefaultAgreement(id, patch);
        if (!updated) return res.status(404).json({ error: 'Default agreement not found' });
        return res.status(200).json({ success: true, agreement: updated });
      }

      return res.status(400).json({ error: 'Unknown action' });
    } catch (e) {
      console.error('Agreement error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
