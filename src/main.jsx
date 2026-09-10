import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Camera, Check,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Copy, CreditCard, Edit2, ExternalLink,
  Eye, Film, Globe, Heart, Layers, Lock, LogOut, MapPin, Menu, MessageCircle, Package, Pencil,
  Phone, Play, Plus, Printer, Quote, RefreshCw, Search, Send, Shield, Sliders, Sparkles, Star, Trash2, Upload, Video, X, FileText, Download
} from 'lucide-react';
import './styles.css';
import { DEFAULT_AGREEMENTS_9, resolveAgreementForPackage } from './agreementsData.js';
import DocumentStyleAgreement from './DocumentStyleAgreement.jsx';

/* ── CONSTANTS ──────────────────────────────────────────────────────────── */
const PHONE_DISPLAY     = '09 10 52 69 62';
const PHONE_LINK        = '+251910526962';
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
    footerTg: 'ደውሉልን',
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
    footerTg: 'Call Us Directly',
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
    footerTg: 'Nuu Bilbilaa',
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

/* ── INTERACTIVE CALENDAR DATE PICKER ──────────────────────────────────── */
function CalendarPicker({ value, onChange, blackoutDates = [], bookedDates = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewing, setViewing] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () => setViewing(v => {
    const d = new Date(v.year, v.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const nextMonth = () => setViewing(v => {
    const d = new Date(v.year, v.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const numDays = daysInMonth(viewing.year, viewing.month);
  const startDay = firstDayOfMonth(viewing.year, viewing.month);

  const formatDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);

  return (
    <div className="cal-picker">
      <div className="cal-nav">
        <button type="button" className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={16}/></button>
        <span className="cal-month-label">{months[viewing.month]} {viewing.year}</span>
        <button type="button" className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={16}/></button>
      </div>
      <div className="cal-grid-head">
        {days.map(d => <span key={d} className="cal-day-label">{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <span key={`e${idx}`} className="cal-cell cal-empty" />;
          const dateStr = formatDate(viewing.year, viewing.month, day);
          const cellDate = new Date(viewing.year, viewing.month, day);
          const isPast = cellDate < today;
          const isBlackout = blackoutDates.includes(dateStr);
          const isBooked = bookedDates.includes(dateStr);
          const isSelected = value === dateStr;
          const isToday = cellDate.getTime() === today.getTime();
          const isDisabled = isPast || isBlackout || isBooked;
          const cls = [
            'cal-cell',
            isSelected ? 'cal-selected' : '',
            isToday && !isSelected ? 'cal-today' : '',
            isDisabled ? 'cal-disabled' : 'cal-available',
            isBlackout ? 'cal-blackout' : '',
            isBooked ? 'cal-booked' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={dateStr}
              type="button"
              className={cls}
              disabled={isDisabled}
              title={isBlackout ? 'Studio Unavailable' : isBooked ? 'Already Booked' : ''}
              onClick={() => !isDisabled && onChange(dateStr)}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="cal-legend">
        <span className="cal-leg-item"><span className="cal-leg-dot cal-leg-available"/>Available</span>
        <span className="cal-leg-item"><span className="cal-leg-dot cal-leg-blackout"/>Unavailable</span>
        <span className="cal-leg-item"><span className="cal-leg-dot cal-leg-booked"/>Booked</span>
      </div>
    </div>
  );
}

/* ── SIGNATURE CANVAS PAD ───────────────────────────────────────────────── */
function SignaturePad({ onSign, onClear }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#e8d48b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasDrawn.current = true;
  };

  const stop = (e) => {
    e.preventDefault();
    drawing.current = false;
    if (hasDrawn.current) {
      onSign(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onClear();
  };

  return (
    <div className="sig-pad-wrap">
      <canvas
        ref={canvasRef}
        width={480}
        height={140}
        className="sig-canvas"
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
      />
      <div className="sig-pad-footer">
        <span className="sig-line-label">Sign above</span>
        <button type="button" className="sig-clear-btn" onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

/* ── BOOKING FLOW MODAL ─────────────────────────────────────────────────── */
function BookingFlowModal({ selectedPackage, onClose, lang }) {
  const [step, setStep]               = useState(1); // 1=details 2=fork 3a=contract 3b=checkout 4=confirm 5=discussion
  const [blackoutDates, setBlackout]  = useState([]);
  const [bookedDates, setBooked]      = useState([]);
  const [payAccounts, setPayAccounts] = useState(null);
  const [contractTpl, setContractTpl] = useState(null);
  const [form, setForm]               = useState({ name: '', date: '', phone: '', location: 'Addis Ababa', note: '' });
  const [signature, setSignature]     = useState(null);
  const [termsAccepted, setTerms]     = useState(false);
  const [payMethod, setPayMethod]     = useState(null); // 'telebirr' | 'cbe'
  const [receiptFile, setReceipt]     = useState(null);
  const [receiptPreview, setReceiptPrev] = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError]             = useState('');
  const [addons, setAddons]           = useState([]);
  const [pkgAddons, setPkgAddons]     = useState([]);

  const t = T[lang];
  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  const pkgName = lang === 'en'
    ? (selectedPackage?.titleEn ?? selectedPackage?.name ?? 'HOPE Package')
    : lang === 'om'
    ? (selectedPackage?.titleOm ?? selectedPackage?.name ?? 'Paakeejii HOPE')
    : (selectedPackage?.titleAm ?? selectedPackage?.name ?? 'የ HOPE ፓኬጅ');

  const deliverables = lang === 'en'
    ? (selectedPackage?.deliverablesEn ?? [])
    : lang === 'om'
    ? (selectedPackage?.deliverablesOm ?? [])
    : (selectedPackage?.deliverablesAm ?? []);

  const basePrice = parseInt((selectedPackage?.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 0;
  const addonsTotal = addons.reduce((s, a) => s + (a.price || 0), 0);
  const totalPrice = basePrice + addonsTotal;
  const deposit = Math.round(totalPrice * 0.5);
  const remaining = totalPrice - deposit;

  // ── Agreement template state — each plan has its own agreement automatically ──
  const [defaultAgreements9, setDefaultAgreements9] = useState(DEFAULT_AGREEMENTS_9);
  const [selectedAgrTemplate, setSelectedAgrTemplate] = useState(() => resolveAgreementForPackage(selectedPackage, DEFAULT_AGREEMENTS_9));

  useEffect(() => {
    const matched = resolveAgreementForPackage(selectedPackage, defaultAgreements9);
    setSelectedAgrTemplate(matched);
    fetch(`${apiBase}/api/agreements?defaults=1`)
      .then(r => r.json())
      .then(d => {
        if (d.agreements && d.agreements.length > 0) {
          setDefaultAgreements9(d.agreements);
          setSelectedAgrTemplate(resolveAgreementForPackage(selectedPackage, d.agreements));
        }
      })
      .catch(() => {});
  }, [selectedPackage]);

  // Load settings on mount
  useEffect(() => {
    fetch(`${apiBase}/api/settings`)
      .then(r => r.json())
      .then(data => {
        setBlackout(data.settings?.blackoutDates || []);
        setContractTpl(data.settings?.contractTemplate || null);
        setPayAccounts(data.settings?.paymentAccounts || null);
        const avail = (data.settings?.addons || []).filter(a => a.active);
        setPkgAddons(avail);
        // Get booked dates from orders
        return fetch(`${apiBase}/api/orders`);
      })
      .then(r => r.json())
      .then(data => {
        const dates = (data.orders || []).filter(o => o.eventDate && ['CONFIRMED','PENDING_VERIFICATION'].includes(o.status)).map(o => o.eventDate);
        setBooked(dates);
      })
      .catch(() => {});
  }, []);

  const update = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File too large (max 5MB)'); return; }
    setReceipt(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPrev(ev.target.result);
    reader.readAsDataURL(file);
    setError('');
  };

  const fillContractTemplate = (tpl) => {
    if (!tpl) return 'Loading contract...';
    const delvText = deliverables.slice(0, 5).join(', ') || pkgName;
    const tokens = {
      clientName: form.name || '___________',
      phone: form.phone || '___________',
      eventDate: form.date || '___________',
      location: form.location || 'Addis Ababa',
      packageName: pkgName,
      deliverables: delvText,
      agreedPrice: totalPrice.toLocaleString() + ' ETB',
      depositAmount: deposit.toLocaleString() + ' ETB',
      remainingBalance: remaining.toLocaleString() + ' ETB',
      balance: remaining.toLocaleString() + ' ETB',
    };
    return tpl.clauses.map(c => {
      const heading = lang === 'am' ? c.headingAm : c.headingEn;
      let body = lang === 'am' ? c.bodyAm : c.bodyEn;
      Object.entries(tokens).forEach(([k, v]) => { body = body?.replaceAll?.(`{${k}}`, v) ?? body; });
      return { heading, body };
    });
  };

  const contractTitle = contractTpl
    ? (lang === 'am' ? contractTpl.titleAm : contractTpl.titleEn)
    : 'Service Agreement';
  const contractClauses = fillContractTemplate(contractTpl);

  // Step 1 → validate and move to Step 2
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!form.date) { setError(lang === 'am' ? 'እባክዎ ቀን ይምረጡ' : 'Please select a date'); return; }
    setError('');
    setStep(2);
  };

  // Proceed directly to Contract step with plan's own agreement — do not ask user to pick again
  const handleProceedContract = () => {
    const matched = resolveAgreementForPackage(selectedPackage, defaultAgreements9);
    setSelectedAgrTemplate(matched);
    setStep(3);
  };

  // Proceed to Discussion (Option B) — user requested: "when i ask must directly go to bot and i have to ask on tg bot"
  const handleDiscussion = async () => {
    setSubmitting(true);
    let orderId = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name, phone: form.phone, eventDate: form.date,
          location: form.location, notes: form.note, packageName: pkgName,
          basePrice, totalPrice, category: selectedPackage?.category || 'custom',
          status: 'IN_DISCUSSION'
        })
      });
      const data = await r.json();
      if (data?.order?.id) orderId = data.order.id;
      setCreatedOrder(data?.order || { id: orderId });
    } catch(err) {
      setCreatedOrder({ id: orderId });
    }
    setSubmitting(false);

    // Directly open Telegram Bot for instant discussion
    const tgUrl = `https://t.me/HoopStudioSystemBot?start=discuss_${orderId}`;
    try {
      window.open(tgUrl, '_blank');
    } catch(e) {}
    setStep(5);
  };

  // Contract signed → checkout
  const handleContractNext = () => {
    if (!signature) { setError(lang === 'am' ? 'እባክዎ ፊርማ ያኑሩ' : 'Please sign the contract'); return; }
    if (!termsAccepted) { setError(lang === 'am' ? 'ውሎቹን ይቀበሉ' : 'Please accept the terms'); return; }
    setError('');
    setStep(4);
  };

  // Final submit with receipt
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payMethod) { setError(lang === 'am' ? 'እባክዎ የክፍያ ዘዴ ይምረጡ' : 'Please select a payment method'); return; }
    if (!receiptPreview) { setError(lang === 'am' ? 'የደረሰኝ ምስል ይጫኑ' : 'Please upload payment receipt'); return; }
    setSubmitting(true);
    setError('');
    let orderObj = null;
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name, phone: form.phone, eventDate: form.date,
          location: form.location, notes: form.note, packageName: pkgName,
          basePrice, addons, totalPrice, depositAmount: deposit, remainingBalance: remaining,
          paymentMethod: payMethod, paymentProof: receiptPreview,
          signatureDataUrl: signature, termsAccepted: true,
          category: selectedPackage?.category || 'custom',
          status: 'PENDING_VERIFICATION'
        })
      });
      if (r.ok) {
        const data = await r.json();
        orderObj = data?.order || null;
      }
    } catch(err) {
      console.warn('Backend order push failed, continuing with client receipt:', err);
    }
    if (!orderObj) {
      orderObj = {
        id: 'HOPE-' + Math.floor(1000 + Math.random() * 9000),
        clientName: form.name,
        phone: form.phone,
        eventDate: form.date,
        packageName: pkgName,
        depositAmount: deposit,
        remainingBalance: remaining,
        paymentMethod: payMethod,
        status: 'PENDING_VERIFICATION'
      };
    }
    setCreatedOrder(orderObj);
    setStep(6);
    setSubmitting(false);
  };

  const stepLabel = {
    1: lang === 'am' ? '1. ዝርዝርና ቀን' : '1. Details & Date',
    2: lang === 'am' ? '2. አማራጭ ምረጥ' : '2. Choose Path',
    'agr-gallery': lang === 'am' ? '📋 ውል ዓይነት ምረጥ' : '📋 Choose Agreement',
    3: lang === 'am' ? '3. ውል' : '3. Contract',
    4: lang === 'am' ? '4. ክፍያ' : '4. Payment',
    5: lang === 'am' ? 'ውይይት' : 'Discussion',
    6: lang === 'am' ? '✅ ተረጋግጧል' : '✅ Submitted',
  };

  // ── Agreement gallery renderer ──
  const renderAgreementGallery = () => (
    <div className="bf-step-body">
      <div className="agr-gallery-header">
        <h3 className="agr-gallery-title">
          {lang === 'am' ? '📋 የ HOPE ስምምነት ዓይነቶች' : '📋 HOPE Agreement Templates'}
        </h3>
        <p className="agr-gallery-sub">
          {lang === 'am'
            ? 'ለፓኬጅዎ ተስማሚ የሆነ ስምምነት ይምረጡ። አስተዳዳሪያዊ ማሻሻያ ማድረግ ይቻላል።'
            : 'Select the agreement template that matches your package. Admin can customize before signing.'}
        </p>
      </div>
      <div className="agr-gallery-grid">
        {defaultAgreements9.map((agr) => (
          <button
            key={agr.id}
            type="button"
            className={`agr-gallery-card ${selectedAgrTemplate?.id === agr.id ? 'agr-card-selected' : ''}`}
            onClick={() => { setSelectedAgrTemplate(agr); }}
          >
            <div className="agr-card-top">
              <span className="agr-card-cat">{agr.category?.toUpperCase()}</span>
              <span className="agr-card-price">{(agr.price || 0).toLocaleString()} ETB</span>
            </div>
            <h4 className="agr-card-name">{agr.name}</h4>
            <p className="agr-card-pkg">{agr.packageTitle}</p>
            <ul className="agr-card-list">
              {(agr.deliverables || []).slice(0, 5).map((d, i) => (
                <li key={i}><Check size={10}/> {d}</li>
              ))}
              {(agr.deliverables || []).length > 5 && <li className="agr-more">+{(agr.deliverables || []).length - 5} more...</li>}
            </ul>
            {selectedAgrTemplate?.id === agr.id && (
              <div className="agr-card-selected-badge"><Check size={14}/> Selected</div>
            )}
          </button>
        ))}
      </div>
      <div className="agr-gallery-actions">
        <button type="button" className="bf-back-btn" onClick={() => setStep(2)}>← Back</button>
        <button
          type="button"
          className="bf-primary-btn"
          onClick={() => setStep(3)}
          disabled={!selectedAgrTemplate}
        >
          {lang === 'am' ? 'ቀጥል ወደ ፊርማ →' : 'Continue to Sign →'}
        </button>
      </div>
      {!selectedAgrTemplate && (
        <p className="agr-select-hint">{lang === 'am' ? 'ከላይ ያለውን ስምምነት ይምረጡ' : 'Please select an agreement template above'}</p>
      )}
    </div>
  );

  const toggleAddon = (addon) => {
    setAddons(prev => prev.find(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);
  };

  // ── RENDER ──
  const renderStepIndicator = () => (
    <div className="bf-steps">
      {[1,2,3,4].map(s => (
        <div key={s} className={`bf-step ${step >= s ? 'bf-step-done' : ''} ${step === s ? 'bf-step-active' : ''}`}>
          <span className="bf-step-num">{step > s ? <Check size={11}/> : s}</span>
        </div>
      ))}
    </div>
  );

  // ── STEP 1: Package + Calendar + Client Info ──
  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="bf-step-body">
      <div className="bf-pkg-header">
        <div className="bf-pkg-badge">{selectedPackage?.badgeEn || 'Package'}</div>
        <h3 className="bf-pkg-name">{pkgName}</h3>
        <div className="bf-pkg-price">{totalPrice.toLocaleString()} <span>ETB</span></div>
      </div>

      {deliverables.length > 0 && (
        <div className="bf-deliverables">
          <p className="bf-deliv-label">{lang === 'am' ? 'የተካተቱ አገልግሎቶች:' : 'Included deliverables:'}</p>
          <ul className="bf-deliv-list">
            {deliverables.map((d, i) => <li key={i}><Check size={11}/> {d}</li>)}
          </ul>
        </div>
      )}

      {pkgAddons.length > 0 && (
        <div className="bf-addons">
          <p className="bf-deliv-label">{lang === 'am' ? 'ተጨማሪ አማራጮች:' : 'Optional Add-ons:'}</p>
          <div className="bf-addon-grid">
            {pkgAddons.map(a => {
              const sel = addons.find(x => x.id === a.id);
              return (
                <button key={a.id} type="button" className={`bf-addon-chip ${sel ? 'bf-addon-selected':''}`} onClick={() => toggleAddon(a)}>
                  {sel ? <Check size={11}/> : <Plus size={11}/>} {a.name} <span>+{a.price.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bf-divider" />

      <div className="bf-section-label">
        <CalendarDays size={14}/>
        <span>{lang === 'am' ? 'የቀን ምርጫ' : 'Select Your Date'}</span>
      </div>
      <CalendarPicker
        value={form.date}
        onChange={(d) => setForm(f => ({...f, date: d}))}
        blackoutDates={blackoutDates}
        bookedDates={bookedDates}
      />
      {form.date && (
        <p className="bf-date-chosen"><Check size={13}/> {form.date}</p>
      )}

      <div className="bf-divider" />

      <div className="bf-section-label"><Phone size={14}/><span>{lang === 'am' ? 'የግል መረጃ' : 'Your Details'}</span></div>
      <div className="bf-field-group">
        <label className="bf-label">{lang === 'am' ? 'ሙሉ ስምዎ' : 'Full Name'}
          <input required className="bf-input" name="name" value={form.name} onChange={update} placeholder={lang === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter full name'}/>
        </label>
        <label className="bf-label">{lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
          <input required className="bf-input" name="phone" type="tel" value={form.phone} onChange={update} placeholder="09…"/>
        </label>
        <label className="bf-label">{lang === 'am' ? 'የቀረጻ ቦታ' : 'Event Location'}
          <input className="bf-input" name="location" value={form.location} onChange={update} placeholder="Addis Ababa"/>
        </label>
        <label className="bf-label">{lang === 'am' ? 'ተጨማሪ ማስታወሻ' : 'Special Notes'}
          <textarea className="bf-input" name="note" value={form.note} onChange={update} rows="2" placeholder={lang === 'am' ? 'ሌሎች ዝርዝሮች...' : 'Any special requests...'}/>
        </label>
      </div>

      {error && <p className="bf-error">{error}</p>}
      <button type="submit" className="bf-primary-btn">
        {lang === 'am' ? 'ቀጣይ — አማራጭ ምረጥ' : 'Next — Choose Your Path'} <ChevronRight size={16}/>
      </button>
    </form>
  );

  // ── STEP 2: Fork — Contract or Discussion ──
  const renderStep2 = () => (
    <div className="bf-step-body bf-fork">
      <div className="bf-fork-header">
        <p className="eyebrow">{lang === 'am' ? 'የቀጠሮ መንገድ ምረጥ' : 'Choose Your Booking Path'}</p>
        <p className="bf-fork-sub">{lang === 'am' ? `ቀን: ${form.date} | ${pkgName}` : `Date: ${form.date} | ${pkgName}`}</p>
      </div>
      <div className="bf-fork-cards">
        <button type="button" className="bf-fork-card bf-fork-contract" onClick={handleProceedContract}>
          <div className="bf-fork-icon"><Shield size={28}/></div>
          <h4>{lang === 'am' ? 'ወደ ውል ቀጥሉ' : 'Proceed to Contract'}</h4>
          <p>{lang === 'am' ? 'ውሉን ይፈርሙ፣ ቅድመ ክፍያ ያስገቡ፣ ቀንዎን አሁኑኑ ያስያዙ።' : 'Sign the agreement, pay 30% deposit, and lock your date now.'}</p>
          <ul>
            <li><Check size={12}/> {lang === 'am' ? 'ቀን ወዲያውኑ ይጠበቃል' : 'Date reserved immediately'}</li>
            <li><Check size={12}/> {lang === 'am' ? '30% ቅድሚ ክፍያ' : '30% advance deposit'}</li>
            <li><Check size={12}/> {lang === 'am' ? 'ዲጂታል ፊርማ' : 'Digital signature'}</li>
          </ul>
          <span className="bf-fork-cta">{lang === 'am' ? 'ወደ ውል →' : 'Go to Contract →'}</span>
        </button>

        <button type="button" className="bf-fork-card bf-fork-discuss" onClick={handleDiscussion} disabled={submitting}>
          <div className="bf-fork-icon"><MessageCircle size={28}/></div>
          <h4>{lang === 'am' ? 'በቴሌግራም ቦት ይጠይቁ' : 'Ask on Telegram Bot'}</h4>
          <p>{lang === 'am' ? 'ቀጥታ ወደ ይፋዊ ቴሌግራም ቦት በመሄድ ከስቱዲዮ ዳይሬክተሩ ጋር ይወያዩ ወይም ይጠይቁ።' : 'Go directly to our official Telegram bot to ask questions and discuss with the studio director.'}</p>
          <ul>
            <li><Check size={12}/> {lang === 'am' ? 'ቀጥታ ውይይት በቴሌግራም' : 'Direct Telegram bot chat'}</li>
            <li><Check size={12}/> {lang === 'am' ? 'ያለ ቅድመ ክፍያ መጠየቅ' : 'No upfront deposit required'}</li>
            <li><Check size={12}/> {lang === 'am' ? 'ፈጣን ምላሽ ከዳይሬክተር' : 'Instant response from director'}</li>
          </ul>
          <span className="bf-fork-cta">{submitting ? '...' : (lang === 'am' ? 'በቴሌግራም ቦት ይጠይቁ →' : 'Ask on Telegram Bot →')}</span>
        </button>
      </div>
      <button type="button" className="bf-back-btn" onClick={() => setStep(1)}><ChevronLeft size={15}/> {lang === 'am' ? 'ተመለስ' : 'Back'}</button>
    </div>
  );

  // ── STEP 3: Document-Style Legal Agreement + Signature ──
  const activeAgreement = selectedAgrTemplate || resolveAgreementForPackage(selectedPackage, defaultAgreements9);

  const renderStep3 = () => (
    <div className="bf-step-body">
      <DocumentStyleAgreement
        agreement={activeAgreement}
        clientName={form.name}
        phone={form.phone}
        eventDate={form.date}
        location={form.location || 'Addis Ababa'}
        totalPrice={totalPrice}
        depositAmount={deposit}
        remainingBalance={remaining}
        signature={signature}
        onSign={setSignature}
        onClearSignature={() => setSignature(null)}
        lang={lang}
        orderId={createdOrder?.id}
      />

      <label className="bf-terms-check doc-no-print" style={{ marginTop: '16px' }}>
        <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} />
        <span>{lang === 'am' ? 'ሁሉንም የውል አንቀጾች እና የ 50% ቅድመ ክፍያ ሁኔታ ተቀብያለሁ' : 'I accept all agreement terms, conditions, and the 50% advance deposit schedule'}</span>
      </label>

      {error && <p className="bf-error doc-no-print">{error}</p>}
      <div className="bf-btn-row doc-no-print">
        <button type="button" className="bf-back-btn" onClick={() => setStep(2)}><ChevronLeft size={15}/> {lang === 'am' ? 'ተመለስ' : 'Back'}</button>
        <button type="button" className="bf-primary-btn" onClick={handleContractNext}>
          {lang === 'am' ? 'ወደ ክፍያ ቀጥሉ' : 'Proceed to Payment'} <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );

  // ── STEP 4: Checkout ──
  const telebirr = payAccounts?.telebirr;
  const cbe = payAccounts?.cbe;

  const renderStep4 = () => (
    <form onSubmit={handlePaymentSubmit} className="bf-step-body">
      <div className="bf-pay-header">
        <CreditCard size={22}/>
        <div>
          <h3>{lang === 'am' ? 'ቅድሚ ክፍያ ይፈጽሙ' : 'Complete Advance Deposit'}</h3>
          <p>{lang === 'am' ? `30% ቅድሚ ክፍያ: ${deposit.toLocaleString()} ETB` : `30% Deposit: ${deposit.toLocaleString()} ETB`}</p>
        </div>
      </div>

      <div className="bf-pay-methods">
        <p className="bf-deliv-label">{lang === 'am' ? 'የክፍያ ዘዴ ምረጡ:' : 'Select Payment Method:'}</p>
        <div className="bf-pay-method-cards">
          <button type="button" className={`bf-pay-card ${payMethod==='telebirr'?'bf-pay-selected':''}`} onClick={() => setPayMethod('telebirr')}>
            <div className="bf-pay-logo telebirr-logo">T</div>
            <div>
              <strong>Telebirr</strong>
              <p>{telebirr?.phone || '09 10 52 69 62'}</p>
              <small>{telebirr?.accountName || 'HOPE Photo & Velo'}</small>
            </div>
            {payMethod==='telebirr' && <Check size={18} className="bf-pay-check"/>}
          </button>
          <button type="button" className={`bf-pay-card ${payMethod==='cbe'?'bf-pay-selected':''}`} onClick={() => setPayMethod('cbe')}>
            <div className="bf-pay-logo cbe-logo">CBE</div>
            <div>
              <strong>CBE (Commercial Bank)</strong>
              <p>{cbe?.accountNumber || '1000542389123'}</p>
              <small>{cbe?.branch || 'Hayahulet Branch'}</small>
            </div>
            {payMethod==='cbe' && <Check size={18} className="bf-pay-check"/>}
          </button>
        </div>
      </div>

      {payMethod && (
        <div className="bf-pay-instructions">
          {payMethod === 'telebirr' ? (
            <>
              <p className="bf-instr-text">
                {lang === 'am' ? (telebirr?.instructionsAm || '') : (telebirr?.instructionsEn || '')}
              </p>
              <div className="bf-copy-row">
                <code>{telebirr?.rawPhone || '0910526962'}</code>
                <button type="button" className="bf-copy-btn" onClick={() => navigator.clipboard?.writeText(telebirr?.rawPhone || '0910526962')}>
                  <Copy size={13}/> Copy
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="bf-instr-text">
                {lang === 'am' ? (cbe?.instructionsAm || '') : (cbe?.instructionsEn || '')}
              </p>
              <div className="bf-copy-row">
                <code>{cbe?.accountNumber || '1000542389123'}</code>
                <button type="button" className="bf-copy-btn" onClick={() => navigator.clipboard?.writeText(cbe?.accountNumber || '1000542389123')}>
                  <Copy size={13}/> Copy
                </button>
              </div>
              <p className="bf-copy-row-label">{cbe?.bankName || 'Commercial Bank of Ethiopia'} — {cbe?.branch || 'Hayahulet'}</p>
            </>
          )}
        </div>
      )}

      <div className="bf-receipt-upload">
        <p className="bf-deliv-label"><Upload size={13}/> {lang === 'am' ? 'የደረሰኝ ምስል ይጫኑ (screenshot)' : 'Upload Payment Receipt Screenshot'}</p>
        <label className={`bf-dropzone ${receiptPreview ? 'bf-dropzone-filled':''}`}>
          <input type="file" accept="image/*" onChange={handleReceiptChange} hidden/>
          {receiptPreview
            ? <img src={receiptPreview} alt="receipt" className="bf-receipt-preview"/>
            : <>
                <Upload size={28} className="bf-upload-icon"/>
                <span>{lang === 'am' ? 'ምስል ይምረጡ ወይም ይጎትቱ' : 'Tap to select or drag receipt image'}</span>
                <small>JPG, PNG — max 5MB</small>
              </>}
        </label>
        {receiptPreview && (
          <button type="button" className="bf-change-receipt" onClick={() => { setReceipt(null); setReceiptPrev(null); }}>
            <X size={12}/> {lang === 'am' ? 'ሌላ ምስል ምረጥ' : 'Change receipt'}
          </button>
        )}
      </div>

      {error && <p className="bf-error">{error}</p>}
      <div className="bf-btn-row">
        <button type="button" className="bf-back-btn" onClick={() => setStep(3)}><ChevronLeft size={15}/> {lang === 'am' ? 'ተመለስ' : 'Back'}</button>
        <button type="submit" className="bf-primary-btn" disabled={submitting}>
          {submitting ? (lang === 'am' ? 'በማስገባት ላይ...' : 'Submitting...') : (lang === 'am' ? 'ክፍያ ያስገቡ' : 'Submit Payment Proof')} <Check size={16}/>
        </button>
      </div>
    </form>
  );

  // ── STEP 5: Discussion / Question on TG Bot ──
  const renderStep5 = () => (
    <div className="bf-step-body bf-confirm">
      <div className="bf-confirm-icon discuss"><MessageCircle size={38}/></div>
      <h3>{lang === 'am' ? 'ጥያቄዎ ተመዝግቧል!' : 'Inquiry Registered!'}</h3>
      <p className="bf-confirm-sub">
        {lang === 'am'
          ? 'ከታች ያለውን ቁልፍ በመጫን በቴሌግራም ቦት በቀጥታ መወያየት ይችላሉ። ዳይሬክተሮቻችን ወዲያውኑ ይመልሳሉ።'
          : 'Please chat directly with our studio director on our official Telegram bot below.'}
      </p>
      <div className="bf-confirm-detail-box">
        <div className="bf-confirm-row"><span>👤</span><strong>{form.name}</strong></div>
        <div className="bf-confirm-row"><span>📞</span><strong>{form.phone}</strong></div>
        <div className="bf-confirm-row"><span>📅</span><strong>{form.date}</strong></div>
        <div className="bf-confirm-row"><span>📦</span><strong>{pkgName}</strong></div>
        <div className="bf-confirm-row"><span>🔖</span><code>{createdOrder?.id}</code></div>
      </div>

      {/* Primary Telegram CTA */}
      <a
        className="bf-primary-btn bf-tg-btn"
        href={`https://t.me/HoopStudioSystemBot?start=discuss_${createdOrder?.id || 'new'}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{textDecoration:'none',justifyContent:'center',background:'linear-gradient(135deg, #0088cc, #00b4d8)',marginBottom:'10px'}}
      >
        <Send size={18}/> {lang === 'am' ? '💬 በቴሌግራም ቦት በቀጥታ ይጠይቁ' : '💬 Ask on Telegram Bot Directly'}
      </a>

      <a className="bf-back-btn" href={`tel:${PHONE_LINK}`} style={{textDecoration:'none',justifyContent:'center',marginBottom:'8px'}}>
        <Phone size={15}/> {lang === 'am' ? '📞 በስልክ ይደውሉ: 09 10 52 69 62' : '📞 Call Us: 09 10 52 69 62'}
      </a>

      <button type="button" className="bf-back-btn" onClick={onClose}>
        {lang === 'am' ? 'ወደ ዋናው ገጽ ተመለሱ' : 'Return to Website'}
      </button>
    </div>
  );

  // ── STEP 6: QR RECEIPT CARD (beautiful + downloadable) ──
  const receiptCardRef = useRef(null);
  const [receiptDownloading, setReceiptDownloading] = useState(false);

  // Load cross-origin image as promise
  const loadImg = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  const downloadReceipt = async () => {
    setReceiptDownloading(true);
    try {
      const W = 720, H = 980;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const c = cv.getContext('2d');

      // Background
      const bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0a0a0f');
      bg.addColorStop(0.5, '#111118');
      bg.addColorStop(1, '#0d0508');
      c.fillStyle = bg; c.fillRect(0, 0, W, H);

      // Crimson glow top-left
      const g1 = c.createRadialGradient(130, 160, 0, 130, 160, 340);
      g1.addColorStop(0, 'rgba(189,38,55,0.25)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g1; c.fillRect(0, 0, W, H);

      // Gold glow bottom-right
      const g2 = c.createRadialGradient(580, 820, 0, 580, 820, 260);
      g2.addColorStop(0, 'rgba(212,175,55,0.18)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g2; c.fillRect(0, 0, W, H);

      // Outer border
      c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 1.5;
      c.strokeRect(1, 1, W-2, H-2);

      // Header band fill
      c.fillStyle = 'rgba(189,38,55,0.12)'; c.fillRect(0, 0, W, 118);
      c.strokeStyle = 'rgba(189,38,55,0.3)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(0, 118); c.lineTo(W, 118); c.stroke();

      // Brand name
      c.fillStyle = '#f5f5f5'; c.font = 'bold 40px Arial,sans-serif';
      c.fillText('HOPE', 44, 60);
      c.fillStyle = '#9090a8'; c.font = '500 14px Arial,sans-serif';
      c.fillText('PHOTO & VELO STUDIO', 44, 84);
      c.fillStyle = 'rgba(189,38,55,0.75)'; c.font = '500 11px Arial,sans-serif';
      c.fillText('ADDIS ABABA  \u00B7  EST. 2009', 44, 108);

      // Status pill (right)
      c.fillStyle = 'rgba(245,158,11,0.15)';
      cRR(c, W-230, 38, 186, 30, 8); c.fill();
      c.strokeStyle = 'rgba(245,158,11,0.3)'; c.lineWidth = 1;
      cRR(c, W-230, 38, 186, 30, 8); c.stroke();
      c.fillStyle = '#f59e0b'; c.font = 'bold 11px Arial,sans-serif';
      c.textAlign = 'center';
      c.fillText('PENDING VERIFICATION', W-137, 59);
      c.textAlign = 'left';

      // Eyebrow
      c.fillStyle = 'rgba(189,38,55,0.65)'; c.font = 'bold 11px Arial,sans-serif';
      c.fillText('\u25CF  BOOKING RECEIPT', 44, 152);

      // Thin divider
      c.strokeStyle = 'rgba(255,255,255,0.05)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(44, 163); c.lineTo(W-44, 163); c.stroke();

      // Detail rows
      const rows = [
        ['\u{1F464}', 'Client', form.name || '\u2014', false],
        ['\u{1F4DE}', 'Phone', form.phone || '\u2014', false],
        ['\u{1F4C5}', 'Event Date', form.date || '\u2014', false],
        ['\u{1F4E6}', 'Package', (createdOrder?.packageName || pkgName || '\u2014'), false],
        ['\u{1F4B3}', 'Deposit Paid', `${deposit.toLocaleString()} ETB`, 'green'],
        ['\u{1F4CA}', 'Balance Due', `${remaining.toLocaleString()} ETB`, false],
        ['\u{1F3E6}', 'Paid Via', payMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr', false],
        ['\u{1F516}', 'Reference #', createdOrder?.id || '\u2014', 'gold'],
        ['\u{1F4C6}', 'Issued', new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}), false],
      ];
      let ry = 188;
      rows.forEach(([icon, label, val, accent], i) => {
        if (i % 2 === 0) {
          c.fillStyle = 'rgba(255,255,255,0.025)'; c.fillRect(44, ry-13, W-88, 27);
        }
        c.fillStyle = '#55556a'; c.font = '500 11px Arial,sans-serif';
        c.fillText(label.toUpperCase(), 58, ry+4);
        c.font = accent === 'gold' ? 'bold 13px Arial,sans-serif' : 'bold 14px Arial,sans-serif';
        c.fillStyle = accent === 'green' ? '#22c55e' : accent === 'gold' ? '#d4af37' : '#f0f0f0';
        c.textAlign = 'right';
        c.fillText(val, W-58, ry+4);
        c.textAlign = 'left';
        ry += 30;
      });

      // QR Code fetch & draw
      const qrY = ry + 28;
      const QS = 170;
      const qrX = (W - QS) / 2;
      const qrData = encodeURIComponent(`HOPE|${createdOrder?.id||'REF'}|${form.name}|${form.date}`);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&color=f5f5f5&bgcolor=1a1a25&ecc=M&data=${qrData}`;

      // QR background card
      c.fillStyle = '#1a1a25';
      cRR(c, qrX-20, qrY-14, QS+40, QS+54, 14); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 1;
      cRR(c, qrX-20, qrY-14, QS+40, QS+54, 14); c.stroke();

      try {
        const qrImg = await loadImg(qrUrl);
        c.drawImage(qrImg, qrX, qrY, QS, QS);
      } catch {
        c.fillStyle = '#252535'; c.fillRect(qrX, qrY, QS, QS);
        c.fillStyle = '#55556a'; c.font = '500 12px Arial,sans-serif';
        c.textAlign = 'center'; c.fillText('QR CODE', W/2, qrY+QS/2+4); c.textAlign = 'left';
      }

      c.fillStyle = '#55556a'; c.font = '500 11px Arial,sans-serif';
      c.textAlign = 'center'; c.fillText('Scan to verify booking', W/2, qrY+QS+22); c.textAlign = 'left';

      // Tear line
      const tearY = qrY + QS + 55;
      c.setLineDash([5,6]); c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(44, tearY); c.lineTo(W-44, tearY); c.stroke(); c.setLineDash([]);
      [[28, tearY],[W-28, tearY]].forEach(([cx,cy]) => {
        c.fillStyle = '#0a0a0f'; c.beginPath(); c.arc(cx,cy,11,0,Math.PI*2); c.fill();
      });

      // Footer text
      const fy = tearY + 32;
      c.fillStyle = '#3a3a4a'; c.font = '500 10px Arial,sans-serif'; c.textAlign = 'center';
      c.fillText('Date held 24 hrs pending verification  \u00B7  +251 910 52 69 62', W/2, fy);
      c.fillStyle = 'rgba(189,38,55,0.5)';
      c.fillText('hope-photo-velo.vercel.app', W/2, fy+20);
      c.textAlign = 'left';

      // Gold accent bottom line
      const goldG = c.createLinearGradient(80, 0, W-80, 0);
      goldG.addColorStop(0,'rgba(212,175,55,0)'); goldG.addColorStop(0.5,'rgba(212,175,55,0.55)'); goldG.addColorStop(1,'rgba(212,175,55,0)');
      c.strokeStyle = goldG; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(80, H-26); c.lineTo(W-80, H-26); c.stroke();

      // Download
      const a = document.createElement('a');
      a.download = `HOPE-receipt-${createdOrder?.id||'booking'}.png`;
      a.href = cv.toDataURL('image/png');
      a.click();
    } catch(err) { console.error('Receipt download failed:', err); }
    setReceiptDownloading(false);
  };

  // Canvas rounded-rect helper (no fill/stroke — caller does that)
  function cRR(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x+r, y); c.lineTo(x+w-r, y); c.quadraticCurveTo(x+w,y,x+w,y+r);
    c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
    c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y);
    c.closePath();
  }

  const renderStep6 = () => {
    const qrVal = encodeURIComponent(`HOPE|${createdOrder?.id||'REF'}|${form.name}|${form.date}`);
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=f5f5f5&bgcolor=111118&ecc=M&data=${qrVal}`;
    return (
      <div className="bf-step-body bf-receipt-card-wrap" ref={receiptCardRef}>

        {/* ── Animated check header ── */}
        <div className="brc-header">
          <div className="brc-check-ring">
            <Check size={22} color="#f5f5f5" strokeWidth={2.5}/>
          </div>
          <div>
            <p className="brc-header-title">{lang==='am'?'ቀጠሮዎ ቀርቧል!':'Booking Submitted!'}</p>
            <p className="brc-header-sub">{lang==='am'?'ደረሰኝዎን ያስቀምጡ':'Save your receipt below'}</p>
          </div>
        </div>

        {/* ── The visual receipt card ── */}
        <div className="brc-card">
          <div className="brc-glow-top"/>
          <div className="brc-glow-bottom"/>

          {/* Top band */}
          <div className="brc-top-band">
            <div className="brc-brand">
              <span className="brc-brand-name">HOPE</span>
              <span className="brc-brand-sub">Photo &amp; Velo Studio · Addis Ababa</span>
            </div>
            <div className="brc-pending-pill">PENDING</div>
          </div>

          <p className="brc-eyebrow"><span className="brc-dot"/>BOOKING RECEIPT</p>

          {/* Detail rows */}
          <div className="brc-details">
            {[
              {icon:'👤', label: lang==='am'?'ስም':'Client',      val: form.name,                   mono: false, green: false},
              {icon:'📞', label: lang==='am'?'ስልክ':'Phone',      val: form.phone,                  mono: false, green: false},
              {icon:'📅', label: lang==='am'?'ቀን':'Event Date',  val: form.date,                   mono: false, green: false},
              {icon:'📦', label: lang==='am'?'ፓኬጅ':'Package',   val: createdOrder?.packageName || pkgName, mono: false, green: false},
              {icon:'💳', label: lang==='am'?'ቅድሚ ክፍያ':'Deposit Paid', val: `${deposit.toLocaleString()} ETB`, mono: false, green: true},
              {icon:'📊', label: lang==='am'?'ቀሪ ክፍያ':'Balance Due', val: `${remaining.toLocaleString()} ETB`, mono: false, green: false},
              {icon:'🏦', label: lang==='am'?'ሳ/ዘዴ':'Paid Via',  val: payMethod==='telebirr'?'Telebirr':'CBE Birr', mono: false, green: false},
              {icon:'🔖', label: lang==='am'?'ማጣቀሻ':'Reference',val: null,  mono: createdOrder?.id, green: false},
              {icon:'📆', label: lang==='am'?'የቀረበ':'Issued',    val: new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}), mono: false, green: false},
            ].map(({icon, label, val, mono, green}) => (
              <div key={label} className="brc-row">
                <span className="brc-row-icon">{icon}</span>
                <span className="brc-row-label">{label}</span>
                {mono
                  ? <code className="brc-row-mono">{mono}</code>
                  : <span className="brc-row-value" style={green?{color:'#22c55e'}:{}}>{val}</span>
                }
              </div>
            ))}
          </div>

          {/* Tear line */}
          <div className="brc-tear">
            <div className="brc-tear-notch brc-notch-l"/>
            <div className="brc-tear-dashes"/>
            <div className="brc-tear-notch brc-notch-r"/>
          </div>

          {/* QR Section */}
          <div className="brc-qr-section">
            <div className="brc-qr-frame">
              <div className="brc-qr-corner brc-corner-tl"/><div className="brc-qr-corner brc-corner-tr"/>
              <img src={qrSrc} alt="Booking QR Code" className="brc-qr-img" crossOrigin="anonymous"/>
              <div className="brc-qr-corner brc-corner-bl"/><div className="brc-qr-corner brc-corner-br"/>
            </div>
            <p className="brc-qr-label">{lang==='am'?'ቀጠሮ ለማረጋገጥ ስካን ያድርጉ':'Scan to verify booking'}</p>
          </div>

          {/* Card footer */}
          <div className="brc-card-footer">
            <p>{lang==='am'?'ቀኑ ለ 24 ሰዓት ይጠበቃል':'Date held 24 hrs · +251 910 52 69 62'}</p>
            <p className="brc-footer-url">hope-photo-velo.vercel.app</p>
          </div>
          <div className="brc-gold-line"/>
        </div>

        {/* ── Download button ── */}
        <button
          type="button"
          className="bf-primary-btn brc-download-btn"
          onClick={downloadReceipt}
          disabled={receiptDownloading}
          style={{marginTop:'8px'}}
        >
          {receiptDownloading ? (
            <><span className="brc-spinner"/>  {lang==='am'?'በማዘጋጀት ላይ...':'Preparing receipt...'}</>
          ) : (
            <>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {lang==='am'?'ደረሰኝ አውርድ (PNG)':'Download Receipt PNG'}
            </>
          )}
        </button>

        <button type="button" className="bf-back-btn" style={{alignSelf:'center'}} onClick={onClose}>
          {lang==='am'?'ወደ ዋናው ገጽ':'Return to Website'}
        </button>
      </div>
    );
  };


  return (
    <div className="bf-overlay" role="dialog" aria-modal="true" aria-labelledby="bf-title">
      <button className="bf-backdrop" aria-label="Close" onClick={onClose}/>
      <section className="bf-panel">
        <div className="bf-panel-header">
          <div>
            <p className="bf-eyebrow">{lang === 'am' ? 'ቀን ምዝገባ' : 'Book Your Date'}</p>
            <h2 id="bf-title" className="bf-title">{pkgName}</h2>
          </div>
          <button className="bf-close-btn" aria-label="Close" onClick={onClose}><X size={20}/></button>
        </div>
        {(step === 1 || step === 2 || step === 3 || step === 4) && renderStepIndicator()}
        <div className="bf-panel-scroll">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 'agr-gallery' && renderAgreementGallery()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </div>
      </section>
    </div>
  );
}

/* ── BACKWARD COMPAT: BookingPanel alias ──────────────────────────────────── */
const BookingPanel = BookingFlowModal;

/* ── STANDALONE ADMIN CONTROL PORTAL ─────────────────────────────────────── */
function AdminControlPanel({ onClose, lang }) {
  const [pin, setPin]                     = useState('');
  const [unlocked, setUnlocked]           = useState(false);
  const [pinError, setPinError]           = useState(false);
  const [tab, setTab]                     = useState('orders'); // 'orders'|'chats'|'agreements'|'calendar'|'packages'|'contract'|'accounts'
  const [settings, setSettings]           = useState(null);
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [status, setStatus]               = useState('');
  const [searchQuery, setSearchQuery]     = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [receiptModalImg, setReceiptModalImg] = useState(null);

  // Chat state
  const [chats, setChats]                 = useState([]);
  const [activeChat, setActiveChat]       = useState(null);
  const [chatMessages, setChatMessages]   = useState([]);
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSending, setChatSending]     = useState(false);

  // Agreements state
  const [defaultAgr9, setDefaultAgr9]     = useState([]);
  const [customAgrs, setCustomAgrs]       = useState([]);
  const [signedAgrs, setSignedAgrs]       = useState([]);
  const [editingAgr, setEditingAgr]       = useState(null);
  const [sendingAgrLink, setSendingAgrLink] = useState(false);

  // Edit states
  const [editPkg, setEditPkg]             = useState(null);
  const [contractDraft, setContractDraft] = useState(null);
  const [newBlackout, setNewBlackout]     = useState('');
  const [payDraft, setPayDraft]           = useState(null);

  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  const checkPin = (e) => {
    e.preventDefault();
    if (pin === 'HOPE2026') {
      setUnlocked(true);
      loadData();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1200);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes, chatRes, agrRes] = await Promise.all([
        fetch(`${apiBase}/api/settings`).then(r => r.json()),
        fetch(`${apiBase}/api/orders`).then(r => r.json()),
        fetch(`${apiBase}/api/chat?list=1`).then(r => r.json()).catch(() => ({ chats: [] })),
        fetch(`${apiBase}/api/agreements?list=1`).then(r => r.json()).catch(() => ({ defaultAgreements: [], customAgreements: [], signedAgreements: [] })),
      ]);
      setSettings(sRes.settings || {});
      setContractDraft(sRes.settings?.contractTemplate || {});
      setPayDraft(sRes.settings?.paymentAccounts || {});
      setOrders(oRes.orders || []);
      setChats(chatRes.chats || []);
      setDefaultAgr9(agrRes.defaultAgreements || sRes.settings?.defaultAgreements9 || []);
      setCustomAgrs(agrRes.customAgreements || []);
      setSignedAgrs(agrRes.signedAgreements || []);
      setStatus('✓ Live data synced');
      setTimeout(() => setStatus(''), 2500);
    } catch(e) {
      setStatus('Failed to load data');
    }
    setLoading(false);
  };

  // Real-time live sync polling for client questions from Telegram Bot
  useEffect(() => {
    if (!unlocked || tab !== 'chats') return;
    const pollInterval = setInterval(() => {
      fetch(`${apiBase}/api/chat?list=1`)
        .then(r => r.json())
        .then(d => {
          if (Array.isArray(d?.chats)) setChats(d.chats);
        })
        .catch(() => {});

      if (activeChat?.chatId) {
        fetch(`${apiBase}/api/chat?chat_id=${activeChat.chatId}`)
          .then(r => r.json())
          .then(d => {
            if (Array.isArray(d?.messages)) {
              setChatMessages(d.messages);
            }
          })
          .catch(() => {});
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [unlocked, tab, activeChat?.chatId]);

  const loadChat = async (chatId) => {
    try {
      const r = await fetch(`${apiBase}/api/chat?chat_id=${chatId}&mark_read=1`);
      const d = await r.json();
      setActiveChat(d.chat || null);
      setChatMessages(d.messages || d.chat?.messages || []);
      setChats(prev => prev.map(c => c.chatId === chatId ? { ...c, unreadCount: 0 } : c));
    } catch(e) { /* silent */ }
  };

  const sendAdminReply = async () => {
    if (!chatReplyText.trim() || !activeChat) return;
    setChatSending(true);
    try {
      const r = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_reply',
          chat_id: activeChat.chatId,
          text: chatReplyText,
          sender: 'admin',
          senderName: 'HOPE Studio Director'
        })
      });
      const d = await r.json();
      if (d.success) {
        setChatMessages(prev => [...prev, d.message]);
        setChatReplyText('');
        setStatus('✓ Reply sent via Telegram');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch(e) { setStatus('Send failed'); }
    setChatSending(false);
  };

  const sendAgreementLink = async (customAgreementId) => {
    if (!activeChat?.chatId) return;
    setSendingAgrLink(true);
    try {
      const r = await fetch(`${apiBase}/api/agreements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_link', customAgreementId, chatId: activeChat.chatId })
      });
      const d = await r.json();
      if (d.success) {
        setStatus(`✓ Agreement link sent: ${d.signingUrl}`);
        setTimeout(() => setStatus(''), 3000);
      }
    } catch(e) { setStatus('Link send failed'); }
    setSendingAgrLink(false);
  };

  const saveCustomAgreement = async (agrData) => {
    try {
      const r = await fetch(`${apiBase}/api/agreements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_custom', ...agrData })
      });
      const d = await r.json();
      if (d.success) {
        setCustomAgrs(prev => {
          const idx = prev.findIndex(a => a.id === d.agreement.id);
          if (idx >= 0) { const n = [...prev]; n[idx] = d.agreement; return n; }
          return [d.agreement, ...prev];
        });
        setEditingAgr(null);
        setStatus('✓ Agreement saved');
        setTimeout(() => setStatus(''), 2000);
        return d.agreement;
      }
    } catch(e) { setStatus('Save failed'); }
  };

  const patchSettings = async (patch) => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'update_settings', ...patch })
      });
      const data = await r.json();
      setSettings(data.settings || settings);
      setStatus('✓ Settings saved');
      setTimeout(() => setStatus(''), 2500);
    } catch(e) { setStatus('Save failed'); }
    setLoading(false);
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id, status: newStatus })
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setStatus(`✓ Order #${id} set to ${newStatus}`);
      setTimeout(() => setStatus(''), 2500);
    } catch(e) { setStatus('Update failed'); }
  };

  const addBlackout = async () => {
    if (!newBlackout) return;
    const current = settings?.blackoutDates || [];
    if (current.includes(newBlackout)) return;
    const updated = [...current, newBlackout].sort();
    await patchSettings({ blackoutDates: updated });
    setSettings(s => ({...s, blackoutDates: updated}));
    setNewBlackout('');
  };

  const removeBlackout = async (date) => {
    const updated = (settings?.blackoutDates || []).filter(d => d !== date);
    await patchSettings({ blackoutDates: updated });
    setSettings(s => ({...s, blackoutDates: updated}));
  };

  const saveContract = async () => {
    await patchSettings({ contractTemplate: contractDraft });
  };

  const savePaymentAccounts = async () => {
    await patchSettings({ paymentAccounts: payDraft });
  };

  const statusColor = (s) => {
    if (s === 'CONFIRMED') return '#22c55e';
    if (s === 'PENDING_VERIFICATION') return '#f59e0b';
    if (s === 'REJECTED') return '#ef4444';
    if (s === 'IN_DISCUSSION') return '#38bdf8';
    return '#9090a8';
  };

  // KPIs
  const pendingCount = orders.filter(o => o.status === 'PENDING_VERIFICATION').length;
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const discussCount = orders.filter(o => o.status === 'IN_DISCUSSION').length;
  const totalRevenue = orders
    .filter(o => o.status === 'CONFIRMED' || o.status === 'PENDING_VERIFICATION')
    .reduce((sum, o) => sum + (Number(o.totalPrice || o.basePrice) || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.clientName && o.clientName.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.packageName && o.packageName.toLowerCase().includes(q)) ||
      (o.eventDate && o.eventDate.includes(q))
    );
  });

  /* ── 1. PIN LOCK SCREEN (STANDALONE) ── */
  if (!unlocked) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-glow"/>
          <img src={`${ASSET}/hope-logo.png`} alt="HOPE" className="admin-lock-logo"/>
          <div className="admin-lock-icon">
            <Shield size={36} color="#bd2637"/>
          </div>
          <h2>HOPE STUDIO PORTAL</h2>
          <p className="admin-lock-sub">Executive Administration &amp; Booking Management</p>

          <form onSubmit={checkPin} className="admin-lock-form">
            <div className="admin-lock-input-wrap">
              <Lock size={16} className="admin-lock-field-icon"/>
              <input
                type="password"
                className={`admin-lock-input ${pinError ? 'pin-shake' : ''}`}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter Studio PIN (e.g. HOPE2026)"
                autoFocus
              />
            </div>
            {pinError && <p className="admin-lock-err">⚠️ Incorrect Security PIN. Please try again.</p>}
            <button type="submit" className="admin-lock-btn">
              <Lock size={16}/> Unlock Studio Portal
            </button>
          </form>

          <button type="button" className="admin-lock-exit" onClick={onClose}>
            ← Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  /* ── 2. STANDALONE DASHBOARD ── */
  return (
    <div className="admin-portal-standalone">
      {/* ── TOP EXECUTIVE BAR ── */}
      <header className="admin-portal-topbar">
        <div className="apt-left">
          <img src={`${ASSET}/hope-logo.png`} alt="HOPE" className="apt-logo"/>
          <div>
            <div className="apt-brand-row">
              <span className="apt-title">HOPE STUDIO</span>
              <span className="apt-badge">DIRECTOR PORTAL</span>
              <span className="apt-live-dot">● Live Sync</span>
            </div>
            <p className="apt-sub">Official Booking &amp; Contract Control System</p>
          </div>
        </div>

        {/* Center KPIs */}
        <div className="apt-kpis">
          <div className="apt-kpi-item">
            <span className="apt-kpi-val">{orders.length}</span>
            <span className="apt-kpi-lbl">Total Orders</span>
          </div>
          <div className="apt-kpi-item apt-kpi-amber">
            <span className="apt-kpi-val">{pendingCount}</span>
            <span className="apt-kpi-lbl">Pending Review</span>
          </div>
          <div className="apt-kpi-item apt-kpi-green">
            <span className="apt-kpi-val">{confirmedCount}</span>
            <span className="apt-kpi-lbl">Confirmed</span>
          </div>
          <div className="apt-kpi-item apt-kpi-gold">
            <span className="apt-kpi-val">{totalRevenue.toLocaleString()} ETB</span>
            <span className="apt-kpi-lbl">Pipeline Value</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="apt-right">
          {status && <span className="apt-status-toast">{status}</span>}
          <button className="apt-btn-secondary" onClick={loadData} title="Refresh live data">
            <RefreshCw size={14}/> <span>Refresh</span>
          </button>
          <button className="apt-btn-exit" onClick={onClose} title="Return to client website">
            <LogOut size={14}/> <span>Exit to Website</span>
          </button>
        </div>
      </header>

      {/* ── TABS NAVIGATION BAR ── */}
      <nav className="admin-portal-nav">
        <div className="admin-portal-tabs">
          <button className={`apt-tab ${tab === 'orders' ? 'apt-tab-active' : ''}`} onClick={() => setTab('orders')}>
            <Package size={16}/> <span>Orders</span>
            {pendingCount > 0 && <span className="apt-tab-pill-amber">{pendingCount}</span>}
          </button>
          <button className={`apt-tab ${tab === 'chats' ? 'apt-tab-active' : ''}`} onClick={() => setTab('chats')}>
            <MessageCircle size={16}/> <span>💬 Chats</span>
            {chats.reduce((s,c) => s + (c.unreadCount||0), 0) > 0 && (
              <span className="apt-tab-pill-amber">{chats.reduce((s,c) => s + (c.unreadCount||0), 0)}</span>
            )}
          </button>
          <button className={`apt-tab ${tab === 'agreements' ? 'apt-tab-active' : ''}`} onClick={() => setTab('agreements')}>
            <Layers size={16}/> <span>📜 Agreements</span>
          </button>
          <button className={`apt-tab ${tab === 'calendar' ? 'apt-tab-active' : ''}`} onClick={() => setTab('calendar')}>
            <CalendarDays size={16}/> <span>Calendar</span>
          </button>
          <button className={`apt-tab ${tab === 'packages' ? 'apt-tab-active' : ''}`} onClick={() => setTab('packages')}>
            <Star size={16}/> <span>Packages</span>
          </button>
          <button className={`apt-tab ${tab === 'contract' ? 'apt-tab-active' : ''}`} onClick={() => setTab('contract')}>
            <Shield size={16}/> <span>Contract</span>
          </button>
          <button className={`apt-tab ${tab === 'accounts' ? 'apt-tab-active' : ''}`} onClick={() => setTab('accounts')}>
            <CreditCard size={16}/> <span>Accounts</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="admin-portal-main">
        {loading && <div className="admin-portal-loader"><div className="brc-spinner"/> Loading latest data...</div>}

        {/* ════ TAB: CHATS ════ */}
        {tab === 'chats' && (
          <section className="apt-tab-section">
            <div className="admin-chat-layout">
              {/* LEFT: Chat list */}
              <div className="admin-chat-sidebar">
                <div className="admin-chat-sidebar-header">
                  <h4>💬 Conversations</h4>
                  <button className="apt-btn-secondary" onClick={loadData}><RefreshCw size={13}/></button>
                </div>
                {chats.length === 0 ? (
                  <div className="admin-empty">No conversations yet. Users who message the bot will appear here.</div>
                ) : (
                  chats.map(c => (
                    <button
                      key={c.chatId}
                      className={`admin-chat-list-item ${activeChat?.chatId === c.chatId ? 'admin-chat-item-active' : ''}`}
                      onClick={() => loadChat(c.chatId)}
                    >
                      <div className="acli-avatar">{(c.firstName || '?')[0].toUpperCase()}</div>
                      <div className="acli-info">
                        <div className="acli-name">{c.firstName} {c.lastName || ''}{c.username ? <span className="acli-handle"> @{c.username}</span> : ''}</div>
                        <div className="acli-last">{c.lastMessage?.substring(0, 45) || 'No messages'}</div>
                      </div>
                      {c.unreadCount > 0 && <span className="acli-badge">{c.unreadCount}</span>}
                    </button>
                  ))
                )}
              </div>

              {/* RIGHT: Chat thread */}
              <div className="admin-chat-thread">
                {!activeChat ? (
                  <div className="admin-chat-empty">
                    <MessageCircle size={48} color="#55556a"/>
                    <h4>Select a conversation</h4>
                    <p>Click on a chat in the list to view the conversation and reply.</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-chat-thread-header">
                      <div>
                        <h4>{activeChat.firstName} {activeChat.lastName || ''}</h4>
                        <span>Chat ID: <code>{activeChat.chatId}</code>{activeChat.orderId ? ` · Order: ${activeChat.orderId}` : ''}</span>
                      </div>
                      <div className="admin-chat-thread-actions">
                        <button className="aoc-btn-discuss" onClick={() => setTab('agreements')} title="Create custom agreement for this client">
                          <Layers size={14}/> Customize Agreement
                        </button>
                        {activeChat.orderId && (
                          <a href={`tel:${orders.find(o=>o.id===activeChat.orderId)?.phone}`} className="aoc-btn-call">
                            <Phone size={14}/> Call
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="admin-chat-messages">
                      {chatMessages.length === 0 ? (
                        <div className="admin-empty">No messages in this conversation yet.</div>
                      ) : (
                        chatMessages.map(m => (
                          <div key={m.id} className={`admin-chat-msg ${m.sender === 'admin' ? 'msg-admin' : 'msg-client'}`}>
                            <div className="admin-chat-msg-bubble">
                              <div className="admin-chat-msg-sender">{m.sender === 'admin' ? '🟦 Admin' : '🟩 Client'}</div>
                              <div className="admin-chat-msg-text">{m.text}</div>
                              <div className="admin-chat-msg-time">{new Date(m.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="admin-chat-reply-bar">
                      <textarea
                        className="admin-chat-reply-input"
                        placeholder="Type your reply... (will be sent via Telegram to client)"
                        value={chatReplyText}
                        onChange={e => setChatReplyText(e.target.value)}
                        rows={2}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminReply(); } }}
                      />
                      <button
                        className="aoc-btn-approve"
                        onClick={sendAdminReply}
                        disabled={chatSending || !chatReplyText.trim()}
                      >
                        {chatSending ? <span className="brc-spinner"/> : <Send size={15}/>}
                        {chatSending ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ════ TAB: AGREEMENTS ════ */}
        {tab === 'agreements' && (
          <section className="apt-tab-section">
            <div className="apt-split-grid">
              {/* LEFT: 9 Default Templates */}
              <div className="apt-card-box">
                <div className="apt-box-header">
                  <div>
                    <h4>📋 9 Default Agreement Templates (ወ•ል)</h4>
                    <p>The 9 ready-made physical contract templates, now digital. Click to edit &amp; customize per client.</p>
                  </div>
                </div>
                <div className="admin-agr-list">
                  {defaultAgr9.map(agr => (
                    <div key={agr.id} className="admin-agr-row">
                      <div className="admin-agr-info">
                        <span className="aoc-category-tag">{agr.category}</span>
                        <strong>{agr.name}</strong>
                        <span className="admin-agr-price">{(agr.price||0).toLocaleString()} ETB</span>
                      </div>
                      <button
                        className="aoc-btn-discuss"
                        onClick={() => setEditingAgr({
                          ...agr,
                          id: null, // new custom agr based on this template
                          baseTemplateId: agr.id,
                          clientName: activeChat ? `${activeChat.firstName} ${activeChat.lastName||''}`.trim() : '',
                          clientChatId: activeChat?.chatId || '',
                          orderId: activeChat?.orderId || '',
                        })}
                      >
                        <Edit2 size={13}/> Customize for Client
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Custom Agreements or Editor */}
              <div className="apt-card-box">
                {editingAgr ? (
                  <>
                    <div className="apt-box-header">
                      <h4>✏️ Customize Agreement for Client</h4>
                    </div>
                    <div className="admin-agr-editor">
                      <label>Client Name
                        <input value={editingAgr.clientName||''} onChange={e => setEditingAgr(a=>({...a,clientName:e.target.value}))} placeholder="Client Full Name"/>
                      </label>
                      <label>Client Chat ID (Telegram)
                        <input value={editingAgr.clientChatId||''} onChange={e => setEditingAgr(a=>({...a,clientChatId:e.target.value}))} placeholder="Telegram Chat ID"/>
                      </label>
                      <label>Package Title
                        <input value={editingAgr.packageTitle||''} onChange={e => setEditingAgr(a=>({...a,packageTitle:e.target.value}))}/>
                      </label>
                      <label>Agreed Price (ETB)
                        <input type="number" value={editingAgr.price||''} onChange={e => setEditingAgr(a=>({...a,price:Number(e.target.value)}))}/>
                      </label>
                      <label>Deliverables (one per line)
                        <textarea
                          rows={6}
                          value={(editingAgr.deliverables||[]).join('\n')}
                          onChange={e => setEditingAgr(a=>({...a,deliverables:e.target.value.split('\n').filter(Boolean)}))}
                        />
                      </label>
                      <label>Payment Terms
                        <textarea rows={3} value={editingAgr.paymentTerms||''} onChange={e => setEditingAgr(a=>({...a,paymentTerms:e.target.value}))}/>
                      </label>
                      <div className="admin-agr-editor-actions">
                        <button className="aoc-btn-reject" onClick={() => setEditingAgr(null)}>Cancel</button>
                        <button className="aoc-btn-approve" onClick={() => saveCustomAgreement(editingAgr)}>
                          <Check size={14}/> Save Custom Agreement
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="apt-box-header">
                      <div>
                        <h4>📨 Custom Client Agreements</h4>
                        <p>Agreements customized for specific clients. Send signing link via Telegram.</p>
                      </div>
                    </div>
                    {customAgrs.length === 0 ? (
                      <div className="admin-empty">No custom agreements yet. Select a template on the left and customize it for a client.</div>
                    ) : (
                      customAgrs.map(agr => (
                        <div key={agr.id} className="admin-agr-row admin-agr-custom">
                          <div className="admin-agr-info">
                            <strong>{agr.name}</strong>
                            {agr.clientName && <span className="aoc-lbl"> → {agr.clientName}</span>}
                            <span className="admin-agr-price">{(agr.price||0).toLocaleString()} ETB</span>
                            <span className={`aoc-status-pill ${agr.status === 'sent' ? '' : ''}`} style={{fontSize:'11px', padding:'2px 7px'}}>{agr.status || 'draft'}</span>
                          </div>
                          <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                            <button className="aoc-btn-discuss" onClick={() => setEditingAgr(agr)}>
                              <Edit2 size={13}/> Edit
                            </button>
                            {agr.signingUrl && (
                              <a href={agr.signingUrl} target="_blank" rel="noopener noreferrer" className="aoc-btn-discuss">
                                <ExternalLink size={13}/> Preview
                              </a>
                            )}
                            {agr.clientChatId && (
                              <button
                                className="aoc-btn-approve"
                                disabled={sendingAgrLink}
                                onClick={() => sendAgreementLink(agr.id)}
                              >
                                {sendingAgrLink ? <span className="brc-spinner"/> : <Send size={13}/>}
                                Send Link
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Signed Agreements Archive */}
            {signedAgrs.length > 0 && (
              <div className="apt-card-box" style={{marginTop:'20px'}}>
                <div className="apt-box-header"><h4>✍️ Signed Agreements Archive ({signedAgrs.length})</h4></div>
                {signedAgrs.map(agr => (
                  <div key={agr.id} className="admin-agr-row">
                    <div className="admin-agr-info">
                      <strong>{agr.clientName}</strong>
                      <span className="aoc-lbl">· {agr.packageName} ·</span>
                      <span className="admin-agr-price">{(agr.agreedPrice||0).toLocaleString()} ETB</span>
                      <span style={{color:'#22c55e', fontSize:'12px'}}> ✅ Signed {new Date(agr.signedAt).toLocaleDateString()}</span>
                    </div>
                    <code style={{fontSize:'11px', color:'#9090a8'}}>{agr.id}</code>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ════ TAB 1: ORDERS & RECEIPTS ════ */}
        {tab === 'orders' && (
          <section className="apt-tab-section">
            {/* Toolbar */}
            <div className="apt-orders-toolbar">
              <div className="apt-search-box">
                <Search size={16} className="apt-search-icon"/>
                <input
                  type="text"
                  placeholder="Search by client name, phone, order ID, or date..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="apt-search-input"
                />
                {searchQuery && (
                  <button className="apt-search-clear" onClick={() => setSearchQuery('')}><X size={14}/></button>
                )}
              </div>

              {/* Status Filters */}
              <div className="apt-filter-pills">
                {[
                  { id: 'all', label: `All (${orders.length})` },
                  { id: 'PENDING_VERIFICATION', label: `Pending (${pendingCount})`, amber: true },
                  { id: 'CONFIRMED', label: `Confirmed (${confirmedCount})`, green: true },
                  { id: 'IN_DISCUSSION', label: `Discussion (${discussCount})` },
                  { id: 'REJECTED', label: `Rejected (${orders.filter(o=>o.status==='REJECTED').length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    className={`apt-filter-pill ${statusFilter === f.id ? 'active' : ''} ${f.amber ? 'amber' : ''} ${f.green ? 'green' : ''}`}
                    onClick={() => setStatusFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="apt-empty-state">
                <Package size={48} color="#55556a"/>
                <h4>No Orders Found</h4>
                <p>No bookings match the selected status or search query.</p>
              </div>
            ) : (
              <div className="apt-orders-grid">
                {filteredOrders.map(o => {
                  const depositAmt = o.depositAmount || Math.round((o.totalPrice || o.basePrice || 0) * 0.3);
                  const remainingAmt = (o.totalPrice || o.basePrice || 0) - depositAmt;
                  return (
                    <article key={o.id} className="apt-order-card">
                      {/* Card Header */}
                      <div className="aoc-head">
                        <div>
                          <div className="aoc-id-row">
                            <code className="aoc-ref-id">{o.id}</code>
                            <span className="aoc-category-tag">{o.category || 'wedding'}</span>
                          </div>
                          <h3 className="aoc-client-name">{o.clientName}</h3>
                          <p className="aoc-pkg-name">{o.packageName}</p>
                        </div>
                        <div className="aoc-status-pill" style={{color: statusColor(o.status), borderColor: statusColor(o.status)}}>
                          {o.status.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Detail Data Grid */}
                      <div className="aoc-body-grid">
                        <div className="aoc-info-col">
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Event Date:</span>
                            <strong className="aoc-val">📅 {o.eventDate || 'To be decided'}</strong>
                          </div>
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Phone:</span>
                            <a href={`tel:${o.phone}`} className="aoc-phone-link">📞 {o.phone || '—'}</a>
                          </div>
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Location:</span>
                            <span className="aoc-val">📍 {o.location || 'Addis Ababa'}</span>
                          </div>
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Payment Method:</span>
                            <span className="aoc-pay-badge">{o.paymentMethod === 'cbe' ? 'CBE Birr' : 'Telebirr'}</span>
                          </div>
                          {o.notes && (
                            <div className="aoc-notes-box">
                              <strong>Client Note:</strong> <em>"{o.notes}"</em>
                            </div>
                          )}
                        </div>

                        <div className="aoc-financials-col">
                          <div className="aoc-fin-box">
                            <div className="aoc-fin-row">
                              <span>Total Investment:</span>
                              <strong>{Number(o.totalPrice || o.basePrice || 0).toLocaleString()} ETB</strong>
                            </div>
                            <div className="aoc-fin-row aoc-deposit-row">
                              <span>30% Deposit Paid:</span>
                              <strong className="text-green">{depositAmt.toLocaleString()} ETB</strong>
                            </div>
                            <div className="aoc-fin-row">
                              <span>Remaining Balance:</span>
                              <strong>{remainingAmt.toLocaleString()} ETB</strong>
                            </div>
                          </div>

                          {o.signatureDataUrl && (
                            <div className="aoc-sig-badge">
                              <Check size={13} color="#22c55e"/> <span>Digital Contract Signed</span>
                            </div>
                          )}
                        </div>

                        {/* Payment Proof Receipt */}
                        <div className="aoc-receipt-col">
                          <span className="aoc-lbl">Payment Proof Screenshot:</span>
                          {o.paymentProof ? (
                            <div className="aoc-receipt-thumb-wrap" onClick={() => setReceiptModalImg(o.paymentProof)}>
                              <img src={o.paymentProof} alt="Payment Receipt" className="aoc-receipt-thumb"/>
                              <div className="aoc-receipt-hover">
                                <Eye size={18}/> <span>Click to Enlarge</span>
                              </div>
                            </div>
                          ) : (
                            <div className="aoc-no-receipt">No receipt image attached</div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="aoc-card-actions">
                        {o.status !== 'CONFIRMED' && (
                          <button className="aoc-btn-approve" onClick={() => updateOrderStatus(o.id, 'CONFIRMED')}>
                            <Check size={15}/> Approve Booking
                          </button>
                        )}
                        {o.status !== 'REJECTED' && (
                          <button className="aoc-btn-reject" onClick={() => updateOrderStatus(o.id, 'REJECTED')}>
                            <X size={15}/> Reject
                          </button>
                        )}
                        {o.status !== 'IN_DISCUSSION' && (
                          <button className="aoc-btn-discuss" onClick={() => updateOrderStatus(o.id, 'IN_DISCUSSION')}>
                            <MessageCircle size={15}/> Mark In Discussion
                          </button>
                        )}
                        <a href={`tel:${o.phone}`} className="aoc-btn-call">
                          <Phone size={14}/> Call Client
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ════ TAB 2: CALENDAR & BLACKOUTS ════ */}
        {tab === 'calendar' && (
          <section className="apt-tab-section">
            <div className="apt-split-grid">
              {/* Left Column: Blackout Management */}
              <div className="apt-card-box">
                <div className="apt-box-header">
                  <div>
                    <h4>Studio Blackout Date Management</h4>
                    <p>Block dates when the studio is fully booked, travelling, or closed for holidays.</p>
                  </div>
                </div>

                <div className="apt-blackout-add-row">
                  <input
                    type="date"
                    className="apt-date-input"
                    value={newBlackout}
                    onChange={e => setNewBlackout(e.target.value)}
                  />
                  <button className="aoc-btn-approve" onClick={addBlackout}>
                    <Plus size={15}/> Block This Date
                  </button>
                </div>

                <div className="apt-blackout-list">
                  <h5>Active Blocked Dates ({settings?.blackoutDates?.length || 0})</h5>
                  {(settings?.blackoutDates || []).length === 0 ? (
                    <p className="admin-empty">No blackout dates currently configured.</p>
                  ) : (
                    <div className="apt-chips-list">
                      {(settings?.blackoutDates || []).map(d => (
                        <div key={d} className="apt-blackout-chip">
                          <span>🚫 {d}</span>
                          <button onClick={() => removeBlackout(d)} title="Remove block"><Trash2 size={13}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Confirmed/Pending Bookings Roster */}
              <div className="apt-card-box">
                <div className="apt-box-header">
                  <div>
                    <h4>Client Booked Dates</h4>
                    <p>Dates currently reserved by clients awaiting or after confirmation.</p>
                  </div>
                </div>

                <div className="apt-booked-list">
                  {orders.filter(o => o.eventDate && ['CONFIRMED','PENDING_VERIFICATION'].includes(o.status)).length === 0 ? (
                    <p className="admin-empty">No client dates booked yet.</p>
                  ) : (
                    orders
                      .filter(o => o.eventDate && ['CONFIRMED','PENDING_VERIFICATION'].includes(o.status))
                      .map(o => (
                        <div key={o.id} className="apt-booked-row">
                          <div className="apt-booked-date">
                            📅 <strong>{o.eventDate}</strong>
                          </div>
                          <div className="apt-booked-info">
                            <strong>{o.clientName}</strong>
                            <span>{o.packageName}</span>
                          </div>
                          <div className="aoc-status-pill" style={{color: statusColor(o.status), borderColor: statusColor(o.status)}}>
                            {o.status === 'CONFIRMED' ? 'Confirmed' : 'Pending Verification'}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════ TAB 3: PACKAGES & PRICING ════ */}
        {tab === 'packages' && (
          <section className="apt-tab-section">
            <div className="apt-card-box">
              <div className="apt-box-header">
                <div>
                  <h4>Service Packages Management</h4>
                  <p>Update official prices in ETB, tier badges, and client deliverables.</p>
                </div>
              </div>

              <div className="apt-packages-grid">
                {(settings?.packages || DEFAULT_PACKAGES).map(pkg => (
                  <div key={pkg.id} className="apt-pkg-card">
                    <div className="apt-pkg-top">
                      <div>
                        <span className="aoc-category-tag">{pkg.category} · {pkg.tier}</span>
                        <h4>{pkg.titleEn}</h4>
                        <small className="text-muted">{pkg.titleAm}</small>
                      </div>
                      <div className="apt-pkg-price-badge">
                        {Number(pkg.price).toLocaleString()} <span>ETB</span>
                      </div>
                    </div>

                    <div className="apt-pkg-badge-preview">
                      Badge: <strong>{pkg.badgeEn || 'None'}</strong>
                    </div>

                    {editPkg?.id === pkg.id ? (
                      <div className="apt-pkg-edit-form">
                        <label className="bf-label">Price (ETB)
                          <input
                            type="number"
                            className="bf-input"
                            value={editPkg.price}
                            onChange={e => setEditPkg(p => ({...p, price: Number(e.target.value)}))}
                          />
                        </label>
                        <label className="bf-label">Badge Label (EN)
                          <input
                            className="bf-input"
                            value={editPkg.badgeEn || ''}
                            onChange={e => setEditPkg(p => ({...p, badgeEn: e.target.value}))}
                          />
                        </label>
                        <div className="aoc-card-actions" style={{marginTop:'8px'}}>
                          <button
                            className="aoc-btn-approve"
                            onClick={async () => {
                              const updated = (settings.packages || DEFAULT_PACKAGES).map(p => p.id === editPkg.id ? editPkg : p);
                              await patchSettings({ packages: updated });
                              setSettings(s => ({...s, packages: updated}));
                              setEditPkg(null);
                            }}
                          >
                            <Check size={14}/> Save Changes
                          </button>
                          <button className="aoc-btn-reject" onClick={() => setEditPkg(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="apt-edit-btn" onClick={() => setEditPkg({...pkg})}>
                        <Edit2 size={13}/> Edit Price &amp; Badge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════ TAB 4: CONTRACT CLAUSES ════ */}
        {tab === 'contract' && contractDraft && (
          <section className="apt-tab-section">
            <div className="apt-card-box">
              <div className="apt-box-header">
                <div>
                  <h4>Official Service Contract Agreement Template</h4>
                  <p>Bilingual legal contract clauses automatically populated with client tokens during booking.</p>
                </div>
                <button className="aoc-btn-approve" onClick={saveContract}>
                  💾 Save Contract Template
                </button>
              </div>

              <div className="apt-contract-token-bar">
                <strong>Available Dynamic Tokens:</strong>
                <code>{'{clientName}'}</code>
                <code>{'{eventDate}'}</code>
                <code>{'{phone}'}</code>
                <code>{'{packageName}'}</code>
                <code>{'{agreedPrice}'}</code>
                <code>{'{depositAmount}'}</code>
                <code>{'{remainingBalance}'}</code>
              </div>

              <div className="apt-contract-fields">
                <div className="apt-split-grid">
                  <label className="bf-label">Contract Document Title (English)
                    <input
                      className="bf-input"
                      value={contractDraft.titleEn || ''}
                      onChange={e => setContractDraft(d => ({...d, titleEn: e.target.value}))}
                    />
                  </label>
                  <label className="bf-label">Contract Document Title (Amharic)
                    <input
                      className="bf-input"
                      value={contractDraft.titleAm || ''}
                      onChange={e => setContractDraft(d => ({...d, titleAm: e.target.value}))}
                    />
                  </label>
                </div>

                <div className="apt-clauses-editor">
                  {(contractDraft.clauses || []).map((c, i) => (
                    <div key={c.id || i} className="apt-clause-card">
                      <div className="apt-clause-num">Clause 0{i + 1}</div>
                      <div className="apt-split-grid">
                        <div>
                          <label className="bf-label">Heading (English)
                            <input
                              className="bf-input"
                              value={c.headingEn || ''}
                              onChange={e => {
                                const clauses = [...contractDraft.clauses];
                                clauses[i] = {...clauses[i], headingEn: e.target.value};
                                setContractDraft(d => ({...d, clauses}));
                              }}
                            />
                          </label>
                          <label className="bf-label" style={{marginTop:'8px'}}>Clause Body (English)
                            <textarea
                              className="bf-input"
                              rows="3"
                              value={c.bodyEn || ''}
                              onChange={e => {
                                const clauses = [...contractDraft.clauses];
                                clauses[i] = {...clauses[i], bodyEn: e.target.value};
                                setContractDraft(d => ({...d, clauses}));
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <label className="bf-label">Heading (Amharic)
                            <input
                              className="bf-input"
                              value={c.headingAm || ''}
                              onChange={e => {
                                const clauses = [...contractDraft.clauses];
                                clauses[i] = {...clauses[i], headingAm: e.target.value};
                                setContractDraft(d => ({...d, clauses}));
                              }}
                            />
                          </label>
                          <label className="bf-label" style={{marginTop:'8px'}}>Clause Body (Amharic)
                            <textarea
                              className="bf-input"
                              rows="3"
                              value={c.bodyAm || ''}
                              onChange={e => {
                                const clauses = [...contractDraft.clauses];
                                clauses[i] = {...clauses[i], bodyAm: e.target.value};
                                setContractDraft(d => ({...d, clauses}));
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="aoc-btn-approve" style={{marginTop:'1.25rem', alignSelf:'flex-start'}} onClick={saveContract}>
                  💾 Save Contract Template
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ════ TAB 5: BANK & PAYMENT ACCOUNTS ════ */}
        {tab === 'accounts' && payDraft && (
          <section className="apt-tab-section">
            <div className="apt-card-box">
              <div className="apt-box-header">
                <div>
                  <h4>Studio Payment Receiving Accounts</h4>
                  <p>Manage Telebirr and Commercial Bank of Ethiopia (CBE) accounts displayed on the checkout screen.</p>
                </div>
                <button className="aoc-btn-approve" onClick={savePaymentAccounts}>
                  💾 Save Bank Accounts
                </button>
              </div>

              <div className="apt-split-grid">
                {/* Telebirr Box */}
                <div className="apt-account-edit-box">
                  <div className="apt-account-head">
                    <div className="bf-pay-logo telebirr-logo">T</div>
                    <div>
                      <h4>Telebirr Merchant Settings</h4>
                      <small>Mobile Wallet Payment</small>
                    </div>
                  </div>
                  <label className="bf-label">Display Phone Number
                    <input
                      className="bf-input"
                      value={payDraft.telebirr?.phone || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        telebirr: { ...p.telebirr, phone: e.target.value, rawPhone: e.target.value.replace(/[^0-9]/g, '') }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Account Holder Name
                    <input
                      className="bf-input"
                      value={payDraft.telebirr?.accountName || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        telebirr: { ...p.telebirr, accountName: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Payment Instructions (English)
                    <textarea
                      className="bf-input"
                      rows="3"
                      value={payDraft.telebirr?.instructionsEn || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        telebirr: { ...p.telebirr, instructionsEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Payment Instructions (Amharic)
                    <textarea
                      className="bf-input"
                      rows="3"
                      value={payDraft.telebirr?.instructionsAm || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        telebirr: { ...p.telebirr, instructionsAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                {/* CBE Box */}
                <div className="apt-account-edit-box">
                  <div className="apt-account-head">
                    <div className="bf-pay-logo cbe-logo">CBE</div>
                    <div>
                      <h4>CBE Commercial Bank Settings</h4>
                      <small>Bank Transfer Payment</small>
                    </div>
                  </div>
                  <label className="bf-label">CBE Account Number
                    <input
                      className="bf-input"
                      value={payDraft.cbe?.accountNumber || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        cbe: { ...p.cbe, accountNumber: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Account Name
                    <input
                      className="bf-input"
                      value={payDraft.cbe?.accountName || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        cbe: { ...p.cbe, accountName: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Bank Branch
                    <input
                      className="bf-input"
                      value={payDraft.cbe?.branch || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        cbe: { ...p.cbe, branch: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Payment Instructions (English)
                    <textarea
                      className="bf-input"
                      rows="3"
                      value={payDraft.cbe?.instructionsEn || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        cbe: { ...p.cbe, instructionsEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Payment Instructions (Amharic)
                    <textarea
                      className="bf-input"
                      rows="3"
                      value={payDraft.cbe?.instructionsAm || ''}
                      onChange={e => setPayDraft(p => ({
                        ...p,
                        cbe: { ...p.cbe, instructionsAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>
              </div>

              <button className="aoc-btn-approve" style={{marginTop:'1.5rem'}} onClick={savePaymentAccounts}>
                💾 Save Bank Accounts
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ── FULLSCREEN RECEIPT MODAL LIGHTBOX ── */}
      {receiptModalImg && (
        <div className="admin-receipt-lightbox" role="dialog" onClick={() => setReceiptModalImg(null)}>
          <div className="arl-content" onClick={e => e.stopPropagation()}>
            <div className="arl-topbar">
              <h4>Client Payment Receipt Screenshot</h4>
              <button className="bf-close-btn" onClick={() => setReceiptModalImg(null)}><X size={20}/></button>
            </div>
            <div className="arl-body">
              <img src={receiptModalImg} alt="Receipt Full Proof" className="arl-img"/>
            </div>
            <div className="arl-footer">
              <a href={receiptModalImg} download="payment-receipt.png" className="apt-btn-secondary" target="_blank" rel="noreferrer">
                Open in New Tab / Download
              </a>
              <button className="aoc-btn-reject" onClick={() => setReceiptModalImg(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── BOOKING PANEL (SIMPLE STUB — kept for reference) ──────────────────── */
function _OldBookingPanel({ selectedPackage, onClose, lang }) {
  const [submitted, setSubmitted]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [form, setForm]                 = useState({ name: '', date: '', phone: '', note: '' });
  const [createdOrder, setCreatedOrder] = useState(null);
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

    let orderId = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
    const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

    try {
      // Register order into CRM & Unified Admin Message Hub
      const orderRes = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name,
          phone: form.phone,
          packageName: pkgName,
          basePrice: parseInt((selectedPackage?.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 10000,
          totalPrice: parseInt((selectedPackage?.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 10000,
          eventDate: form.date,
          notes: form.note,
          category: selectedPackage?.category || 'custom'
        })
      });
      const orderData = await orderRes.json();
      if (orderData?.order?.id) {
        orderId = orderData.order.id;
      }
    } catch (err) {
      console.error(err);
    }

    const newOrderObj = {
      id: orderId,
      name: form.name,
      phone: form.phone,
      date: form.date,
      note: form.note,
      pkgName,
      price: selectedPackage?.price
    };
    setCreatedOrder(newOrderObj);
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
            <div className="success-mark"><Check size={36} /></div>
            <p className="eyebrow">{lang === 'am' ? 'የቀጠሮ መረጃዎ ተመዝግቧል!' : lang === 'om' ? 'Galmeen Isini Milkaa\'eera!' : 'Booking Info Registered!'}</p>
            <h2>{lang === 'am' ? 'ቀጠሮዎ በስኬት ተመዝግቧል!' : lang === 'om' ? 'Galmeen Isini Milkaa\'eera!' : 'Booking Request Received!'}</h2>

            <div className="booking-success-summary-box">
              <div className="bss-row">
                <span className="bss-label">👤 {lang === 'am' ? 'ሙሉ ስም:' : 'Full Name:'}</span>
                <strong className="bss-val">{createdOrder?.name || form.name}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label">📞 {lang === 'am' ? 'ስልክ ቁጥር:' : 'Phone:'}</span>
                <strong className="bss-val">{createdOrder?.phone || form.phone}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label">📅 {lang === 'am' ? 'የቀጠሮ ቀን:' : 'Event Date:'}</span>
                <strong className="bss-val">{createdOrder?.date || form.date}</strong>
              </div>
              {form.note && (
                <div className="bss-row">
                  <span className="bss-label">📝 {lang === 'am' ? 'ማስታወሻ:' : 'Note:'}</span>
                  <span className="bss-val">{form.note}</span>
                </div>
              )}
              <div className="bss-row">
                <span className="bss-label">📦 {lang === 'am' ? 'የመረጡት ፓኬጅ:' : 'Package:'}</span>
                <strong className="bss-val">{pkgName}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label">💰 {lang === 'am' ? 'ይፋዊ ዋጋ:' : 'Price:'}</span>
                <strong className="bss-val bss-price">{selectedPackage?.price} ETB</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label">🔖 {lang === 'am' ? 'የትእዛዝ መለያ:' : 'Order ID:'}</span>
                <code className="bss-id">{createdOrder?.id}</code>
              </div>
            </div>

            <p className="booking-auto-redirect-note">
              {lang === 'am' ? 'የትእዛዝ ዝርዝርዎ በስርዓቱ ተመዝግቧል። የHOPE ቡድን አባላት በአጭር ጊዜ ውስጥ በስልክ ደውለው ዝርዝሮችን ያረጋግጣሉ።' : lang === 'om' ? 'Bal\'inni beellama keessanii galmaa\'eera. Gareen HOPE yeroo gabaabaa keessatti isiniif bilbila.' : 'Your booking details have been registered. The HOPE team will call you shortly to confirm your schedule and details.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem', width: '100%', maxWidth: '340px' }}>
              <a
                className="primary-button"
                href={`tel:${PHONE_LINK}`}
                style={{ justifyContent: 'center', textDecoration: 'none' }}
              >
                <Phone size={17} />
                <span>{lang === 'am' ? 'አሁኑኑ ይደውሉልን (09 10 52 69 62)' : lang === 'om' ? 'Amma Nuuf Bilbilaa' : 'Call Us Directly'}</span>
              </a>
              <button
                type="button"
                className="ghost-button"
                onClick={onClose}
                style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#f5f5f5', cursor: 'pointer' }}
              >
                {lang === 'am' ? 'ወደ ዋናው ገጽ ይመለሱ' : lang === 'om' ? 'Fuula Duraatti Deebi\'aa' : 'Return to Website'}
              </button>
            </div>
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
                {submitting ? (lang === 'am' ? 'በመመዝገብ ላይ...' : lang === 'om' ? 'Ergamaa Jira...' : 'Submitting Booking...') : t.bookingSubmit} <CalendarDays size={17} />
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

  const handlePackageClick = (pkg) => {
    openBooking(pkg);
  };

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

      {/* ── Direct Booking Banner ── */}
      <div className="pricing-telegram-bot-banner">
        <div className="ptb-left">
          <span className="ptb-badge">✨ {lang === 'am' ? 'ይፋዊ የቀን ማስያዣ' : lang === 'om' ? 'Galmee Guyyaa' : 'Official Booking'}</span>
          <h3>{lang === 'am' ? 'የመረጡትን ፓኬጅ በቀላሉ ያስይዙ፤ ቡድናችን ወዲያውኑ ያረጋግጥልዎታል!' : lang === 'om' ? 'Paakeejii filadhaa guyyaa keessan amma qabadhaa!' : 'Select your package & book your date directly online!'}</h3>
          <p>{lang === 'am' ? 'የትኛውንም ፓኬጅ በመጫን የቀጠሮዎን መረጃ ያስገቡ፤ የሆፕ ባለሙያዎች ወዲያውኑ ደውለው ቀጠሮዎን ያረጋግጣሉ።' : lang === 'om' ? 'Paakeejii barbaaddan cuqaasuun beellama keessan guutaa; saffisaan isiniif bilbilla.' : 'Click on any package to customize deliverables and request your booking schedule directly.'}</p>
        </div>
        <button
          type="button"
          onClick={() => openBooking(currentCards[0])}
          className="ptb-direct-btn"
        >
          <CalendarDays size={16} />
          <span>{lang === 'am' ? 'ቀንዎን ያስይዙ' : lang === 'om' ? 'Guyyaa Qabadhaa' : 'Book Now'}</span>
        </button>
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
              onClick={() => handlePackageClick(pkg)}
              style={{ cursor: 'pointer' }}
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

              {/* Action Button: Opens Booking modal */}
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
                  onClick={() => handlePackageClick(pkg)}
                >
                  <CalendarDays size={15} />
                  <span>{t.pkgCta}</span>
                  <ArrowRight size={16} />
                </button>
                <a
                  href={`https://t.me/HoopStudioSystemBot?start=inquire_${pkg.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-v2-tg-inquire"
                  onClick={(e) => e.stopPropagation()}
                  title="Ask directly on Telegram Bot"
                >
                  <Send size={13} />
                  <span>{lang === 'am' ? 'በቴሌግራም ቦት ይጠይቁ' : 'Ask on Telegram Bot'}</span>
                </a>
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
          onClick={() => openBooking({ id: 'custom', titleAm: 'ብጁ ፓኬጅ', titleEn: 'Custom Package', titleOm: 'Paakeejii Addaa' })}
        >
          <CalendarDays size={15} />
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

/* ── AGREEMENT SIGNING PAGE (URL: ?sign=CAGR-xxx) ───────────────────────── */
function AgreementSigningPage({ signId, lang }) {
  const [agreement, setAgreement] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState(null);
  const [termsAccepted, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  useEffect(() => {
    fetch(`${apiBase}/api/agreements?custom_id=${signId}`)
      .then(r => r.json())
      .then(d => {
        if (d.agreement) { setAgreement(d.agreement); setOrder(d.order || null); }
        else setError('Agreement not found or link expired.');
        setLoading(false);
      })
      .catch(() => { setError('Failed to load agreement. Please check your link.'); setLoading(false); });
  }, [signId]);

  const handleSign = async () => {
    if (!signature) { setError('Please provide your digital signature above.'); return; }
    if (!termsAccepted) { setError('Please accept the terms to proceed.'); return; }
    setSubmitting(true);
    try {
      const price = agreement.price || 0;
      const deposit = Math.round(price * 0.5);
      const r = await fetch(`${apiBase}/api/agreements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sign',
          orderId: order?.id || agreement.orderId || 'CUSTOM',
          clientName: agreement.clientName || 'Client',
          signatureDataUrl: signature,
          termsAccepted: true,
          agreedPrice: price,
          depositAmount: deposit,
          customAgreementId: agreement.id,
          eventDate: order?.eventDate || new Date().toISOString().slice(0, 10),
        })
      });
      const d = await r.json();
      if (d.success) { setSubmitted(true); }
      else setError(d.error || 'Signing failed. Please try again.');
    } catch(e) { setError('Network error. Please try again.'); }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center',color:'#f5f5f5'}}>
      <div className="brc-spinner" style={{width:40,height:40,borderWidth:3}}/> &nbsp; Loading agreement...
    </div>
  );
  if (error && !agreement) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#ef4444',gap:16}}>
      <Shield size={48}/><h2>{error}</h2>
      <a href="/" style={{color:'#d4af37'}}>← Return to HOPE Studio</a>
    </div>
  );
  if (submitted) return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#f5f5f5',gap:20,padding:24}}>
      <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#22c55e,#16a34a)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Check size={36} color="#fff"/>
      </div>
      <h2 style={{color:'#22c55e',fontSize:28,fontWeight:800}}>Agreement Signed!</h2>
      <p style={{color:'#9090a8',maxWidth:400,textAlign:'center'}}>Your HOPE Studio service agreement has been digitally signed and recorded. Our team will contact you shortly.</p>
      <div style={{background:'#111118',border:'1px solid #2a2a40',borderRadius:12,padding:20,maxWidth:360,width:'100%'}}>
        <p><strong>Package:</strong> {agreement?.packageTitle}</p>
        <p><strong>Total:</strong> {(agreement?.price||0).toLocaleString()} ETB</p>
        <p><strong>50% Deposit:</strong> {Math.round((agreement?.price||0)*0.5).toLocaleString()} ETB</p>
      </div>
      <a href={`tel:+251910526962`} style={{color:'#d4af37',textDecoration:'none',fontSize:18,fontWeight:700}}>📞 09 10 52 69 62</a>
      <a href="/" style={{color:'#9090a8',fontSize:14}}>← Return to HOPE Studio</a>
    </div>
  );

  const price = agreement?.price || order?.totalPrice || 0;
  const deposit = agreement?.depositAmount || Math.round(price * 0.5);
  const remaining = price - deposit;

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#f5f5f5',fontFamily:'Inter,sans-serif',padding:'24px 16px 80px'}}>
      <div style={{maxWidth:840,margin:'0 auto'}}>
        <DocumentStyleAgreement
          agreement={agreement}
          clientName={agreement?.clientName || order?.clientName || 'Client'}
          phone={agreement?.phone || order?.phone || ''}
          eventDate={order?.eventDate || agreement?.eventDate || ''}
          location={order?.location || 'Addis Ababa'}
          totalPrice={price}
          depositAmount={deposit}
          remainingBalance={remaining}
          signature={signature}
          onSign={setSignature}
          onClearSignature={() => setSignature(null)}
          lang={lang}
          orderId={order?.id || agreement?.id}
        />

        <div className="doc-no-print" style={{marginTop: 20, background:'#111118', border:'1px solid #2a2a40', borderRadius: 12, padding: 20}}>
          <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer'}}>
            <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} style={{marginTop:3}}/>
            <span style={{color:'#cbd5e1',fontSize:13,lineHeight:1.5}}>
              {lang === 'am'
                ? 'ከላይ በሰነዱ የተዘረዘሩትን ሁሉ አንብቤ ተቀብያለሁ። የ 50% ቅድሚያ ክፍያ ሁኔታን አረጋግጣለሁ።'
                : 'I have reviewed and agree to all terms in this document. I accept the 50% advance deposit requirement.'}
            </span>
          </label>

          {error && <p style={{color:'#ef4444',fontSize:13,marginTop:12}}>{error}</p>}

          <button
            onClick={handleSign}
            disabled={submitting || !signature || !termsAccepted}
            style={{
              width:'100%',marginTop:16,padding:'14px 24px',background:'linear-gradient(135deg,#d4af37,#b8860b)',
              color:'#0a0a0f',fontWeight:800,fontSize:15,border:'none',borderRadius:8,cursor:'pointer',
              opacity: (submitting||!signature||!termsAccepted) ? 0.5 : 1,
              boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
            }}
          >
            {submitting ? 'Submitting...' : lang === 'am' ? '📝 ስምምነቱን በዲጂታል ፊርማ አጽድቅ (Accept & Sign)' : '📝 Accept & Sign Agreement'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── APP ────────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded]   = useState(false);
  const [lang, setLang]       = useState('am');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [showAdmin, setShowAdmin] = useState(() => {
    return typeof window !== 'undefined' && (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin'));
  });
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeLocTab, setActiveLocTab] = useState(0);

  // URL-based custom agreement signing (?sign=CAGR-xxx)
  const signId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('sign')
    : null;

  const t = T[lang];

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setShowAdmin(true);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (!loaded || bookingPkg || showAdmin) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loaded, bookingPkg, showAdmin]);

  const openBooking = (pkg = null) => {
    setBookingPkg(pkg || PACKAGES_BY_CATEGORY.wedding[0]);
    setMenuOpen(false);
  };
  const nav = (t) => { scrollToSection(t); setMenuOpen(false); };
  const toggleLang = () => setLang(l => l === 'am' ? 'en' : l === 'en' ? 'om' : 'am');

  const locImgs = [galleryImages[1].src, galleryImages[3].src, galleryImages[5].src];

  if (signId) {
    return <AgreementSigningPage signId={signId} lang={lang} />;
  }

  if (showAdmin) {
    return (
      <AdminControlPanel
        onClose={() => {
          setShowAdmin(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        lang={lang}
      />
    );
  }

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
          <a className="whatsapp-link" href={`tel:${PHONE_LINK}`} aria-label="Call HOPE">
            <Phone size={17} />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <p className="copyright">© {new Date().getFullYear()} HOPE Photo &amp; Velo <button className="admin-secret-link" onClick={() => setShowAdmin(true)} aria-label="Admin">·</button></p>
        </footer>

        {bookingPkg && (
          <BookingFlowModal
            selectedPackage={bookingPkg}
            onClose={() => setBookingPkg(null)}
            lang={lang}
          />
        )}
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
