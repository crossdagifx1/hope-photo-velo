import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Camera, Check,
  ChevronDown, ChevronRight, ChevronUp, ExternalLink, Film, Globe, Heart, Layers, MapPin, Menu,
  MessageCircle, Phone, Play, Quote, Send, Sliders, Sparkles, Video, X,
} from 'lucide-react';
import './styles.css';
import TelegramMiniApp from './tma/TelegramMiniApp.jsx';

/* ── CONSTANTS ──────────────────────────────────────────────────────────── */
const PHONE_DISPLAY     = '09 10 52 69 62';
const PHONE_LINK        = '+251910526962';
const TELEGRAM_BOT_TOKEN = '8911456945:AAHHDlGW6-7KPsUwMZvLbAX2EHDXDxAwIzw';
const TELEGRAM_BOT_NAME  = 'HoopStudioSystemBot';
const TELEGRAM_CHAT_IDS  = ['5563466567', '5473210957'];
const TELEGRAM_LINK      = 'https://t.me/HoopStudioSystemBot';
const ASSET             = '/assets';

/* ── TRANSLATIONS ───────────────────────────────────────────────────────── */
const T = {
  am: {
    lang: 'አማርኛ',
    announce: ['የሰርግ ወቅት ደርሷል', 'የቀን ምዝገባ አሁን ክፍት ነው'],
    nav: { about: 'ስለ እኛ', work: 'ሥራዎቻችን', craft: 'ቴክኖሎጂያችን', locations: 'ቦታዎቻችን', process: 'ሂደታችን', pricing: 'አገልግሎቶች', testimonials: 'ምስክርነት', faq: 'FAQ', call: 'ደውሉልን' },
    bookBtn: 'ቀንዎን ያስይዙ',
    heroEyebrow: 'አዲስ አበባ • በፍቅር የተመሠረተ',
    heroH1a: 'ጊዜያት ያልፋሉ፤',
    heroH1b: 'እኛ ትዝታ አድርገን እናስቀራቸዋለን።',
    heroText: 'ለእርስዎ ልዩ እና የማይረሱ በዓላት የተዘጋጁ ፕሮፌሽናል የፎቶ፣ ቪዲዮ እና የሕትመት አገልግሎቶች።',
    heroPills: {
      real: 'እውነተኛ አፍታዎች',
      timeless: 'ዘላቂ ትዝታዎች',
      vision: 'ልዩ ፈጠራ',
      quality: 'ፕሮፌሽናል ጥራት',
    },
    bookNow: 'ቀንዎን አሁኑኑ ያስይዙ',
    call: 'ደውሉ',
    heroProof: ['የ 9 ዓመታት', 'የውብ ትዝታዎች', 'ማህደር እና ታማኝነት።'],
    heroImages: ['የፀሐይ ፍቅር', 'የጋርደን ፎቶ', 'የምሽት ውበት', 'የሙሽራዋ ውበት'],
    heroScrollCta: 'ሥራዎቻችን',
    storyEyebrow: 'የ HOPE መንገድ',
    storyScript: 'ከፎቶ በላይ...',
    storyH2a: 'ስሜቱ እና ትዝታው',
    storyH2b: 'ዋናው ነገር ነው።',
    storyBody: 'ሆፕ (HOPE) ከበስተጀርባ ሆኖ ሁሉንም ነገር የሚያስተውል ቡድን ነው፤ እጅ ለእጅ መያያዝን፣ የወላጆችን የደስታ እንባ፣ ከፎቶ በኋላ የሚመጣውን እውነተኛ ሳቅ። የማይደገመውን ልዩ ቀንዎን ሁልጊዜ የሚመለከቱት ድንቅ ታሪክ አድርገን እንቀርጻዋለን።',
    storyCta: 'ሥራዎቻችንን ይመልከቱ',
    storySince: 'ከ 2009 ዓ.ም\nጀምሮ',
    servicesEyebrow: 'ቀንዎን እንዴት እንደምናስቀረው',
    servicesH2a: 'ከስክሪን በላይ',
    servicesH2b: 'ለረጅም ዘመን የሚኖር።',
    features: [
      { title: 'ስሜት ያላቸው ፎቶዎች', text: 'ያልታሰቡ ድንገተኛ አፍታዎች፣ የደስታ እንባዎች እና የቤተሰብ ፍቅር — በሚገባቸው እንክብካቤ ይያዛሉ።' },
      { title: 'ትዝታን የሚመልሱ ቪዲዮዎች', text: 'የተመረጡ እና በሲኒማቲክ ጥራት የተቀነባበሩ የሰርግ ቪዲዮዎች ሁልጊዜ ደግመው እንዲያዩአቸው።' },
      { title: 'በእጅ የሚዳሰሱ ማስታወሻዎች', text: 'አልበሞች፣ ፍሬሞች፣ ካርዶች እና ሶፍት ኮፒዎች ታሪክዎን አቅፈው የሚይዙ።' },
    ],
    workEyebrow: 'የቅርብ ጊዜ የታሪክ ማህደሮች',
    workH2a: 'የማይረሱ',
    workH2b: 'ድንቅ አፍታዎች።',
    workCaption: 'የተመረጠ ታሪክ',
    workNext: 'ቀጣይ ምስል',
    igBanner: 'ተጨማሪ ድንቅ ሥራዎችን በኢንስታግራም ይከተሉን',
    craftEyebrow: 'የሙያችን እና የቴክኖሎጂ ጥራት',
    craftH2a: 'በከፍተኛ የቴክኖሎጂ ደረጃ',
    craftH2b: 'የተሰሩ ጥራቶች።',
    craftStats: [['9+', 'ዓመታት ልምድ'], ['500+', 'የተቀረፁ የሰርግ በዓላት'], ['4K/8K', 'የሲኒማ ጥራት ቪዲዮ'], ['100%', 'የደንበኞች እርካታ']],
    craftItems: [
      { title: '4K & 8K Cinema Cameras', desc: 'በቅርብ የቴክኖሎጂ ደረጃ የተሰሩ ፕሮፌሽናል የሲኒማ ካሜራዎችና የሌንስ ስብስቦች።' },
      { title: 'Drone & Aerial Lighting', desc: 'የሰርግዎን ግርማ ሞገስ በከፍታ የሚያሳዩ ድሮኖች እና ለቪዲዮው ውበት የሚሆኑ የአየር ላይ መብራቶች።' },
      { title: 'Color Grading Master', desc: 'ለእያንዳንዱ ምስል እና ቪዲዮ ሞቅ ያለ፣ ተፈጥሯዊ እና የፊልም እይታ የሚሰጥ የከለር ኤዲቲንግ።' },
      { title: 'Fine-Art Laminated Albums', desc: 'ከውጭ ሀገር የሚመጡ ዘላቂ፣ በውሃና አቧራ የማይበላሹ በእጅ የተሰሩ ላሚኔት አልበሞች።' },
    ],
    locationsEyebrow: 'የፎቶግራፍ ቦታዎችና ስታዲዮዎች',
    locationsH2a: 'የእርስዎ ምርጥ',
    locationsH2b: 'የቀረጻ ዳራዎች።',
    locationsTabs: ['የጋርደን እና ተፈጥሮ ቀረጻ', 'የቤት ውስጥ ስታዲዮ', 'የምሽት እና የኤዲቶሪያል ፎቶ'],
    locationsTitles: ['የተፈጥሮ ውበትና የጋርደን ፎቶዎች', 'የላቀ የስታዲዮ የብርሃንና የባህል አልበሞች', 'የምሽት የብርሃን ውበት እና የፊልም እይታ'],
    locationsDescs: ['የተረጋጉ፣ በተፈጥሮ ብርሃን የተዋቡ እና የፍቅር አፍታዎችን በሰፊ አረንጓዴ ጋርደኖች ውስጥ የምናስቀራቸው።', 'ለየት ባሉ የስታዲዮ መብራቶች፣ ዳራዎች እና የመካፕ ማዘጋጃዎች የተሟላ የቤት ውስጥ ፎቶግራፍ።', 'በምሽት ብርሃን እና የከለር ኤዲቲንግ የሚሰሩ በውበት የተቀነባበሩ የሰርግ አፍታዎች።'],
    locationsCta: 'ይህንን ቦታ ይምረጡ',
    processEyebrow: 'የአሠራር ሂደታችን',
    processH2a: 'ከመጀመሪያው ውይይት',
    processH2b: 'እስከ መጨረሻው ማስረከቢያ።',
    processSteps: [
      { num: '01', title: 'የመጀመሪያ ውይይት እና ምዝገባ', desc: 'ራዕይዎን፣ ፍላጎትዎን እና የሰርግዎን ቀን በጋራ ተነጋግረን የቀን ምዝገባ ማረጋገጫ እንሰራለን።' },
      { num: '02', title: 'ቅድመ-ሰርግ ቀረጻ (Pre-Wedding)', desc: 'ከሰርግዎ በፊት በሁለታችሁ ብቻ ዘና ብላችሁ የምትነሱት ልዩ የስታዲዮ እና የጋርደን ፎቶ።' },
      { num: '03', title: 'የሰርጉ ቀን ሙሉ ሽፋን', desc: 'ፕሮፌሽናል ቡድናችን የሰርጉን ቀን ውበት፣ ደስታ እና ድንቅ አፍታዎች ሙሉ በሙሉ ይቀርጻል።' },
      { num: '04', title: 'የሕትመት እና ኤዲቲንግ ማስረከብ', desc: 'ከፍተኛ ጥራት ያላቸው ላሚኔት አልበሞች፣ የቦርድ ፎቶዎች እና የተቀነባበሩ ቪዲዮዎችን ማስረከብ።' },
    ],
    pricingEyebrow: 'የእኛ ፓኬጆች • OUR PACKAGES',
    pricingH2a: 'ለታሪክዎ የሚመጥን',
    pricingH2b: 'ፍጹም ፓኬጅ ይምረጡ።',
    pricingNote: 'ሰርግ፣ ልዩ በዓል፣ የስታዲዮ ቀረጻ ወይም የቪዲዮ ፕሮዳክሽን — ለእርስዎ ፍላጎት የሚሆን ትክክለኛ ፓኬጅ አዘጋጅተናል።',
    pricingScript: 'ለእያንዳንዱ ልዩ አፍታዎ የተዘጋጀ ፕሮፌሽናል ፎቶ እና ቪዲዮ',
    pricingStartingFrom: 'መነሻ ዋጋ',
    pricingBookBtn: 'ይህንን ፓኬጅ ያስይዙ',
    pricingNeedSpecial: 'ልዩ ፍላጎት አለዎት?',
    pricingCustomNote: 'ለሰርግ፣ ለትላልቅ ሁነቶች እና ለድርጅቶች የሚሆኑ አማራጮችንም እናዘጋጃለን።',
    pricingContactBtn: 'አግኙን',
    pkgPopular: 'በጣም የተወደደ',
    pkgCta: 'ይህንን ፓኬጅ ያስይዙ',
    priceDisclaimer: 'ሁሉም ዋጋዎች ይፋዊ የ HOPE ዋጋዎች ናቸው። ቀን ሲያስይዙ የቡድናችን አባላት ደውለው ቀጠሮዎን ያረጋግጣሉ።',
    testimonialEyebrow: 'የደንበኞቻችን ምስክርነት',
    testimonialH2a: 'ሙሽሮቻችን',
    testimonialH2b: 'ስለ እኛ የሚሉት።',
    testimonials: [
      { quote: 'ሆፕ በሰርጋችን ቀን ያደረገልን እንክብካቤ እና ያስረከበን አልበም ከጠበቅነው በላይ ውብ ነው! በቪዲዮው ኤዲቲንግ በጣም ተደስተናል።', name: 'ዮሴፍ እና ሄለን', event: 'የሰርግ በዓል' },
      { quote: 'የቪዲዮው ኤዲቲንግ እና የከለር ምርጫው እውነተኛ የፊልም ጥራት አለው። በየጊዜው ደግመን ስናየው ያንኑ የሰርጋችንን ቀን ደስታ ይሰጠናል።', name: 'ዳዊት እና ሰለሞን', event: 'የሰርግ እና ጋርደን ቀረጻ' },
      { quote: 'በቀረጻ ጊዜ ዘና እንድንል ያደረጉበት መንገድ እና የታማኝነታቸው ደረጃ በጣም ያስደስታል። ለሁሉም ወዳጆቻችን ሆፕን እንመክራለን!', name: 'አቤል እና ትዕግስት', event: 'የሰርግ እና ስታዲዮ ቀረጻ' },
    ],
    faqEyebrow: 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
    faqH2a: 'ማወቅ የሚፈልጉአቸው',
    faqH2b: 'ዋና ዋና ነጥቦች።',
    faqs: [
      { q: 'ከሰርጋችን ምን ያህል ጊዜ በፊት ማስያዝ አለብን?', a: 'የሰርግ ቀናት በፍጥነት ስለሚያዙ፣ ቢያንስ ከ 1 እስከ 3 ወራት በፊት ማስያዝ ይመከራል። ሆኖም ክፍት ቀናት ካሉ በቅርብ ጊዜም ማስተናገድ እንችላለን።' },
      { q: 'የፎቶ እና ቪዲዮ ማስረከቢያ ጊዜው ምን ያህል ነው?', a: 'የመጀመሪያዎቹ ሶፍት ኮፒ ፎቶዎች በ 3-5 ቀናት ውስጥ የሚረከቡ ሲሆን፤ የተዘጋጁ አልበሞች እና ሙሉ ኤዲት የተደረጉ ቪዲዮዎች እንደ ፓኬጁ አይነት በ 2-4 ሳምንታት ውስጥ ይረከባሉ።' },
      { q: 'ፓኬጆቹ ምን ምን አገልግሎቶችን ያካትታሉ?', a: 'እያንዳንዱ ፓኬጅ ካሜራዎችን፣ የቪዲዮ ኤዲቲንግ፣ ላሚኔት አልበሞችን፣ ቦርዶችን፣ ሜካፕ እና ሶፍት ኮፒዎችን በግልጽ ያካተተ ነው። የትኛውንም ፓኬጅ ሲመርጡ ቡድናችን ከበዓልዎ ሰዓት ጋር በሚስማማ መልኩ ያቀናጅልዎታል።' },
      { q: 'ክፍያ በምን መልኩ ይፈጸማል?', a: 'ቀን ሲያስይዙ ቅድመ ክፍያ (Advance payment) የሚከፈል ሲሆን፤ ቀሪው ክፍያ በቀረጻው ቀን እና ምርቶችን በተረከቡበት ወቅት የሚጠናቀቅ ይሆናል።' },
    ],
    closingEyebrow: 'ልዩ ቀንዎ ሁልጊዜ ከእርስዎ ጋር',
    closingH2a: 'ዘላቂ የሚሆን',
    closingH2b: 'ድንቅ ነገር እንፍጠር።',
    closingBody: 'ቀናት በፍጥነት ስለሚያዙ፣ የሚያከብሩትን በዓል ይንገሩን፤ ቀጣዩን እርምጃ ቀላል እናደርገዋለን።',
    closingBtn: 'ቀንዎን ያስይዙ',
    footerTagline: 'ከፍተኛ ዋጋ ላላቸው አፍታዎች።',
    footerTg: 'በቴሌግራም ያግኙን',
    bookingEyebrow: 'ቀንዎን ያስይዙ',
    bookingH2: 'ለድንቅ አፍታዎችዎ\nቦታ እንስጥ።',
    bookingIntro: 'ስለ በዓልዎ ጥቂት ነገሮችን ይንገሩን፤ እኛ ከእዚያ እንቀጥላለን።',
    bookingSelectedLabel: 'የመረጡት ፓኬጅ',
    bookingLabels: ['ሙሉ ስምዎ', 'የበዓሉ ቀን', 'ስልክ ቁጥር', 'ምን እያከበሩ ነው?'],
    bookingPlaceholders: ['ሙሉ ስምዎን እዚህ ያስገቡ', '', '09…', 'ሰርግ፣ የስታዲዮ ቀረጻ፣ ወይም ሌላ ልዩ በዓል...'],
    bookingSubmit: 'ቀጠሮዎን ይላኩ',
    successEyebrow: 'ለመገናኘት ዝግጁ ነን',
    successH2: 'ቀጠሮዎ በስኬት ተልኳል።',
    successBody: 'የቀጠሮ ዝርዝርዎ ቀጥታ ለ HOPE ቡድን ተልኳል። ቡድናችን በአጭር ጊዜ ውስጥ ደውሎ ያረጋግጥልዎታል።',
    backBtn: 'ወደ ዋናው ገጽ ይመለሱ',
    noteName: 'ሙሉ ስም',
  },
  en: {
    lang: 'English',
    announce: ['Wedding Season is Here', 'Booking Dates Now Open'],
    nav: { about: 'About Us', work: 'Our Work', craft: 'Our Craft', locations: 'Locations', process: 'Process', pricing: 'Packages', testimonials: 'Reviews', faq: 'FAQ', call: 'Call Us' },
    bookBtn: 'Book Your Date',
    heroEyebrow: 'Addis Ababa • Founded in Love',
    heroH1a: 'Moments pass—',
    heroH1b: 'we make them last forever.',
    heroText: 'Professional photography, videography, and album printing tailored for your special celebrations.',
    heroPills: {
      real: 'Real Moments',
      timeless: 'Timeless Memories',
      vision: 'Creative Vision',
      quality: 'Professional Quality',
    },
    bookNow: 'Book Your Date Now',
    call: 'Call',
    heroProof: ['9+ Years', 'of Beautiful Memories', 'Preserved with Care.'],
    heroImages: ['Golden Hour Love', 'Garden Portrait', 'Evening Glamour', 'Bridal Beauty'],
    heroScrollCta: 'Our Work',
    storyEyebrow: 'The HOPE Journey',
    storyScript: 'Beyond the photo…',
    storyH2a: 'The feeling & the memory',
    storyH2b: 'are what matter most.',
    storyBody: 'HOPE is a team that notices everything from behind the lens — the intertwined hands, joyful tears of parents, and the real laughter that follows a photo. We craft your unrepeatable day into a story you will always love to revisit.',
    storyCta: 'View Our Work',
    storySince: 'Since 2016',
    servicesEyebrow: 'How We Preserve Your Day',
    servicesH2a: 'Beyond the screen,',
    servicesH2b: 'lasting for generations.',
    features: [
      { title: 'Emotive Photography', text: 'Unplanned spontaneous moments, joyful tears, and family love — captured with the care they deserve.' },
      { title: 'Cinematic Videography', text: 'Curated and masterfully edited wedding films you will rewatch for the rest of your lives.' },
      { title: 'Tangible Keepsakes', text: 'Albums, frames, cards, and digital copies that hold your story forever.' },
    ],
    workEyebrow: 'Recent Archived Stories',
    workH2a: 'Unforgettable',
    workH2b: 'remarkable moments.',
    workCaption: 'Featured Story',
    workNext: 'Next Image',
    igBanner: 'Follow us on Instagram for more stunning work',
    craftEyebrow: 'Our Craft & Technology',
    craftH2a: 'Built with the highest',
    craftH2b: 'level of technology.',
    craftStats: [['9+', 'Years Experience'], ['500+', 'Weddings Captured'], ['4K/8K', 'Cinema Quality Video'], ['100%', 'Client Satisfaction']],
    craftItems: [
      { title: '4K & 8K Cinema Cameras', desc: 'Professional cinema cameras and lens collections built to the highest technology standards.' },
      { title: 'Drone & Aerial Lighting', desc: 'Drones to showcase the grandeur of your wedding from above, with aerial lights for stunning video quality.' },
      { title: 'Color Grading Master', desc: 'Warm, natural and cinematic color editing applied to every photo and video.' },
      { title: 'Fine-Art Laminated Albums', desc: 'Durable, water-resistant hand-crafted laminate albums sourced internationally.' },
    ],
    locationsEyebrow: 'Photography Locations & Studios',
    locationsH2a: 'Your perfect',
    locationsH2b: 'shooting backdrop.',
    locationsTabs: ['Garden & Outdoor', 'Indoor Studio', 'Night & Editorial'],
    locationsTitles: ['Natural Light Garden & Outdoor Portraits', 'Premium Studio Lighting & Cultural Albums', 'Evening Glamour & Cinematic Editorial'],
    locationsDescs: ['Serene, naturally lit love moments captured in expansive green gardens.', 'Full indoor photography with specialty studio lights, backdrops, and makeup stations.', 'Beautifully crafted wedding moments shot under evening lights and color-graded for a film look.'],
    locationsCta: 'Choose This Location',
    processEyebrow: 'Our Working Process',
    processH2a: 'From the first conversation',
    processH2b: 'to final delivery.',
    processSteps: [
      { num: '01', title: 'Initial Consultation & Booking', desc: 'We discuss your vision, preferences, and wedding date together, and confirm your booking date.' },
      { num: '02', title: 'Pre-Wedding Shoot', desc: 'A relaxed studio or garden photoshoot for just the two of you before your big day.' },
      { num: '03', title: 'Full Wedding Day Coverage', desc: 'Our professional team fully captures the beauty, joy, and special moments of your wedding day.' },
      { num: '04', title: 'Albums, Editing & Delivery', desc: 'High-quality laminated albums, board photos, and edited videos delivered to you.' },
    ],
    pricingEyebrow: 'OUR PACKAGES',
    pricingH2a: 'Choose the perfect',
    pricingH2b: 'package for your story.',
    pricingNote: 'Whether it\'s a wedding, event, photoshoot or video production, we have the right package to fit your needs.',
    pricingScript: 'Professional photography & videography for every special moment.',
    pricingStartingFrom: 'Starting from',
    pricingBookBtn: 'Book This Package',
    pricingNeedSpecial: 'Need something special?',
    pricingCustomNote: 'We also offer custom packages for weddings, events, corporate and more.',
    pricingContactBtn: 'Contact Us',
    pkgPopular: 'Most Popular',
    pkgCta: 'Book This Package',
    priceDisclaimer: 'All packages are official HOPE standard rates. Upon booking, our team will contact you to confirm your date and schedule.',
    testimonialEyebrow: 'Client Testimonials',
    testimonialH2a: 'What our couples',
    testimonialH2b: 'say about us.',
    testimonials: [
      { quote: 'The care HOPE gave us on our wedding day and the album they delivered exceeded our expectations! We absolutely loved the video editing.', name: 'Yosef & Helen', event: 'Wedding Celebration' },
      { quote: 'The video editing and color grading has true cinematic quality. Every time we rewatch it, it brings back the joy of our wedding day.', name: 'Dawit & Solomon', event: 'Wedding & Garden Shoot' },
      { quote: 'The way they made us feel relaxed during the shoot and their level of trustworthiness is truly impressive. We recommend HOPE to all our friends!', name: 'Abel & Tigist', event: 'Wedding & Studio Shoot' },
    ],
    faqEyebrow: 'Frequently Asked Questions',
    faqH2a: 'Key things',
    faqH2b: 'you\'d like to know.',
    faqs: [
      { q: 'How far in advance should we book?', a: 'Wedding dates are taken quickly, so we recommend booking at least 1–3 months in advance. However, if dates are available, we can accommodate closer bookings too.' },
      { q: 'How long does photo and video delivery take?', a: 'Initial soft-copy photos are delivered within 3–5 days. Finished albums and fully edited videos are delivered within 2–4 weeks depending on the package.' },
      { q: 'What deliverables are included in each package?', a: 'Every package clearly specifies its cameras, cinematic video editing, laminate albums, boards, makeup, and soft copies. Once you select your package, our team coordinates the schedule to seamlessly match your celebration.' },
      { q: 'How does payment work?', a: 'An advance payment is required when booking. The remaining balance is settled on the day of the shoot and upon receiving your deliverables.' },
    ],
    closingEyebrow: 'Your special day, always with you',
    closingH2a: 'Let\'s create something',
    closingH2b: 'that lasts forever.',
    closingBody: 'Dates fill up fast — tell us about the celebration you\'re planning and we\'ll make the next step easy.',
    closingBtn: 'Book Your Date',
    footerTagline: 'For moments that matter most.',
    footerTg: 'Find us on Telegram',
    bookingEyebrow: 'Book Your Date',
    bookingH2: 'Let\'s make space\nfor your special moments.',
    bookingIntro: 'Tell us a little about your celebration and we\'ll take it from there.',
    bookingSelectedLabel: 'Selected Package',
    bookingLabels: ['Full Name', 'Event Date', 'Phone Number', 'What are you celebrating?'],
    bookingPlaceholders: ['Enter your full name', '', '09…', 'Wedding, studio shoot, or another special occasion...'],
    bookingSubmit: 'Submit Booking Request',
    successEyebrow: 'We\'re Ready to Connect',
    successH2: 'Booking Request Sent Successfully',
    successBody: 'Your appointment details have been sent directly to the HOPE team. We will call you shortly to confirm your date.',
    backBtn: 'Return to Homepage',
    noteName: 'Full Name',
  },
  om: {
    lang: 'Afaan Oromoo',
    announce: ['Waggaa Cidhaa Ni Ga\'e', 'Guyyaa Galmeessuun Amma Banamaadha'],
    nav: { about: 'Waa\'ee Keenya', work: 'Hojiiwwan Keenya', craft: 'Teknoolojii Keenya', locations: 'Bakka Keenya', process: 'Adeemsa Keenya', pricing: 'Paakeejiiwwan', testimonials: 'Yaada Maamiltootaa', faq: 'GAF (FAQ)', call: 'Nuu Bilbilaa' },
    bookBtn: 'Guyyaa Keessan Qabadhaa',
    heroEyebrow: 'Finfinnee • Jaalalaan Hundeeffame',
    heroH1a: 'Yeroon ni darba;',
    heroH1b: 'Nuti yaadannoo bara baraa goona.',
    heroText: 'Tajaajila suuraa, viidiyoo fi maxxansaa pirofeeshiinaalaa ayyaana keessan isa addaatiif qophaa\'e.',
    heroPills: {
      real: 'Yeroo Dhugaa',
      timeless: 'Yaadannoo Bara Baraa',
      vision: 'Mula\'ata Uumamaa',
      quality: 'Qulqullina Pirofeeshiinaalaa',
    },
    bookNow: 'Amma Guyyaa Keessan Qabadhaa',
    call: 'Bilbilaa',
    heroProof: ['Waggaa 9+', 'Yaadannoo Bareedaa', 'Kunuunsaan Qabame.'],
    heroImages: ['Jaalala Yeroo Aduu', 'Suuraa Maasaa/Gadaa', 'Bareedina Galgalaa', 'Bareedina Misirroo'],
    heroScrollCta: 'Hojiiwwan Keenya',
    storyEyebrow: 'Imala HOPE',
    storyScript: 'Suuraa ol…',
    storyH2a: 'Miira fi yaadannoo',
    storyH2b: 'isa waan hundumaa caaludha.',
    storyBody: 'HOPE hojjettoota suuraa duuba ta\'anii waan hundumaa hubatandha — harka walqabachuu, imimmaan gammachuu warraa, fi kolfi dhugaa suuraa booda dhufu. Guyyaa keessan isa irra hin deebiamne seenaa yeroo hunda ilaaluu jaallattan gochuun ni uumna.',
    storyCta: 'Hojii Keenya Ilaalaa',
    storySince: 'Bara 2016\nEegale',
    servicesEyebrow: 'Akkaataa Nuti Guyyaa Keessan Qabnu',
    servicesH2a: 'Iscreenii ol,',
    servicesH2b: 'Dhaloota hedduuf kan turu.',
    features: [
      { title: 'Suuraa Miira Qabu', text: 'Yeroo tasaa hin yaadamtin, imimmaan gammachuu, fi jaalala maatii — kunuunsa isaaniif maluun qabamu.' },
      { title: 'Viidiyoo Sinimaatiikii', text: 'Viidiyoo cidha keessan isa qulqullina sinimaatiikiin gulaalame kan jireenya keessan guutuu irra deebitanii ilaaltan.' },
      { title: 'Yaadannoo Harkaan Qabatamu', text: 'Albaamota, fiiraamota, kaardiiwwan fi waraqaa dijitaalaa seenaa keessan bara baraaf qabatan.' },
    ],
    workEyebrow: 'Seenaawwan Kuusaa Ammaa',
    workH2a: 'Yeroowwan',
    workH2b: 'Hundumaa Dagatamne.',
    workCaption: 'Seenaa Addaa',
    workNext: 'Suuraa Itti Aanu',
    igBanner: 'Hojiiwwan dabalataatiif Instagram irratti nu hordofaa',
    craftEyebrow: 'Ogummaa fi Teknoolojii Keenya',
    craftH2a: 'Sadarkaa teknoolojii',
    craftH2b: 'isa ol\'aanaan kan uumame.',
    craftStats: [['9+', 'Waggaa Muuxannoo'], ['500+', 'Cidha Waraabame'], ['4K/8K', 'Qulqullina Viidiyoo Sinimaa'], ['100%', 'Gammachuu Maamilaa']],
    craftItems: [
      { title: 'Kaameraa Sinimaa 4K & 8K', desc: 'Kaameraawwan sinimaa fi lensoota sadarkaa teknoolojii ol\'aanaatiin ijaaraman.' },
      { title: 'Diroonii fi Iboo Gubbaa', desc: 'Dirooniiwwan ulfina cidha keessan gubbaadhaan agarsiisan, ibsaa gubbaa viidiyoof gargaaru waliin.' },
      { title: 'Gulaala Halluu (Color Grading)', desc: 'Gulaala halluu ho\'aa, uumamaa fi akka fiilmiitti suuraa fi viidiyoo hundumaaf kan kennamu.' },
      { title: 'Albaama Laamineetii (Fine-Art)', desc: 'Albaamota harkaan hojjetaman, bishaan fi dhukkeen kan hin mancaane, biyya alaas kan dhufan.' },
    ],
    locationsEyebrow: 'Bakka Suuraa fi Istuudiyoo',
    locationsH2a: 'Duubbee',
    locationsH2b: 'Suuraa Keessan Isa Mijaataa.',
    locationsTabs: ['Miriitii & Dirree Uumamaa', 'Istuudiyoo Keessaa', 'Galgala & Editooriyaal'],
    locationsTitles: ['Suuraa Miriitii Uumamaa & Dirree Alaatiin', 'Istuudiyoo Lighting & Albaamota Aadaa', 'Bareedina Galgalaa & Viidiyoo Sinimaatiikii'],
    locationsDescs: ['Yeroowwan jaalalaa tasgabbaa\'oo, ifa uumamaatiin miidhagan dirree maasaa keessatti kan waraabaman.', 'Suuraa istuudiyoo keessaa ibsaa addaa, duubbee fi bakka uffannaa/makeup guutuu waliin.', 'Yeroowwan cidhaa galgala ibsaa fi gulaala halluutiin akka fiilmiitti baay\'ee miidhaganii hojjetaman.'],
    locationsCta: 'Bakka Kana Filadhaa',
    processEyebrow: 'Adeemsa Hojii Keenya',
    processH2a: 'Marii Jalqabaa Irraa',
    processH2b: 'Hanga Waan Guutuu Kennutti.',
    processSteps: [
      { num: '01', title: 'Marii Jalqabaa fi Galmee', desc: 'Mula\'ata keessan, fedhii fi guyyaa cidha keessanii waliin mari\'annee galmee guyyaa ni mirkaneessina.' },
      { num: '02', title: 'Suuraa Dura-Cidhaa (Pre-Wedding)', desc: 'Cidha keessan dura lamaan keessan qofaaf suuraa istuudiyoo fi maasaa tasgabbaa\'aa.' },
      { num: '03', title: 'Uwwisa Guyyaa Cidhaa Guutuu', desc: 'Gareen pirofeeshiinaala keenya bareedina, gammachuu fi yeroowwan addaa guyyaa cidhaa guutummaatti waraaba.' },
      { num: '04', title: 'Albaama, Gulaala fi Kenniinsa', desc: 'Albaamota laamineetii qulqullina ol\'aanaa, suuraa boordii fi viidiyoo gulaalame isiniif kennuu.' },
    ],
    pricingEyebrow: 'PAAKEEJIIWWAN KEENYA',
    pricingH2a: 'Seenaa keessaniif',
    pricingH2b: 'paakeejii mudaa hin qabne filadhaa.',
    pricingNote: 'Cidha, ayyaana addaa, waraabsa istuudiyoo ykn oomisha viidiyoo — fedhii keessaniif kan ta\'u qopheessineerra.',
    pricingScript: 'Yeroowwan addaa hundumaaf suuraa fi viidiyoo pirofeeshiinaalaa.',
    pricingStartingFrom: 'Gatii Jalqabaa',
    pricingBookBtn: 'Paakeejii Kana Qabadhaa',
    pricingNeedSpecial: 'Waan addaa barbaadduu?',
    pricingCustomNote: 'Cidhaaf, ayyaanota gurguddoo fi dhaabbataaf qophii addaa ni dhiheessina.',
    pricingContactBtn: 'Nu Quunnamaa',
    pkgPopular: 'Baay\'ee Kan Jaallatame',
    pkgCta: 'Paakeejii Kana Qabadhaa',
    priceDisclaimer: 'Gatiin hundinuu gatii idilee HOPE ti. Guyyaa qabsiisuun dura gareen keenya isiniif bilbila.',
    testimonialEyebrow: 'Yaada Maamiltoota Keenyaa',
    testimonialH2a: 'Misirroonni keenya',
    testimonialH2b: 'waa\'ee keenya waan jedhan.',
    testimonials: [
      { quote: 'Kunuunsi HOPE guyyaa cidha keenya nuuf godhe fi albaamni nuuf kenne waan nuti eeggannu caalaa bareedaadha! Gulaala viidiyoo baay\'ee jaallanneera.', name: 'Yooseef & Heelen', event: 'Ayyaana Cidhaa' },
      { quote: 'Gulaalli viidiyoo fi filannoon halluu qulqullina fiilmii dhugaa qaba. Yeroo hunda irra deebinee yoo ilaallu gammachuu guyyaa cidha keenyaa nuuf kenne.', name: 'Daawit & Solomoon', event: 'Cidha & Suuraa Maasaa' },
      { quote: 'Adeemsi isaan suuraa irratti akka nuti boqonnu godhan fi sadarkaa amanamummaa isaanii baay\'ee nu gammachiiseera. Hiriyoota keenya hundumaaf HOPE ni gorsina!', name: 'Abeel & Ti\'gisiti', event: 'Cidha & Suuraa Istuudiyoo' },
    ],
    faqEyebrow: 'Gaaffiiwwan Yeroo Baay\'ee Gaafataman',
    faqH2a: 'Wantoota ijoo',
    faqH2b: 'beekuu barbaaddan.',
    faqs: [
      { q: 'Cidha keenya dura yoom qabsiisuu qabna?', a: 'Guyyoonni cidhaa dafanii waan qabatamaniif, ji\'a 1–3 dura qabsiisuun gorfama. Ta\'us, guyyoonni duwwaan yoo jiraatan yeroo dhiyoos simachuu ni dandeenya.' },
      { q: 'Yeroon suuraa fi viidiyoo kennuu hammami?', a: 'Suuraawwan soofti koppii jalqabaa guyyoota 3–5 keessatti kan kennaman ta\'a; albaamonni fi viidiyoon guutummaatti gulaalaman torban 2–4 keessatti ni kennamu.' },
      { q: 'Paakeejiiwwan keessatti maaltu dabalameera?', a: 'Paakeejiin hundi kaameraawwan, gulaala viidiyoo, albaamota laamineetii, boordii, makeup fi soofti koppiiwwan ifatti of keessatti qaba.' },
      { q: 'Kaffaltiin akkamitti raawwatama?', a: 'Yeroo guyyaa qabsiiftan kaffaltiin dursaa (Advance payment) kan kaffalamu yoo ta\'u; kaffaltiin hafe guyyaa waraabsaa fi yeroo meeshaalee fudhattan kan xumuramu ta\'a.' },
    ],
    closingEyebrow: 'Guyyaan keessan isa addaa yeroo hunda isin waliin',
    closingH2a: 'Wanta bara baraaf turu',
    closingH2b: 'wajjin uumna.',
    closingBody: 'Guyyoonni dafanii waan qabatamaniif, ayyaana kabajjan nuu tsisaa; tarkaanfii itti aanu mijaataa ni goona.',
    closingBtn: 'Guyyaa Keessan Qabadhaa',
    footerTagline: 'Yeroowwan gatii ol\'aanaa qabaniif.',
    footerTg: 'Telegram irratti nu argadhaa',
    bookingEyebrow: 'Guyyaa Keessan Qabadhaa',
    bookingH2: 'Yeroowwan keessan kan addaatiif\nbakka nuu kenninaa.',
    bookingIntro: 'Waa\'ee ayyaana keessanii xiqqoo nuu tsisaa; nuti achii itti fufna.',
    bookingSelectedLabel: 'Paakeejii Filatame',
    bookingLabels: ['Maqaa Guutuu', 'Guyyaa Ayyaanaa', 'Lakkoofsa Bilbilaa', 'Maaliif Kabajju?'],
    bookingPlaceholders: ['Maqaa guutuu keessan asitti galchaa', '', '09…', 'Cidha, suuraa istuudiyoo, ykn ayyaana addaa biroo...'],
    bookingSubmit: 'Gaaffii Beellamaa Ergaa',
    successEyebrow: 'Nu Waliin Quqnnamuuf Qophiidha',
    successH2: 'Gaaffiin Beellamaa Milkaa\'inaan Ergameera',
    successBody: 'Bal\'inni beellama keessanii kallattiin garee HOPE tiif ergameera. Gareen keenya yeroo dhiyootti isiniif bilbila.',
    backBtn: 'Gara Fuula Dhiyeenyaatti Deebi\'aa',
    noteName: 'Maqaa Guutuu',
  },
};

/* ── OFFICIAL 3-TIER PACKAGES DATA (CATEGORIZED BY 3) ───────────────────── */
const CATEGORIES_TABS = [
  { id: 'studio',       labelAm: 'ስቱዲዮ',              labelEn: 'Studio',                  labelOm: 'Istuudiyoo' },
  { id: 'wedding',      labelAm: 'የሰርግ ቪዲዮ',          labelEn: 'Wedding Video',           labelOm: 'Viidiyoo Cidhaa' },
  { id: 'mesk_special', labelAm: 'የመስክ እና ልዩ',         labelEn: 'Luxury Mesk & Special',   labelOm: 'Mesk & Addaa' },
];

const PACKAGES_BY_CATEGORY = {
  studio: [
    {
      id: 'studio-10k',
      tierAm: 'ቤሲክ',
      tierEn: 'BASIC',
      tierOm: 'BU\'UURAA',
      badgeAm: 'ተወዳጅ',
      badgeEn: 'Most Popular',
      badgeOm: 'Jaallatamaa',
      titleAm: 'የስታዲዮ ቀረጻ (Studio Session)',
      titleEn: 'Studio Session',
      titleOm: 'Tajaajila Istuudiyoo',
      descAm: 'ለጥቃቅን እና ለቀላል የፎቶ ቀረጻዎች ፍጹም ተስማሚ።',
      descEn: 'Great for small shoots and simple needs.',
      descOm: 'Waraabsa xixxiqqoo fi fedhii salphaaf mijataa.',
      price: '10,000',
      priceNum: 10000,
      btnStyle: 'dark',
      isDark: false,
      deliverablesAm: [
        '20 የታተሙ ፎቶዎች (20 Print Photos)',
        '10 ፖስት ፎቶዎች (10 Post Photos)',
        'ሜካፕ የተካተተ (Professional Makeup)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      ],
      deliverablesEn: [
        '20 Print Photos (20 Print Photos)',
        '10 Post Photos (10 Post Photos)',
        'Professional Makeup Included',
        '150 Soft Copies (150 Soft Copies)',
      ],
      deliverablesOm: [
        'Suuraa Maxxanfame 20 (20 Print Photos)',
        'Suuraa Post 10 (10 Post Photos)',
        'Makeup Pirofeeshiinaalaa',
        'Soofti Koppii 150 (150 Soft Copies)',
      ],
    },
    {
      id: 'studio-145k',
      tierAm: 'ስታንዳርድ',
      tierEn: 'STANDARD',
      tierOm: 'ISTAANDAARDII',
      badgeAm: 'ምርጥ ዋጋ',
      badgeEn: 'Best Value',
      badgeOm: 'Gatii Gaarii',
      titleAm: 'ስታንዳርድ ስቱዲዮ (Event Coverage)',
      titleEn: 'Event Coverage',
      titleOm: 'Uwwisa Ayyaanaa',
      descAm: 'ለልዩ በዓላት፣ ለፓርቲዎች እና ለፎቶ ቀረጻዎች ተመራጭ።',
      descEn: 'Perfect for events, parties and special occasions.',
      descOm: 'Ayyaanota addaa fi qophiilee garaagaraaf kan ta\'u.',
      price: '14,500',
      priceNum: 14500,
      btnStyle: 'outline',
      isDark: false,
      deliverablesAm: [
        '200 የምስጋና ካርዶች (200 Thank-You Cards)',
        '40×60 ቦርድ ፎቶ (40×60 Board Photo)',
        'ሜካፕ የተካተተ (Professional Makeup)',
        '10 ፖስት ፎቶዎች (10 Post Photos)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      ],
      deliverablesEn: [
        '200 Print Photos (200 Thank-You Cards)',
        '40×60 cm Photo (40×60 Board Photo)',
        'Professional Makeup Included',
        '10 Post Photos (10 Post Photos)',
        '150 Soft Copies (150 Soft Copies)',
      ],
      deliverablesOm: [
        'Kaardii Galateeffannaa 200 (Thank-You Cards)',
        'Suuraa Boordii 40×60 cm',
        'Makeup Pirofeeshiinaalaa',
        'Suuraa Post 10 (10 Post Photos)',
        'Soofti Koppii 150 (150 Soft Copies)',
      ],
    },
    {
      id: 'studio-185k',
      tierAm: 'ፕሪሚየም',
      tierEn: 'PREMIUM',
      tierOm: 'PIROMIYAMI',
      badgeAm: 'ምርጥ ምርጫ',
      badgeEn: 'Best Choice',
      badgeOm: 'Filatamaa',
      titleAm: 'ሙሉ ፕሮዳክሽን (Full Production)',
      titleEn: 'Full Production',
      titleOm: 'Oomisha Guutuu',
      descAm: 'የተሟላ እና ደረጃውን የጠበቀ የአልበም ተሞክሮ ለሚፈልጉ።',
      descEn: 'For those who want the complete experience.',
      descOm: 'Muuxannoo albaama guutuu fi qulqullina olaanaa barbaadaniif.',
      price: '18,500',
      priceNum: 18500,
      btnStyle: 'red',
      isDark: true,
      deliverablesAm: [
        '30×45 ላሚኔት አልበም (10/20 ገጽ)',
        '1 ሳይን ቦርድ (Sign Board)',
        '200 የምስጋና ካርዶች (200 Thank-You Cards)',
        'ሜካፕ የተካተተ (Professional Makeup)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      ],
      deliverablesEn: [
        '30×45 cm Photo Album (10/20 Page)',
        '1 Sign Board (Sign Board)',
        '200 Print Photos (200 Thank-You Cards)',
        'Professional Makeup Included',
        '150 Soft Copies (150 Soft Copies)',
      ],
      deliverablesOm: [
        'Albaama Laamineetii 30×45 (Fuula 10/20)',
        'Sign Board 1 (Sign Board)',
        'Kaardii Galateeffannaa 200 (Thank-You Cards)',
        'Makeup Pirofeeshiinaalaa',
        'Soofti Koppii 150 (150 Soft Copies)',
      ],
    },
  ],
  wedding: [
    {
      id: 'wedding-bronze',
      tierAm: 'ቤሲክ',
      tierEn: 'BASIC',
      tierOm: 'BU\'UURAA',
      badgeAm: 'ተመራጭ',
      badgeEn: 'Most Popular',
      badgeOm: 'Barbaachisaa',
      titleAm: 'ብሮንዝ ፓኬጅ (2 ካሜራ)',
      titleEn: 'Bronze Package',
      titleOm: 'Paakeejii Bironzii',
      descAm: 'የተሟላ የ2 ካሜራ ሲኒማቲክ ሽፋን ለሰርግ በዓል።',
      descEn: 'Essential 2-camera cinematic coverage for intimate ceremonies.',
      descOm: 'Uwwisa viidiyoo sinimaatiikii kaameraa 2 cidhaaf.',
      price: '45,000',
      priceNum: 45000,
      btnStyle: 'dark',
      isDark: false,
      deliverablesAm: [
        '2 ፕሮፌሽናል ካሜራዎች (2 Cameras)',
        'ሮኒን ጊምባል ስቴቢላይዘር (Ronin Gimbal)',
        'አመራን ላይቲንግ (Ameran Light)',
        'ትሬለር ቪዲዮ + ሙሉ ቪዲዮ (Trailer & Full Edit)',
        'ከለር ግሬዲንግ (Color Grading)',
        'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)',
      ],
      deliverablesEn: [
        '2 Professional Cameras (2 Cameras)',
        'Ronin Gimbal Stabilization',
        'Ameran Lighting System',
        'Trailer Video + Full Edited Cinema Video',
        'Professional Color Grading',
        'All Soft Copies Free (Soft Copies)',
      ],
      deliverablesOm: [
        'Kaameraawwan Pirofeeshiinaalaa 2',
        'Ronin Gimbal Stabilization',
        'Ibsaa Ameran Light',
        'Viidiyoo Trailer + Viidiyoo Guutuu',
        'Gulaala Halluu (Color Grading)',
        'Soofti Koppii Hundumtuu Bilisaan',
      ],
    },
    {
      id: 'wedding-silver',
      tierAm: 'ስታንዳርድ',
      tierEn: 'STANDARD',
      tierOm: 'ISTAANDAARDII',
      badgeAm: 'ተወዳጅ',
      badgeEn: 'Best Value',
      badgeOm: 'Jaallatamaa',
      titleAm: 'ሲልቨር ፓኬጅ (3 ካሜራ + ቦርድ)',
      titleEn: 'Silver Package',
      titleOm: 'Paakeejii Siilvarii',
      descAm: 'በበርካታ አቅጣጫዎች የሚቀረጽ ባለ 3 ካሜራ ሽፋን ከቦርድ ፎቶ ጋር።',
      descEn: '3-camera multi-angle coverage with wall board photo.',
      descOm: 'Uwwisa kaameraa 3 suuraa boordii 40×60 waliin.',
      price: '60,000',
      priceNum: 60000,
      btnStyle: 'outline',
      isDark: false,
      deliverablesAm: [
        '3 ፕሮፌሽናል ካሜራዎች (3 Cameras)',
        'ሮኒን ጊምባል ስቴቢላይዘር (Ronin Gimbal)',
        'አመራን ላይቲንግ (Ameran Light)',
        'ትሬለር ቪዲዮ + ሙሉ ቪዲዮ (Trailer & Full Edit)',
        'ከለር ግሬዲንግ (Color Grading)',
        '40×60 ቦርድ ፎቶ (40×60 Board Photo)',
        'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)',
      ],
      deliverablesEn: [
        '3 Professional Cameras (3 Cameras)',
        'Ronin Gimbal Stabilization',
        'Ameran Lighting System',
        'Trailer Video + Full Edited Cinema Video',
        'Professional Color Grading',
        '40×60 cm Photo (40×60 Board Photo)',
        'All Soft Copies Free (Soft Copies)',
      ],
      deliverablesOm: [
        'Kaameraawwan Pirofeeshiinaalaa 3',
        'Ronin Gimbal Stabilization',
        'Ibsaa Ameran Light',
        'Viidiyoo Trailer + Viidiyoo Guutuu',
        'Gulaala Halluu (Color Grading)',
        'Suuraa Boordii 40×60 cm',
        'Soofti Koppii Hundumtuu Bilisaan',
      ],
    },
    {
      id: 'wedding-golden-75',
      tierAm: 'ፕሪሚየም',
      tierEn: 'PREMIUM',
      tierOm: 'PIROMIYAMI',
      badgeAm: 'ምርጥ ምርጫ',
      badgeEn: 'Best Choice',
      badgeOm: 'Filatamaa',
      titleAm: 'ጎልደን ፕላስ ፓኬጅ (4 ካሜራ + አልበም + 2 ቦርድ)',
      titleEn: 'Golden Plus Suite',
      titleOm: 'Paakeejii Warqee Plus',
      descAm: 'የተሟላ የ4 ካሜራ ሲኒማቲክ ፊልም ከትልቅ ላሚኔት አልበም እና ሁለት ቦርዶች ጋር።',
      descEn: 'Ultimate 4-camera cinematic story with luxury album & dual boards.',
      descOm: 'Viidiyoo sinimaatiikii kaameraa 4, albaama 30×90 fi boordii 2 waliin.',
      price: '75,000',
      priceNum: 75000,
      btnStyle: 'red',
      isDark: true,
      deliverablesAm: [
        '4 ፕሮፌሽናል ካሜራዎች (4 Cameras)',
        'ሮኒን ጊምባል + አመራን ላይት (Ronin & Ameran)',
        'ትሬለር ቪዲዮ + ሙሉ ሲኒማ ቪዲዮ (Trailer & Film)',
        '30×90 ላሚኔት አልበም (30×90 Laminate Album)',
        '50×80 ላሚኔት ቦርድ + 40×60 ቦርድ (2 Boards)',
        'ሁሉም ሶፍት ኮፒ በነጻ (All Soft Copies Free)',
      ],
      deliverablesEn: [
        '4 Professional Cameras (4 Cameras)',
        'Ronin Gimbal & Ameran Lighting System',
        'Trailer Video + Full Edited Cinema Film',
        '30×90 cm Photo Album (Laminate)',
        '50×80 cm + 40×60 cm Board Photos',
        'All Soft Copies Free (Soft Copies)',
      ],
      deliverablesOm: [
        'Kaameraawwan Pirofeeshiinaalaa 4',
        'Ronin Gimbal & Ameran Light',
        'Viidiyoo Trailer + Fiilmii Guutuu',
        'Albaama Laamineetii 30×90 cm',
        'Boordii Laamineetii 50×80 + Boordii 40×60',
        'Soofti Koppii Hundumtuu Bilisaan',
      ],
    },
  ],
  mesk_special: [
    {
      id: 'mesk-16k',
      tierAm: 'ቤሲክ',
      tierEn: 'BASIC',
      tierOm: 'BU\'UURAA',
      badgeAm: 'የመስክ ቪዲዮ',
      badgeEn: 'Most Popular',
      badgeOm: 'Waraabsa Mesk',
      titleAm: 'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Session)',
      titleEn: 'Mesk Video Session',
      titleOm: 'Viidiyoo Mesk (Alaa)',
      descAm: 'ከተፈጥሮ ጋር የተዋሃደ ውብ የመስክ የቪዲዮ ቀረጻ።',
      descEn: 'Cinematic outdoor video story in scenic landscapes.',
      descOm: 'Waraabsa viidiyoo sinimaatiikii uumamaa bareedaa.',
      price: '16,000',
      priceNum: 16000,
      btnStyle: 'dark',
      isDark: false,
      deliverablesAm: [
        'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Video)',
        '1 ሳይን ቦርድ (1 Sign Board)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
        'ከለር ግሬዲንግ (Color Grading)',
      ],
      deliverablesEn: [
        'Cinematic Mesk (Outdoor) Video',
        '1 Sign Board (Sign Board)',
        '150 Soft Copies (150 Soft Copies)',
        'Professional Color Grading',
      ],
      deliverablesOm: [
        'Viidiyoo Sinimaatiikii Mesk (Alaa)',
        'Sign Board 1 (Sign Board)',
        'Soofti Koppii 150 (150 Soft Copies)',
        'Gulaala Halluu (Color Grading)',
      ],
    },
    {
      id: 'mesk-20k',
      tierAm: 'ስታንዳርድ',
      tierEn: 'STANDARD',
      tierOm: 'ISTAANDAARDII',
      badgeAm: 'ቪዲዮ + አልበም',
      badgeEn: 'Best Value',
      badgeOm: 'Gatii Gaarii',
      titleAm: 'የመስክ ቪዲዮ እና አልበም (Mesk + Album)',
      titleEn: 'Mesk Video & Album',
      titleOm: 'Viidiyoo Mesk + Albaama',
      descAm: 'የመስክ ሲኒማቲክ ቪዲዮ ከተመረጠ ላሚኔት አልበም ጋር።',
      descEn: 'Outdoor cinematic film paired with fine-art laminate album.',
      descOm: 'Viidiyoo sinimaatiikii mesk albaama laamineetii waliin.',
      price: '20,000',
      priceNum: 20000,
      btnStyle: 'outline',
      isDark: false,
      deliverablesAm: [
        'የመስክ ሲኒማቲክ ቪዲዮ (Mesk Video)',
        '30×45 ላሚኔት አልበም (30×45 Laminate Album)',
        '1 ሳይን ቦርድ (1 Sign Board)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      ],
      deliverablesEn: [
        'Cinematic Mesk (Outdoor) Video',
        '30×45 cm Photo Album (Laminate)',
        '1 Sign Board (Sign Board)',
        '150 Soft Copies (150 Soft Copies)',
      ],
      deliverablesOm: [
        'Viidiyoo Sinimaatiikii Mesk (Alaa)',
        'Albaama Laamineetii 30×45 cm',
        'Sign Board 1 (Sign Board)',
        'Soofti Koppii 150 (150 Soft Copies)',
      ],
    },
    {
      id: 'special-23k',
      tierAm: 'ፕሪሚየም',
      tierEn: 'PREMIUM',
      tierOm: 'PIROMIYAMI',
      badgeAm: 'ምርጥ ምርጫ',
      badgeEn: 'Best Choice',
      badgeOm: 'Filatamaa',
      titleAm: 'ልዩ የፎቶ ማስታወሻ ፓኬጅ (Special 2)',
      titleEn: 'Grand Keepsake Suite',
      titleOm: 'Paakeejii Addaa Suuraa',
      descAm: 'ትልቅ 30×90 አልበም፣ 50×80 ቦርድ፣ ሴቭ ዘ ዴት እና የምስጋና ካርዶች።',
      descEn: 'Exclusive 30×90 laminate album, large 50×80 board & save-the-date.',
      descOm: 'Albaama 30×90, boordii 50×80, kaardiiwwan galateeffannaa fi suuraa addaa.',
      price: '23,000',
      priceNum: 23000,
      btnStyle: 'red',
      isDark: true,
      deliverablesAm: [
        '30×90 ላሚኔት አልበም (10/20 ገጽ)',
        '50×80 ቦርድ ፎቶ (50×80 Wall Board)',
        '1 ሳይን ቦርድ (1 Sign Board)',
        '200 የምስጋና ካርዶች (200 Thank-You Cards)',
        '5 ሴቭ ዘ ዴት ፎቶዎች (5 Save-the-Date Photos)',
        '150 ሶፍት ኮፒ ፎቶዎች (150 Soft Copies)',
      ],
      deliverablesEn: [
        '30×90 cm Photo Album (10/20 Page)',
        '50×80 cm Wall Board (50×80 Board)',
        '1 Sign Board (Sign Board)',
        '200 Print Photos (200 Thank-You Cards)',
        '5 Save-the-Date Photos',
        '150 Soft Copies (150 Soft Copies)',
      ],
      deliverablesOm: [
        'Albaama Laamineetii 30×90 (Fuula 10/20)',
        'Suuraa Boordii 50×80 cm',
        'Sign Board 1 (Sign Board)',
        'Kaardii Galateeffannaa 200',
        'Suuraa Save-the-Date 5',
        'Soofti Koppii 150 (150 Soft Copies)',
      ],
    },
  ],
};

const galleryImages = [
  ['photo_2026-07-03_20-31-22_7668160935271833600.jpg', 'Golden Hour Love', 'የፀሐይ መግቢያ ፍቅር', 'Jaalala Yeroo Aduu'],
  ['photo_2026-07-03_20-34-45_7668160982247493632.jpg', 'Garden Portrait', 'የጋርደን ፎቶ', 'Suuraa Maasaa/Gadaa'],
  ['photo_2026-07-03_20-37-55_7668161085785812992.jpg', 'Floral Archive', 'የአበባ ማህደር', 'Kuusaa Daraaraa'],
  ['photo_2026-07-03_20-31-18_7668160944615066624.jpg', 'Bridal Beauty', 'የሙሽራዋ ውበት', 'Bareedina Misirroo'],
  ['photo_2026-07-03_20-34-57_7668161010354493440.jpg', 'Quiet Joy', 'ጸጥተኛ ደስታ', 'Gammachuu Tasgabbaa\'aa'],
  ['photo_2026-07-03_20-37-48_7668161057622723584.jpg', 'Evening Glamour', 'የምሽት ውበት', 'Bareedina Galgalaa'],
  ['photo_2026-07-03_20-35-00_7668161019770662912.jpg', 'Together in Nature', 'አብረው በተፈጥሮ ውስጥ', 'Waliin Uumama Keessa'],
  ['photo_2026-07-03_20-35-01_7668161048338929664.jpg', 'First Glance', 'የመጀመሪያው እይታ', 'Ilaalcha Jalqabaa'],
  ['photo_2026-07-03_20-37-56_7668161066939796480.jpg', 'Always Us', 'ሁልጊዜ እኛ', 'Yeroo Hunda Nuti'],
].map(([file, altEn, altAm, altOm]) => ({ src: `${ASSET}/gallery/${file}`, altEn, altAm, altOm }));

/* ── HELPERS ────────────────────────────────────────────────────────────── */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Scroll-reveal hook */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── PAGE LOADER ────────────────────────────────────────────────────────── */
function PageLoader({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1800);
    const t2 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className={out ? 'page-loader loader-out' : 'page-loader'} aria-hidden="true">
      <div className="loader-logo">
        <img src={`${ASSET}/hope-logo.png`} alt="HOPE" className="loader-logo-img" />
        <span className="loader-name">HOPE</span>
        <span className="loader-sub">PHOTO & VELO</span>
      </div>
      <div className="loader-bar"><div className="loader-fill" /></div>
    </div>
  );
}

/* ── BOOKING PANEL ─────────────────────────────────────────────────────── */
function BookingPanel({ selectedPackage, onClose, lang }) {
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState({ name: '', date: '', phone: '', note: '' });
  const t = T[lang];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pkgName = lang === 'en'
    ? (selectedPackage?.titleEn ?? selectedPackage?.nameEn ?? selectedPackage?.name ?? 'HOPE Package')
    : lang === 'om'
    ? (selectedPackage?.titleOm ?? selectedPackage?.nameOm ?? selectedPackage?.name ?? 'Paakeejii HOPE')
    : (selectedPackage?.titleAm ?? selectedPackage?.nameAm ?? selectedPackage?.name ?? 'የ HOPE ፓኬጅ');

  const deliverables = lang === 'en'
    ? (selectedPackage?.deliverablesEn ?? selectedPackage?.deliverablesAm ?? [])
    : lang === 'om'
    ? (selectedPackage?.deliverablesOm ?? selectedPackage?.deliverablesAm ?? [])
    : (selectedPackage?.deliverablesAm ?? []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const deliverablesText = deliverables.length
      ? `\n\n📋 Included Deliverables (${deliverables.length}):\n` + deliverables.map(d => `• ${d}`).join('\n')
      : selectedPackage?.servicesList?.length
      ? `\n\n📋 Included Services:\n` + selectedPackage.servicesList.join('\n')
      : '';

    const formattedMessage = `📸 NEW BOOKING REQUEST — HOPE PHOTO & VELO\n\n` +
      `📦 Package: ${pkgName}\n` +
      `💰 Official Price: ${selectedPackage?.price ? selectedPackage.price + ' ETB' : 'Standard Rate'}` +
      deliverablesText + `\n\n` +
      `👤 Client Name: ${form.name}\n` +
      `📅 Target Date: ${form.date}\n` +
      `📞 Phone: ${form.phone}\n` +
      `📝 Note / Details: ${form.note || 'N/A'}`;

    try {
      await Promise.all(
        TELEGRAM_CHAT_IDS.map(chat_id =>
          fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id,
              text: formattedMessage,
            }),
          })
        )
      );
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="booking-layer" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="booking-backdrop" aria-label="Close" onClick={onClose} />
      <section className="booking-panel">
        <button className="icon-button close-button" onClick={onClose}><X size={20} /></button>
        {submitted ? (
          <div className="booking-success">
            <div className="success-mark"><Check size={34} /></div>
            <p className="eyebrow">{t.successEyebrow}</p>
            <h2>{t.successH2}</h2>
            <p>{t.successBody}</p>
            <button className="primary-button" onClick={onClose}>{t.backBtn} <ArrowRight size={17} /></button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{t.bookingEyebrow}</p>
            <h2 id="booking-title">{t.bookingH2.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</h2>
            <p className="booking-intro">{t.bookingIntro}</p>
            {selectedPackage && (
              <div className="selected-package">
                <span>{t.bookingSelectedLabel}</span>
                <strong>{pkgName}</strong>
                <b>{selectedPackage.price ? `${selectedPackage.price} ETB` : ''}</b>
                {deliverables.length > 0 && (
                  <div className="selected-pkg-deliverables">
                    <small>{lang === 'am' ? 'የተካተቱ ዋና ዋና ነገሮች:' : lang === 'om' ? 'Waan Dabalame:' : 'Included:'}</small>
                    <ul>
                      {deliverables.slice(0, 4).map((item, idx) => (
                        <li key={idx}><Check size={12} /> {item}</li>
                      ))}
                      {deliverables.length > 4 && (
                        <li><Sparkles size={12} /> +{deliverables.length - 4} {lang === 'am' ? 'ተጨማሪ አገልግሎቶች' : lang === 'om' ? 'dabalataa' : 'more items'}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <form className="booking-form" onSubmit={submit}>
              {t.bookingLabels.map((label, i) => (
                <label key={i}>{label}
                  {i === 3
                    ? <textarea name="note" value={form.note} onChange={update} placeholder={t.bookingPlaceholders[3]} rows="3" />
                    : <input required name={['name','date','phone'][i]} type={i===1?'date':i===2?'tel':'text'} value={form[['name','date','phone'][i]]} onChange={update} placeholder={t.bookingPlaceholders[i]} />}
                </label>
              ))}
              <button className="primary-button form-button" type="submit" disabled={submitting}>
                {submitting ? (lang === 'am' ? 'በመላክ ላይ...' : lang === 'om' ? 'Ergamaa Jira...' : 'Submitting...') : t.bookingSubmit} <Send size={17} />
              </button>
              <button
                type="button"
                className="telegram-miniapp-quicklink"
                onClick={() => { onClose(); onOpenTma?.(selectedPackage); }}
              >
                <Sparkles size={16} />
                <span>{lang === 'am' ? 'በቴሌግራም ሚኒ አፕ ዋጋ ይደራደሩ & ስምምነት ይፈራረሙ' : 'Negotiate & Sign Agreement in Telegram Mini App'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

/* ── PACKAGES SECTION (EXACT 3-CARD LAYOUT WITH TOP CATEGORY BUTTONS) ────── */
function PackagesSection({ lang, openBooking }) {
  const [activeCategory, setActiveCategory] = useState('studio');
  const t = T[lang];

  const currentCards = PACKAGES_BY_CATEGORY[activeCategory] || PACKAGES_BY_CATEGORY.studio;

  return (
    <section id="pricing" className="pricing-packages-section section-anchor">
      {/* ── Top Header Section (Matching Design Image) ── */}
      <div className="packages-section-head">
        <div className="packages-head-left">
          <p className="pricing-eyebrow-red">{t.pricingEyebrow}</p>
          <h2 className="pricing-main-h2">
            {t.pricingH2a}
            <br />
            <span className="pricing-h2-muted">{t.pricingH2b}</span>
          </h2>
          <p className="pricing-sub-desc">{t.pricingNote}</p>
        </div>

        <div className="packages-head-right">
          <p className="pricing-script-tag">{t.pricingScript}</p>
          <div className="pricing-category-pill-nav">
            {CATEGORIES_TABS.map(cat => {
              const isActive = activeCategory === cat.id;
              const label = lang === 'en' ? cat.labelEn : lang === 'om' ? cat.labelOm : cat.labelAm;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`pricing-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3 Cards Grid (Categorized by 3) ── */}
      <div className="pricing-3cards-grid" key={activeCategory}>
        {currentCards.map((pkg) => {
          const tier = lang === 'en' ? pkg.tierEn : lang === 'om' ? pkg.tierOm : pkg.tierAm;
          const badge = lang === 'en' ? pkg.badgeEn : lang === 'om' ? pkg.badgeOm : pkg.badgeAm;
          const title = lang === 'en' ? pkg.titleEn : lang === 'om' ? pkg.titleOm : pkg.titleAm;
          const desc = lang === 'en' ? pkg.descEn : lang === 'om' ? pkg.descOm : pkg.descAm;
          const deliverables = lang === 'en' ? pkg.deliverablesEn : lang === 'om' ? pkg.deliverablesOm : pkg.deliverablesAm;

          return (
            <article
              key={pkg.id}
              className={`pricing-v2-card ${pkg.isDark ? 'card-premium-dark' : 'card-light-tier'}`}
            >
              {/* Card Header: Tier Label & Pill Badge */}
              <div className="card-v2-top-bar">
                <span className="card-v2-tier-tag">{tier}</span>
                {badge && (
                  <span className={`card-v2-pill-badge ${pkg.isDark ? 'badge-red-solid' : 'badge-light-subtle'}`}>
                    {badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="card-v2-title">{title}</h3>
              <p className="card-v2-desc">{desc}</p>

              {/* Price Display */}
              <div className="card-v2-price-wrap">
                <div className="price-number-row">
                  <span className="price-amount">{pkg.price}</span>
                  <span className="price-currency-unit">ETB</span>
                </div>
                <span className="price-starting-label">{t.pricingStartingFrom}</span>
              </div>

              {/* Divider Line */}
              <hr className="card-v2-divider" />

              {/* Deliverables / Features List */}
              <ul className="card-v2-features-list">
                {deliverables.map((item, idx) => (
                  <li key={idx}>
                    <span className={`feature-check-icon ${pkg.isDark ? 'check-red' : 'check-grey'}`}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="feature-text">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="card-v2-cta-wrap">
                <button
                  type="button"
                  className={`card-v2-action-btn ${
                    pkg.btnStyle === 'red'
                      ? 'btn-style-red'
                      : pkg.btnStyle === 'outline'
                      ? 'btn-style-outline'
                      : 'btn-style-dark'
                  }`}
                  onClick={() => openBooking(pkg)}
                >
                  <span>{t.pricingBookBtn}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Bottom Strip (Need Something Special?) ── */}
      <div className="pricing-bottom-special-bar">
        <div className="bottom-bar-left">
          <Sparkles size={20} className="bottom-bar-sparkle-icon" />
          <span className="bottom-bar-bold-title">{t.pricingNeedSpecial}</span>
          <span className="bottom-bar-desc-text">{t.pricingCustomNote}</span>
        </div>
        <button
          type="button"
          className="bottom-bar-contact-btn"
          onClick={() => openBooking({ titleEn: 'Custom / Special Inquiry', titleAm: 'ልዩ ጥያቄ', price: 'Custom' })}
        >
          <span>{t.pricingContactBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ── REVEAL SECTION WRAPPER ─────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ── APP ────────────────────────────────────────────────────────────────── */
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isTmaDirect = urlParams.get('tma') === '1' || Boolean(window.Telegram?.WebApp?.initData);

  if (isTmaDirect) {
    return <TelegramMiniApp />;
  }

  const [loaded, setLoaded]   = useState(false);
  const [lang, setLang]       = useState('am');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [showTmaModal, setShowTmaModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeLocTab, setActiveLocTab] = useState(0);

  const t = T[lang];

  useEffect(() => { document.body.style.overflow = (!loaded || bookingPkg || showTmaModal) ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [loaded, bookingPkg, showTmaModal]);

  const openBooking = (pkg = null) => { setBookingPkg(pkg ?? { name: 'የ HOPE አገልግሎት', nameEn: 'HOPE Service', nameOm: 'Tajaajila HOPE', price: 'TBD' }); setMenuOpen(false); };
  const nav = (t) => { scrollToSection(t); setMenuOpen(false); };
  const toggleLang = () => setLang(l => l === 'am' ? 'en' : l === 'en' ? 'om' : 'am');

  const locImgs = [galleryImages[1].src, galleryImages[3].src, galleryImages[5].src];

  return (
    <>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <main className={loaded ? 'site-main main-visible' : 'site-main'}>

        {/* ── ANNOUNCEMENT ── */}
        <div className="announcement">
          <Heart size={12} fill="currentColor" /> <span>{lang === 'am' ? 'አዲስ አበባ • በፍቅር የተመሠረተ ፎቶግራፊ እና ቪዲዮ' : lang === 'om' ? 'FINFINNEE • JAALALAAN HUNDEEFFAME PHOTOGRAPHY & VIDEO' : 'ADDIS ABABA • BUILT ON LOVE PHOTOGRAPHY & VIDEO'}</span>
        </div>

        {/* ── HEADER ── */}
        <header className="site-header">
          <button className="brand" onClick={() => scrollToSection('home')} aria-label="HOPE">
            <img src={`${ASSET}/hope-logo.png`} alt="HOPE" className="brand-logo" />
          </button>
          <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
            <button onClick={() => nav('story')}>{t.nav.about}</button>
            <button onClick={() => nav('work')}>{t.nav.work}</button>
            <button onClick={() => nav('craft')}>{t.nav.craft}</button>
            <button onClick={() => nav('locations')}>{t.nav.locations}</button>
            <button onClick={() => nav('pricing')}>{t.nav.pricing}</button>
            <button onClick={() => nav('faq')}>{t.nav.faq}</button>
          </nav>
          <div className="header-right">
            <a className="header-call-btn" href={`tel:${PHONE_LINK}`} aria-label="Call HOPE">
              <Phone size={15} />
              <span className="call-text">{PHONE_DISPLAY}</span>
            </a>
            <button className="header-tma-btn" onClick={() => setShowTmaModal(true)} title="HOPE Telegram Mini App">
              <Sparkles size={14} />
              <span>Mini App</span>
            </button>
            <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
              <Globe size={15} />
              <span>{lang === 'am' ? 'አማ' : lang === 'en' ? 'EN' : 'OR'}</span>
            </button>
            <button className="header-book" onClick={() => openBooking()}>
              <span>{t.bookBtn}</span>
              <CalendarDays size={15} />
            </button>
            <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* ── HERO — Reference Design matching user mock ── */}
        <section id="home" className="hero hero-ref-design section-anchor">
          {/* Hero Background Image Container (Desktop vs Mobile specific image) */}
          <div className="hero-couple-container">
            <picture>
              <source media="(max-width: 900px)" srcSet={`${ASSET}/hero_mobile_bg.jpg`} />
              <img
                src={`${ASSET}/weee.jpg`}
                alt="Hope Photo Hero Background"
                className="hero-couple-img"
              />
            </picture>
          </div>

          <div className="hero-bg-overlay" />

          {/* Top Row: Left Text + Floating Pills */}
          <div className="hero-top-row">
            {/* Left Content Column */}
            <div className="hero-content-col">
              <div className="hero-eyebrow-pill">
                <Heart size={12} fill="#8B1E2D" color="#8B1E2D" />
                <span>{t.heroEyebrow}</span>
              </div>

              <h1 className="hero-h1-ref">
                {lang === 'am' ? (
                  <>
                    <span className="h1-row">
                      ጊዜያት
                      <span className="h1-circle-avatar">
                        <img src={`${ASSET}/hero-h1-avatar.jpg`} alt="Bride sunset silhouette" />
                      </span>
                    </span>
                    <span className="h1-row">ያልፋሉ፤</span>
                    <span className="h1-row h1-row-highlight">ትዝታ ይቀራል።</span>
                  </>
                ) : lang === 'om' ? (
                  <>
                    <span className="h1-row">
                      Yeroon
                      <span className="h1-circle-avatar">
                        <img src={`${ASSET}/hero-h1-avatar.jpg`} alt="Bride sunset silhouette" />
                      </span>
                    </span>
                    <span className="h1-row">ni darba;</span>
                    <span className="h1-row h1-row-highlight">yaadannoon ni tura.</span>
                  </>
                ) : (
                  <>
                    <span className="h1-row">
                      Moments
                      <span className="h1-circle-avatar">
                        <img src={`${ASSET}/hero-h1-avatar.jpg`} alt="Bride sunset silhouette" />
                      </span>
                    </span>
                    <span className="h1-row">pass—</span>
                    <span className="h1-row h1-row-highlight">memories remain.</span>
                  </>
                )}
              </h1>

              <p className="hero-sub-ref">{t.heroText}</p>

              <div className="hero-cta-group">
                <button className="hero-btn-primary" onClick={() => openBooking()}>
                  {t.bookNow}
                </button>
                <button className="hero-btn-secondary" onClick={() => scrollToSection('story')}>
                  {t.nav.about}
                </button>
              </div>
            </div>

            {/* Floating Pill Badges overlaying background image */}
            <div className="hero-floating-pills">
              <div className="hero-pill hero-pill-blue">
                <span className="pill-icon-circle blue-icon"><Sparkles size={13} /></span>
                <span>{t.heroPills.real}</span>
              </div>
              <div className="hero-pill hero-pill-lime">
                <span className="pill-icon-circle lime-icon"><Sparkles size={13} /></span>
                <span>{t.heroPills.timeless}</span>
              </div>
              <div className="hero-pill hero-pill-green">
                <span className="pill-icon-circle green-icon"><Camera size={13} /></span>
                <span>{t.heroPills.vision}</span>
              </div>
              <div className="hero-pill hero-pill-pink">
                <span className="pill-icon-circle pink-icon"><Film size={13} /></span>
                <span>{t.heroPills.quality}</span>
              </div>
            </div>
          </div>

          {/* 3 Proof Cards connected directly inside the bottom of hero section */}
          <div className="hero-proof-strip">
            <div className="hero-proof-tile">
              <img src={`${ASSET}/hero-card-1.jpg`} alt="Golden Hour Sunset Love" loading="eager" />
            </div>
            <div className="hero-proof-tile">
              <img src={`${ASSET}/hero-card-2.jpg`} alt="Garden Wedding Walk" loading="eager" />
            </div>
            <div className="hero-proof-tile">
              <img src={`${ASSET}/hero-card-3.jpg`} alt="Evening Dusk Couple" loading="eager" />
            </div>
          </div>
        </section>

        {/* ── STORY / ABOUT ── */}
        <section id="story" className="intro section-anchor">
          <div className="intro-side"><p className="eyebrow">{t.storyEyebrow}</p><span className="tall-line" /></div>
          <Reveal className="intro-copy">
            <p className="script">{t.storyScript}</p>
            <h2>{t.storyH2a}<br /><em>{t.storyH2b}</em></h2>
            <p>{t.storyBody}</p>
            <button className="underlined-button story-cta-btn" onClick={() => scrollToSection('work')}>
              <span>{t.storyCta}</span>
              <ArrowRight size={16} className="btn-arrow-icon" />
            </button>
          </Reveal>
          <div className="intro-picture">
            <img src={galleryImages[6].src} alt={lang === 'en' ? galleryImages[6].altEn : lang === 'om' ? galleryImages[6].altOm : galleryImages[6].altAm} />
            <span>{t.storySince}</span>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="services">
          <div className="section-heading">
            <p className="eyebrow">{t.servicesEyebrow}</p>
            <h2>{t.servicesH2a}<br />{t.servicesH2b}</h2>
          </div>
          <div className="feature-grid">
            {[Camera, Video, Sparkles].map((Icon, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="feature-card">
                  <div className="feature-number">0{i + 1}</div>
                  <Icon size={28} strokeWidth={1.4} />
                  <h3>{t.features[i].title}</h3>
                  <p>{t.features[i].text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── WORK / GALLERY ── */}
        <section id="work" className="work section-anchor">
          <div className="work-heading">
            <div><p className="eyebrow">{t.workEyebrow}</p><h2>{t.workH2a}<br /><em>{t.workH2b}</em></h2></div>
            <button className="circle-scroll" onClick={() => setActiveImg((activeImg + 1) % galleryImages.length)} aria-label="Next photo"><ArrowRight /></button>
          </div>
          <div className="gallery-layout">
            <article className="feature-shot">
              <img src={galleryImages[activeImg].src} alt={lang === 'en' ? galleryImages[activeImg].altEn : lang === 'om' ? galleryImages[activeImg].altOm : galleryImages[activeImg].altAm} />
              <div className="photo-caption">
                <span>{t.workCaption}</span>
                <strong>{lang === 'en' ? galleryImages[activeImg].altEn : lang === 'om' ? galleryImages[activeImg].altOm : galleryImages[activeImg].altAm}</strong>
                <button onClick={() => setActiveImg((activeImg + 1) % galleryImages.length)}>{t.workNext} <ChevronRight size={15} /></button>
              </div>
            </article>
            <div className="mini-gallery">{galleryImages.slice(1, 5).map((p, i) => (
              <button className="mini-shot" key={i} onClick={() => setActiveImg(galleryImages.findIndex(g => g.src === p.src))}>
                <img src={p.src} alt={lang === 'en' ? p.altEn : lang === 'om' ? p.altOm : p.altAm} />
              </button>
            ))}</div>
          </div>
          <a className="instagram-banner" href="https://instagram.com" target="_blank" rel="noreferrer">
            <Camera size={19} /><span>{t.igBanner}</span><ArrowUpRight size={19} />
          </a>
        </section>

        {/* ── CRAFT & EQUIPMENT ── */}
        <section id="craft" className="craft-section section-anchor">
          <Reveal className="craft-header">
            <p className="eyebrow">{t.craftEyebrow}</p>
            <h2>{t.craftH2a}<br /><em>{t.craftH2b}</em></h2>
          </Reveal>
          <div className="craft-stats-bar">
            {t.craftStats.map(([val, label], i) => (
              <Reveal key={i} delay={i * 60} className="craft-stat">
                <strong>{val}</strong><span>{label}</span>
              </Reveal>
            ))}
          </div>
          <div className="craft-grid">
            {[Film, Sparkles, Sliders, Layers].map((Icon, i) => (
              <Reveal key={i} delay={i * 70} className="craft-card">
                <div className="craft-icon"><Icon size={26} /></div>
                <h3>{t.craftItems[i].title}</h3>
                <p>{t.craftItems[i].desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── LOCATIONS ── */}
        <section id="locations" className="locations-section section-anchor">
          <Reveal className="locations-header">
            <p className="eyebrow">{t.locationsEyebrow}</p>
            <h2>{t.locationsH2a}<br /><em>{t.locationsH2b}</em></h2>
          </Reveal>
          <div className="locations-tabs">
            {t.locationsTabs.map((label, idx) => (
              <button key={idx} className={activeLocTab === idx ? 'loc-tab loc-tab-active' : 'loc-tab'} onClick={() => setActiveLocTab(idx)}>{label}</button>
            ))}
          </div>
          <div className="locations-display">
            <div className="locations-art">
              <img src={locImgs[activeLocTab]} alt={t.locationsTitles[activeLocTab]} />
              <span className="loc-badge">{['OUTDOOR GARDEN', 'INDOOR STUDIO', 'NIGHT EDITORIAL'][activeLocTab]}</span>
            </div>
            <div className="locations-info">
              <p className="script">{lang === 'am' ? 'የቀረጻ አማራጭ' : lang === 'om' ? 'Filannoo Waraabsaa' : 'Shooting Option'}</p>
              <h3>{t.locationsTitles[activeLocTab]}</h3>
              <p>{t.locationsDescs[activeLocTab]}</p>
              <button className="primary-button" onClick={() => openBooking()}>{t.locationsCta} <ArrowRight size={17} /></button>
            </div>
          </div>

          {/* ── STUDIO MAP PREVIEW CARD ── */}
          <div className="studio-map-card">
            <div className="map-card-info">
              <span className="map-badge"><MapPin size={14} /> {lang === 'am' ? 'የስቱዲዮችን አድራሻ' : lang === 'om' ? 'Teessoo Istuudiyoo Keenyaa' : 'Studio Location'}</span>
              <h3>
                Tigat Building | Hayahulet<br />
                <small>{lang === 'am' ? 'ትጋት ህንጻ | ሃያሁለት' : lang === 'om' ? 'Gamoo Tigaat | Haayaahulet' : 'Tigat Building | Hayahulet'}</small>
              </h3>
              <p>
                {lang === 'am'
                  ? 'አዲስ አበባ፣ ሃያሁለት፣ ትጋት ህንጻ። ለቀረጻ፣ ለአልበም ምርጫ እና ለምክክር በምቹ ቦታ ላይ እንገኛለን።'
                  : lang === 'om'
                  ? 'Finfinnee, Haayaahulet, Gamoo Tigaat. Waraabsaaf, albaama filachuu fi mariif bakka mijaataa irratti argamna.'
                  : 'Hayahulet, Tigat Building, Addis Ababa, Ethiopia. Conveniently located for photo sessions, album reviews, and consultation.'}
              </p>
              <a
                href="https://maps.app.goo.gl/LAsxQjdytUAaCJTw9?g_st=atm"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-btn"
              >
                <MapPin size={16} />
                <span>{lang === 'am' ? 'በጉግል ካርታ ይክፈቱ (Google Maps)' : lang === 'om' ? 'Google Maps Irratti Bahaa' : 'Open in Google Maps'}</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="map-card-preview">
              <iframe
                title="Tigat Building | Hayahulet | ትጋት ህንጻ | ሃያሁለት Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d609.2949161350773!2d38.7823598790974!3d9.01489007097957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85a2696156e1%3A0x673a0abbcb9c8347!2zVGlnYXQgQnVpbGRpbmcgfCBIYXlhaHVsZXQgfCDhibXhjIvhibUg4YiF4YqV4Yy7IHwg4YiD4Yur4YiB4YiI4Ym1!5e1!3m2!1sen!2set!4v1785489984725!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" className="process-section section-anchor">
          <Reveal className="process-heading">
            <p className="eyebrow">{t.processEyebrow}</p>
            <h2>{t.processH2a}<br /><em>{t.processH2b}</em></h2>
          </Reveal>
          <div className="process-grid">
            {t.processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 70}>
                <article className="process-card">
                  <span className="step-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PRICING PACKAGES ── */}
        <PackagesSection lang={lang} openBooking={openBooking} />

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="testimonials-section section-anchor">
          <Reveal className="testimonials-heading">
            <p className="eyebrow">{t.testimonialEyebrow}</p>
            <h2>{t.testimonialH2a}<br /><em>{t.testimonialH2b}</em></h2>
          </Reveal>
          <div className="testimonials-grid">
            {t.testimonials.map((t2, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="testimonial-card">
                  <Quote className="quote-icon" size={32} />
                  <p className="testimonial-quote">"{t2.quote}"</p>
                  <div className="testimonial-author"><strong>{t2.name}</strong><span>{t2.event}</span></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="faq-section section-anchor">
          <Reveal className="faq-heading">
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2>{t.faqH2a}<br /><em>{t.faqH2b}</em></h2>
          </Reveal>
          <div className="faq-container">
            {t.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={isOpen ? 'faq-item faq-open' : 'faq-item'}>
                  <button className="faq-question" onClick={() => setOpenFaq(isOpen ? null : i)}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <div className={isOpen ? 'faq-answer faq-answer-open' : 'faq-answer'}>
                    <div><p>{faq.a}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className="closing-cta">
          <div className="closing-art"><img src={galleryImages[2].src} alt="Wedding photo" /><div className="closing-star">✦</div></div>
          <div className="closing-copy">
            <p className="eyebrow">{t.closingEyebrow}</p>
            <h2>{t.closingH2a}<br />{t.closingH2b} <em>{lang === 'am' ? '' : ''}</em></h2>
            <p>{t.closingBody}</p>
            <div>
              <button className="primary-button light-button" onClick={() => openBooking()}>{t.closingBtn} <CalendarDays size={18} /></button>
            </div>
          </div>
        </section>


        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-brand">
            <img src={`${ASSET}/hope-logo.png`} alt="HOPE" className="footer-logo" />
            <p>
              ፎቶ እና ቪዲዮ (VELO)<br />
              <span>{t.footerTagline}</span><br />
              <a
                href="https://maps.app.goo.gl/LAsxQjdytUAaCJTw9?g_st=atm"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-badge"
              >
                <MapPin size={13} /> Tigat Building | Hayahulet ({lang === 'am' ? 'ትጋት ህንጻ' : lang === 'om' ? 'Gamoo Tigaat' : 'Tigat Building'})
              </a>
            </p>
          </div>
          <div className="footer-links">
            <button onClick={() => scrollToSection('home')}>{lang === 'am' ? 'ዋና ገጽ' : lang === 'om' ? 'Fuula Duraa' : 'Home'}</button>
            <button onClick={() => scrollToSection('work')}>{t.nav.work}</button>
            <button onClick={() => scrollToSection('craft')}>{t.nav.craft}</button>
            <button onClick={() => scrollToSection('locations')}>{t.nav.locations}</button>
            <button onClick={() => scrollToSection('process')}>{t.nav.process}</button>
            <button onClick={() => scrollToSection('pricing')}>{t.nav.pricing}</button>
            <button onClick={() => scrollToSection('testimonials')}>{t.nav.testimonials}</button>
            <button onClick={() => scrollToSection('faq')}>{t.nav.faq}</button>
            <a href={`tel:${PHONE_LINK}`}>{t.nav.call}</a>
          </div>
          <a className="whatsapp-link" href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
            <Send size={17} />{t.footerTg}
          </a>
          <p className="copyright">© {new Date().getFullYear()} HOPE Photo &amp; Velo</p>
        </footer>

        {bookingPkg && (
          <BookingPanel
            selectedPackage={bookingPkg}
            onClose={() => setBookingPkg(null)}
            lang={lang}
            onOpenTma={() => setShowTmaModal(true)}
          />
        )}

        {showTmaModal && (
          <div className="tma-modal-backdrop" onClick={() => setShowTmaModal(false)}>
            <div className="tma-modal-window" onClick={e => e.stopPropagation()}>
              <TelegramMiniApp onClose={() => setShowTmaModal(false)} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
