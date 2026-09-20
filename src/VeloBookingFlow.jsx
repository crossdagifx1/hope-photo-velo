import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import {
  ArrowRight, Camera, Check, ChevronLeft, ChevronRight, Edit2,
  ExternalLink, FileText, Film, Globe, MapPin, Menu, MessageCircle,
  Phone, Plus, Send, Star, User, X, CreditCard, Copy, Printer,
  Download, ShieldCheck, Clock, Sparkles, Share2, Crown, Maximize2, Users, Image as ImageIcon
} from 'lucide-react';
import { resolveAgreementForPackage, DEFAULT_AGREEMENTS_9 } from './agreementsData.js';
import DocumentStyleAgreement from './DocumentStyleAgreement.jsx';
import QRCode from './QRCode.jsx';
import QRCodeLib from 'qrcode';

const ASSET = '/assets';
const PHONE_LINK = '+251910526962';

/* ── Tailored 3 Hero Images per Package (Slidable Carousel) ── */
const PACKAGE_HERO_IMAGES = {
  'studio-10k': [
    `${ASSET}/hero_bg_tight.jpg`,
    `${ASSET}/couple-closeup-desktop.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-31-18_7668160944615066624.jpg`,
  ],
  'studio-145k': [
    `${ASSET}/hero-bg.jpg`,
    `${ASSET}/couple-hd-closeup.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-34-45_7668160982247493632.jpg`,
  ],
  'studio-185k': [
    `${ASSET}/hero_forehead_kiss.jpg`,
    `${ASSET}/hero_tight_closeup.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-37-55_7668161085785812992.jpg`,
  ],
  'wedding-bronze': [
    `${ASSET}/hero-wedding.jpg`,
    `${ASSET}/weee.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-35-01_7668161048338929664.jpg`,
  ],
  'wedding-silver': [
    `${ASSET}/hero_bg_couple.jpg`,
    `${ASSET}/weww.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-34-57_7668161010354493440.jpg`,
  ],
  'wedding-golden-75': [
    `${ASSET}/couple-exact-closeup.jpg`,
    `${ASSET}/hero-card-1.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-37-48_7668161057622723584.jpg`,
  ],
  'mesk-16k': [
    `${ASSET}/gallery/photo_2026-07-03_20-31-22_7668160935271833600.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-35-00_7668161019770662912.jpg`,
    `${ASSET}/hero-card-2.jpg`,
  ],
  'mesk-20k': [
    `${ASSET}/gallery/photo_2026-07-03_20-37-56_7668161066939796480.jpg`,
    `${ASSET}/hero-card-3.jpg`,
    `${ASSET}/gallery/photo_2026-07-03_20-34-55_7668161038802964480.jpg`,
  ],
  'special-23k': [
    `${ASSET}/gallery/photo_2026-07-03_14-14-19_7668160916678053888.jpg`,
    `${ASSET}/hero_forehead_kiss.jpg`,
    `${ASSET}/couple-closeup-desktop.jpg`,
  ],
};

function getPackageHeroImages(pkg) {
  const cameraHero = `${ASSET}/camera-hero.jpg`;
  if (!pkg) return [`${ASSET}/hero-wedding.jpg`, `${ASSET}/couple-hd-closeup.jpg`, cameraHero];

  const pid = (pkg.id || '').toLowerCase();
  let pool = null;

  if (PACKAGE_HERO_IMAGES[pid]) {
    pool = PACKAGE_HERO_IMAGES[pid];
  } else if (pid.includes('10k') || pid.includes('studio-session')) {
    pool = PACKAGE_HERO_IMAGES['studio-10k'];
  } else if (pid.includes('145k') || pid.includes('14k') || pid.includes('studio-event')) {
    pool = PACKAGE_HERO_IMAGES['studio-145k'];
  } else if (pid.includes('185k') || pid.includes('18k') || pid.includes('studio-production')) {
    pool = PACKAGE_HERO_IMAGES['studio-185k'];
  } else if (pid.includes('bronze') || pid.includes('45k') || pid.includes('34k')) {
    pool = PACKAGE_HERO_IMAGES['wedding-bronze'];
  } else if (pid.includes('silver') || pid.includes('60k') || pid.includes('40k') || pid.includes('50k')) {
    pool = PACKAGE_HERO_IMAGES['wedding-silver'];
  } else if (pid.includes('golden') || pid.includes('75k') || pid.includes('70k')) {
    pool = PACKAGE_HERO_IMAGES['wedding-golden-75'];
  } else if (pid.includes('16k') || pid.includes('mesk-session')) {
    pool = PACKAGE_HERO_IMAGES['mesk-16k'];
  } else if (pid.includes('20k') || pid.includes('mesk-album')) {
    pool = PACKAGE_HERO_IMAGES['mesk-20k'];
  } else if (pid.includes('23k') || pid.includes('special')) {
    pool = PACKAGE_HERO_IMAGES['special-23k'];
  }

  // Price match fallback
  if (!pool) {
    const price = parseInt((pkg.price || '0').toString().replace(/[^0-9]/g, ''), 10);
    if (price === 10000) pool = PACKAGE_HERO_IMAGES['studio-10k'];
    else if (price === 14500) pool = PACKAGE_HERO_IMAGES['studio-145k'];
    else if (price === 18500) pool = PACKAGE_HERO_IMAGES['studio-185k'];
    else if (price === 16000) pool = PACKAGE_HERO_IMAGES['mesk-16k'];
    else if (price === 20000) pool = PACKAGE_HERO_IMAGES['mesk-20k'];
    else if (price === 23000) pool = PACKAGE_HERO_IMAGES['special-23k'];
    else if (price === 45000 || price === 34000) pool = PACKAGE_HERO_IMAGES['wedding-bronze'];
    else if (price === 60000 || price === 40000 || price === 50000) pool = PACKAGE_HERO_IMAGES['wedding-silver'];
    else if (price === 75000 || price === 70000) pool = PACKAGE_HERO_IMAGES['wedding-golden-75'];
  }

  if (pool && pool.length > 0) {
    return [...pool];
  }

  return [`${ASSET}/hero-wedding.jpg`, `${ASSET}/couple-hd-closeup.jpg`, cameraHero];
}

/* ── Inline Signature Pad matching Image 1 ── */
const VeloSigPad = React.forwardRef(function VeloSigPad({ onSign, onClear }, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasDrawn(false);
      onClear();
    }
  }));

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
    ctx.strokeStyle = '#1a1614';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const stop = (e) => {
    e.preventDefault();
    drawing.current = false;
    if (canvasRef.current) {
      onSign(canvasRef.current.toDataURL('image/png'));
    }
  };

  return (
    <div className="vbf-sig-pad-box">
      <canvas
        ref={canvasRef}
        width={480}
        height={140}
        className="vbf-sig-canvas"
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
      />
      {!hasDrawn && (
        <div className="vbf-sig-watermark">
          <Edit2 size={24} style={{ color: '#b5aba0' }} />
          <span>Tap to sign here</span>
        </div>
      )}
    </div>
  );
});

/* ── Calendar Picker ── */
function VeloCalendar({ value, onChange, blackoutDates = [], bookedDates = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewing, setViewing] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const prevMonth = () => setViewing(v => { const d = new Date(v.year, v.month - 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const nextMonth = () => setViewing(v => { const d = new Date(v.year, v.month + 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['SU','MO','TU','WE','TH','FR','SA'];
  const numDays = daysInMonth(viewing.year, viewing.month);
  const startDay = firstDayOfMonth(viewing.year, viewing.month);
  const formatDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);

  return (
    <div style={{ background: '#fff', border: '1px solid #ede8e1', borderRadius: '18px', padding: '14px' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button type="button" onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d3530', display: 'flex' }}>
          <ChevronLeft size={18}/>
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1614' }}>{months[viewing.month]} {viewing.year}</span>
        <button type="button" onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d3530', display: 'flex' }}>
          <ChevronRight size={18}/>
        </button>
      </div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.62rem', fontWeight: 800, color: '#7a6e66', padding: '3px 0' }}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, idx) => {
          if (!day) return <span key={`e${idx}`} />;
          const dateStr = formatDate(viewing.year, viewing.month, day);
          const cellDate = new Date(viewing.year, viewing.month, day);
          const isPast = cellDate < today;
          const isBlackout = blackoutDates.includes(dateStr);
          const isSelected = value === dateStr;
          const isToday = cellDate.getTime() === today.getTime();
          const isDisabled = isPast || isBlackout;
          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(dateStr)}
              style={{
                aspectRatio: '1', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer', border: 'none',
                background: isSelected ? '#5c4b2a' : isBlackout ? '#fee2e2' : 'transparent',
                color: isSelected ? '#fff' : isBlackout ? '#991b1b' : isDisabled ? '#c9c0b6' : isToday ? '#b89248' : '#1a1614',
                outline: isToday && !isSelected ? '1.5px solid #b89248' : 'none',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{day}</button>
          );
        })}
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   VELO BOOKING FLOW MODAL — Exact Cloned Design
   ══════════════════════════════════════════════════════════════════════════ */
export default function VeloBookingFlow({ selectedPackage, onClose, lang = 'en', onLangChange, initialStep = 1 }) {
  const [step, setStep] = useState(initialStep);
  useEffect(() => { if (initialStep) setStep(initialStep); }, [initialStep]);

  const [activeLang, setActiveLang] = useState(lang);
  useEffect(() => { setActiveLang(lang); }, [lang]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => { setSlideIdx(0); }, [selectedPackage?.id]);

  const [blackoutDates, setBlackout] = useState([]);
  const [bookedDates, setBooked]     = useState([]);
  const [form, setForm]              = useState({ name: '', date: '', phone: '', email: '', location: 'Addis Ababa', note: '' });
  const [signature, setSignature]    = useState(null);
  const [termsAccepted, setTerms]    = useState(false);
  const [submitting, setSubmitting]  = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError]            = useState('');
  const [contractPage, setContractPage] = useState(1);
  const [defaultAgreements9, setDefaultAgreements9] = useState(DEFAULT_AGREEMENTS_9);
  const [selectedAgrTemplate, setSelectedAgrTemplate] = useState(() => resolveAgreementForPackage(selectedPackage, DEFAULT_AGREEMENTS_9));
  const sigPadRef = useRef(null);
  const [contractFullscreen, setContractFullscreen] = useState(false);

  // Payment & Receipt States (Step 5 & 6)
  const [payMethod, setPayMethod]       = useState('telebirr');
  const [payReference, setPayReference] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);  // base64 dataURL
  const [proofFileName, setProofFileName] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [updatingPay, setUpdatingPay]   = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [serverPaymentAccounts, setServerPaymentAccounts] = useState(null);
  const proofInputRef = useRef(null);

  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  const pkgName = activeLang === 'en'
    ? (selectedPackage?.titleEn ?? selectedPackage?.name ?? 'HOPE Package')
    : activeLang === 'om'
    ? (selectedPackage?.titleOm ?? selectedPackage?.name ?? 'Paakeejii HOPE')
    : (selectedPackage?.titleAm ?? selectedPackage?.name ?? 'የ HOPE ፓኬጅ');

  const deliverables = activeLang === 'en'
    ? (selectedPackage?.deliverablesEn ?? [])
    : activeLang === 'om'
    ? (selectedPackage?.deliverablesOm ?? [])
    : (selectedPackage?.deliverablesAm ?? []);

  const badgeText = activeLang === 'en'
    ? (selectedPackage?.badgeEn || 'BEST VALUE')
    : activeLang === 'om'
    ? (selectedPackage?.badgeOm || 'GATII GAARII')
    : (selectedPackage?.badgeAm || 'ምርጥ ዋጋ');

  const descText = activeLang === 'en'
    ? (selectedPackage?.descEn || 'Professional photo and video coverage for your special event.')
    : activeLang === 'om'
    ? (selectedPackage?.descOm || 'Tajaajila waraabsa suuraa fi viidiyoo sadarkaa ol\'aanaa.')
    : (selectedPackage?.descAm || 'ለልዩ በዓላት፣ ለፓርቲዎች እና ለፎቶ ቀረጻዎች ተመራጭ።');

  const basePrice = parseInt((selectedPackage?.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 0;
  const totalPrice = basePrice;
  const deposit = Math.round(totalPrice * 0.5);
  const remaining = totalPrice - deposit;

  const orderId = `HOPE-AGR-STUDIO-${basePrice}`;

  const update = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Hero carousel slides & swipe
  const images = getPackageHeroImages(selectedPackage);
  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setSlideIdx(prev => (prev + 1) % images.length);
  };
  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setSlideIdx(prev => (prev - 1 + images.length) % images.length);
  };

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [selectedPackage?.id, images.length]);

  useEffect(() => {
    setSlideIdx(0);
  }, [selectedPackage?.id]);
  const touchStartY = useRef(null);
  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (!e.changedTouches || !e.changedTouches[0] || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) prevSlide();
      else nextSlide();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleSelectLang = (newCode) => {
    setActiveLang(newCode);
    if (onLangChange) onLangChange(newCode);
  };

  // Load data
  useEffect(() => {
    const matched = resolveAgreementForPackage(selectedPackage, defaultAgreements9);
    setSelectedAgrTemplate(matched);
    fetch(`${apiBase}/api/agreements?defaults=1`)
      .then(r => r.json()).then(d => {
        if (d.agreements?.length > 0) {
          setDefaultAgreements9(d.agreements);
          setSelectedAgrTemplate(resolveAgreementForPackage(selectedPackage, d.agreements));
        }
      }).catch(() => {});
  }, [selectedPackage]);

  useEffect(() => {
    fetch(`${apiBase}/api/settings`).then(r => r.json()).then(data => {
      setBlackout(data.settings?.blackoutDates || []);
      if (data.settings?.paymentAccounts) {
        setServerPaymentAccounts(data.settings.paymentAccounts);
      }
      return fetch(`${apiBase}/api/orders`);
    }).then(r => r.json()).then(data => {
      const dates = (data.orders || [])
        .filter(o => o.eventDate && ['CONFIRMED','PENDING_VERIFICATION'].includes(o.status))
        .map(o => o.eventDate);
      setBooked(dates);
    }).catch(() => {});
  }, []);

  // Agreement pages
  const activeAgreement = selectedAgrTemplate || resolveAgreementForPackage(selectedPackage, defaultAgreements9);
  const tokens = {
    clientName: form.name || '___________', phone: form.phone || '___________',
    eventDate: form.date || '___________', location: form.location || 'Addis Ababa',
    packageName: pkgName, deliverables: deliverables.slice(0, 5).join(', ') || pkgName,
    agreedPrice: totalPrice.toLocaleString() + ' ETB', depositAmount: deposit.toLocaleString() + ' ETB',
    remainingBalance: remaining.toLocaleString() + ' ETB', balance: remaining.toLocaleString() + ' ETB',
  };
  const resolvedClauses = (activeAgreement?.clauses || []).map(c => {
    const heading = activeLang === 'am' ? c.headingAm : c.headingEn;
    let body = activeLang === 'am' ? c.bodyAm : c.bodyEn;
    Object.entries(tokens).forEach(([k, v]) => { body = body?.replaceAll?.(`{${k}}`, v) ?? body; });
    return { heading, body };
  });
  const TOTAL_CONTRACT_PAGES = 4;

  // Handlers
  const handleStep1Next = () => { setError(''); setStep(2); };
  const handleStep2Next = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) { setError('Please enter your full name'); return; }
    if (!form.phone?.trim()) { setError('Please enter your phone number'); return; }
    if (!form.date) { setError('Please select a date'); return; }
    setError(''); setContractPage(1); setStep(3);
  };
  const handleSubmit = async () => {
    if (!signature) { setError('Please provide your signature'); return; }
    if (!termsAccepted) { setError('Please accept the terms and conditions'); return; }
    setSubmitting(true); setError('');
    let orderObj = null;
    try {
      const r = await fetch(`${apiBase}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name, phone: form.phone, eventDate: form.date,
          location: form.location, notes: form.note, packageName: pkgName,
          basePrice, addons: [], totalPrice, depositAmount: deposit, remainingBalance: remaining,
          signatureDataUrl: signature, termsAccepted: true,
          category: selectedPackage?.category || 'custom', status: 'PENDING_VERIFICATION'
        })
      });
      if (r.ok) { const data = await r.json(); orderObj = data?.order || null; }
    } catch(err) { console.warn('Backend push failed:', err); }
    if (!orderObj) {
      orderObj = { id: orderId, clientName: form.name, phone: form.phone, eventDate: form.date, packageName: pkgName, depositAmount: deposit, remainingBalance: remaining };
    }
    setCreatedOrder(orderObj); setStep(4); setSubmitting(false);
  };

  const handleCopyAccount = (accNum, key) => {
    navigator.clipboard?.writeText?.(accNum);
    setCopyFeedback(key);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleConfirmPayment = async () => {
    setUpdatingPay(true);
    const orderIdToUpdate = createdOrder?.id || orderId;
    const patchData = {
      id: orderIdToUpdate,
      paymentMethod: payMethod,
      paymentReference: payReference,
      paymentProof: paymentProof || null,
      status: 'PENDING_VERIFICATION',
      paymentStatus: 'PENDING_VERIFICATION',
      jobStatus: 'SCHEDULED'
    };
    try {
      await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData)
      });
    } catch (e) {
      console.warn('Backend payment patch failed:', e);
    }
    setCreatedOrder(prev => ({
      ...(prev || {}),
      paymentMethod: payMethod,
      paymentReference: payReference,
      paymentProof: paymentProof || null,
      paymentStatus: 'PENDING_VERIFICATION',
      jobStatus: 'SCHEDULED'
    }));
    setUpdatingPay(false);
    setStep(6);
  };

  const handleProofFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPaymentProof(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDownloadReceiptCard = async () => {
    setDownloadingCard(true);
    try {
      const curRefId = createdOrder?.id || orderId;
      const trackingUrl = `${window.location.origin}/?order=${curRefId}`;

      const W = 640;
      const H = 1060;
      const scale = 2; // High DPI Retina (1280 x 2120)

      const cv = document.createElement('canvas');
      cv.width = W * scale;
      cv.height = H * scale;
      const c = cv.getContext('2d');
      c.scale(scale, scale);

      // Helper for rounded rectangle
      const cRR = (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
      };

      // Helper to load image
      const loadImg = (url) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      // 1. Background Card with soft subtle border
      c.fillStyle = '#fdfbf7';
      cRR(c, 0, 0, W, H, 24);
      c.fill();

      c.strokeStyle = '#ede5d8';
      c.lineWidth = 1.5;
      cRR(c, 0, 0, W, H, 24);
      c.stroke();

      // 2. Top Luxury Dark Header
      c.fillStyle = '#1a1614';
      c.beginPath();
      c.moveTo(0, 24);
      c.arcTo(0, 0, 24, 0, 24);
      c.lineTo(W - 24, 0);
      c.arcTo(W, 0, W, 24, 24);
      c.lineTo(W, 136);
      c.lineTo(0, 136);
      c.closePath();
      c.fill();

      // Header Branding
      c.fillStyle = '#bd2637';
      c.font = '900 32px "Playfair Display", Georgia, serif';
      c.fillText('HOPE', 40, 56);

      c.fillStyle = '#d4af37';
      c.font = 'bold 12px Arial, sans-serif';
      c.fillText('PHOTO & VELO STUDIO', 40, 80);

      c.fillStyle = 'rgba(255, 255, 255, 0.75)';
      c.font = '500 11px Arial, sans-serif';
      c.fillText('Tigat Building, Hayahulet, Addis Ababa  \u00B7  +251 910 52 69 62', 40, 102);

      // Status Pill on top-right
      c.fillStyle = '#ffffff';
      cRR(c, W - 220, 36, 180, 36, 18);
      c.fill();

      c.fillStyle = '#b89248';
      c.font = '800 11px Arial, sans-serif';
      c.textAlign = 'center';
      c.fillText('DATE RESERVED', W - 130, 58);
      c.textAlign = 'left';

      // 3. Sub-header & Title
      c.fillStyle = '#1a1614';
      c.font = 'bold 12px Arial, sans-serif';
      c.fillText('OFFICIAL CLIENT DIGITAL RECEIPT & BOOKING PASS', 40, 172);

      c.strokeStyle = '#e2dad0';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(40, 184);
      c.lineTo(W - 40, 184);
      c.stroke();

      // 4. Detail Rows Table
      const rows = [
        ['RECEIPT / REF #', curRefId, 'gold'],
        ['CLIENT NAME', form.name || createdOrder?.clientName || 'Valued Client', false],
        ['PHONE NUMBER', form.phone || createdOrder?.phone || '—', false],
        ['EVENT DATE', form.date || createdOrder?.eventDate || '—', false],
        ['SERVICE PACKAGE', createdOrder?.packageName || pkgName || '—', false],
        ['PAYMENT METHOD', (payMethod === 'telebirr' ? 'Telebirr (ቴሌብር)' : payMethod === 'cbe' ? 'CBE (Commercial Bank)' : payMethod === 'awash' ? 'Awash Bank' : 'Cash at Studio'), false],
        ['TOTAL INVESTMENT', `${totalPrice.toLocaleString()} ETB`, false],
        ['50% ADVANCE DEPOSIT', `${deposit.toLocaleString()} ETB`, 'green'],
        ['BALANCE DUE ON EVENT', `${remaining.toLocaleString()} ETB`, false],
        ['ISSUED DATE', new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), false],
      ];

      let ry = 212;
      rows.forEach(([label, val, accent], i) => {
        if (i % 2 === 0) {
          c.fillStyle = '#ffffff';
          c.fillRect(36, ry - 14, W - 72, 28);
        }
        c.fillStyle = '#7a6e66';
        c.font = 'bold 10px Arial, sans-serif';
        c.fillText(label, 48, ry + 4);

        c.font = accent === 'green' ? 'bold 13px Arial, sans-serif' : accent === 'gold' ? 'bold 13px "DM Mono", monospace' : 'bold 12px Arial, sans-serif';
        c.fillStyle = accent === 'green' ? '#16a34a' : accent === 'gold' ? '#b89248' : '#1a1614';
        c.textAlign = 'right';
        c.fillText(val, W - 48, ry + 4);
        c.textAlign = 'left';
        ry += 30;
      });

      // 5. Minimalist Luxury Hero QR Pass (Bigger, High-Contrast & Viewfinder Accents)
      const qrBoxY = ry + 16;
      const QS = 220; // Expanded to 220px! (over 70% larger for instant detection)
      const qrBoxW = QS + 48; // 268px wide container
      const qrBoxH = QS + 94; // 314px tall container
      const qrBoxX = (W - qrBoxW) / 2;

      // Card container background
      c.fillStyle = '#ffffff';
      cRR(c, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 20);
      c.fill();
      c.strokeStyle = '#e8dfd3';
      c.lineWidth = 1.5;
      cRR(c, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 20);
      c.stroke();

      // Top Tag
      c.fillStyle = '#b89248';
      c.font = 'bold 10px Arial, sans-serif';
      c.textAlign = 'center';
      c.fillText('✦  OFFICIAL DIGITAL VERIFICATION PASS  ✦', W / 2, qrBoxY + 22);

      // Frame position
      const qrFrameX = (W - QS) / 2;
      const qrFrameY = qrBoxY + 34;

      // Viewfinder Corner Accents (Luxury minimalist aesthetic - offset for clear quiet zone)
      const mkLen = 14;
      const mkOffset = 12; // 12px clear offset outside QR quiet zone
      c.strokeStyle = '#b89248';
      c.lineWidth = 2.5;
      c.lineCap = 'round';
      // Top-Left
      c.beginPath(); c.moveTo(qrFrameX - mkOffset, qrFrameY - mkOffset + mkLen); c.lineTo(qrFrameX - mkOffset, qrFrameY - mkOffset); c.lineTo(qrFrameX - mkOffset + mkLen, qrFrameY - mkOffset); c.stroke();
      // Top-Right
      c.beginPath(); c.moveTo(qrFrameX + QS + mkOffset - mkLen, qrFrameY - mkOffset); c.lineTo(qrFrameX + QS + mkOffset, qrFrameY - mkOffset); c.lineTo(qrFrameX + QS + mkOffset, qrFrameY - mkOffset + mkLen); c.stroke();
      // Bottom-Left
      c.beginPath(); c.moveTo(qrFrameX - mkOffset, qrFrameY + QS + mkOffset - mkLen); c.lineTo(qrFrameX - mkOffset, qrFrameY + QS + mkOffset); c.lineTo(qrFrameX - mkOffset + mkLen, qrFrameY + QS + mkOffset); c.stroke();
      // Bottom-Right
      c.beginPath(); c.moveTo(qrFrameX + QS + mkOffset - mkLen, qrFrameY + QS + mkOffset); c.lineTo(qrFrameX + QS + mkOffset, qrFrameY + QS + mkOffset); c.lineTo(qrFrameX + QS + mkOffset, qrFrameY + QS + mkOffset - mkLen); c.stroke();

      // Generate ultra-crisp local QR code data URL (Pure deep obsidian on pure white with proper quiet zone)
      let qrDataUrl = '';
      try {
        qrDataUrl = await QRCodeLib.toDataURL(trackingUrl, {
          width: 500,
          margin: 4,
          errorCorrectionLevel: 'M',
          color: { dark: '#0a0a0f', light: '#ffffff' }
        });
      } catch {
        qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&color=0a0a0f&bgcolor=ffffff&margin=4&ecc=M&data=${encodeURIComponent(trackingUrl)}`;
      }

      try {
        const qrImg = await loadImg(qrDataUrl);
        c.drawImage(qrImg, qrFrameX, qrFrameY, QS, QS);
      } catch {
        c.fillStyle = '#0a0a0f';
        c.fillRect(qrFrameX, qrFrameY, QS, QS);
        c.fillStyle = '#ffffff';
        c.font = 'bold 12px Arial, sans-serif';
        c.fillText('OFFICIAL QR PASS', W / 2, qrFrameY + QS / 2);
      }

      // Instruction Subtitle
      c.fillStyle = '#1a1614';
      c.font = 'bold 11px Arial, sans-serif';
      c.textAlign = 'center';
      c.fillText('SCAN WITH CAMERA OR TELEGRAM BOT TO TRACK STATUS', W / 2, qrFrameY + QS + 20);

      c.fillStyle = '#b89248';
      c.font = 'bold 10.5px "DM Mono", monospace';
      c.fillText(`REF: ${curRefId}  •  hope-photo-velo-jade.vercel.app`, W / 2, qrFrameY + QS + 36);
      c.textAlign = 'left';

      // 6. Perforated Tear Line
      const tearY = qrBoxY + qrBoxH + 24;
      c.setLineDash([5, 5]);
      c.strokeStyle = '#d4c5b0';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(36, tearY);
      c.lineTo(W - 36, tearY);
      c.stroke();
      c.setLineDash([]);

      // Cutout circles on edges for real ticket feel
      [[0, tearY], [W, tearY]].forEach(([cx, cy]) => {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(cx, cy, 14, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ede5d8';
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(cx, cy, 14, 0, Math.PI * 2);
        c.stroke();
      });

      // 7. Footer text
      const fy = tearY + 28;
      c.fillStyle = '#7a6e66';
      c.font = '500 11px Arial, sans-serif';
      c.textAlign = 'center';
      c.fillText('Date held 24 hrs pending verification  \u00B7  Hayahulet Tigat Building, Addis Ababa', W / 2, fy);

      c.fillStyle = '#bd2637';
      c.font = 'bold 11px Arial, sans-serif';
      c.fillText('hope-photo-velo.vercel.app', W / 2, fy + 20);
      c.textAlign = 'left';

      // 8. Download as PNG image
      const a = document.createElement('a');
      a.download = `HOPE-Receipt-${curRefId}.png`;
      a.href = cv.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error('Receipt image generation failed:', err);
    }
    setDownloadingCard(false);
  };

  const pkgIcons = [
    { icon: <Camera size={22} strokeWidth={1.8} />, label: activeLang === 'am' ? 'ፎቶግራፊ' : 'Photography' },
    { icon: <Film size={22} strokeWidth={1.8} />, label: activeLang === 'am' ? 'ቪዲዮግራፊ' : 'Videography' },
    { icon: <Users size={22} strokeWidth={1.8} />, label: activeLang === 'am' ? 'ባለሙያ ቡድን' : 'Professional Team' },
    { icon: <ImageIcon size={22} strokeWidth={1.8} />, label: activeLang === 'am' ? 'ከፍተኛ ጥራት' : 'High-Quality Output' },
  ];

  // ── Header ──
  const renderHeader = () => (
    <div className={`vbf-header ${step === 1 ? 'vbf-header--hero-overlay' : ''}`}>
      <button
        className="vbf-back-icon"
        onClick={step === 1 ? onClose : () => setStep(s => Math.max(1, s - 1))}
        aria-label="Back"
      >
        <ChevronLeft size={20}/>
      </button>
      <div className="vbf-brand">
        <img
          src="/assets/hope-logo.png"
          alt="HOPE Photo &amp; Velo Studio"
          className="vbf-brand-logo-img"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {step >= 2 && step <= 3 ? (
          <div className="vbf-step-pill">{step - 1}/3</div>
        ) : step === 5 ? (
          <div className="vbf-step-pill">{activeLang === 'am' ? 'ክፍያ' : activeLang === 'om' ? 'Kaffaltii' : 'Payment'}</div>
        ) : step === 6 ? (
          <div className="vbf-step-pill">{activeLang === 'am' ? 'ደረሰኝ' : activeLang === 'om' ? 'Nagahee' : 'Receipt'}</div>
        ) : null}
        <button
          className="vbf-menu-icon"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Open menu"
        >
          <Menu size={20}/>
        </button>
      </div>
    </div>
  );

  // ── STEP 1: Package Details ──
  const renderStep1 = () => (
    <div className="vbf-step-scroll vbf-step1-scroll">
      {/* Tall Hero Image Carousel with Auto-slide & Touch Gestures */}
      <div
        className="vbf-hero-img-wrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="vbf-carousel-track"
          style={{ transform: `translateX(-${slideIdx * 100}%)` }}
        >
          {images.map((imgSrc, i) => (
            <div key={i} className="vbf-carousel-slide">
              <img
                src={imgSrc}
                alt={`${pkgName} slide ${i + 1}`}
                className="vbf-hero-img"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Hero Text Overlay */}
        <div className="vbf-hero-overlay">
          <div className="vbf-hero-text">
            <div className="vbf-hero-eyebrow">
              {activeLang === 'am' ? 'ማህደር' : activeLang === 'om' ? 'KUUSAA' : 'CAPTURE'}
            </div>
            <div className="vbf-hero-title">
              {activeLang === 'am' ? (
                <>ልዩ አፍታዎችዎን<br/>እናስቀርልዎታለን</>
              ) : activeLang === 'om' ? (
                <>YEROOWWAN KEESSAN<br/>ISA ADDAA</>
              ) : (
                <>YOUR SPECIAL<br/>MOMENTS</>
              )}
            </div>
            <div className="vbf-hero-line"/>
          </div>
        </div>

        {/* Slide Counter Badge (e.g. 2 / 3) */}
        {images.length > 1 && (
          <div className="vbf-slide-counter">
            {slideIdx + 1} / {images.length}
          </div>
        )}

        {/* Interactive Prev/Next Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="vbf-carousel-nav-btn prev"
              onClick={prevSlide}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="vbf-carousel-nav-btn next"
              onClick={nextSlide}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Slide Indicator Dots */}
        {images.length > 1 && (
          <div className="vbf-carousel-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`vbf-dot ${i === slideIdx ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSlideIdx(i); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Package Card — High-Radius Curvy Overlap on Image */}
      <div className="vbf-pkg-card">
        <div className="vbf-pkg-badge-row">
          <span className="vbf-pkg-badge">
            <Crown size={12} style={{ color: '#d4af37' }}/> {badgeText}
          </span>
        </div>
        <h2 className="vbf-pkg-title">{pkgName}</h2>
        <p className="vbf-pkg-desc">{descText}</p>
        <div className="vbf-pkg-price">
          <span className="vbf-price-num">{totalPrice.toLocaleString()}</span>
          <span className="vbf-price-cur"> ETB</span>
        </div>

        {/* Feature Icons Grid */}
        <div className="vbf-feature-icons">
          {pkgIcons.map((f, i) => (
            <div key={i} className="vbf-feature-icon-item">
              <div className="vbf-feature-icon-box">{f.icon}</div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        <div className="vbf-divider"/>

        {/* What's Included */}
        <div className="vbf-section">
          <h4 className="vbf-section-title">
            {activeLang === 'am' ? 'የተካተቱ አገልግሎቶች' : "What's Included"}
          </h4>
          <ul className="vbf-deliv-list">
            {(deliverables.length > 0 ? deliverables : [
              '200 Thank-You Cards',
              '40×60 Board Photo',
              'Professional Makeup',
              '10 Post Photos',
              '150 Soft Copies'
            ]).map((d, i) => (
              <li key={i}>
                <Check size={15} className="vbf-check-icon" strokeWidth={2.5} />
                <span>{d.replace(/^•\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="vbf-cta-wrap">
          <button className="vbf-cta-btn" onClick={handleStep1Next}>
            {activeLang === 'am' ? 'ቀን ወደመምረጥ ይቀጥሉ' : 'Continue to Date Selection'} <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );

  // ── STEP 2: Date + Contact ──
  const renderStep2 = () => (
    <form onSubmit={handleStep2Next} className="vbf-step-scroll">
      <div className="vbf-step2-body">
        <div className="vbf-step2-header">
          <h2 className="vbf-step2-title">Select Your Date</h2>
          <p className="vbf-step2-sub">Choose a date for your event.</p>
        </div>

        <VeloCalendar
          value={form.date}
          onChange={(d) => setForm(f => ({ ...f, date: d }))}
          blackoutDates={blackoutDates}
          bookedDates={bookedDates}
        />

        {/* Contact Details */}
        <div className="vbf-contact-section">
          <h3 className="vbf-contact-title">Contact Details</h3>
          <div className="vbf-contact-fields">
            <div className="vbf-field-wrap">
              <User size={16} className="vbf-field-icon"/>
              <input required className="vbf-field-input" name="name" value={form.name} onChange={update} placeholder="Full Name"/>
            </div>
            <div className="vbf-field-wrap">
              <Phone size={16} className="vbf-field-icon"/>
              <input required className="vbf-field-input" name="phone" type="tel" value={form.phone} onChange={update} placeholder="Phone Number"/>
            </div>
            <div className="vbf-field-wrap">
              <Globe size={16} className="vbf-field-icon"/>
              <input className="vbf-field-input" name="email" type="email" value={form.email} onChange={update} placeholder="Email (Optional)"/>
            </div>
            <div className="vbf-field-wrap">
              <MapPin size={16} className="vbf-field-icon"/>
              <input className="vbf-field-input" name="location" value={form.location} onChange={update} placeholder="Addis Ababa"/>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="vbf-field-label-above">
            <MessageCircle size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }}/>
            Additional Notes <span className="vbf-optional">(Optional)</span>
          </div>
          <div className="vbf-field-wrap vbf-field-wrap-textarea">
            <textarea
              className="vbf-field-input vbf-field-textarea"
              name="note"
              value={form.note}
              onChange={update}
              rows="3"
              maxLength={500}
              placeholder="Any special requests or details..."
            />
            <span className="vbf-char-count">{(form.note || '').length}/500</span>
          </div>
        </div>

        {error && <p className="vbf-error">{error}</p>}
      </div>

      <div className="vbf-cta-wrap">
        <button type="submit" className="vbf-cta-btn">
          Review &amp; Sign Agreement <ArrowRight size={18}/>
        </button>
      </div>
    </form>
  );

  // ── STEP 3: Agreement + Signature (Official doc left, dedicated sig pad right) ──
  const renderStep3 = () => {
    return (
      <div className="vbf-step-scroll">
        <div className="vbf-step3-body" style={{ padding: '16px 20px' }}>
          {/* Header spans both columns */}
          <div className="vbf-step3-header" style={{ marginBottom: '16px' }}>
            <h2 className="vbf-step3-title">
              {activeLang === 'am' ? 'ይፋዊ የስምምነት ሰነድ እና ፊርማ' : 'Official Agreement Document'}
            </h2>
            <p className="vbf-step3-sub">
              {activeLang === 'am'
                ? 'ውሉን ወደ ታች ያንሸራትቱ ያንብቡ — ከዚያ በቀኝ ያለው ሳጥን ውስጥ ፊርማዎን ይሳሉ።'
                : 'Scroll through the contract on the left — then draw your signature in the box on the right.'}
            </p>
          </div>

          {/* ── Column 1: Scrollable Official Legal Document (readOnly, no internal sig pad) ── */}
          <div style={{ maxHeight: '560px', overflowY: 'auto', borderRadius: '16px', border: '1px solid #e2d9cf', background: '#fff' }}>
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
              lang={activeLang === 'om' ? 'en' : activeLang}
              orderId={createdOrder?.id || orderId}
              readOnly={true}
            />
          </div>

          {/* ── Column 2: Dedicated Signature & Acceptance Box ── */}
          <div className="vbf-sig-section">
            {/* Sig header with clear button */}
            <div className="vbf-sig-header">
              <div className="vbf-sig-title">
                <Edit2 size={15} />
                <span>{activeLang === 'am' ? '✍️ የእርስዎ ፊርማ (Your Signature)' : '✍️ Your Digital Signature'}</span>
              </div>
              {signature && (
                <button
                  type="button"
                  className="vbf-sig-clear"
                  onClick={() => { sigPadRef.current?.clear(); setSignature(null); }}
                >
                  {activeLang === 'am' ? 'አጥፋ' : 'Clear'}
                </button>
              )}
            </div>

            {/* Signature Canvas */}
            <div className="vbf-sig-canvas-container">
              <VeloSigPad
                ref={sigPadRef}
                onSign={setSignature}
                onClear={() => setSignature(null)}
              />
            </div>

            {/* Signed / Hint feedback */}
            {signature ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0' }}>
                <Check size={13} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
                  {activeLang === 'am' ? 'ፊርማ ተቀባይነት አለው ✓' : 'Signature captured ✓'}
                </span>
              </div>
            ) : (
              <p style={{ margin: 0, padding: '4px 16px 8px', fontSize: '0.74rem', color: '#b5aba0', fontStyle: 'italic' }}>
                {activeLang === 'am' ? 'ከላይ ባለው ሳጥን ውስጥ ፊርማዎን ይሳሉ' : 'Draw your signature in the pad above'}
              </p>
            )}

            {/* 50% Deposit Reminder */}
            <div style={{ margin: '8px 16px', padding: '10px 12px', background: '#fef9ef', borderRadius: '10px', border: '1px solid #f0e0aa' }}>
              <p style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.5, color: '#5a4e3a' }}>
                <span style={{ fontWeight: 700, color: '#b89248' }}>
                  {activeLang === 'am' ? '50% ቅድሚያ ክፍያ:' : '50% Advance Deposit:'}
                </span>{' '}
                <strong style={{ fontFamily: 'DM Mono, monospace', color: '#1a1614' }}>{deposit.toLocaleString()} ETB</strong>
                {'  ·  '}
                <span style={{ color: '#7a6e66' }}>{activeLang === 'am' ? 'ቀሪ:' : 'Balance:'}</span>{' '}
                <strong>{remaining.toLocaleString()} ETB</strong>
              </p>
            </div>

            {/* Terms Checkbox */}
            <label className="vbf-terms-row" style={{ padding: '6px 16px 14px' }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTerms(e.target.checked)}
                className="vbf-terms-check"
              />
              <span className="vbf-terms-text">
                {activeLang === 'am' ? (
                  <>የአገልግሎት <span className="vbf-terms-link">ውሎችንና ስምምነቶችን</span> አንብቤ ተስማምቻለሁ</>
                ) : (
                  <>I have read and agree to the <span className="vbf-terms-link">terms and conditions</span></>
                )}
              </span>
            </label>
          </div>
        </div>

        {error && <p className="vbf-error" style={{ padding: '0 20px 8px', marginTop: 0 }}>{error}</p>}

        <div className="vbf-cta-wrap">
          <button
            type="button"
            className="vbf-cta-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <span>{submitting ? 'Submitting…' : (activeLang === 'am' ? 'አረጋግጥ እና አስረክብ' : 'Confirm & Submit')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // ── STEP 4: Confirmation ──
  const renderStep4 = () => (
    <div className="vbf-step-scroll">
      <div className="vbf-confirm-body">
        <div className="vbf-confirm-check"><Check size={40} strokeWidth={3}/></div>
        <h2 className="vbf-confirm-title">Booking Confirmed!</h2>
        <p className="vbf-confirm-sub">Your booking has been received and your date is reserved pending verification.</p>
        <div className="vbf-confirm-card">
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Package</span><span className="vbf-confirm-val">{createdOrder?.packageName || pkgName}</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Client</span><span className="vbf-confirm-val">{form.name}</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Phone</span><span className="vbf-confirm-val">{form.phone}</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Event Date</span><span className="vbf-confirm-val">{form.date}</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Deposit</span><span className="vbf-confirm-val vbf-confirm-green">{deposit.toLocaleString()} ETB</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Balance Due</span><span className="vbf-confirm-val">{remaining.toLocaleString()} ETB</span></div>
          <div className="vbf-confirm-row"><span className="vbf-confirm-lbl">Reference</span><span className="vbf-confirm-ref">{createdOrder?.id || orderId}</span></div>
        </div>
        <div className="vbf-confirm-actions">
          <button
            type="button"
            className="vbf-cta-btn"
            onClick={() => setStep(5)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span>{activeLang === 'am' ? 'ክፍያ ይፈጽሙ እና ይፋዊ ደረሰኝ ይውሰዱ' : activeLang === 'om' ? 'Kaffaltii Kaffaluun Nagahee Fudhadhaa' : 'Proceed to Payment & Receipt'}</span>
            <ArrowRight size={17}/>
          </button>
          <a
            className="vbf-telegram-sub-btn"
            href={`https://t.me/HoopStudioSystemBot?start=order_${createdOrder?.id || orderId}`}
            target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Send size={16}/> {activeLang === 'am' ? 'በቴሌግራም ቦት ይመልከቱ' : 'View in Telegram Bot'}
          </a>
          <button type="button" className="vbf-confirm-close" onClick={onClose}>
            {activeLang === 'am' ? 'ተከናውኗል (ዝጋ)' : activeLang === 'om' ? 'Xumurameera' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── STEP 5: Payment Method Selection matching Image 2 ──
  const renderStep5 = () => {
    const telePhone = serverPaymentAccounts?.telebirr?.phone || serverPaymentAccounts?.telebirr?.accountNumber || '0995270894';
    const teleName = serverPaymentAccounts?.telebirr?.accountName || 'Dagmawi Amare (HOPE Studio)';
    const teleDesc = activeLang === 'am'
      ? (serverPaymentAccounts?.telebirr?.instructionsAm || 'በቴሌብር መተግበሪያ ወይም በ *127# ይላኩ')
      : (serverPaymentAccounts?.telebirr?.instructionsEn || 'Send via Telebirr App or *127#');

    const cbeAcc = serverPaymentAccounts?.cbe?.accountNumber || '1000123456789';
    const cbeName = serverPaymentAccounts?.cbe?.accountName || 'HOPE Photo & Velo Studio';
    const cbeDesc = activeLang === 'am'
      ? (serverPaymentAccounts?.cbe?.instructionsAm || 'በ CBE Birr ወይም በሞባይል ባንኪንግ')
      : (serverPaymentAccounts?.cbe?.instructionsEn || 'Via CBE Birr or Mobile Banking');

    const paymentMethods = [
      {
        id: 'telebirr',
        title: 'Telebirr (ቴሌብር)',
        tag: activeLang === 'am' ? 'ፈጣን / ተመራጭ' : 'Fast / Recommended',
        accountNumber: telePhone,
        accountName: teleName,
        desc: teleDesc
      },
      {
        id: 'cbe',
        title: 'Commercial Bank of Ethiopia (CBE)',
        tag: activeLang === 'am' ? 'የኢትዮጵያ ንግድ ባንክ' : 'CBE Mobile',
        accountNumber: cbeAcc,
        accountName: cbeName,
        desc: cbeDesc
      },
      {
        id: 'awash',
        title: 'Awash Bank (አዋሽ ባንክ)',
        tag: activeLang === 'am' ? 'አዋሽ ባንክ' : 'Awash Bank',
        accountNumber: serverPaymentAccounts?.awash?.accountNumber || '0132087654321',
        accountName: serverPaymentAccounts?.awash?.accountName || 'HOPE Pictures Studio',
        desc: activeLang === 'am' ? 'በአዋሽ ሞባይል ባንኪንግ' : 'Via Awash Mobile Banking'
      },
      {
        id: 'cash',
        title: activeLang === 'am' ? 'በአካል ስቱዲዮ መክፈል (Cash)' : 'Pay Cash at Studio',
        tag: activeLang === 'am' ? 'ስቱዲዮ ቢሮ' : 'Studio Office',
        accountNumber: 'Addis Ababa, Hayahulet',
        accountName: 'Tigat Building, 3rd Floor',
        desc: activeLang === 'am' ? 'በስራ ሰዓት ወደ ስቱዲዮአችን በመምጣት መክፈል ይችላሉ' : 'Visit our studio during business hours to pay in cash'
      }
    ];

    return (
      <div className="vbf-step-scroll">
        <div className="vbf-step5-body">
          <div className="vbf-step5-header">
            <h2 className="vbf-step5-title">
              {activeLang === 'am' ? 'የክፍያ አማራጭ ይምረጡ' : 'Select Payment Method'}
            </h2>
            <p className="vbf-step5-sub">
              {activeLang === 'am'
                ? 'የ 50% ቅድመ-ክፍያ በመፈጸም ቀኑን ያረጋግጡ እና ይፋዊ ደረሰኝዎን ይውሰዱ።'
                : 'Pay 50% deposit to secure your event date & generate your official receipt.'}
            </p>
          </div>

          {/* Amount Due Summary Card matching Image 2 */}
          <div className="vbf-pay-amount-card">
            <div className="vbf-pay-amount-row">
              <span className="vbf-pay-amount-lbl">
                {activeLang === 'am' ? 'የጥቅሉ ጠቅላላ ዋጋ' : 'Total Package Price'}
              </span>
              <span className="vbf-pay-amount-val">{totalPrice.toLocaleString()} ETB</span>
            </div>
            <div className="vbf-pay-amount-row vbf-pay-deposit-row">
              <span className="vbf-pay-amount-lbl">
                {activeLang === 'am' ? 'አሁን የሚከፈል 50% ቅድመ-ክፍያ' : '50% Upfront Deposit (Due Now)'}
              </span>
              <span className="vbf-pay-deposit-val">{deposit.toLocaleString()} ETB</span>
            </div>
            <div className="vbf-pay-amount-row">
              <span className="vbf-pay-amount-lbl">
                {activeLang === 'am' ? 'ቀሪ ክፍያ (በቀረጻው ቀን)' : 'Remaining Balance (On Event Day)'}
              </span>
              <span className="vbf-pay-amount-val">{remaining.toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Payment Method Cards matching Image 2 */}
          <div className="vbf-pay-methods-list">
            {paymentMethods.map(m => {
              const isSelected = payMethod === m.id;
              const isCopied = copyFeedback === m.id;

              return (
                <div
                  key={m.id}
                  className={`vbf-pay-method-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setPayMethod(m.id)}
                >
                  <div className="vbf-pay-method-top">
                    <div className="vbf-pay-radio-wrap">
                      <div className={`vbf-pay-radio ${isSelected ? 'checked' : ''}`} />
                      <div>
                        <div className="vbf-pay-title">{m.title}</div>
                        <div className="vbf-pay-desc">{m.desc}</div>
                      </div>
                    </div>
                    {m.tag && <span className="vbf-pay-tag">{m.tag}</span>}
                  </div>

                  {/* Account Details & One-Click Copy */}
                  <div className="vbf-pay-acc-box">
                    <div className="vbf-pay-acc-info">
                      <div className="vbf-pay-acc-num">{m.accountNumber}</div>
                      <div className="vbf-pay-acc-name">{m.accountName}</div>
                    </div>
                    {m.id !== 'cash' && (
                      <button
                        type="button"
                        className={`vbf-pay-copy-btn ${isCopied ? 'copied' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAccount(m.accountNumber, m.id);
                        }}
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} />
                            <span>{activeLang === 'am' ? 'ተቀድቷል' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>{activeLang === 'am' ? 'ቅዳ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Screenshot Upload */}
          <div className="vbf-proof-upload-wrap">
            <div className="vbf-proof-upload-lbl">
              {activeLang === 'am' ? 'የክፍያ ስክሪን ሾት አያይዙ (አማራጭ)' : 'Attach Payment Screenshot (Optional)'}
            </div>
            <input
              ref={proofInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProofFileChange}
            />
            {paymentProof ? (
              <div className="vbf-proof-preview-row">
                <img src={paymentProof} alt="proof" className="vbf-proof-thumb" />
                <div className="vbf-proof-file-name">{proofFileName}</div>
                <button
                  type="button"
                  className="vbf-proof-remove-btn"
                  onClick={() => { setPaymentProof(null); setProofFileName(''); if (proofInputRef.current) proofInputRef.current.value = ''; }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="vbf-proof-upload-btn"
                onClick={() => proofInputRef.current?.click()}
              >
                <Download size={16} style={{ transform: 'rotate(180deg)' }} />
                <span>{activeLang === 'am' ? 'ፋይል ይምረጡ' : 'Choose File'}</span>
              </button>
            )}
          </div>

          <div className="vbf-cta-wrap" style={{ padding: '8px 0 16px' }}>
            <button
              type="button"
              className="vbf-cta-btn"
              onClick={handleConfirmPayment}
              disabled={updatingPay}
            >
              {updatingPay ? (
                <span>{activeLang === 'am' ? 'ደረሰኝ በማዘጋጀት ላይ…' : 'Generating Receipt…'}</span>
              ) : (
                <>
                  <span>{activeLang === 'am' ? 'ክፍያውን አረጋግጥ እና ይፋዊ ደረሰኝ ውሰድ' : 'Confirm Payment & Generate Receipt'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── STEP 6: Official Receipt with Scannable QR Code ──
  const renderStep6 = () => {
    const curRefId = createdOrder?.id || orderId;
    const trackingUrl = `${window.location.origin}/?order=${curRefId}`;

    return (
      <div className="vbf-step-scroll">
        <div className="vbf-receipt-view">
          {/* Printable Official Receipt Card */}
          <div className="vbf-receipt-card" id="velo-official-receipt">
            {/* Receipt Header */}
            <div className="vbf-rc-header">
              <div className="vbf-rc-brand">HOPE</div>
              <div className="vbf-rc-subtitle">PHOTO &amp; VELO STUDIO</div>
              <div className="vbf-rc-contact">+251 910 52 69 62 • Addis Ababa, Tigat Building</div>
              <div className="vbf-rc-line-double" />
              <div className="vbf-rc-type">OFFICIAL CLIENT DIGITAL RECEIPT</div>
            </div>

            {/* Status Badges */}
            <div className="vbf-rc-badges-row">
              <div className="vbf-rc-badge vbf-rc-badge-gold">
                <Clock size={13} />
                <span>{activeLang === 'am' ? 'ክፍያ: በማረጋገጥ ላይ' : 'Payment: Pending Verification'}</span>
              </div>
              <div className="vbf-rc-badge vbf-rc-badge-dark">
                <Sparkles size={13} />
                <span>{activeLang === 'am' ? 'ሁኔታ: ቀን ተይዟል' : 'Status: Date Reserved'}</span>
              </div>
            </div>

            {/* Receipt Key Details */}
            <div className="vbf-rc-table">
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'የትዕዛዝ ቁጥር (Ref #)' : 'Receipt / Ref #'}</span>
                <span className="vbf-rc-val vbf-rc-ref">{curRefId}</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'ደንበኛ' : 'Client Name'}</span>
                <span className="vbf-rc-val">{form.name || createdOrder?.clientName}</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'ስልክ' : 'Phone'}</span>
                <span className="vbf-rc-val">{form.phone || createdOrder?.phone}</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'የቀረጻ ቀን' : 'Event Date'}</span>
                <span className="vbf-rc-val">{form.date || createdOrder?.eventDate}</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'ፓኬጅ' : 'Package'}</span>
                <span className="vbf-rc-val">{createdOrder?.packageName || pkgName}</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'የተመረጠ ክፍያ' : 'Payment Method'}</span>
                <span className="vbf-rc-val" style={{ textTransform: 'capitalize' }}>
                  {payMethod === 'telebirr' ? 'Telebirr (ቴሌብር)' : payMethod === 'cbe' ? 'Commercial Bank (CBE)' : payMethod === 'awash' ? 'Awash Bank' : 'Cash at Studio'}
                </span>
              </div>
              {payReference && (
                <div className="vbf-rc-row">
                  <span className="vbf-rc-lbl">{activeLang === 'am' ? 'የክፍያ ማረጋገጫ ቁጥር' : 'Txn Reference'}</span>
                  <span className="vbf-rc-val">{payReference}</span>
                </div>
              )}
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'ጠቅላላ ዋጋ' : 'Total Package'}</span>
                <span className="vbf-rc-val">{totalPrice.toLocaleString()} ETB</span>
              </div>
              <div className="vbf-rc-row vbf-rc-row-deposit">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'የተከፈለ / የተያዘ ቅድመ-ክፍያ' : 'Deposit Committed'}</span>
                <span className="vbf-rc-val vbf-rc-deposit-val">{deposit.toLocaleString()} ETB</span>
              </div>
              <div className="vbf-rc-row">
                <span className="vbf-rc-lbl">{activeLang === 'am' ? 'ቀሪ ክፍያ' : 'Balance Due on Event'}</span>
                <span className="vbf-rc-val">{remaining.toLocaleString()} ETB</span>
              </div>
            </div>

            {/* SCANNABLE QR CODE PASS */}
            <div className="vbf-rc-qr-section">
              <div className="vbf-rc-qr-card">
                <QRCode
                  value={trackingUrl}
                  size={220}
                  label={activeLang === 'am' ? 'በስልክ ካሜራ ወይም በቴሌግራም ስካን ያድርጉ' : 'Scan with phone camera or Telegram bot'}
                  sublabel={activeLang === 'am' ? 'ይፋዊ የዲጂታል ፓስፖርት QR' : 'HOPE Studio Official Pass'}
                />
              </div>
              <div className="vbf-rc-qr-instructions" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1a1614', letterSpacing: '0.05em' }}>
                  {activeLang === 'am' ? 'ይፋዊ ዲጂታል ፓስፖርት QR' : 'OFFICIAL DIGITAL PASS QR'}
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="vbf-rc-footer">
              <div>HOPE PHOTO &amp; VELO STUDIO • TIGAT BUILDING HAYAHULET</div>
              <div className="vbf-rc-footer-sub">www.hope-photo-velo.vercel.app • Official Digital Record</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="vbf-rc-actions">
            {/* 1. Click to Open Order Page directly */}
            <a
              href={`/?order=${curRefId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="vbf-cta-btn"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ExternalLink size={17} />
              <span>{activeLang === 'am' ? 'የሥራ እና የክፍያ መከታተያ ገጽን ክፈት' : 'Open Live Order Status & Comments Page'}</span>
            </a>

            {/* 2. Download Receipt Card as high-res image */}
            <button
              type="button"
              className="vbf-rc-download-btn"
              onClick={handleDownloadReceiptCard}
              disabled={downloadingCard}
            >
              <Download size={17} />
              <span>
                {downloadingCard
                  ? (activeLang === 'am' ? 'ደረሰኝ ካርድ በማዘጋጀት ላይ…' : 'Generating Receipt Card…')
                  : (activeLang === 'am' ? 'ደረሰኙን አውርድ / Download Card' : activeLang === 'om' ? 'Nagahee Buufadhu' : 'Download Receipt Card')}
              </span>
            </button>

            {/* 3. Telegram Bot link */}
            <a
              className="vbf-telegram-sub-btn"
              href={`https://t.me/HoopStudioSystemBot?start=order_${curRefId}`}
              target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Send size={16}/> {activeLang === 'am' ? 'በቴሌግራም ቦት ተከታተሉ' : 'View in Telegram Bot'}
            </a>

            {/* 4. Done */}
            <button type="button" className="vbf-confirm-close" onClick={onClose}>
              {activeLang === 'am' ? 'ተከናውኗል (ዝጋ)' : activeLang === 'om' ? 'Xumurameera' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vbf-overlay" role="dialog" aria-modal="true" aria-labelledby="vbf-title">
      <button className="vbf-backdrop" aria-label="Close" onClick={onClose}/>
      <div className="vbf-modal">
        {renderHeader()}

        {/* Hamburger Contextual Menu (Language selector + Go to Chat Bot) */}
        {menuOpen && (
          <div className="vbf-menu-overlay" onClick={() => setMenuOpen(false)}>
            <div className="vbf-menu-drawer" onClick={e => e.stopPropagation()}>
              <div className="vbf-menu-header">
                <div className="vbf-menu-title">
                  <Menu size={18} />
                  <span>{activeLang === 'am' ? 'ምናሌ' : 'Menu'}</span>
                </div>
                <button
                  type="button"
                  className="vbf-menu-close-btn"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Language Selection */}
              <div className="vbf-menu-section">
                <div className="vbf-menu-section-lbl">
                  <Globe size={15} />
                  <span>{activeLang === 'am' ? 'ቋንቋ ይምረጡ' : 'Change Language'}</span>
                </div>
                <div className="vbf-lang-grid">
                  {[
                    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
                    { code: 'en', label: 'English', flag: '🇬🇧' },
                  ].map(opt => {
                    const isSel = activeLang === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        className={`vbf-lang-opt${isSel ? ' vbf-lang-opt-active' : ''}`}
                        onClick={() => {
                          handleSelectLang(opt.code);
                          setMenuOpen(false);
                        }}
                      >
                        <span className="vbf-lang-flag">{opt.flag}</span>
                        <span className="vbf-lang-name">{opt.label}</span>
                        {isSel && <Check size={14} className="vbf-lang-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Go to Chat Bot Button */}
              <div className="vbf-menu-section">
                <div className="vbf-menu-section-lbl">
                  <MessageCircle size={15} />
                  <span>{activeLang === 'am' ? 'የቀጥታ እርዳታ እና ቦት' : 'Support & Assistant'}</span>
                </div>
                <a
                  href={`https://t.me/HoopStudioSystemBot?start=inquire_${selectedPackage?.id || 'studio'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vbf-chatbot-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="vbf-chatbot-icon-wrap">
                    <Send size={18} />
                  </div>
                  <div className="vbf-chatbot-text">
                    <div className="vbf-chatbot-main">
                      {activeLang === 'am' ? 'ወደ ቴሌግራም ቦት ይሂዱ' : 'Go to Chat Bot'}
                    </div>
                    <div className="vbf-chatbot-sub">
                      @HoopStudioSystemBot • Instant Replies
                    </div>
                  </div>
                  <ExternalLink size={16} className="vbf-chatbot-arrow" />
                </a>
              </div>

              {/* Exit / Close Booking Button */}
              <div className="vbf-menu-footer">
                <button
                  type="button"
                  className="vbf-menu-exit-btn"
                  onClick={() => { setMenuOpen(false); onClose(); }}
                >
                  {activeLang === 'am' ? 'ወደ ድረ-ገጽ ተመለስ (Exit Booking)' : 'Exit Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
      </div>
    </div>
  );
}
