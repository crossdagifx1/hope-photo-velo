import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, CalendarDays, Camera, Check, ChevronDown, ChevronUp,
  Film, Globe, Heart, Layers, Menu, Phone, Quote, Send, Sliders,
  Sparkles, Video, X,
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
    lang: 'English',
    announce: ['የሰርግ ወቅት ደርሷል', 'የቀን ምዝገባ አሁን ክፍት ነው'],
    nav: { about: 'ስለ እኛ', work: 'ሥራ', craft: 'ቴክኖሎጂ', locations: 'ቦታዎች', process: 'ሂደት', pricing: 'አገልግሎቶች', faq: 'FAQ', call: 'ደውሉ' },
    bookBtn: 'ቀንዎን ያስይዙ',
    heroEyebrow: 'አዲስ አበባ · ፎቶ & ቪዲዮ',
    heroH1: ['ጊዜያት', 'ያልፋሉ፤', 'ትዝታ', 'ይቀራል።'],
    heroSub: 'ፕሮፌሽናል ፎቶ፣ ቪዲዮ & ህትመት አገልግሎቶች ለልዩ ቀንዎ።',
    bookNow: 'ቀን ያስይዙ',
    call: 'ደውሉ',
    proofNums: ['9+', '500+', '4K', '100%'],
    proofLabels: ['ዓመት ልምድ', 'የሰርግ ቀናት', 'ሲኒማ ጥራት', 'እርካታ'],
    storyEyebrow: 'ስለ እኛ',
    storyH: 'ስሜቱ & ትዝታው\nዋናው ነገር ነው።',
    storyBody: 'ሆፕ (HOPE) ከበስተጀርባ ሆኖ ሁሉንም ነገር የሚያስተውል ቡድን ነው — እጅ ለእጅ መያያዝ፣ የወላጆች የደስታ እንባ፣ ከፎቶ በኋላ የሚመጣው እውነተኛ ሳቅ። ያልተደገመውን ልዩ ቀንዎን ዘላቂ ታሪክ አድርጎ እናስቀርዋለን።',
    storyCta: 'ሥራዎቻችን',
    showcaseLabel: 'ተመረጡ ስራዎች',
    craftEyebrow: 'ቴክኖሎጂ & ጥራት',
    craftH: 'ከፍተኛ የቴክኖሎጂ\nደረጃ የተሰሩ።',
    craftItems: [
      { title: '4K & 8K Cinema', desc: 'ፕሮፌሽናል ካሜራዎች & ሌንሶች' },
      { title: 'Drone & Aerial', desc: 'ከፍታ ላይ ያለ አስደናቂ እይታ' },
      { title: 'Color Grading', desc: 'ሲኒማቲክ ከለር ኤዲቲንግ' },
      { title: 'Fine-Art Albums', desc: 'ዘላቂ ላሚኔት አልበሞች' },
    ],
    processEyebrow: 'ሂደታችን',
    processH: 'ከውይይት\nእስከ ማስረከቢያ።',
    processSteps: [
      { num: '01', t: 'ውይይት & ምዝገባ', d: 'ቀን እና ራዕይ አብረን እናቅዳለን' },
      { num: '02', t: 'ቅድመ-ሰርግ ቀረጻ', d: 'ዘና ብለው የሚነሱ ቅድመ-ሰርግ ፎቶዎች' },
      { num: '03', t: 'የሰርጉ ቀን ሽፋን', d: 'ሁሉንም ድንቅ አፍታዎች ሙሉ ሽፋን' },
      { num: '04', t: 'ማስረከቢያ', d: 'አልበሞች፣ ፎቶዎች & ቪዲዮዎች ማስረከብ' },
    ],
    pricingEyebrow: 'አገልግሎቶቻችን',
    pricingH: 'እያንዳንዱ\nታሪክ ይብሰልሳል።',
    pkgPopular: 'ተወዳጅ',
    pkgCta: 'ይምረጡ',
    faqEyebrow: 'ጥያቄዎች',
    faqH: 'ብዙ ጊዜ\nየሚጠየቁ።',
    faqs: [
      { q: 'ምን ያህል ቀን አስቀድሞ ማስያዝ ያስፈልጋል?', a: 'ቢያንስ ከ1 እስከ 3 ወር አስቀድሞ ማስያዝ ይመከራል፤ ሆኖም ግን ክፍት ቀናት ካሉ ማስተናገድ ይቻላል።' },
      { q: 'ፎቶ & ቪዲዮ ማስረከቢያ ጊዜ ምን ያህል ነው?', a: '3-5 ቀናት ለሶፍት ኮፒ ፎቶዎች፤ 2-4 ሳምንታት ለተቀነባበሩ ቪዲዮዎች & አልበሞች።' },
      { q: 'ፓኬጆቹን ማስተካከል ይቻላል?', a: 'አዎ! ዝርዝሮቹን እንደ ፍላጎትዎ ማስተካከል ይቻላል።' },
      { q: 'ክፍያ እንዴት ይፈጸማል?', a: 'ቅድሚያ ክፍያ ሲያስይዙ፤ ቀሪው በቀረጻ ቀን & ምርቶቹ ሲረከቡ።' },
    ],
    closingH: 'ዘላቂ ታሪክ\nዛሬ ይጀምራል።',
    closingBtn: 'ቀን ያስይዙ',
    bookingH: 'ቀንዎን\nያስይዙ።',
    bookingLabels: ['ሙሉ ስም', 'የበዓሉ ቀን', 'ስልክ ቁጥር', 'ስለ በዓልዎ'],
    bookingPlaceholders: ['ሙሉ ስምዎ', '', '09…', 'ሰርግ፣ ስታዲዮ ቀረጻ...'],
    bookingSubmit: 'በቴሌግራም ቀጠሮ ይጀምሩ',
    successH: 'መልእክት ተላከ!',
    successBody: 'የቴሌግራም ዊንዶው ተከፍቷል። ይላኩ — ቡድናችን ቀንዎን ያረጋግጥልዎታል።',
    backBtn: 'ወደ ዋናው',
    selectedLabel: 'የተመረጠ',
  },
  en: {
    lang: 'አማርኛ',
    announce: ['Wedding Season is Here', 'Booking Dates Now Open'],
    nav: { about: 'About', work: 'Work', craft: 'Craft', locations: 'Locations', process: 'Process', pricing: 'Services', faq: 'FAQ', call: 'Call' },
    bookBtn: 'Book Your Date',
    heroEyebrow: 'Addis Ababa · Photo & Video',
    heroH1: ['Moments', 'pass—', 'memories', 'remain.'],
    heroSub: 'Professional photography, videography & print services for your most unforgettable day.',
    bookNow: 'Book a Date',
    call: 'Call',
    proofNums: ['9+', '500+', '4K', '100%'],
    proofLabels: ['Years', 'Weddings', 'Cinema', 'Satisfaction'],
    storyEyebrow: 'About HOPE',
    storyH: 'The feeling & memory\nare what matter most.',
    storyBody: 'HOPE is a team that notices everything — intertwined hands, joyful tears, the real laughter that follows a photo. We craft your unrepeatable day into a story you will always love to revisit.',
    storyCta: 'Our Work',
    showcaseLabel: 'Selected Works',
    craftEyebrow: 'Craft & Technology',
    craftH: 'Built with the highest\nlevel of technology.',
    craftItems: [
      { title: '4K & 8K Cinema', desc: 'Pro cinema cameras & lenses' },
      { title: 'Drone & Aerial', desc: 'Stunning elevated perspectives' },
      { title: 'Color Grading', desc: 'Cinematic color editing' },
      { title: 'Fine-Art Albums', desc: 'Durable laminate albums' },
    ],
    processEyebrow: 'Process',
    processH: 'From first call\nto final delivery.',
    processSteps: [
      { num: '01', t: 'Consultation & Booking', d: 'We plan the date and vision together' },
      { num: '02', t: 'Pre-Wedding Shoot', d: 'Relaxed pre-wedding portraits' },
      { num: '03', t: 'Full Wedding Coverage', d: 'Every magical moment, fully captured' },
      { num: '04', t: 'Delivery', d: 'Albums, photos & videos delivered' },
    ],
    pricingEyebrow: 'Services & Pricing',
    pricingH: 'Every story\ndeserves its beauty.',
    pkgPopular: 'Popular',
    pkgCta: 'Choose',
    faqEyebrow: 'FAQ',
    faqH: 'Questions\nyou\'d like answered.',
    faqs: [
      { q: 'How far in advance should we book?', a: 'At least 1–3 months in advance is recommended, though we accommodate closer bookings when dates are available.' },
      { q: 'How long does delivery take?', a: '3–5 days for soft-copy photos; 2–4 weeks for edited videos and albums.' },
      { q: 'Can we customize packages?', a: 'Yes! All packages can be adjusted to suit your specific needs and celebration type.' },
      { q: 'How does payment work?', a: 'Advance payment on booking; the remainder on the shoot day and upon receiving deliverables.' },
    ],
    closingH: 'Lasting stories\nstart today.',
    closingBtn: 'Book Your Date',
    bookingH: 'Book your\ndate.',
    bookingLabels: ['Full Name', 'Event Date', 'Phone Number', 'About your event'],
    bookingPlaceholders: ['Your full name', '', '09…', 'Wedding, studio shoot...'],
    bookingSubmit: 'Start Booking via Telegram',
    successH: 'Message sent!',
    successBody: 'Your Telegram window opened. Hit send — our team will confirm your date.',
    backBtn: 'Back to Home',
    selectedLabel: 'Selected',
  },
};

const packages = [
  { name: 'የስታዲዮ ፎቶ', nameEn: 'Studio Photography', price: '18,500', typeAm: 'ስታዲዮ ፎቶ', typeEn: 'Studio Photo', detailsAm: ['ስታዲዮ ቀረጻ', 'ሜካፕ', '30×45 አልበም', '150 ፎቶዎች'], detailsEn: ['Studio session', 'Makeup included', '30×45 album', '150 photos'], src: 'photo_2026-07-03_14-14-17_7668160832798825472.jpg' },
  { name: 'ሰርግ ፎቶ & ቪዲዮ 2 ካሜራ', nameEn: 'Wedding 2 Cameras', price: '45,000', typeAm: 'ሰርግ ፎቶ & ቪዲዮ', typeEn: 'Wedding Photo & Video', detailsAm: ['2 ካሜራ + ጊምባል', 'ሙሉ ኤዲት ቪዲዮ', 'ከለር ግሬዲንግ', 'ሁሉም ፎቶዎች'], detailsEn: ['2 cameras + gimbal', 'Fully edited video', 'Colour grading', 'All soft-copy photos'], src: 'photo_2026-07-03_14-14-17_7668160799898782720.jpg' },
  { name: 'ሰርግ ፎቶ + ሙዚቃ ቪዲዮ', nameEn: 'Wedding + Music Video', price: '50,000', typeAm: 'ሰርግ + ሙዚቃ ቪዲዮ', typeEn: 'Wedding + Music Video', detailsAm: ['ሙዚቃ ቪዲዮ', '30×90 አልበም', 'ቦርድ ፎቶ', 'Save-the-date'], detailsEn: ['Music video', '30×90 album', 'Board photo', 'Save-the-date'], src: 'photo_2026-07-03_14-14-19_7668160870092520448.jpg' },
  { name: 'ሰርግ ፎቶ & ቪዲዮ 3 ካሜራ', nameEn: 'Wedding 3 Cameras', price: '60,000', typeAm: 'ሰርግ ፎቶ & ቪዲዮ', typeEn: 'Wedding Photo & Video', detailsAm: ['3 ካሜራ + ጊምባል', 'ትሬለር + ቪዲዮ', 'ከለር ግሬዲንግ', '40×60 ቦርድ'], detailsEn: ['3 cameras + gimbal', 'Trailer + full video', 'Colour grading', '40×60 board'], src: 'photo_2026-07-03_14-14-18_7668160879386824704.jpg' },
  { name: 'ሰርግ ፎቶ & ቪዲዮ 4 ካሜራ', nameEn: 'Wedding 4 Cameras', price: '70,000', typeAm: 'ሰርግ ፎቶ & ቪዲዮ', typeEn: 'Wedding Photo & Video', detailsAm: ['4 ካሜራ ሽፋን', 'ትሬለር + ቪዲዮ', '30×90 አልበም', 'ፕሪሚየም ማስታወሻዎች'], detailsEn: ['4 camera coverage', 'Trailer + full video', '30×90 album', 'Premium keepsakes'], src: 'photo_2026-07-03_14-14-18_7668160851399477248.jpg' },
  { name: 'ሙሉ ሰርግ 4 ካሜራ+', nameEn: 'Full Wedding 4 Camera+', price: '75,000', typeAm: 'ሰርግ ፎቶ & ቪዲዮ', typeEn: 'Wedding Photo & Video', detailsAm: ['4 ካሜራ', 'ሙሉ ቪዲዮ ኤዲቲንግ', '30×90 አልበም', '50×80 ቦርድ ፎቶ'], detailsEn: ['4 cameras', 'Full video editing', '30×90 album', '50×80 board photo'], src: 'photo_2026-07-03_14-14-18_7668160860798849024.jpg' },
];

const gallery = [
  'photo_2026-07-03_20-31-22_7668160935271833600.jpg',
  'photo_2026-07-03_20-34-45_7668160982247493632.jpg',
  'photo_2026-07-03_20-37-55_7668161085785812992.jpg',
  'photo_2026-07-03_20-31-18_7668160944615066624.jpg',
  'photo_2026-07-03_20-34-57_7668161010354493440.jpg',
  'photo_2026-07-03_20-37-48_7668161057622723584.jpg',
  'photo_2026-07-03_20-35-00_7668161019770662912.jpg',
  'photo_2026-07-03_20-35-01_7668161048338929664.jpg',
  'photo_2026-07-03_20-37-56_7668161066939796480.jpg',
].map(f => `${ASSET}/gallery/${f}`);

/* ── VIDEO LOGO ──────────────────────────────────────────────────────────── */
function VideoLogo({ className = '', width = 90 }) {
  return (
    <video
      className={`video-logo ${className}`}
      src={`${ASSET}/logo.mp4`}
      autoPlay muted loop playsInline
      style={{ width, height: 'auto' }}
      aria-label="HOPE logo"
    />
  );
}

/* ── WORD SPLITTER ───────────────────────────────────────────────────────── */
function SplitWords({ text, className = '', tag: Tag = 'span' }) {
  return (
    <Tag className={className} data-split="true" aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span className="word-wrap" key={i} aria-hidden="true">
          <span className="word">{word}</span>
          {i < text.split(' ').length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

/* ── AMBIENT BLOBS ───────────────────────────────────────────────────────── */
function AmbientBlobs() {
  const ref = useRef(null);
  useEffect(() => {
    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const blobs = ref.current?.querySelectorAll('.blob');
        if (!blobs) return;
        blobs.forEach((blob, i) => {
          const dur = 25 + i * 3;
          gsap.to(blob, {
            x: `${(i % 2 === 0 ? '' : '-')}${60 + i * 20}`,
            y: `${(i % 3 === 0 ? '-' : '')}${40 + i * 15}`,
            scale: 0.7 + (i % 3) * 0.2,
            duration: dur,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 4,
          });
        });
      }, ref);
    });
    return () => ctx?.revert();
  }, []);
  return (
    <div ref={ref} className="blobs" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}

/* ── PAGE LOADER ────────────────────────────────────────────────────────── */
function PageLoader({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    let tl;
    import('gsap').then(({ gsap }) => {
      tl = gsap.timeline({
        onComplete: onDone,
      });
      tl.from('.loader-logo-video', { opacity: 0, scale: 0.7, duration: 0.8, ease: 'back.out(2)' })
        .from('.loader-wordmark', { opacity: 0, y: 14, duration: 0.55, ease: 'power3.out' }, '-=0.3')
        .from('.loader-tagline', { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, '-=0.2')
        .from('.loader-bar-fill', { scaleX: 0, duration: 1, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.1')
        .to(ref.current, { opacity: 0, y: -30, duration: 0.6, ease: 'power3.in', delay: 0.2 });
    });
    return () => tl?.kill();
  }, [onDone]);

  return (
    <div ref={ref} className="page-loader" aria-hidden="true">
      <AmbientBlobs />
      <div className="loader-inner">
        <VideoLogo className="loader-logo-video" width={120} />
        <span className="loader-wordmark">HOPE</span>
        <span className="loader-tagline">PHOTO · VELO</span>
      </div>
      <div className="loader-bar"><div className="loader-bar-fill" /></div>
    </div>
  );
}

/* ── BOOKING PANEL ─────────────────────────────────────────────────────── */
function BookingPanel({ pkg, onClose, lang }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', phone: '', note: '' });
  const t = T[lang];
  const pkgName = lang === 'en' ? (pkg?.nameEn ?? 'HOPE Service') : (pkg?.name ?? 'HOPE አገልግሎት');
  const up = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = e => {
    e.preventDefault();
    const msg = encodeURIComponent(`HOPE Booking\nService: ${pkgName}\nName: ${form.name}\nDate: ${form.date}\nPhone: ${form.phone}\nEvent: ${form.note}`);
    window.open(`${TELEGRAM_LINK}?text=${msg}`, '_blank', 'noopener');
    setSent(true);
  };
  return (
    <div className="booking-overlay" role="dialog" aria-modal="true">
      <button className="booking-backdrop" onClick={onClose} aria-label="Close" />
      <aside className="booking-panel">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        {sent ? (
          <div className="booking-success">
            <div className="success-ring"><Check size={32} /></div>
            <h2>{t.successH}</h2>
            <p>{t.successBody}</p>
            <button className="btn-primary" onClick={onClose}>{t.backBtn}</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{t.bookingH.split('\n')[0]}</p>
            <h2 className="section-title">{t.bookingH}</h2>
            {pkg && <div className="selected-pkg"><span>{t.selectedLabel}</span><strong>{pkgName}</strong><b>{pkg.price} ETB</b></div>}
            <form onSubmit={submit} className="booking-form">
              {t.bookingLabels.map((label, i) => (
                <label key={i}>{label}
                  {i === 3
                    ? <textarea name="note" value={form.note} onChange={up} placeholder={t.bookingPlaceholders[3]} rows="3" />
                    : <input required name={['name','date','phone'][i]} type={i===1?'date':i===2?'tel':'text'} value={form[['name','date','phone'][i]]} onChange={up} placeholder={t.bookingPlaceholders[i]} />
                  }
                </label>
              ))}
              <button type="submit" className="btn-primary"><Send size={16} />{t.bookingSubmit}</button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}

/* ── APP ────────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState('am');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPkg, setBookingPkg] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeGallery, setActiveGallery] = useState(0);
  const showcaseRef = useRef(null);
  const t = T[lang];

  /* body overflow lock */
  useEffect(() => {
    document.body.style.overflow = (!loaded || bookingPkg) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loaded, bookingPkg]);

  /* ── LENIS (mobile only) ── */
  useEffect(() => {
    if (!loaded) return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    let lenis;
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    });
    return () => lenis?.destroy();
  }, [loaded]);

  /* ── GSAP INTRO + SCROLL ── */
  useEffect(() => {
    if (!loaded) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        /* ─ Intro sequence: 8 staggered fromTo animations ─ */
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.announce-bar', { y: -36 }, { y: 0, duration: 0.55, ease: 'power3.out' })
          .fromTo('.site-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
          .fromTo('.hero-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          .fromTo('.hero-h1 .word', { opacity: 0, y: 60, rotateX: -40 }, {
            opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power4.out',
            stagger: 0.1, transformOrigin: 'top',
          }, '-=0.1')
          .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
          .fromTo('.hero-actions', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
          .fromTo('.hero-proof-row', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')
          .fromTo('.hero-strip-item', { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          }, '-=0.3');

        /* ─ ScrollTrigger: .reveal elements ─ */
        gsap.utils.toArray('.reveal').forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 36 },
            {
              opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }
          );
        });

        /* ─ ScrollTrigger: section titles ─ */
        gsap.utils.toArray('.section-title').forEach(el => {
          gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.9, ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            }
          );
        });

        /* ─ ScrollTrigger: [data-split] word-by-word ─ */
        gsap.utils.toArray('[data-split]').forEach(el => {
          const words = el.querySelectorAll('.word');
          if (!words.length) return;
          gsap.fromTo(words,
            { opacity: 0, y: 45, rotateX: -35 },
            {
              opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: 'power3.out',
              stagger: 0.07, transformOrigin: 'top',
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            }
          );
        });

        /* ─ Horizontal pinned showcase ─ */
        const track = showcaseRef.current?.querySelector('.showcase-track');
        if (track) {
          const items = track.querySelectorAll('.showcase-item');
          const totalWidth = Array.from(items).reduce((acc, item) => acc + item.offsetWidth + 20, 0);
          gsap.to(track, {
            x: -(totalWidth - window.innerWidth + 80),
            ease: 'none',
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'top top',
              end: () => `+=${totalWidth}`,
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
            },
          });
          gsap.fromTo(items,
            { opacity: 0, scale: 0.92 },
            {
              opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1,
              scrollTrigger: { trigger: showcaseRef.current, start: 'top 80%', once: true },
            }
          );
        }

        /* ─ Stats count-up ─ */
        gsap.utils.toArray('.stat-num').forEach(el => {
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => el.classList.add('counted'),
          });
        });
      });
    });
    return () => ctx?.revert();
  }, [loaded]);

  const scroll = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  const toggleLang = () => setLang(l => l === 'am' ? 'en' : 'am');
  const openBooking = (pkg = null) => { setBookingPkg(pkg ?? { name: 'HOPE', nameEn: 'HOPE', price: 'TBD' }); setMenuOpen(false); };

  return (
    <>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <div className={loaded ? 'site-root root-visible' : 'site-root'}>

        {/* ANNOUNCEMENT */}
        <div className="announce-bar">
          <Sparkles size={12} /><span>{t.announce[0]}</span><span className="sep">·</span><span>{t.announce[1]}</span>
        </div>

        {/* HEADER */}
        <header className="site-header">
          <button className="brand" onClick={() => scroll('home')}>
            <VideoLogo width={76} />
            <span className="brand-text">ፎቶ <em>&amp;</em> ቪዲዮ</span>
          </button>
          <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
            {['story','work','craft','process','pricing','faq'].map(id => (
              <button key={id} onClick={() => scroll(id)}>{t.nav[id === 'story' ? 'about' : id]}</button>
            ))}
            <a href={`tel:${PHONE_LINK}`}><Phone size={13} />{t.nav.call}</a>
          </nav>
          <div className="header-right">
            <button className="lang-btn" onClick={toggleLang}><Globe size={14} />{t.lang}</button>
            <button className="btn-primary hdr-book" onClick={() => openBooking()}>{t.bookBtn}</button>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* HERO */}
        <section id="home" className="hero">
          <AmbientBlobs />
          <div className="hero-content">
            <p className="hero-eyebrow eyebrow"><Heart size={12} fill="currentColor" />{t.heroEyebrow}</p>
            <h1 className="hero-h1" style={{ perspective: '600px' }}>
              {t.heroH1.map((word, i) => (
                <span className="word-wrap" key={i} aria-hidden="true">
                  <span className="word">{word}</span>{' '}
                </span>
              ))}
              <span className="sr-only">{t.heroH1.join(' ')}</span>
            </h1>
            <p className="hero-sub">{t.heroSub}</p>
            <div className="hero-actions">
              <button className="btn-primary btn-large" onClick={() => openBooking()}>
                <CalendarDays size={18} />{t.bookNow}
              </button>
              <a className="btn-ghost" href={`tel:${PHONE_LINK}`}><Phone size={16} />{t.call} <span>{PHONE_DISPLAY}</span></a>
            </div>
            <div className="hero-proof-row">
              {t.proofNums.map((n, i) => (
                <div className="proof-item" key={i}>
                  <strong className="stat-num">{n}</strong>
                  <span>{t.proofLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Hero photo strip */}
          <div className="hero-strip">
            {gallery.slice(0, 4).map((src, i) => (
              <div className={`hero-strip-item hero-strip-${i}`} key={i}>
                <img src={src} alt="HOPE wedding photography" />
                {i === 0 && <div className="strip-badge"><VideoLogo width={44} /><b>HOPE</b></div>}
              </div>
            ))}
          </div>
        </section>

        {/* STORY / ABOUT */}
        <section id="story" className="story">
          <div className="story-grid">
            <div className="story-images">
              <div className="story-img story-img-main reveal">
                <img src={gallery[6]} alt="Wedding photography" />
              </div>
              <div className="story-img story-img-accent reveal">
                <img src={gallery[3]} alt="Bridal portrait" />
                <div className="story-img-tag">
                  <span>HOPE</span><small>EST. 2016</small>
                </div>
              </div>
            </div>
            <div className="story-copy">
              <p className="eyebrow reveal">{t.storyEyebrow}</p>
              <SplitWords text={t.storyH} tag="h2" className="section-title story-h" />
              <p className="body-text reveal">{t.storyBody}</p>
              <button className="btn-outline reveal" onClick={() => scroll('work')}>{t.storyCta}<ArrowRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* HORIZONTAL SHOWCASE (pinned) */}
        <section ref={showcaseRef} id="work" className="showcase">
          <div className="showcase-header reveal">
            <p className="eyebrow">{t.showcaseLabel}</p>
            <VideoLogo width={56} />
          </div>
          <div className="showcase-track">
            {gallery.map((src, i) => (
              <div className="showcase-item" key={i} onClick={() => setActiveGallery(i)}>
                <img src={src} alt={`HOPE wedding ${i + 1}`} />
                <div className="showcase-item-num">0{i + 1}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CRAFT */}
        <section id="craft" className="craft">
          <div className="craft-header">
            <p className="eyebrow reveal">{t.craftEyebrow}</p>
            <SplitWords text={t.craftH} tag="h2" className="section-title" />
          </div>
          <div className="craft-grid">
            {[Film, Sparkles, Sliders, Layers].map((Icon, i) => (
              <article className="craft-card reveal" key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="craft-icon"><Icon size={24} /></div>
                <h3>{t.craftItems[i].title}</h3>
                <p>{t.craftItems[i].desc}</p>
              </article>
            ))}
          </div>
          <div className="craft-stats reveal">
            {t.proofNums.map((n, i) => (
              <div className="craft-stat" key={i}>
                <strong className="stat-num">{n}</strong>
                <span>{t.proofLabels[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="process">
          <p className="eyebrow reveal">{t.processEyebrow}</p>
          <SplitWords text={t.processH} tag="h2" className="section-title" />
          <div className="process-steps">
            {t.processSteps.map((s, i) => (
              <article className="process-step reveal" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="step-num">{s.num}</span>
                <div><h3>{s.t}</h3><p>{s.d}</p></div>
              </article>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing">
          <div className="pricing-header">
            <p className="eyebrow reveal">{t.pricingEyebrow}</p>
            <SplitWords text={t.pricingH} tag="h2" className="section-title" />
          </div>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <article className={`price-card reveal ${i === 2 ? 'featured' : ''}`} key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="card-top">
                  <span>{lang === 'en' ? pkg.typeEn : pkg.typeAm}</span>
                  {i === 2 && <b className="badge">{t.pkgPopular}</b>}
                </div>
                <h3>{lang === 'en' ? pkg.nameEn : pkg.name}</h3>
                <div className="card-price"><strong>{pkg.price}</strong><span>ETB</span></div>
                <ul>{(lang === 'en' ? pkg.detailsEn : pkg.detailsAm).map((d, j) => <li key={j}><Check size={13} />{d}</li>)}</ul>
                <button className="card-btn" onClick={() => openBooking(pkg)}>{t.pkgCta} <ArrowRight size={15} /></button>
                <img className="card-bg-img" src={`${ASSET}/gallery/${pkg.src}`} alt="" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq">
          <p className="eyebrow reveal">{t.faqEyebrow}</p>
          <SplitWords text={t.faqH} tag="h2" className="section-title" />
          <div className="faq-list">
            {t.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div className={`faq-item reveal ${open ? 'faq-open' : ''}`} key={i}>
                  <button className="faq-q" onClick={() => setOpenFaq(open ? null : i)}>
                    <span>{faq.q}</span>
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="faq-a"><p>{faq.a}</p></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="closing">
          <AmbientBlobs />
          <div className="closing-inner">
            <VideoLogo width={96} className="closing-logo reveal" />
            <SplitWords text={t.closingH} tag="h2" className="section-title closing-h" />
            <button className="btn-primary btn-large reveal" onClick={() => openBooking()}>
              <CalendarDays size={18} />{t.closingBtn}
            </button>
            <a className="closing-phone reveal" href={`tel:${PHONE_LINK}`}><Phone size={15} />{PHONE_DISPLAY}</a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-brand">
            <VideoLogo width={80} />
            <p>ፎቶ <em>&amp;</em> ቪዲዮ<br /><span>Addis Ababa · EST. 2016</span></p>
          </div>
          <nav className="footer-nav">
            {['story','work','craft','process','pricing','faq'].map(id => (
              <button key={id} onClick={() => scroll(id)}>{t.nav[id === 'story' ? 'about' : id]}</button>
            ))}
          </nav>
          <a className="footer-tg" href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
            <Send size={15} />{lang === 'am' ? 'በቴሌግራም ያግኙን' : 'Find us on Telegram'}
          </a>
          <p className="footer-copy">© {new Date().getFullYear()} HOPE Photo &amp; Velo</p>
        </footer>

        {bookingPkg && <BookingPanel pkg={bookingPkg} onClose={() => setBookingPkg(null)} lang={lang} />}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
