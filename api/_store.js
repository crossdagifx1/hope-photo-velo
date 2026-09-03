// api/_store.js - Shared Data Store & Telegram Utility for HOPE Studio
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8911456945:AAHHDlGW6-7KPsUwMZvLbAX2EHDXDxAwIzw';
const ADMIN_CHAT_IDS = ['5563466567', '5473210957'];
const STORE_FILE = path.join('/tmp', 'hope_studio_db.json');

// In-memory memory cache
let memoryStore = {
  orders: {},
  messages: {},
  agreements: {},
  adminState: {}
};

// Seed store from filesystem if available
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    memoryStore = { ...memoryStore, ...parsed };
  }
} catch (e) {
  console.warn('Store init notice:', e.message);
}

function persistStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {
    // Read-only filesystem fallback
  }
}

export const db = {
  getOrders() {
    return Object.values(memoryStore.orders || {}).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getOrder(id) {
    return memoryStore.orders?.[id] || null;
  },
  saveOrder(order) {
    if (!order.id) {
      order.id = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
    }
    if (!order.createdAt) {
      order.createdAt = new Date().toISOString();
    }
    order.updatedAt = new Date().toISOString();
    memoryStore.orders[order.id] = order;
    persistStore();
    return order;
  },
  updateOrder(id, patch) {
    if (!memoryStore.orders[id]) return null;
    memoryStore.orders[id] = {
      ...memoryStore.orders[id],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    persistStore();
    return memoryStore.orders[id];
  },
  getMessages(orderId) {
    return memoryStore.messages?.[orderId] || [];
  },
  addMessage(orderId, msg) {
    if (!memoryStore.messages[orderId]) {
      memoryStore.messages[orderId] = [];
    }
    const messageObj = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      orderId,
      sender: msg.sender || 'client', // 'client' | 'admin' | 'system'
      senderName: msg.senderName || 'Anonymous',
      text: msg.text || '',
      type: msg.type || 'text', // 'text' | 'discount_offer' | 'agreement_request' | 'agreement_signed'
      data: msg.data || null,
      timestamp: new Date().toISOString()
    };
    memoryStore.messages[orderId].push(messageObj);
    persistStore();
    return messageObj;
  },
  saveAgreement(agreement) {
    if (!agreement.id) {
      agreement.id = 'AGR-' + Math.floor(10000 + Math.random() * 90000);
    }
    agreement.signedAt = new Date().toISOString();
    memoryStore.agreements[agreement.orderId] = agreement;
    persistStore();
    return agreement;
  },
  getAgreement(orderId) {
    return memoryStore.agreements?.[orderId] || null;
  },
  setAdminState(adminId, state) {
    memoryStore.adminState[adminId] = state;
    persistStore();
  },
  getAdminState(adminId) {
    return memoryStore.adminState?.[adminId] || null;
  },
  clearAdminState(adminId) {
    delete memoryStore.adminState[adminId];
    persistStore();
  }
};

// Telegram Send Message Helper
export async function sendTelegramMessage(chatId, text, extra = {}) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram send error to ${chatId}:`, err);
    return { ok: false, error: err.message };
  }
}

// Broadcast to all company admins
export async function notifyAdmins(text, extra = {}) {
  const results = [];
  for (const adminId of ADMIN_CHAT_IDS) {
    const res = await sendTelegramMessage(adminId, text, extra);
    results.push(res);
  }
  return results;
}

export { BOT_TOKEN, ADMIN_CHAT_IDS };
