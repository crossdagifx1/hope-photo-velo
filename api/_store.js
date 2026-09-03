// api/_store.js - Shared Data Store & Telegram Utility for HOPE Studio
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8911456945:AAHHDlGW6-7KPsUwMZvLbAX2EHDXDxAwIzw';
const ADMIN_CHAT_IDS = ['5563466567', '5473210957'];
const STORE_FILE = path.join('/tmp', 'hope_studio_db.json');

// Default initial settings and 9 synchronized packages
const DEFAULT_PACKAGES = [
  // ── STUDIO ──
  {
    id: 'studio-session',
    category: 'studio',
    tier: 'basic',
    badgeEn: 'Most Popular',
    badgeAm: 'ተመራጭ',
    badgeOm: 'Filatamaa',
    titleEn: 'Studio Session',
    titleAm: 'የስቱዲዮ ቀረጻ',
    titleOm: 'Waraabbii Istuudiyoo',
    price: 10000,
    deliverablesEn: ['20 Print Photos', '10 Post Photos', 'Professional Makeup', '150 Soft Copies'],
    deliverablesAm: ['20 ፕሪንት ፎቶዎች', '10 ፖስት ፎቶዎች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Suuraalee maxxanfamani 20', 'Suuraalee poostii 10', 'Meek-aappii waliin', 'Soft copy 150']
  },
  {
    id: 'studio-event',
    category: 'studio',
    tier: 'standard',
    badgeEn: 'Best Value',
    badgeAm: 'ተመራጭ ዋጋ',
    badgeOm: 'Gatii Gaarii',
    titleEn: 'Event Coverage',
    titleAm: 'የክስተት ሽፋን',
    titleOm: 'Haguggii Qophii',
    price: 14500,
    deliverablesEn: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies'],
    deliverablesAm: ['የምስጋና ካርዶች (200 ፍሬ)', '40×60 ቦርድ ፎቶ', 'ሜካፕ የተካተተ', '10 ፖስት ፎቶዎች', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Kaardii Galataa (200)', 'Suuraa Boordii 40×60', 'Meek-aappii waliin', 'Suuraalee poostii 10', 'Soft copy 150']
  },
  {
    id: 'studio-production',
    category: 'studio',
    tier: 'premium',
    badgeEn: 'Best Choice',
    badgeAm: 'ምርጥ ምርጫ',
    badgeOm: 'Filannoo Olaanaa',
    titleEn: 'Full Production Suite',
    titleAm: 'ሙሉ ፕሮዳክሽን',
    titleOm: 'Oomisha Guutuu',
    price: 18500,
    deliverablesEn: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies'],
    deliverablesAm: ['30×45 ላሚኔት አልበም (10/20 ገጽ)', '1 ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Kaardii Galataa', 'Meek-aappii', 'Soft copy 150']
  },

  // ── WEDDING VIDEO ──
  {
    id: 'wedding-bronze',
    category: 'wedding',
    tier: 'basic',
    badgeEn: 'Essential Cinema',
    badgeAm: 'መሰረታዊ ሲኒማ',
    badgeOm: 'Sinimaa Bu\'uuraa',
    titleEn: 'Bronze Package',
    titleAm: 'የሰርግ ብሮንዝ ቪዲዮ',
    titleOm: 'Paakeejii Biriinzi',
    price: 45000,
    deliverablesEn: ['2 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Light System', 'Highlight Trailer & Cinema Edit', 'Color Grading', 'All Soft Copies Free'],
    deliverablesAm: ['2 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 2', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara / fiilmii', 'Kalar gireediingii', 'Soft copy guutuu']
  },
  {
    id: 'wedding-silver',
    category: 'wedding',
    tier: 'standard',
    badgeEn: 'Most Popular',
    badgeAm: 'ተመራጭ',
    badgeOm: 'Filatamaa',
    titleEn: 'Silver Package',
    titleAm: 'የሰርግ ሲልቨር ቪዲዮ',
    titleOm: 'Paakeejii Siilvarii',
    price: 60000,
    deliverablesEn: ['3 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Lighting Setup', 'Trailer & Full Cinema Video', 'Color Grading', '40×60 Board Photo', 'All Soft Copies Free'],
    deliverablesAm: ['3 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 3', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Boordii 40×60', 'Soft copy guutuu']
  },
  {
    id: 'wedding-golden-plus',
    category: 'wedding',
    tier: 'premium',
    badgeEn: 'Ultimate Royal Suite',
    badgeAm: 'ልዩ የንግሥና ሱዊት',
    badgeOm: 'Muuxannoo Mootii',
    titleEn: 'Golden Plus Suite',
    titleAm: 'ጎልደን ፕላስ ሱዊት',
    titleOm: 'Paakeejii Warqee Pilaas',
    price: 75000,
    deliverablesEn: ['4 Professional Cameras', 'Ronin Gimbal System', 'Ameran Cinema Light', 'Trailer & Full Cinema Edit', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies Free'],
    deliverablesAm: ['4 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ', '40×60 ቦርድ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 4', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Albaama 30×90', 'Boordii 50×80', 'Boordii 40×60', 'Soft copy guutuu']
  },

  // ── LUXURY MESK & SPECIAL ──
  {
    id: 'mesk-session',
    category: 'mesk',
    tier: 'basic',
    badgeEn: 'Essential Mesk',
    badgeAm: 'የመስክ መነሻ',
    badgeOm: 'Dirree Bu\'uuraa',
    titleEn: 'Mesk Video Session',
    titleAm: 'የመስክ ቪዲዮ ቀረጻ',
    titleOm: 'Waraabbii Dirree',
    price: 16000,
    deliverablesEn: ['Cinematic Mesk Video', '1 Sign Board Photo', '150 High-Res Soft Copies', 'Color Grading & Cinematic Master'],
    deliverablesAm: ['የመስክ ቪዲዮ', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ከለር ግሬዲንግ'],
    deliverablesOm: ['Viidiyoo Dirree', 'Boordii Mallattoo 1', 'Soft copy 150', 'Kalar gireediingii']
  },
  {
    id: 'mesk-album',
    category: 'mesk',
    tier: 'standard',
    badgeEn: 'Best Value',
    badgeAm: 'ተመራጭ',
    badgeOm: 'Filatamaa',
    titleEn: 'Mesk Video & Album',
    titleAm: 'የመስክ ቪዲዮ እና አልበም',
    titleOm: 'Viidiyoo fi Albaama Dirree',
    price: 20000,
    deliverablesEn: ['Cinematic Mesk Video', '30×45 Laminate Album', '1 Sign Board', '150 Soft Copies', 'Cinematic Sound Design'],
    deliverablesAm: ['የመስክ ቪዲዮ', '30×45 ላሚኔት አልበም', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ድምፅ እና ከለር ቅንብር'],
    deliverablesOm: ['Viidiyoo Dirree', 'Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Soft copy 150', 'Qindoomina sagalee']
  },
  {
    id: 'mesk-grand-keepsake',
    category: 'mesk',
    tier: 'premium',
    badgeEn: 'Grand Keepsake',
    badgeAm: 'የዘላቂ ቅርስ ሱዊት',
    badgeOm: 'Seenaa Bara Baraan',
    titleEn: 'Grand Keepsake Suite',
    titleAm: 'ግራንድ ኪፕሴክ ሱዊት',
    titleOm: 'Paakeejii Giraand Kiippiseek',
    price: 23000,
    deliverablesEn: ['30×90 Laminate Album (10/20 Page)', '50×80 Wall Board', '1 Sign Board Photo', '200 Thank-You Cards', '5 Save-the-Date Photos', '150 Soft Copies Free'],
    deliverablesAm: ['30×90 ላሚኔት አልበም (10/20 ገጽ)', '50×80 የሳሎን ግድግዳ ቦርድ', '1 ሳይን ቦርድ', '200 የምስጋና ካርዶች', '5 ሴቭ ዘ ዴት ፎቶዎች', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Albaama Laamineetii 30×90', 'Boordii Girgiddaa 50×80', 'Boordii Mallattoo 1', 'Kaardii Galataa 200', 'Suuraalee Qophii 5', 'Soft copy 150']
  }
];

const DEFAULT_ADDONS = [
  { id: 'drone', name: '4K Aerial Drone Coverage', price: 6000, desc: 'Cinematic aerial footage of church, procession & venue', active: true },
  { id: 'extra-cam', name: 'Extra Cinema Camera Operator', price: 7500, desc: 'Captures spontaneous guest & family reactions', active: true },
  { id: 'rush-edit', name: '48-Hour Rush Video Delivery', price: 5000, desc: 'Priority post-production for immediate sharing', active: true },
  { id: 'wall-board', name: 'Deluxe 50×80 Acrylic Wall Board', price: 4000, desc: 'Museum-grade wall piece for living room', active: true },
  { id: 'makeup', name: 'VIP Bridal Makeup Artist', price: 4500, desc: 'Professional on-location makeup touchups', active: true }
];

let memoryStore = {
  orders: {},
  messages: {},
  agreements: {},
  adminState: {},
  settings: {
    adminPin: 'HOPE2026',
    announcementAm: 'አዲስ አበባ • በፍቅር የተመሠረተ ፎቶግራፊ እና ቪዲዮ',
    announcementEn: 'ADDIS ABABA • BUILT ON LOVE PHOTOGRAPHY & VIDEO',
    announcementOm: 'FINFINNEE • JAALALAAN HUNDEEFFAME PHOTOGRAPHY & VIDEO',
    phone: '09 10 52 69 62',
    packages: DEFAULT_PACKAGES,
    addons: DEFAULT_ADDONS
  }
};

// Seed store from filesystem if available
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    memoryStore = { ...memoryStore, ...parsed };
    if (!memoryStore.settings?.packages?.length) {
      memoryStore.settings = { ...memoryStore.settings, packages: DEFAULT_PACKAGES, addons: DEFAULT_ADDONS };
    }
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
  getSettings() {
    return memoryStore.settings;
  },
  updateSettings(patch) {
    memoryStore.settings = {
      ...memoryStore.settings,
      ...patch
    };
    persistStore();
    return memoryStore.settings;
  },
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
  getAllMessages() {
    return memoryStore.messages || {};
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
  getAgreements() {
    return Object.values(memoryStore.agreements || {});
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
