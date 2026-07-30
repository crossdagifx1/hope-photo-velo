import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Camera, Check,
  ChevronDown, ChevronRight, ChevronUp, Film, Globe, Heart, Layers, Menu,
  MessageCircle, Phone, Play, Quote, Send, Sliders, Sparkles, Video, X,
} from 'lucide-react';
import './styles.css';

/* ── CONSTANTS ──────────────────────────────────────────────────────────── */
const PHONE_DISPLAY = '09 10 52 69 62';
const PHONE_LINK    = '+251910526962';
const TELEGRAM_LINK = 'https://t.me/hopephotovelo';
const ASSET         = '/assets';

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
    bookingSubmit: 'በቴሌግራም ቀጠሮ ይጀምሩ',
    successEyebrow: 'ለመገናኘት ዝግጁ ነን',
    successH2: 'መልእክትዎ በመላክ ላይ ነው።',
    successBody: 'የቀጠሮ ዝርዝርዎ በቴሌግራም ተከፍቷል። መልእክቱን ይላኩ፤ የ HOPE ቡድን ቀንዎን ያረጋግጥልዎታል።',
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
    heroText: 'Professional photography, videography & print services crafted for your most unforgettable celebrations.',
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
    bookingSubmit: 'Start Booking via Telegram',
    successEyebrow: 'We\'re Ready to Connect',
    successH2: 'Your message is on its way.',
    successBody: 'Your appointment details have opened in Telegram. Send the message and the HOPE team will confirm your date.',
    backBtn: 'Return to Homepage',
    noteName: 'Full Name',
  },
};

const packages = [
  { name: 'የስታዲዮ ፎቶ አገልግሎት', nameEn: 'Studio Photography Service', price: '18,500', type: 'የስታዲዮ ፎቶግራፍ', typeEn: 'Studio Photography', note: 'ለሚያምር የስታዲዮ ታሪክ', noteEn: 'For a beautiful studio story', details: ['የስታዲዮ ቀረጻ session', 'ሜካፕ የተካተተ (Makeup)', '30×45 ላሚኔት አልበም', 'የምስጋና ካርዶች', '150 ሶፍት ኮፒ ፎቶዎች'], detailsEn: ['Studio shoot session', 'Makeup included', '30×45 laminate album', 'Thank-you cards', '150 soft-copy photos'], source: 'photo_2026-07-03_14-14-17_7668160832798825472.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (2 ካሜራ)', nameEn: 'Wedding Photo & Video (2 Cameras)', price: '45,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', note: 'ለተዋበ የሰርግ በዓል', noteEn: 'For an elegant wedding celebration', details: ['2 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት', 'ሙሉ ኤዲት የተደረገ ቪዲዮ', 'ከለር ግሬዲንግ', 'ሁሉም ሶፍት ኮፒ ፎቶዎች'], detailsEn: ['2 cameras + Ronin gimbal', 'Aerial lighting', 'Fully edited video', 'Colour grading', 'All soft-copy photos'], source: 'photo_2026-07-03_14-14-17_7668160799898782720.jpg' },
  { name: 'የሰርግ ፎቶ፣ ቪዲዮ እና ሙዚቃ ቪዲዮ', nameEn: 'Wedding Photo, Video & Music Video', price: '50,000', type: 'የሰርግ ፎቶ + ሙዚቃ ቪዲዮ', typeEn: 'Wedding + Music Video', note: 'ለልዩ እና ትልልቅ አፍታዎችዎ', noteEn: 'For your special milestone moments', details: ['ሙዚቃ ቪዲዮ', '30×90 ላሚኔት አልበም', 'ቦርድ ፎቶ + ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሴቭ ዘ ዴት ፎቶዎች'], detailsEn: ['Music video', '30×90 laminate album', 'Board photo + sign board', 'Thank-you cards', 'Save-the-date photos'], source: 'photo_2026-07-03_14-14-19_7668160870092520448.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (3 ካሜራ)', nameEn: 'Wedding Photo & Video (3 Cameras)', price: '60,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', note: 'ተጨማሪ እይታዎች፣ ዘላቂ ትዝታዎች', noteEn: 'More angles, lasting memories', details: ['3 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት ቪዲዮ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ'], detailsEn: ['3 cameras + Ronin gimbal', 'Aerial lighting', 'Trailer + fully edited video', 'Colour grading', '40×60 board photo'], source: 'photo_2026-07-03_14-14-18_7668160879386824704.jpg' },
  { name: 'የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ)', nameEn: 'Wedding Photo & Video (4 Cameras)', price: '70,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', note: 'ሙሉ እና አጠቃላይ ሽፋን', noteEn: 'Full & comprehensive coverage', details: ['4 ካሜራ ሽፋን', 'ሮኒን ጊምባል + አየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት ቪዲዮ', '30×90 ላሚኔት አልበም', 'ፕሪሚየም ማስታወሻዎች'], detailsEn: ['4 camera coverage', 'Ronin gimbal + aerial lighting', 'Trailer + fully edited video', '30×90 laminate album', 'Premium keepsakes'], source: 'photo_2026-07-03_14-14-18_7668160851399477248.jpg' },
  { name: 'ሙሉ የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ ፕላስ)', nameEn: 'Full Wedding Photo & Video (4 Camera Plus)', price: '75,000', type: 'የሰርግ ፎቶ እና ቪዲዮ', typeEn: 'Wedding Photo & Video', note: 'ሙሉው የሰርግዎ ድንቅ ታሪክ', noteEn: 'The complete cinematic story of your wedding', details: ['4 ካሜራ ሽፋን', 'ሙሉ የቪዲዮ ኤዲቲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ ፎቶ', 'ፕሪሚየም ሳጥን'], detailsEn: ['4 camera coverage', 'Full video editing', '30×90 laminate album', '50×80 board photo', 'Premium delivery box'], source: 'photo_2026-07-03_14-14-18_7668160860798849024.jpg' },
];

const galleryImages = [
  ['photo_2026-07-03_20-31-22_7668160935271833600.jpg', 'Golden Hour Love', 'የፀሐይ መግቢያ ፍቅር'],
  ['photo_2026-07-03_20-34-45_7668160982247493632.jpg', 'Garden Portrait', 'የጋርደን ፎቶ'],
  ['photo_2026-07-03_20-37-55_7668161085785812992.jpg', 'Floral Archive', 'የአበባ ማህደር'],
  ['photo_2026-07-03_20-31-18_7668160944615066624.jpg', 'Bridal Beauty', 'የሙሽራዋ ውበት'],
  ['photo_2026-07-03_20-34-57_7668161010354493440.jpg', 'Quiet Joy', 'ጸጥተኛ ደስታ'],
  ['photo_2026-07-03_20-37-48_7668161057622723584.jpg', 'Evening Glamour', 'የምሽት ውበት'],
  ['photo_2026-07-03_20-35-00_7668161019770662912.jpg', 'Together in Nature', 'አብረው በተፈጥሮ ውስጥ'],
  ['photo_2026-07-03_20-35-01_7668161048338929664.jpg', 'First Glance', 'የመጀመሪያው እይታ'],
  ['photo_2026-07-03_20-37-56_7668161066939796480.jpg', 'Always Us', 'ሁልጊዜ እኛ'],
].map(([file, altEn, altAm]) => ({ src: `${ASSET}/gallery/${file}`, altEn, altAm }));

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
        <img src={`${ASSET}/hope-logo.gif`} alt="HOPE" />
        <span className="loader-name">HOPE</span>
        <span className="loader-sub">PHOTO & VELO</span>
      </div>
      <div className="loader-bar"><div className="loader-fill" /></div>
    </div>
  );
}

/* ── BOOKING PANEL ─────────────────────────────────────────────────────── */
function BookingPanel({ selectedPackage, onClose, lang }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', phone: '', note: '' });
  const t = T[lang];
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const pkgName = lang === 'en' ? (selectedPackage?.nameEn ?? 'HOPE Service') : (selectedPackage?.name ?? 'የ HOPE አገልግሎት');
  const submit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hello HOPE!\n\nService: ${pkgName}\n${t.noteName}: ${form.name}\nDate: ${form.date}\nPhone: ${form.phone}\nEvent: ${form.note}`);
    window.open(`${TELEGRAM_LINK}?start=booking&text=${msg}`, '_blank', 'noopener,noreferrer');
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
              <button className="primary-button form-button" type="submit">{t.bookingSubmit} <Send size={17} /></button>
            </form>
          </>
        )}
      </section>
    </div>
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

  const openBooking = (pkg = null) => { setBookingPkg(pkg ?? { name: 'የ HOPE አገልግሎት', nameEn: 'HOPE Service', price: 'TBD' }); setMenuOpen(false); };
  const nav = (t) => { scrollToSection(t); setMenuOpen(false); };
  const toggleLang = () => setLang(l => l === 'am' ? 'en' : 'am');

  const locImgs = [galleryImages[1].src, galleryImages[3].src, galleryImages[5].src];

  return (
    <>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <main className={loaded ? 'site-main main-visible' : 'site-main'}>

        {/* ── ANNOUNCEMENT ── */}
        <div className="announcement">
          <Sparkles size={13} /> <span>{t.announce[0]}</span><i /><span>{t.announce[1]}</span>
        </div>

        {/* ── HEADER ── */}
        <header className="site-header">
          <button className="brand" onClick={() => scrollToSection('home')} aria-label="HOPE">
            <img src={`${ASSET}/hope-logo.gif`} alt="HOPE" />
            <span>ፎቶ እና ቪዲዮ</span>
          </button>
          <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
            <button onClick={() => nav('story')}>{t.nav.about}</button>
            <button onClick={() => nav('work')}>{t.nav.work}</button>
            <button onClick={() => nav('craft')}>{t.nav.craft}</button>
            <button onClick={() => nav('locations')}>{t.nav.locations}</button>
            <button onClick={() => nav('process')}>{t.nav.process}</button>
            <button onClick={() => nav('pricing')}>{t.nav.pricing}</button>
            <button onClick={() => nav('testimonials')}>{t.nav.testimonials}</button>
            <button onClick={() => nav('faq')}>{t.nav.faq}</button>
            <a href={`tel:${PHONE_LINK}`}><Phone size={14} />{t.nav.call}</a>
          </nav>
          <div className="header-right">
            <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
              <Globe size={15} />{lang === 'am' ? 'EN' : 'አማ'}
            </button>
            <button className="header-book" onClick={() => openBooking()}>{t.bookBtn} <ArrowDownRight size={17} /></button>
          </div>
          <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button>
        </header>

        {/* ── HERO — inspired by reference image (photo strip below centered text) ── */}
        <section id="home" className="hero section-anchor">
          <Reveal className="hero-text-block">
            <p className="eyebrow hero-eyebrow"><Heart size={13} fill="currentColor" />{t.heroEyebrow}</p>
            <h1>{t.heroH1a}<br /><em>{t.heroH1b}</em></h1>
            <p className="hero-sub">{t.heroText}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => openBooking()}>{t.bookNow} <CalendarDays size={18} /></button>
              <a className="text-button hero-call" href={`tel:${PHONE_LINK}`}><Phone size={16} />{t.call} <span className="call-number">{PHONE_DISPLAY}</span></a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack"><span /><span /><span /></div>
              <p><strong>{t.heroProof[0]}</strong> {t.heroProof[1]}<br />{t.heroProof[2]}</p>
            </div>
          </Reveal>

          {/* Photo strip — like the reference design's bottom gallery */}
          <div className="hero-strip">
            {galleryImages.slice(0, 4).map((img, i) => (
              <div key={i} className={`hero-strip-item hero-strip-${i}`}>
                <img src={img.src} alt={lang === 'en' ? img.altEn : img.altAm} />
                {i === 0 && (
                  <div className="hero-strip-badge">
                    <span>HOPE</span><small>PHOTO & VELO</small><b>✦</b>
                  </div>
                )}
              </div>
            ))}
            <button className="hero-strip-cta" onClick={() => scrollToSection('work')}>
              <span>{t.heroScrollCta}</span><ArrowRight size={16} />
            </button>
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
            <img src={galleryImages[6].src} alt={lang === 'en' ? galleryImages[6].altEn : galleryImages[6].altAm} />
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
              <img src={galleryImages[activeImg].src} alt={lang === 'en' ? galleryImages[activeImg].altEn : galleryImages[activeImg].altAm} />
              <div className="photo-caption">
                <span>{t.workCaption}</span>
                <strong>{lang === 'en' ? galleryImages[activeImg].altEn : galleryImages[activeImg].altAm}</strong>
                <button onClick={() => setActiveImg((activeImg + 1) % galleryImages.length)}>{t.workNext} <ChevronRight size={15} /></button>
              </div>
            </article>
            <div className="mini-gallery">{galleryImages.slice(1, 5).map((p, i) => (
              <button className="mini-shot" key={i} onClick={() => setActiveImg(galleryImages.findIndex(g => g.src === p.src))}>
                <img src={p.src} alt={lang === 'en' ? p.altEn : p.altAm} />
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
              <p className="script">{lang === 'am' ? 'የቀረጻ አማራጭ' : 'Shooting Option'}</p>
              <h3>{t.locationsTitles[activeLocTab]}</h3>
              <p>{t.locationsDescs[activeLocTab]}</p>
              <button className="primary-button" onClick={() => openBooking()}>{t.locationsCta} <ArrowRight size={17} /></button>
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
        <section id="pricing" className="pricing section-anchor">
          <div className="pricing-heading">
            <div><p className="eyebrow">{t.pricingEyebrow}</p><h2>{t.pricingH2a}<br /><em>{t.pricingH2b}</em></h2></div>
            <p>{t.pricingNote}</p>
          </div>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <article className={i === 2 ? 'price-card featured-price' : 'price-card'} key={i}>
                <div className="price-top"><span>{lang === 'en' ? pkg.typeEn : pkg.type}</span>{i === 2 && <b>{t.pkgPopular}</b>}</div>
                <h3>{lang === 'en' ? pkg.nameEn : pkg.name}</h3>
                <p className="package-note">{lang === 'en' ? pkg.noteEn : pkg.note}</p>
                <div className="price"><strong>{pkg.price}</strong><span>ETB</span></div>
                <ul>{(lang === 'en' ? pkg.detailsEn : pkg.details).map((d, j) => <li key={j}><Check size={15} />{d}</li>)}</ul>
                <button className="package-button" onClick={() => openBooking(pkg)}>{t.pkgCta} <ArrowRight size={16} /></button>
                <img className="package-source" src={`${ASSET}/gallery/${pkg.source}`} alt={lang === 'en' ? pkg.nameEn : pkg.name} />
              </article>
            ))}
          </div>
          <div className="price-note"><Play size={14} fill="currentColor" />{t.priceDisclaimer}</div>
        </section>

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
                    <p>{faq.a}</p>
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
              <a className="call-light" href={`tel:${PHONE_LINK}`}><Phone size={16} />{PHONE_DISPLAY}</a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-brand">
            <img src={`${ASSET}/hope-logo.gif`} alt="HOPE" />
            <p>ፎቶ እና ቪዲዮ (VELO)<br /><span>{t.footerTagline}</span></p>
          </div>
          <div className="footer-links">
            <button onClick={() => scrollToSection('home')}>{lang === 'am' ? 'ዋና ገጽ' : 'Home'}</button>
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
