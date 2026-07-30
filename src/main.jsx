import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import './styles.css';

const PHONE_DISPLAY = '09 10 52 69 62';
const PHONE_LINK = '+251910526962';
const ASSET = '/assets';

const galleryImages = [
  ['photo_2026-07-03_20-31-22_7668160935271833600.jpg', 'የፀሐይ መግቢያ ፍቅር'],
  ['photo_2026-07-03_20-34-45_7668160982247493632.jpg', 'የጋርደን ፎቶ'],
  ['photo_2026-07-03_20-37-55_7668161085785812992.jpg', 'የአበባ ማህደር'],
  ['photo_2026-07-03_20-31-18_7668160944615066624.jpg', 'የሙሽራዋ ውበት'],
  ['photo_2026-07-03_20-34-57_7668161010354493440.jpg', 'ጸጥተኛ ደስታ'],
  ['photo_2026-07-03_20-37-48_7668161057622723584.jpg', 'የምሽት ውበት'],
  ['photo_2026-07-03_20-35-00_7668161019770662912.jpg', 'አብረው በተፈጥሮ ውስጥ'],
  ['photo_2026-07-03_20-35-01_7668161048338929664.jpg', 'የመጀመሪያው እይታ'],
  ['photo_2026-07-03_20-37-56_7668161066939796480.jpg', 'ሁልጊዜ እኛ'],
].map(([file, alt]) => ({ src: `${ASSET}/gallery/${file}`, alt }));

const packages = [
  {
    name: 'የስታዲዮ ፎቶ አገልግሎት',
    price: '18,500',
    type: 'የስታዲዮ ፎቶግራፍ',
    note: 'ለሚያምር የስታዲዮ ታሪክ',
    details: ['የስታዲዮ ቀረጻ session', 'ሜካፕ የተካተተ (Makeup)', '30×45 ላሚኔት አልበም', 'የምስጋና ካርዶች', '150 ሶፍት ኮፒ ፎቶዎች'],
    source: 'photo_2026-07-03_14-14-17_7668160832798825472.jpg',
  },
  {
    name: 'የሰርግ ፎቶ እና ቪዲዮ (2 ካሜራ)',
    price: '45,000',
    type: 'የሰርግ ፎቶ እና ቪዲዮ',
    note: 'ለተዋበ የሰርግ በዓል',
    details: ['2 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት (Aerial light)', 'ሙሉ ኤዲት የተደረገ ቪዲዮ', 'ከለር ግሬዲንግ (Colour grading)', 'ሁሉም ሶፍት ኮፒ ፎቶዎች'],
    source: 'photo_2026-07-03_14-14-17_7668160799898782720.jpg',
  },
  {
    name: 'የሰርግ ፎቶ፣ ቪዲዮ እና ሙዚቃ ቪዲዮ',
    price: '50,000',
    type: 'የሰርግ ፎቶ + ሙዚቃ ቪዲዮ',
    note: 'ለልዩ እና ትልልቅ አፍታዎችዎ',
    details: ['ሙዚቃ ቪዲዮ (Music video)', '30×90 ላሚኔት አልበም', 'ቦርድ ፎቶ + ሳይን ቦርድ', 'የምስጋና ካርዶች', 'ሴቭ ዘ ዴት (Save-the-date) ፎቶዎች'],
    source: 'photo_2026-07-03_14-14-19_7668160870092520448.jpg',
  },
  {
    name: 'የሰርግ ፎቶ እና ቪዲዮ (3 ካሜራ)',
    price: '60,000',
    type: 'የሰርግ ፎቶ እና ቪዲዮ',
    note: 'ተጨማሪ እይታዎች፣ ዘላቂ ትዝታዎች',
    details: ['3 ካሜራ + ሮኒን ጊምባል', 'የአየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት የተደረገ ቪዲዮ', 'ከለር ግሬዲንግ', '40×60 ቦርድ ፎቶ'],
    source: 'photo_2026-07-03_14-14-18_7668160879386824704.jpg',
  },
  {
    name: 'የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ)',
    price: '70,000',
    type: 'የሰርግ ፎቶ እና ቪዲዮ',
    note: 'ሙሉ እና አጠቃላይ የፎቶና ቪዲዮ ሽፋን',
    details: ['4 ካሜራ ሽፋን', 'ሮኒን ጊምባል + የአየር ላይ መብራት', 'ትሬለር + ሙሉ ኤዲት የተደረገ ቪዲዮ', '30×90 ላሚኔት አልበም', 'ፕሪሚየም ማስታወሻዎች'],
    source: 'photo_2026-07-03_14-14-18_7668160851399477248.jpg',
  },
  {
    name: 'ሙሉ የሰርግ ፎቶ እና ቪዲዮ (4 ካሜራ ፕላስ)',
    price: '75,000',
    type: 'የሰርግ ፎቶ እና ቪዲዮ',
    note: 'ሙሉው የሰርግዎ ድንቅ ታሪክ',
    details: ['4 ካሜራ ሽፋን', 'ሙሉ የቪዲዮ ኤዲቲንግ', '30×90 ላሚኔት አልበም', '50×80 ቦርድ ፎቶ', 'ፕሪሚየም የማስረከቢያ ሳጥን'],
    source: 'photo_2026-07-03_14-14-18_7668160860798849024.jpg',
  },
];

const featureCards = [
  { icon: Camera, title: 'ስሜት ያላቸው ፎቶዎች', text: 'ያልታሰቡ ድንገተኛ አፍታዎች፣ የደስታ እንባዎች እና የቤተሰብ ፍቅር — በሚገባቸው እንክብካቤ ይያዛሉ።' },
  { icon: Video, title: 'ትዝታን የሚመልሱ ቪዲዮዎች', text: 'የተመረጡ እና በሲኒማቲክ ጥራት የተቀነባበሩ የሰርግ ቪዲዮዎች ሁልጊዜ ደግመው እንዲያዩአቸው።' },
  { icon: Sparkles, title: 'በእጅ የሚዳሰሱ ማስታወሻዎች', text: 'አልበሞች፣ ፍሬሞች፣ ካርዶች እና ሶፍት ኮፒዎች ታሪክዎን አቅፈው የሚይዙ።' },
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BookingPanel({ selectedPackage, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', phone: '', note: '' });

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const message = `ሰላም HOPE! የ${selectedPackage?.name ?? 'ሰርግ'} አገልግሎት ማስያዝ እፈልጋለሁ።%0A%0Aስም: ${form.name}%0Aየቀን: ${form.date}%0Aስልክ: ${form.phone}%0Aተጨማሪ መረጃ: ${form.note}`;
    window.open(`https://wa.me/${PHONE_LINK.replace('+', '')}?text=${message}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="booking-layer" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="booking-backdrop" aria-label="መመዝገቢያ ፎርሙን ዝጋ" onClick={onClose} />
      <section className="booking-panel">
        <button className="icon-button close-button" aria-label="መመዝገቢያ ፎርሙን ዝጋ" onClick={onClose}><X size={20} /></button>
        {submitted ? (
          <div className="booking-success">
            <div className="success-mark"><Check size={34} /></div>
            <p className="eyebrow">ለመገናኘት ዝግጁ ነን</p>
            <h2>መልእክትዎ በመላክ ላይ ነው።</h2>
            <p>የቀጠሮ ዝርዝርዎ በዋትስአፕ ተከፍቷል። መልእክቱን ይላኩ፤ የ HOPE ቡድን ቀንዎን ያረጋግጥልዎታል።</p>
            <button className="primary-button" onClick={onClose}>ወደ ዋናው ገጽ ይመለሱ <ArrowRight size={17} /></button>
          </div>
        ) : (
          <>
            <p className="eyebrow">ቀንዎን ያስይዙ</p>
            <h2 id="booking-title">ለድንቅ አፍታዎችዎ<br />ቦታ እንስጥ።</h2>
            <p className="booking-intro">ስለ በዓልዎ ጥቂት ነገሮችን ይንገሩን፤ እኛ ከእዚያ እንቀጥላለን።</p>
            {selectedPackage && <div className="selected-package"><span>የመረጡት አገልግሎት</span><strong>{selectedPackage.name}</strong><b>{selectedPackage.price} ብር</b></div>}
            <form className="booking-form" onSubmit={submit}>
              <label>ሙሉ ስምዎ<input required name="name" value={form.name} onChange={update} placeholder="ሙሉ ስምዎን እዚህ ያስገቡ" /></label>
              <label>የበዓሉ ቀን<input required name="date" type="date" value={form.date} onChange={update} /></label>
              <label>ስልክ ቁጥር<input required name="phone" type="tel" value={form.phone} onChange={update} placeholder="09…" /></label>
              <label>ምን እያከበሩ ነው?<textarea name="note" value={form.note} onChange={update} placeholder="ሰርግ፣ የስታዲዮ ቀረጻ፣ ወይም ሌላ ልዩ በዓል..." rows="3" /></label>
              <button className="primary-button form-button" type="submit">በዋትስአፕ (WhatsApp) ቀጠሮ ይጀምሩ <MessageCircle size={17} /></button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    document.body.style.overflow = bookingPackage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [bookingPackage]);

  const openBooking = (pkg = null) => { setBookingPackage(pkg ?? { name: 'የ HOPE አገልግሎት', price: 'ተመጣጣኝ' }); setMenuOpen(false); };
  const nav = (target) => { scrollToSection(target); setMenuOpen(false); };

  return (
    <main>
      <div className="announcement"><Sparkles size={13} /> <span>የሰርግ ወቅት ደርሷል</span><i /> <span>የቀን ምዝገባ አሁን ክፍት ነው</span></div>
      <header className="site-header">
        <button className="brand" onClick={() => scrollToSection('home')} aria-label="HOPE Photo & Velo ዋና ገጽ">
          <img src={`${ASSET}/hope-logo.gif`} alt="HOPE አርማ" />
          <span>ፎቶ እና ቪዲዮ</span>
        </button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <button onClick={() => nav('story')}>ስለ እኛ</button>
          <button onClick={() => nav('work')}>ሥራዎቻችን</button>
          <button onClick={() => nav('pricing')}>አገልግሎቶች</button>
          <a href={`tel:${PHONE_LINK}`}><Phone size={14} /> ደውሉልን</a>
        </nav>
        <button className="header-book" onClick={() => openBooking()}>ቀንዎን ያስይዙ <ArrowDownRight size={17} /></button>
        <button className="menu-button icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="ሜኑ ክፈት">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section id="home" className="hero section-anchor">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><Heart size={13} fill="currentColor" /> አዲስ አበባ • በፍቅር የተመሠረተ</p>
          <h1>ጊዜያት ያልፋሉ፤<br /><em>እኛ ትዝታ አድርገን እናስቀራቸዋለን።</em></h1>
          <p className="hero-text">ለእርስዎ ልዩ እና የማይረሱ በዓላት የተዘጋጁ ፕሮፌሽናል የፎቶ፣ ቪዲዮ እና የሕትመት አገልግሎቶች።</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => openBooking()}>ቀንዎን አሁኑኑ ያስይዙ <CalendarDays size={18} /></button>
            <a className="text-button hero-call" href={`tel:${PHONE_LINK}`} aria-label={`ደውሉልን በ ${PHONE_DISPLAY}`}><Phone size={16} /> ደውሉ <span className="call-number">{PHONE_DISPLAY}</span></a>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><span /><span /><span /></div><p><strong>የ 9 ዓመታት</strong> የውብ ትዝታዎች<br />ማህደር እና ታማኝነት።</p></div>
        </div>
        <div className="hero-visual" aria-label="HOPE የሰርግ ፎቶግራፍ">
          <div className="hero-photo hero-photo-back"><img src={galleryImages[4].src} alt="የሙሽሮች ፎቶ" /></div>
          <div className="hero-photo hero-photo-front"><img src={galleryImages[0].src} alt="የሙሽሮች ደስታ" /></div>
          <div className="hero-stamp"><span>HOPE</span><small>ፎቶ እና ቪዲዮ</small><b>✦</b></div>
          <div className="hero-note"><span>01</span><p>እውነተኛ ፍቅር።<br />በውበት የተያዘ።</p></div>
        </div>
      </section>

      <section id="story" className="intro section-anchor">
        <div className="intro-side"><p className="eyebrow">የ HOPE መንገድ</p><span className="tall-line" /></div>
        <div className="intro-copy"><p className="script">ከፎቶ በላይ...</p><h2>ስሜቱ እና ትዝታው<br /><em>ዋናው ነገር ነው።</em></h2><p>ሆፕ (HOPE) ከበስተጀርባ ሆኖ ሁሉንም ነገር የሚያስተውል ቡድን ነው፤ እጅ ለእጅ መያያዝን፣ የወላጆችን የደስታ እንባ፣ ከፎቶ በኋላ የሚመጣውን እውነተኛ ሳቅ። የማይደገመውን ልዩ ቀንዎን ሁልጊዜ የሚመለከቱት ድንቅ ታሪክ አድርገን እንቀርጻዋለን።</p><button className="underlined-button" onClick={() => scrollToSection('work')}>ሥራዎቻችንን ይመልከቱ <ArrowRight size={16} /></button></div>
        <div className="intro-picture"><img src={galleryImages[6].src} alt="የሙሽሮች ፎቶ በጀርደን" /><span>ከ 2009 ዓ.ም<br />ጀምሮ</span></div>
      </section>

      <section className="services">
        <div className="section-heading"><p className="eyebrow">ቀንዎን እንዴት እንደምናስቀረው</p><h2>ከስክሪን በላይ<br />ለረጅም ዘመን የሚኖር።</h2></div>
        <div className="feature-grid">{featureCards.map(({ icon: Icon, title, text }, index) => <article className="feature-card" key={title}><div className="feature-number">0{index + 1}</div><Icon size={28} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="work" className="work section-anchor">
        <div className="work-heading"><div><p className="eyebrow">የቅርብ ጊዜ የታሪክ ማህደሮች</p><h2>የማይረሱ<br /><em>ድንቅ አፍታዎች።</em></h2></div><button className="circle-scroll" onClick={() => setActiveImage((activeImage + 1) % galleryImages.length)} aria-label="ቀጣይ ፎቶ አሳይ"><ArrowRight /></button></div>
        <div className="gallery-layout">
          <article className="feature-shot"><img src={galleryImages[activeImage].src} alt={galleryImages[activeImage].alt} /><div className="photo-caption"><span>የተመረጠ ታሪክ</span><strong>{galleryImages[activeImage].alt}</strong><button onClick={() => setActiveImage((activeImage + 1) % galleryImages.length)}>ቀጣይ ምስል <ChevronRight size={15} /></button></div></article>
          <div className="mini-gallery">{galleryImages.slice(1, 5).map((photo) => <button className="mini-shot" key={photo.src} onClick={() => setActiveImage(galleryImages.findIndex((image) => image.src === photo.src))}><img src={photo.src} alt={photo.alt} /></button>)}</div>
        </div>
        <a className="instagram-banner" href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={19} /><span>ተጨማሪ ድንቅ ሥራዎችን በኢንስታግራም ይከተሉን</span><ArrowUpRight size={19} /></a>
      </section>

      <section id="pricing" className="pricing section-anchor">
        <div className="pricing-heading"><div><p className="eyebrow">የሽፋን አማራጭዎን ይምረጡ</p><h2>እያንዳንዱ የፍቅር ታሪክ<br /><em>የሚገባው ውበት አለው።</em></h2></div><p>ከዚህ በታች የቀረቡት ዋጋዎች በ HOPE የዋጋ ዝርዝር መሠረት የተዘጋጁ ናቸው። የሚፈልጉትን የአገልግሎት አይነት ይምረጡ፤ ዝርዝሩን ለበዓልዎ በሚሆን መልኩ እናስተካክላለን።</p></div>
        <div className="pricing-grid">{packages.map((pkg, index) => <article className={index === 2 ? 'price-card featured-price' : 'price-card'} key={pkg.name}><div className="price-top"><span>{pkg.type}</span>{index === 2 && <b>በጣም የተወደደ</b>}</div><h3>{pkg.name}</h3><p className="package-note">{pkg.note}</p><div className="price"><strong>{pkg.price}</strong><span>ብር</span></div><ul>{pkg.details.map((detail) => <li key={detail}><Check size={15} />{detail}</li>)}</ul><button className="package-button" onClick={() => openBooking(pkg)}>ይህንን አገልግሎት ይምረጡ <ArrowRight size={16} /></button><button className="proof-button" onClick={() => setActiveImage(galleryImages.length - 1)}>ሥራዎቻችንን ይመልከቱ</button><img className="package-source" src={`${ASSET}/gallery/${pkg.source}`} alt={`${pkg.name} የዋጋ ዝርዝር`} /></article>)}</div>
        <div className="price-note"><Play size={14} fill="currentColor" /> ሁሉም የአገልግሎት ዝርዝሮች እና ዋጋዎች ከ HOPE ቡድን ጋር በሚደረግ የመጨረሻ ማረጋገጫ የሚጸኑ ይሆናሉ።</div>
      </section>

      <section className="closing-cta">
        <div className="closing-art"><img src={galleryImages[2].src} alt="የሙሽሮች ፎቶ" /><div className="closing-star">✦</div></div>
        <div className="closing-copy"><p className="eyebrow">ልዩ ቀንዎ ሁልጊዜ ከእርስዎ ጋር</p><h2>ዘላቂ የሚሆን<br />ድንቅ ነገር <em>እንፍጠር።</em></h2><p>ቀናት በፍጥነት ስለሚያዙ፣ የሚያከብሩትን በዓል ይንገሩን፤ ቀጣዩን እርምጃ ቀላል እናደርገዋለን።</p><div><button className="primary-button light-button" onClick={() => openBooking()}>ቀንዎን ያስይዙ <CalendarDays size={18} /></button><a className="call-light" href={`tel:${PHONE_LINK}`}><Phone size={16} /> {PHONE_DISPLAY}</a></div></div>
      </section>

      <footer><div className="footer-brand"><img src={`${ASSET}/hope-logo.gif`} alt="HOPE" /><p>ፎቶ እና ቪዲዮ (VELO)<br /><span>ከፍተኛ ዋጋ ላላቸው አፍታዎች።</span></p></div><div className="footer-links"><button onClick={() => scrollToSection('home')}>ዋና ገጽ</button><button onClick={() => scrollToSection('work')}>ሥራዎቻችን</button><button onClick={() => scrollToSection('pricing')}>አገልግሎቶች</button><a href={`tel:${PHONE_LINK}`}>ደውሉልን</a></div><a className="whatsapp-link" href={`https://wa.me/${PHONE_LINK.replace('+', '')}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> በዋትስአፕ ያውሩን</a><p className="copyright">© {new Date().getFullYear()} HOPE Photo &amp; Velo</p></footer>
      {bookingPackage && <BookingPanel selectedPackage={bookingPackage} onClose={() => setBookingPackage(null)} />}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
