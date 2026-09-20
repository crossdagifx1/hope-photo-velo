import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Camera, Check,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Copy, CreditCard, Edit2, ExternalLink,
  Eye, Film, Globe, Heart, Layers, Lock, LogOut, MapPin, Menu, MessageCircle, Moon, Package, Pencil,
  Phone, Play, Plus, Printer, Quote, RefreshCw, Search, Send, Shield, Sliders, Sparkles, Star, Sun, Trash2, Upload, Video, X, FileText, Download,
  User, Building2, Hash, Clock, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, Award, Volume2
} from 'lucide-react';
import './styles.css';
import { DEFAULT_AGREEMENTS_9, resolveAgreementForPackage, DEFAULT_PACKAGES, DEFAULT_CONTENT } from './agreementsData.js';
import DocumentStyleAgreement from './DocumentStyleAgreement.jsx';
import VeloBookingFlow from './VeloBookingFlow.jsx';
import OrderStatusPage from './OrderStatusPage.jsx';

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
    heroProof: ['የ 1+ ዓመት', 'የውብ ትዝታዎች', 'ማህደር እና ታማኝነት።'],
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
    craftStats: [['1+', 'ዓመት ልምድ'], ['150+', 'የተቀረፁ የሰርግ በዓላት'], ['4K/8K', 'የሲኒማ ጥራት ቪዲዮ'], ['100%', 'የደንበኞች እርካታ']],
    craftItems: [
      { title: '4K & 8K Cinema Cameras', desc: 'በቅርብ የቴክኖሎጂ ደረጃ የተሰሩ ፕሮፌሽናል የሲኒማ ካሜራዎችና የሌንስ ስብስቦች።' },
      { title: 'Drone & Aerial Lighting', desc: 'የሰርግዎን ግርማ ሞገስ በከፍታ የሚያሳዩ ድሮኖች እና ለቪዲዮው ውበት የሚሆኑ የአየር ላይ መብራቶች።' },
      { title: 'Color Grading Master', desc: 'ለእያንዳንዱ ምስል እና ቪዲዮ ሞቅ ያለ፣ ተፈጥሯዊ እና የፊልም እይታ የሚሰጥ የከለር ኤዲቲንግ።' },
      { title: 'Fine-Art Laminated Albums', desc: 'ከውጭ ሀገር የሚመጡ ዘላቂ፣ በውሃና አቧራ የማይበላሹ በእጅ የተሰሩ ላሚኔት አልበሞች።' },
    ],
    locationsEyebrow: 'የፎቶ ቦታዎች እና ስቱዲዮዎች',
    locationsH2a: 'ለቀረጻዎ',
    locationsH2b: 'የሚስማማ ውብ ስፍራ።',
    locationsTabs: ['ጋርደን እና ሜዳ', 'የውስጥ ስቱዲዮ', 'የምሽት እና ልዩ ቀረጻ'],
    locationsTitles: ['የተፈጥሮ ብርሃን ጋርደን እና የውጪ ፎቶዎች', 'ዘመናዊ የስቱዲዮ መብራቶች እና የባህል አልበሞች', 'የምሽት ውበት እና ሲኒማቲክ ኤዲቶሪያል'],
    locationsDescs: ['ጸጥታና አረንጓዴ በተሞላ የተፈጥሮ ስፍራ የሚነሱ የፍቅር አፍታዎች።', 'ሙሉ የቤት ውስጥ ፎቶግራፊ፣ ልዩ መብራቶች፣ ዳራዎች እና የሜካፕ ማስተካከያ ያካተተ።', 'በምሽት መብራቶች እና በፊልም ከለር ግሬዲንግ የተሰሩ ልዩ የሰርግ አፍታዎች።'],
    locationsCta: 'ይህንን ስፍራ ይምረጡ',
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
      { quote: 'የቪዲዮው ኤዲቲንግ እና የከለር ምርጫው እውነተኛ የፊልም ጥራት አለው። በየጊዜው ደግመን ስናየው ያንኑ የሰርጋችንን ቀን ደስታ ይሰጠናል።', name: 'ዳዊት እና ሩት', event: 'የሰርግ እና ጋርደን ቀረጻ' },
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
    heroProof: ['1+ Years', 'of Beautiful Memories', 'Preserved with Care.'],
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
    craftStats: [['1+', 'Years Experience'], ['150+', 'Weddings Captured'], ['4K/8K', 'Cinema Quality Video'], ['100%', 'Client Satisfaction']],
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
      { quote: 'The video editing and color grading has true cinematic quality. Every time we rewatch it, it brings back the joy of our wedding day.', name: 'Dawit & Ruth', event: 'Wedding & Garden Shoot' },
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
    heroProof: ['Waggaa 1+', 'Yaadannoo Bareedaa', 'Kunuunsaan Qabame.'],
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
    craftStats: [['1+', 'Waggaa Muuxannoo'], ['150+', 'Cidha Waraabame'], ['4K/8K', 'Qulqullina Viidiyoo Sinimaa'], ['100%', 'Gammachuu Maamilaa']],
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
      { quote: 'Gulaalli viidiyoo fi filannoon halluu qulqullina fiilmii dhugaa qaba. Yeroo hunda irra deebinee yoo ilaallu gammachuu guyyaa cidha keenyaa nuuf kenne.', name: 'Daawit & Ruut', event: 'Cidha & Suuraa Maasaa' },
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
          const isSelected = value === dateStr;
          const isToday = cellDate.getTime() === today.getTime();
          const isDisabled = isPast || isBlackout;
          const cls = [
            'cal-cell',
            isSelected ? 'cal-selected' : '',
            isToday && !isSelected ? 'cal-today' : '',
            isDisabled ? 'cal-disabled' : 'cal-available',
            isBlackout ? 'cal-blackout' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={dateStr}
              type="button"
              className={cls}
              disabled={isDisabled}
              title={isBlackout ? 'Studio Unavailable' : ''}
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
function BookingFlowModal({ selectedPackage, onClose, lang, initialStep = 1 }) {
  const [step, setStep]               = useState(initialStep); // 1=details 2=agreement 3=payment 4=confirm 5=discussion
  useEffect(() => {
    if (initialStep) setStep(initialStep);
  }, [initialStep]);
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

  // Step 1 → validate and move directly to Step 2 (Agreement & Signature)
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) { setError(lang === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ' : 'Please enter your full name'); return; }
    if (!form.phone?.trim()) { setError(lang === 'am' ? 'እባክዎ ስልክ ቁጥር ያስገቡ' : 'Please enter your phone number'); return; }
    if (!form.date) { setError(lang === 'am' ? 'እባክዎ ቀን ይምረጡ' : 'Please select a date'); return; }
    setError('');
    const matched = resolveAgreementForPackage(selectedPackage, defaultAgreements9);
    setSelectedAgrTemplate(matched);
    setStep(2);
  };

  // Direct Discussion on Telegram Bot (Inquiry option)
  const handleDiscussion = async () => {
    setSubmitting(true);
    let orderId = 'HOPE-' + Math.floor(1000 + Math.random() * 9000);
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name || 'Website Client', phone: form.phone || '', eventDate: form.date || '',
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

    const tgUrl = `https://t.me/HoopStudioSystemBot?start=discuss_${orderId}`;
    try {
      window.open(tgUrl, '_blank');
    } catch(e) {}
    setStep(5);
  };

  // Step 2 → validate signature & terms, then proceed to Step 3 (Payment)
  const handleContractNext = () => {
    if (!signature) { setError(lang === 'am' ? 'እባክዎ ዲጂታል ፊርማዎን ያኑሩ' : 'Please provide your digital signature above'); return; }
    if (!termsAccepted) { setError(lang === 'am' ? 'እባክዎ የውል ደንቦችን ይቀበሉ' : 'Please accept the agreement terms'); return; }
    setError('');
    setStep(3);
  };

  // Step 3 → Submit advance deposit & payment receipt
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payMethod) { setError(lang === 'am' ? 'እባክዎ የክፍያ ዘዴ ይምረጡ' : 'Please select a payment method'); return; }
    if (!receiptPreview) { setError(lang === 'am' ? 'የደረሰኝ ምስል ይጫኑ' : 'Please upload payment receipt screenshot'); return; }
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
    setStep(4);
    setSubmitting(false);
  };

  const toggleAddon = (addon) => {
    setAddons(prev => prev.find(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);
  };

  // ── Sleek Top Progress Bar matching user reference screenshots ──
  const renderStepIndicator = () => {
    if (step === 4 || step === 5) return null;
    const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;
    return (
      <div className="bf-stepper-wrap">
        <div className="bf-progress-track">
          <div className="bf-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="bf-steps-header">
          <span className="bf-step-count">
            {lang === 'am' ? `ደረጃ ${step} ከ 3` : `Step ${step} of 3`}
          </span>
          <span className="bf-category-badge">
            {selectedPackage?.category?.toUpperCase() || 'OFFICIAL PACKAGE'}
          </span>
        </div>
      </div>
    );
  };

  // ── STEP 1: Details & Date & Add-on Pills ──
  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="bf-step-body">
      <div className="bf-pkg-header">
        <div className="bf-pkg-badge">{selectedPackage?.badgeEn || 'Official Package'}</div>
        <h3 className="bf-pkg-name">{pkgName}</h3>
        <div className="bf-pkg-price">{totalPrice.toLocaleString()} <span>ETB</span></div>
      </div>

      {/* Ask on Telegram direct pill */}
      <div className="bf-tg-ask-pill-wrap">
        <button type="button" className="bf-tg-ask-pill" onClick={() => setStep(5)}>
          <MessageCircle size={15} />
          <span>{lang === 'am' ? 'ጥያቄ አለዎት? ከቦት ጋር ይወያዩ (Talk with Bot)' : lang === 'om' ? 'Gaaffii qabduu? Bootii waliin haasawaa' : 'Have a question? Talk with Telegram Bot'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {deliverables.length > 0 && (
        <div className="bf-deliverables">
          <p className="bf-deliv-label">{lang === 'am' ? 'የተካተቱ አገልግሎቶች:' : 'Included Deliverables:'}</p>
          <ul className="bf-deliv-list">
            {deliverables.map((d, i) => <li key={i}><Check size={11}/> {d}</li>)}
          </ul>
        </div>
      )}

      {/* Optional add-ons removed from step 1 for simplicity */}

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        <button type="submit" className="bf-primary-btn">
          <FileText size={16}/>
          <span>{lang === 'am' ? 'ቀጣይ — ወደ ውል እና ፊርማ (Sign Agreement)' : lang === 'om' ? 'Itti Fufaa — Gara Waliigalaa' : 'Continue to Agreement & Sign'}</span>
          <ArrowRight size={16}/>
        </button>
        <button
          type="button"
          className="bf-secondary-btn"
          onClick={() => setStep(5)}
          style={{ justifyContent: 'center', borderColor: '#bae6fd', color: '#0284c7', background: '#f0f9ff' }}
        >
          <MessageCircle size={15}/>
          <span>{lang === 'am' ? 'ወይም ከቦት ጋር ይወያዩ (Talk with Bot)' : lang === 'om' ? 'Yookiin Bootii Waliin Haasawaa' : 'Or Talk with Bot on Telegram'}</span>
        </button>
      </div>
    </form>
  );

  // ── STEP 2: Document-Style Legal Agreement + Digital Signature ──
  const activeAgreement = selectedAgrTemplate || resolveAgreementForPackage(selectedPackage, defaultAgreements9);

  const renderStep2 = () => (
    <div className="bf-step-body">
      <div className="bf-section-label">
        <FileText size={15}/>
        <span>{lang === 'am' ? 'ይፋዊ የስምምነት ሰነድ እና ዲጂታል ፊርማ' : 'Review Official Agreement & Digital Signature'}</span>
      </div>

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

      {/* Compensation / Payment Terms Box matching Screenshot 5 */}
      <div className="bf-comp-box doc-no-print">
        <p className="bf-comp-title">{lang === 'am' ? 'የክፍያ ሁኔታ (Payment Terms)' : 'How is compensation to be paid'}</p>
        <div className="bf-comp-options">
          <div className="bf-comp-option active">
            <div className="bf-comp-radio"><Check size={12}/></div>
            <div>
              <strong>{lang === 'am' ? '50% ቅድመ ክፍያ + 50% በርክክብ ወቅት' : '50% upfront + 50% after delivery'}</strong>
              <small>{lang === 'am' ? 'ይፋዊ የስቱዲዮ ደንብ — ቀንዎን ወዲያውኑ ያስይዛል' : 'Official Studio Standard — Locks your shooting date'}</small>
            </div>
          </div>
        </div>
      </div>

      <label className="bf-terms-check doc-no-print" style={{ marginTop: '8px' }}>
        <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} />
        <span>{lang === 'am' ? 'ሁሉንም የውል አንቀጾች እና የ 50% ቅድመ ክፍያ ሁኔታ ተቀብያለሁ' : 'I accept all agreement terms, conditions, and the 50% advance deposit schedule'}</span>
      </label>

      {error && <p className="bf-error doc-no-print">{error}</p>}
      <div className="bf-btn-row doc-no-print">
        <button type="button" className="bf-back-btn" onClick={() => setStep(1)}>
          <ChevronLeft size={15}/> {lang === 'am' ? 'ተመለስ' : 'Back'}
        </button>
        <button type="button" className="bf-primary-btn" onClick={handleContractNext}>
          <span>{lang === 'am' ? 'ወደ ክፍያ ቀጥሉ' : 'Proceed to Payment'}</span>
          <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );

  // ── STEP 3: Advance Deposit & Receipt Screenshot Upload ──
  const telebirr = payAccounts?.telebirr;
  const cbe = payAccounts?.cbe;

  const renderStep3 = () => (
    <form onSubmit={handlePaymentSubmit} className="bf-step-body">
      <div className="bf-pay-header">
        <CreditCard size={22}/>
        <div>
          <h3>{lang === 'am' ? 'ቅድመ ክፍያ ይፈጽሙ' : 'Complete Advance Deposit'}</h3>
          <p>{lang === 'am' ? `50% ቅድመ ክፍያ: ${deposit.toLocaleString()} ETB` : `50% Deposit: ${deposit.toLocaleString()} ETB`}</p>
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
        <p className="bf-deliv-label"><Upload size={13}/> {lang === 'am' ? 'የደረሰኝ ምስል ይጫኑ (Screenshot)' : 'Upload Payment Receipt Screenshot'}</p>
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
        <button type="button" className="bf-back-btn" onClick={() => setStep(2)}>
          <ChevronLeft size={15}/> {lang === 'am' ? 'ተመለስ' : 'Back'}
        </button>
        <button type="submit" className="bf-primary-btn" disabled={submitting}>
          {submitting
            ? (lang === 'am' ? 'በማስገባት ላይ...' : 'Submitting...')
            : (lang === 'am' ? 'ክፍያ ያስገቡ' : 'Submit Payment Proof')}
          <Check size={16}/>
        </button>
      </div>
    </form>
  );

  // ── Canvas Helper ──
  function cRR(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x+r, y); c.lineTo(x+w-r, y); c.quadraticCurveTo(x+w,y,x+w,y+r);
    c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
    c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y);
    c.closePath();
  }

  // Load image helper
  const loadImg = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  // ── High-Resolution Pure White Receipt Voucher Download ──
  const [receiptDownloading, setReceiptDownloading] = useState(false);

  const downloadReceipt = async () => {
    setReceiptDownloading(true);
    try {
      const W = 720, H = 960;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const c = cv.getContext('2d');

      // Pure White Background
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, W, H);

      // Outer light border
      c.strokeStyle = '#e2e8f0'; c.lineWidth = 2;
      cRR(c, 16, 16, W-32, H-32, 24); c.stroke();

      // Header Band in Luxury Brand Burgundy (#bd2637)
      c.fillStyle = '#bd2637';
      c.fillRect(16, 16, W-32, 120);

      // Brand Name
      c.fillStyle = '#ffffff'; c.font = 'bold 36px Arial,sans-serif';
      c.fillText('HOPE', 48, 68);
      c.fillStyle = '#fecdd3'; c.font = 'bold 13px Arial,sans-serif';
      c.fillText('PHOTO & VELO STUDIO', 48, 92);
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.font = '500 11px Arial,sans-serif';
      c.fillText('ADDIS ABABA  \u00B7  EST. 2009', 48, 114);

      // Status Pill on top-right
      c.fillStyle = '#ffffff';
      cRR(c, W-240, 48, 192, 34, 17); c.fill();
      c.fillStyle = '#16a34a'; c.font = 'bold 11px Arial,sans-serif';
      c.textAlign = 'center';
      c.fillText('DATE RESERVED', W-144, 70);
      c.textAlign = 'left';

      // Eyebrow
      c.fillStyle = '#bd2637'; c.font = 'bold 12px Arial,sans-serif';
      c.fillText('OFFICIAL BOOKING RECEIPT VOUCHER', 48, 175);

      // Divider line
      c.strokeStyle = '#e2e8f0'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(48, 188); c.lineTo(W-48, 188); c.stroke();

      // Detail Rows (Zero Emojis, Clean Professional Alignment)
      const rows = [
        ['Client Name', form.name || '—', false],
        ['Phone Number', form.phone || '—', false],
        ['Event Date', form.date || '—', false],
        ['Service Package', (createdOrder?.packageName || pkgName || '—'), false],
        ['Deposit Paid', `${deposit.toLocaleString()} ETB`, 'green'],
        ['Balance Due', `${remaining.toLocaleString()} ETB`, false],
        ['Payment Method', payMethod === 'telebirr' ? 'Telebirr' : 'CBE (Commercial Bank)', false],
        ['Reference Number', createdOrder?.id || '—', 'burgundy'],
        ['Issued Date', new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}), false],
      ];
      let ry = 216;
      rows.forEach(([label, val, accent], i) => {
        if (i % 2 === 0) {
          c.fillStyle = '#f8fafc'; c.fillRect(48, ry-14, W-96, 28);
        }
        c.fillStyle = '#64748b'; c.font = 'bold 11px Arial,sans-serif';
        c.fillText(label.toUpperCase(), 62, ry+5);
        c.font = accent === 'burgundy' ? 'bold 14px Arial,sans-serif' : 'bold 13px Arial,sans-serif';
        c.fillStyle = accent === 'green' ? '#16a34a' : accent === 'burgundy' ? '#bd2637' : '#0f172a';
        c.textAlign = 'right';
        c.fillText(val, W-62, ry+5);
        c.textAlign = 'left';
        ry += 32;
      });

      // QR Code Box
      const qrY = ry + 20;
      const QS = 150;
      const qrX = (W - QS) / 2;
      const qrData = encodeURIComponent(`HOPE|${createdOrder?.id||'REF'}|${form.name}|${form.date}`);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0f172a&bgcolor=ffffff&ecc=M&data=${qrData}`;

      c.fillStyle = '#f8fafc';
      cRR(c, qrX-16, qrY-12, QS+32, QS+48, 16); c.fill();
      c.strokeStyle = '#e2e8f0'; c.lineWidth = 1;
      cRR(c, qrX-16, qrY-12, QS+32, QS+48, 16); c.stroke();

      try {
        const qrImg = await loadImg(qrUrl);
        c.drawImage(qrImg, qrX, qrY, QS, QS);
      } catch {
        c.fillStyle = '#ffffff'; c.fillRect(qrX, qrY, QS, QS);
        c.fillStyle = '#64748b'; c.font = 'bold 12px Arial,sans-serif';
        c.textAlign = 'center'; c.fillText('OFFICIAL QR', W/2, qrY+QS/2); c.textAlign = 'left';
      }

      c.fillStyle = '#64748b'; c.font = 'bold 11px Arial,sans-serif';
      c.textAlign = 'center'; c.fillText('Scan to verify booking', W/2, qrY+QS+22); c.textAlign = 'left';

      // Tear line
      const tearY = qrY + QS + 52;
      c.setLineDash([5, 6]); c.strokeStyle = '#cbd5e1'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(48, tearY); c.lineTo(W-48, tearY); c.stroke(); c.setLineDash([]);
      [[16, tearY],[W-16, tearY]].forEach(([cx,cy]) => {
        c.fillStyle = '#ffffff'; c.beginPath(); c.arc(cx,cy,12,0,Math.PI*2); c.fill();
        c.strokeStyle = '#e2e8f0'; c.lineWidth = 1.5; c.beginPath(); c.arc(cx,cy,12,0,Math.PI*2); c.stroke();
      });

      // Footer
      const fy = tearY + 34;
      c.fillStyle = '#64748b'; c.font = '500 11px Arial,sans-serif'; c.textAlign = 'center';
      c.fillText('Date held 24 hrs pending verification  \u00B7  +251 910 52 69 62', W/2, fy);
      c.fillStyle = '#bd2637'; c.font = 'bold 11px Arial,sans-serif';
      c.fillText('hope-photo-velo.vercel.app', W/2, fy+20);
      c.textAlign = 'left';

      // Download
      const a = document.createElement('a');
      a.download = `HOPE-receipt-${createdOrder?.id||'booking'}.png`;
      a.href = cv.toDataURL('image/png');
      a.click();
    } catch(err) { console.error('Receipt download failed:', err); }
    setReceiptDownloading(false);
  };

  // ── STEP 4: Success & Confirmation View matching Screenshots 2 & 3 ──
  const renderStep4 = () => {
    return (
      <div className="bf-step-body" style={{ alignItems: 'center', textAlign: 'center' }}>
        {/* Scalloped Success checkmark badge (Screenshot 2) */}
        <div className="bf-success-scallop-wrap">
          <div className="bf-success-scallop">
            <Check size={36} strokeWidth={3} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>
            {lang === 'am' ? 'ቀጠሮዎ በተሳካ ሁኔታ ተመዝግቧል!' : 'Booking Confirmed!'}
          </h3>
          <p className="bf-confirm-sub">
            {lang === 'am'
              ? 'የመረጡት ቀን በጊዜያዊነት ተይዟል። የስቱዲዮው ቡድን በአጭር ጊዜ ውስጥ ያረጋግጥልዎታል።'
              : 'Your booking has been received and your date is reserved pending verification.'}
          </p>
        </div>

        {/* Order Details Card (Screenshot 3 style) */}
        <div className="bf-order-summary-card">
          <div className="bf-order-summary-header">
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
              {lang === 'am' ? 'የትእዛዝ ዝርዝር' : 'Order Details'}
            </span>
            <span className="bf-summary-badge">
              <Check size={11} style={{ display: 'inline', marginRight: 3 }} />
              {lang === 'am' ? 'ተመዝግቧል' : 'Registered'}
            </span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><Package size={13} /> {lang === 'am' ? 'ፓኬጅ' : 'Package'}</span>
            <span className="bf-summary-val">{createdOrder?.packageName || pkgName}</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><User size={13} /> {lang === 'am' ? 'ደንበኛ' : 'Client'}</span>
            <span className="bf-summary-val">{form.name}</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><Phone size={13} /> {lang === 'am' ? 'ስልክ' : 'Phone'}</span>
            <span className="bf-summary-val">{form.phone}</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><CalendarDays size={13} /> {lang === 'am' ? 'የቀን ምርጫ' : 'Event Date'}</span>
            <span className="bf-summary-val">{form.date}</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><CreditCard size={13} /> {lang === 'am' ? 'ቅድመ ክፍያ' : 'Deposit Paid'}</span>
            <span className="bf-summary-val highlight">{deposit.toLocaleString()} ETB</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><Clock size={13} /> {lang === 'am' ? 'ቀሪ ክፍያ' : 'Balance Due'}</span>
            <span className="bf-summary-val">{remaining.toLocaleString()} ETB</span>
          </div>

          <div className="bf-summary-item">
            <span className="bf-summary-lbl"><Hash size={13} /> {lang === 'am' ? 'ማጣቀሻ' : 'Reference'}</span>
            <code className="bf-summary-val ref-code">{createdOrder?.id}</code>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '440px', marginTop: '10px' }}>
          <button
            type="button"
            className="bf-primary-btn"
            onClick={downloadReceipt}
            disabled={receiptDownloading}
          >
            <Download size={16} />
            <span>{receiptDownloading ? (lang === 'am' ? 'በማዘጋጀት ላይ...' : 'Preparing receipt...') : (lang === 'am' ? 'ደረሰኝ አውርድ (PNG Voucher)' : 'Download Receipt Voucher (PNG)')}</span>
          </button>

          <a
            className="bf-secondary-btn"
            href={`https://t.me/HoopStudioSystemBot?start=order_${createdOrder?.id || 'new'}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Send size={15} />
            <span>{lang === 'am' ? 'በቴሌግራም ቦት ዝርዝሩን ይመልከቱ' : 'View in Telegram Bot'}</span>
          </a>

          <button type="button" className="bf-secondary-btn" onClick={onClose} style={{ background: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}>
            <span>{lang === 'am' ? 'ተጠናቋል (Nice one!)' : 'Nice one!'}</span>
          </button>
        </div>
      </div>
    );
  };

  // ── STEP 5: Telegram Bot Inquiry Screen ──
  const renderStep5 = () => {
    if (createdOrder) {
      return (
        <div className="bf-step-body bf-confirm">
          <div className="bf-confirm-icon discuss"><MessageCircle size={38}/></div>
          <h3>{lang === 'am' ? 'ጥያቄዎ ተመዝግቧል!' : 'Inquiry Registered!'}</h3>
          <p className="bf-confirm-sub">
            {lang === 'am'
              ? 'ጥያቄዎ ለስቱዲዮ አስተዳዳሪ ደርሷል። ከታች ያለውን ቁልፍ በመጫን በቴሌግራም ቦት በቀጥታ መወያየት ይችላሉ።'
              : 'Your inquiry has been logged with the studio director. Chat directly on Telegram below.'}
          </p>
          <div className="bf-confirm-detail-box">
            {form.name && <div className="bf-confirm-row"><span className="icon"><User size={14}/></span><strong>{form.name}</strong></div>}
            {form.phone && <div className="bf-confirm-row"><span className="icon"><Phone size={14}/></span><strong>{form.phone}</strong></div>}
            {form.date && <div className="bf-confirm-row"><span className="icon"><CalendarDays size={14}/></span><strong>{form.date}</strong></div>}
            <div className="bf-confirm-row"><span className="icon"><Package size={14}/></span><strong>{pkgName}</strong></div>
            <div className="bf-confirm-row"><span className="icon"><Hash size={14}/></span><code>{createdOrder?.id}</code></div>
          </div>

          <a
            className="bf-primary-btn bf-tg-btn"
            href={`https://t.me/HoopStudioSystemBot?start=discuss_${createdOrder?.id || 'new'}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{textDecoration:'none',justifyContent:'center',marginBottom:'10px'}}
          >
            <Send size={18}/> <span>{lang === 'am' ? 'በቴሌግራም ቦት በቀጥታ ይክፈቱ' : 'Open in Telegram Bot Directly'}</span>
          </a>

          <button
            type="button"
            className="bf-secondary-btn"
            onClick={() => setStep(1)}
            style={{ justifyContent: 'center', marginBottom: '8px', borderColor: '#bd2637', color: '#bd2637' }}
          >
            <FileText size={15}/> <span>{lang === 'am' ? 'ወደ ይፋዊ የውል ፊርማ ይቀይሩ (Book with Agreement)' : 'Switch to Book with Agreement'}</span>
          </button>

          <a className="bf-back-btn" href={`tel:${PHONE_LINK}`} style={{textDecoration:'none',justifyContent:'center',marginBottom:'8px'}}>
            <Phone size={15}/> <span>{lang === 'am' ? 'በስልክ ይደውሉ: 09 10 52 69 62' : 'Call Us: 09 10 52 69 62'}</span>
          </a>

          <button type="button" className="bf-back-btn" onClick={onClose}>
            {lang === 'am' ? 'ወደ ዋናው ገጽ ተመለሱ' : 'Return to Website'}
          </button>
        </div>
      );
    }

    return (
      <div className="bf-step-body bf-confirm">
        <div className="bf-confirm-icon discuss" style={{ background: '#f0f9ff', color: '#0088cc' }}>
          <MessageCircle size={38}/>
        </div>
        <h3>{lang === 'am' ? 'ከስቱዲዮ ዳይሬክተር እና ቦት ጋር ይወያዩ' : lang === 'om' ? 'Bootii Waliin Haasawaa' : 'Talk with Studio Director & Bot'}</h3>
        <p className="bf-confirm-sub">
          {lang === 'am'
            ? `ስለ ${pkgName} ማንኛውንም ጥያቄ በቴሌግራም ቦት በቀጥታ መጠየቅ ይችላሉ። ወዲያውኑ ምላሽ እንሰጣለን።`
            : `Ask any questions regarding ${pkgName} directly on our official Telegram bot. We reply promptly.`}
        </p>

        {/* 1-Tap Open Telegram Bot */}
        <a
          className="bf-primary-btn bf-tg-btn"
          href={`https://t.me/HoopStudioSystemBot?start=inquire_${selectedPackage?.id || 'general'}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', justifyContent: 'center', marginBottom: '12px' }}
        >
          <Send size={18}/> <span>{lang === 'am' ? 'ቴሌግራም ቦት ይክፈቱ (@HoopStudioSystemBot)' : 'Open Telegram Bot (@HoopStudioSystemBot)'}</span>
        </a>

        {/* Quick callback question form */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', width: '100%', marginBottom: '12px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#334155', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={13} /> {lang === 'am' ? 'ወይም ጥያቄዎን እዚህ ይመዝግቡ:' : 'Or leave details for direct callback:'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              className="bf-input"
              name="name"
              value={form.name}
              onChange={update}
              placeholder={lang === 'am' ? 'ስምዎ (አማራጭ)' : 'Your Name (optional)'}
              style={{ fontSize: '13px', padding: '8px 10px' }}
            />
            <input
              className="bf-input"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={update}
              placeholder={lang === 'am' ? 'ስልክ ቁጥርዎ' : 'Phone Number'}
              style={{ fontSize: '13px', padding: '8px 10px' }}
            />
            <textarea
              className="bf-input"
              name="note"
              value={form.note}
              onChange={update}
              rows="2"
              placeholder={lang === 'am' ? 'ምን ማወቅ ይፈልጋሉ?' : 'What would you like to ask?'}
              style={{ fontSize: '13px', padding: '8px 10px' }}
            />
            <button
              type="button"
              className="bf-secondary-btn"
              onClick={handleDiscussion}
              disabled={submitting}
              style={{ justifyContent: 'center', borderColor: '#0088cc', color: '#0088cc', background: '#ffffff', fontWeight: 700 }}
            >
              <Send size={14}/>
              <span>{submitting ? (lang === 'am' ? 'በመላክ ላይ...' : 'Sending...') : (lang === 'am' ? 'ጥያቄውን መዝግብና ቴሌግራም ክፈት' : 'Register Question & Launch Bot')}</span>
            </button>
          </div>
        </div>

        {/* Switch to Official Agreement */}
        <button
          type="button"
          className="bf-secondary-btn"
          onClick={() => setStep(1)}
          style={{ justifyContent: 'center', marginBottom: '8px', borderColor: '#bd2637', color: '#bd2637' }}
        >
          <FileText size={15}/> <span>{lang === 'am' ? 'ቀን ማስያዝ ይፈልጋሉ? በውል ያስይዙ (Book with Agreement)' : 'Ready to book? Switch to Agreement'}</span>
        </button>

        <a className="bf-back-btn" href={`tel:${PHONE_LINK}`} style={{textDecoration:'none',justifyContent:'center',marginBottom:'8px'}}>
          <Phone size={15}/> <span>{lang === 'am' ? 'በስልክ ይደውሉ: 09 10 52 69 62' : 'Call Us: 09 10 52 69 62'}</span>
        </a>

        <button type="button" className="bf-back-btn" onClick={onClose}>
          {lang === 'am' ? 'ወደ ዋናው ገጽ ተመለሱ' : 'Return to Website'}
        </button>
      </div>
    );
  };

  return (
    <div className="bf-overlay" role="dialog" aria-modal="true" aria-labelledby="bf-title">
      <button className="bf-backdrop" aria-label="Close" onClick={onClose}/>
      <section className="bf-panel">
        <div className="bf-panel-header">
          <div style={{ width: '100%' }}>
            <div className="bf-grab-bar" />
            <p className="bf-eyebrow">{lang === 'am' ? 'ይፋዊ የቀን ማስያዣ' : 'Book Your Date'}</p>
            <h2 id="bf-title" className="bf-title">{pkgName}</h2>
          </div>
          <button className="bf-close-btn" aria-label="Close" onClick={onClose}><X size={20}/></button>
        </div>

        {/* ── Capsule Segmented Mode Switch (Matches Screenshot 4: Talk with Bot or Agreement) ── */}
        <div className="bf-segmented-mode-switch">
          <button
            type="button"
            className={`bf-seg-btn ${step !== 5 ? 'bf-seg-active' : ''}`}
            onClick={() => { if (step === 5) setStep(1); }}
          >
            <FileText size={15} />
            <span>{lang === 'am' ? 'በውል ያስይዙ (Agreement)' : lang === 'om' ? 'Waliigalaan Qabadhaa' : 'Book with Agreement'}</span>
          </button>
          <button
            type="button"
            className={`bf-seg-btn ${step === 5 ? 'bf-seg-active' : ''}`}
            onClick={() => setStep(5)}
          >
            <MessageCircle size={15} />
            <span>{lang === 'am' ? 'ከቦት ጋር ይወያዩ (Talk with Bot)' : lang === 'om' ? 'Bootii Waliin Haasawaa' : 'Talk with Bot'}</span>
          </button>
        </div>

        {renderStepIndicator()}
        <div className="bf-panel-scroll">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
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

  // Order Live Edit & Comments states
  const [editingOrder, setEditingOrder]                 = useState(null);
  const [savingOrder, setSavingOrder]                   = useState(false);
  const [orderCommentsModal, setOrderCommentsModal]     = useState(null);
  const [orderCommentsList, setOrderCommentsList]       = useState([]);
  const [loadingComments, setLoadingComments]           = useState(false);
  const [directorNoteText, setDirectorNoteText]         = useState('');
  const [sendingDirectorNote, setSendingDirectorNote]   = useState(false);

  // Chat state
  const [chats, setChats]                 = useState([]);
  const [activeChat, setActiveChat]       = useState(null);
  const [chatMessages, setChatMessages]   = useState([]);
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSending, setChatSending]     = useState(false);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const messagesEndRef                    = useRef(null);

  // Agreements state
  const [defaultAgr9, setDefaultAgr9]     = useState([]);
  const [customAgrs, setCustomAgrs]       = useState([]);
  const [signedAgrs, setSignedAgrs]       = useState([]);
  const [editingAgr, setEditingAgr]       = useState(null);
  const [sendingAgrLink, setSendingAgrLink] = useState(false);
  const [adminScanModal, setAdminScanModal] = useState(false);
  const [scannedInput, setScannedInput]     = useState('');
  const [scannedOrder, setScannedOrder]     = useState(null);
  const [savedLinkModal, setSavedLinkModal] = useState(null);

  // Edit states
  const [editPkg, setEditPkg]             = useState(null);
  const [contractDraft, setContractDraft] = useState(null);
  const [newBlackout, setNewBlackout]     = useState('');
  const [payDraft, setPayDraft]           = useState(null);

  // Content CMS state
  const [contentDraft, setContentDraft]   = useState(null);
  const [activeContentTab, setActiveContentTab] = useState('announcement'); // 'announcement'|'story'|'contact'|'faqs'
  const [newFaq, setNewFaq]               = useState({ qEn: '', qAm: '', aEn: '', aAm: '' });

  // Packages Catalog Management state
  const [pkgCategoryFilter, setPkgCategoryFilter] = useState('all');
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);
  const [newPkg, setNewPkg]               = useState({
    titleEn: '', titleAm: '', titleOm: '',
    category: 'wedding', tier: 'standard', price: 50000,
    badgeEn: '', badgeAm: '', badgeOm: '',
    deliverablesEn: ['3 Professional Cameras', 'Highlight Trailer & Cinema Edit', 'All Soft Copies Free'],
    deliverablesAm: ['3 ካሜራዎች', 'ትሬይለር እና ሙሉ ቪዲዮ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
    deliverablesOm: ['Kaameraa 3', 'Tireeyilara & Fiilmii', 'Soft copy guutuu']
  });
  const [delivEnInput, setDelivEnInput]   = useState('');
  const [delivAmInput, setDelivAmInput]   = useState('');
  const [deletePkgConfirmId, setDeletePkgConfirmId] = useState(null);
  const [newAddon, setNewAddon]           = useState({ name: '', price: 4000, desc: '', active: true });

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
      setContentDraft(sRes.settings?.content || DEFAULT_CONTENT);
      setOrders(oRes.orders || []);
      setChats(chatRes.chats || []);
      setDefaultAgr9(agrRes.defaultAgreements || sRes.settings?.defaultAgreements9 || []);
      setCustomAgrs(agrRes.customAgreements || []);
      setSignedAgrs(agrRes.signedAgreements || []);
      setStatus('Live data synced');
      setTimeout(() => setStatus(''), 2500);
    } catch(e) {
      setStatus('Failed to load data');
    }
    setLoading(false);
  };

  // Real-time live sync polling for client questions from Telegram Bot
  useEffect(() => {
    if (!unlocked || tab !== 'chats') return;

    const fetchLatest = () => {
      fetch(`${apiBase}/api/chat?list=1`)
        .then(r => r.json())
        .then(d => {
          if (Array.isArray(d?.chats)) {
            setChats(d.chats);
            setActiveChat(prev => {
              if (!prev && d.chats.length > 0) return d.chats[0];
              if (prev) {
                const updated = d.chats.find(c => c.chatId === prev.chatId);
                return updated || prev;
              }
              return null;
            });
          }
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
    };

    fetchLatest();
    const pollInterval = setInterval(fetchLatest, 3000);
    return () => clearInterval(pollInterval);
  }, [unlocked, tab, activeChat?.chatId]);

  // Auto-scroll to bottom of chat thread when messages change or chat is selected
  useEffect(() => {
    if (tab === 'chats' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, tab, activeChat?.chatId]);

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
        if (Array.isArray(d.messages) && d.messages.length > 0) {
          setChatMessages(d.messages);
        } else if (d.message) {
          setChatMessages(prev => [...prev, d.message]);
        }
        setChatReplyText('');
        setStatus('Reply sent via Telegram');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch(e) { setStatus('Send failed'); }
    setChatSending(false);
  };

  const copyAgreementLink = (url) => {
    if (!url) { setStatus('No link available — save first'); return; }
    navigator.clipboard?.writeText(url).then(() => {
      setStatus('Link copied to clipboard!');
      setTimeout(() => setStatus(''), 2500);
    }).catch(() => {
      setStatus('Copy failed — use the URL below');
    });
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
        const clientUrl = `${window.location.origin}/?sign=${d.agreement.id}`;
        const updatedAgr = { ...d.agreement, signingUrl: clientUrl };
        setCustomAgrs(prev => {
          const idx = prev.findIndex(a => a.id === d.agreement.id);
          if (idx >= 0) { const n = [...prev]; n[idx] = updatedAgr; return n; }
          return [updatedAgr, ...prev];
        });
        setEditingAgr(null);
        setSavedLinkModal({ agreement: updatedAgr, url: clientUrl });
        setStatus('Agreement saved & client link generated!');
        setTimeout(() => setStatus(''), 2500);
        return updatedAgr;
      }
    } catch(e) { setStatus('Save failed'); }
  };

  const patchSettings = async (patch) => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'update_settings', adminPin: 'HOPE2026', ...patch })
      });
      const data = await r.json();
      setSettings(data.settings || settings);
      setStatus('Settings saved');
      setTimeout(() => setStatus(''), 2500);
    } catch(e) { setStatus('Save failed'); }
    setLoading(false);
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id, status: newStatus })
      });
      const d = await r.json();
      if (d.success && d.order) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...d.order } : o));
      } else {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
      setStatus(`Order #${id} set to ${newStatus}`);
      setTimeout(() => setStatus(''), 2500);
    } catch(e) { setStatus('Update failed'); }
  };

  const updateOrderJobStatus = async (id, jobStatus) => {
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, jobStatus })
      });
      const d = await r.json();
      if (d.success && d.order) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...d.order } : o));
      } else {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, jobStatus } : o));
      }
      setStatus(`Order #${id} stage updated to ${jobStatus}`);
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Failed to update stage');
    }
  };

  const updateOrderPaymentStatus = async (id, paymentStatus) => {
    try {
      const mappedStatus = paymentStatus === 'VERIFIED' ? 'CONFIRMED' : (paymentStatus === 'REJECTED' ? 'REJECTED' : 'PENDING_VERIFICATION');
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paymentStatus, status: mappedStatus })
      });
      const d = await r.json();
      if (d.success && d.order) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...d.order } : o));
      } else {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus, status: mappedStatus } : o));
      }
      setStatus(`Order #${id} payment: ${paymentStatus}`);
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Failed to update payment');
    }
  };

  const saveOrderEdits = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editingOrder?.id) return;
    setSavingOrder(true);
    try {
      const deposit = Number(editingOrder.depositAmount) || 0;
      const total = Number(editingOrder.totalPrice) || 0;
      const remaining = total - deposit;
      const patchData = {
        id: editingOrder.id,
        clientName: editingOrder.clientName,
        phone: editingOrder.phone,
        eventDate: editingOrder.eventDate,
        location: editingOrder.location,
        packageName: editingOrder.packageName,
        category: editingOrder.category || 'wedding',
        totalPrice: total,
        depositAmount: deposit,
        remainingBalance: remaining,
        paymentMethod: editingOrder.paymentMethod || 'telebirr',
        paymentReference: editingOrder.paymentReference || '',
        paymentStatus: editingOrder.paymentStatus || 'PENDING_VERIFICATION',
        jobStatus: editingOrder.jobStatus || 'SCHEDULED',
        notes: editingOrder.notes || '',
        status: editingOrder.paymentStatus === 'VERIFIED' ? 'CONFIRMED' : (editingOrder.paymentStatus === 'REJECTED' ? 'REJECTED' : (editingOrder.status || 'PENDING_VERIFICATION'))
      };
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData)
      });
      const d = await r.json();
      if (d.success && d.order) {
        setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...d.order } : o));
      } else {
        setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...patchData } : o));
      }
      setEditingOrder(null);
      setStatus(`Order #${patchData.id} updated & synced to DB!`);
      setTimeout(() => setStatus(''), 2500);
    } catch (err) {
      setStatus('Failed to save order edits');
    }
    setSavingOrder(false);
  };

  const openOrderComments = async (order) => {
    setOrderCommentsModal(order);
    setLoadingComments(true);
    setOrderCommentsList([]);
    try {
      const r = await fetch(`${apiBase}/api/orders?id=${encodeURIComponent(order.id)}`);
      const d = await r.json();
      if (Array.isArray(d?.comments)) {
        setOrderCommentsList(d.comments);
      }
    } catch {}
    setLoadingComments(false);
  };

  const sendDirectorComment = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!directorNoteText.trim() || !orderCommentsModal) return;
    setSendingDirectorNote(true);
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          orderId: orderCommentsModal.id,
          sender: 'admin',
          senderName: 'HOPE Studio Director',
          text: directorNoteText.trim()
        })
      });
      const d = await r.json();
      if (d.success && d.message) {
        setOrderCommentsList(prev => [...prev, d.message]);
        setDirectorNoteText('');
        setStatus('Director note posted to order');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch {
      setStatus('Failed to post note');
    }
    setSendingDirectorNote(false);
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

  const saveContent = async (sectionKey) => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'update_content', payload: { content: contentDraft } })
      });
      const d = await r.json();
      if (d.success) {
        setStatus(`${sectionKey ? sectionKey.toUpperCase() : 'Content'} saved successfully`);
        setTimeout(() => setStatus(''), 2500);
      }
    } catch(e) { setStatus('Save content failed'); }
    setLoading(false);
  };

  const handleCreatePackage = async () => {
    if (!newPkg.titleEn.trim() && !newPkg.titleAm.trim()) return;
    setLoading(true);
    try {
      const pkgToSave = {
        ...newPkg,
        id: 'pkg-' + Date.now(),
        price: Number(newPkg.price) || 0
      };
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'add_package', payload: { newPackage: pkgToSave } })
      });
      const d = await r.json();
      if (d.success) {
        setSettings(s => ({ ...s, packages: d.packages }));
        setShowAddPkgModal(false);
        setNewPkg({
          titleEn: '', titleAm: '', titleOm: '',
          category: 'wedding', tier: 'standard', price: 50000,
          badgeEn: '', badgeAm: '', badgeOm: '',
          deliverablesEn: ['3 Professional Cameras', 'Highlight Trailer & Cinema Edit', 'All Soft Copies Free'],
          deliverablesAm: ['3 ካሜራዎች', 'ትሬይለር እና ሙሉ ቪዲዮ', 'ሙሉ ሶፍት ኮፒ በነጻ'],
          deliverablesOm: ['Kaameraa 3', 'Tireeyilara & Fiilmii', 'Soft copy guutuu']
        });
        setStatus('New package added to catalog');
        setTimeout(() => setStatus(''), 2500);
      }
    } catch(e) { setStatus('Failed to add package'); }
    setLoading(false);
  };

  const handleDeletePackage = async (packageId) => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'delete_package', payload: { packageId } })
      });
      const d = await r.json();
      if (d.success) {
        setSettings(s => ({ ...s, packages: d.packages }));
        setDeletePkgConfirmId(null);
        setStatus('Package removed from catalog');
        setTimeout(() => setStatus(''), 2500);
      }
    } catch(e) { setStatus('Failed to delete package'); }
    setLoading(false);
  };

  const handleSavePackageEdit = async () => {
    if (!editPkg) return;
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'update_package', payload: { packageId: editPkg.id, patch: editPkg } })
      });
      const d = await r.json();
      if (d.success) {
        setSettings(s => ({ ...s, packages: d.packages }));
        setEditPkg(null);
        setStatus('Package updated');
        setTimeout(() => setStatus(''), 2500);
      }
    } catch(e) { setStatus('Update package failed'); }
    setLoading(false);
  };

  const handleAddAddonService = async () => {
    if (!newAddon.name.trim()) return;
    setLoading(true);
    try {
      const service = { ...newAddon, id: 'addon-' + Date.now(), price: Number(newAddon.price) || 0 };
      const r = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': 'HOPE2026' },
        body: JSON.stringify({ action: 'add_custom_service', payload: { newService: service } })
      });
      const d = await r.json();
      if (d.success) {
        setSettings(s => ({ ...s, addons: d.addons }));
        setNewAddon({ name: '', price: 4000, desc: '', active: true });
        setStatus('Add-on service added');
        setTimeout(() => setStatus(''), 2500);
      }
    } catch(e) { setStatus('Failed to add service'); }
    setLoading(false);
  };

  const handleToggleAddon = async (addonId) => {
    const current = settings?.addons || [];
    const updated = current.map(a => a.id === addonId ? { ...a, active: !a.active } : a);
    await patchSettings({ addons: updated });
    setSettings(s => ({ ...s, addons: updated }));
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

  // Filtered chats by search query
  const filteredChats = chats.filter(c => {
    if (!chatSearchTerm.trim()) return true;
    const q = chatSearchTerm.toLowerCase();
    return (
      (c.firstName && c.firstName.toLowerCase().includes(q)) ||
      (c.lastName && c.lastName.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q)) ||
      (c.chatId && String(c.chatId).includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q)) ||
      (c.orderId && c.orderId.toLowerCase().includes(q))
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
            {pinError && <p className="admin-lock-err"><AlertCircle size={14} style={{display:"inline",marginRight:6}}/> Incorrect Security PIN. Please try again.</p>}
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
            <MessageCircle size={16}/> <span>Chats</span>
            {chats.reduce((s,c) => s + (c.unreadCount||0), 0) > 0 && (
              <span className="apt-tab-pill-amber">{chats.reduce((s,c) => s + (c.unreadCount||0), 0)}</span>
            )}
          </button>
          <button className={`apt-tab ${tab === 'packages' ? 'apt-tab-active' : ''}`} onClick={() => setTab('packages')}>
            <Star size={16}/> <span>Packages</span>
          </button>
          <button className={`apt-tab ${tab === 'content' ? 'apt-tab-active' : ''}`} onClick={() => setTab('content')}>
            <FileText size={16}/> <span>Content</span>
          </button>
          <button className={`apt-tab ${tab === 'agreements' ? 'apt-tab-active' : ''}`} onClick={() => setTab('agreements')}>
            <Layers size={16}/> <span>Agreements</span>
          </button>
          <button className={`apt-tab ${tab === 'calendar' ? 'apt-tab-active' : ''}`} onClick={() => setTab('calendar')}>
            <CalendarDays size={16}/> <span>Calendar</span>
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
                  <h4>Conversations ({chats.length})</h4>
                  <button className="apt-btn-secondary" onClick={loadData} title="Refresh conversations"><RefreshCw size={13}/></button>
                </div>
                <div className="admin-chat-search-wrap">
                  <Search size={13} color="#94a3b8"/>
                  <input
                    type="text"
                    className="admin-chat-search-input"
                    placeholder="Search by client, @handle, ID..."
                    value={chatSearchTerm}
                    onChange={e => setChatSearchTerm(e.target.value)}
                  />
                  {chatSearchTerm && (
                    <button className="admin-chat-clear-btn" onClick={() => setChatSearchTerm('')} title="Clear search">×</button>
                  )}
                </div>
                {filteredChats.length === 0 ? (
                  <div className="admin-empty">{chatSearchTerm ? 'No matching clients found.' : 'No conversations yet. Users who message the bot will appear here.'}</div>
                ) : (
                  filteredChats.map(c => (
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
                    <p>Click on a chat in the list to view the full lifetime conversation and reply.</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-chat-thread-header">
                      <div className="admin-chat-header-user-info">
                        <h4>
                          {activeChat.firstName} {activeChat.lastName || ''}
                          {activeChat.username ? <span className="acli-handle"> @{activeChat.username}</span> : ''}
                          <span className="admin-chat-lifetime-pill" title="Lifetime chat history is permanently stored & synced">
                            ✓ {chatMessages.length} Messages in Lifetime History
                          </span>
                        </h4>
                        <div className="admin-chat-header-sub">
                          <span>Chat ID: <code>{activeChat.chatId}</code></span>
                          {activeChat.orderId && (
                            <span className="admin-chat-order-pill">
                              Linked Order: <strong>{activeChat.orderId}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="admin-chat-thread-actions">
                        <button className="aoc-btn-discuss" onClick={() => setTab('agreements')} title="Create custom agreement for this client">
                          <Layers size={14}/> Customize Agreement
                        </button>
                        {activeChat.orderId && (
                          <a href={`tel:${orders.find(o=>o.id===activeChat.orderId)?.phone || ''}`} className="aoc-btn-call">
                            <Phone size={14}/> Call
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="admin-chat-messages">
                      {chatMessages.length === 0 ? (
                        <div className="admin-empty">No messages in this lifetime conversation yet.</div>
                      ) : (
                        (() => {
                          let lastDate = null;
                          return chatMessages.map((m, idx) => {
                            const msgDate = new Date(m.timestamp || Date.now());
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);

                            let dateHeader = msgDate.toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                            });
                            if (msgDate.toDateString() === today.toDateString()) dateHeader = 'Today';
                            else if (msgDate.toDateString() === yesterday.toDateString()) dateHeader = 'Yesterday';

                            const showDateDivider = dateHeader !== lastDate;
                            if (showDateDivider) lastDate = dateHeader;

                            const isImg = m.data?.photoUrl || m.data?.fileUrl || (typeof m.text === 'string' && (m.text.includes('cloudinary') || m.text.includes('/receipts/') || m.text.match(/\.(jpg|jpeg|png|webp)/i)));
                            const imgUrl = m.data?.photoUrl || m.data?.fileUrl || (isImg && typeof m.text === 'string' ? m.text.match(/https?:\/\/[^\s]+/)?.[0] : null);

                            const isAgreementLink = (typeof m.text === 'string' && (m.text.includes('/agreement/') || m.text.includes('?agreement=')));
                            const isWebPortal = m.source === 'web_portal' || m.type === 'portal_note';

                            return (
                              <React.Fragment key={m.id || idx}>
                                {showDateDivider && (
                                  <div className="admin-chat-date-divider">
                                    <span>{dateHeader}</span>
                                  </div>
                                )}
                                <div className={`admin-chat-msg ${m.sender === 'admin' ? 'msg-admin' : 'msg-client'}`}>
                                  <div className="admin-chat-msg-bubble">
                                    <div className="admin-chat-msg-sender-row">
                                      <span className="admin-chat-msg-sender">
                                        {m.sender === 'admin' ? 'HOPE Studio Director' : (m.senderName || activeChat.firstName || 'Client')}
                                      </span>
                                      {isWebPortal && (
                                        <span className="admin-chat-badge-portal">
                                          🌐 Web Portal Note
                                        </span>
                                      )}
                                    </div>
                                    <div className="admin-chat-msg-text">{m.text}</div>

                                    {/* Thumbnail preview if message has image/receipt */}
                                    {imgUrl && (
                                      <div className="admin-chat-receipt-card">
                                        <img
                                          src={imgUrl}
                                          alt="Attachment / Receipt"
                                          className="admin-chat-receipt-img"
                                          onClick={() => window.open(imgUrl, '_blank')}
                                          title="Click to view full image"
                                        />
                                        <span className="admin-chat-receipt-caption">📎 Click to enlarge attachment</span>
                                      </div>
                                    )}

                                    {/* Agreement link preview button */}
                                    {isAgreementLink && (
                                      <a
                                        href={m.text.match(/https?:\/\/[^\s]+/)?.[0] || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-chat-agreement-btn"
                                      >
                                        <FileText size={13}/> Open Official Digital Agreement
                                      </a>
                                    )}

                                    <div className="admin-chat-msg-time">
                                      {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          });
                        })()
                      )}
                      <div ref={messagesEndRef} />
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
                    <h4>9 Default Agreement Templates (ወ•ል)</h4>
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
                      <h4>Customize Agreement for Client</h4>
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
                        <h4>Custom Client Agreements</h4>
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
                            {agr.signingUrl && (
                              <button
                                className="aoc-btn-approve"
                                onClick={() => copyAgreementLink(agr.signingUrl)}
                              >
                                <Copy size={13}/> Copy Link
                              </button>
                            )}
                          </div>
                          {agr.signingUrl && (
                            <div style={{width:'100%', marginTop:'5px'}}>
                              <input
                                readOnly
                                value={agr.signingUrl}
                                style={{width:'100%', fontSize:'11px', padding:'5px 8px', border:'1px solid #e2e8f0', borderRadius:'6px', background:'#f8fafc', color:'#334155', cursor:'text', boxSizing:'border-box'}}
                                onFocus={e => e.target.select()}
                              />
                            </div>
                          )}
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
                <div className="apt-box-header"><h4>Signed Agreements Archive ({signedAgrs.length})</h4></div>
                {signedAgrs.map(agr => (
                  <div key={agr.id} className="admin-agr-row">
                    <div className="admin-agr-info">
                      <strong>{agr.clientName}</strong>
                      <span className="aoc-lbl">· {agr.packageName} ·</span>
                      <span className="admin-agr-price">{(agr.agreedPrice||0).toLocaleString()} ETB</span>
                      <span style={{color:'#22c55e', fontSize:'12px'}}> Signed {new Date(agr.signedAt).toLocaleDateString()}</span>
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

              {/* Instant QR Scanner / Payment Verification Button */}
              <button
                type="button"
                className="apt-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, background: '#16a34a', border: 'none', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
                onClick={() => { setAdminScanModal(true); setScannedOrder(null); setScannedInput(''); }}
              >
                <Camera size={15} />
                <span>Scan / Verify Payment</span>
              </button>
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
                  const depositAmt = o.depositAmount || Math.round((o.totalPrice || o.basePrice || 0) * 0.5);
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
                            <strong className="aoc-val">{o.eventDate || 'To be decided'}</strong>
                          </div>
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Phone:</span>
                            <a href={`tel:${o.phone}`} className="aoc-phone-link">{o.phone || '—'}</a>
                          </div>
                          <div className="aoc-info-row">
                            <span className="aoc-lbl">Location:</span>
                            <span className="aoc-val">{o.location || 'Addis Ababa'}</span>
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
                              <span>50% Deposit:</span>
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

                      {/* 5-Step Order Progress Stepper (Interactive & Live Synced to DB) */}
                      <div className="aoc-progress-stepper" style={{margin:'0 0 12px 0'}}>
                        <div className="aoc-stepper-head">
                          <span>Project Stage: <strong>{
                            o.jobStatus === 'PREP' ? '2. Pre-Shoot Prep' :
                            o.jobStatus === 'IN_PRODUCTION' ? '3. Shoot Day (In Production)' :
                            o.jobStatus === 'EDITING' ? '4. Cinema Editing & Color' :
                            o.jobStatus === 'COMPLETED' ? '5. Completed & Ready for Pickup!' :
                            '1. Booking Reserved'
                          }</strong></span>
                          <span className="aoc-stepper-hint">Tap any stage to advance progress &amp; sync to DB</span>
                        </div>
                        <div className="aoc-stepper-track">
                          {[
                            { key: 'SCHEDULED', num: '1', title: 'Reserved' },
                            { key: 'PREP', num: '2', title: 'Prep' },
                            { key: 'IN_PRODUCTION', num: '3', title: 'Shoot Day' },
                            { key: 'EDITING', num: '4', title: 'Editing' },
                            { key: 'COMPLETED', num: '5', title: 'Completed' },
                          ].map((st, idx) => {
                            const stages = ['SCHEDULED', 'PREP', 'IN_PRODUCTION', 'EDITING', 'COMPLETED'];
                            const currentIdx = stages.indexOf(o.jobStatus || 'SCHEDULED');
                            const isCompleted = currentIdx > idx || o.jobStatus === 'COMPLETED';
                            const isActive = (o.jobStatus || 'SCHEDULED') === st.key;
                            return (
                              <button
                                key={st.key}
                                type="button"
                                className={`aoc-step-btn ${isActive ? 'active' : (isCompleted ? 'completed' : '')}`}
                                onClick={() => updateOrderJobStatus(o.id, st.key)}
                                title={`Set job progress to stage: ${st.title}`}
                              >
                                {isActive ? <Sparkles size={12}/> : (isCompleted ? <Check size={12}/> : <Clock size={12}/>)}
                                <span>{st.num}. {st.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Payment Verification & Control Bar */}
                      <div className="aoc-payment-bar" style={{margin:'0 0 14px 0'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap'}}>
                          <span className="aoc-lbl" style={{margin:0}}>Payment Status:</span>
                          <span className={`aoc-pay-tag ${o.paymentStatus || (o.status === 'CONFIRMED' ? 'VERIFIED' : 'PENDING_VERIFICATION')}`}>
                            {o.paymentStatus || (o.status === 'CONFIRMED' ? 'VERIFIED' : 'PENDING_VERIFICATION')}
                          </span>
                          {o.paymentReference && (
                            <span style={{fontSize:'11px', color:'#64748b'}}>
                              Txn Ref: <code style={{background:'#f1f5f9', padding:'2px 5px', borderRadius:'4px'}}>{o.paymentReference}</code>
                            </span>
                          )}
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap'}}>
                          {o.paymentStatus !== 'VERIFIED' && (
                            <button
                              type="button"
                              className="aoc-step-btn completed"
                              style={{padding:'4px 10px', fontSize:'11px'}}
                              onClick={() => updateOrderPaymentStatus(o.id, 'VERIFIED')}
                              title="Verify Payment and Confirm Order"
                            >
                              <Check size={12}/> Verify Payment
                            </button>
                          )}
                          {o.paymentStatus !== 'PENDING_VERIFICATION' && (
                            <button
                              type="button"
                              className="aoc-step-btn"
                              style={{padding:'4px 10px', fontSize:'11px'}}
                              onClick={() => updateOrderPaymentStatus(o.id, 'PENDING_VERIFICATION')}
                              title="Mark Payment as Pending"
                            >
                              <Clock size={12}/> Mark Pending
                            </button>
                          )}
                          {o.paymentStatus !== 'REJECTED' && (
                            <button
                              type="button"
                              className="aoc-step-btn"
                              style={{padding:'4px 10px', fontSize:'11px', color:'#dc2626', borderColor:'#fca5a5'}}
                              onClick={() => updateOrderPaymentStatus(o.id, 'REJECTED')}
                              title="Reject Receipt"
                            >
                              <X size={12}/> Reject
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="aoc-card-actions">
                        <button
                          type="button"
                          className="aoc-btn-edit"
                          onClick={() => setEditingOrder({
                            ...o,
                            depositAmount: o.depositAmount || Math.round((o.totalPrice || o.basePrice || 0) * 0.3),
                            totalPrice: o.totalPrice || o.basePrice || 0,
                            paymentStatus: o.paymentStatus || (o.status === 'CONFIRMED' ? 'VERIFIED' : 'PENDING_VERIFICATION'),
                            jobStatus: o.jobStatus || 'SCHEDULED'
                          })}
                          title="Open Full Edit Modal to customize any details, dates, or prices"
                        >
                          <Edit2 size={14}/> Edit Full Order
                        </button>

                        <button
                          type="button"
                          className="aoc-btn-discuss"
                          onClick={() => openOrderComments(o)}
                          title="Read Client Comments & Send Studio Director Replies"
                        >
                          <MessageCircle size={14}/> Notes &amp; Comments
                        </button>

                        <a
                          href={`/?order=${o.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aoc-btn-portal"
                          title="Open Client's Live Status & Tracking Portal in a new tab"
                        >
                          <ExternalLink size={14}/> View Client Portal
                        </a>

                        <a href={`tel:${o.phone}`} className="aoc-btn-call" title="Call Client directly">
                          <Phone size={14}/> Call
                        </a>

                        {(o.telegramChatId || o.telegramUserId || chats.some(c => c.orderId === o.id || c.chatId === o.telegramUserId)) && (
                          <button
                            type="button"
                            className="aoc-btn-discuss"
                            style={{borderColor: '#22c55e', color: '#16a34a', background:'#f0fdf4'}}
                            onClick={() => {
                              const targetId = o.telegramChatId || o.telegramUserId || chats.find(c => c.orderId === o.id || c.chatId === o.telegramUserId)?.chatId;
                              setTab('chats');
                              if (targetId) loadChat(targetId);
                            }}
                            title="Open direct live Telegram conversation with client"
                          >
                            <MessageCircle size={14}/> Telegram Chat
                          </button>
                        )}
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
                          <span>{d}</span>
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
                            <CalendarDays size={13} style={{display:"inline",marginRight:4}}/> <strong>{o.eventDate}</strong>
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

        {/* ════ TAB: PACKAGES CATALOG MANAGEMENT ════ */}
        {tab === 'packages' && (
          <section className="apt-tab-section">
            {/* Header / Hero */}
            <div className="apt-section-hero">
              <div>
                <h3>Studio Packages & Catalog Management</h3>
                <p>Add new service packages, update pricing in ETB, customize deliverables, and manage add-on extras.</p>
              </div>
              <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.4rem'}} onClick={() => setShowAddPkgModal(true)}>
                <Plus size={16}/> Add New Package
              </button>
            </div>

            {/* Toolbar & Category Filters */}
            <div className="apt-orders-toolbar">
              <div style={{display:'flex', alignItems:'center', gap:'.75rem', flexWrap:'wrap'}}>
                <span style={{fontSize:'.82rem', fontWeight:800, color:'#0f172a'}}>Category Filter:</span>
                <div className="apt-filter-pills">
                  {[
                    { id: 'all', label: `All Packages (${(settings?.packages || DEFAULT_PACKAGES).length})` },
                    { id: 'wedding', label: `Wedding (${(settings?.packages || DEFAULT_PACKAGES).filter(p=>p.category==='wedding').length})` },
                    { id: 'studio', label: `Studio (${(settings?.packages || DEFAULT_PACKAGES).filter(p=>p.category==='studio').length})` },
                    { id: 'mesk', label: `Mesk (${(settings?.packages || DEFAULT_PACKAGES).filter(p=>p.category==='mesk').length})` },
                    { id: 'commercial', label: `Commercial (${(settings?.packages || DEFAULT_PACKAGES).filter(p=>p.category==='commercial').length})` },
                  ].map(f => (
                    <button
                      key={f.id}
                      className={`apt-filter-pill ${pkgCategoryFilter === f.id ? 'active' : ''}`}
                      onClick={() => setPkgCategoryFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="apt-packages-grid">
              {(settings?.packages || DEFAULT_PACKAGES)
                .filter(pkg => pkgCategoryFilter === 'all' || pkg.category === pkgCategoryFilter)
                .map(pkg => (
                  <div key={pkg.id} className="apt-pkg-card">
                    <div className="apt-pkg-top">
                      <div>
                        <div style={{display:'flex', alignItems:'center', gap:'.4rem'}}>
                          <span className="aoc-category-tag">{pkg.category}</span>
                          <span className="aoc-category-tag" style={{background:'#fef3c7', color:'#b45309'}}>{pkg.tier}</span>
                        </div>
                        <h4 style={{marginTop:'.4rem'}}>{pkg.titleEn}</h4>
                        <small style={{color:'#64748b'}}>{pkg.titleAm}</small>
                      </div>
                      <div className="apt-pkg-price-badge">
                        {Number(pkg.price).toLocaleString()} <span>ETB</span>
                      </div>
                    </div>

                    <div className="apt-pkg-badge-preview">
                      Badge: <strong>{pkg.badgeEn || 'Standard'}</strong>
                      {pkg.badgeAm && <span style={{marginLeft:'.4rem', color:'#64748b'}}>({pkg.badgeAm})</span>}
                    </div>

                    {/* Deliverables List preview */}
                    <div style={{background:'#f8fafc', borderRadius:'10px', padding:'.75rem .9rem', border:'1px solid #e2e8f0'}}>
                      <span style={{fontSize:'.72rem', fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em'}}>Included Deliverables:</span>
                      <ul style={{margin:'.4rem 0 0', paddingLeft:'1.2rem', fontSize:'.78rem', color:'#334155', lineHeight:1.5}}>
                        {(pkg.deliverablesEn || []).slice(0, 4).map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                        {(pkg.deliverablesEn || []).length > 4 && (
                          <li style={{color:'#bd2637', fontWeight:700}}>+ {(pkg.deliverablesEn || []).length - 4} more items...</li>
                        )}
                      </ul>
                    </div>

                    {editPkg?.id === pkg.id ? (
                      <div className="apt-pkg-edit-form">
                        <div className="apt-split-grid" style={{gap:'.75rem'}}>
                          <label className="bf-label">Title (English)
                            <input
                              className="bf-input"
                              value={editPkg.titleEn || ''}
                              onChange={e => setEditPkg(p => ({...p, titleEn: e.target.value}))}
                            />
                          </label>
                          <label className="bf-label">Title (Amharic)
                            <input
                              className="bf-input"
                              value={editPkg.titleAm || ''}
                              onChange={e => setEditPkg(p => ({...p, titleAm: e.target.value}))}
                            />
                          </label>
                        </div>
                        <div className="apt-split-grid" style={{gap:'.75rem'}}>
                          <label className="bf-label">Price in ETB
                            <input
                              type="number"
                              className="bf-input"
                              value={editPkg.price || 0}
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
                        </div>

                        {/* Edit deliverables bullets */}
                        <div style={{marginTop:'.3rem'}}>
                          <span style={{fontSize:'.75rem', fontWeight:700, color:'#475569'}}>Deliverables (EN):</span>
                          <div className="apt-deliv-tags">
                            {(editPkg.deliverablesEn || []).map((del, dIdx) => (
                              <span key={dIdx} className="apt-deliv-tag">
                                {del}
                                <button type="button" onClick={() => {
                                  const updated = (editPkg.deliverablesEn || []).filter((_, idx) => idx !== dIdx);
                                  setEditPkg(p => ({ ...p, deliverablesEn: updated }));
                                }}>×</button>
                              </span>
                            ))}
                          </div>
                          <div style={{display:'flex', gap:'.4rem', marginTop:'.4rem'}}>
                            <input
                              className="bf-input"
                              placeholder="Add deliverable..."
                              value={delivEnInput}
                              onChange={e => setDelivEnInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && delivEnInput.trim()) {
                                  e.preventDefault();
                                  setEditPkg(p => ({ ...p, deliverablesEn: [...(p.deliverablesEn || []), delivEnInput.trim()] }));
                                  setDelivEnInput('');
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="aoc-btn-discuss"
                              onClick={() => {
                                if (delivEnInput.trim()) {
                                  setEditPkg(p => ({ ...p, deliverablesEn: [...(p.deliverablesEn || []), delivEnInput.trim()] }));
                                  setDelivEnInput('');
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="aoc-card-actions" style={{marginTop:'10px'}}>
                          <button className="aoc-btn-approve" onClick={handleSavePackageEdit}>
                            <Check size={14}/> Save Changes
                          </button>
                          <button className="aoc-btn-reject" onClick={() => setEditPkg(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{display:'flex', gap:'.5rem', marginTop:'.5rem'}}>
                        <button className="apt-edit-btn" style={{flex:1}} onClick={() => setEditPkg({...pkg})}>
                          <Edit2 size={13}/> Edit Package
                        </button>
                        <button
                          className="aoc-btn-reject"
                          style={{padding:'.45rem .75rem', borderRadius:'8px', fontSize:'.75rem'}}
                          onClick={() => setDeletePkgConfirmId(pkg.id)}
                          title="Archive / Delete Package"
                        >
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Add-on Services Catalog Manager */}
            <div className="apt-card-box" style={{marginTop:'1.5rem'}}>
              <div className="apt-box-header">
                <div>
                  <h4>Add-on Extra Services Catalog</h4>
                  <p>Manage optional creative enhancements (Drone, Extra Operator, Rush Video, Deluxe Wall Board, Makeup).</p>
                </div>
              </div>

              <div className="apt-packages-grid">
                {(settings?.addons || []).map(addon => (
                  <div key={addon.id} className="apt-pkg-card" style={{border: addon.active ? '1px solid #e2e8f0' : '1px dashed #cbd5e1', opacity: addon.active ? 1 : 0.65}}>
                    <div className="apt-pkg-top">
                      <div>
                        <h4 style={{fontSize:'.95rem'}}>{addon.name}</h4>
                        <p style={{margin:'.2rem 0 0', fontSize:'.78rem', color:'#64748b'}}>{addon.desc}</p>
                      </div>
                      <div className="apt-pkg-price-badge" style={{fontSize:'1rem'}}>
                        +{Number(addon.price).toLocaleString()} <span>ETB</span>
                      </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'.5rem', borderTop:'1px solid #f1f5f9', paddingTop:'.6rem'}}>
                      <label className="apt-cms-toggle">
                        <input
                          type="checkbox"
                          checked={!!addon.active}
                          onChange={() => handleToggleAddon(addon.id)}
                        />
                        <span>{addon.active ? 'Active on booking' : 'Disabled'}</span>
                      </label>
                      <button
                        className="aoc-btn-reject"
                        style={{padding:'.3rem .6rem', fontSize:'.72rem', borderRadius:'6px'}}
                        onClick={async () => {
                          const updated = (settings?.addons || []).filter(a => a.id !== addon.id);
                          await patchSettings({ addons: updated });
                          setSettings(s => ({ ...s, addons: updated }));
                        }}
                      >
                        <Trash2 size={12}/> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Service Form */}
              <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'14px', padding:'1.25rem', marginTop:'1rem'}}>
                <h5 style={{margin:'0 0 .8rem', fontSize:'.9rem', fontWeight:800, color:'#0f172a'}}>+ Add New Add-on Service</h5>
                <div className="apt-split-grid" style={{gridTemplateColumns:'2fr 1fr', gap:'.75rem'}}>
                  <label className="bf-label">Service Title
                    <input
                      className="bf-input"
                      placeholder="e.g. Helicopter Cinema View"
                      value={newAddon.name}
                      onChange={e => setNewAddon(a => ({...a, name: e.target.value}))}
                    />
                  </label>
                  <label className="bf-label">Price (ETB)
                    <input
                      type="number"
                      className="bf-input"
                      value={newAddon.price}
                      onChange={e => setNewAddon(a => ({...a, price: Number(e.target.value)}))}
                    />
                  </label>
                </div>
                <label className="bf-label" style={{marginTop:'.75rem'}}>Service Description
                  <input
                    className="bf-input"
                    placeholder="Short description shown to clients during booking"
                    value={newAddon.desc}
                    onChange={e => setNewAddon(a => ({...a, desc: e.target.value}))}
                  />
                </label>
                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'1rem'}}>
                  <button className="admin-lock-btn" style={{width:'auto', padding:'.55rem 1.25rem'}} onClick={handleAddAddonService}>
                    <Plus size={14}/> Add Service
                  </button>
                </div>
              </div>
            </div>

            {/* Modal: Add New Package */}
            {showAddPkgModal && (
              <div className="apt-modal-backdrop" onClick={() => setShowAddPkgModal(false)}>
                <div className="apt-modal-card" onClick={e => e.stopPropagation()}>
                  <div className="apt-modal-header">
                    <h3>Create New Service Package</h3>
                    <button className="apt-modal-close" onClick={() => setShowAddPkgModal(false)}><X size={20}/></button>
                  </div>
                  <div className="apt-modal-body">
                    <div className="apt-split-grid" style={{gap:'1rem'}}>
                      <label className="bf-label">Category
                        <select
                          className="bf-input"
                          value={newPkg.category}
                          onChange={e => setNewPkg(p => ({...p, category: e.target.value}))}
                        >
                          <option value="wedding">Wedding (የሰርግ)</option>
                          <option value="studio">Studio (የስቱዲዮ)</option>
                          <option value="mesk">Mesk (የመስክ)</option>
                          <option value="commercial">Commercial (ንግድ)</option>
                        </select>
                      </label>
                      <label className="bf-label">Tier
                        <select
                          className="bf-input"
                          value={newPkg.tier}
                          onChange={e => setNewPkg(p => ({...p, tier: e.target.value}))}
                        >
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                          <option value="vip">VIP / Royal</option>
                        </select>
                      </label>
                    </div>

                    <div className="apt-split-grid" style={{gap:'1rem'}}>
                      <label className="bf-label">Title (English) *
                        <input
                          className="bf-input"
                          placeholder="e.g. Royal Diamond Cinema Suite"
                          value={newPkg.titleEn}
                          onChange={e => setNewPkg(p => ({...p, titleEn: e.target.value}))}
                        />
                      </label>
                      <label className="bf-label">Title (Amharic) *
                        <input
                          className="bf-input"
                          placeholder="ለምሳሌ፡ ሮያል ዳይመንድ ሲኒማ ሱዊት"
                          value={newPkg.titleAm}
                          onChange={e => setNewPkg(p => ({...p, titleAm: e.target.value}))}
                        />
                      </label>
                    </div>

                    <div className="apt-split-grid" style={{gap:'1rem'}}>
                      <label className="bf-label">Price in ETB *
                        <input
                          type="number"
                          className="bf-input"
                          placeholder="e.g. 85000"
                          value={newPkg.price}
                          onChange={e => setNewPkg(p => ({...p, price: Number(e.target.value)}))}
                        />
                      </label>
                      <label className="bf-label">Badge Label (EN)
                        <input
                          className="bf-input"
                          placeholder="e.g. Most Popular, Grand Keepsake"
                          value={newPkg.badgeEn}
                          onChange={e => setNewPkg(p => ({...p, badgeEn: e.target.value}))}
                        />
                      </label>
                    </div>

                    {/* Deliverables Builder */}
                    <div>
                      <span style={{fontSize:'.82rem', fontWeight:800, color:'#0f172a'}}>Package Deliverables List:</span>
                      <div className="apt-deliv-tags">
                        {(newPkg.deliverablesEn || []).map((item, idx) => (
                          <span key={idx} className="apt-deliv-tag">
                            {item}
                            <button type="button" onClick={() => {
                              const updated = (newPkg.deliverablesEn || []).filter((_, i) => i !== idx);
                              setNewPkg(p => ({...p, deliverablesEn: updated}));
                            }}>×</button>
                          </span>
                        ))}
                      </div>
                      <div style={{display:'flex', gap:'.5rem', marginTop:'.5rem'}}>
                        <input
                          className="bf-input"
                          placeholder="Type deliverable (e.g. 4K Drone Coverage) and click Add..."
                          value={delivEnInput}
                          onChange={e => setDelivEnInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && delivEnInput.trim()) {
                              e.preventDefault();
                              setNewPkg(p => ({...p, deliverablesEn: [...(p.deliverablesEn||[]), delivEnInput.trim()]}));
                              setDelivEnInput('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="aoc-btn-discuss"
                          onClick={() => {
                            if (delivEnInput.trim()) {
                              setNewPkg(p => ({...p, deliverablesEn: [...(p.deliverablesEn||[]), delivEnInput.trim()]}));
                              setDelivEnInput('');
                            }
                          }}
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="apt-modal-footer">
                    <button className="apt-btn-secondary" onClick={() => setShowAddPkgModal(false)}>Cancel</button>
                    <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.5rem'}} onClick={handleCreatePackage}>
                      <Check size={16}/> Publish Package
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Delete Package Confirmation */}
            {deletePkgConfirmId && (
              <div className="apt-modal-backdrop" onClick={() => setDeletePkgConfirmId(null)}>
                <div className="apt-modal-card" style={{maxWidth:'450px'}} onClick={e => e.stopPropagation()}>
                  <div className="apt-modal-header">
                    <h3>Confirm Archive / Delete</h3>
                    <button className="apt-modal-close" onClick={() => setDeletePkgConfirmId(null)}><X size={18}/></button>
                  </div>
                  <div className="apt-modal-body" style={{textAlign:'center', padding:'2rem 1.5rem'}}>
                    <div style={{width:'50px', height:'50px', borderRadius:'50%', background:'#fee2e2', color:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem'}}>
                      <Trash2 size={24}/>
                    </div>
                    <h4 style={{margin:'0 0 .5rem', fontSize:'1.05rem', color:'#0f172a'}}>Remove Package from Studio Catalog?</h4>
                    <p style={{margin:0, fontSize:'.84rem', color:'#64748b', lineHeight:1.5}}>
                      This package will no longer be selectable on the public booking flow or contracts.
                    </p>
                  </div>
                  <div className="apt-modal-footer" style={{justifyContent:'center', gap:'1rem'}}>
                    <button className="apt-btn-secondary" onClick={() => setDeletePkgConfirmId(null)}>Cancel</button>
                    <button className="aoc-btn-reject" style={{padding:'.6rem 1.4rem'}} onClick={() => handleDeletePackage(deletePkgConfirmId)}>
                      Yes, Delete Package
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ════ TAB: CONTENT MANAGEMENT (CMS) ════ */}
        {tab === 'content' && contentDraft && (
          <section className="apt-tab-section">
            {/* Header / Hero */}
            <div className="apt-section-hero">
              <div>
                <h3>Studio Content Management System (CMS)</h3>
                <p>Customize real-time announcement banners, studio about story, official contact details, and bilingual FAQs.</p>
              </div>
              <a href="/" target="_blank" rel="noopener noreferrer" className="apt-btn-secondary" style={{textDecoration:'none'}}>
                <ExternalLink size={14}/> View Live Website
              </a>
            </div>

            {/* Sub navigation pills */}
            <div className="apt-filter-pills" style={{background:'#ffffff', padding:'.75rem 1rem', borderRadius:'14px', border:'1px solid #e2e8f0'}}>
              {[
                { id: 'announcement', label: 'Announcement Banner' },
                { id: 'story', label: 'Studio Story & Metrics' },
                { id: 'contact', label: 'Contact & Social Channels' },
                { id: 'faqs', label: 'Bilingual FAQ Manager' }
              ].map(sub => (
                <button
                  key={sub.id}
                  className={`apt-filter-pill ${activeContentTab === sub.id ? 'active' : ''}`}
                  onClick={() => setActiveContentTab(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SECTION 1: ANNOUNCEMENT BANNER */}
            {activeContentTab === 'announcement' && (
              <div className="apt-cms-card">
                <div className="apt-cms-head">
                  <h4>Top Announcement Bar</h4>
                  <label className="apt-cms-toggle">
                    <input
                      type="checkbox"
                      checked={!!contentDraft.announcement?.active}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        announcement: { ...(c.announcement || {}), active: e.target.checked }
                      }))}
                    />
                    <span>{contentDraft.announcement?.active ? 'Banner Enabled' : 'Banner Hidden'}</span>
                  </label>
                </div>

                {/* Live Visitor Preview */}
                <div>
                  <span style={{fontSize:'.75rem', fontWeight:800, color:'#64748b', textTransform:'uppercase'}}>Visitor Live Preview:</span>
                  <div className="apt-live-preview" style={{marginTop:'.35rem'}}>
                    <span className="apt-preview-badge">{contentDraft.announcement?.badgeEn || 'Limited Offer'}</span>
                    <span className="apt-preview-text">{contentDraft.announcement?.textEn || 'Announcement text preview'}</span>
                  </div>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Badge Label (English)
                    <input
                      className="bf-input"
                      value={contentDraft.announcement?.badgeEn || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        announcement: { ...(c.announcement || {}), badgeEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Badge Label (Amharic)
                    <input
                      className="bf-input"
                      value={contentDraft.announcement?.badgeAm || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        announcement: { ...(c.announcement || {}), badgeAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <label className="bf-label">Announcement Message (English)
                  <textarea
                    rows="2"
                    className="bf-input"
                    value={contentDraft.announcement?.textEn || ''}
                    onChange={e => setContentDraft(c => ({
                      ...c,
                      announcement: { ...(c.announcement || {}), textEn: e.target.value }
                    }))}
                  />
                </label>

                <label className="bf-label">Announcement Message (Amharic)
                  <textarea
                    rows="2"
                    className="bf-input"
                    value={contentDraft.announcement?.textAm || ''}
                    onChange={e => setContentDraft(c => ({
                      ...c,
                      announcement: { ...(c.announcement || {}), textAm: e.target.value }
                    }))}
                  />
                </label>

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.75rem'}} onClick={() => saveContent('announcement')}>
                    Save Announcement Bar
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: STUDIO STORY & METRICS */}
            {activeContentTab === 'story' && (
              <div className="apt-cms-card">
                <div className="apt-cms-head">
                  <h4>Studio Story, Experience & Key Metrics</h4>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Story Heading (English)
                    <input
                      className="bf-input"
                      value={contentDraft.story?.titleEn || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), titleEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Story Heading (Amharic)
                    <input
                      className="bf-input"
                      value={contentDraft.story?.titleAm || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), titleAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Story Subtitle / Mission (English)
                    <textarea
                      rows="3"
                      className="bf-input"
                      value={contentDraft.story?.subtitleEn || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), subtitleEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Story Subtitle / Mission (Amharic)
                    <textarea
                      rows="3"
                      className="bf-input"
                      value={contentDraft.story?.subtitleAm || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), subtitleAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <h5 style={{margin:'.5rem 0 .2rem', fontSize:'.9rem', fontWeight:800, color:'#0f172a'}}>Studio Metric Counters</h5>
                <div className="apt-split-grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))'}}>
                  <label className="bf-label">Years of Experience
                    <input
                      className="bf-input"
                      placeholder="e.g. 10+"
                      value={contentDraft.story?.yearsExp || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), yearsExp: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Weddings & Events
                    <input
                      className="bf-input"
                      placeholder="e.g. 850+"
                      value={contentDraft.story?.weddingsCount || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), weddingsCount: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Satisfaction Rate
                    <input
                      className="bf-input"
                      placeholder="e.g. 100%"
                      value={contentDraft.story?.satisfactionRate || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), satisfactionRate: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Master Cinema Equipment
                    <input
                      className="bf-input"
                      placeholder="e.g. Sony Cinema FX & Aputure"
                      value={contentDraft.story?.gearSummary || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        story: { ...(c.story || {}), gearSummary: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'1rem'}}>
                  <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.75rem'}} onClick={() => saveContent('story')}>
                    Save Story & Metrics
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: CONTACT & SOCIAL CHANNELS */}
            {activeContentTab === 'contact' && (
              <div className="apt-cms-card">
                <div className="apt-cms-head">
                  <h4>Studio Contact Details & Social Links</h4>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Primary Studio Phone
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.phone || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), phone: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Secondary / Director Phone
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.secondaryPhone || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), secondaryPhone: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Official Email
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.email || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), email: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Telegram Bot Username
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.telegramHandle || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), telegramHandle: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Telegram Channel Link
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.channelLink || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), channelLink: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Instagram Profile Link
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.instagramLink || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), instagramLink: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Physical Studio Location (English)
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.addressEn || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), addressEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Physical Studio Location (Amharic)
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.addressAm || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), addressAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div className="apt-split-grid">
                  <label className="bf-label">Working Hours (English)
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.workingHoursEn || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), workingHoursEn: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="bf-label">Working Hours (Amharic)
                    <input
                      className="bf-input"
                      value={contentDraft.contact?.workingHoursAm || ''}
                      onChange={e => setContentDraft(c => ({
                        ...c,
                        contact: { ...(c.contact || {}), workingHoursAm: e.target.value }
                      }))}
                    />
                  </label>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'1rem'}}>
                  <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.75rem'}} onClick={() => saveContent('contact')}>
                    Save Contact Info
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 4: BILINGUAL FAQS */}
            {activeContentTab === 'faqs' && (
              <div className="apt-cms-card">
                <div className="apt-cms-head">
                  <h4>Bilingual Studio FAQ Manager ({contentDraft.faqs?.length || 0})</h4>
                </div>

                <div className="apt-faq-list">
                  {(contentDraft.faqs || []).map((faq, fIdx) => (
                    <div key={faq.id || fIdx} className="apt-faq-item">
                      <div className="apt-faq-q">
                        <span>Q0{fIdx + 1}: {faq.qEn}</span>
                        <button
                          className="aoc-btn-reject"
                          style={{padding:'.25rem .55rem', fontSize:'.72rem', borderRadius:'6px'}}
                          onClick={() => {
                            const updated = (contentDraft.faqs || []).filter((_, i) => i !== fIdx);
                            setContentDraft(c => ({...c, faqs: updated}));
                          }}
                        >
                          <Trash2 size={12}/>
                        </button>
                      </div>
                      <div className="apt-split-grid" style={{gap:'.75rem'}}>
                        <input
                          className="bf-input"
                          placeholder="Question in English"
                          value={faq.qEn || ''}
                          onChange={e => {
                            const faqs = [...contentDraft.faqs];
                            faqs[fIdx] = { ...faqs[fIdx], qEn: e.target.value };
                            setContentDraft(c => ({...c, faqs}));
                          }}
                        />
                        <input
                          className="bf-input"
                          placeholder="ጥያቄው በአማርኛ"
                          value={faq.qAm || ''}
                          onChange={e => {
                            const faqs = [...contentDraft.faqs];
                            faqs[fIdx] = { ...faqs[fIdx], qAm: e.target.value };
                            setContentDraft(c => ({...c, faqs}));
                          }}
                        />
                      </div>
                      <div className="apt-split-grid" style={{gap:'.75rem'}}>
                        <textarea
                          rows="2"
                          className="bf-input"
                          placeholder="Answer in English"
                          value={faq.aEn || ''}
                          onChange={e => {
                            const faqs = [...contentDraft.faqs];
                            faqs[fIdx] = { ...faqs[fIdx], aEn: e.target.value };
                            setContentDraft(c => ({...c, faqs}));
                          }}
                        />
                        <textarea
                          rows="2"
                          className="bf-input"
                          placeholder="መልሱ በአማርኛ"
                          value={faq.aAm || ''}
                          onChange={e => {
                            const faqs = [...contentDraft.faqs];
                            faqs[fIdx] = { ...faqs[fIdx], aAm: e.target.value };
                            setContentDraft(c => ({...c, faqs}));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New FAQ Card */}
                <div className="admin-add-faq-card">
                  <h5 className="admin-add-faq-title">+ Add New FAQ</h5>
                  <div className="apt-split-grid" style={{gap:'.75rem'}}>
                    <input
                      className="bf-input"
                      placeholder="New Question (English)"
                      value={newFaq.qEn}
                      onChange={e => setNewFaq(f => ({...f, qEn: e.target.value}))}
                    />
                    <input
                      className="bf-input"
                      placeholder="አዲስ ጥያቄ (አማርኛ)"
                      value={newFaq.qAm}
                      onChange={e => setNewFaq(f => ({...f, qAm: e.target.value}))}
                    />
                  </div>
                  <div className="apt-split-grid" style={{gap:'.75rem', marginTop:'.75rem'}}>
                    <textarea
                      rows="2"
                      className="bf-input"
                      placeholder="Answer (English)"
                      value={newFaq.aEn}
                      onChange={e => setNewFaq(f => ({...f, aEn: e.target.value}))}
                    />
                    <textarea
                      rows="2"
                      className="bf-input"
                      placeholder="መልስ (አማርኛ)"
                      value={newFaq.aAm}
                      onChange={e => setNewFaq(f => ({...f, aAm: e.target.value}))}
                    />
                  </div>
                  <div style={{display:'flex', justifyContent:'flex-end', marginTop:'1rem'}}>
                    <button
                      className="aoc-btn-discuss"
                      onClick={() => {
                        if (newFaq.qEn.trim() || newFaq.qAm.trim()) {
                          const item = { ...newFaq, id: 'faq-' + Date.now() };
                          setContentDraft(c => ({ ...c, faqs: [...(c.faqs || []), item] }));
                          setNewFaq({ qEn: '', qAm: '', aEn: '', aAm: '' });
                        }
                      }}
                    >
                      + Add to FAQ List
                    </button>
                  </div>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'1.5rem'}}>
                  <button className="admin-lock-btn" style={{width:'auto', padding:'.65rem 1.75rem'}} onClick={() => saveContent('faqs')}>
                    Save All FAQs
                  </button>
                </div>
              </div>
            )}
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
                  Save Contract Template
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
                  Save Contract Template
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
                  Save Bank Accounts
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
                Save Bank Accounts
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

      {/* ── FULL ORDER EDIT MODAL ── */}
      {editingOrder && (
        <div className="aoc-modal-backdrop" onClick={() => !savingOrder && setEditingOrder(null)}>
          <div className="aoc-edit-modal-card" onClick={e => e.stopPropagation()}>
            <div className="aoc-modal-head">
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span className="aoc-category-tag" style={{textTransform:'uppercase'}}>{editingOrder.category || 'wedding'}</span>
                  <code style={{fontSize:'12px', color:'#bd2637', fontWeight:800}}>{editingOrder.id}</code>
                </div>
                <h3 style={{margin:'4px 0 0', fontSize:'1.2rem'}}>Edit Order Details &amp; Progress</h3>
              </div>
              <button
                type="button"
                className="aoc-modal-close"
                onClick={() => !savingOrder && setEditingOrder(null)}
              >
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={saveOrderEdits} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              <div className="aoc-form-grid">
                <div className="aoc-form-field">
                  <label>Client Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.clientName || ''}
                    onChange={e => setEditingOrder(o => ({...o, clientName: e.target.value}))}
                  />
                </div>
                <div className="aoc-form-field">
                  <label>Client Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editingOrder.phone || ''}
                    onChange={e => setEditingOrder(o => ({...o, phone: e.target.value}))}
                  />
                </div>
              </div>

              <div className="aoc-form-grid">
                <div className="aoc-form-field">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={editingOrder.eventDate || ''}
                    onChange={e => setEditingOrder(o => ({...o, eventDate: e.target.value}))}
                  />
                </div>
                <div className="aoc-form-field">
                  <label>Event Location / Venue</label>
                  <input
                    type="text"
                    value={editingOrder.location || ''}
                    onChange={e => setEditingOrder(o => ({...o, location: e.target.value}))}
                    placeholder="e.g. Addis Ababa / Skylight Hotel"
                  />
                </div>
              </div>

              <div className="aoc-form-grid">
                <div className="aoc-form-field">
                  <label>Package Name</label>
                  <input
                    type="text"
                    value={editingOrder.packageName || ''}
                    onChange={e => setEditingOrder(o => ({...o, packageName: e.target.value}))}
                  />
                </div>
                <div className="aoc-form-field">
                  <label>Event Category</label>
                  <select
                    value={editingOrder.category || 'wedding'}
                    onChange={e => setEditingOrder(o => ({...o, category: e.target.value}))}
                  >
                    <option value="wedding">Wedding (ሰርግ)</option>
                    <option value="birthday">Birthday (ልደት)</option>
                    <option value="commercial">Commercial / Corporate</option>
                    <option value="melse">Melse (መልስ)</option>
                    <option value="studio">Studio Session</option>
                  </select>
                </div>
              </div>

              <div className="aoc-form-grid" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
                <div className="aoc-form-field">
                  <label>Total Price (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingOrder.totalPrice ?? ''}
                    onChange={e => setEditingOrder(o => ({...o, totalPrice: Number(e.target.value)}))}
                  />
                </div>
                <div className="aoc-form-field">
                  <label>Deposit Amount (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingOrder.depositAmount ?? ''}
                    onChange={e => setEditingOrder(o => ({...o, depositAmount: Number(e.target.value)}))}
                  />
                </div>
                <div className="aoc-form-field">
                  <label>Remaining Balance (ETB)</label>
                  <input
                    type="text"
                    readOnly
                    style={{background:'#f8fafc', color:'#64748b', fontWeight:700}}
                    value={((Number(editingOrder.totalPrice) || 0) - (Number(editingOrder.depositAmount) || 0)).toLocaleString() + ' ETB'}
                  />
                </div>
              </div>

              <div className="aoc-form-grid">
                <div className="aoc-form-field">
                  <label>Payment Method</label>
                  <select
                    value={editingOrder.paymentMethod || 'telebirr'}
                    onChange={e => setEditingOrder(o => ({...o, paymentMethod: e.target.value}))}
                  >
                    <option value="telebirr">Telebirr Mobile Money</option>
                    <option value="cbe">CBE Commercial Bank Transfer</option>
                    <option value="cash">Cash at Studio</option>
                    <option value="bank_transfer">Other Bank Transfer</option>
                  </select>
                </div>
                <div className="aoc-form-field">
                  <label>Payment Txn / Ref Number</label>
                  <input
                    type="text"
                    value={editingOrder.paymentReference || ''}
                    onChange={e => setEditingOrder(o => ({...o, paymentReference: e.target.value}))}
                    placeholder="e.g. CBE982736192 or Telebirr Trans ID"
                  />
                </div>
              </div>

              <div className="aoc-form-grid" style={{background:'#fdf4f4', padding:'12px', borderRadius:'12px', border:'1px solid #fecaca'}}>
                <div className="aoc-form-field">
                  <label style={{color:'#991b1b'}}>Payment Verification Status</label>
                  <select
                    value={editingOrder.paymentStatus || 'PENDING_VERIFICATION'}
                    onChange={e => setEditingOrder(o => ({...o, paymentStatus: e.target.value}))}
                    style={{borderColor:'#f87171', fontWeight:700}}
                  >
                    <option value="PENDING_VERIFICATION">⏳ PENDING VERIFICATION (Reviewing)</option>
                    <option value="VERIFIED">✅ VERIFIED (Deposit Confirmed)</option>
                    <option value="REJECTED">❌ REJECTED (Invalid / Rejected Proof)</option>
                    <option value="UNPAID">⚪ UNPAID (No Deposit Yet)</option>
                  </select>
                </div>
                <div className="aoc-form-field">
                  <label style={{color:'#991b1b'}}>Production Job Stage</label>
                  <select
                    value={editingOrder.jobStatus || 'SCHEDULED'}
                    onChange={e => setEditingOrder(o => ({...o, jobStatus: e.target.value}))}
                    style={{borderColor:'#f87171', fontWeight:700}}
                  >
                    <option value="SCHEDULED">1. SCHEDULED — Booking Reserved &amp; Date Locked</option>
                    <option value="PREP">2. PREP — Pre-Shoot Preparation &amp; Briefing</option>
                    <option value="IN_PRODUCTION">3. IN_PRODUCTION — Shoot Day Coverage</option>
                    <option value="EDITING">4. EDITING — Cinema Editing, Color &amp; Grading</option>
                    <option value="COMPLETED">5. COMPLETED — Ready for Pickup / Delivered</option>
                  </select>
                </div>
              </div>

              <div className="aoc-form-field">
                <label>Client / Internal Production Notes</label>
                <textarea
                  rows="3"
                  value={editingOrder.notes || ''}
                  onChange={e => setEditingOrder(o => ({...o, notes: e.target.value}))}
                  placeholder="Special client wishes, garden preferences, camera crew assignments, etc."
                />
              </div>

              <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'8px'}}>
                <button
                  type="button"
                  className="apt-btn-secondary"
                  disabled={savingOrder}
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aoc-btn-approve"
                  disabled={savingOrder}
                  style={{padding:'0.65rem 1.5rem'}}
                >
                  {savingOrder ? <span className="brc-spinner"/> : <Check size={16}/>}
                  {savingOrder ? 'Saving to Database...' : 'Save & Sync to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ORDER NOTES & COMMENTS DRAWER / MODAL ── */}
      {orderCommentsModal && (
        <div className="aoc-modal-backdrop" onClick={() => setOrderCommentsModal(null)}>
          <div className="aoc-edit-modal-card" style={{maxWidth:'600px'}} onClick={e => e.stopPropagation()}>
            <div className="aoc-modal-head">
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <MessageCircle size={16} color="#bd2637"/>
                  <span style={{fontSize:'12px', fontWeight:800, color:'#bd2637'}}>ORDER DISCUSSION &amp; CLIENT NOTES</span>
                </div>
                <h3 style={{fontSize:'1.1rem', margin:'4px 0 0'}}>{orderCommentsModal.clientName} (<code>{orderCommentsModal.id}</code>)</h3>
              </div>
              <button
                type="button"
                className="aoc-modal-close"
                onClick={() => setOrderCommentsModal(null)}
              >
                <X size={18}/>
              </button>
            </div>

            {/* Comments Thread */}
            <div style={{maxHeight:'320px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px', padding:'10px 0'}}>
              {loadingComments ? (
                <div className="apt-empty-state" style={{padding:'20px'}}>
                  <div className="brc-spinner"/> Loading client notes...
                </div>
              ) : orderCommentsList.length === 0 ? (
                <div className="apt-empty-state" style={{padding:'20px'}}>
                  <MessageCircle size={32} color="#94a3b8"/>
                  <h4 style={{fontSize:'14px', margin:'8px 0 2px'}}>No Notes Left Yet</h4>
                  <p style={{fontSize:'12px'}}>The client has not posted any extra notes on the tracking portal.</p>
                </div>
              ) : (
                orderCommentsList.map((c, i) => {
                  const isAdmin = c.sender === 'admin';
                  return (
                    <div
                      key={c.id || i}
                      style={{
                        display:'flex',
                        flexDirection:'column',
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth:'85%',
                        background: isAdmin ? '#fdf2f2' : '#f1f5f9',
                        border: isAdmin ? '1px solid #fecaca' : '1px solid #e2e8f0',
                        borderRadius:'12px',
                        padding:'10px 14px'
                      }}
                    >
                      <div style={{display:'flex', justifyContent:'space-between', gap:'12px', marginBottom:'4px'}}>
                        <strong style={{fontSize:'11px', color: isAdmin ? '#bd2637' : '#0f172a'}}>
                          {isAdmin ? '🎬 HOPE Studio Director' : (c.senderName || 'Client')}
                        </strong>
                        <span style={{fontSize:'10px', color:'#94a3b8'}}>
                          {c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                        </span>
                      </div>
                      <p style={{margin:0, fontSize:'13px', color:'#1e293b', whiteSpace:'pre-wrap', lineHeight:1.4}}>
                        {c.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Reply by Studio Director */}
            <form onSubmit={sendDirectorComment} style={{display:'flex', flexDirection:'column', gap:'8px', borderTop:'1px solid #e2e8f0', paddingTop:'12px'}}>
              <label style={{fontSize:'11px', fontWeight:700, color:'#475569'}}>Reply as Studio Director:</label>
              <textarea
                rows="2"
                className="bf-input"
                style={{fontSize:'13px', padding:'8px 12px'}}
                placeholder="Type a response or status update for the client to see on their portal..."
                value={directorNoteText}
                onChange={e => setDirectorNoteText(e.target.value)}
              />
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'4px'}}>
                <a
                  href={`/?order=${orderCommentsModal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aoc-btn-portal"
                  style={{fontSize:'11px', padding:'5px 10px'}}
                >
                  <ExternalLink size={12}/> Open Live Client Portal
                </a>
                <button
                  type="submit"
                  className="aoc-btn-approve"
                  disabled={sendingDirectorNote || !directorNoteText.trim()}
                  style={{padding:'6px 14px', fontSize:'12px'}}
                >
                  {sendingDirectorNote ? <span className="brc-spinner"/> : <Send size={13}/>}
                  {sendingDirectorNote ? 'Posting...' : 'Post Director Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADMIN QR SCANNER & INSTANT PAYMENT VERIFICATION MODAL ── */}
      {adminScanModal && (
        <div className="aoc-modal-backdrop" onClick={() => setAdminScanModal(false)}>
          <div className="aoc-edit-modal-card" style={{ maxWidth: '600px', borderRadius: '20px' }} onClick={e => e.stopPropagation()}>
            <div className="aoc-modal-head" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Payment QR Scanner</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Scan or paste QR / Order link to instantly check payment verification</p>
                </div>
              </div>
              <button type="button" className="aoc-modal-close" onClick={() => setAdminScanModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search / Scan Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Scan Barcode / Camera or Enter Order ID / URL:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. HOPE-12345 or paste http://.../?order=..."
                    value={scannedInput}
                    onChange={e => {
                      const val = e.target.value;
                      setScannedInput(val);
                      const cleanId = val.replace(/.*[?&]order=/, '').split('&')[0].trim();
                      const found = orders.find(o => o.id === cleanId || o.id === val.trim() || (cleanId && o.id && o.id.includes(cleanId)));
                      if (found) setScannedOrder(found);
                    }}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: '10px',
                      border: '2px solid #cbd5e1', fontSize: '14px', fontWeight: 600
                    }}
                  />
                  {scannedInput && (
                    <button
                      type="button"
                      className="apt-btn-secondary"
                      onClick={() => { setScannedInput(''); setScannedOrder(null); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Select list if nothing searched yet */}
              {!scannedOrder && !scannedInput && (
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Or select an order waiting for verification:</span>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {orders.slice(0, 6).map(o => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => { setScannedOrder(o); setScannedInput(o.id); }}
                        style={{
                          textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
                          border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{o.clientName}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({o.id})</span>
                        </div>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px',
                          background: o.paymentStatus === 'VERIFIED' ? '#dcfce7' : '#fef3c7',
                          color: o.paymentStatus === 'VERIFIED' ? '#15803d' : '#b45309'
                        }}>
                          {o.paymentStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scanned Order Details & "IS PAYMENT VERIFIED?" */}
              {scannedOrder && (() => {
                const isVerified = scannedOrder.paymentStatus === 'VERIFIED' || scannedOrder.status === 'CONFIRMED';
                const total = Number(scannedOrder.totalPrice || scannedOrder.basePrice || 0);
                const dep = Number(scannedOrder.depositAmount || Math.round(total * 0.5));
                const rem = total - dep;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    {/* GIANT "IS PAYMENT VERIFIED?" BANNER */}
                    <div style={{
                      padding: '16px 20px', borderRadius: '16px',
                      background: isVerified ? '#ecfdf5' : '#fffbeb',
                      border: isVerified ? '2px solid #10b981' : '2px solid #f59e0b',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isVerified ? (
                          <CheckCircle2 size={32} color="#059669" />
                        ) : (
                          <Clock size={32} color="#d97706" />
                        )}
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', color: isVerified ? '#047857' : '#b45309' }}>
                            IS PAYMENT VERIFIED?
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isVerified ? '#065f46' : '#92400e' }}>
                            {isVerified ? '✅ YES — PAYMENT VERIFIED' : '⏳ PENDING VERIFICATION'}
                          </div>
                          <div style={{ fontSize: '12px', color: isVerified ? '#047857' : '#b45309' }}>
                            {isVerified ? '50% Advance deposit locked and verified' : 'Payment receipt uploaded — awaiting verification'}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isVerified ? (
                        <button
                          type="button"
                          className="aoc-btn-approve"
                          style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 800, background: '#16a34a' }}
                          onClick={async () => {
                            await updateOrderPaymentStatus(scannedOrder.id, 'VERIFIED');
                            setScannedOrder(prev => ({ ...prev, paymentStatus: 'VERIFIED', status: 'CONFIRMED' }));
                          }}
                        >
                          <Check size={16} /> Verify &amp; Confirm Payment
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="aoc-btn-reject"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                          onClick={async () => {
                            await updateOrderPaymentStatus(scannedOrder.id, 'PENDING_VERIFICATION');
                            setScannedOrder(prev => ({ ...prev, paymentStatus: 'PENDING_VERIFICATION', status: 'PENDING_VERIFICATION' }));
                          }}
                        >
                          Mark as Pending
                        </button>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Total Package</div>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{total.toLocaleString()} ETB</strong>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>50% Deposit Due</div>
                        <strong style={{ fontSize: '14px', color: '#16a34a' }}>{dep.toLocaleString()} ETB</strong>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Remaining Balance</div>
                        <strong style={{ fontSize: '14px', color: '#64748b' }}>{rem.toLocaleString()} ETB</strong>
                      </div>
                    </div>

                    {/* Client & Proof Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><strong>Client:</strong> {scannedOrder.clientName}</div>
                        <div><strong>Phone:</strong> <a href={`tel:${scannedOrder.phone}`}>{scannedOrder.phone}</a></div>
                        <div><strong>Date:</strong> {scannedOrder.eventDate || '—'}</div>
                        <div><strong>Package:</strong> {scannedOrder.packageName}</div>
                        <div><strong>Method:</strong> {(scannedOrder.paymentMethod || 'Telebirr').toUpperCase()}</div>
                        {scannedOrder.paymentReference && (
                          <div><strong>Ref #:</strong> <code>{scannedOrder.paymentReference}</code></div>
                        )}
                      </div>

                      {/* Payment Proof Preview */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Receipt Screenshot:</div>
                        {scannedOrder.paymentProof ? (
                          <div
                            onClick={() => setReceiptModalImg(scannedOrder.paymentProof)}
                            style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '90px' }}
                          >
                            <img src={scannedOrder.paymentProof} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div style={{ height: '90px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94a3b8' }}>
                            No Screenshot Attached
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Portal link */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <a
                        href={`/?order=${scannedOrder.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="aoc-btn-portal"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        <ExternalLink size={13} /> Open Order Status Page
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW CUSTOM AGREEMENT LINK GENERATED MODAL ── */}
      {savedLinkModal && (
        <div className="aoc-modal-backdrop" onClick={() => setSavedLinkModal(null)}>
          <div className="aoc-edit-modal-card" style={{ maxWidth: '540px', borderRadius: '20px' }} onClick={e => e.stopPropagation()}>
            <div className="aoc-modal-head" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#5c4b2a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Agreement Ready for Client</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Custom contract saved. Send this link for client to review and sign.</p>
                </div>
              </div>
              <button type="button" className="aoc-modal-close" onClick={() => setSavedLinkModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <div><strong>Client:</strong> {savedLinkModal.agreement.clientName || 'Valued Client'}</div>
                <div><strong>Package:</strong> {savedLinkModal.agreement.packageTitle || savedLinkModal.agreement.name}</div>
                <div><strong>Agreed Price:</strong> {(savedLinkModal.agreement.price || 0).toLocaleString()} ETB (50% Deposit: {Math.round((savedLinkModal.agreement.price || 0) * 0.5).toLocaleString()} ETB)</div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Official Client Review &amp; Signing URL:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    readOnly
                    value={savedLinkModal.url}
                    onFocus={e => e.target.select()}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  />
                  <button
                    type="button"
                    className="aoc-btn-approve"
                    style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
                    onClick={() => copyAgreementLink(savedLinkModal.url)}
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <a
                  href={savedLinkModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="aoc-btn-discuss"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px' }}
                >
                  <ExternalLink size={14} /> Preview Client View
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(savedLinkModal.url)}&text=${encodeURIComponent(`Hello ${savedLinkModal.agreement.clientName || ''}, here is your customized HOPE Photo & Velo agreement to review and digitally sign:`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="vop-tg-pill-btn"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', borderRadius: '8px' }}
                >
                  <Send size={14} /> Share on Telegram
                </a>
              </div>
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
      ? `\n\nIncluded Deliverables (${deliverables.length}):\n` + deliverables.map(d => `• ${d}`).join('\n')
      : selectedPackage?.servicesList?.length
      ? `\n\nIncluded Services:\n` + selectedPackage.servicesList.join('\n')
      : '';

    const formattedMessage = `NEW BOOKING REQUEST — HOPE PHOTO & VELO\n\n` +
      `Package: ${pkgName}\n` +
      `Official Price: ${selectedPackage?.price ? selectedPackage.price + ' ETB' : 'Standard Rate'}` +
      deliverablesText + `\n\n` +
      `Client Name: ${form.name}\n` +
      `Target Date: ${form.date}\n` +
      `Phone: ${form.phone}\n` +
      `Note / Details: ${form.note || 'N/A'}`;

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
                <span className="bss-label"><User size={13}/> {lang === 'am' ? 'ሙሉ ስም:' : 'Full Name:'}</span>
                <strong className="bss-val">{createdOrder?.name || form.name}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label"><Phone size={13}/> {lang === 'am' ? 'ስልክ ቁጥር:' : 'Phone:'}</span>
                <strong className="bss-val">{createdOrder?.phone || form.phone}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label"><CalendarDays size={13}/> {lang === 'am' ? 'የቀጠሮ ቀን:' : 'Event Date:'}</span>
                <strong className="bss-val">{createdOrder?.date || form.date}</strong>
              </div>
              {form.note && (
                <div className="bss-row">
                  <span className="bss-label"><FileText size={13}/> {lang === 'am' ? 'ማስታወሻ:' : 'Note:'}</span>
                  <span className="bss-val">{form.note}</span>
                </div>
              )}
              <div className="bss-row">
                <span className="bss-label"><Package size={13}/> {lang === 'am' ? 'የመረጡት ፓኬጅ:' : 'Package:'}</span>
                <strong className="bss-val">{pkgName}</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label"><CreditCard size={13}/> {lang === 'am' ? 'ይፋዊ ዋጋ:' : 'Price:'}</span>
                <strong className="bss-val bss-price">{selectedPackage?.price} ETB</strong>
              </div>
              <div className="bss-row">
                <span className="bss-label"><Hash size={13}/> {lang === 'am' ? 'የትእዛዝ መለያ:' : 'Order ID:'}</span>
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
// Unique single hero image per package ID — hand-picked after viewing all photos
const PKG_CARD_IMAGE = {
  // Studio: daytime park couple on railing (green trees)
  'studio-10k':           `${ASSET}/hero-card-2.jpg`,
  // Studio mid: solo bride with bouquet, urban park
  'studio-145k':          `${ASSET}/gallery/photo_2026-07-03_20-34-45_7668160982247493632.jpg`,
  // Studio premium: solo bride over-shoulder lush green
  'studio-185k':          `${ASSET}/gallery/photo_2026-07-03_20-34-55_7668161038802964480.jpg`,
  // Wedding bronze: face-to-face laughing couple, forest
  'wedding-bronze':       `${ASSET}/hero-card-1.jpg`,
  // Wedding silver: different couple at golden sunset, crown
  'wedding-silver':       `${ASSET}/gallery/photo_2026-07-03_20-31-17_7668160925976699904.jpg`,
  // Wedding golden 75k: couple with long veil, dramatic dusk
  'wedding-golden-75':    `${ASSET}/gallery/photo_2026-07-03_20-31-27_7668160963138437120.jpg`,
  // Wedding golden plus (fallback tier)
  'wedding-golden-plus':  `${ASSET}/gallery/photo_2026-07-03_20-31-22_7668160935271833600.jpg`,
  // Mesk: lady in black gown, city nightscape
  'mesk-16k':             `${ASSET}/gallery/photo_2026-07-03_20-37-48_7668161057622723584.jpg`,
  // Mesk premium: romantic close moment, dark blue night
  'mesk-20k':             `${ASSET}/gallery/photo_2026-07-03_20-37-56_7668161066939796480.jpg`,
  // Mesk grand keepsake: couple in white daisy field
  'mesk-grand-keepsake':  `${ASSET}/gallery/photo_2026-07-03_20-37-55_7668161085785812992.jpg`,
  // Special: couple in white daisy field, dramatic dark forest
  'special-23k':          `${ASSET}/gallery/photo_2026-07-03_20-37-55_7668161085785812992.jpg`,
  // Admin panel package IDs
  'studio-session':       `${ASSET}/hero-card-2.jpg`,
  'studio-event':         `${ASSET}/gallery/photo_2026-07-03_20-34-45_7668160982247493632.jpg`,
  'studio-production':    `${ASSET}/gallery/photo_2026-07-03_20-34-55_7668161038802964480.jpg`,
  'mesk-session':         `${ASSET}/gallery/photo_2026-07-03_20-37-48_7668161057622723584.jpg`,
  'mesk-album':           `${ASSET}/gallery/photo_2026-07-03_20-37-56_7668161066939796480.jpg`,
};

function PackageCardImage({ pkgId, pkg }) {
  let src = PKG_CARD_IMAGE[pkgId];
  if (!src && pkg) {
    const pid = (pkg.id || pkgId || '').toLowerCase();
    if (pid.includes('10k')) src = PKG_CARD_IMAGE['studio-10k'];
    else if (pid.includes('145k') || pid.includes('14k')) src = PKG_CARD_IMAGE['studio-145k'];
    else if (pid.includes('185k') || pid.includes('18k')) src = PKG_CARD_IMAGE['studio-185k'];
    else if (pid.includes('bronze') || pid.includes('45k') || pid.includes('34k')) src = PKG_CARD_IMAGE['wedding-bronze'];
    else if (pid.includes('silver') || pid.includes('60k') || pid.includes('40k') || pid.includes('50k')) src = PKG_CARD_IMAGE['wedding-silver'];
    else if (pid.includes('golden') || pid.includes('75k') || pid.includes('70k')) src = PKG_CARD_IMAGE['wedding-golden-75'];
    else if (pid.includes('16k')) src = PKG_CARD_IMAGE['mesk-16k'];
    else if (pid.includes('20k')) src = PKG_CARD_IMAGE['mesk-20k'];
    else if (pid.includes('23k') || pid.includes('special')) src = PKG_CARD_IMAGE['special-23k'];
    else {
      const p = parseInt((pkg.price || '0').toString().replace(/[^0-9]/g, ''), 10);
      if (p <= 12000) src = PKG_CARD_IMAGE['studio-10k'];
      else if (p <= 15000) src = PKG_CARD_IMAGE['studio-145k'];
      else if (p <= 19000) src = PKG_CARD_IMAGE['studio-185k'];
      else if (p <= 48000) src = PKG_CARD_IMAGE['wedding-bronze'];
      else if (p <= 65000) src = PKG_CARD_IMAGE['wedding-silver'];
      else if (p > 65000) src = PKG_CARD_IMAGE['wedding-golden-75'];
    }
  }
  if (!src) src = `${ASSET}/hero-card-1.jpg`;
  return (
    <div className="pkg-card-carousel">
      <img
        src={src}
        alt="Package preview"
        className="pkg-carousel-img pkg-carousel-active"
        loading="lazy"
      />
    </div>
  );
}

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
              {/* Package Hero Image — always top of card */}
              <PackageCardImage pkgId={pkg.id} pkg={pkg} />

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
                  onClick={() => openBooking(pkg, 1)}
                >
                  <FileText size={15} />
                  <span>{lang === 'am' ? 'በውል ያስይዙ (Agreement)' : lang === 'om' ? 'Waliigalaan Qabadhaa' : 'Book with Agreement'}</span>
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="card-v2-tg-inquire"
                  onClick={(e) => {
                    e.stopPropagation();
                    openBooking(pkg, 5);
                  }}
                  title="Talk with Telegram Bot"
                >
                  <MessageCircle size={14} />
                  <span>{lang === 'am' ? 'ከቦት ጋር ይወያዩ (Talk with Bot)' : lang === 'om' ? 'Bootii Waliin Haasawaa' : 'Talk with Bot'}</span>
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
    <div className="asp-screen">
      <div className="brc-spinner" style={{width:40,height:40,borderWidth:3}}/> &nbsp; Loading agreement...
    </div>
  );
  if (error && !agreement) return (
    <div className="asp-screen asp-error-screen">
      <Shield size={48}/><h2>{error}</h2>
      <a href="/" style={{color:'#bd2637',fontWeight:700}}>← Return to HOPE Studio</a>
    </div>
  );
  if (submitted) return (
    <div className="asp-screen asp-submitted-screen">
      <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#16a34a,#15803d)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 10px 25px rgba(22,163,74,0.3)'}}>
        <Check size={36} color="#fff"/>
      </div>
      <h2 style={{color:'#16a34a',fontSize:28,fontWeight:800}}>Agreement Signed!</h2>
      <p style={{color:'var(--muted)',maxWidth:400,textAlign:'center'}}>Your HOPE Studio service agreement has been digitally signed and recorded. Our team will contact you shortly.</p>
      <div className="asp-summary-card">
        <p style={{margin:'0 0 8px'}}><strong>Package:</strong> {agreement?.packageTitle}</p>
        <p style={{margin:'0 0 8px'}}><strong>Total:</strong> {(agreement?.price||0).toLocaleString()} ETB</p>
        <p style={{margin:0}}><strong>50% Deposit:</strong> {Math.round((agreement?.price||0)*0.5).toLocaleString()} ETB</p>
      </div>
      <a href={`tel:+251910526962`} style={{display:'inline-flex',alignItems:'center',gap:6,color:'#bd2637',textDecoration:'none',fontSize:18,fontWeight:800}}>
        <Phone size={18}/> 09 10 52 69 62
      </a>
      <a href="/" style={{color:'var(--muted)',fontSize:14,fontWeight:600}}>← Return to HOPE Studio</a>
    </div>
  );

  const price = agreement?.price || order?.totalPrice || 0;
  const deposit = agreement?.depositAmount || Math.round(price * 0.5);
  const remaining = price - deposit;

  return (
    <div className="asp-wrap">
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

        <div className="doc-no-print asp-terms-box">
          <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer'}}>
            <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} style={{marginTop:3,accentColor:'#bd2637'}}/>
            <span className="asp-terms-text" style={{fontSize:13,lineHeight:1.5,fontWeight:600}}>
              {lang === 'am'
                ? 'ከላይ በሰነዱ የተዘረዘሩትን ሁሉ አንብቤ ተቀብያለሁ። የ 50% ቅድሚያ ክፍያ ሁኔታን አረጋግጣለሁ።'
                : 'I have reviewed and agree to all terms in this document. I accept the 50% advance deposit requirement.'}
            </span>
          </label>

          {error && <p style={{color:'#dc2626',fontSize:13,marginTop:12,fontWeight:600}}>{error}</p>}

          <button
            onClick={handleSign}
            disabled={submitting || !signature || !termsAccepted}
            style={{
              width:'100%',marginTop:16,padding:'14px 24px',background:'linear-gradient(135deg,#bd2637,#9b1c2b)',
              color:'#ffffff',fontWeight:800,fontSize:15,border:'none',borderRadius:999,cursor:'pointer',
              opacity: (submitting||!signature||!termsAccepted) ? 0.5 : 1,
              boxShadow: '0 8px 20px rgba(189,38,55,0.25)'
            }}
          >
            {submitting ? 'Submitting...' : lang === 'am' ? 'ስምምነቱን በዲጂታል ፊርማ አጽድቅ (Accept & Sign)' : 'Accept & Sign Agreement'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── APP ────────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded]     = useState(false);
  const [lang, setLang]         = useState('am');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [bookingInitialStep, setBookingInitialStep] = useState(1);
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

  // URL-based order status tracking (?order=HOPE-xxx or #order/HOPE-xxx)
  const [viewOrderId, setViewOrderId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const fromQuery = new URLSearchParams(window.location.search).get('order');
    if (fromQuery) return fromQuery;
    if (window.location.hash.startsWith('#order/')) return window.location.hash.replace('#order/', '');
    return null;
  });

  useEffect(() => {
    const checkOrderUrl = () => {
      const fromQuery = new URLSearchParams(window.location.search).get('order');
      if (fromQuery) { setViewOrderId(fromQuery); return; }
      if (window.location.hash.startsWith('#order/')) {
        setViewOrderId(window.location.hash.replace('#order/', ''));
        return;
      }
    };
    window.addEventListener('popstate', checkOrderUrl);
    window.addEventListener('hashchange', checkOrderUrl);
    return () => {
      window.removeEventListener('popstate', checkOrderUrl);
      window.removeEventListener('hashchange', checkOrderUrl);
    };
  }, []);

  const t = T[lang];

  // Set permanent light mode & clear legacy theme preferences
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    try {
      localStorage.removeItem('hope_theme');
    } catch {}
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langDropOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.lang-dropdown-wrap')) setLangDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langDropOpen]);

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
    if (showAdmin || signId || viewOrderId) {
      document.body.style.overflow = '';
      return () => { document.body.style.overflow = ''; };
    }
    document.body.style.overflow = (!loaded || bookingPkg) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loaded, bookingPkg, showAdmin, signId, viewOrderId]);

  const openBooking = (pkg = null, initialStep = 1) => {
    setBookingPkg(pkg || PACKAGES_BY_CATEGORY.wedding[0]);
    setBookingInitialStep(initialStep);
    setMenuOpen(false);
    setLangDropOpen(false);
  };
  const nav = (section) => { scrollToSection(section); setMenuOpen(false); };

  const LANG_OPTIONS = [
    { code: 'am', label: 'አማርኛ', short: 'አማ' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'om', label: 'Afaan Oromoo', short: 'OR' },
  ];
  const currentLangOpt = LANG_OPTIONS.find(l => l.code === lang) || LANG_OPTIONS[0];

  const locImgs = [galleryImages[1].src, galleryImages[3].src, galleryImages[5].src];

  if (viewOrderId) {
    return (
      <OrderStatusPage
        orderId={viewOrderId}
        lang={lang}
        onBack={() => {
          setViewOrderId(null);
          if (window.location.search.includes('order=')) {
            const params = new URLSearchParams(window.location.search);
            params.delete('order');
            const newSearch = params.toString() ? `?${params.toString()}` : '';
            window.history.replaceState(null, '', window.location.pathname + newSearch);
          }
          if (window.location.hash.startsWith('#order/')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
      />
    );
  }

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
            <button type="button" onClick={() => nav('story')}>{t.nav.about}</button>
            <button type="button" onClick={() => nav('work')}>{t.nav.work}</button>
            <button type="button" onClick={() => nav('craft')}>{t.nav.craft}</button>
            <button type="button" onClick={() => nav('locations')}>{t.nav.locations}</button>
            <button type="button" onClick={() => nav('pricing')}>{t.nav.pricing}</button>
            <button type="button" onClick={() => nav('faq')}>{t.nav.faq}</button>

            {/* Mobile Menu Extras (strictly hidden on desktop, only rendered in mobile drawer) */}
            {menuOpen && (
              <div className="mobile-menu-extras">
                <div className="mobile-lang-select-wrap">
                  <div className="mobile-lang-header">
                    <Globe size={13} />
                    <span>ቋንቋ / LANGUAGE</span>
                  </div>
                  <div className="mobile-lang-options">
                    {LANG_OPTIONS.map(opt => (
                      <button
                        key={opt.code}
                        type="button"
                        className={`mobile-lang-opt ${lang === opt.code ? 'mobile-lang-active' : ''}`}
                        onClick={() => { setLang(opt.code); setMenuOpen(false); }}
                      >
                        {lang === opt.code && <Check size={12}/>} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <a
                  className="mobile-direct-chat-btn"
                  href="https://t.me/HoopStudioSystemBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle size={15} />
                  <span>{lang === 'am' ? 'ቀጥታ ቻት (Direct Chat)' : lang === 'om' ? 'Haasawa Kallattii' : 'Direct Chat'}</span>
                </a>
              </div>
            )}
          </nav>

          <div className="header-right">
            <a className="header-call-btn" href={`tel:${PHONE_LINK}`} aria-label="Call HOPE">
              <Phone size={13} className="header-call-icon" />
              <span className="call-text">{PHONE_DISPLAY}</span>
            </a>

            {/* Language Dropdown */}
            <div className="lang-dropdown-wrap">
              <button
                type="button"
                className={`lang-toggle lang-dropdown-trigger ${langDropOpen ? 'is-active' : ''}`}
                onClick={() => setLangDropOpen(o => !o)}
                aria-label="Switch language"
                aria-expanded={langDropOpen}
              >
                <Globe size={13} className="lang-icon" />
                <span className="lang-code-txt">{currentLangOpt.short}</span>
                <ChevronDown size={12} className={`lang-chevron ${langDropOpen ? 'is-open' : ''}`} />
              </button>
              {langDropOpen && (
                <div className="lang-dropdown-menu" role="listbox">
                  <div className="lang-dropdown-label">ቋንቋ / Language</div>
                  {LANG_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      type="button"
                      className={`lang-drop-item ${lang === opt.code ? 'lang-drop-active' : ''}`}
                      role="option"
                      aria-selected={lang === opt.code}
                      onClick={() => { setLang(opt.code); setLangDropOpen(false); }}
                    >
                      <span className="lang-drop-flag">{opt.code === 'am' ? '🇪🇹' : opt.code === 'en' ? '🇬🇧' : '🌿'}</span>
                      <span className="lang-drop-name">{opt.label}</span>
                      {lang === opt.code && <Check size={13} className="lang-check-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>


            <button type="button" className="header-book" onClick={() => openBooking()}>
              <span>{t.bookBtn}</span>
              <CalendarDays size={14} />
            </button>
            <button type="button" className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
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
          <div className="closing-art"><img src={galleryImages[2].src} alt="Wedding photo" /><div className="closing-star"><Sparkles size={16}/></div></div>
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
          <VeloBookingFlow
            selectedPackage={bookingPkg}
            onClose={() => setBookingPkg(null)}
            lang={lang}
            onLangChange={setLang}
            initialStep={bookingInitialStep}
          />
        )}
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
