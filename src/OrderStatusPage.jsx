import React, { useEffect, useState } from 'react';
import {
  CheckCircle2, Clock, AlertCircle, MessageSquare, Send, Calendar,
  User, Phone, MapPin, Package, ShieldCheck, ChevronLeft, RefreshCw,
  Sparkles, Camera, Film, ArrowRight, Share2, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import QRCode from './QRCode.jsx';

export default function OrderStatusPage({ orderId, lang = 'am', onBack }) {
  const [activeLang, setActiveLang] = useState(lang);
  const [order, setOrder] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const apiBase = window.location.hostname === 'localhost' ? 'https://hope-photo-velo-jade.vercel.app' : '';

  // Local storage key for offline/fallback caching
  const localOrderKey = `hope_cached_order_${orderId}`;
  const localCommentsKey = `hope_cached_comments_${orderId}`;

  // Fetch Order & Comments
  const fetchOrderData = async () => {
    setLoading(true);
    setError('');
    let fetchedOrder = null;
    let fetchedComments = [];

    // Check local storage cache first
    try {
      const cachedOrder = localStorage.getItem(localOrderKey);
      if (cachedOrder) fetchedOrder = JSON.parse(cachedOrder);
      const cachedComments = localStorage.getItem(localCommentsKey);
      if (cachedComments) fetchedComments = JSON.parse(cachedComments);
    } catch {}

    try {
      const res = await fetch(`${apiBase}/api/orders?id=${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.order) {
          fetchedOrder = data.order;
          try { localStorage.setItem(localOrderKey, JSON.stringify(data.order)); } catch {}
        }
        if (Array.isArray(data?.comments)) {
          fetchedComments = data.comments;
          try { localStorage.setItem(localCommentsKey, JSON.stringify(data.comments)); } catch {}
        }
      } else if (!fetchedOrder) {
        // Fallback mock order if backend has no record yet
        fetchedOrder = {
          id: orderId,
          clientName: 'Valued Client',
          phone: '0910526962',
          eventDate: new Date().toISOString().split('T')[0],
          location: 'Addis Ababa, Ethiopia',
          packageName: 'HOPE Studio & Event Package',
          totalPrice: 18500,
          depositAmount: 9250,
          remainingBalance: 9250,
          paymentMethod: 'telebirr',
          paymentStatus: 'PENDING_VERIFICATION',
          jobStatus: 'SCHEDULED',
          createdAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Backend fetch failed, using local/fallback:', err);
      if (!fetchedOrder) {
        fetchedOrder = {
          id: orderId,
          clientName: 'Valued Client',
          phone: '0910526962',
          eventDate: new Date().toISOString().split('T')[0],
          location: 'Addis Ababa, Ethiopia',
          packageName: 'HOPE Studio & Event Package',
          totalPrice: 18500,
          depositAmount: 9250,
          remainingBalance: 9250,
          paymentMethod: 'telebirr',
          paymentStatus: 'PENDING_VERIFICATION',
          jobStatus: 'SCHEDULED',
          createdAt: new Date().toISOString()
        };
      }
    }

    setOrder(fetchedOrder);
    setComments(fetchedComments);
    if (fetchedOrder?.clientName && !authorName) {
      setAuthorName(fetchedOrder.clientName);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setCommentSuccess(false);

    const newCommentObj = {
      id: 'cmsg-' + Date.now(),
      orderId,
      sender: 'client',
      senderName: authorName.trim() || order?.clientName || 'Client',
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    // Update locally immediately for instant UX
    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    try {
      localStorage.setItem(localCommentsKey, JSON.stringify(updatedComments));
    } catch {}

    // Send to backend
    try {
      await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          orderId,
          sender: 'client',
          senderName: newCommentObj.senderName,
          text: newCommentObj.text
        })
      });
    } catch (err) {
      console.warn('Backend comment push failed, stored locally:', err);
    }

    setCommentText('');
    setSubmittingComment(false);
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText?.(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Status mapping
  const isPaymentVerified = order?.paymentStatus === 'VERIFIED' || order?.status === 'VERIFIED';
  const isJobDone = order?.jobStatus === 'COMPLETED' || order?.status === 'COMPLETED';

  // 5 Progress Steps for "Is it done?"
  const progressSteps = [
    {
      id: 'booked',
      titleAm: 'የቀን ምዝገባ',
      titleEn: 'Booking Reserved',
      titleOm: 'Galmee Qabame',
      descAm: 'የተመረጠው ቀን ተይዟል',
      descEn: 'Date reserved & locked',
      completed: true,
      active: order?.jobStatus === 'SCHEDULED' || !order?.jobStatus
    },
    {
      id: 'consult',
      titleAm: 'ቅድመ-ቀረጻ ዝግጅት',
      titleEn: 'Pre-Shoot Prep',
      titleOm: 'Qophii Duraa',
      descAm: 'የአልባሳት እና የቦታ ዝግጅት',
      descEn: 'Wardrobe & schedule prep',
      completed: ['IN_PRODUCTION', 'EDITING', 'COMPLETED'].includes(order?.jobStatus),
      active: order?.jobStatus === 'PREP'
    },
    {
      id: 'shoot',
      titleAm: 'የቀረጻ ቀን',
      titleEn: 'Shoot Day',
      titleOm: 'Guyyaa Waraabsaa',
      descAm: 'የፎቶ እና ቪዲዮ ቀረጻ',
      descEn: 'Full photo & video coverage',
      completed: ['EDITING', 'COMPLETED'].includes(order?.jobStatus),
      active: order?.jobStatus === 'IN_PRODUCTION'
    },
    {
      id: 'editing',
      titleAm: 'ኤዲቲንግ እና ከለር',
      titleEn: 'Editing & Grading',
      titleOm: 'Gulaallii Viidiyoo',
      descAm: 'ሲኒማቲክ ኤዲቲንግ',
      descEn: 'Color grading & retouching',
      completed: order?.jobStatus === 'COMPLETED',
      active: order?.jobStatus === 'EDITING'
    },
    {
      id: 'delivery',
      titleAm: 'ርክክብ (ተጠናቋል!)',
      titleEn: 'Completed & Ready!',
      titleOm: 'Xumurameera!',
      descAm: 'አልበም እና ሶፍት ኮፒ ዝግጁ',
      descEn: 'Albums & files ready for pickup',
      completed: order?.jobStatus === 'COMPLETED',
      active: order?.jobStatus === 'COMPLETED'
    }
  ];

  const quickNotes = [
    activeLang === 'am' ? '📸 የጋርደን ፎቶ በ 3:00pm እንዲሆን እንፈልጋለን' : '📸 We prefer garden shoot around 3:00 PM',
    activeLang === 'am' ? '💳 የቴሌብር ማረጋገጫ ቁጥር ልከናል' : '💳 Deposit sent via Telebirr',
    activeLang === 'am' ? '⏰ የሰዓት ማስተካከያ ጥያቄ አለን' : '⏰ Inquiry regarding shoot timeline',
    activeLang === 'am' ? '✨ የቤተሰብ ፎቶዎች ላይ ልዩ ትኩረት ይሰጥልን' : '✨ Please prioritize family group portraits'
  ];

  if (loading) {
    return (
      <div className="vop-loading-screen">
        <div className="vop-spinner" />
        <div className="vop-loading-text">
          {activeLang === 'am' ? 'የትዕዛዝ መረጃ በመጫን ላይ…' : 'Loading Order Details…'}
        </div>
      </div>
    );
  }

  return (
    <div className="vop-page">
      {/* ── TOP NAV BAR ── */}
      <header className="vop-navbar">
        <div className="vop-nav-inner">
          <button
            type="button"
            className="vop-back-btn"
            onClick={onBack || (() => { window.location.href = '/'; })}
            aria-label="Back to home"
          >
            <ChevronLeft size={18} />
            <span>{activeLang === 'am' ? 'ዋና ገጽ' : activeLang === 'om' ? 'Fuula Duraa' : 'Home'}</span>
          </button>

          <div className="vop-nav-brand">
            <div className="vop-nav-brand-title">Velo</div>
            <div className="vop-nav-brand-sub">LIVE ORDER TRACKING</div>
          </div>

          <div className="vop-nav-lang-wrap">
            <button
              type="button"
              className={`vop-lang-pill ${activeLang === 'am' ? 'active' : ''}`}
              onClick={() => setActiveLang('am')}
            >
              አማ
            </button>
            <button
              type="button"
              className={`vop-lang-pill ${activeLang === 'en' ? 'active' : ''}`}
              onClick={() => setActiveLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`vop-lang-pill ${activeLang === 'om' ? 'active' : ''}`}
              onClick={() => setActiveLang('om')}
            >
              OR
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="vop-main-container">
        {/* Order Header Card */}
        <section className="vop-card vop-header-card">
          <div className="vop-order-meta-bar">
            <div>
              <span className="vop-meta-label">
                {activeLang === 'am' ? 'የትዕዛዝ ቁጥር' : 'Order Reference'}
              </span>
              <h1 className="vop-meta-id">{order?.id || orderId}</h1>
            </div>
            <div className="vop-share-actions">
              <a
                href={`https://t.me/HoopStudioSystemBot?start=order_${order?.id || orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="vop-share-btn vop-tg-pill-btn"
                title="Track via Telegram Bot"
                style={{ textDecoration: 'none' }}
              >
                <Send size={13} />
                <span>{activeLang === 'am' ? 'ቴሌግራም ቦት' : 'Telegram Bot'}</span>
              </a>
              <button
                type="button"
                className="vop-share-btn"
                onClick={handleCopyShareLink}
                title="Copy share link"
              >
                {copiedLink ? <Check size={14} className="vop-text-green" /> : <Share2 size={14} />}
                <span>{copiedLink ? (activeLang === 'am' ? 'ተቀድቷል!' : 'Copied!') : (activeLang === 'am' ? 'ሊንክ አጋራ' : 'Share Link')}</span>
              </button>
              <button
                type="button"
                className="vop-refresh-btn"
                onClick={fetchOrderData}
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Quick Client Details Grid */}
          <div className="vop-details-grid">
            <div className="vop-detail-item">
              <User size={15} className="vop-detail-icon" />
              <div>
                <div className="vop-sub-label">{activeLang === 'am' ? 'ደንበኛ' : 'Client Name'}</div>
                <div className="vop-sub-val">{order?.clientName || '—'}</div>
              </div>
            </div>

            <div className="vop-detail-item">
              <Phone size={15} className="vop-detail-icon" />
              <div>
                <div className="vop-sub-label">{activeLang === 'am' ? 'ስልክ' : 'Phone'}</div>
                <div className="vop-sub-val">{order?.phone || '—'}</div>
              </div>
            </div>

            <div className="vop-detail-item">
              <Calendar size={15} className="vop-detail-icon" />
              <div>
                <div className="vop-sub-label">{activeLang === 'am' ? 'የቀረጻ ቀን' : 'Event Date'}</div>
                <div className="vop-sub-val">
                  {order?.eventDate ? new Date(order.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </div>
              </div>
            </div>

            <div className="vop-detail-item">
              <Package size={15} className="vop-detail-icon" />
              <div>
                <div className="vop-sub-label">{activeLang === 'am' ? 'ፓኬጅ' : 'Package'}</div>
                <div className="vop-sub-val">{order?.packageName || 'Selected Studio Package'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUESTION 1: "IS PAYMENT VERIFIED?" ── */}
        <section className="vop-card vop-payment-card">
          <div className="vop-card-header">
            <div className="vop-card-title-wrap">
              <div className="vop-icon-badge vop-icon-gold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="vop-card-title">
                  {activeLang === 'am' ? 'የክፍያ ሁኔታ (Payment Verification)' : 'Payment Status & Verification'}
                </h2>
                <p className="vop-card-subtitle">
                  {activeLang === 'am' ? 'ክፍያዎ ተረጋግጧል ወይስ በማረጋገጥ ላይ ነው?' : 'Is your payment verified by our finance team?'}
                </p>
              </div>
            </div>

            {/* Main Status Badge */}
            <div className={`vop-status-badge ${isPaymentVerified ? 'verified' : 'pending'}`}>
              {isPaymentVerified ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>{activeLang === 'am' ? 'ክፍያው ተረጋግጧል (VERIFIED)' : 'PAYMENT VERIFIED'}</span>
                </>
              ) : (
                <>
                  <Clock size={16} />
                  <span>{activeLang === 'am' ? 'በማረጋገጥ ላይ (PENDING VERIFICATION)' : 'PENDING VERIFICATION'}</span>
                </>
              )}
            </div>
          </div>

          <div className="vop-payment-notice">
            {isPaymentVerified ? (
              <div className="vop-alert vop-alert-green">
                <CheckCircle2 size={18} className="vop-alert-icon" />
                <div>
                  <strong>{activeLang === 'am' ? 'የ 50% ቅድመ-ክፍያ በስቱዲዮ ፋይናንስ ተረጋግጧል!' : '50% Deposit is officially verified!'}</strong>
                  <p>
                    {activeLang === 'am'
                      ? 'የቀን ምዝገባዎ ሙሉ በሙሉ ተረጋግጧል። ቀሪው ክፍያ በቀረጻው ቀን የሚፈጸም ይሆናል።'
                      : 'Your date is securely locked. The remaining balance will be settled on the event day.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="vop-alert vop-alert-amber">
                <Clock size={18} className="vop-alert-icon" />
                <div>
                  <strong>{activeLang === 'am' ? 'ክፍያው በፋይናንስ ቡድን በማረጋገጥ ላይ ነው' : 'Payment receipt is under studio review'}</strong>
                  <p>
                    {activeLang === 'am'
                      ? 'የተላከውን የቴሌብር ወይም የባንክ ማረጋገጫ በ 1-2 ሰዓት ውስጥ አረጋግጠን እናሳውቆታለን።'
                      : 'Our finance team typically verifies bank & telebirr transfers within 1-2 hours.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment breakdown */}
          <div className="vop-price-breakdown">
            <div className="vop-price-row">
              <span>{activeLang === 'am' ? 'ጠቅላላ የፓኬጅ ዋጋ' : 'Total Package Price'}</span>
              <span className="vop-price-val">{Number(order?.totalPrice || order?.basePrice || 0).toLocaleString()} ETB</span>
            </div>
            <div className="vop-price-row vop-price-row-accent">
              <span>{activeLang === 'am' ? 'ቅድመ-ክፍያ (50% Deposit)' : 'Deposit Required (50%)'}</span>
              <span className="vop-price-val vop-text-green">{Number(order?.depositAmount || Math.round((order?.totalPrice || 0) * 0.5)).toLocaleString()} ETB</span>
            </div>
            <div className="vop-price-row">
              <span>{activeLang === 'am' ? 'ቀሪ ክፍያ (ቀረጻ ቀን የሚከፈል)' : 'Remaining Balance (Due on Shoot)'}</span>
              <span className="vop-price-val">{Number(order?.remainingBalance || Math.round((order?.totalPrice || 0) * 0.5)).toLocaleString()} ETB</span>
            </div>
            <div className="vop-price-row">
              <span>{activeLang === 'am' ? 'የክፍያ ዘዴ' : 'Payment Method'}</span>
              <span className="vop-price-val vop-method-tag">
                {(order?.paymentMethod || 'Telebirr').toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        {/* ── QUESTION 2: "IS IT DONE?" ── */}
        <section className="vop-card vop-job-card">
          <div className="vop-card-header">
            <div className="vop-card-title-wrap">
              <div className="vop-icon-badge vop-icon-dark">
                <Camera size={20} />
              </div>
              <div>
                <h2 className="vop-card-title">
                  {activeLang === 'am' ? 'የሥራው ሂደት (Job & Production Status)' : 'Production & Job Status'}
                </h2>
                <p className="vop-card-subtitle">
                  {activeLang === 'am' ? 'ሥራው ተጠናቋል? (Is it done?)' : 'Is the event/studio job completed?'}
                </p>
              </div>
            </div>

            <div className={`vop-status-badge ${isJobDone ? 'verified' : 'in-progress'}`}>
              {isJobDone ? (
                <>
                  <Check size={16} />
                  <span>{activeLang === 'am' ? 'ተጠናቋል (DONE & READY)' : 'COMPLETED'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{activeLang === 'am' ? 'በሂደት ላይ (IN PROGRESS)' : 'IN PROGRESS'}</span>
                </>
              )}
            </div>
          </div>

          {/* Stepper */}
          <div className="vop-stepper">
            {progressSteps.map((st, idx) => (
              <div
                key={st.id}
                className={`vop-step ${st.completed ? 'completed' : ''} ${st.active ? 'active' : ''}`}
              >
                <div className="vop-step-indicator">
                  <div className="vop-step-circle">
                    {st.completed ? <Check size={14} strokeWidth={3} /> : idx + 1}
                  </div>
                  {idx < progressSteps.length - 1 && <div className="vop-step-line" />}
                </div>
                <div className="vop-step-content">
                  <div className="vop-step-title">
                    {activeLang === 'am' ? st.titleAm : activeLang === 'om' ? st.titleOm : st.titleEn}
                  </div>
                  <div className="vop-step-desc">
                    {activeLang === 'am' ? st.descAm : st.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="vop-turnaround-box">
            <Clock size={16} />
            <span>
              {activeLang === 'am'
                ? 'የማስረከቢያ ጊዜ: ሶፍት ኮፒ 3-5 ቀናት • በእጅ የተሰሩ ላሚኔት አልበሞች እና ፍሬሞች 2-3 ሳምንት።'
                : 'Turnaround Timeline: Soft copies 3-5 days • Luxury laminate albums & printed boards 2-3 weeks.'}
            </span>
          </div>
        </section>

        {/* ── QUESTION 3: "CUSTOMERS ALSO CAN LEAVE COMMENTS ON IT" ── */}
        <section className="vop-card vop-comments-card">
          <div className="vop-card-header">
            <div className="vop-card-title-wrap">
              <div className="vop-icon-badge vop-icon-burgundy">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="vop-card-title">
                  {activeLang === 'am' ? 'የደንበኛ አስተያየት እና ልዩ ማስታወሻ' : 'Customer Notes & Comments'}
                </h2>
                <p className="vop-card-subtitle">
                  {activeLang === 'am'
                    ? 'ለስቱዲዮው ቡድን ጥያቄ፣ ማስታወሻ ወይም አስተያየት ያስቀምጡ'
                    : 'Leave questions, notes, or special requests directly for our studio team'}
                </p>
              </div>
            </div>
            <div className="vop-comment-count-badge">
              {comments.length} {activeLang === 'am' ? 'ማስታወሻዎች' : 'notes'}
            </div>
          </div>

          {/* Comment Stream */}
          <div className="vop-comments-feed">
            {comments.length === 0 ? (
              <div className="vop-no-comments">
                <MessageSquare size={28} className="vop-no-comments-icon" />
                <p>
                  {activeLang === 'am'
                    ? 'እስካሁን የተቀመጠ ማስታወሻ የለም። ከታች ባለው ቅጽ የመጀመሪያውን አስተያየትዎን ይጻፉ!'
                    : 'No comments left yet. Use the form below to leave your first note or special request!'}
                </p>
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id || Math.random()}
                  className={`vop-comment-bubble ${c.sender === 'admin' ? 'admin-bubble' : 'client-bubble'}`}
                >
                  <div className="vop-bubble-header">
                    <span className="vop-bubble-author">
                      {c.sender === 'admin'
                        ? '🏛️ HOPE Studio Management'
                        : `👤 ${c.senderName || order?.clientName || 'Client'}`}
                    </span>
                    <span className="vop-bubble-time">
                      {c.timestamp
                        ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                  <div className="vop-bubble-text">{c.text}</div>
                </div>
              ))
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="vop-quick-chips">
            <span className="vop-chips-label">
              {activeLang === 'am' ? 'ፈጣን ማስታወሻዎች:' : 'Quick templates:'}
            </span>
            <div className="vop-chips-list">
              {quickNotes.map((qn, i) => (
                <button
                  key={i}
                  type="button"
                  className="vop-chip-btn"
                  onClick={() => setCommentText(qn)}
                >
                  {qn}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Comment Form */}
          <form className="vop-comment-form" onSubmit={handleCommentSubmit}>
            <div className="vop-form-author-row">
              <label className="vop-form-label">
                {activeLang === 'am' ? 'የእርስዎ ስም' : 'Your Name'}:
              </label>
              <input
                type="text"
                className="vop-author-input"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="vop-form-textarea-wrap">
              <textarea
                className="vop-comment-textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  activeLang === 'am'
                    ? 'አስተያየት፣ ጥያቄ ወይም የቀረጻ ሰዓት ማስታወሻ እዚህ ይጻፉ…'
                    : 'Write your notes, questions, or specific shoot instructions here…'
                }
                required
              />
            </div>

            <div className="vop-form-submit-row">
              {commentSuccess && (
                <span className="vop-success-msg">
                  <Check size={14} /> {activeLang === 'am' ? 'አስተያየትዎ ተልኳል!' : 'Comment sent successfully!'}
                </span>
              )}
              <button
                type="submit"
                className="vop-submit-comment-btn"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? (
                  <span>{activeLang === 'am' ? 'በመላክ ላይ…' : 'Sending…'}</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{activeLang === 'am' ? 'አስተያየት ላክ' : 'Post Comment'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ── DIGITAL QR PASS / STAMP ── */}
        <section className="vop-card vop-qr-card">
          <div className="vop-qr-content">
            <QRCode
              value={window.location.href}
              size={140}
              label={activeLang === 'am' ? 'ይህንን QR ስካን በማድረግ በቀጥታ ይመልከቱ' : 'Scan to view this live page anytime'}
            />
            <div className="vop-qr-meta">
              <h3 className="vop-qr-title">HOPE Photo &amp; Velo Studio</h3>
              <p className="vop-qr-p">
                {activeLang === 'am'
                  ? 'ይህ የቀን ምዝገባ፣ የክፍያ ማረጋገጫ እና የሥራ ሂደት መከታተያ ይፋዊ ገጽ ነው።'
                  : 'Official real-time order tracking, payment verification, and delivery portal.'}
              </p>
              <div className="vop-qr-phone">
                📞 +251 9 10 52 69 62  •  +251 9 95 27 08 94
              </div>
              <a
                href={`https://t.me/HoopStudioSystemBot?start=order_${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="vop-telegram-btn"
              >
                <Send size={14} /> {activeLang === 'am' ? 'በቴሌግራም ቦት ተከታተሉ' : 'Open in Telegram Bot'}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
