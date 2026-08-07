import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Camera, Check,
  ChevronDown, ChevronRight, ChevronUp, ExternalLink, Film, Globe, Heart, Layers, MapPin, Menu,
  MessageCircle, Phone, Play, Quote, Send, Sliders, Sparkles, Video, X,
} from 'lucide-react';
import './styles.css';

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
    pricingEyebrow: 'የሽፋን አማራጭዎን ይምረጡ',
    pricingH2a: 'እያንዳንዱ የፍቅር ታሪክ',
    pricingH2b: 'የሚገባው ውበት አለው።',
    pricingNote: 'ከዚህ በታች የቀረቡት ዋጋዎች በ HOPE የዋጋ ዝርዝር መሠረት የተዘጋጁ ናቸው። የሚፈልጉትን የአገልግሎት አይነት ይምረጡ፤ ዝርዝሩን ለበዓልዎ በሚሆን መልኩ እናስተካክላለን።',
    pkgPopular: 'በጣም የተወደደ',
    pkgCta: 'ይህንን አገልግሎት ይምረጡ',
    priceDisclaimer: 'ሁሉም የአገልግሎት ዝርዝሮች እና ዋጋዎች ከ HOPE ቡድን ጋር በሚደረግ የመጨረሻ ማረጋገጫ የሚጸኑ ይሆናሉ።',
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
      { q: 'ከቀረቡት ፓኬጆች ውጭ እንደፍላጎታችን ማስተካከል እንችላለን?', a: 'አዎ! የቀረቡት ፓኬጆች እንደ መነሻ የሚያገለግሉ ሲሆን፤ እንደ ፍላጎትዎ እና እንደ በዓልዎ አይነት ካሜራዎችን፣ አልበሞችን እና ሌሎች አገልግሎቶችን ማስተካከል እንችላለን።' },
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
    bookingSelectedLabel: 'የመረጡት አገልግሎት',
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
    nav: { about: 'About Us', work: 'Our Work', craft: 'Our Craft', locations: 'Locations', process: 'Process', pricing: 'Services', testimonials: 'Reviews', faq: 'FAQ', call: 'Call Us' },
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
    pricingEyebrow: 'Choose Your Coverage',
    pricingH2a: 'Every love story',
    pricingH2b: 'deserves its own beauty.',
    pricingNote: 'The prices below are based on HOPE\'s standard pricing list. Choose the service type you want — we can adjust the details to suit your celebration.',
    pkgPopular: 'Most Popular',
    pkgCta: 'Choose This Service',
    priceDisclaimer: 'All service details and prices are subject to final confirmation with the HOPE team.',
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
      { q: 'Can we customize a package?', a: 'Yes! The listed packages are starting points — we can adjust cameras, albums, and other services to suit your needs and celebration type.' },
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
    bookingSelectedLabel: 'Selected Service',
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
    nav: { about: 'Waa\'ee Keenya', work: 'Hojiiwwan Keenya', craft: 'Teknoolojii Keenya', locations: 'Bakka Keenya', process: 'Adeemsa Keenya', pricing: 'Tajaajiloota', testimonials: 'Yaada Maamiltootaa', faq: 'GAF (FAQ)', call: 'Nuu Bilbilaa' },
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
    pricingEyebrow: 'Filannoo Uwwisa Keessanii Filadhaa',
    pricingH2a: 'Seenaan jaalalaa hundinuu',
    pricingH2b: 'bareedina isaa kan maluudha.',
    pricingNote: 'Gatiin gadii tarree gatii HOPE irratti kan hundaa\'edha. Tajaajila barbaaddan filadhaa — bal\'ina isaa ayyaana keessaniif akka mijaatutti ni sirreessina.',
    pkgPopular: 'Baay\'ee Kan Jaallatame',
    pkgCta: 'Tajaajila Kana Filadhaa',
    priceDisclaimer: 'Bal\'inni tajaajilaa fi gatiin hundinuu mirkaneessa dhumaa garee HOPE waliin ta\'uun kan cimu ta\'a.',
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
      { q: 'Paakeejiiwwan keessaa akka fedhii keenyaatti sirreessuu ni dandeenya?', a: 'Eeyyee! Paakeejiiwwan dhihaatan akka ka\'umsaatti kan tajaajilan yoo ta\'u; akka fedhii fi gosa ayyaana keessaniitti kaameraawwan, albaamota fi tajaajiloota biroo sirreessuu ni dandeenya.' },
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
    bookingSelectedLabel: 'Tajaajila Filatame',
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

const packages = [
  { name: 'የስታዲዮ ፎቶ አገልግሎት', nameEn: 'Studio Photography Service', nameOm: 'Tajaajila Suuraa Istuudiyoo', price: '18,500', type: 'የስታዲዮ ፎቶግራፍ', typeEn: 'Studio Photography', typeOm: 'Suuraa Istuudiyoo', note: 'ለሚያምር የስታዲዮ ታሪክ', noteEn: 'For a beautiful studio story', noteOm: 'Seenaa istuudiyoo bareedaaf', details: ['የስታዲዮ ቀረጻ session', 'ሜካፕ የተካተተ (Makeup)', '30×45 ላሚኔት አልበም', 'የምስጋና ካርዶች', '150 ሶፍት ኮፒ ፎቶዎች'], detailsEn: ['Studio shoot session', 'Makeup included', '30×45 laminate album', 'Thank-you cards', '150 soft-copy photos'], detailsOm: ['Tursiisa waraabsa istuudiyoo', 'Makeup kan dhihaate', 'Albaama laamineetii 30×45', 'Kaardii galateeffannaa', 'Suuraa soofti koppii 150'], source: 'photo_2026-07-03_14-14-17_7668160832798825472.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (2 ካሜራ)', nameEn: 'Wedding Photo & Video (2 Cameras)', nameOm: 'Suuraa & Viidiyoo Cidhaa (Kaameraa 2)', price: '45,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', typeOm: 'Suuraa & Viidiyoo Cidhaa', note: 'ለተዋበ የሰርግ በዓል', noteEn: 'For an elegant wedding celebration', noteOm: 'Ayyaana cidha miidhagaaf', details: ['2 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት', 'ሙሉ ኤዲት የተደረገ ቪዲዮ', 'ከለር ግሬዲንግ', 'ሁሉም ሶፍት ኮፒ ፎቶዎች'], detailsEn: ['2 cameras + Ronin gimbal', 'Aerial lighting', 'Fully edited video', 'Colour grading', 'All soft-copy photos'], detailsOm: ['Kaameraa 2 + Ronin gimbal', 'Ibsaa gubbaa (Aerial lighting)', 'Viidiyoo guutummaatti gulaalame', 'Gulaala halluu (Colour grading)', 'Suuraa soofti koppii hundumaa'], source: 'photo_2026-07-03_14-14-17_7668160799898782720.jpg' },
  { name: 'የሰርግ ፎቶ፣ ቪዲዮ እና ሙዚቃ ቪዲዮ', nameEn: 'Wedding Photo, Video & Music Video', nameOm: 'Suuraa, Viidiyoo Cidhaa & Viidiyoo Muuziqaa', price: '50,000', type: 'የሰርግ ፎቶ + ሙዚቃ ቪዲዮ', typeEn: 'Wedding + Music Video', typeOm: 'Suuraa Cidhaa + Viidiyoo Muuziqaa', note: 'ለልዩ እና ትልልቅ አፍታዎችዎ', noteEn: 'For your special milestone moments', noteOm: 'Yeroowwan keessan isa addaatiif', details: ['ሙዚቃ ቪዲዮ', '30×90 ላሚኔት አልበም', 'ቦርድ ፎቶ + ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሴቭ ዘ ዴት ፎቶዎች'], detailsEn: ['Music video', '30×90 laminate album', 'Board photo + sign board', 'Thank-you cards', 'Save-the-date photos'], detailsOm: ['Viidiyoo muuziqaa', 'Albaama laamineetii 30×90', 'Suuraa boordii + Sign board', 'Kaardii galateeffannaa', 'Suuraa Save-the-date'], source: 'photo_2026-07-03_14-14-19_7668160870092520448.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (3 ካሜራ)', nameEn: 'Wedding Photo & Video (3 Cameras)', nameOm: 'Suuraa & Viidiyoo Cidhaa (Kaameraa 3)', price: '60,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', typeOm: 'Suuraa & Viidiyoo Cidhaa', note: 'ተጨማሪ እይታዎች፣ ዘላቂ ትዝታዎች', noteEn: 'More angles, lasting memories', noteOm: 'Mula\'ata dabalataa, yaadannoo bara baraa', details: ['3 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት ቪዲዮ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ'], detailsEn: ['3 cameras + Ronin gimbal', 'Aerial lighting', 'Trailer + fully edited video', 'Colour grading', '40×60 board photo'], detailsOm: ['Kaameraa 3 + Ronin gimbal', 'Ibsaa gubbaa (Aerial lighting)', 'Trailer + Viidiyoo guutummaatti gulaalame', 'Gulaala halluu (Colour grading)', 'Suuraa boordii 40×60'], source: 'photo_2026-07-03_14-14-18_7668160879386824704.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ)', nameEn: 'Wedding Photo & Video (4 Cameras)', nameOm: 'Suuraa & Viidiyoo Cidhaa (Kaameraa 4)', price: '70,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', typeOm: 'Suuraa & Viidiyoo Cidhaa', note: 'ሙሉ እና አጠቃላይ ሽፋን', noteEn: 'Full & comprehensive coverage', noteOm: 'Uwwisa guutuu fi waliigalaa', details: ['4 ካሜራ ሽፋን', 'ሮኒን ጊምባል + አየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት ቪዲዮ', '30×90 ላሚኔት አልበም', 'ፕሪሚየም ማስታወሻዎች'], detailsEn: ['4 camera coverage', 'Ronin gimbal + aerial lighting', 'Trailer + fully edited video', '30×90 laminate album', 'Premium keepsakes'], detailsOm: ['Uwwisa kaameraa 4', 'Ronin gimbal + ibsaa gubbaa', 'Trailer + Viidiyoo guutummaatti gulaalame', 'Albaama laamineetii 30×90', 'Yaadannoo pirofeeshiinaalaa'], source: 'photo_2026-07-03_14-14-18_7668160851399477248.jpg' },
  { name: 'ሙሉ የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ ፕላስ)', nameEn: 'Full Wedding Photo & Video (4 Camera Plus)', nameOm: 'Suuraa & Viidiyoo Cidhaa Guutuu (Kaameraa 4 Plus)', price: '75,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', typeOm: 'Suuraa & Viidiyoo Cidhaa', note: 'ሙሉው የሰርግዎ ድንቅ ታሪክ', noteEn: 'The complete cinematic story of your wedding', noteOm: 'Seenaa cidha keessanii isa guutuu sinimaatiikii', details: ['4 ካሜራ ሽፋን', 'ሙሉ የቪዲዮ ኤዲቲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ ፎቶ', 'ፕሪሚየም ሳጥን'], detailsEn: ['4 camera coverage', 'Full video editing', '30×90 laminate album', '50×80 board photo', 'Premium delivery box'], detailsOm: ['Uwwisa kaameraa 4', 'Gulaala viidiyoo guutuu', 'Albaama laamineetii 30×90', 'Suuraa boordii 50×80', 'Saanduqa delivery piromiyami'], source: 'photo_2026-07-03_14-14-18_7668160860798849024.jpg' },
];

/* ── PRICING EXPLORER DATA ─────────────────────────────────────────────── */
const PRICING_CATS = [
  { id: 'wedding',  Icon: Heart,    labelAm: 'ሰርግ',       labelEn: 'Wedding',       labelOm: 'Cidha'            },
  { id: 'outdoor',  Icon: MapPin,   labelAm: 'ውጭ ቀረጻ',    labelEn: 'Outdoor Shoot', labelOm: 'Waraabsa Alaa'    },
  { id: 'indoor',   Icon: Sliders,  labelAm: 'ቤት ውስጥ',    labelEn: 'Indoor Shoot',  labelOm: 'Waraabsa Keessaa' },
  { id: 'studio',   Icon: Film,     labelAm: 'ስቱዲዮ ቀረጻ',  labelEn: 'Studio Shoot',  labelOm: 'Istuudiyoo'       },
  { id: 'velo',     Icon: Video,    labelAm: 'ቬሎ (ቪዲዮ)', labelEn: 'Velo (Video)',  labelOm: 'Viidiyoo'         },
  { id: 'makeup',   Icon: Sparkles, labelAm: 'ሜካፕ',       labelEn: 'Makeup',        labelOm: 'Makeup'           },
  { id: 'decor',    Icon: Layers,   labelAm: 'ዲኮሬሽን',     labelEn: 'Decor & Setup', labelOm: 'Miidhagina'       },
];

// null = not included in this category
const PKG_INCLUDES = {
  wedding: ['photo','video','car','suit','studio','makeup','board','album','decor'],
  outdoor: ['photo','video','car',  null,    null, 'makeup',   null, 'album',  null],
  indoor:  ['photo','video',  null, 'suit', 'studio','makeup',  null, 'album',  null],
  studio:  ['photo',   null,  null, 'suit', 'studio','makeup',  null, 'album',  null],
  velo:    ['photo','video','car',   null,    null,    null, 'board', 'album',  null],
  makeup:  ['photo',   null,  null, 'suit',   null, 'makeup',   null, 'album',  null],
  decor:   ['photo','video','car',   null,    null, 'makeup', 'board','album', 'decor'],
};

const PKG_CAT_META = {
  wedding: { pkgIdx: 2, imgIdx: 1 },
  outdoor: { pkgIdx: 1, imgIdx: 0 },
  indoor:  { pkgIdx: 0, imgIdx: 3 },
  studio:  { pkgIdx: 0, imgIdx: 3 },
  velo:    { pkgIdx: 1, imgIdx: 5 },
  makeup:  { pkgIdx: 0, imgIdx: 3 },
  decor:   { pkgIdx: 2, imgIdx: 4 },
};

const SVC_MODULES = [
  { id: 'photo',  price: 15000, bg: 'linear-gradient(145deg,#d4956c,#8b5e3c)', Icon: Camera,  labelAm: 'ፎቶ',        labelEn: 'Photography',   labelOm: 'Suuraa',      imgIdx: 0 },
  { id: 'video',  price: 15000, bg: 'linear-gradient(145deg,#6b8cba,#3a5882)', Icon: Video,   labelAm: 'ቬሎ (ቪዲዮ)', labelEn: 'Velo (Video)',  labelOm: 'Viidiyoo',    imgIdx: 5 },
  { id: 'car',    price:  5000, bg: 'linear-gradient(145deg,#8a9e7a,#556644)', Icon: Play,    labelAm: 'ሰርግ ካር',    labelEn: 'Wedding Car',   labelOm: 'Konkolaataa', imgIdx: 1 },
  { id: 'suit',   price:  8000, bg: 'linear-gradient(145deg,#b07090,#7a4560)', Icon: Layers,  labelAm: 'ልብስ',       labelEn: 'Suit & Dress',  labelOm: 'Uffata',      imgIdx: 3 },
  { id: 'studio', price:  8000, bg: 'linear-gradient(145deg,#8a7ab0,#5a4a80)', Icon: Film,    labelAm: 'ስቱዲዮ',     labelEn: 'Studio Session',labelOm: 'Istuudiyoo',  imgIdx: 6 },
  { id: 'makeup', price:  5000, bg: 'linear-gradient(145deg,#c07880,#8a4a52)', Icon: Sparkles,labelAm: 'ሜካፕ',      labelEn: 'Makeup',        labelOm: 'Makeup',      imgIdx: 3 },
  { id: 'board',  price:  3000, bg: 'linear-gradient(145deg,#6a9090,#3a6060)', Icon: Quote,   labelAm: 'ሳይን ቦርድ',  labelEn: 'Signing Board', labelOm: 'Boordii',     imgIdx: 7 },
  { id: 'album',  price:  7000, bg: 'linear-gradient(145deg,#9a7060,#6a4030)', Icon: Sliders, labelAm: 'ፎቶ አልበም',  labelEn: 'Photo Album',   labelOm: 'Albaama',     imgIdx: 8 },
  { id: 'decor',  price: 12000, bg: 'linear-gradient(145deg,#b87894,#885060)', Icon: Heart,   labelAm: 'ዲኮሬሽን',    labelEn: 'Decor & Setup', labelOm: 'Miidhagina',  imgIdx: 2 },
];

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
  const pkgName = lang === 'en' ? (selectedPackage?.nameEn ?? 'HOPE Service') : lang === 'om' ? (selectedPackage?.nameOm ?? 'Tajaajila HOPE') : (selectedPackage?.name ?? 'የ HOPE አገልግሎት');
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const servicesDetails = selectedPackage?.servicesList?.length
      ? `\n\n📋 Included Services (${selectedPackage.servicesList.length}):\n` + selectedPackage.servicesList.join('\n')
      : selectedPackage?.includes?.length
      ? `\n\n📋 Included Features:\n` + selectedPackage.includes.map(inc => `• ${inc}`).join('\n')
      : '';

    const formattedMessage = `📸 NEW BOOKING REQUEST — HOPE PHOTO & VELO\n\n` +
      `📦 Package: ${pkgName}\n` +
      `💰 Total Price: ${selectedPackage?.price ? selectedPackage.price + ' ETB' : 'Custom'}` +
      servicesDetails + `\n\n` +
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
                <b>{selectedPackage.price} ETB</b>
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
            </form>
          </>
        )}
      </section>
    </div>
  );
}

/* ── PRICING EXPLORER ───────────────────────────────────────────────────── */
function PricingExplorer({ lang, openBooking }) {
  const [activeCat, setActiveCat]   = useState('wedding');
  const [customSvcs, setCustomSvcs] = useState(
    () => new Set(PKG_INCLUDES['wedding'].filter(Boolean))
  );
  const t    = T[lang];
  const meta = PKG_CAT_META[activeCat];
  const pkg  = packages[meta.pkgIdx];

  useEffect(() => {
    setCustomSvcs(new Set(PKG_INCLUDES[activeCat].filter(Boolean)));
  }, [activeCat]);

  const pkgName = lang === 'en' ? pkg.nameEn : lang === 'om' ? pkg.nameOm : pkg.name;
  const pkgNote = lang === 'en' ? pkg.noteEn : lang === 'om' ? pkg.noteOm : pkg.note;

  const selSvcs    = SVC_MODULES.filter(svc => customSvcs.has(svc.id));
  const totalPrice = selSvcs.reduce((sum, s) => sum + s.price, 0);

  const toggleSvc = (id) => setCustomSvcs(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const bookPkg = {
    name:   `${lang === 'am' ? 'ካስተም ፓኬጅ' : lang === 'om' ? 'Paakeejii Addaa' : 'Custom Package'} (${selSvcs.length})`,
    nameEn: `Custom Package (${selSvcs.length} Services)`,
    nameOm: `Paakeejii Addaa (${selSvcs.length})`,
    price:  totalPrice.toLocaleString(),
    servicesList: selSvcs.map(s => `${lang === 'en' ? s.labelEn : lang === 'om' ? s.labelOm : s.labelAm} (${s.labelAm}) — ${(s.price).toLocaleString()} ETB`),
  };

  return (
    <section id="pricing" className="pricing-xp section-anchor">
      <div className="pricing-xp-head">
        <div>
          <p className="eyebrow">{T[lang].pricingEyebrow}</p>
          <h2>{T[lang].pricingH2a}<br /><em>{T[lang].pricingH2b}</em></h2>
        </div>
        <p className="pricing-xp-note">{T[lang].pricingNote}</p>
      </div>

      <div className="pricing-xp-layout">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="pkg-sidebar">
          <p className="pkg-sidebar-lbl">
            {lang === 'am' ? 'ፓኬጅ ምረጡ' : lang === 'om' ? 'Paakeejii Filadhaa' : 'CHOOSE PACKAGE'}
          </p>
          <nav className="pkg-cat-nav">
            {PRICING_CATS.map(c => {
              const lbl = lang === 'en' ? c.labelEn : lang === 'om' ? c.labelOm : c.labelAm;
              return (
                <button key={c.id} className={`pkg-cat-btn${activeCat === c.id ? ' pkg-cat-on' : ''}`}
                  onClick={() => setActiveCat(c.id)}>
                  <c.Icon size={17} /><span>{lbl}</span>
                </button>
              );
            })}
          </nav>
          <div className="pkg-contact-card">
            <p className="pkg-contact-hdg">
              {lang === 'am' ? 'ጥያቄ አለዎ?' : lang === 'om' ? 'Gaaffii Qabdaa?' : 'Have a Question?'}
            </p>
            <p className="pkg-contact-txt">
              {lang === 'am' ? 'ፍጹም ቀን እንዲያቅዱ እዚህ ነን።' : lang === 'om' ? 'Guyyaa bareedaa qopheessuuf asiif jirra.' : "We're here to help you plan a perfect day."}
            </p>
            <button className="pkg-contact-btn" onClick={() => openBooking()}>
              {lang === 'am' ? 'አግኙን' : lang === 'om' ? 'Nu Quunnamaa' : 'Contact Us'} <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        {/* ── CENTER SHOWCASE ── */}
        <div className="pkg-showcase">
          <div className="pkg-showcase-card"
            style={{ backgroundImage: `url(${galleryImages[meta.imgIdx].src})` }}>
            <div className="pkg-showcase-grad" />
            <div className="pkg-showcase-body">
              <p className="pkg-showcase-ew">
                {lang === 'am' ? 'ፓኬጅ' : lang === 'om' ? 'PAAKEEJII' : 'PACKAGE'}
              </p>
              <h3 className="pkg-showcase-name">{pkgName}</h3>
              <p className="pkg-showcase-note">{pkgNote}</p>

              {/* — Live price counter — */}
              <div className="pkg-price-display">
                <span className="pkg-price-lbl">
                  {lang === 'am' ? 'ገጥላላ ዋጋ' : lang === 'om' ? 'GATII WALIIGALAA' : 'YOUR TOTAL'}
                </span>
                <div className="pkg-price-row">
                  <strong className="pkg-price-num">{totalPrice.toLocaleString()}</strong>
                  <span className="pkg-price-etb">ETB</span>
                </div>
                <span className="pkg-price-svcs">
                  {selSvcs.length} {lang === 'am' ? 'አገልግሎታ' : lang === 'om' ? 'Tajaajila' : 'services selected'}
                </span>
              </div>

              <div className="pkg-svc-strip">
                {selSvcs.slice(0, 4).map(svc => (
                  <div key={svc.id} className="pkg-svc-strip-item">
                    <svc.Icon size={18} />
                    <span>{lang === 'en' ? svc.labelEn : lang === 'om' ? svc.labelOm : svc.labelAm}</span>
                  </div>
                ))}
              </div>
              <button className="pkg-explore-btn" onClick={() => openBooking(bookPkg)}>
                {lang === 'am' ? 'ፓኬጁን ያስይዑ' : lang === 'om' ? 'Paakeejii Barbaachaa' : 'Book Custom Package'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT GRID — Build Your Package ── */}
        <div className="pkg-includes">
          <div className="pkg-includes-bar">
            <span className="pkg-incl-title">
              {lang === 'am' ? 'ፓኬጅ አዘጋጅ' : lang === 'om' ? 'PAAKEEJII QOPHEESSAA' : 'BUILD YOUR PACKAGE'}
            </span>
            <button className="pkg-view-dtl" onClick={() => openBooking(bookPkg)}>
              {lang === 'am' ? 'ዝርዝር ይመልከቱ' : lang === 'om' ? "Bal'ina Ilaalaa" : 'View Details'} <ArrowRight size={13} />
            </button>
          </div>
          <div className="pkg-modules-grid">
            {SVC_MODULES.map((svc) => {
              const isOn = customSvcs.has(svc.id);
              const lbl  = lang === 'en' ? svc.labelEn : lang === 'om' ? svc.labelOm : svc.labelAm;
              return (
                <button
                  key={svc.id}
                  type="button"
                  className={`pkg-module${isOn ? ' pkg-module-on' : ' pkg-module-off'}`}
                  style={isOn ? { background: svc.bg } : {}}
                  onClick={() => toggleSvc(svc.id)}
                  aria-pressed={isOn}
                  title={`${lbl} — ${svc.price.toLocaleString()} ETB`}
                >
                  <div className="pkg-module-photo"
                    style={{ backgroundImage: `url(${galleryImages[svc.imgIdx].src})` }} />
                  <div className="pkg-module-cover" />
                  <span className="pkg-module-ic"><svc.Icon size={26} /></span>
                  <span className="pkg-module-nm">{lbl}</span>
                  <span className="pkg-module-price">+{(svc.price/1000).toFixed(0)}K ETB</span>
                  <span className="pkg-module-ck">
                    {isOn ? <Check size={11} /> : <span className="pkg-module-plus">+</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="pkg-disclaimer"><Check size={13} /> {T[lang].priceDisclaimer}</p>
        </div>

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
  const [loaded, setLoaded]   = useState(false);
  const [lang, setLang]       = useState('am');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeLocTab, setActiveLocTab] = useState(0);

  const t = T[lang];

  useEffect(() => { document.body.style.overflow = (!loaded || bookingPkg) ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [loaded, bookingPkg]);

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
          <div className="hero-bg-image" style={{ backgroundImage: `url(${ASSET}/bg.png)` }} />
          <div className="hero-bg-overlay" />

          {/* Top Row: Left Text + Right Couple Photo */}
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
                        <img src={galleryImages[0].src} alt="Hope Photo" />
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
                        <img src={galleryImages[0].src} alt="Hope Photo" />
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
                        <img src={galleryImages[0].src} alt="Hope Photo" />
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

          {/* Connected 3 Proof Tiles at bottom of hero section */}
          <div className="hero-proof-strip">
            {[galleryImages[0], galleryImages[1], galleryImages[3]].map((img, i) => (
              <div key={i} className="hero-proof-tile">
                <img
                  src={img.src}
                  alt={lang === 'en' ? img.altEn : lang === 'om' ? img.altOm : img.altAm}
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── STORY / ABOUT ── */}
        <section id="story" className="intro section-anchor">
          <div className="intro-side"><p className="eyebrow">{t.storyEyebrow}</p><span className="tall-line" /></div>
          <Reveal className="intro-copy">
            <p className="script">{t.storyScript}</p>
            <h2>{t.storyH2a}<br /><em>{t.storyH2b}</em></h2>
            <p>{t.storyBody}</p>
            <button className="underlined-button" onClick={() => scrollToSection('work')}>{t.storyCta} <ArrowRight size={16} /></button>
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

        {/* ── PRICING ── */}
        <PricingExplorer lang={lang} openBooking={openBooking} />

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

        {bookingPkg && <BookingPanel selectedPackage={bookingPkg} onClose={() => setBookingPkg(null)} lang={lang} />}
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
