// Shared Data Store & Telegram Utility for HOPE Studio
import fs from 'fs';
import path from 'path';

// ── Security: BOT TOKEN must ONLY come from environment variable ──────────
// NEVER hardcode the token in source code. Set it in Vercel → Project → Settings → Environment Variables
// Key: TELEGRAM_BOT_TOKEN
// Value: <your token>  (kept secret, never committed to git)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('[SECURITY] TELEGRAM_BOT_TOKEN environment variable is not set. Telegram features will be disabled.');
}

const ADMIN_CHAT_IDS = ['5563466567', '5473210957'];
const STORE_FILE = path.join('/tmp', 'hope_studio_db.json');

// ── 9 DEFAULT AGREEMENTS matching physical ወ•ል contracts ──────────────────
const DEFAULT_AGREEMENTS_9 = [
  {
    id: 'agr-studio-10k',
    name: 'Studio Package — Basic',
    packageTitle: 'Studio Package',
    price: 10000,
    category: 'studio',
    photoRef: 'photo_2026-09-10_05-43-52.jpg',
    deliverables: [
      '1 ቤሎ በመረጡት ዓይነት (1 Photographer)',
      '1 ሱፍ በመረጡት ዓይነት (1 Videographer)',
      'የህበሻ ልብስ (Habesha Dress included)',
      'ካባ',
      '20 Print Photo',
      '10 Post Photo',
      'Makeup (ሜካፕ)',
      'ጥፍር (Nail)',
      'ፀጉር (Hair)',
      '150 Soft Copy',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ (50% Advance)\n2. ከዴት ሹት መልስ (Balance after shoot)\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ10,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} በ {eventDate} ቀን {packageTitle} አገልግሎት ከ10,000 ብር ጀምሮ ያቀርባል። ዝርዝሩ ከላይ እንደ ተዘርዘረው ነው።', bodyEn: 'HOPE Pictures agrees to provide {packageTitle} services for {clientName} on {eventDate} at {agreedPrice} ETB as itemized above.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ ዋጋ {agreedPrice} ብር። ቅድሚያ ክፍያ {depositAmount} ብር (50%) ሲወሰዱ። ቀሪ {remainingBalance} ብር ቀረጻ ሲጠናቀቅ።', bodyEn: 'Total: {agreedPrice} ETB. Advance deposit {depositAmount} ETB upon signing. Remaining {remainingBalance} ETB upon delivery.' },
      { headingAm: '3. የርክክብ ጊዜ', headingEn: '3. Delivery Timeline', bodyAm: 'ሶፍት ኮፒ ፎቶዎች በ 3-5 ቀናት፣ አልበሞች እና ቦርዶች በ 2-4 ሳምንት ውስጥ ይረከባሉ።', bodyEn: 'Soft copy photos delivered within 3-5 days. Albums and boards within 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: 'ቀን ለውጥ ቢያስፈልግ ቢያንስ 7 ቀናት ቀደም ብሎ ሊሳወቅ ይገባል። ክፍት ቀናት ካሉ ያለ ተጨማሪ ክፍያ ቀን ይቀየራል።', bodyEn: 'Rescheduling requires 7-day advance notice. Subject to studio availability at no extra charge.' },
    ],
  },
  {
    id: 'agr-studio-14500',
    name: 'Studio Package — Event',
    packageTitle: 'Studio Package',
    price: 14500,
    category: 'studio',
    photoRef: 'photo_2026-09-10_05-43-31.jpg',
    deliverables: [
      '2 ቤሎ በመረጡት ዓይነት (2 Photographers)',
      '2 ሱፍ በመረጡት ዓይነት (2 Videographers)',
      'የህበሻ ልብስ',
      'ካባ',
      'Thank you Card 200',
      'Board Photo 40×60',
      'Makeup (ሜካፕ)',
      'ጥፍር',
      'ፀጉር',
      '150 Soft Copy',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ14,500 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} በ {eventDate} ቀን Studio Event Package አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures agrees to provide Studio Event Package services for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ ዋጋ {agreedPrice} ብር። ቅድሚያ {depositAmount} ብር ሲወሰዱ። ቀሪ {remainingBalance} ብር ቀረጻ ሲጠናቀቅ።', bodyEn: 'Total {agreedPrice} ETB. Advance {depositAmount} ETB at signing. Balance {remainingBalance} ETB on delivery.' },
      { headingAm: '3. የርክክብ ጊዜ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት፣ ህትመቶች 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days, prints 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ብሎ ማሳወቅ ሊገባ ነው። ሁኔታ ሲፈቅድ ያለ ተጨማሪ ክፍያ ቀን ይቀየራል።', bodyEn: '7-day advance notice required. Subject to availability.' },
    ],
  },
  {
    id: 'agr-studio-18500',
    name: 'Studio Package — Full Production',
    packageTitle: 'Studio Package',
    price: 18500,
    category: 'studio',
    photoRef: 'photo_2026-09-10_05-43-47.jpg',
    deliverables: [
      '2 ቤሎ በመረጡት ዓይነት',
      '2 ሱፍ በመረጡት ዓይነት',
      'የህበሻ ልብስ',
      'ካባ',
      'Laminate Album 30×45 — 10(20) Page',
      'Sign Board 1',
      'Thank you Card 200',
      'Makeup (ሜካፕ)',
      'ጥፍር',
      'ፀጉር',
      '150 Soft Copy',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ18,500 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope of Service', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Studio Full Production Package ያቀርባል።', bodyEn: 'HOPE Pictures provides Studio Full Production Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ ሁኔታ', headingEn: '2. Payment Terms', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount} ብር። ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice} ETB. Advance {depositAmount} ETB. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም እና ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums & boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ብሎ ማሳወቅ ያስፈልጋል።', bodyEn: '7-day advance notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-special-23k',
    name: 'Special Package 2 (Mesk & Studio) — 23,000',
    packageTitle: 'Special Package (Mesk & Studio)',
    price: 23000,
    category: 'mesk',
    photoRef: 'photo_2026-09-10_05-43-41.jpg',
    deliverables: [
      'Laminate Album 30×45 — 10(20) Page',
      '50×80 Board',
      'Sign Board 1',
      'Thank you Card — 200',
      'Soft copy 150',
      'Save the date 5 photo',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'ካባ (በመረጠት ዓይነት)',
      'የአበሻ ቁሜስ ጩምሮ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'የወንድ የውብት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ23,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Special Package (Mesk & Studio) አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Special Package (Mesk & Studio) for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice required.' },
    ],
  },
  {
    id: 'agr-special-27k',
    name: 'Special Package 2 (Mesk & Studio) — 27,000',
    packageTitle: 'Special Package (Mesk & Studio)',
    price: 27000,
    category: 'mesk',
    photoRef: 'photo_2026-09-10_05-43-36.jpg',
    deliverables: [
      'Laminate Album 30×90 — 10(20) Page',
      '50×80 Board',
      'Sign Board 1',
      'Thank you Card — 200',
      'Soft copy 150',
      'Save the date 5 photo',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'ካባ (በመረጠት ዓይነት)',
      'የአበሻ ቁሜስ ጩምሮ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'የወንድ የውብት ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ27,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Special Package (Mesk & Studio) አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Special Package (Mesk & Studio) for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice required.' },
    ],
  },
  {
    id: 'agr-luxury-34k',
    name: 'Luxury Package — 34,000',
    packageTitle: 'Luxury Package (4ቤሎ እና ሜካፕ የZH)',
    price: 34000,
    category: 'mesk',
    photoRef: 'photo_2026-09-10_05-43-25.jpg',
    deliverables: [
      'Mesk video',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 6Pc',
      'Board Photo 40×60-1',
      'Sign Board 1',
      'Thank you Card — 200',
      'Save the date 5 photo',
      'Slideshow',
      'All soft copy',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'ካባ (በመረጠት ዓይነት)',
      'የፍሪካ ልብስ',
      'የአበሻ ቁሜስ',
      'የሴት ቁሜስ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'የወንድ የውብ ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ34,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Luxury Package አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Luxury Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-40k',
    name: 'Luxury Package — 40,000',
    packageTitle: 'Luxury Package (4ቤሎ እና ሜካፕ የZH)',
    price: 40000,
    category: 'mesk',
    photoRef: 'photo_2026-09-10_05-43-15.jpg',
    deliverables: [
      'Mesk video',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 8pc',
      'Board Photo 50×80 (ወሰ ሜዲዓቃ ቱ)',
      'Sign Board 1',
      'Thank you Card — 200',
      'Save the date 5 photo',
      'Slideshow',
      'All soft copy',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት) 1 color',
      'ካባ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'አበባ የሜስክ እና ስቃዴዩ (1)',
      'የአበሻ ቁሜስ',
      'የሴት ቁሜስ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'የወንድ የውብ ሳሎን',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ40,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Luxury Package 40K አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Luxury Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-50k',
    name: 'Luxury Package — 50,000',
    packageTitle: 'Luxury Package (4ቤሎ እና ሜካፕ የZH)',
    price: 50000,
    category: 'wedding',
    photoRef: 'photo_2026-09-10_05-42-59.jpg',
    deliverables: [
      'Mesk video',
      'Laminate Album 30×90 — 10(20) Page',
      'Hexagon Board 8pc',
      'Board Photo 120×60',
      'Board Photo 40×60',
      'Sign Board 1',
      'Thank you Card — 200',
      'Save the date 5 photo',
      'Slideshow',
      'All soft copy',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት) 1 color',
      'ካባ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'አበባ የሜስክ እና ስቃዴዩ (1)',
      'የአበሻ ቁሜስ',
      'የሴት ቁሜስ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'የወንድ የውብ ሳሎን ጩምሮ',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ50,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Luxury Package 50K አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Luxury Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
  {
    id: 'agr-luxury-70k',
    name: 'Luxury Package — 70,000 (Grand)',
    packageTitle: 'Luxury Package (4ቤሎ እና ሜካፕ የZH)',
    price: 70000,
    category: 'wedding',
    photoRef: 'photo_2026-09-10_05-43-20.jpg',
    deliverables: [
      'Mesk video',
      'Laminate Album 30×90 — 10(20) Page',
      'Board Photo 120×60',
      'Board Photo 40×60',
      'Hexagon Board 8pc',
      'Frame size board (6 - pc)',
      'Sign Board 1',
      'Thank you Card — 200',
      'Save the date 5 photo',
      'Slideshow',
      'All soft copy',
      'የሰርግ አልባሳት',
      '2 ቤሎ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት) 1 color',
      'ካባ (በመረጠት ዓይነት)',
      '2 ሱፍ (በመረጠት ዓይነት)',
      'አበባ የሜስክ እና ስቃዴዩ (1)',
      'የአበሻ ቁሜስ',
      'የሴት ቁሜስ',
      'ሜካፕ',
      'ጥፍር',
      'ፀጉር',
      'Transport',
      'የወንድ የውብ ሳሎን ጩምሮ',
      'የሜስክ ቦታ መጋቢሶ ክፍያ',
    ],
    paymentTerms: 'ክፍያው በሁለት ጊዜ ሲሆን:\n1. ወሎን ሲወስዱ\n2. ከዴት ሹት መልስ\n3. ወዛ ተወሳሽ አይሆንም',
    totalNote: 'ይህን ሁሱ ብ70,000 ብር ብቻ',
    clauses: [
      { headingAm: '1. የአገልግሎት ወሰን', headingEn: '1. Scope', bodyAm: 'ሆፕ ፒክቸርስ ለ {clientName} Luxury Grand Package አገልግሎት ያቀርባል።', bodyEn: 'HOPE Pictures provides Luxury Grand Package for {clientName} on {eventDate}.' },
      { headingAm: '2. ክፍያ', headingEn: '2. Payment', bodyAm: 'ጠቅላላ {agreedPrice} ብር። ቅድሚያ {depositAmount}፣ ቀሪ {remainingBalance} ብር።', bodyEn: 'Total {agreedPrice}. Advance {depositAmount}. Balance {remainingBalance} ETB.' },
      { headingAm: '3. ርክክብ', headingEn: '3. Delivery', bodyAm: 'ሶፍት ኮፒ 3-5 ቀናት። አልበም/ቦርድ 2-4 ሳምንት።', bodyEn: 'Soft copies 3-5 days. Albums/boards 2-4 weeks.' },
      { headingAm: '4. ቀን ለውጥ', headingEn: '4. Rescheduling', bodyAm: '7 ቀናት ቀደም ማሳወቅ ያስፈልጋል።', bodyEn: '7-day notice for rescheduling.' },
    ],
  },
];

// Default initial settings and 9 synchronized packages
const DEFAULT_PACKAGES = [
  { id: 'studio-session', category: 'studio', tier: 'basic', badgeEn: 'Most Popular', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Studio Session', titleAm: 'የስቱዲዮ ቀረጻ', titleOm: 'Waraabbii Istuudiyoo', price: 10000, deliverablesEn: ['20 Print Photos', '10 Post Photos', 'Professional Makeup', '150 Soft Copies'], deliverablesAm: ['20 ፕሪንት ፎቶዎች', '10 ፖስት ፎቶዎች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Suuraalee maxxanfamani 20', 'Suuraalee poostii 10', 'Meek-aappii waliin', 'Soft copy 150'] },
  { id: 'studio-event', category: 'studio', tier: 'standard', badgeEn: 'Best Value', badgeAm: 'ተመራጭ ዋጋ', badgeOm: 'Gatii Gaarii', titleEn: 'Event Coverage', titleAm: 'የክስተት ሽፋን', titleOm: 'Haguggii Qophii', price: 14500, deliverablesEn: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies'], deliverablesAm: ['የምስጋና ካርዶች (200 ፍሬ)', '40×60 ቦርድ ፎቶ', 'ሜካፕ የተካተተ', '10 ፖስት ፎቶዎች', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Kaardii Galataa (200)', 'Suuraa Boordii 40×60', 'Meek-aappii waliin', 'Suuraalee poostii 10', 'Soft copy 150'] },
  { id: 'studio-production', category: 'studio', tier: 'premium', badgeEn: 'Best Choice', badgeAm: 'ምርጥ ምርጫ', badgeOm: 'Filannoo Olaanaa', titleEn: 'Full Production Suite', titleAm: 'ሙሉ ፕሮዳክሽን', titleOm: 'Oomisha Guutuu', price: 18500, deliverablesEn: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies'], deliverablesAm: ['30×45 ላሚኔት አልበም (10/20 ገጽ)', '1 ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Kaardii Galataa', 'Meek-aappii', 'Soft copy 150'] },
  { id: 'wedding-bronze', category: 'wedding', tier: 'basic', badgeEn: 'Essential Cinema', badgeAm: 'መሰረታዊ ሲኒማ', badgeOm: 'Sinimaa Bu\'uuraa', titleEn: 'Bronze Package', titleAm: 'የሰርግ ብሮንዝ ቪዲዮ', titleOm: 'Paakeejii Biriinzi', price: 45000, deliverablesEn: ['2 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Light System', 'Highlight Trailer & Cinema Edit', 'Color Grading', 'All Soft Copies Free'], deliverablesAm: ['2 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 2', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara / fiilmii', 'Kalar gireediingii', 'Soft copy guutuu'] },
  { id: 'wedding-silver', category: 'wedding', tier: 'standard', badgeEn: 'Most Popular', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Silver Package', titleAm: 'የሰርግ ሲልቨር ቪዲዮ', titleOm: 'Paakeejii Siilvarii', price: 60000, deliverablesEn: ['3 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Lighting Setup', 'Trailer & Full Cinema Video', 'Color Grading', '40×60 Board Photo', 'All Soft Copies Free'], deliverablesAm: ['3 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 3', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Boordii 40×60', 'Soft copy guutuu'] },
  { id: 'wedding-golden-plus', category: 'wedding', tier: 'premium', badgeEn: 'Ultimate Royal Suite', badgeAm: 'ልዩ የንግሥና ሱዊት', badgeOm: 'Muuxannoo Mootii', titleEn: 'Golden Plus Suite', titleAm: 'ጎልደን ፕላስ ሱዊት', titleOm: 'Paakeejii Warqee Pilaas', price: 75000, deliverablesEn: ['4 Professional Cameras', 'Ronin Gimbal System', 'Ameran Cinema Light', 'Trailer & Full Cinema Edit', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies Free'], deliverablesAm: ['4 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ', '40×60 ቦርድ', 'ሙሉ ሶፍት ኮፒ በነጻ'], deliverablesOm: ['Kaameraa 4', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Albaama 30×90', 'Boordii 50×80', 'Boordii 40×60', 'Soft copy guutuu'] },
  { id: 'mesk-session', category: 'mesk', tier: 'basic', badgeEn: 'Essential Mesk', badgeAm: 'የመስክ መነሻ', badgeOm: 'Dirree Bu\'uuraa', titleEn: 'Mesk Video Session', titleAm: 'የመስክ ቪዲዮ ቀረጻ', titleOm: 'Waraabbii Dirree', price: 16000, deliverablesEn: ['Cinematic Mesk Video', '1 Sign Board Photo', '150 High-Res Soft Copies', 'Color Grading & Cinematic Master'], deliverablesAm: ['የመስክ ቪዲዮ', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ከለር ግሬዲንግ'], deliverablesOm: ['Viidiyoo Dirree', 'Boordii Mallattoo 1', 'Soft copy 150', 'Kalar gireediingii'] },
  { id: 'mesk-album', category: 'mesk', tier: 'standard', badgeEn: 'Best Value', badgeAm: 'ተመራጭ', badgeOm: 'Filatamaa', titleEn: 'Mesk Video & Album', titleAm: 'የመስክ ቪዲዮ እና አልበም', titleOm: 'Viidiyoo fi Albaama Dirree', price: 20000, deliverablesEn: ['Cinematic Mesk Video', '30×45 Laminate Album', '1 Sign Board', '150 Soft Copies', 'Cinematic Sound Design'], deliverablesAm: ['የመስክ ቪዲዮ', '30×45 ላሚኔት አልበም', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ድምፅ እና ከለር ቅንብር'], deliverablesOm: ['Viidiyoo Dirree', 'Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Soft copy 150', 'Qindoomina sagalee'] },
  { id: 'mesk-grand-keepsake', category: 'mesk', tier: 'premium', badgeEn: 'Grand Keepsake', badgeAm: 'የዘላቂ ቅርስ ሱዊት', badgeOm: 'Seenaa Bara Baraan', titleEn: 'Grand Keepsake Suite', titleAm: 'ግራንድ ኪፕሴክ ሱዊት', titleOm: 'Paakeejii Giraand Kiippiseek', price: 23000, deliverablesEn: ['30×90 Laminate Album (10/20 Page)', '50×80 Wall Board', '1 Sign Board Photo', '200 Thank-You Cards', '5 Save-the-Date Photos', '150 Soft Copies Free'], deliverablesAm: ['30×90 ላሚኔት አልበም (10/20 ገጽ)', '50×80 የሳሎን ግድግዳ ቦርድ', '1 ሳይን ቦርድ', '200 የምስጋና ካርዶች', '5 ሴቭ ዘ ዴት ፎቶዎች', '150 ሶፍት ኮፒዎች'], deliverablesOm: ['Albaama Laamineetii 30×90', 'Boordii Girgiddaa 50×80', 'Boordii Mallattoo 1', 'Kaardii Galataa 200', 'Suuraalee Qophii 5', 'Soft copy 150'] },
];

const DEFAULT_ADDONS = [
  { id: 'drone', name: '4K Aerial Drone Coverage', price: 6000, desc: 'Cinematic aerial footage of church, procession & venue', active: true },
  { id: 'extra-cam', name: 'Extra Cinema Camera Operator', price: 7500, desc: 'Captures spontaneous guest & family reactions', active: true },
  { id: 'rush-edit', name: '48-Hour Rush Video Delivery', price: 5000, desc: 'Priority post-production for immediate sharing', active: true },
  { id: 'wall-board', name: 'Deluxe 50×80 Acrylic Wall Board', price: 4000, desc: 'Museum-grade wall piece for living room', active: true },
  { id: 'makeup', name: 'VIP Bridal Makeup Artist', price: 4500, desc: 'Professional on-location makeup touchups', active: true }
];

const DEFAULT_PAYMENT_ACCOUNTS = {
  telebirr: {
    accountName: 'HOPE Photo & Velo (Director)',
    phone: '09 10 52 69 62',
    rawPhone: '0910526962',
    instructionsAm: 'በቴሌብር መተግበሪያ ወይም በ *127# ወደ 0910526962 የ 50% ቅድሚያ ክፍያ ይላኩ። የደረሰኝ ስክሪንሾት (Screenshot) እዚህ ጋር ይጫኑ።',
    instructionsEn: 'Transfer 50% advance deposit via Telebirr App or *127# to 0910526962. Upload confirmation screenshot here.',
    instructionsOm: 'Mobaayilii Telebirr ykn *127# fayyadamuun kaffaltii dursaa 50% lakk. 0910526962 irratti ergaa. Suuraa nagahee asitti dhiheessaa.'
  },
  cbe: {
    bankName: 'Commercial Bank of Ethiopia (የኢትዮጵያ ንግድ ባንክ)',
    accountName: 'HOPE PHOTO AND VELO STUDIO',
    accountNumber: '1000542389123',
    branch: 'Hayahulet Branch (ሃያ ሁለት)',
    instructionsAm: 'በ CBE Birr ወይም በሞባይል ባንኪንግ ወደ አካውንት 1000542389123 50% ቅድሚያ ክፍያ ያስገቡ። የተጠናቀቀውን የዝውውር ደረሰኝ ስክሪንሾት ይጫኑ።',
    instructionsEn: 'Transfer 50% deposit to CBE Account 1000542389123 (Hayahulet Branch). Upload receipt screenshot.',
    instructionsOm: 'Baankii Daldala Itiyoophiyaatiin (CBE) lakk. herregaa 1000542389123 irratti kaffalaa. Nagahee suuraan ol-fe\'aa.'
  }
};

const DEFAULT_CONTRACT_TEMPLATE = {
  titleAm: 'የይፋዊ አገልግሎት እና የፎቶግራፊ ስምምነት ውል',
  titleEn: 'Official Photography & Videography Service Agreement',
  termsVersion: 'v3.2-2026',
  clauses: [
    { id: 'scope', headingEn: '1. Scope of Creative Production', headingAm: '1. የአገልግሎት አሰጣጥ እና የቴክኖሎጂ ሽፋን', bodyEn: 'HOPE Photo & Velo agrees to provide professional cinematography and fine-art photography services for the celebration of {clientName} on {eventDate} in {location}. The production covers all deliverables specified under {packageName}: {deliverables}.', bodyAm: 'ሆፕ (HOPE Photo & Velo) ለ {clientName} በ {eventDate} ቀን በ {location} ለሚከናወነው በዓል በ {packageName} ስር የተካተቱትን ሙሉ የሲኒማቲክ ቪዲዮ እና የፎቶግራፊ አገልግሎቶች ({deliverables}) በሙያዊ ብቃት ለማስረከብ ተስማምቷል።' },
    { id: 'financial', headingEn: '2. Investment & Settlement Schedule', headingAm: '2. የክፍያ ሁኔታ እና ቅድሚያ ክፍያ ማረጋገጫ', bodyEn: 'The agreed total service fee is {agreedPrice} ETB. To guarantee schedule reservation, a non-refundable 50% advance booking deposit of {depositAmount} ETB is required upon signing. The remaining balance of {remainingBalance} ETB shall be settled upon delivery of master deliverables.', bodyAm: 'ጠቅላላ የተስማማው የአገልግሎት ክፍያ {agreedPrice} የኢትዮጵያ ብር ነው። የቀኑን ምዝገባ ለማረጋገጥ 50% ቅድሚያ ክፍያ ({depositAmount} ETB) በቴሌብር ወይም በኢትዮጵያ ንግድ ባንክ ይፈጸማል። ቀሪው {remainingBalance} ETB ቀረጻ ሲጠናቀቅ የሚጠናቀቅ ይሆናል።' },
    { id: 'delivery', headingEn: '3. Archival Turnaround & Quality Guarantee', headingAm: '3. የርክክብ ጊዜ እና የጥራት ዋስትና', bodyEn: 'Initial soft-copy proofs are made accessible within 3 to 5 business days following the event. Fully color-graded 4K/8K cinema films, laminated albums, and board displays are carefully delivered within 2 to 4 weeks.', bodyAm: 'የመጀመሪያዎቹ ሶፍት ኮፒ ፎቶዎች በ 3-5 የሥራ ቀናት ውስጥ የሚረከቡ ሲሆን፤ በከፍተኛ ጥራት የተሰሩ ላሚኔት አልበሞች፣ የቦርድ ፎቶዎች እና የተቀነባበሩ ሲኒማቲክ ቪዲዮዎች በ 2-4 ሳምንታት ውስጥ ይረከባሉ።' },
    { id: 'cooperation', headingEn: '4. Mutual Commitment & Schedule Respect', headingAm: '4. የጋራ ትብብር እና የቀጠሮ አክብሮት', bodyEn: 'Both parties commit to mutual schedule discipline. The client ensures reasonable venue access for lighting and camera equipment. Should unavoidable date shifts occur, HOPE provides complimentary rescheduling subject to studio availability.', bodyAm: 'ሁለቱም ወገኖች ለተመደበው የቀረጻ ሰዓትና ቦታ የጋራ ትብብር ያደርጋሉ። በድንገተኛ ምክንያት የቀን ለውጥ ቢያጋጥም ክፍት ቀናት እስካሉ ድረስ ያለተጨማሪ ቅጣት ቀን ይተላለፋል።' },
  ]
};

let memoryStore = {
  orders: {},
  messages: {},
  chats: {},
  agreements: {},
  customAgreements: {},
  adminState: {},
  settings: {
    adminPin: 'HOPE2026',
    announcementAm: 'አዲስ አበባ • በፍቅር የተመሠረተ ፎቶግራፊ እና ቪዲዮ',
    announcementEn: 'ADDIS ABABA • BUILT ON LOVE PHOTOGRAPHY & VIDEO',
    announcementOm: 'FINFINNEE • JAALALAAN HUNDEEFFAME PHOTOGRAPHY & VIDEO',
    phone: '09 10 52 69 62',
    packages: DEFAULT_PACKAGES,
    addons: DEFAULT_ADDONS,
    paymentAccounts: DEFAULT_PAYMENT_ACCOUNTS,
    contractTemplate: DEFAULT_CONTRACT_TEMPLATE,
    defaultAgreements9: DEFAULT_AGREEMENTS_9,
    blackoutDates: ['2026-09-12', '2026-09-13', '2026-09-20']
  }
};

// Seed store from filesystem if available
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    memoryStore = { ...memoryStore, ...parsed };
    if (!memoryStore.chats) memoryStore.chats = {};
    if (!memoryStore.customAgreements) memoryStore.customAgreements = {};
    if (!memoryStore.settings?.packages?.length) {
      memoryStore.settings = { ...memoryStore.settings, packages: DEFAULT_PACKAGES, addons: DEFAULT_ADDONS };
    }
    if (!memoryStore.settings?.defaultAgreements9?.length) {
      memoryStore.settings.defaultAgreements9 = DEFAULT_AGREEMENTS_9;
    }
  }
} catch (e) {
  console.warn('Store init notice:', e.message);
}

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a0897f96e95fef';

export async function syncFromCloud() {
  try {
    const res = await fetch(CLOUD_SYNC_URL);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.chats) {
        if (!memoryStore.chats) memoryStore.chats = {};
        for (const [cid, chat] of Object.entries(json.data.chats)) {
          if (!memoryStore.chats[cid]) {
            memoryStore.chats[cid] = chat;
          } else {
            const existingIds = new Set((memoryStore.chats[cid].messages || []).map(m => m.id));
            for (const msg of (chat.messages || [])) {
              if (!existingIds.has(msg.id)) {
                memoryStore.chats[cid].messages.push(msg);
              }
            }
            if (new Date(chat.lastMessageAt || 0) > new Date(memoryStore.chats[cid].lastMessageAt || 0)) {
              memoryStore.chats[cid].lastMessage = chat.lastMessage;
              memoryStore.chats[cid].lastMessageAt = chat.lastMessageAt;
            }
            if (chat.orderId && !memoryStore.chats[cid].orderId) {
              memoryStore.chats[cid].orderId = chat.orderId;
            }
            if (chat.unreadCount !== undefined) {
              memoryStore.chats[cid].unreadCount = chat.unreadCount;
            }
          }
        }
      }
      if (json.data?.orders) {
        if (!memoryStore.orders) memoryStore.orders = {};
        for (const [oid, ord] of Object.entries(json.data.orders)) {
          if (!memoryStore.orders[oid]) {
            memoryStore.orders[oid] = ord;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[CLOUD_SYNC] read error:', e.message);
  }
}

export async function syncToCloud() {
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'hope_studio_master_store',
        data: {
          chats: memoryStore.chats || {},
          orders: memoryStore.orders || {}
        }
      })
    });
  } catch (e) {
    console.warn('[CLOUD_SYNC] write error:', e.message);
  }
}

function persistStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) { /* Read-only filesystem fallback */ }
}

export const db = {
  syncFromCloud,
  syncToCloud,
  getSettings() { return memoryStore.settings; },
  updateSettings(patch) {
    memoryStore.settings = { ...memoryStore.settings, ...patch };
    persistStore();
    return memoryStore.settings;
  },
  getOrders() {
    return Object.values(memoryStore.orders || {}).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getOrder(id) { return memoryStore.orders?.[id] || null; },
  saveOrder(order) {
    if (!order.id) order.id = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
    if (!order.createdAt) order.createdAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    memoryStore.orders[order.id] = order;
    if (order.telegramUserId) db.linkChatToOrder(order.telegramUserId, order.id);
    persistStore();
    return order;
  },
  updateOrder(id, patch) {
    if (!memoryStore.orders[id]) return null;
    memoryStore.orders[id] = { ...memoryStore.orders[id], ...patch, updatedAt: new Date().toISOString() };
    persistStore();
    return memoryStore.orders[id];
  },
  getMessages(orderId) { return memoryStore.messages?.[orderId] || []; },
  getAllMessages() { return memoryStore.messages || {}; },
  addMessage(orderId, msg) {
    if (!memoryStore.messages[orderId]) memoryStore.messages[orderId] = [];
    const messageObj = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      orderId,
      sender: msg.sender || 'client',
      senderName: msg.senderName || 'Anonymous',
      text: msg.text || '',
      type: msg.type || 'text',
      data: msg.data || null,
      timestamp: new Date().toISOString()
    };
    memoryStore.messages[orderId].push(messageObj);
    persistStore();
    return messageObj;
  },

  // ── UNIFIED TELEGRAM BOT CHATS ──
  getOrCreateChat(chatId, userInfo = {}) {
    if (!memoryStore.chats) memoryStore.chats = {};
    const idStr = String(chatId);
    if (!memoryStore.chats[idStr]) {
      memoryStore.chats[idStr] = {
        chatId: idStr,
        userId: userInfo.id ? String(userInfo.id) : idStr,
        firstName: userInfo.first_name || userInfo.firstName || 'Client',
        lastName: userInfo.last_name || userInfo.lastName || '',
        username: userInfo.username || '',
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        orderId: null,
        messages: []
      };
    } else {
      if (userInfo.first_name || userInfo.firstName) memoryStore.chats[idStr].firstName = userInfo.first_name || userInfo.firstName;
      if (userInfo.last_name || userInfo.lastName) memoryStore.chats[idStr].lastName = userInfo.last_name || userInfo.lastName;
      if (userInfo.username) memoryStore.chats[idStr].username = userInfo.username;
    }
    persistStore();
    return memoryStore.chats[idStr];
  },
  getAllChats() {
    if (!memoryStore.chats) memoryStore.chats = {};
    return Object.values(memoryStore.chats).sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
  },
  getChat(chatId) {
    if (!memoryStore.chats) memoryStore.chats = {};
    return memoryStore.chats[String(chatId)] || null;
  },
  addChatMessage(chatId, msg) {
    const idStr = String(chatId);
    const chat = db.getOrCreateChat(idStr, { firstName: msg.senderName, first_name: msg.senderName });
    const messageObj = {
      id: 'cmsg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      chatId: idStr,
      sender: msg.sender || 'client',
      senderName: msg.senderName || (msg.sender === 'admin' ? 'HOPE Studio Management' : chat.firstName || 'Client'),
      text: msg.text || '',
      type: msg.type || 'text',
      data: msg.data || null,
      timestamp: new Date().toISOString()
    };
    if (!chat.messages) chat.messages = [];
    chat.messages.push(messageObj);
    chat.lastMessage = msg.text || (msg.type === 'agreement_link' ? '📜 Agreement link sent' : 'Message');
    chat.lastMessageAt = messageObj.timestamp;
    if (msg.sender !== 'admin' && msg.sender !== 'system') {
      chat.unreadCount = (chat.unreadCount || 0) + 1;
    } else if (msg.sender === 'admin') {
      chat.unreadCount = 0;
    }
    persistStore();
    return messageObj;
  },
  markChatRead(chatId) {
    const chat = db.getChat(chatId);
    if (chat) { chat.unreadCount = 0; persistStore(); }
    return chat;
  },
  linkChatToOrder(chatId, orderId) {
    const chat = db.getOrCreateChat(chatId);
    chat.orderId = orderId;
    persistStore();
    return chat;
  },

  // ── AGREEMENTS ──
  saveAgreement(agreement) {
    if (!agreement.id) agreement.id = 'AGR-' + Math.floor(10000 + Math.random() * 90000);
    agreement.signedAt = new Date().toISOString();
    memoryStore.agreements[agreement.orderId] = agreement;
    persistStore();
    return agreement;
  },
  getAgreement(orderId) { return memoryStore.agreements?.[orderId] || null; },
  getAgreements() { return Object.values(memoryStore.agreements || {}); },

  // ── CUSTOM AGREEMENTS (admin-created per-client) ──
  saveCustomAgreement(agr) {
    if (!memoryStore.customAgreements) memoryStore.customAgreements = {};
    if (!agr.id) agr.id = 'CAGR-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    agr.createdAt = agr.createdAt || new Date().toISOString();
    agr.updatedAt = new Date().toISOString();
    memoryStore.customAgreements[agr.id] = agr;
    persistStore();
    return agr;
  },
  getCustomAgreement(id) {
    if (!memoryStore.customAgreements) return null;
    return memoryStore.customAgreements[id] || null;
  },
  getAllCustomAgreements() {
    if (!memoryStore.customAgreements) return [];
    return Object.values(memoryStore.customAgreements).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getDefaultAgreements9() {
    return memoryStore.settings?.defaultAgreements9 || DEFAULT_AGREEMENTS_9;
  },
  updateDefaultAgreement(id, patch) {
    if (!memoryStore.settings.defaultAgreements9) memoryStore.settings.defaultAgreements9 = [...DEFAULT_AGREEMENTS_9];
    const idx = memoryStore.settings.defaultAgreements9.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryStore.settings.defaultAgreements9[idx] = { ...memoryStore.settings.defaultAgreements9[idx], ...patch };
      persistStore();
      return memoryStore.settings.defaultAgreements9[idx];
    }
    return null;
  },

  // ── ADMIN STATE ──
  setAdminState(adminId, state) { memoryStore.adminState[adminId] = state; persistStore(); },
  getAdminState(adminId) { return memoryStore.adminState?.[adminId] || null; },
  clearAdminState(adminId) { delete memoryStore.adminState[adminId]; persistStore(); },

  // ── BLACKOUT DATES ──
  getBlackoutDates() { return memoryStore.settings?.blackoutDates || []; },
  toggleBlackoutDate(dateStr) {
    if (!memoryStore.settings.blackoutDates) memoryStore.settings.blackoutDates = [];
    const idx = memoryStore.settings.blackoutDates.indexOf(dateStr);
    if (idx >= 0) memoryStore.settings.blackoutDates.splice(idx, 1);
    else { memoryStore.settings.blackoutDates.push(dateStr); memoryStore.settings.blackoutDates.sort(); }
    persistStore();
    return memoryStore.settings.blackoutDates;
  },
  setBlackoutDates(dates) {
    memoryStore.settings.blackoutDates = Array.isArray(dates) ? dates : [];
    persistStore();
    return memoryStore.settings.blackoutDates;
  },

  // ── CONTRACT TEMPLATE ──
  getContractTemplate() { return memoryStore.settings?.contractTemplate || DEFAULT_CONTRACT_TEMPLATE; },
  updateContractTemplate(patch) {
    memoryStore.settings.contractTemplate = { ...DEFAULT_CONTRACT_TEMPLATE, ...(memoryStore.settings.contractTemplate || {}), ...patch };
    persistStore();
    return memoryStore.settings.contractTemplate;
  },

  // ── PAYMENT ACCOUNTS ──
  getPaymentAccounts() { return memoryStore.settings?.paymentAccounts || DEFAULT_PAYMENT_ACCOUNTS; },
  updatePaymentAccounts(accs) {
    memoryStore.settings.paymentAccounts = { ...DEFAULT_PAYMENT_ACCOUNTS, ...(memoryStore.settings.paymentAccounts || {}), ...accs };
    persistStore();
    return memoryStore.settings.paymentAccounts;
  },

  // ── PACKAGES ──
  addPackage(pkg) {
    if (!pkg.id) pkg.id = 'pkg-' + Date.now();
    memoryStore.settings.packages = [...(memoryStore.settings.packages || []), pkg];
    persistStore();
    return memoryStore.settings.packages;
  },
  updatePackage(id, patch) {
    const pkgs = memoryStore.settings.packages || [];
    const idx = pkgs.findIndex(p => p.id === id);
    if (idx !== -1) { pkgs[idx] = { ...pkgs[idx], ...patch }; memoryStore.settings.packages = [...pkgs]; persistStore(); return pkgs[idx]; }
    return null;
  },
  deletePackage(id) {
    memoryStore.settings.packages = (memoryStore.settings.packages || []).filter(p => p.id !== id);
    persistStore();
    return memoryStore.settings.packages;
  }
};

// ── TELEGRAM HELPERS ──
export async function sendTelegramMessage(chatId, text, extra = {}) {
  if (!BOT_TOKEN) {
    console.warn('[SECURITY] sendTelegramMessage called but TELEGRAM_BOT_TOKEN is not set.');
    return { ok: false, error: 'Bot token not configured' };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra })
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram message error to ${chatId}:`, err.message);
    return { ok: false, error: err.message };
  }
}

export async function sendTelegramPhoto(chatId, photoUrlOrBase64, caption = '', extra = {}) {
  try {
    if (typeof photoUrlOrBase64 === 'string' && photoUrlOrBase64.startsWith('data:image/')) {
      const match = photoUrlOrBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
        const buffer = Buffer.from(match[2], 'base64');
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', new Blob([buffer], { type: `image/${ext}` }), `receipt.${ext}`);
        if (caption) formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
        if (extra.reply_markup) formData.append('reply_markup', typeof extra.reply_markup === 'string' ? extra.reply_markup : JSON.stringify(extra.reply_markup));
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
        const json = await res.json();
        if (json.ok) return json;
      }
    } else if (typeof photoUrlOrBase64 === 'string' && photoUrlOrBase64.startsWith('http')) {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo: photoUrlOrBase64, caption, parse_mode: 'HTML', ...extra })
      });
      const json = await res.json();
      if (json.ok) return json;
    }
    return await sendTelegramMessage(chatId, (caption ? caption + '\n\n' : '') + '📷 <i>[Receipt screenshot attached]</i>', extra);
  } catch (err) {
    return await sendTelegramMessage(chatId, caption, extra);
  }
}

export async function notifyAdmins(text, extra = {}) {
  const results = [];
  for (const adminId of ADMIN_CHAT_IDS) {
    results.push(await sendTelegramMessage(adminId, text, extra));
  }
  return results;
}

export async function notifyAdminsPhoto(photoUrlOrBase64, caption = '', extra = {}) {
  const results = [];
  for (const adminId of ADMIN_CHAT_IDS) {
    results.push(await sendTelegramPhoto(adminId, photoUrlOrBase64, caption, extra));
  }
  return results;
}

export { BOT_TOKEN, ADMIN_CHAT_IDS, DEFAULT_CONTRACT_TEMPLATE, DEFAULT_PAYMENT_ACCOUNTS, DEFAULT_AGREEMENTS_9 };
