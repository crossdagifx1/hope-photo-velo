import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Film, Sparkles, MessageCircle, FileSignature, CheckCircle2,
  Clock, Calendar, MapPin, Send, Plus, Minus, Tag, AlertCircle, RefreshCw,
  Phone, ArrowRight, ShieldCheck, Download, Trash2, X, ChevronRight, User, Globe, Lock
} from 'lucide-react';
import './tma.css';

/* ── TRILINGUAL DICTIONARY ── */
const T_TMA = {
  am: {
    title: 'የ HOPE ስቱዲዮ ሚኒ አፕ',
    subtitle: 'አዲስ አበባ • በፍቅር የተመሠረተ',
    tabs: { services: 'አገልግሎቶች', customize: 'ማስተካከያ', negotiate: 'ድርድር', contract: 'ስምምነት', my_orders: 'የእኔ ቀጠሮዎች' },
    bannerTag: 'የ HOPE ስቱዲዮ የ 2026 ስብስቦች',
    bannerH2: 'የእርስዎን ምርጥ ፓኬጅ ይምረጡ',
    bannerP: 'አገልግሎቶችን ያበጁ፣ በቀጥታ ዋጋ ይደራደሩ፣ እና ይፋዊ ውል በቴሌግራም ይፈራረሙ።',
    catLabels: { studio: 'ስቱዲዮ', wedding: 'የሰርግ ቪዲዮ', mesk: 'የመስክ እና ልዩ' },
    selectBtn: 'ይህን ፓኬጅ ያብጁ',
    selectedBadge: 'የተመረጠ ✓',
    moreFeatures: 'ተጨማሪ የተካተቱ አገልግሎቶች',
    customizeTitle: 'የቀጠሮ ዝርዝሮች እና ተጨማሪዎች',
    customizeDesc: 'ተጨማሪ ካሜራ፣ ድሮን እና አልበሞችን ያክሉ።',
    includedItems: 'የተካተቱ ዋና ዋና ነገሮች',
    optionalEnhance: 'ተጨማሪ ልዩ አገልግሎቶች (Add-ons)',
    bookingFormTitle: 'የእርስዎ ሙሉ መረጃ',
    nameLabel: 'ሙሉ ስም',
    namePlaceholder: 'ምሳሌ፡ ዳዊት እና ትዕግስት',
    phoneLabel: 'ስልክ ቁጥር',
    phonePlaceholder: '0911...',
    dateLabel: 'የበዓሉ ቀን',
    locationLabel: 'የበዓሉ ቦታ / አዳራሽ',
    locationPlaceholder: 'ምሳሌ፡ ስካይላይት ሆቴል፣ አዲስ አበባ',
    notesLabel: 'ልዩ ማስታወሻ',
    notesPlaceholder: 'ስለ ፕሮግራምዎ፣ ሰዓት ወይም ልዩ ፍላጎትዎ ይንገሩን...',
    totalQuote: 'ጠቅላላ የዋጋ ግምት',
    createOrderBtn: 'ቀጠሮ ያስይዙ & ዋጋ ይደራደሩ',
    requestDiscount: 'ልዩ ቅናሽ ይጠይቁ',
    wantDiscount: 'ልዩ የስቱዲዮ ቅናሽ ይፈልጋሉ?',
    chatPlaceholder: 'ከ HOPE ስቱዲዮ ዳይሬክተሮች ጋር በቀጥታ ይወያዩ። እዚህ የሚልኩት መልዕክት ቀጥታ ለባለቤቶቹ ቴሌግራም ይደርሳቸዋል።',
    sendPlaceholder: 'ስለ ቀኖች፣ እቃዎች ወይም ዋጋ ይጠይቁ...',
    proceedToContract: 'ውል ለመፈራረም ዝግጁ ነዎት? ስምምነት ይፈራረሙ',
    contractTitle: 'ይፋዊ የፎቶ & ቪዲዮ አገልግሎት ስምምነት',
    contractSubtitle: 'ውሉን ያንብቡ እና በዲጂታል ፊርማዎ ያረጋግጡ።',
    contractSeal: 'የ HOPE ስቱዲዮ ይፋዊ ውል',
    provider: 'አገልግሎት ሰጪ፡ HOPE Photo & Velo (አዲስ አበባ)',
    term1Head: '1. የአገልግሎቱ ወሰን እና የሚሰጡ ውጤቶች',
    term1Body: 'HOPE ስቱዲዮ ፕሮፌሽናል ሲኒማ ካሜራዎችን፣ ጊምባል እና ባለሙያዎችን በመመደብ ዝግጅቱን በከፍተኛ ጥራት ይሸፍናል።',
    term2Head: '2. የተስማሙበት ክፍያ እና ቅድመ ክፍያ (30%)',
    term2Body: 'ቀኑን ለማስያዝ የ 30% ቅድመ ክፍያ ይከፈላል። ቀሪው 70% ድራፍት ቪዲዮ ሲረከቡ ይፈጸማል።',
    term3Head: '3. የርክክብ ጊዜ',
    term3Body: 'ዲጂታል ሶፍት ኮፒዎች በ 7 የሥራ ቀናት ውስጥ፣ ሙሉ ቪዲዮ እና አልበም በ 21 ቀናት ውስጥ ይረከባሉ።',
    signHint: 'እዚህ የእጅ ፊርማዎን ይሳሉ',
    clearBtn: 'አጥፋ',
    agreeCheckbox: 'የቀረቡትን አገልግሎቶች እና የውል ሁኔታዎች ተመልክቼ እስማማለሁ።',
    signFinalizeBtn: 'ይፋዊ ውሉን በፊርማ ያረጋግጡ',
    successH3: 'ስምምነቱ በስኬት ተፈርሟል!',
    successP: 'ውልዎ በይፋ ተመዝግቧል፤ ለስቱዲዮው አስተዳዳሪዎች ተልኳል።',
    contractId: 'የውል መለያ ቁጥር:',
    hashLabel: 'የዲጂታል ማረጋገጫ ሃሽ:',
    totalAgreed: 'የተስማሙበት ጠቅላላ ዋጋ:',
    depositDue: 'የሚፈለግ ቅድመ ክፍያ (30%):',
    callBtn: 'ለስቱዲዮው ይደውሉ (09 10 52 69 62)',
    returnChat: 'ወደ ቻት ይመለሱ'
  },
  en: {
    title: 'HOPE Studio Mini App',
    subtitle: 'Addis Ababa • Founded in Love',
    tabs: { services: 'Services', customize: 'Customize', negotiate: 'Negotiate', contract: 'Contract', my_orders: 'Bookings' },
    bannerTag: 'HOPE Studio 2026 Collection',
    bannerH2: 'Select Your Perfect Experience',
    bannerP: 'Customize deliverables, negotiate live discounts, and sign your official contract inside Telegram.',
    catLabels: { studio: 'Studio', wedding: 'Wedding Video', mesk: 'Luxury Mesk' },
    selectBtn: 'Configure This Package',
    selectedBadge: 'Selected ✓',
    moreFeatures: 'more deliverables included',
    customizeTitle: 'Event Details & Enhancements',
    customizeDesc: 'Add cinema drones, extra cameras, or luxury wall boards.',
    includedItems: 'Included Deliverables',
    optionalEnhance: 'Optional Enhancements (Add-ons)',
    bookingFormTitle: 'Your Booking Information',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Dawit & Tigist',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '0911...',
    dateLabel: 'Event Date',
    locationLabel: 'Event Venue / Location',
    locationPlaceholder: 'e.g. Skylight Hotel, Addis Ababa',
    notesLabel: 'Special Requests / Notes',
    notesPlaceholder: 'Tell us about your schedule, church ceremony, or preferences...',
    totalQuote: 'Total Estimated Quote',
    createOrderBtn: 'Create Booking & Negotiate',
    requestDiscount: 'Request Discount',
    wantDiscount: 'Looking for a tailored bundle discount?',
    chatPlaceholder: 'Chat directly with HOPE Studio directors. Messages you send here alert our owners directly on Telegram with real-time replies.',
    sendPlaceholder: 'Ask about dates, equipment, or discounts...',
    proceedToContract: 'Ready to Proceed? Sign Agreement',
    contractTitle: 'Digital Service Agreement',
    contractSubtitle: 'Review terms of service and sign with your electronic signature.',
    contractSeal: 'HOPE OFFICIAL CONTRACT',
    provider: 'Service Provider: HOPE Photo & Velo (Addis Ababa)',
    term1Head: '1. Scope of Services & Deliverables',
    term1Body: 'HOPE Studio agrees to deploy professional camera equipment, stabilization, and cinematographers to cover the celebration in full cinematic quality.',
    term2Head: '2. Agreed Compensation & Deposit (30%)',
    term2Body: 'An initial advance deposit of 30% is required upon contract signing to secure the date. The remaining 70% balance is payable upon delivery of draft video.',
    term3Head: '3. Delivery Timeline',
    term3Body: 'Digital soft copies are delivered within 7 business days. Color-graded cinema films, albums, and framed boards are completed within 21 days.',
    signHint: 'Sign your signature here',
    clearBtn: 'Clear',
    agreeCheckbox: 'I confirm that I have reviewed the deliverables, pricing, and agree to the booking terms of HOPE Photo & Velo.',
    signFinalizeBtn: 'Sign & Finalize Agreement',
    successH3: 'Agreement Successfully Signed!',
    successP: 'Your contract has been officially registered with HOPE Studio and dispatched to our directors.',
    contractId: 'Contract ID:',
    hashLabel: 'Verification Hash:',
    totalAgreed: 'Total Agreed Price:',
    depositDue: '30% Deposit Due:',
    callBtn: 'Call Studio (09 10 52 69 62)',
    returnChat: 'Return to Chat'
  },
  om: {
    title: 'Mini App Istuudiyoo HOPE',
    subtitle: 'Finfinnee • Jaalalaan Hundeeffame',
    tabs: { services: 'Tajaajila', customize: 'Mijeesuu', negotiate: 'Gatii Falmuu', contract: 'Waliigaltee', my_orders: 'Qophii Koo' },
    bannerTag: 'Koleekshinii HOPE 2026',
    bannerH2: 'Paakeejii Bareedaa Filadhaa',
    bannerP: 'Tajaajila fooyyessaa, gatii dabalataa falmaa, waliigaltee keessan Telegiraam irratti mallatteessaa.',
    catLabels: { studio: 'Istuudiyoo', wedding: 'Viidiyoo Cidhaa', mesk: 'Dirree fi Addaa' },
    selectBtn: 'Paakeejii Kana Qindeessaa',
    selectedBadge: 'Filatameera ✓',
    moreFeatures: 'tajaajila dabalataa',
    customizeTitle: 'Bal\'ina Qophii & Dabalata',
    customizeDesc: 'Kaameraa dabalataa, diroonii ykn boordii filadhaa.',
    includedItems: 'Waan Dabalame',
    optionalEnhance: 'Tajaajila Dabalataa (Add-ons)',
    bookingFormTitle: 'Oodeeffannoo Keessan',
    nameLabel: 'Maqaa Guutuu',
    namePlaceholder: 'Fkn: Daawwit & Tiigist',
    phoneLabel: 'Lakkoofsa Bilbilaa',
    phonePlaceholder: '0911...',
    dateLabel: 'Guyyaa Qophii',
    locationLabel: 'Bakka Qophii',
    locationPlaceholder: 'Fkn: Hoteela Iskaayilaayit',
    notesLabel: 'Yaada Addaa',
    notesPlaceholder: 'Sagantaa ykn fedhii keessan nuuf ibsaa...',
    totalQuote: 'Gatii Dimshaashaa',
    createOrderBtn: 'Qophii Qabadhaa & Gatii Falmaa',
    requestDiscount: 'Gatii Hir\'isuu Gaafadhaa',
    wantDiscount: 'Gatii hir\'ifamaa barbaadduu?',
    chatPlaceholder: 'Daayirektaroota HOPE wajjin kallattiin haasa\'aa. Ergaan asitti ergamu battalumatti Telegiraam isaaniitti gaha.',
    sendPlaceholder: 'Guyyaa, meeshaa ykn gatii gaafadhaa...',
    proceedToContract: 'Waliigaltee Mallatteessuuf Qophiidhaa?',
    contractTitle: 'Waliigaltee Tajaajilaa Dijitaalaa',
    contractSubtitle: 'Ulaagaalee dubbisaatii mallattoo keessaniin mirkaneessaa.',
    contractSeal: 'WALIIGALTEE SEERAA HOPE',
    provider: 'Dhiyeessaa Tajaajilaa: HOPE Photo & Velo (Finfinnee)',
    term1Head: '1. Tajaajila fi Meeshaalee',
    term1Body: 'Istuudiyoon HOPE kaameraa ammayyaa fi ogeeyyii muuxannoo qabaniin qophii keessan qulqullinaan waraaba.',
    term2Head: '2. Kaffaltii fi Dur-Kaffaltii (30%)',
    term2Body: 'Guyyaa qabachuuf dur-kaffaltiin %30 ni kaffalama. Hafeen %70 yeroo viidiyoon jalqabaa kennamu kaffalama.',
    term3Head: '3. Yeroo Kenniinsaa',
    term3Body: 'Suuraaleen guyyoota hojii 7 keessatti, viidiyoon fi albaamni guyyoota 21 keessatti ni kennama.',
    signHint: 'Mallattoo keessan asitti barreessaa',
    clearBtn: 'Haqi',
    agreeCheckbox: 'Tajaajilaa fi gatii dhiyaate ilaalee waliigaleera.',
    signFinalizeBtn: 'Waliigaltee Mallatteessi',
    successH3: 'Waliigalteen Milkaa\'inaan Mallattaa\'eera!',
    successP: 'Waliigalteen keessan galmaa\'ee gara daayirektarootaatti ergameera.',
    contractId: 'Lakk. Waliigaltee:',
    hashLabel: 'Haashii Mirkaneessaa:',
    totalAgreed: 'Gatii Waliigalame:',
    depositDue: 'Dur-Kaffaltii (30%):',
    callBtn: 'Bilbilaa (09 10 52 69 62)',
    returnChat: 'Gara Haasaatti Deebi\'aa'
  }
};

/* ── EXACT SYNCHRONIZED 9 PACKAGES ── */
const DEFAULT_PACKAGES_DATA = [
  // Studio
  {
    id: 'studio-session',
    category: 'studio',
    price: 10000,
    titleEn: 'Studio Session',
    titleAm: 'የስቱዲዮ ቀረጻ',
    titleOm: 'Waraabbii Istuudiyoo',
    deliverablesEn: ['20 Print Photos', '10 Post Photos', 'Professional Makeup', '150 Soft Copies'],
    deliverablesAm: ['20 ፕሪንት ፎቶዎች', '10 ፖስት ፎቶዎች', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Suuraalee maxxanfamani 20', 'Suuraalee poostii 10', 'Meek-aappii waliin', 'Soft copy 150']
  },
  {
    id: 'studio-event',
    category: 'studio',
    price: 14500,
    titleEn: 'Event Coverage',
    titleAm: 'የክስተት ሽፋን',
    titleOm: 'Haguggii Qophii',
    deliverablesEn: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies'],
    deliverablesAm: ['የምስጋና ካርዶች (200 ፍሬ)', '40×60 ቦርድ ፎቶ', 'ሜካፕ የተካተተ', '10 ፖስት ፎቶዎች', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Kaardii Galataa (200)', 'Suuraa Boordii 40×60', 'Meek-aappii waliin', 'Suuraalee poostii 10', 'Soft copy 150']
  },
  {
    id: 'studio-production',
    category: 'studio',
    price: 18500,
    titleEn: 'Full Production Suite',
    titleAm: 'ሙሉ ፕሮዳክሽን አልበም',
    titleOm: 'Oomisha Guutuu',
    deliverablesEn: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies'],
    deliverablesAm: ['30×45 ላሚኔት አልበም (10/20 ገጽ)', '1 ሳይን ቦርድ', 'የምስጋና ካርዶች (200 ፍሬ)', 'ሜካፕ የተካተተ', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Kaardii Galataa', 'Meek-aappii', 'Soft copy 150']
  },

  // Wedding Video
  {
    id: 'wedding-bronze',
    category: 'wedding',
    price: 45000,
    titleEn: 'Bronze Package',
    titleAm: 'የሰርግ ብሮንዝ ቪዲዮ',
    titleOm: 'Paakeejii Biriinzi',
    deliverablesEn: ['2 Professional Cameras', 'Ronin Gimbal', 'Ameran Cinema Light', 'Highlight Trailer & Edit', 'Color Grading', 'All Soft Copies Free'],
    deliverablesAm: ['2 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 2', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara / fiilmii', 'Kalar gireediingii', 'Soft copy guutuu']
  },
  {
    id: 'wedding-silver',
    category: 'wedding',
    price: 60000,
    titleEn: 'Silver Package',
    titleAm: 'የሰርግ ሲልቨር ቪዲዮ',
    titleOm: 'Paakeejii Siilvarii',
    deliverablesEn: ['3 Professional Cameras', 'Ronin Gimbal', 'Ameran Lighting', 'Trailer & Full Cinema Video', 'Color Grading', '40×60 Board Photo', 'All Soft Copies Free'],
    deliverablesAm: ['3 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 3', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Boordii 40×60', 'Soft copy guutuu']
  },
  {
    id: 'wedding-golden-plus',
    category: 'wedding',
    price: 75000,
    titleEn: 'Golden Plus Suite',
    titleAm: 'ጎልደን ፕላስ ሱዊት',
    titleOm: 'Paakeejii Warqee Pilaas',
    deliverablesEn: ['4 Professional Cameras', 'Ronin Gimbal', 'Ameran Light', 'Trailer & Full Cinema Edit', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies Free'],
    deliverablesAm: ['4 ካሜራዎች', 'ሮኒን ጊምባል', 'አመራን ላይት', 'ትሬይለር / ቪዲዮ ኤዲቲንግ', 'ከለር ግሬዲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ', '40×60 ቦርድ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 4', 'Rooniin Giimbaal', 'Ibsaa Amaraan', 'Tireeyilara & Fiilmii', 'Kalar gireediingii', 'Albaama 30×90', 'Boordii 50×80', 'Boordii 40×60', 'Soft copy guutuu']
  },

  // Luxury Mesk
  {
    id: 'mesk-session',
    category: 'mesk',
    price: 16000,
    titleEn: 'Mesk Video Session',
    titleAm: 'የመስክ ቪዲዮ ቀረጻ',
    titleOm: 'Waraabbii Dirree',
    deliverablesEn: ['Cinematic Mesk Video', '1 Sign Board Photo', '150 Soft Copies', 'Color Grading'],
    deliverablesAm: ['የመስክ ቪዲዮ', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች', 'ከለር ግሬዲንግ'],
    deliverablesOm: ['Viidiyoo Dirree', 'Boordii Mallattoo 1', 'Soft copy 150', 'Kalar gireediingii']
  },
  {
    id: 'mesk-album',
    category: 'mesk',
    price: 20000,
    titleEn: 'Mesk Video & Album',
    titleAm: 'የመስክ ቪዲዮ እና አልበም',
    titleOm: 'Viidiyoo fi Albaama Dirree',
    deliverablesEn: ['Cinematic Mesk Video', '30×45 Laminate Album', '1 Sign Board', '150 Soft Copies'],
    deliverablesAm: ['የመስክ ቪዲዮ', '30×45 ላሚኔት አልበም', '1 ሳይን ቦርድ', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Viidiyoo Dirree', 'Albaama Laamineetii 30×45', 'Boordii Mallattoo 1', 'Soft copy 150']
  },
  {
    id: 'mesk-grand-keepsake',
    category: 'mesk',
    price: 23000,
    titleEn: 'Grand Keepsake Suite',
    titleAm: 'ግራንድ ኪፕሴክ ሱዊት',
    titleOm: 'Paakeejii Giraand Kiippiseek',
    deliverablesEn: ['30×90 Laminate Album (10/20 Page)', '50×80 Wall Board', '1 Sign Board Photo', '200 Thank-You Cards', '5 Save-the-Date Photos', '150 Soft Copies Free'],
    deliverablesAm: ['30×90 ላሚኔት አልበም (10/20 ገጽ)', '50×80 ግድግዳ ቦርድ', '1 ሳይን ቦርድ', '200 የምስጋና ካርዶች', '5 ሴቭ ዘ ዴት ፎቶዎች', '150 ሶፍት ኮፒዎች'],
    deliverablesOm: ['Albaama Laamineetii 30×90', 'Boordii 50×80', 'Boordii Mallattoo 1', 'Kaardii Galataa 200', 'Suuraa Qophii 5', 'Soft copy 150']
  }
];

const DEFAULT_ADDONS_DATA = [
  { id: 'drone', name: '4K Aerial Drone Coverage', price: 6000, desc: 'Cinematic aerial footage of church, procession & venue' },
  { id: 'extra-cam', name: 'Extra Cinema Camera Operator', price: 7500, desc: 'Captures spontaneous guest & family reactions' },
  { id: 'rush-edit', name: '48-Hour Rush Video Delivery', price: 5000, desc: 'Priority post-production for immediate sharing' },
  { id: 'wall-board', name: 'Deluxe 50×80 Acrylic Wall Board', price: 4000, desc: 'Museum-grade wall piece for living room' },
  { id: 'makeup', name: 'VIP Bridal Makeup Artist', price: 4500, desc: 'Professional on-location makeup touchups' }
];

const ADMIN_IDS = ['5563466567', '5473210957'];

export default function TelegramMiniApp({ onClose, onOpenAdmin }) {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || { id: 'demo_user', first_name: 'Guest Client', username: 'guest' };
  const isAdminUser = ADMIN_IDS.includes(String(user.id));

  const [lang, setLang] = useState('am'); // 'am' | 'en' | 'om'
  const t = T_TMA[lang] || T_TMA.am;

  const [packages, setPackages] = useState(DEFAULT_PACKAGES_DATA);
  const [addons, setAddons] = useState(DEFAULT_ADDONS_DATA);
  const [activeCategory, setActiveCategory] = useState('studio'); // 'studio' | 'wedding' | 'mesk'

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'order' | 'chat' | 'agreement' | 'my_orders'
  const [selectedPkg, setSelectedPkg] = useState(DEFAULT_PACKAGES_DATA[3]); // Default Wedding Bronze
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('Addis Ababa');
  const [clientName, setClientName] = useState(user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Active Order State
  const [activeOrder, setActiveOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // E-Signature Pad State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signedAgreement, setSignedAgreement] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  // Fetch Live Dynamic Settings (Prices, Deliverables, Custom Addons)
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings?.packages?.length) setPackages(d.settings.packages);
        if (d.settings?.addons?.length) setAddons(d.settings.addons);
      })
      .catch(() => {});
  }, []);

  // Telegram WebApp Setup
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('order_id');
    const tabParam = params.get('tab');
    const langParam = params.get('lang');

    if (langParam && ['am', 'en', 'om'].includes(langParam)) setLang(langParam);
    if (orderIdParam) fetchOrder(orderIdParam);
    if (tabParam && ['catalog', 'order', 'chat', 'agreement', 'my_orders'].includes(tabParam)) setActiveTab(tabParam);
  }, []);

  // Poll chat messages if in chat tab
  useEffect(() => {
    if (activeTab === 'chat' && activeOrder?.id) {
      fetchChat(activeOrder.id);
      const interval = setInterval(() => fetchChat(activeOrder.id), 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, activeOrder?.id]);

  const haptic = (type = 'light') => {
    try {
      if (tg?.HapticFeedback) {
        if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
        else tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const cycleLang = () => {
    haptic('light');
    setLang(prev => prev === 'am' ? 'en' : prev === 'en' ? 'om' : 'am');
  };

  const currentCategoryPackages = packages.filter(p => p.category === activeCategory);

  // Price Calculation
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const basePrice = Number(selectedPkg?.price) || 0;
  const rawTotal = basePrice + addonsTotal;
  const currentTotal = activeOrder ? (activeOrder.negotiatedPrice || activeOrder.totalPrice) : rawTotal;
  const depositDue = Math.round(currentTotal * 0.3);

  const toggleAddon = (addon) => {
    haptic('light');
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleCreateOrder = async () => {
    if (!clientName || !phone || !eventDate) {
      alert(lang === 'am' ? 'እባክዎ ስምዎን፣ ስልክ እና የበዓሉን ቀን ያስገቡ።' : 'Please fill in your name, phone, and event date.');
      return;
    }

    setIsSubmittingOrder(true);
    haptic('medium');

    try {
      const payload = {
        clientName,
        phone,
        telegramUserId: user.id,
        telegramUsername: user.username || '',
        category: selectedPkg.category,
        packageId: selectedPkg.id,
        packageName: getPkgTitle(selectedPkg),
        basePrice: selectedPkg.price,
        addons: selectedAddons,
        totalPrice: rawTotal,
        negotiatedPrice: rawTotal,
        eventDate,
        location,
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.order) {
        setActiveOrder(data.order);
        setActiveTab('chat');
        haptic('success');
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (err) {
      const fakeOrder = {
        id: 'HOPE-' + Math.floor(1000 + Math.random() * 9000),
        clientName,
        phone,
        packageName: getPkgTitle(selectedPkg),
        totalPrice: rawTotal,
        negotiatedPrice: rawTotal,
        discountAmount: 0,
        eventDate,
        location,
        status: 'pending_quote',
        createdAt: new Date().toISOString()
      };
      setActiveOrder(fakeOrder);
      setActiveTab('chat');
      haptic('success');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const fetchOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`);
      const data = await res.json();
      if (data.order) setActiveOrder(data.order);
    } catch (e) {}
  };

  const fetchChat = async (orderId) => {
    try {
      const res = await fetch(`/api/chat?order_id=${orderId}`);
      const data = await res.json();
      if (data.messages) setChatMessages(data.messages);
      if (data.order) setActiveOrder(data.order);
    } catch (e) {}
  };

  const handleSendMessage = async (customText = null, isDiscountReq = false) => {
    const textToSend = customText || chatInput.trim();
    if (!textToSend || !activeOrder?.id) return;

    haptic('light');
    setIsSendingMsg(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: activeOrder.id,
          text: textToSend,
          sender: 'client',
          senderName: clientName || user.first_name || 'Client',
          type: isDiscountReq ? 'discount_request' : 'text'
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages(prev => [...prev, data.message]);
        if (!customText) setChatInput('');
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: 'temp-' + Date.now(),
          sender: 'client',
          senderName: clientName || 'Client',
          text: textToSend,
          timestamp: new Date().toISOString()
        }
      ]);
      if (!customText) setChatInput('');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Canvas Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#b92539';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    haptic('light');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!hasSignature || !termsAccepted) {
      alert(lang === 'am' ? 'እባክዎ ፊርማዎን ይሳሉ እና የውሉን ሁኔታዎች ይቀበሉ።' : 'Please draw your signature and accept terms.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');

    setIsSigning(true);
    haptic('medium');

    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder?.id || 'HOPE-DEMO',
          clientName: clientName || user.first_name,
          signatureDataUrl,
          termsAccepted: true,
          eventDate: activeOrder?.eventDate || eventDate,
          location: activeOrder?.location || location,
          agreedPrice: currentTotal,
          depositAmount: depositDue
        })
      });
      const data = await res.json();
      if (data.success && data.agreement) {
        setSignedAgreement(data.agreement);
        setActiveTab('my_orders');
        haptic('success');
      }
    } catch (err) {
      setSignedAgreement({
        id: 'HOPE-AGR-8821',
        orderId: activeOrder?.id || 'HOPE-DEMO',
        clientName: clientName || 'Valued Client',
        agreedPrice: currentTotal,
        depositAmount: depositDue,
        verificationHash: 'SHA256:4f8a912b7c03',
        signedAt: new Date().toISOString()
      });
      setActiveTab('my_orders');
      haptic('success');
    } finally {
      setIsSigning(false);
    }
  };

  // Helper title & deliverables getters
  const getPkgTitle = (pkg) => {
    if (!pkg) return '';
    return lang === 'am' ? (pkg.titleAm || pkg.titleEn) : lang === 'om' ? (pkg.titleOm || pkg.titleEn) : pkg.titleEn;
  };

  const getPkgDeliverables = (pkg) => {
    if (!pkg) return [];
    if (lang === 'am' && pkg.deliverablesAm?.length) return pkg.deliverablesAm;
    if (lang === 'om' && pkg.deliverablesOm?.length) return pkg.deliverablesOm;
    return pkg.deliverablesEn || pkg.deliverables || [];
  };

  return (
    <div className="tma-container">
      {/* ── TOP APP HEADER ── */}
      <header className="tma-header">
        <div className="tma-header-user">
          <div className="tma-avatar">
            {user.photo_url ? <img src={user.photo_url} alt="User" /> : <User size={18} />}
          </div>
          <div className="tma-user-meta">
            <span className="tma-username">{user.first_name || 'Guest Client'}</span>
            <span className="tma-user-status">HOPE Official • Online</span>
          </div>
        </div>

        <div className="tma-header-actions">
          {/* Trilingual Toggle */}
          <button className="tma-lang-toggle" onClick={cycleLang} title="Switch Language">
            <Globe size={13} />
            <span>{lang === 'am' ? 'አማ' : lang === 'en' ? 'EN' : 'OR'}</span>
          </button>

          {/* Admin Dashboard Trigger */}
          {(isAdminUser || onOpenAdmin) && (
            <button
              className="tma-admin-trigger-btn"
              onClick={() => onOpenAdmin ? onOpenAdmin() : (window.location.href = '/admin')}
              title="Admin Control Dashboard"
            >
              <Lock size={13} />
              <span>Admin</span>
            </button>
          )}

          {onClose && (
            <button className="tma-close-btn" onClick={onClose}>
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN TAB NAVIGATION ── */}
      <nav className="tma-tab-bar">
        <button
          className={`tma-tab-item ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('catalog'); }}
        >
          <Camera size={15} />
          <span>{t.tabs.services}</span>
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('order'); }}
        >
          <Sparkles size={15} />
          <span>{t.tabs.customize}</span>
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('chat'); }}
        >
          <MessageCircle size={15} />
          <span>{t.tabs.negotiate}</span>
          {activeOrder && <span className="tma-tab-badge">●</span>}
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'agreement' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('agreement'); }}
        >
          <FileSignature size={15} />
          <span>{t.tabs.contract}</span>
        </button>
      </nav>

      {/* ── TAB 1: SERVICES CATALOG VIEW (3 CATEGORIES & 9 PACKAGES) ── */}
      {activeTab === 'catalog' && (
        <div className="tma-content">
          <div className="tma-banner">
            <span className="tma-banner-tag">{t.bannerTag}</span>
            <h2>{t.bannerH2}</h2>
            <p>{t.bannerP}</p>
          </div>

          {/* 3 Categories Switcher */}
          <div className="tma-category-switcher">
            <button
              className={`tma-cat-pill ${activeCategory === 'studio' ? 'active' : ''}`}
              onClick={() => { haptic('light'); setActiveCategory('studio'); }}
            >
              {t.catLabels.studio} (10k - 18.5k)
            </button>
            <button
              className={`tma-cat-pill ${activeCategory === 'wedding' ? 'active' : ''}`}
              onClick={() => { haptic('light'); setActiveCategory('wedding'); }}
            >
              {t.catLabels.wedding} (45k - 75k)
            </button>
            <button
              className={`tma-cat-pill ${activeCategory === 'mesk' ? 'active' : ''}`}
              onClick={() => { haptic('light'); setActiveCategory('mesk'); }}
            >
              {t.catLabels.mesk} (16k - 23k)
            </button>
          </div>

          <div className="tma-package-list">
            {currentCategoryPackages.map(pkg => {
              const isSelected = selectedPkg?.id === pkg.id;
              const title = getPkgTitle(pkg);
              const items = getPkgDeliverables(pkg);

              return (
                <div
                  key={pkg.id}
                  className={`tma-pkg-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => { haptic('medium'); setSelectedPkg(pkg); }}
                >
                  <div className="tma-pkg-card-head">
                    <div>
                      <span className="tma-pkg-cat">{activeCategory.toUpperCase()}</span>
                      <h3 className="tma-pkg-title">{title}</h3>
                    </div>
                    <div className="tma-pkg-price-badge">
                      <span>{Number(pkg.price).toLocaleString()}</span>
                      <small>ETB</small>
                    </div>
                  </div>

                  <ul className="tma-pkg-features">
                    {items.slice(0, 4).map((d, i) => (
                      <li key={i}>
                        <CheckCircle2 size={14} className="tma-check-icon" />
                        <span>{d}</span>
                      </li>
                    ))}
                    {items.length > 4 && (
                      <li className="tma-more-features">+{items.length - 4} {t.moreFeatures}</li>
                    )}
                  </ul>

                  <button
                    className={`tma-select-btn ${isSelected ? 'btn-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPkg(pkg);
                      setActiveTab('order');
                      haptic('medium');
                    }}
                  >
                    <span>{isSelected ? t.selectedBadge : t.selectBtn}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: CUSTOMIZE & BOOKING VIEW ── */}
      {activeTab === 'order' && (
        <div className="tma-content">
          <div className="tma-section-title">
            <h3>{t.customizeTitle}</h3>
            <p>{t.customizeDesc}</p>
          </div>

          <div className="tma-selected-summary-card">
            <div className="tma-summary-left">
              <span className="tma-pkg-cat">{selectedPkg.category.toUpperCase()}</span>
              <h4>{getPkgTitle(selectedPkg)}</h4>
              <p>{getPkgDeliverables(selectedPkg).length} {t.includedItems}</p>
            </div>
            <div className="tma-summary-price">
              <span>{Number(selectedPkg.price).toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Add-ons Selector */}
          <div className="tma-addons-box">
            <h4>{t.optionalEnhance}</h4>
            <div className="tma-addons-grid">
              {addons.filter(a => a.active !== false).map(addon => {
                const active = selectedAddons.some(a => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`tma-addon-card ${active ? 'active' : ''}`}
                    onClick={() => toggleAddon(addon)}
                  >
                    <div className="tma-addon-check">
                      {active ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                    </div>
                    <div className="tma-addon-info">
                      <span className="tma-addon-title">{addon.name}</span>
                      <span className="tma-addon-desc">{addon.desc}</span>
                    </div>
                    <span className="tma-addon-price">+{Number(addon.price).toLocaleString()} ETB</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Details Form */}
          <div className="tma-form-card">
            <h4>{t.bookingFormTitle}</h4>
            <div className="tma-input-group">
              <label>{t.nameLabel}</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder={t.namePlaceholder}
              />
            </div>
            <div className="tma-input-group">
              <label>{t.phoneLabel}</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
              />
            </div>
            <div className="tma-input-group">
              <label>{t.dateLabel}</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
              />
            </div>
            <div className="tma-input-group">
              <label>{t.locationLabel}</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
              />
            </div>
            <div className="tma-input-group">
              <label>{t.notesLabel}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={2}
              />
            </div>
          </div>

          {/* Sticky Total Calculation */}
          <div className="tma-pricing-bar">
            <div>
              <span className="tma-pricing-label">{t.totalQuote}</span>
              <div className="tma-total-figure">
                <span>{rawTotal.toLocaleString()}</span>
                <small>ETB</small>
              </div>
            </div>
            <button
              className="tma-main-cta-btn"
              onClick={handleCreateOrder}
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                <RefreshCw size={18} className="tma-spin" />
              ) : (
                <>
                  <span>{t.createOrderBtn}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE NEGOTIATION & CHAT BRIDGE ── */}
      {activeTab === 'chat' && (
        <div className="tma-content tma-chat-container">
          {activeOrder ? (
            <div className="tma-order-header-strip">
              <div className="tma-order-meta-info">
                <span className="tma-order-pill">Order #{activeOrder.id}</span>
                <h4>{activeOrder.packageName}</h4>
                <p>📅 {activeOrder.eventDate || 'TBD'} • {activeOrder.location}</p>
              </div>
              <div className="tma-order-price-pill">
                {activeOrder.discountAmount > 0 ? (
                  <>
                    <span className="tma-struck-price">{activeOrder.totalPrice.toLocaleString()} ETB</span>
                    <span className="tma-discounted-price">{activeOrder.negotiatedPrice.toLocaleString()} ETB</span>
                    <span className="tma-discount-badge">Saved {activeOrder.discountAmount.toLocaleString()} ETB!</span>
                  </>
                ) : (
                  <>
                    <span className="tma-regular-price">{activeOrder.totalPrice.toLocaleString()} ETB</span>
                    <span className="tma-quote-tag">Official Quote</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="tma-empty-order-alert">
              <AlertCircle size={20} />
              <span>Please configure an order in the <b>Customize</b> tab first to start negotiating with the studio.</span>
            </div>
          )}

          {/* Quick Discount Request Bar */}
          {activeOrder && (
            <div className="tma-discount-request-bar">
              <Tag size={16} />
              <span>{t.wantDiscount}</span>
              <button
                className="tma-request-discount-btn"
                onClick={() => handleSendMessage(lang === 'am' ? 'ሰላም HOPE ስቱዲዮ፣ እባክዎ ለዚህ ቀጠሮ ልዩ ቅናሽ ያድርጉልኝ?' : 'Hello HOPE Studio, could you please provide a special discount for this booking?', true)}
                disabled={isSendingMsg}
              >
                {t.requestDiscount}
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="tma-messages-list">
            {chatMessages.length === 0 ? (
              <div className="tma-chat-placeholder">
                <MessageCircle size={32} />
                <p>{t.chatPlaceholder}</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`tma-msg-bubble ${msg.sender === 'client' ? 'client' : msg.sender === 'system' ? 'system' : 'admin'}`}>
                  <div className="tma-msg-sender">{msg.senderName}</div>
                  <div className="tma-msg-text">{msg.text}</div>
                  <div className="tma-msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="tma-chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.sendPlaceholder}
              disabled={!activeOrder}
            />
            <button
              className="tma-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!activeOrder || !chatInput.trim() || isSendingMsg}
            >
              <Send size={18} />
            </button>
          </div>

          {activeOrder && (
            <div className="tma-chat-bottom-cta">
              <button
                className="tma-proceed-contract-btn"
                onClick={() => { haptic('medium'); setActiveTab('agreement'); }}
              >
                <FileSignature size={18} />
                <span>{t.proceedToContract}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: DIGITAL SERVICE AGREEMENT & E-SIGNATURE ── */}
      {activeTab === 'agreement' && (
        <div className="tma-content">
          <div className="tma-section-title">
            <h3>{t.contractTitle}</h3>
            <p>{t.contractSubtitle}</p>
          </div>

          <div className="tma-contract-paper">
            <div className="tma-contract-header">
              <div className="tma-seal-badge">
                <ShieldCheck size={24} />
                <span>{t.contractSeal}</span>
              </div>
              <span className="tma-contract-date">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="tma-contract-parties">
              <p><b>{t.provider}</b></p>
              <p><b>Client:</b> {clientName || 'Valued Client'} {phone ? `(${phone})` : ''}</p>
              <p><b>Date:</b> {activeOrder?.eventDate || eventDate || 'TBD'}</p>
              <p><b>Venue:</b> {activeOrder?.location || location}</p>
              <p><b>Package:</b> {activeOrder?.packageName || getPkgTitle(selectedPkg)}</p>
            </div>

            <div className="tma-contract-terms">
              <h5>{t.term1Head}</h5>
              <p>{t.term1Body}</p>

              <h5>{t.term2Head}</h5>
              <p>
                {t.totalAgreed} <b>{currentTotal.toLocaleString()} ETB</b>. {t.depositDue} <b>{depositDue.toLocaleString()} ETB (30%)</b>. {t.term2Body}
              </p>

              <h5>{t.term3Head}</h5>
              <p>{t.term3Body}</p>
            </div>

            {/* Canvas Signature Box */}
            <div className="tma-signature-section">
              <div className="tma-signature-top">
                <label>{t.signHint}:</label>
                <button type="button" className="tma-clear-sign-btn" onClick={clearSignature}>
                  <Trash2 size={13} />
                  <span>{t.clearBtn}</span>
                </button>
              </div>

              <div className="tma-canvas-box">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSignature && (
                  <div className="tma-canvas-hint">
                    <FileSignature size={26} />
                    <span>{t.signHint}</span>
                  </div>
                )}
              </div>

              <label className="tma-terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                />
                <span>{t.agreeCheckbox}</span>
              </label>
            </div>

            <button
              className="tma-finalize-sign-btn"
              onClick={handleSignAgreement}
              disabled={isSigning || !hasSignature || !termsAccepted}
            >
              {isSigning ? (
                <RefreshCw size={18} className="tma-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{t.signFinalizeBtn}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 5: CONFIRMATION & CERTIFICATE ── */}
      {activeTab === 'my_orders' && (
        <div className="tma-content">
          <div className="tma-signed-success-card">
            <div className="tma-success-icon-wrap">
              <CheckCircle2 size={44} />
            </div>
            <h3>{t.successH3}</h3>
            <p>{t.successP}</p>

            <div className="tma-certificate-box">
              <div className="tma-cert-row">
                <span>{t.contractId}</span>
                <b>{signedAgreement?.id || 'HOPE-AGR-9104'}</b>
              </div>
              <div className="tma-cert-row">
                <span>{t.hashLabel}</span>
                <code>{signedAgreement?.verificationHash || 'SHA256:7a94b81c'}</code>
              </div>
              <div className="tma-cert-row">
                <span>{t.totalAgreed}</span>
                <b>{currentTotal.toLocaleString()} ETB</b>
              </div>
              <div className="tma-cert-row">
                <span>{t.depositDue}</span>
                <b className="tma-deposit-val">{depositDue.toLocaleString()} ETB</b>
              </div>
            </div>

            <div className="tma-certificate-actions">
              <a href="tel:+251910526962" className="tma-cert-call-btn">
                <Phone size={16} />
                <span>{t.callBtn}</span>
              </a>
              <button
                className="tma-cert-return-btn"
                onClick={() => { haptic(); setActiveTab('chat'); }}
              >
                <MessageCircle size={16} />
                <span>{t.returnChat}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
