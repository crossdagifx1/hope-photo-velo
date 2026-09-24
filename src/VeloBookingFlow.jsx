// src/VeloBookingFlow.jsx — Main Booking Flow fully integrated with Hope UI & real backend
import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import {
  ArrowRight, Camera, Check, CheckCircle, ChevronLeft, ChevronRight, Edit2,
  ExternalLink, FileText, Film, Globe, MapPin, Menu, MessageCircle,
  Phone, Plus, Send, Star, User, X, CreditCard, Copy, Printer,
  Download, ShieldCheck, Clock, Sparkles, Share2, Crown, Maximize2, Users, Image as ImageIcon,
  AlertCircle, Home, Upload, QrCode
} from 'lucide-react';
import { resolveAgreementForPackage, DEFAULT_AGREEMENTS_9 } from './agreementsData.js';
import DocumentStyleAgreement from './DocumentStyleAgreement.jsx';
import QRCode from './QRCode.jsx';
import QRCodeLib from 'qrcode';

const ASSET = '/assets';
const PHONE_LINK = '+251910526962';

/* ── I18N Dictionary from Hope UI ── */
const I18N = {
  en: {
    createBooking: "Create Event Booking", evtDetails: "Event Details", studioPackage: "Studio Package",
    bestValue: "BEST VALUE", eventCoverage: "Event Coverage",
    pkgDesc: "Professional photo and video coverage for your special event.",
    photography: "Photography", videography: "Videography", proTeam: "Professional Team", hiOutput: "High-Quality Output",
    whatsIncluded: "What's Included", pkgIncludedTitle: "Package Deliverables & Details",
    incBoardCards: "40×60 Board Photo & 200 Thank-You Cards",
    continueDate: "Continue to Date Selection", selectDate: "Select Your Date", chooseDate: "Choose a date for your event.",
    contactDetails: "Contact Details", fullName: "Full Name", phonePh: "Phone Number", emailPh: "Email (Optional)",
    notesLbl: "Additional Notes", optLbl: "(Optional)", notesPh: "Any special requests or details...",
    reviewSign: "Review & Sign Agreement", signTitle: "Sign the Agreement", signSub: "Please review the contract and provide your signature.",
    contractDocument: "Contract Document", contractDetails: "Contract Details", rowDoc: "Document Name",
    rowClient: "Client", rowPhone: "Phone", rowDate: "Date", yourSignature: "Your Signature",
    clear: "Clear", tapSign: "Tap to sign here", agreePre: "I have read and agree to the ", agreeTerms: "Terms and Conditions",
    confirmSubmit: "Confirm & Submit", cancel: "Cancel", selDate: "Selected Date",
    lgAvail: "Available", lgUn: "Unavailable", lgBooked: "Booked",
    stPay: "Confirm Payment", stUp: "Upload Screenshot", stWait: "Waiting for Approval",
    payTitle: "Confirm Payment", paySub: "Please review your order details and complete the payment to proceed.",
    bookingSummary: "Booking Summary", pkgLbl: "Package", clientLbl: "Client", dateLbl: "Event Date",
    depositLbl: "Deposit (50%)", balanceLbl: "Balance Due", refLbl: "Reference", totalLbl: "Total Amount",
    payNote: "After you make the payment, upload the screenshot in the next step.", continuePayment: "Continue to Payment",
    uploadTitle: "Upload Payment Screenshot", uploadSub: "Please upload a clear screenshot of your payment for verification.",
    tapUpload: "Tap to upload", dragText: "or drag and drop your screenshot here", fileHint: "PNG, JPG (Max 5MB)",
    uploadNote: "Make sure the screenshot clearly shows the amount, date and transaction details.",
    submitShot: "Submit Screenshot", payMTitle: "Choose Payment Method",
    payMSub: "Select how you'd like to pay. Account details appear after selection.",
    payVia: "Paying via", toUpload: "Continue to Upload",
    pendingTitle: "Payment Under Verification",
    pendingSub: "Your payment screenshot has been received and is now being verified. Please wait up to 24 hours for final approval.",
    wait24hNote: "Expected approval time: Within 24 hours",
    verifiedTitle: "Payment Verified",
    verifiedSub: "The payment has been received and is now verified. Your booking details are shown below.",
    trackTitle: "Track Your Booking", trackDesc: "Scan this QR code anytime to check your booking status and updates.",
    openAgreement: "Open Agreement", viewReceipt: "View Official Receipt", backHome: "Back to Home",
    liveOrderPage: "Open Live Order Page", downloadCard: "Download Receipt Card",
    viewDoc: "View Fullscreen Contract", doneReview: "Done Reviewing",
  },
  am: {
    createBooking: "የዝግጅት ቦታ ማስያዣ ይፍጠሩ", evtDetails: "የዝግጅት ዝርዝሮች", studioPackage: "የስቱዲዮ ጥቅል",
    bestValue: "ምርጥ ዋጋ", eventCoverage: "የዝግጅት ሽፋን",
    pkgDesc: "ለልዩ ዝግጅትዎ ፕሮፌሽናል የፎቶና ቪዲዮ ሽፋን።",
    photography: "ፎቶግራፊ", videography: "ቪዲዮግራፊ", proTeam: "ፕሮፌሽናል ቡድን", hiOutput: "ከፍተኛ ጥራት ውጤት",
    whatsIncluded: "የሚካተቱ ነገሮች", pkgIncludedTitle: "የጥቅሉ ዝርዝሮችና የሚረከቧቸው ነገሮች",
    incBoardCards: "40×60 ሰሌዳ ፎቶ እና 200 የምስጋና ካርዶች",
    continueDate: "ቀን ወደመምረጥ ይቀጥሉ", selectDate: "ቀንዎን ይምረጡ", chooseDate: "ለዝግጅትዎ ቀን ይምረጡ።",
    contactDetails: "የዕውቂያ ዝርዝሮች", fullName: "ሙሉ ስም", phonePh: "ስልክ ቁጥር", emailPh: "ኢሜይል (አማራጭ)",
    notesLbl: "ተጨማሪ ማስታወሻዎች", optLbl: "(አማራጭ)", notesPh: "ማንኛውም ልዩ ጥያቄዎች ወይም ዝርዝሮች...",
    reviewSign: "ውሉን ይመልከቱና ይፈርሙ", signTitle: "ስምምነቱን ይፈርሙ", signSub: "እባክዎ ውሉን ይመልከቱና ፊርማዎን ይስጡ።",
    contractDocument: "የውል ሰነድ", contractDetails: "የውል ዝርዝሮች", rowDoc: "የሰነድ ስም",
    rowClient: "ደንበኛ", rowPhone: "ስልክ", rowDate: "ቀን", yourSignature: "ፊርማዎ",
    clear: "አጽዳ", tapSign: "ለመፈረም ይንኩ", agreePre: "አንብቤ ", agreeTerms: "የቃል ኪዳን መመሪያዎችን አጽድቄያለሁ",
    confirmSubmit: "አረጋግጥና አስገባ", cancel: "ሰርዝ", selDate: "የተመረጠ ቀን",
    lgAvail: "ክፍት", lgUn: "የማይሰራ", lgBooked: "የተያዘ",
    stPay: "ክፍያ ያረጋግጡ", stUp: "ስክሪን ሾት ያስገቡ", stWait: "ማረጋገጫ እየተጠበቀ ነው",
    payTitle: "ክፍያ ያረጋግጡ", paySub: "እባክዎ የትዕዛዝዎን ዝርዝር ይመልከቱና ክፍያውን ይክፈሉ።",
    bookingSummary: "የቦታ ማስያዣ ማጠቃለያ", pkgLbl: "ፓኬጅ", clientLbl: "ደንበኛ", dateLbl: "የዝግጅት ቀን",
    depositLbl: "ቅድሚያ ክፍያ (50%)", balanceLbl: "ቀሪ ክፍያ", refLbl: "ማጣቀሻ", totalLbl: "ጠቅላላ መጠን",
    payNote: "ክፍያውን ከከፈሉ በኋላ ስክሪን ሾቱን በሚቀጥለው ደረጃ ያስገቡ።", continuePayment: "ወደ ክፍያ ይቀጥሉ",
    uploadTitle: "የክፍያ ስክሪን ሾት ያስገቡ", uploadSub: "ለማረጋገጫ እባክዎ ግልጽ የክፍያ ስክሪን ሾት ያስገቡ።",
    tapUpload: "ለመስቀል ይንኩ", dragText: "ወይም ስክሪን ሾትዎን እዚህ ይጎትቱ", fileHint: "PNG፣ JPG (እስከ 5MB)",
    uploadNote: "ስክሪን ሾቱ መጠኑን፣ ቀኑንና የግብይቱን ዝርዝር በግልጽ እንደሚያሳይ ያረጋግጡ።",
    submitShot: "ስክሪን ሾት አስገባ", payMTitle: "የክፍያ መንገድ ይምረጡ",
    payMSub: "እንዴት እንደሚከፍሉ ይምረጡ። የሂሳብ ቁጥር ከምርጫ በኋላ ይታያል።",
    payVia: "የተመረጠ ክፍያ", toUpload: "ወደ ስክሪን ሾት ይቀጥሉ",
    pendingTitle: "ክፍያ በማረጋገጥ ላይ",
    pendingSub: "የክፍያ ስክሪን ሾትዎ ደርሶን በመረጋገጥ ላይ ነው። እባክዎ ለውሳኔ እስከ 24 ሰዓታት ይጠብቁ።",
    wait24hNote: "የሚፈጀው ጊዜ፡ በ24 ሰዓታት ውስጥ",
    verifiedTitle: "ክፍያ ተረጋግጧል",
    verifiedSub: "ክፍያው ተቀብሎ ተረጋግጧል። የቦታ ማስያዣዎ ዝርዝር ከታች ቀርቧል።",
    trackTitle: "ቦታ ማስያዣዎን ይከታተሉ", trackDesc: "የቦታ ማስያዣዎን ሁኔታ በማንኛውም ጊዜ ለማረጋገጥ ይህን QR ኮድ ይቃኙ።",
    openAgreement: "ውሉን ይክፈቱ", viewReceipt: "ይፋዊ ደረሰኝ ይመልከቱ", backHome: "ወደ ዋናው ገጽ",
    liveOrderPage: "ቀጥታ ሁኔታ ገጽ", downloadCard: "ደረሰኙን አውርድ",
    viewDoc: "ሙሉ ውሉን በሙሉ ስክሪን ይመልከቱ", doneReview: "ተመልክቼ ጨርሻለሁ",
  }
};

/* ── Tailored Hero Images per Package ── */
const PACKAGE_HERO_IMAGES = {
  'studio-10k': [`${ASSET}/hero-banner.jpg`, `${ASSET}/couple-closeup-desktop.jpg`],
  'studio-145k': [`${ASSET}/hero-banner.jpg`, `${ASSET}/hero-bg.jpg`, `${ASSET}/couple-hd-closeup.jpg`],
  'studio-185k': [`${ASSET}/hero-banner.jpg`, `${ASSET}/hero_forehead_kiss.jpg`, `${ASSET}/hero_tight_closeup.jpg`],
  'wedding-bronze': [`${ASSET}/hero-wedding.jpg`, `${ASSET}/hero-banner.jpg`],
  'wedding-silver': [`${ASSET}/hero_bg_couple.jpg`, `${ASSET}/hero-banner.jpg`],
  'wedding-golden-75': [`${ASSET}/couple-exact-closeup.jpg`, `${ASSET}/hero-banner.jpg`],
  'mesk-16k': [`${ASSET}/hero-card-2.jpg`, `${ASSET}/hero-banner.jpg`],
  'mesk-20k': [`${ASSET}/hero-card-3.jpg`, `${ASSET}/hero-banner.jpg`],
  'special-23k': [`${ASSET}/hero_forehead_kiss.jpg`, `${ASSET}/hero-banner.jpg`],
};

function getPackageHeroImages(pkg) {
  if (!pkg) return [`${ASSET}/hero-banner.jpg`, `${ASSET}/hero-wedding.jpg`];
  const pid = (pkg.id || '').toLowerCase();
  if (PACKAGE_HERO_IMAGES[pid]) return PACKAGE_HERO_IMAGES[pid];
  return [`${ASSET}/hero-banner.jpg`, `${ASSET}/hero-wedding.jpg`];
}

/* ── Inline Canvas Signature Pad ── */
const VeloSigPad = React.forwardRef(function VeloSigPad({ onSign, onClear }, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const cv = canvasRef.current;
      if (cv) cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
      setHasDrawn(false);
      onClear();
    }
  }));

  const getPos = (e, cv) => {
    const rect = cv.getBoundingClientRect();
    const scaleX = cv.width / rect.width;
    const scaleY = cv.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    const p = getPos(e, cv);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    ctx.strokeStyle = '#17181c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const p = getPos(e, cv);
    ctx.lineTo(p.x, p.y);
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
    <div className={`sig-box${hasDrawn ? ' has-ink' : ''}`}>
      <canvas
        ref={canvasRef}
        width={460}
        height={210}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
      />
      {!hasDrawn && (
        <div className="sig-placeholder">
          <Edit2 size={24} color="#9aa7b8"/>
          <p>Tap to sign here</p>
        </div>
      )}
    </div>
  );
});

/* ── Calendar Component Matching Hope UI ── */
function VeloCalendar({ value, onChange, blackoutDates = [], bookedDates = [], lang = 'en' }) {
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
  const monthsAm = ['ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ','መስከረም','ጥቅምት','ኅዳር','ታኅሣሥ'];
  const days = ['SU','MO','TU','WE','TH','FR','SA'];
  const numDays = daysInMonth(viewing.year, viewing.month);
  const startDay = firstDayOfMonth(viewing.year, viewing.month);
  const formatDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);

  return (
    <div className="cal-card">
      <div className="cal-nav">
        <button type="button" className="cal-btn" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={16}/>
        </button>
        <b style={{ fontSize: '15px', color: '#17181c' }}>
          {lang === 'am' ? monthsAm[viewing.month] : months[viewing.month]} {viewing.year}
        </b>
        <button type="button" className="cal-btn" onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={16}/>
        </button>
      </div>
      <div className="cal-week">
        {days.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <span key={`blank-${idx}`} className="cal-blank"/>;
          const dateStr = formatDate(viewing.year, viewing.month, day);
          const cellDate = new Date(viewing.year, viewing.month, day);
          const isPast = cellDate < today;
          const isBlackout = blackoutDates.includes(dateStr);
          const isBooked = bookedDates.includes(dateStr);
          const isSelected = value === dateStr;
          const isDisabled = isPast || isBlackout;

          let cls = 'cal-day';
          if (isSelected) cls += ' sel';
          else if (isBooked) cls += ' booked';
          else if (isBlackout || isPast) cls += ' un';
          else cls += ' hl';

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              className={cls}
              onClick={() => !isDisabled && onChange(dateStr)}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="legend">
        <span><i className="d-gold"></i><span>{lang === 'am' ? 'የተመረጠ' : 'Selected'}</span></span>
        <span><i className="d-pink"></i><span>{lang === 'am' ? 'ክፍት' : 'Available'}</span></span>
        <span><i className="d-gray"></i><span>{lang === 'am' ? 'የተያዘ / ያለፈ' : 'Booked / Past'}</span></span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN BOOKING FLOW — 100% FAITHFUL TO HOPE UI (Desktop + Mobile)
   ══════════════════════════════════════════════════════════════════════════ */
export default function VeloBookingFlow({ selectedPackage, onClose, lang = 'en', onLangChange, initialStep = 1 }) {
  const [activeLang, setActiveLang] = useState(lang);
  useEffect(() => { setActiveLang(lang); }, [lang]);
  const t = (k) => I18N[activeLang]?.[k] || I18N.en?.[k] || k;

  // Viewport detection: > 900px is Desktop 2-column modal, <= 900px is Mobile app
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth > 900);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Steps:
  // Mobile: 1..8
  // Desktop: 'scrBooking' (steps 1-2) | 'scrSign' (step 3) | 'dPay1' (step 4) | 'dPay2' (steps 5-6) | 'dPayPending' (step 7) | 'dPayVerified' (step 8)
  const [step, setStep] = useState(initialStep);
  const [dScreen, setDScreen] = useState(() => {
    if (initialStep === 3) return 'scrSign';
    if (initialStep === 4) return 'dPay1';
    if (initialStep === 5 || initialStep === 6) return 'dPay2';
    if (initialStep === 7) return 'dPayPending';
    if (initialStep === 8) return 'dPayVerified';
    return 'scrBooking';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  // Form & Client state
  const [form, setForm] = useState({
    name: '', phone: '', email: '', location: 'Addis Ababa',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    note: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signature, setSignature] = useState(null);
  const [termsAccepted, setTerms] = useState(false);

  // Server state
  const [blackoutDates, setBlackout] = useState([]);
  const [bookedDates, setBooked] = useState([]);
  const [serverPaymentAccounts, setServerPaymentAccounts] = useState(null);

  // Contract state
  const [defaultAgreements9, setDefaultAgreements9] = useState(DEFAULT_AGREEMENTS_9);
  const [selectedAgrTemplate, setSelectedAgrTemplate] = useState(() => resolveAgreementForPackage(selectedPackage, DEFAULT_AGREEMENTS_9));
  const [contractPage, setContractPage] = useState(1);
  const [contractFullscreen, setContractFullscreen] = useState(false);
  const sigPadRef = useRef(null);

  // Payment state
  const [orderId, setOrderId] = useState(() => `HOPE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [payMethod, setPayMethod] = useState('telebirr');
  const [payReference, setPayReference] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofFileName, setProofFileName] = useState('');
  const [submitProofLoading, setSubmitProofLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const proofInputRef = useRef(null);

  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  // Pricing & Deliverables
  const pkgName = selectedPackage?.name || selectedPackage?.title || 'Event Coverage';
  const rawPrice = (selectedPackage?.price || '14,500').toString().replace(/[^0-9]/g, '');
  const totalPrice = parseInt(rawPrice, 10) || 14500;
  const deposit = Math.round(totalPrice * 0.5);
  const remaining = totalPrice - deposit;
  const deliverables = selectedPackage?.deliverables || [
    '8-Hour Comprehensive Event Coverage (Photo & Video)',
    'Professional Event & Bridal Makeup Artist Included',
    '15–30s Cinematic Teaser Reels for Social Media',
    '40×60 Board Photo & 200 Thank-You Cards',
    '150+ Edited Soft Copies & Lifetime Cloud Gallery',
    'Full Commercial & Personal Image Usage Rights'
  ];

  const images = getPackageHeroImages(selectedPackage);

  // Load server settings & booked orders
  useEffect(() => {
    fetch(`${apiBase}/api/settings`).then(r => r.json()).then(data => {
      if (data.settings?.blackoutDates) setBlackout(data.settings.blackoutDates);
      if (data.settings?.paymentAccounts) setServerPaymentAccounts(data.settings.paymentAccounts);
      return fetch(`${apiBase}/api/orders`);
    }).then(r => r.json()).then(data => {
      const dates = (data.orders || []).filter(o => o.eventDate && ['CONFIRMED', 'PENDING_VERIFICATION'].includes(o.status)).map(o => o.eventDate);
      setBooked(dates);
    }).catch(() => {});
  }, []);

  const activeAgreement = selectedAgrTemplate || resolveAgreementForPackage(selectedPackage, defaultAgreements9);

  // Form field update
  const update = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Copy helper
  const handleCopy = (text, id) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Switch language
  const handleSelectLang = (code) => {
    setActiveLang(code);
    if (onLangChange) onLangChange(code);
  };

  // Step 1 / 2 -> Step 3: Proceed to contract sign
  const handleProceedToSign = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name?.trim()) { setError(activeLang === 'am' ? 'እባክዎ ሙሉ ስምዎን ያስገቡ' : 'Please enter your full name'); return; }
    if (!form.phone?.trim()) { setError(activeLang === 'am' ? 'እባክዎ ስልክ ቁጥርዎን ያስገቡ' : 'Please enter your phone number'); return; }
    if (!form.date) { setError(activeLang === 'am' ? 'እባክዎ ቀን ይምረጡ' : 'Please select an event date'); return; }
    setError('');
    setStep(3);
    setDScreen('scrSign');
  };

  // Step 3 -> Step 4 / dPay1: Submit real booking
  const handleSubmitBooking = async () => {
    if (!signature) { setError(activeLang === 'am' ? 'እባክዎ ፊርማዎን ይስጡ' : 'Please provide your signature'); return; }
    if (!termsAccepted) { setError(activeLang === 'am' ? 'እባክዎ ውሎችንና ደንቦችን ይቀበሉ' : 'Please accept the terms and conditions'); return; }
    setSubmitting(true);
    setError('');

    const curId = orderId;
    const newOrder = {
      id: curId,
      packageName: pkgName,
      packageId: selectedPackage?.id || 'studio-package',
      totalPrice,
      depositAmount: deposit,
      remainingBalance: remaining,
      clientName: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location || 'Addis Ababa',
      eventDate: form.date,
      notes: form.note,
      signature,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
      agreementId: activeAgreement?.id || 'agr-studio-10k'
    };

    setCreatedOrder(newOrder);

    try {
      await fetch(`${apiBase}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (err) {
      console.warn('Booking API error:', err);
    }

    setSubmitting(false);
    setStep(4);
    setDScreen('dPay1');
  };

  // Step 6 -> Step 7 / dPayPending: Submit proof screenshot
  const handleSubmitProof = async () => {
    setSubmitProofLoading(true);
    const orderIdToUpdate = createdOrder?.id || orderId;
    const patchData = {
      id: orderIdToUpdate,
      paymentMethod: payMethod,
      paymentReference: payReference || `REF-${Date.now().toString().slice(-4)}`,
      paymentProof: paymentProof || null,
      paymentStatus: 'PENDING_VERIFICATION',
      status: 'PENDING_VERIFICATION',
      jobStatus: 'SCHEDULED'
    };

    try {
      await fetch(`${apiBase}/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData)
      });
    } catch (err) {
      console.warn('Payment proof patch error:', err);
    }

    setCreatedOrder(prev => ({ ...(prev || {}), ...patchData }));
    setSubmitProofLoading(false);
    setStep(7);
    setDScreen('dPayPending');
  };

  // Proof file upload handler
  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPaymentProof(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Download high-resolution receipt card
  const handleDownloadReceiptCard = async () => {
    setDownloadingCard(true);
    try {
      const curRefId = createdOrder?.id || orderId;
      const trackingUrl = `${window.location.origin}/?order=${curRefId}`;
      const W = 640, H = 1060, scale = 2;
      const cv = document.createElement('canvas');
      cv.width = W * scale;
      cv.height = H * scale;
      const c = cv.getContext('2d');
      c.scale(scale, scale);

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

      // Background
      c.fillStyle = '#fdfbf7';
      cRR(c, 0, 0, W, H, 24);
      c.fill();
      c.strokeStyle = '#ede5d8';
      c.lineWidth = 1.5;
      cRR(c, 0, 0, W, H, 24);
      c.stroke();

      // Top dark header
      c.fillStyle = '#17181c';
      c.beginPath();
      c.moveTo(0, 24); c.arcTo(0, 0, 24, 0, 24);
      c.lineTo(W - 24, 0); c.arcTo(W, 0, W, 24, 24);
      c.lineTo(W, 136); c.lineTo(0, 136);
      c.closePath();
      c.fill();

      // Branding
      c.fillStyle = '#e31e24';
      c.font = '900 32px "Inter", sans-serif';
      c.fillText('HOPE', 40, 56);
      c.fillStyle = '#d4af37';
      c.font = 'bold 12px "Inter", sans-serif';
      c.fillText('PHOTO & EVENT STUDIO', 40, 80);
      c.fillStyle = '#ffffff';
      c.font = '800 16px "Inter", sans-serif';
      c.fillText('OFFICIAL DIGITAL RECEIPT PASS', 40, 112);

      // Order Reference Box
      c.fillStyle = '#ffffff';
      cRR(c, 40, 160, W - 80, 80, 16);
      c.fill();
      c.strokeStyle = '#e7e5e1';
      c.stroke();
      c.fillStyle = '#6b7280';
      c.font = '600 12px "Inter", sans-serif';
      c.fillText('BOOKING REFERENCE', 60, 192);
      c.fillStyle = '#e31e24';
      c.font = '900 24px "Inter", sans-serif';
      c.fillText(curRefId, 60, 222);

      // Status pill
      c.fillStyle = createdOrder?.status === 'CONFIRMED' ? '#dcfce7' : '#fef3c7';
      cRR(c, W - 220, 182, 160, 36, 18);
      c.fill();
      c.fillStyle = createdOrder?.status === 'CONFIRMED' ? '#15803d' : '#b45309';
      c.font = 'bold 12px "Inter", sans-serif';
      c.fillText(createdOrder?.status === 'CONFIRMED' ? 'VERIFIED' : 'PENDING REVIEW', W - 200, 205);

      // Client & Event rows
      const rows = [
        ['Client Name', form.name || 'Client'],
        ['Phone Number', form.phone || PHONE_LINK],
        ['Event Date', form.date || 'TBD'],
        ['Selected Package', pkgName],
        ['Total Amount', `${totalPrice.toLocaleString()} ETB`],
        ['Deposit (50%)', `${deposit.toLocaleString()} ETB`],
        ['Balance Due', `${remaining.toLocaleString()} ETB`],
      ];

      let ry = 280;
      rows.forEach(([k, v]) => {
        c.fillStyle = '#6b7280';
        c.font = '500 13px "Inter", sans-serif';
        c.fillText(k, 50, ry);
        c.fillStyle = '#17181c';
        c.font = '700 13.5px "Inter", sans-serif';
        c.fillText(v, W - 50 - c.measureText(v).width, ry);
        c.strokeStyle = '#f2f0ec';
        c.beginPath(); c.moveTo(50, ry + 10); c.lineTo(W - 50, ry + 10); c.stroke();
        ry += 38;
      });

      // Scannable Optical QR Code
      const qrDataUrl = await QRCodeLib.toDataURL(trackingUrl, {
        width: 320, margin: 1, color: { dark: '#17181c', light: '#ffffff' }
      });
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise(res => { qrImg.onload = res; });
      c.fillStyle = '#ffffff';
      cRR(c, (W - 200) / 2, ry + 30, 200, 200, 16);
      c.fill();
      c.strokeStyle = '#e7e5e1';
      c.stroke();
      c.drawImage(qrImg, (W - 170) / 2, ry + 45, 170, 170);

      c.fillStyle = '#6b7280';
      c.font = '600 11px "Inter", sans-serif';
      const scanTxt = 'Scan anytime to track your booking live';
      c.fillText(scanTxt, (W - c.measureText(scanTxt).width) / 2, ry + 255);

      // Trigger download
      const a = document.createElement('a');
      a.download = `HOPE_Receipt_Pass_${curRefId}.png`;
      a.href = cv.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error('Failed to generate receipt card:', err);
    }
    setDownloadingCard(false);
  };

  const telePhone = serverPaymentAccounts?.telebirr?.phone || serverPaymentAccounts?.telebirr?.accountNumber || '09 10 52 69 62';
  const cbeAcc = serverPaymentAccounts?.cbe?.accountNumber || '1000542389123';
  const awashAcc = serverPaymentAccounts?.awash?.accountNumber || '0132087654321';

  const paymentMethods = [
    { id: 'telebirr', title: 'Telebirr', sub: 'Mobile Wallet', acc: telePhone, lbl: 'Wallet Number', logoClass: 'tb', letter: 'T' },
    { id: 'cbe', title: 'CBE Bank', sub: 'Commercial Bank of Ethiopia', acc: cbeAcc, lbl: 'Account Number', logoClass: 'cbe', letter: 'C' },
    { id: 'awash', title: 'Awash Bank', sub: 'Awash International Bank', acc: awashAcc, lbl: 'Account Number', logoClass: 'aw', letter: 'A' },
    { id: 'cash', title: activeLang === 'am' ? 'በአካል ስቱዲዮ' : 'Pay Cash at Studio', sub: 'Hayahulet, Tigat Bldg', acc: 'Addis Ababa', lbl: 'Address', logoClass: 'cs', letter: '₵' },
  ];

  const curRefId = createdOrder?.id || orderId;
  const trackingUrl = `${window.location.origin}/?order=${curRefId}`;

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP LAYOUT RENDERING (Exact right-anchored modal with 2-column grids)
  // ─────────────────────────────────────────────────────────────────────────
  const renderDesktopModal = () => (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        {/* ===== SCREEN 1: scrBooking ===== */}
        {dScreen === 'scrBooking' && (
          <section className="scr active" id="scrBooking">
            <div className="m-head">
              <button type="button" className="m-back" onClick={onClose} aria-label="Close">
                <ChevronLeft size={18}/>
              </button>
              <div>
                <h2>{t('createBooking')}</h2>
                <div className="sub">{pkgName} • {totalPrice.toLocaleString()} ETB</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-icon-btn" onClick={() => handleSelectLang(activeLang === 'am' ? 'en' : 'am')} title="Language">
                  <Globe size={18}/>
                </button>
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body book-grid">
              {/* Left Column: Event details, hero banner, deliverables */}
              <div>
                <div className="panel">
                  <div className="panel-head-row">
                    <h3 className="panel-title">{t('evtDetails')}</h3>
                    <span className="panel-pill">{t('studioPackage')}</span>
                  </div>

                  <div className="pkg-hero-banner" style={{ backgroundImage: `url('${images[0]}')` }}>
                    <div className="pkg-hero-content">
                      <div className="pkg-hero-top">
                        <span className="badge-best">
                          <Crown size={13} style={{ color: '#e31e24' }}/>
                          <span>{t('bestValue')}</span>
                        </span>
                        <span className="pkg-hero-pill">{t('studioPackage')}</span>
                      </div>
                      <h2 className="pkg-hero-title">{pkgName}</h2>
                      <p className="pkg-hero-desc">{t('pkgDesc')}</p>
                      <div className="pkg-hero-price-wrap">
                        <span className="pkg-hero-price">{totalPrice.toLocaleString()}</span>
                        <span className="pkg-hero-curr">ETB</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="panel-title" style={{ marginTop: '22px' }}>{t('whatsIncluded')}</h3>
                  <div className="inc-grid">
                    <div className="inc"><Camera size={22}/><span>{t('photography')}</span></div>
                    <div className="inc"><Film size={22}/><span>{t('videography')}</span></div>
                    <div className="inc"><Users size={22}/><span>{t('proTeam')}</span></div>
                    <div className="inc"><ImageIcon size={22}/><span>{t('hiOutput')}</span></div>
                  </div>

                  <div className="pkg-checklist">
                    <div className="pkg-check-head">
                      <Check size={18} strokeWidth={2.5}/>
                      <span>{t('pkgIncludedTitle')}</span>
                    </div>
                    <ul className="checklist">
                      {deliverables.map((item, idx) => (
                        <li key={idx}>
                          <Check size={16} strokeWidth={2.4}/>
                          <span>{item.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Calendar & Contact Form */}
              <div className="col-right">
                <VeloCalendar
                  value={form.date}
                  onChange={d => setForm(f => ({ ...f, date: d }))}
                  blackoutDates={blackoutDates}
                  bookedDates={bookedDates}
                  lang={activeLang}
                />

                <h3 className="panel-title" style={{ marginTop: '20px' }}>{t('contactDetails')}</h3>
                <div className="field">
                  <User size={16}/>
                  <input required placeholder={t('fullName')} name="name" value={form.name} onChange={update}/>
                </div>
                <div className="field">
                  <Phone size={16}/>
                  <input required type="tel" placeholder={t('phonePh')} name="phone" value={form.phone} onChange={update}/>
                </div>
                <div className="field">
                  <Globe size={16}/>
                  <input type="email" placeholder={t('emailPh')} name="email" value={form.email} onChange={update}/>
                </div>
                <div className="field">
                  <MapPin size={16}/>
                  <input placeholder="Addis Ababa" name="location" value={form.location} onChange={update}/>
                </div>

                <div className="notes-label">
                  <MessageCircle size={14}/>
                  <span>{t('notesLbl')}</span>
                  <span className="opt">{t('optLbl')}</span>
                </div>
                <div className="notes-wrap">
                  <textarea
                    placeholder={t('notesPh')}
                    name="note"
                    value={form.note}
                    onChange={update}
                    maxLength={500}
                  />
                  <span className="cnt">{(form.note || '').length}/500</span>
                </div>

                {error && <p style={{ color: '#e31e24', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>{error}</p>}
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
              <button type="button" className="btn btn-red" onClick={handleProceedToSign}>
                <span>{t('reviewSign')}</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </section>
        )}

        {/* ===== SCREEN 2: scrSign ===== */}
        {dScreen === 'scrSign' && (
          <section className="scr active" id="scrSign">
            <div className="m-head">
              <button type="button" className="m-back" onClick={() => setDScreen('scrBooking')}>
                <ChevronLeft size={18}/>
              </button>
              <div>
                <h2>{t('signTitle')}</h2>
                <div className="sub">{t('signSub')}</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body sign-grid">
              {/* Left Column: Official 4-page Contract Reader */}
              <div className="doc-panel">
                <div className="doc-top">
                  <div className="pdf-badge"><FileText size={22} color="#fff"/></div>
                  <div>
                    <h4>{t('contractDocument')}</h4>
                    <span className="fname">HOPE_Official_Agreement_2026.pdf • 4 Pages</span>
                  </div>
                  <button type="button" className="expand-btn" onClick={() => setContractFullscreen(true)} title="Expand Fullscreen">
                    <Maximize2 size={16}/>
                  </button>
                </div>

                <div className="doc-scroll">
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
                    lang={activeLang}
                    orderId={orderId}
                    readOnly={true}
                  />
                </div>

                <div className="pager">
                  <button type="button" className="pg-btn" onClick={() => setContractPage(p => Math.max(1, p - 1))} disabled={contractPage === 1}>‹</button>
                  <span className="pg-count">{contractPage} / 4</span>
                  <button type="button" className="pg-btn" onClick={() => setContractPage(p => Math.min(4, p + 1))} disabled={contractPage === 4}>›</button>
                </div>
              </div>

              {/* Right Column: Signature & Details Card */}
              <div className="side">
                <div className="card">
                  <div className="card-head">
                    <FileText size={18} color="#e31e24"/>
                    <h4>{t('contractDetails')}</h4>
                  </div>
                  <div className="detail-rows">
                    <div className="row"><span>{t('rowDoc')}</span><b>HOPE-{orderId}.pdf</b></div>
                    <div className="row"><span>{t('rowClient')}</span><b>{form.name || '—'}</b></div>
                    <div className="row"><span>{t('rowPhone')}</span><b>{form.phone || '—'}</b></div>
                    <div className="row"><span>{t('rowDate')}</span><b>{form.date || '—'}</b></div>
                  </div>
                </div>

                <div className="sig-card">
                  <div className="card-head">
                    <Edit2 size={16} color="#e31e24"/>
                    <h4>{t('yourSignature')}</h4>
                    {signature && (
                      <button type="button" className="clear-btn" onClick={() => { sigPadRef.current?.clear(); setSignature(null); }}>
                        {t('clear')}
                      </button>
                    )}
                  </div>

                  <VeloSigPad ref={sigPadRef} onSign={setSignature} onClear={() => setSignature(null)}/>

                  <label className="terms">
                    <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)}/>
                    <p>{t('agreePre')}<a href="#terms" onClick={e => { e.preventDefault(); setContractFullscreen(true); }}>{t('agreeTerms')}</a></p>
                  </label>
                </div>

                {error && <p style={{ color: '#e31e24', fontSize: '13px', fontWeight: 600 }}>{error}</p>}
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setDScreen('scrBooking')}>{t('cancel')}</button>
              <button type="button" className="btn btn-red" onClick={handleSubmitBooking} disabled={submitting}>
                <span>{submitting ? 'Submitting…' : t('confirmSubmit')}</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </section>
        )}

        {/* ===== SCREEN 3: dPay1 (Summary) ===== */}
        {dScreen === 'dPay1' && (
          <section className="scr active" id="dPay1">
            <div className="m-head">
              <button type="button" className="m-back" onClick={() => setDScreen('scrSign')}>
                <ChevronLeft size={18}/>
              </button>
              <div>
                <h2>{t('payTitle')}</h2>
                <div className="sub">{t('paySub')}</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body">
              <div className="dst">
                <div className="dst-s now"><span className="dst-dot">1</span><span className="dst-l">{t('stPay')}</span></div>
                <div className="dst-s"><span className="dst-dot">2</span><span className="dst-l">{t('stUp')}</span></div>
                <div className="dst-s"><span className="dst-dot">3</span><span className="dst-l">{t('stWait')}</span></div>
              </div>

              <div className="verify-grid">
                <div>
                  <div className="pay-card">
                    <div className="pay-head">
                      <span className="ph-ic"><Clock size={18}/></span>
                      <b>{t('bookingSummary')}</b>
                      <span className="chip-studio">HOPE Studio</span>
                    </div>
                    <div className="prow"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
                    <div className="prow"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
                    <div className="prow"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
                    <div className="prow"><span>{t('depositLbl')}</span><b className="red">{deposit.toLocaleString()} ETB</b></div>
                    <div className="prow"><span>{t('balanceLbl')}</span><b>{remaining.toLocaleString()} ETB</b></div>
                    <div className="prow"><span>{t('refLbl')}</span><b className="red">{curRefId}</b></div>
                  </div>
                  <div className="total-card">
                    <span className="ph-ic"><CreditCard size={18}/></span>
                    <div><small>{t('totalLbl')}</small><b>{totalPrice.toLocaleString()} ETB</b></div>
                  </div>
                </div>

                <div>
                  <div className="pay-card" style={{ marginTop: 0 }}>
                    <div className="pay-head">
                      <span className="ph-ic"><CreditCard size={18}/></span>
                      <b>{t('payMTitle')}</b>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#7c828c', marginTop: '10px' }}>{t('payMSub')}</p>
                    {paymentMethods.map(m => {
                      const isSel = payMethod === m.id;
                      const isCopied = copyFeedback === m.id;
                      return (
                        <div key={m.id} className={`pm-card${isSel ? ' sel' : ''}`} onClick={() => setPayMethod(m.id)}>
                          <div className="pm-top">
                            <span className={`pm-logo ${m.logoClass}`}>{m.letter}</span>
                            <div><b>{m.title}</b><small>{m.sub}</small></div>
                            <span className="pm-radio"/>
                          </div>
                          <div className="pm-acc">
                            <div className="pm-acc-in">
                              <span>
                                <span className="acc-lbl">{m.lbl}</span>
                                <span className="acc-num">{m.acc}</span>
                              </span>
                              {m.id !== 'cash' && (
                                <button type="button" className="copy-btn" onClick={e => { e.stopPropagation(); handleCopy(m.acc, m.id); }} aria-label="Copy">
                                  {isCopied ? <Check size={15}/> : <Copy size={15}/>}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
              <button type="button" className="btn btn-red" onClick={() => setDScreen('dPay2')}>
                <span>{t('toUpload')}</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </section>
        )}

        {/* ===== SCREEN 4: dPay2 (Upload) ===== */}
        {dScreen === 'dPay2' && (
          <section className="scr active" id="dPay2">
            <div className="m-head">
              <button type="button" className="m-back" onClick={() => setDScreen('dPay1')}>
                <ChevronLeft size={18}/>
              </button>
              <div>
                <h2>{t('uploadTitle')}</h2>
                <div className="sub">{t('uploadSub')}</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body">
              <div className="dst">
                <div className="dst-s done"><span className="dst-dot"><Check size={13} strokeWidth={3}/></span><span className="dst-l">{t('stPay')}</span></div>
                <div className="dst-s now"><span className="dst-dot">2</span><span className="dst-l">{t('stUp')}</span></div>
                <div className="dst-s"><span className="dst-dot">3</span><span className="dst-l">{t('stWait')}</span></div>
              </div>

              <div className="payvia">
                <span>{t('payVia')}</span> <b>{paymentMethods.find(m => m.id === payMethod)?.title || 'Telebirr'}</b>
              </div>

              <div
                className={`up-zone${paymentProof ? ' has' : ''}`}
                onClick={() => proofInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) {
                    setProofFileName(f.name);
                    const r = new FileReader();
                    r.onload = ev => setPaymentProof(ev.target.result);
                    r.readAsDataURL(f);
                  }
                }}
                style={{ maxWidth: '640px', margin: '18px auto 0' }}
              >
                <input ref={proofInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProofChange}/>
                <div className="cloud"><Upload size={28}/></div>
                {paymentProof ? (
                  <>
                    <img src={paymentProof} alt="Receipt preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, objectFit: 'cover' }}/>
                    <div className="up-file show">
                      <Check size={14} strokeWidth={2.4}/>
                      <span>{proofFileName || 'receipt_screenshot.png'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <b>{t('tapUpload')}</b>
                    <p>{t('dragText')}</p>
                    <span className="fhint"><ImageIcon size={13}/><span>{t('fileHint')}</span></span>
                  </>
                )}
              </div>

              {paymentProof && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button type="button" className="btn btn-ghost" style={{ fontSize: '12px' }} onClick={() => { setPaymentProof(null); setProofFileName(''); }}>
                    ✕ Remove Screenshot
                  </button>
                </div>
              )}

              <div className="info-card" style={{ maxWidth: '640px', margin: '16px auto 0' }}>
                <ShieldCheck size={16} strokeWidth={2}/>
                <span>{t('uploadNote')}</span>
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setDScreen('dPay1')}>{activeLang === 'am' ? 'ተመለስ' : 'Back'}</button>
              <button type="button" className="btn btn-red" onClick={handleSubmitProof} disabled={submitProofLoading}>
                <span>{submitProofLoading ? 'Submitting…' : t('submitShot')}</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </section>
        )}

        {/* ===== SCREEN 5: dPayPending ===== */}
        {dScreen === 'dPayPending' && (
          <section className="scr active" id="dPayPending">
            <div className="m-head">
              <div>
                <h2>{t('pendingTitle')}</h2>
                <div className="sub">{t('pendingSub')}</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body">
              <div className="dst">
                <div className="dst-s done"><span className="dst-dot"><Check size={13} strokeWidth={3}/></span><span className="dst-l">{t('stPay')}</span></div>
                <div className="dst-s done"><span className="dst-dot"><Check size={13} strokeWidth={3}/></span><span className="dst-l">{t('stUp')}</span></div>
                <div className="dst-s now"><span className="dst-dot">3</span><span className="dst-l">{t('stWait')}</span></div>
              </div>

              <div className="v2-pending-card">
                <div className="v2-pending-circle"><Clock size={20} color="#fff"/></div>
                <div className="v2-ptext">
                  <h2>{t('pendingTitle')}</h2>
                  <p>{t('pendingSub')}</p>
                </div>
              </div>

              <div className="verify-grid" style={{ marginTop: '18px' }}>
                <div>
                  <div className="v2-card" style={{ marginTop: 0 }}>
                    <div className="v2-card-head">
                      <span className="v2-ic-box amber"><Clock size={18}/></span>
                      <b>{t('bookingSummary')}</b>
                    </div>
                    <div className="v2-rows">
                      <div className="v2-row"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
                      <div className="v2-row"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
                      <div className="v2-row"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
                      <div className="v2-row"><span>{t('depositLbl')}</span><b className="v2-amber">{deposit.toLocaleString()} ETB</b></div>
                      <div className="v2-row"><span>Reference</span><b className="v2-red">{curRefId}</b></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="v2-card v2-qr-card" style={{ marginTop: 0 }}>
                    <div className="v2-qr-wrap">
                      <QRCode value={trackingUrl} size={92}/>
                    </div>
                    <div className="v2-qr-info">
                      <b className="v2-act-title">{t('trackTitle')}</b>
                      <p className="v2-act-desc">{t('trackDesc')}</p>
                      <div className="v2-pill-row">
                        <span className="ref-pill">
                          {curRefId}
                          <button type="button" onClick={() => handleCopy(curRefId, 'ref-dpend')} aria-label="Copy">
                            {copyFeedback === 'ref-dpend' ? <Check size={15}/> : <Copy size={15}/>}
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="v2-btn-group">
                    <button type="button" className="btn-open-agr" onClick={() => setContractFullscreen(true)}>
                      <FileText size={17}/>
                      <span>{t('openAgreement')}</span>
                    </button>
                    <button type="button" className="vbf-rc-download-btn" onClick={handleDownloadReceiptCard} disabled={downloadingCard}>
                      <Download size={17}/>
                      <span>{downloadingCard ? 'Generating…' : t('downloadCard')}</span>
                    </button>
                    <button type="button" className="btn-simulate-qr" onClick={() => setDScreen('dPayVerified')}>
                      <ShieldCheck size={17}/>
                      <span>{t('viewReceipt')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
              <a className="btn btn-red" href={`/?order=${curRefId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <ExternalLink size={16}/>
                <span>{t('liveOrderPage')}</span>
              </a>
            </div>
          </section>
        )}

        {/* ===== SCREEN 6: dPayVerified ===== */}
        {dScreen === 'dPayVerified' && (
          <section className="scr active" id="dPayVerified">
            <div className="m-head">
              <div>
                <h2>{t('verifiedTitle')}</h2>
                <div className="sub">{t('verifiedSub')}</div>
              </div>
              <div className="m-head-actions">
                <button type="button" className="m-close" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="m-body">
              <div className="v2-verified-card">
                <div className="v2-check-circle"><Check size={22} color="#fff" strokeWidth={3}/></div>
                <div className="v2-vtext">
                  <h2>{t('verifiedTitle')}</h2>
                  <p>{t('verifiedSub')}</p>
                </div>
              </div>

              <div className="verify-grid" style={{ marginTop: '18px' }}>
                <div>
                  <div className="v2-card" style={{ marginTop: 0 }}>
                    <div className="v2-card-head">
                      <span className="v2-ic-box green"><CheckCircle size={18}/></span>
                      <b>{t('bookingSummary')}</b>
                    </div>
                    <div className="v2-rows">
                      <div className="v2-row"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
                      <div className="v2-row"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
                      <div className="v2-row"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
                      <div className="v2-row"><span>{t('depositLbl')}</span><b className="v2-green">{deposit.toLocaleString()} ETB</b></div>
                      <div className="v2-row"><span>Reference</span><b className="v2-red">{curRefId}</b></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="v2-card v2-qr-card" style={{ marginTop: 0 }}>
                    <div className="v2-qr-wrap">
                      <QRCode value={trackingUrl} size={92}/>
                    </div>
                    <div className="v2-qr-info">
                      <b className="v2-act-title">{t('trackTitle')}</b>
                      <p className="v2-act-desc">{t('trackDesc')}</p>
                      <div className="v2-pill-row">
                        <span className="ref-pill">
                          {curRefId}
                          <button type="button" onClick={() => handleCopy(curRefId, 'ref-dver')} aria-label="Copy">
                            {copyFeedback === 'ref-dver' ? <Check size={15}/> : <Copy size={15}/>}
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="v2-btn-group">
                    <button type="button" className="btn-open-agr" onClick={() => setContractFullscreen(true)}>
                      <FileText size={17}/>
                      <span>{t('openAgreement')}</span>
                    </button>
                    <button type="button" className="vbf-rc-download-btn" onClick={handleDownloadReceiptCard} disabled={downloadingCard}>
                      <Download size={17}/>
                      <span>{downloadingCard ? 'Generating…' : t('downloadCard')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="m-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
              <button type="button" className="btn btn-red" onClick={onClose}>
                <Home size={16}/>
                <span>{t('backHome')}</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE LAYOUT RENDERING (Exact Hope UI 8-step mobile app wizard)
  // ─────────────────────────────────────────────────────────────────────────
  const renderMobileApp = () => (
    <div className="mobile-app" style={{ display: 'block' }}>
      {/* Mobile Sticky Header */}
      <div className="m-head">
        <button
          type="button"
          className="m-circ"
          onClick={() => {
            if (step > 1) setStep(s => s - 1);
            else onClose();
          }}
          aria-label="Back"
        >
          <ChevronLeft size={18}/>
        </button>
        <div className="m-logo">
          <b>HOPE</b>
          <span>PHOTO &amp; EVENT STUDIO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="m-chip">{step}/8</span>
          <button type="button" className="m-circ" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ width: '38px', height: '38px', boxShadow: 'none', border: '1px solid #e7e5e1' }}>
            <Menu size={17}/>
          </button>
        </div>
      </div>

      {/* Hamburger Drawer */}
      {menuOpen && (
        <div className="menu-scrim open" onClick={() => setMenuOpen(false)}>
          <div className="m-menu open" onClick={e => e.stopPropagation()}>
            <button type="button" className="mm-item" onClick={() => handleSelectLang(activeLang === 'am' ? 'en' : 'am')}>
              <div className="mm-ic"><Globe size={18}/></div>
              <div><b>{activeLang === 'am' ? 'Switch to English' : 'ቋንቋ ወደ አማርኛ ቀይር'}</b><small>{activeLang === 'am' ? 'English' : 'አማርኛ'}</small></div>
            </button>
            <a href="https://t.me/HoopStudioSystemBot" target="_blank" rel="noopener noreferrer" className="mm-item">
              <div className="mm-ic"><Send size={18}/></div>
              <div><b>Telegram Bot</b><small>@HoopStudioSystemBot</small></div>
            </a>
            <button type="button" className="mm-item" onClick={() => { setMenuOpen(false); onClose(); }}>
              <div className="mm-ic"><X size={18}/></div>
              <div><b>{t('backHome')}</b><small>Exit Booking</small></div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: EVENT */}
      {step === 1 && (
        <section className="m-scr active">
          <div className="m-hero">
            <div className="h-track" style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
              {images.map((img, i) => (
                <div key={i} className="h-slide" style={{ background: `url('${img}') center 35%/cover no-repeat` }}>
                  <div className="hero-cap">CAPTURE<br/>YOUR SPECIAL<br/>MOMENTS</div>
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="h-dots">
                {images.map((_, i) => (
                  <span key={i} className={i === slideIdx ? 'on' : ''} onClick={() => setSlideIdx(i)}/>
                ))}
              </div>
            )}
          </div>

          <div className="m-sheet">
            <span className="badge-best">
              <Crown size={12} color="#e31e24"/>
              <span>{t('bestValue')}</span>
            </span>
            <h1>{pkgName}</h1>
            <p className="m-sub">{t('pkgDesc')}</p>
            <div className="price">{totalPrice.toLocaleString()} <small>ETB</small></div>

            <div className="m-icons">
              <div className="inc"><Camera size={22}/><span>{t('photography')}</span></div>
              <div className="inc"><Film size={22}/><span>{t('videography')}</span></div>
              <div className="inc"><Users size={22}/><span>{t('proTeam')}</span></div>
              <div className="inc"><ImageIcon size={22}/><span>{t('hiOutput')}</span></div>
            </div>

            <div className="pkg-checklist">
              <div className="pkg-check-head">
                <Check size={18} strokeWidth={2.5}/>
                <span>{t('pkgIncludedTitle')}</span>
              </div>
              <ul className="checklist">
                {deliverables.map((d, i) => (
                  <li key={i}>
                    <Check size={16} strokeWidth={2.4}/>
                    <span>{d.replace(/^•\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button type="button" className="m-cta" onClick={() => setStep(2)}>
              <span>{t('continueDate')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: DATE & CONTACT */}
      {step === 2 && (
        <section className="m-scr active">
          <div className="m-pad">
            <h1>{t('selectDate')}</h1>
            <p className="m-sub">{t('chooseDate')}</p>

            <VeloCalendar
              value={form.date}
              onChange={d => setForm(f => ({ ...f, date: d }))}
              blackoutDates={blackoutDates}
              bookedDates={bookedDates}
              lang={activeLang}
            />

            <h2 className="m-h2">{t('contactDetails')}</h2>
            <div className="field"><User size={16}/><input placeholder={t('fullName')} name="name" value={form.name} onChange={update}/></div>
            <div className="field"><Phone size={16}/><input type="tel" placeholder={t('phonePh')} name="phone" value={form.phone} onChange={update}/></div>
            <div className="field"><Globe size={16}/><input type="email" placeholder={t('emailPh')} name="email" value={form.email} onChange={update}/></div>
            <div className="field"><MapPin size={16}/><input placeholder="Addis Ababa" name="location" value={form.location} onChange={update}/></div>

            <div className="notes-label"><MessageCircle size={14}/><span>{t('notesLbl')}</span></div>
            <div className="notes-wrap">
              <textarea placeholder={t('notesPh')} name="note" value={form.note} onChange={update} maxLength={500}/>
              <span className="cnt">{(form.note || '').length}/500</span>
            </div>

            {error && <p style={{ color: '#e31e24', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

            <button type="button" className="m-cta" onClick={handleProceedToSign}>
              <span>{t('reviewSign')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: SIGN */}
      {step === 3 && (
        <section className="m-scr active">
          <div className="m-pad">
            <h1>{t('signTitle')}</h1>
            <p className="m-sub">{t('signSub')}</p>

            <div className="doc-trigger-card">
              <div className="doc-trigger-top">
                <div className="pdf-badge"><FileText size={22} color="#fff"/></div>
                <div className="doc-trigger-info">
                  <h4>{t('contractDocument')}</h4>
                  <span className="fname">HOPE_Official_Agreement_2026.pdf</span>
                </div>
                <button type="button" className="btn-view-doc" onClick={() => setContractFullscreen(true)}>
                  <Maximize2 size={13}/>
                  <span>{activeLang === 'am' ? 'ሙሉ ውሉን ክፈት' : 'View Doc'}</span>
                </button>
              </div>
            </div>

            <h2 className="m-h2">{t('yourSignature')}</h2>
            <div className="sig-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{t('tapSign')}</span>
                {signature && (
                  <button type="button" className="clear-btn" onClick={() => { sigPadRef.current?.clear(); setSignature(null); }}>
                    {t('clear')}
                  </button>
                )}
              </div>
              <VeloSigPad ref={sigPadRef} onSign={setSignature} onClear={() => setSignature(null)}/>
              <label className="terms">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)}/>
                <p>{t('agreePre')}<a href="#terms" onClick={e => { e.preventDefault(); setContractFullscreen(true); }}>{t('agreeTerms')}</a></p>
              </label>
            </div>

            {error && <p style={{ color: '#e31e24', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

            <button type="button" className="m-cta" onClick={handleSubmitBooking} disabled={submitting}>
              <span>{submitting ? 'Submitting…' : t('confirmSubmit')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: SUMMARY */}
      {step === 4 && (
        <section className="m-scr active">
          <div className="m-pad">
            <div className="recv-ic"><Check size={40} color="#e31e24" strokeWidth={3}/></div>
            <h1 className="recv-title">{t('payTitle')}</h1>
            <p className="recv-msg">{t('paySub')}</p>

            <div className="pay-card" style={{ marginTop: '20px' }}>
              <div className="pay-head"><Clock size={18}/><b>{t('bookingSummary')}</b></div>
              <div className="prow"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
              <div className="prow"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
              <div className="prow"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
              <div className="prow"><span>{t('depositLbl')}</span><b className="red">{deposit.toLocaleString()} ETB</b></div>
              <div className="prow"><span>{t('balanceLbl')}</span><b>{remaining.toLocaleString()} ETB</b></div>
              <div className="prow"><span>{t('refLbl')}</span><b className="red">{curRefId}</b></div>
            </div>

            <div className="total-card">
              <CreditCard size={20}/>
              <div><small>{t('totalLbl')}</small><b>{totalPrice.toLocaleString()} ETB</b></div>
            </div>

            <button type="button" className="m-cta" onClick={() => setStep(5)}>
              <span>{t('continuePayment')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: PAYMENT METHODS */}
      {step === 5 && (
        <section className="m-scr active">
          <div className="m-pad">
            <h1>{t('payMTitle')}</h1>
            <p className="m-sub">{t('payMSub')}</p>

            <div className="pay-card" style={{ marginTop: '16px' }}>
              {paymentMethods.map(m => {
                const isSel = payMethod === m.id;
                const isCopied = copyFeedback === m.id;
                return (
                  <div key={m.id} className={`pm-card${isSel ? ' sel' : ''}`} onClick={() => setPayMethod(m.id)}>
                    <div className="pm-top">
                      <span className={`pm-logo ${m.logoClass}`}>{m.letter}</span>
                      <div><b>{m.title}</b><small>{m.sub}</small></div>
                      <span className="pm-radio"/>
                    </div>
                    <div className="pm-acc">
                      <div className="pm-acc-in">
                        <span>
                          <span className="acc-lbl">{m.lbl}</span>
                          <span className="acc-num">{m.acc}</span>
                        </span>
                        {m.id !== 'cash' && (
                          <button type="button" className="copy-btn" onClick={e => { e.stopPropagation(); handleCopy(m.acc, m.id); }} aria-label="Copy">
                            {isCopied ? <Check size={15}/> : <Copy size={15}/>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" className="m-cta" onClick={() => setStep(6)}>
              <span>{t('toUpload')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 6: UPLOAD */}
      {step === 6 && (
        <section className="m-scr active">
          <div className="m-pad">
            <h1>{t('uploadTitle')}</h1>
            <p className="m-sub">{t('uploadSub')}</p>

            <div
              className={`up-zone${paymentProof ? ' has' : ''}`}
              onClick={() => proofInputRef.current?.click()}
              style={{ marginTop: '16px' }}
            >
              <input ref={proofInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProofChange}/>
              <div className="cloud"><Upload size={28}/></div>
              {paymentProof ? (
                <>
                  <img src={paymentProof} alt="Proof preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, objectFit: 'cover' }}/>
                  <div className="up-file show"><Check size={14}/><span>{proofFileName || 'receipt.png'}</span></div>
                </>
              ) : (
                <>
                  <b>{t('tapUpload')}</b>
                  <p>{t('dragText')}</p>
                  <span className="fhint"><ImageIcon size={13}/><span>{t('fileHint')}</span></span>
                </>
              )}
            </div>

            {paymentProof && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="button" className="btn btn-ghost" style={{ fontSize: '12px' }} onClick={() => { setPaymentProof(null); setProofFileName(''); }}>
                  ✕ Remove Screenshot
                </button>
              </div>
            )}

            <div className="info-card">
              <ShieldCheck size={16}/>
              <span>{t('uploadNote')}</span>
            </div>

            <button type="button" className="m-cta" onClick={handleSubmitProof} disabled={submitProofLoading}>
              <span>{submitProofLoading ? 'Submitting…' : t('submitShot')}</span>
              <ArrowRight size={16}/>
            </button>
          </div>
        </section>
      )}

      {/* STEP 7: PENDING VERIFICATION */}
      {step === 7 && (
        <section className="m-scr active">
          <div className="m-pad">
            <div className="v2-pending-card">
              <div className="v2-pending-circle"><Clock size={20} color="#fff"/></div>
              <div className="v2-ptext">
                <h2>{t('pendingTitle')}</h2>
                <p>{t('pendingSub')}</p>
              </div>
            </div>

            <div className="v2-card" style={{ marginTop: '16px' }}>
              <div className="v2-card-head"><Clock size={16} color="#d97706"/><b>{t('bookingSummary')}</b></div>
              <div className="v2-rows">
                <div className="v2-row"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
                <div className="v2-row"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
                <div className="v2-row"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
                <div className="v2-row"><span>{t('depositLbl')}</span><b className="v2-amber">{deposit.toLocaleString()} ETB</b></div>
                <div className="v2-row"><span>Reference</span><b className="v2-red">{curRefId}</b></div>
              </div>
            </div>

            <div className="v2-card v2-qr-card">
              <div className="v2-qr-wrap"><QRCode value={trackingUrl} size={92}/></div>
              <div className="v2-qr-info">
                <b className="v2-act-title">{t('trackTitle')}</b>
                <p className="v2-act-desc">{t('trackDesc')}</p>
                <div className="v2-pill-row">
                  <span className="ref-pill">
                    {curRefId}
                    <button type="button" onClick={() => handleCopy(curRefId, 'ref-mpend')} aria-label="Copy">
                      {copyFeedback === 'ref-mpend' ? <Check size={15}/> : <Copy size={15}/>}
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div className="v2-btn-group">
              <button type="button" className="btn-open-agr" onClick={() => setContractFullscreen(true)}>
                <FileText size={17}/>
                <span>{t('openAgreement')}</span>
              </button>
              <button type="button" className="vbf-rc-download-btn" onClick={handleDownloadReceiptCard} disabled={downloadingCard}>
                <Download size={17}/>
                <span>{downloadingCard ? 'Generating…' : t('downloadCard')}</span>
              </button>
              <button type="button" className="btn-simulate-qr" onClick={() => setStep(8)}>
                <ShieldCheck size={17}/>
                <span>{t('viewReceipt')}</span>
              </button>
              <a className="btn btn-red btn-back-home" style={{ textDecoration: 'none', justifyContent: 'center' }} href={`/?order=${curRefId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16}/>
                <span>{t('liveOrderPage')}</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* STEP 8: VERIFIED */}
      {step === 8 && (
        <section className="m-scr active">
          <div className="m-pad">
            <div className="v2-verified-card">
              <div className="v2-check-circle"><Check size={22} color="#fff" strokeWidth={3}/></div>
              <div className="v2-vtext">
                <h2>{t('verifiedTitle')}</h2>
                <p>{t('verifiedSub')}</p>
              </div>
            </div>

            <div className="v2-card" style={{ marginTop: '16px' }}>
              <div className="v2-card-head"><CheckCircle size={16} color="#15803d"/><b>{t('bookingSummary')}</b></div>
              <div className="v2-rows">
                <div className="v2-row"><span>{t('pkgLbl')}</span><b>{pkgName}</b></div>
                <div className="v2-row"><span>{t('clientLbl')}</span><b>{form.name}</b></div>
                <div className="v2-row"><span>{t('dateLbl')}</span><b>{form.date}</b></div>
                <div className="v2-row"><span>{t('depositLbl')}</span><b className="v2-green">{deposit.toLocaleString()} ETB</b></div>
                <div className="v2-row"><span>Reference</span><b className="v2-red">{curRefId}</b></div>
              </div>
            </div>

            <div className="v2-card v2-qr-card">
              <div className="v2-qr-wrap"><QRCode value={trackingUrl} size={92}/></div>
              <div className="v2-qr-info">
                <b className="v2-act-title">{t('trackTitle')}</b>
                <p className="v2-act-desc">{t('trackDesc')}</p>
                <div className="v2-pill-row">
                  <span className="ref-pill">
                    {curRefId}
                    <button type="button" onClick={() => handleCopy(curRefId, 'ref-mver')} aria-label="Copy">
                      {copyFeedback === 'ref-mver' ? <Check size={15}/> : <Copy size={15}/>}
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div className="v2-btn-group">
              <button type="button" className="btn-open-agr" onClick={() => setContractFullscreen(true)}>
                <FileText size={17}/>
                <span>{t('openAgreement')}</span>
              </button>
              <button type="button" className="vbf-rc-download-btn" onClick={handleDownloadReceiptCard} disabled={downloadingCard}>
                <Download size={17}/>
                <span>{downloadingCard ? 'Generating…' : t('downloadCard')}</span>
              </button>
              <button type="button" className="btn btn-red btn-back-home" onClick={onClose}>
                <Home size={16}/>
                <span>{t('backHome')}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );

  return (
    <>
      {/* Either Desktop 2-column slide-in modal or Mobile app */}
      {isDesktop ? renderDesktopModal() : (
        <div className="vbf-overlay" role="dialog" aria-modal="true">
          <button type="button" className="vbf-backdrop" aria-label="Close" onClick={onClose}/>
          <div className="vbf-modal" style={{ padding: 0, overflow: 'auto', background: '#f4f3f1' }}>
            {renderMobileApp()}
          </div>
        </div>
      )}

      {/* Global Fullscreen Document Popup */}
      {contractFullscreen && (
        <div className="doc-fs-overlay active" style={{ display: 'flex' }}>
          <div className="doc-fs-top">
            <div className="doc-fs-brand">
              <div className="pdf-badge"><FileText size={22} color="#fff"/></div>
              <div>
                <h4>{activeLang === 'am' ? 'የሆፕ ስቱዲዮ ይፋዊ ውል' : 'HOPE Studio Official Contract'}</h4>
                <span className="fname">HOPE_Official_Agreement_2026.pdf • Official Legal Contract</span>
              </div>
            </div>
            <div className="doc-fs-actions">
              <button type="button" className="doc-fs-close" onClick={() => setContractFullscreen(false)}>
                ✕ {t('cancel')}
              </button>
            </div>
          </div>
          <div className="doc-fs-body">
            <div className="doc-fs-paper">
              <DocumentStyleAgreement
                agreement={activeAgreement}
                clientName={form.name || 'Client'}
                phone={form.phone || ''}
                eventDate={form.date || ''}
                location={form.location || 'Addis Ababa'}
                totalPrice={totalPrice}
                depositAmount={deposit}
                remainingBalance={remaining}
                signature={signature}
                onSign={setSignature}
                onClearSignature={() => setSignature(null)}
                lang={activeLang}
                readOnly={step >= 4 || dScreen !== 'scrSign'}
                orderId={curRefId}
              />
            </div>
          </div>
          <div className="doc-fs-foot">
            <button type="button" className="btn btn-red" onClick={() => setContractFullscreen(false)}>
              {t('doneReview')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
