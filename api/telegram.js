// api/telegram.js - Advanced Telegram Bot Webhook & Interactive Command Engine
import { db, sendTelegramMessage, notifyAdmins, BOT_TOKEN, ADMIN_CHAT_IDS } from './_store.js';

const APP_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://hope-photo-velo-jade.vercel.app';

const PACKAGES_CATALOG = [
  // Wedding Packages
  {
    id: 'wedding-bronze',
    aliases: ['wedding_bronze', 'wedding-bronze-45', 'wedding_bronze_45', 'wedding'],
    titleAm: 'ብሮንዝ ፓኬጅ (2 ካሜራ)',
    titleEn: 'Wedding Bronze Package (2 Cameras)',
    price: 45000,
    priceStr: '45,000',
    category: 'wedding',
    deliverables: [
      '2 ፕሮፌሽናል ካሜራዎች (2 Cameras)',
      'ሮኒን ጊምባል ስቴቢላይዘር (Ronin Gimbal)',
      'አመራን ላይቲንግ (Ameran Light)',
      'ትሬለር ቪዲዮ + ሙሉ ቪዲዮ (Trailer & Full Edit)',
      'ከለር ግሬዲንግ (Color Grading)',
      'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)'
    ]
  },
  {
    id: 'wedding-silver',
    aliases: ['wedding_silver', 'wedding-silver-60', 'wedding_silver_60'],
    titleAm: 'ሲልቨር ፓኬጅ (3 ካሜራ + ቦርድ)',
    titleEn: 'Wedding Silver Package (3 Cameras + Board)',
    price: 60000,
    priceStr: '60,000',
    category: 'wedding',
    deliverables: [
      '3 ፕሮፌሽናል ካሜራዎች (3 Cameras)',
      'ሮኒን ጊምባል ስቴቢላይዘር (Ronin Gimbal)',
      'አመራን ላይቲንግ (Ameran Light)',
      'ትሬለር ቪዲዮ + ሙሉ ቪዲዮ (Trailer & Full Edit)',
      'ከለር ግሬዲንግ (Color Grading)',
      '40×60 ቦርድ ፎቶ (40×60 Board Photo)',
      'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)'
    ]
  },
  {
    id: 'wedding-golden-75',
    aliases: ['wedding-golden', 'wedding_golden', 'wedding_golden_75', 'wedding-gold'],
    titleAm: 'ጎልደን ፕላስ ፓኬጅ (4 ካሜራ + አልበም + 2 ቦርድ)',
    titleEn: 'Wedding Golden Plus Suite (4 Cameras + Album + 2 Boards)',
    price: 75000,
    priceStr: '75,000',
    category: 'wedding',
    deliverables: [
      '4 ፕሮፌሽናል ካሜራዎች (4 Cameras)',
      'ሮኒን ጊምባል + አመራን ላይት (Ronin & Ameran)',
      'ትሬለር ቪዲዮ + ሙሉ ሲኒማ ቪዲዮ (Trailer & Film)',
      '30×90 ላሚኔት አልበም (30×90 Laminate Album)',
      '50×80 ላሚኔት ቦርድ + 40×60 ቦርድ (2 Boards)',
      'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)'
    ]
  },
  // Studio Packages
  {
    id: 'studio-10k',
    aliases: ['studio_10k', 'studio-silver', 'studio_silver', 'studio'],
    titleAm: 'ቤሲክ ስቱዲዮ (20 ፎቶ)',
    titleEn: 'Studio Basic Package (20 Photos)',
    price: 10000,
    priceStr: '10,000',
    category: 'studio',
    deliverables: [
      '20 የታተሙ ፎቶዎች (20 Print Photos)',
      '10 ፖስት ፎቶዎች (10 Post Photos)',
      'ሜካፕ የተካተተ (Professional Makeup)',
      '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)'
    ]
  },
  {
    id: 'studio-145k',
    aliases: ['studio_145k', 'studio-gold', 'studio_gold', 'event-coverage'],
    titleAm: 'ስታንዳርድ ስቱዲዮ (Event Coverage)',
    titleEn: 'Studio Standard Event Coverage',
    price: 14500,
    priceStr: '14,500',
    category: 'studio',
    deliverables: [
      '200 የምስጋና ካርዶች (200 Thank-You Cards)',
      '40×60 ቦርድ ፎቶ (40×60 Board Photo)',
      'ሜካፕ የተካተተ (Professional Makeup)',
      '10 ፖስት ፎቶዎች (10 Post Photos)',
      '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)'
    ]
  },
  {
    id: 'studio-185k',
    aliases: ['studio_185k', 'studio-platinum', 'studio_platinum', 'full-production'],
    titleAm: 'ሙሉ ፕሮዳክሽን (Full Production + አልበም)',
    titleEn: 'Studio Full Production & Album',
    price: 18500,
    priceStr: '18,500',
    category: 'studio',
    deliverables: [
      '30×45 ላሚኔት አልበም (10/20 ገጽ)',
      '1 ሳይን ቦርድ (Sign Board)',
      '200 የምስጋና ካርዶች (200 Thank-You Cards)',
      'ሜካፕ የተካተተ (Professional Makeup)',
      '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)'
    ]
  },
  // Mesk Packages
  {
    id: 'mesk-16k',
    aliases: ['mesk_16k', 'mesk-basic', 'mesk'],
    titleAm: 'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Session)',
    titleEn: 'Mesk Cinematic Video Session',
    price: 16000,
    priceStr: '16,000',
    category: 'mesk',
    deliverables: [
      'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Video)',
      '1 ሳይን ቦርድ (1 Sign Board)',
      '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      'ከለር ግሬዲንግ (Color Grading)'
    ]
  },
  {
    id: 'mesk-20k',
    aliases: ['mesk_20k', 'mesk-album', 'mesk_special'],
    titleAm: 'የመስክ ቪዲዮ እና አልበም (Mesk + Album)',
    titleEn: 'Mesk Video & Album',
    price: 20000,
    priceStr: '20,000',
    category: 'mesk',
    deliverables: [
      'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Video)',
      '30×45 ላሚኔት አልበም (30×45 Laminate Album)',
      '1 ሳይን ቦርድ (1 Sign Board)',
      '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)'
    ]
  },
  {
    id: 'special-23k',
    aliases: ['special_23k', 'grand-keepsake', 'special'],
    titleAm: 'ልዩ የፎቶ ማስታወሻ ፓኬጅ (Special 2)',
    titleEn: 'Grand Keepsake Suite (Special 2)',
    price: 23000,
    priceStr: '23,000',
    category: 'mesk',
    deliverables: [
      '30×90 ላሚኔት አልበም (30×90 Laminate Album)',
      '50×80 ቦርድ ፎቶ (50×80 Board Photo)',
      'ሴቭ ዘ ዴት ካርዶች (Save-The-Date Cards)',
      '200 የምስጋና ካርዶች (200 Thank-You Cards)',
      'ሁሉም ሶፍት ኮፒ (All Soft Copies Free)'
    ]
  },
  {
    id: 'custom',
    aliases: ['custom-inquiry', 'custom_inquiry'],
    titleAm: 'ልዩ የስቱዲዮ ጥያቄ (Custom Inquiry)',
    titleEn: 'Custom / Tailored Production Suite',
    price: 35000,
    priceStr: '35,000',
    category: 'custom',
    deliverables: [
      'የተዘጋጀ የፎቶ እና ቪዲዮ ሽፋን (Customized Coverage)',
      'ፕሮፌሽናል ሲኒማ ካሜራዎች & ጊምባል',
      'የቀለምና የድምፅ ኤዲቲንግ (Grading & Audio)',
      'የስቱዲዮ ማኔጅመንት ቀጥታ ምክክር'
    ]
  }
];

function resolvePackage(rawKey) {
  if (!rawKey) return null;
  const clean = rawKey.toLowerCase().replace(/^order_|^pkg_|^book_|^pricing_/, '').trim();
  const normalized = clean.replace(/_/g, '-');

  // Check static catalog
  const found = PACKAGES_CATALOG.find(p => 
    p.id === clean || 
    p.id === normalized || 
    p.aliases?.includes(clean) || 
    p.aliases?.includes(normalized)
  );
  if (found) return found;

  // Check dynamic db settings
  const dynamicPkgs = db.getSettings?.()?.packages || [];
  const dyn = dynamicPkgs.find(p => p.id === clean || p.id === normalized);
  if (dyn) {
    return {
      id: dyn.id,
      titleAm: dyn.titleAm || dyn.titleEn,
      titleEn: dyn.titleEn || dyn.titleAm,
      price: dyn.price || 20000,
      priceStr: (dyn.price || 20000).toLocaleString(),
      category: dyn.category || 'custom',
      deliverables: dyn.deliverablesAm || dyn.deliverablesEn || ['Complete photo & cinema coverage']
    };
  }

  // Fallback if starts with wedding/studio/mesk
  if (clean.includes('wedding')) return PACKAGES_CATALOG[0];
  if (clean.includes('studio')) return PACKAGES_CATALOG[3];
  if (clean.includes('mesk')) return PACKAGES_CATALOG[6];

  return null;
}

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

  // Track / create chat record
  db.getOrCreateChat(chatId, fromUser);

  // ── 0. CHECK PENDING ADMIN ACTION STATES ──
  const adminState = db.getAdminState(chatId);
  if (adminState && text && !text.startsWith('/')) {
    if (adminState.action === 'awaiting_discount') {
      const order = db.getOrder(adminState.orderId);
      const amount = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (order && amount > 0) {
        const originalPrice = order.negotiatedPrice || order.totalPrice || order.basePrice || 10000;
        const newPrice = Math.max(1000, originalPrice - amount);

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

        await sendTelegramMessage(chatId, `✅ <b>Discount Applied!</b>\nOrder: <code>${order.id}</code>\nDiscount: -${amount.toLocaleString()} ETB\nNew Price: <b>${newPrice.toLocaleString()} ETB</b>\n\nClient notified!`);
        
        // If client has telegramId, notify them
        if (order.telegramUserId) {
          await sendTelegramMessage(order.telegramUserId, `🎉 <b>HOPE Studio Discount Approved!</b>\n\nA special discount of <b>${amount.toLocaleString()} ETB</b> has been granted for your booking <code>${order.id}</code>!\nNew Total: <b>${newPrice.toLocaleString()} ETB</b>\n\nTap below when you are ready to review and sign your official digital agreement:`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: '✍️ Review & Sign Agreement', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}&tab=agreement` } }]
              ]
            }
          });
        }
        return;
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
          await sendTelegramMessage(order.telegramUserId, `💬 <b>HOPE Studio Management:</b>\n\n"${text}"`);
          db.addChatMessage(order.telegramUserId, {
            sender: 'admin',
            senderName: 'HOPE Studio Management',
            text: text
          });
        }
        return;
      }
    } else if (adminState.action === 'awaiting_chat_reply') {
      const targetChatId = adminState.targetChatId;
      if (targetChatId) {
        db.addChatMessage(targetChatId, {
          sender: 'admin',
          senderName: fromUser.first_name || 'HOPE Studio Director',
          text: text
        });

        db.clearAdminState(chatId);
        await sendTelegramMessage(chatId, `✅ <b>Reply Dispatched to Client</b> (Chat <code>${targetChatId}</code>):\n<i>"${text}"</i>`);
        await sendTelegramMessage(targetChatId, `💬 <b>HOPE Studio Management:</b>\n\n"${text}"`);
        return;
      }
    } else if (adminState.action === 'awaiting_chat_discount') {
      const targetChatId = adminState.targetChatId;
      const amount = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (targetChatId && amount > 0) {
        db.addChatMessage(targetChatId, {
          sender: 'admin',
          senderName: fromUser.first_name || 'HOPE Studio Director',
          type: 'discount_offer',
          text: `🎉 A special discount of ${amount.toLocaleString()} ETB has been approved for your booking!`
        });

        db.clearAdminState(chatId);
        await sendTelegramMessage(chatId, `✅ Discount offer of ${amount.toLocaleString()} ETB sent to Chat <code>${targetChatId}</code>.`);
        await sendTelegramMessage(targetChatId, `🎉 <b>HOPE Studio Discount Approved!</b>\n\nA special discount of <b>${amount.toLocaleString()} ETB</b> has been granted for your event! You can continue chatting with us here or request your official agreement link whenever you are ready.`);
        return;
      }
    }
  }

  // ── COMMAND: /start [payload] ──
  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const payload = parts[1] || '';

    // 1. Check if client arrived from website pricing or package selection:
    const matchedPkg = resolvePackage(payload);

    if (matchedPkg) {
      // Register or agree order for this client
      const orderId = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder = db.saveOrder({
        id: orderId,
        clientName: `${fromUser.first_name || 'Client'} ${fromUser.last_name || ''}`.trim(),
        phone: fromUser.username ? `@${fromUser.username}` : `Telegram ID: ${chatId}`,
        packageName: `${matchedPkg.titleAm} (${matchedPkg.titleEn})`,
        packageId: matchedPkg.id,
        category: matchedPkg.category,
        basePrice: matchedPkg.price,
        totalPrice: matchedPkg.price,
        negotiatedPrice: matchedPkg.price,
        status: 'pending_agreement',
        telegramUserId: String(chatId),
        eventDate: 'To be confirmed in chat',
        location: 'Addis Ababa',
        deliverables: matchedPkg.deliverables
      });

      // Link chat
      db.getOrCreateChat(chatId, fromUser);
      db.linkChatToOrder(chatId, newOrder.id);
      db.addChatMessage(chatId, {
        sender: 'system',
        senderName: 'HOPE System',
        text: `Customer selected package ${matchedPkg.titleAm} (${matchedPkg.priceStr} ETB) from website. Order: ${newOrder.id}`
      });

      const agreeUrl = `${APP_URL}?tma=1&order_id=${newOrder.id}&tab=agreement`;
      const delivText = matchedPkg.deliverables.slice(0, 5).map(d => `  • ${d}`).join('\n');

      const orderConfirmMsg = `✨ <b>እንኳን ወደ HOPE Photo & Velo በደህና መጡ!</b>\n` +
        `<i>Welcome to HOPE Photo & Velo Studio!</i>\n\n` +
        `📋 <b>ከድረ-ገጹ የመረጡት ፓኬጅ / Your Selected Package:</b>\n` +
        `📦 <b>${matchedPkg.titleAm}</b>\n` +
        `💰 <b>ዋጋ / Price: ${matchedPkg.priceStr} ETB</b>\n` +
        `🆔 <b>የትእዛዝ መለያ / Order ID:</b> <code>${newOrder.id}</code>\n\n` +
        `✨ <b>የተካተቱ ዋና ዋና አገልግሎቶች:</b>\n${delivText}\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `✍️ <b>ይፋዊ ውልዎን በዲጂታል ፊርማ ለማጠናቀቅ፡</b>\n` +
        `ከታች ያለውን <b>'✍️ ውሉን ፈርመው ያጠናቁ (Sign Agreement)'</b> የሚለውን ይጫኑ። ውሉን አንብበው በቀጥታ በዲጂታል ፊርማ ያጠናቅቃሉ።\n\n` +
        `💬 <b>ዋጋ ለመደራደር ወይም ጥያቄ ለመጠየቅ፡</b>\n` +
        `ልዩ ቅናሽ ወይም ተጨማሪ አገልግሎት ከፈለጉ በቀጥታ እዚህ በቴሌግራም ይጻፉልን — ማኔጅመንታችን ወዲያውኑ ይመልስልዎታል።`;

      await sendTelegramMessage(chatId, orderConfirmMsg, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✍️ ውሉን ፈርመው ያጠናቁ (Sign Agreement)', web_app: { url: agreeUrl } }
            ],
            [
              { text: '💬 ዋጋ ይደራደሩ (Negotiate Discount)', callback_data: `reply_chat:${chatId}` },
              { text: '📞 ይደውሉ (Call Studio)', url: 'tel:+251910526962' }
            ]
          ]
        }
      });

      // Immediate alert to company directors
      const adminOrderAlert = `🔔 <b>አዲስ ቀጠሮ ከድረ-ገጹ (Website Pricing Order)!</b>\n\n` +
        `👤 <b>ደንበኛ:</b> ${fromUser.first_name || 'Client'} ${fromUser.last_name || ''} (@${fromUser.username || 'N/A'})\n` +
        `🆔 <b>Chat ID:</b> <code>${chatId}</code>\n` +
        `📦 <b>ፓኬጅ:</b> ${matchedPkg.titleAm}\n` +
        `💰 <b>ዋጋ:</b> ${matchedPkg.priceStr} ETB\n` +
        `🔖 <b>Order ID:</b> <code>${newOrder.id}</code>\n` +
        `📋 <b>ሁኔታ:</b> ውል ለመፈረም በመጠባበቅ ላይ (Awaiting Signature)\n\n` +
        `<i>ደንበኛው የውል መፈረሚያ ሊንክ ተልኮለታል። እዚህ ጋር ቀጥታ መወያየት ይችላሉ።</i>`;

      await notifyAdmins(adminOrderAlert, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💬 መልስ ይጻፉ (Reply)', callback_data: `reply_chat:${chatId}` },
              { text: '🏷️ ቅናሽ ይስጡ (Discount)', callback_data: `discount_chat:${chatId}` }
            ],
            [
              { text: '📜 ውል በድጋሚ ላኩ (Resend Agreement)', callback_data: `agree_chat:${chatId}` }
            ]
          ]
        }
      });
      return;
    }

    // 2. Check if existing order ID (e.g. order_HOPE-1234 or sign_HOPE-1234)
    if (payload.startsWith('order_') || payload.startsWith('sign_')) {
      const orderId = payload.replace('order_', '').replace('sign_', '');
      const existingOrder = db.getOrder(orderId);
      const targetUrl = `${APP_URL}?tma=1&order_id=${orderId}&tab=agreement`;

      if (existingOrder) {
        // Link client's Telegram to this order
        db.updateOrder(orderId, {
          telegramUserId: chatId,
          telegramUsername: fromUser.username || ''
        });
        db.linkChatToOrder(chatId, orderId);

        const clientGreeting = existingOrder.clientName ? `ሰላም ${existingOrder.clientName}` : `ሰላም`;
        const orderSummaryMsg = `👋 <b>${clientGreeting}! እንኳን ወደ HOPE Photo & Velo በደህና መጡ።</b>\n\n` +
          `📸 የቀጠሮ መረጃዎ እና የመረጡት ፓኬጅ ዝርዝር በስኬት ተመዝግቧል:\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `👤 <b>ሙሉ ስም (Client):</b> ${existingOrder.clientName || 'N/A'}\n` +
          `📞 <b>ስልክ (Phone):</b> ${existingOrder.phone || 'N/A'}\n` +
          `📅 <b>የቀጠሮ ቀን (Event Date):</b> ${existingOrder.eventDate || 'N/A'}\n` +
          `📝 <b>የዝግጅት አይነት / ማስታወሻ:</b> ${existingOrder.notes || 'N/A'}\n` +
          `📦 <b>የመረጡት ፓኬጅ:</b> ${existingOrder.packageName}\n` +
          `💰 <b>ይፋዊ ዋጋ (Total Price):</b> <b>${(existingOrder.negotiatedPrice || existingOrder.totalPrice || 0).toLocaleString()} ETB</b>\n` +
          `🔖 <b>የትእዛዝ መለያ (Order ID):</b> <code>${orderId}</code>\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n` +
          `✍️ <b>ይፋዊ ውልዎን በዲጂታል ፊርማ ለማጠናቀቅ፡</b>\n` +
          `ከታች ያለውን <b>'✍️ ውሉን ፈርመው ያጠናቁ (Sign Agreement)'</b> የሚለውን ይጫኑ። ውሉ በራስ-ሰር በመረጃዎ ተሞልቶ የቀረበ ሲሆን በስልክዎ ላይ በቀጥታ በዲጂታል ፊርማ ያጠናቅቃሉ።\n\n` +
          `💬 <b>ዋጋ ለመደራደር ወይም ጥያቄ ለመጠየቅ፡</b>\n` +
          `ልዩ ቅናሽ ወይም ተጨማሪ አገልግሎት ከፈለጉ በቀጥታ እዚህ በቴሌግራም ይጻፉልን — ማኔጅመንታችን ወዲያውኑ ይመልስልዎታል።`;

        await sendTelegramMessage(chatId, orderSummaryMsg, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✍️ ውሉን ፈርመው ያጠናቁ (Sign Agreement)', web_app: { url: targetUrl } }],
              [
                { text: '💬 ዋጋ ይደራደሩ (Negotiate Discount)', callback_data: `reply_chat:${chatId}` },
                { text: '📞 ይደውሉ (Call Studio)', url: 'tel:+251910526962' }
              ]
            ]
          }
        });

        // Notify management that client with full info is in the bot!
        const adminNotice = `🔔 <b>ደንበኛ መረጃውን ሞልቶ ቦቱ ጋር ደርሷል (Client Joined Bot with Info)!</b>\n\n` +
          `👤 <b>ስም:</b> ${existingOrder.clientName}\n` +
          `📞 <b>ስልክ:</b> ${existingOrder.phone}\n` +
          `📅 <b>ቀን:</b> ${existingOrder.eventDate}\n` +
          `📝 <b>ማስታወሻ:</b> ${existingOrder.notes || 'N/A'}\n` +
          `📦 <b>ፓኬጅ:</b> ${existingOrder.packageName}\n` +
          `💰 <b>ዋጋ:</b> ${(existingOrder.negotiatedPrice || existingOrder.totalPrice || 0).toLocaleString()} ETB\n` +
          `🔖 <b>Order ID:</b> <code>${orderId}</code>\n` +
          `🆔 <b>Telegram:</b> @${fromUser.username || 'N/A'} (<code>${chatId}</code>)\n\n` +
          `<i>ደንበኛው የውል መፈረሚያ ሊንክ ተልኮለታል። እዚህ ጋር ቀጥታ ማናገር ወይም ቅናሽ መስጠት ይችላሉ።</i>`;

        await notifyAdmins(adminNotice, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '💬 መልስ ይጻፉ (Reply)', callback_data: `reply_chat:${chatId}` },
                { text: '🏷️ ቅናሽ ይስጡ (Discount)', callback_data: `discount_chat:${chatId}` }
              ],
              [
                { text: '📜 ውል በድጋሚ ላኩ (Resend Agreement)', callback_data: `agree_chat:${chatId}` }
              ]
            ]
          }
        });
        return;
      } else {
        // Fallback for cold start or direct link
        const fallbackMsg = `✨ <b>Welcome to HOPE Photo & Velo!</b>\n\n` +
          `Your official booking reference: <code>${orderId}</code>\n\n` +
          `👇 Tap below to review contract terms and sign with your digital signature:`;
        await sendTelegramMessage(chatId, fallbackMsg, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✍️ Review & Sign Agreement', web_app: { url: targetUrl } }],
              [{ text: '📞 Call Studio', url: 'tel:+251910526962' }]
            ]
          }
        });
        return;
      }
    }

    if (payload.startsWith('chat_')) {
      const orderId = payload.replace('chat_', '');
      const targetUrl = `${APP_URL}?tma=1&order_id=${orderId}&tab=chat`;
      await sendTelegramMessage(chatId, `💬 Chat session for Order <b>${orderId}</b> opened. Tap below or type your message here:`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💬 Open Mini App Chat', web_app: { url: targetUrl } }]
          ]
        }
      });
      return;
    }

    // Standard client welcome: DIRECT BOT CHAT & NEGOTIATION
    const clientWelcomeMsg = `✨ <b>እንኳን ወደ HOPE Photo & Velo በደህና መጡ!</b>\n` +
      `<i>Welcome to HOPE Photo & Velo Studio!</i>\n` +
      `<i>Moments pass — we make them last forever.</i>\n\n` +
      `💬 <b>ቀጥታ ከስቱዲዮው ማኔጅመንት ጋር እዚህ መወያየት ይችላሉ!</b>\n` +
      `ስለ ሰርግዎ፣ ስቱዲዮ ወይም የመስክ ፎቶ እና ቪዲዮ ዋጋዎችን ይጠይቁ፣ ልዩ ቅናሽ ይደራደሩ ወይም ጥያቄዎን ይላኩልን።\n\n` +
      `<i>You can negotiate and chat directly with HOPE Studio management right here in this bot! Tell us about your event, discuss packages, or request custom discounts.</i>\n\n` +
      `👇 <b>አማራጮችን ይምረጡ ወይም ጥያቄዎን በቀጥታ ይጻፉልን፡</b>`;

    const clientKeyboard = [
      [
        { text: '📸 የፓኬጆች ዝርዝር & ዋጋ (Packages)', callback_data: 'cmd:packages' }
      ],
      [
        { text: '💬 ከማኔጅመንት ጋር ያውሩ (Chat)', callback_data: 'cmd:chat_prompt' },
        { text: '📞 ይደውሉ (Call)', url: 'tel:+251910526962' }
      ]
    ];

    if (isAdmin) {
      clientKeyboard.push([
        { text: '👑 Admin: View Orders (/orders)', callback_data: 'admin:orders' }
      ]);
    }

    await sendTelegramMessage(chatId, clientWelcomeMsg, {
      reply_markup: { inline_keyboard: clientKeyboard }
    });
    return;
  }

  // ── COMMAND: /orders (Admins only) ──
  if (text === '/orders' && isAdmin) {
    await sendOrdersList(chatId);
    return;
  }

  // ── COMMAND: /discount <order_id_or_chat_id> <amount> (Admins only) ──
  if (text.startsWith('/discount') && isAdmin) {
    const [, targetId, amountStr] = text.split(/\s+/);
    if (!targetId || !amountStr) {
      await sendTelegramMessage(chatId, '⚠️ Usage: <code>/discount &lt;order_id_or_chat_id&gt; &lt;amount_in_etb&gt;</code>\nExample: <code>/discount HOPE-1024 2000</code> or <code>/discount 5563466567 2000</code>');
      return;
    }

    const amount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    const order = db.getOrder(targetId);

    if (order) {
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

      if (order.telegramUserId) {
        await sendTelegramMessage(order.telegramUserId, `🎉 <b>HOPE Studio Discount Approved!</b>\n\nA special discount of <b>${amount.toLocaleString()} ETB</b> has been granted for your booking <code>${order.id}</code>!\nNew Total: <b>${newPrice.toLocaleString()} ETB</b>\n\nTap below when you are ready to review and sign your official digital agreement:`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✍️ Review & Sign Agreement', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}&tab=agreement` } }]
            ]
          }
        });
      }

      await sendTelegramMessage(chatId, `✅ <b>Discount Applied!</b>\nOrder: <code>${order.id}</code>\nDiscount: -${amount.toLocaleString()} ETB\nNew Price: <b>${newPrice.toLocaleString()} ETB</b>`);
      return;
    } else {
      // Treat as direct chat ID
      db.addChatMessage(targetId, {
        sender: 'admin',
        senderName: fromUser.first_name || 'HOPE Management',
        type: 'discount_offer',
        text: `🎉 A special discount of ${amount.toLocaleString()} ETB was granted!`
      });
      await sendTelegramMessage(targetId, `🎉 <b>HOPE Studio Discount Approved!</b>\n\nA special discount of <b>${amount.toLocaleString()} ETB</b> has been granted for your event coverage!`);
      await sendTelegramMessage(chatId, `✅ Discount of ${amount.toLocaleString()} ETB sent to Chat <code>${targetId}</code>.`);
      return;
    }
  }

  // ── COMMAND: /reply <target_id> <msg> (Admins only) ──
  if (text.startsWith('/reply') && isAdmin) {
    const parts = text.split(/\s+/);
    const targetId = parts[1];
    const replyText = parts.slice(2).join(' ');

    if (!targetId || !replyText) {
      await sendTelegramMessage(chatId, '⚠️ Usage: <code>/reply &lt;order_id_or_chat_id&gt; &lt;message&gt;</code>\nExample: <code>/reply HOPE-1024 We confirmed your date!</code> or <code>/reply 5563466567 Hello Dawit!</code>');
      return;
    }

    const order = db.getOrder(targetId);
    if (order) {
      db.addMessage(order.id, {
        sender: 'admin',
        senderName: fromUser.first_name || 'HOPE Management',
        text: replyText
      });

      if (order.telegramUserId) {
        await sendTelegramMessage(order.telegramUserId, `💬 <b>HOPE Studio Management:</b>\n\n"${replyText}"`);
        db.addChatMessage(order.telegramUserId, {
          sender: 'admin',
          senderName: 'HOPE Studio Management',
          text: replyText
        });
      }
      await sendTelegramMessage(chatId, `✅ Reply sent to customer on order <code>${order.id}</code>.`);
      return;
    } else {
      // Send directly to chat ID
      db.addChatMessage(targetId, {
        sender: 'admin',
        senderName: fromUser.first_name || 'HOPE Management',
        text: replyText
      });
      await sendTelegramMessage(targetId, `💬 <b>HOPE Studio Management:</b>\n\n"${replyText}"`);
      await sendTelegramMessage(chatId, `✅ Reply sent to Chat <code>${targetId}</code>.`);
      return;
    }
  }

  // ── REGULAR CLIENT DIRECT CHAT MESSAGE ──
  if (!isAdmin) {
    // 1. Record in chat store
    db.addChatMessage(chatId, {
      sender: 'client',
      senderName: fromUser.first_name || 'Client',
      text: text
    });

    // 2. Alert company admins on Telegram
    const clientFullName = `${fromUser.first_name || 'Client'} ${fromUser.last_name || ''}`.trim();
    const userTag = fromUser.username ? `@${fromUser.username}` : 'No username';
    const alertText = `💬 <b>አዲስ የደንበኛ መልእክት (Direct Client Chat)!</b>\n\n` +
      `👤 <b>ደንበኛ:</b> ${clientFullName} (${userTag})\n` +
      `🆔 <b>Chat ID:</b> <code>${chatId}</code>\n` +
      `💬 <i>"${text}"</i>\n\n` +
      `👇 ፈጣን ምላሽ ለመስጠት:`;

    await notifyAdmins(alertText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💬 መልስ ይጻፉ (Reply)', callback_data: `reply_chat:${chatId}` },
            { text: '🏷️ ቅናሽ ይስጡ (Discount)', callback_data: `discount_chat:${chatId}` }
          ],
          [
            { text: '📜 ይፋዊ ውል ላኩ (Agreement)', callback_data: `agree_chat:${chatId}` }
          ]
        ]
      }
    });

    // 3. Polite direct acknowledgment to client
    await sendTelegramMessage(chatId, `✅ <b>መልእክትዎ ደርሶናል!</b>\nውድ <b>${fromUser.first_name || 'ደንበኛ'}</b>፣ መልእክትዎ ለ HOPE ስቱዲዮ ማኔጅመንት ደርሷል። በአጭር ጊዜ ውስጥ እዚህ በቀጥታ ምላሽ እንሰጥዎታለን።\n\n<i>Message received! HOPE Studio management will reply to you directly right here in this chat shortly.</i>`);
    return;
  }

  // Admin fallback help
  if (isAdmin) {
    await sendTelegramMessage(chatId, `👑 <b>HOPE Studio Admin Commands:</b>\n\n` +
      `• <code>/orders</code> - List all pending and active bookings\n` +
      `• <code>/discount &lt;order_or_chat_id&gt; &lt;amount&gt;</code> - Apply discount\n` +
      `• <code>/reply &lt;order_or_chat_id&gt; &lt;message&gt;</code> - Send message to customer\n` +
      `• <code>/start</code> - Launch / Test bot welcome`);
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
    await sendTelegramMessage(chatId, `📸 <b>HOPE Photo & Velo - ዋና ዋና ፓኬጆች (Main Packages):</b>\n\n` +
      `✨ <b>1. የስቱዲዮ ቀረጻ (Studio Sessions)</b>\n` +
      `• Basic: 10,000 ETB (20 Print, 10 Post, ሜካፕ, 150 Soft Copies)\n` +
      `• Event: 14,500 ETB (200 Cards, 40×60 Board, ሜካፕ)\n` +
      `• Full Suite: 18,500 ETB (30×45 Laminate Album, Sign Board)\n\n` +
      `🎬 <b>2. የሰርግ ሲኒማቲክ ቪዲዮ (Wedding Video)</b>\n` +
      `• Bronze: 45,000 ETB (2 Cinema Cameras, Ronin, Lights, Trailer)\n` +
      `• Silver: 60,000 ETB (3 Cameras, 40×60 Board Photo, Trailer)\n` +
      `• Golden Plus: 75,000 ETB (4 Cameras, 30×90 Album, 50×80 Wall Board)\n\n` +
      `🌿 <b>3. የመስክ እና ልዩ ቀረጻ (Luxury Mesk)</b>\n` +
      `• Session: 16,000 ETB • Album: 20,000 ETB • Grand Keepsake: 23,000 ETB\n\n` +
      `💬 <b>ዋጋ ለመደራደር ወይም ጥያቄ ለመጠየቅ ከታች ይጻፉልን!</b>`);
    return;
  }

  if (data === 'cmd:chat_prompt') {
    await sendTelegramMessage(chatId, `💬 <b>ጥያቄዎን ወይም የሚፈልጉትን አገልግሎት እዚህ ይጻፉልን፡</b>\nየሰርጉን ቀን፣ ቦታውን ወይም የሚፈልጉትን ፓኬጅ ቢነግሩን ወዲያውኑ የዋጋ ግምት እና ምላሽ እንሰጥዎታለን።`);
    return;
  }

  if (data === 'admin:orders') {
    await sendOrdersList(chatId);
    return;
  }

  // ── ADMIN QUICK CHAT ACTIONS ──
  if (data.startsWith('reply_chat:')) {
    const targetChatId = data.replace('reply_chat:', '');
    db.setAdminState(chatId, { action: 'awaiting_chat_reply', targetChatId });
    await sendTelegramMessage(chatId, `💬 <b>ለደንበኛ (Chat <code>${targetChatId}</code>) የሚልኩትን መልእክት ይጻፉ፡</b>\nእዚህ የሚልኩት መልእክት ቀጥታ ለደንበኛው ቴሌግራም ይደርሰዋል።`);
    return;
  }

  if (data.startsWith('discount_chat:')) {
    const targetChatId = data.replace('discount_chat:', '');
    db.setAdminState(chatId, { action: 'awaiting_chat_discount', targetChatId });
    await sendTelegramMessage(chatId, `🏷️ <b>ለደንበኛ (Chat <code>${targetChatId}</code>) የሚሰጡትን የቅናሽ መጠን በብር ይጻፉ (ምሳሌ፡ <code>2500</code>):</b>`);
    return;
  }

  if (data.startsWith('agree_chat:')) {
    const targetChatId = data.replace('agree_chat:', '');
    const chat = db.getChat(targetChatId);
    const clientName = chat?.firstName || 'Valued Client';

    // Create or find order for this chat
    let orderId = chat?.orderId;
    let order = orderId ? db.getOrder(orderId) : null;
    if (!order) {
      order = db.saveOrder({
        clientName,
        telegramUserId: String(targetChatId),
        telegramUsername: chat?.username || '',
        packageName: 'HOPE Studio Custom Package',
        totalPrice: 60000,
        negotiatedPrice: 60000,
        status: 'pending_quote'
      });
      db.linkChatToOrder(targetChatId, order.id);
    }

    // Send agreement button to client
    await sendTelegramMessage(targetChatId, `📜 <b>የ HOPE ስቱዲዮ ይፋዊ የአገልግሎት ውል ተዘጋጅቷል!</b>\n\nውድ <b>${clientName}</b>፣ ለእርስዎ የተዘጋጀውን ይፋዊ ውል ለማየት እና በዲጂታል ፊርማዎ ለማረጋገጥ ከታች ያለውን ይጫኑ፡\n\n<i>Your official service contract for order <code>${order.id}</code> is ready for electronic signature:</i>`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✍️ ውሉን ይፈርሙ (Sign in Mini App)', web_app: { url: `${APP_URL}?tma=1&order_id=${order.id}&tab=agreement` } }]
        ]
      }
    });

    await sendTelegramMessage(chatId, `✅ <b>የውል መፈራረሚያ ሊንክ ለደንበኛ (Order <code>${order.id}</code>) ተልኳል!</b>`);
    return;
  }

  // Existing order callbacks
  if (data.startsWith('discount:')) {
    const orderId = data.replace('discount:', '');
    db.setAdminState(chatId, { action: 'awaiting_discount', orderId });
    await sendTelegramMessage(chatId, `🏷️ <b>Apply Discount for Order <code>${orderId}</code></b>\n\nPlease type the discount amount in ETB to deduct (e.g. <code>2000</code> or <code>3500</code>):`);
    return;
  }

  if (data.startsWith('reply:')) {
    const orderId = data.replace('reply:', '');
    db.setAdminState(chatId, { action: 'awaiting_reply', orderId });
    await sendTelegramMessage(chatId, `💬 <b>Reply to Client (Order <code>${orderId}</code>)</b>\n\nPlease type your message below. It will appear directly in the client's chat:`);
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

