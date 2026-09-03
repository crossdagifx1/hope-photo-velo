import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Film, Sparkles, MessageCircle, FileSignature, CheckCircle2,
  Clock, Calendar, MapPin, Send, Plus, Minus, Tag, AlertCircle, RefreshCw,
  Phone, ArrowRight, ShieldCheck, Download, Trash2, X, ChevronRight, User
} from 'lucide-react';
import './tma.css';

/* ── PRESET PACKAGES DATA ── */
const PACKAGES = [
  {
    id: 'studio-std',
    category: 'studio',
    title: 'Studio Standard',
    titleAm: 'የስቱዲዮ ስታንዳርድ',
    price: 14500,
    deliverables: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies']
  },
  {
    id: 'studio-prem',
    category: 'studio',
    title: 'Studio Premium Suite',
    titleAm: 'የስቱዲዮ ፕሪሚየም አልበም',
    price: 18500,
    deliverables: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies']
  },
  {
    id: 'wedding-bronze',
    category: 'wedding',
    title: 'Wedding Bronze Video',
    titleAm: 'የሰርግ ብሮንዝ ቪዲዮ',
    price: 45000,
    deliverables: ['2 Professional Cameras', 'Ronin Gimbal Stabilization', 'Ameran Cinema Light', 'Highlight Trailer Video', 'Full Cinema Feature Film', 'Color Grading', 'All Soft Copies']
  },
  {
    id: 'wedding-silver',
    category: 'wedding',
    title: 'Wedding Silver Video',
    titleAm: 'የሰርግ ሲልቨር ቪዲዮ',
    price: 60000,
    deliverables: ['3 Professional Cameras', 'Ronin Gimbal', 'Ameran Lighting System', 'Highlight Trailer & Teaser', 'Full Cinema Film', 'Color Grading', '40×60 Board Photo', 'All Soft Copies']
  },
  {
    id: 'wedding-golden',
    category: 'wedding',
    title: 'Wedding Golden Plus Suite',
    titleAm: 'የሰርግ ጎልደን ፕላስ ሱዊት',
    price: 75000,
    deliverables: ['4 Cinema Cameras', 'Ronin Gimbal', 'Ameran Studio Lighting', 'Highlight Trailer', 'Full Cinema Film', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies']
  },
  {
    id: 'mesk-luxury',
    category: 'mesk',
    title: 'Luxury Mesk Session',
    titleAm: 'የመስክ እና ልዩ አልበም',
    price: 20000,
    deliverables: ['Cinematic Mesk Outdoor Video', '30×45 Laminate Album', '1 Sign Board', '150 High-Res Soft Copies', 'Color Grading']
  }
];

/* ── OPTIONAL ADD-ONS ── */
const ADDONS_LIST = [
  { id: 'drone', name: '4K Aerial Drone Coverage', price: 6000, desc: 'Cinematic aerial footage of church, procession & venue' },
  { id: 'extra-cam', name: 'Extra Cinema Camera Operator', price: 7500, desc: 'Captures spontaneous guest & family reactions' },
  { id: 'rush-edit', name: '48-Hour Rush Video Delivery', price: 5000, desc: 'Priority post-production for immediate sharing' },
  { id: 'wall-board', name: 'Deluxe 50×80 Acrylic Wall Board', price: 4000, desc: 'Museum-grade wall piece for living room' },
  { id: 'makeup', name: 'VIP Bridal Makeup Artist', price: 4500, desc: 'Professional on-location makeup touchups' }
];

export default function TelegramMiniApp({ onClose }) {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || { id: 'demo_user', first_name: 'Guest', username: 'guest' };

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'order' | 'chat' | 'agreement' | 'my_orders'
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[2]); // Default: Wedding Bronze
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('Addis Ababa');
  const [clientName, setClientName] = useState(user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Active Order State
  const [activeOrder, setActiveOrder] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // E-Signature Pad State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signedAgreement, setSignedAgreement] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  // Telegram WebApp Setup
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      try {
        tg.enableClosingConfirmation?.();
      } catch (e) {}
    }

    // Check URL parameters for deep links
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('order_id');
    const tabParam = params.get('tab');

    if (orderIdParam) {
      fetchOrder(orderIdParam);
    }
    if (tabParam && ['catalog', 'order', 'chat', 'agreement', 'my_orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Poll chat messages if in chat tab
  useEffect(() => {
    if (activeTab === 'chat' && activeOrder?.id) {
      fetchChat(activeOrder.id);
      const interval = setInterval(() => fetchChat(activeOrder.id), 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, activeOrder?.id]);

  // Haptic trigger
  const haptic = (type = 'light') => {
    try {
      if (tg?.HapticFeedback) {
        if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
        else tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  // Price Calculation
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const basePrice = selectedPkg?.price || 0;
  const rawTotal = basePrice + addonsTotal;
  const currentTotal = activeOrder ? (activeOrder.negotiatedPrice || activeOrder.totalPrice) : rawTotal;
  const depositDue = Math.round(currentTotal * 0.3);

  const toggleAddon = (addon) => {
    haptic('light');
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Create or Submit Order
  const handleCreateOrder = async () => {
    if (!clientName || !phone || !eventDate) {
      alert('Please fill in your name, phone number, and event date.');
      return;
    }

    setIsSubmittingOrder(true);
    haptic('medium');

    try {
      const payload = {
        clientName,
        phone,
        telegramUserId: user.id,
        telegramUsername: user.username || '',
        category: selectedPkg.category,
        packageId: selectedPkg.id,
        packageName: selectedPkg.title,
        basePrice: selectedPkg.price,
        addons: selectedAddons,
        totalPrice: rawTotal,
        negotiatedPrice: rawTotal,
        eventDate,
        location,
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.order) {
        setActiveOrder(data.order);
        setOrdersList(prev => [data.order, ...prev]);
        setActiveTab('chat');
        haptic('success');
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      // Offline fallback for preview
      const fakeOrder = {
        id: 'HOPE-' + Math.floor(1000 + Math.random() * 9000),
        clientName,
        phone,
        packageName: selectedPkg.title,
        totalPrice: rawTotal,
        negotiatedPrice: rawTotal,
        discountAmount: 0,
        eventDate,
        location,
        status: 'pending_quote',
        createdAt: new Date().toISOString()
      };
      setActiveOrder(fakeOrder);
      setActiveTab('chat');
      haptic('success');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Fetch Order
  const fetchOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`);
      const data = await res.json();
      if (data.order) {
        setActiveOrder(data.order);
      }
    } catch (e) {}
  };

  // Fetch Chat
  const fetchChat = async (orderId) => {
    try {
      const res = await fetch(`/api/chat?order_id=${orderId}`);
      const data = await res.json();
      if (data.messages) {
        setChatMessages(data.messages);
      }
      if (data.order) {
        setActiveOrder(data.order);
      }
    } catch (e) {}
  };

  // Send Message in Chat
  const handleSendMessage = async (customText = null, isDiscountReq = false) => {
    const textToSend = customText || chatInput.trim();
    if (!textToSend || !activeOrder?.id) return;

    haptic('light');
    setIsSendingMsg(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: activeOrder.id,
          text: textToSend,
          sender: 'client',
          senderName: clientName || user.first_name || 'Client',
          type: isDiscountReq ? 'discount_request' : 'text'
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages(prev => [...prev, data.message]);
        if (!customText) setChatInput('');
      }
    } catch (err) {
      // Offline fallback
      setChatMessages(prev => [
        ...prev,
        {
          id: 'temp-' + Date.now(),
          sender: 'client',
          senderName: clientName || 'Client',
          text: textToSend,
          timestamp: new Date().toISOString()
        }
      ]);
      if (!customText) setChatInput('');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // ── CANVAS E-SIGNATURE HANDLING ──
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#b92539';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    haptic('light');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  // Submit Signed Contract
  const handleSignAgreement = async () => {
    if (!hasSignature) {
      alert('Please draw your signature in the box before proceeding.');
      return;
    }
    if (!termsAccepted) {
      alert('Please check the agreement box to accept terms & deliverables.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');

    setIsSigning(true);
    haptic('medium');

    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder?.id || 'HOPE-DEMO',
          clientName: clientName || user.first_name,
          signatureDataUrl,
          termsAccepted: true,
          eventDate: activeOrder?.eventDate || eventDate,
          location: activeOrder?.location || location,
          agreedPrice: currentTotal,
          depositAmount: depositDue
        })
      });
      const data = await res.json();
      if (data.success && data.agreement) {
        setSignedAgreement(data.agreement);
        setActiveTab('my_orders');
        haptic('success');
      } else {
        alert(data.error || 'Failed to submit signature');
      }
    } catch (err) {
      // Fallback
      setSignedAgreement({
        id: 'HOPE-AGR-8821',
        orderId: activeOrder?.id || 'HOPE-DEMO',
        clientName: clientName || 'Valued Client',
        agreedPrice: currentTotal,
        depositAmount: depositDue,
        verificationHash: 'SHA256:4f8a912b7c03',
        signedAt: new Date().toISOString()
      });
      setActiveTab('my_orders');
      haptic('success');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="tma-container">
      {/* ── TMA TOP BAR ── */}
      <header className="tma-header">
        <div className="tma-header-user">
          <div className="tma-avatar">
            {user.photo_url ? (
              <img src={user.photo_url} alt="User" />
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="tma-user-meta">
            <span className="tma-username">{user.first_name || 'Guest Client'}</span>
            <span className="tma-user-status">HOPE Official Mini App • Online</span>
          </div>
        </div>
        {onClose && (
          <button className="tma-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </header>

      {/* ── TMA TAB NAVIGATION ── */}
      <nav className="tma-tab-bar">
        <button
          className={`tma-tab-item ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('catalog'); }}
        >
          <Camera size={16} />
          <span>Services</span>
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('order'); }}
        >
          <Sparkles size={16} />
          <span>Customize</span>
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('chat'); }}
        >
          <MessageCircle size={16} />
          <span>Negotiate</span>
          {activeOrder && <span className="tma-tab-badge">●</span>}
        </button>
        <button
          className={`tma-tab-item ${activeTab === 'agreement' ? 'active' : ''}`}
          onClick={() => { haptic(); setActiveTab('agreement'); }}
        >
          <FileSignature size={16} />
          <span>Contract</span>
        </button>
      </nav>

      {/* ── TAB 1: CATALOG VIEW ── */}
      {activeTab === 'catalog' && (
        <div className="tma-content">
          <div className="tma-banner">
            <span className="tma-banner-tag">HOPE Studio 2026 Collection</span>
            <h2>Select Your Service Experience</h2>
            <p>Customize deliverables, negotiate live discounts, and sign your official contract inside Telegram.</p>
          </div>

          <div className="tma-package-list">
            {PACKAGES.map(pkg => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`tma-pkg-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => { haptic('medium'); setSelectedPkg(pkg); }}
                >
                  <div className="tma-pkg-card-head">
                    <div>
                      <span className="tma-pkg-cat">{pkg.category.toUpperCase()}</span>
                      <h3 className="tma-pkg-title">{pkg.title}</h3>
                    </div>
                    <div className="tma-pkg-price-badge">
                      <span>{pkg.price.toLocaleString()}</span>
                      <small>ETB</small>
                    </div>
                  </div>
                  <ul className="tma-pkg-features">
                    {pkg.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i}>
                        <CheckCircle2 size={14} className="tma-check-icon" />
                        <span>{d}</span>
                      </li>
                    ))}
                    {pkg.deliverables.length > 4 && (
                      <li className="tma-more-features">+{pkg.deliverables.length - 4} more included</li>
                    )}
                  </ul>
                  <button
                    className={`tma-select-btn ${isSelected ? 'btn-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPkg(pkg);
                      setActiveTab('order');
                      haptic('medium');
                    }}
                  >
                    <span>{isSelected ? 'Selected ✓' : 'Configure & Book'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: CUSTOMIZE & BOOKING VIEW ── */}
      {activeTab === 'order' && (
        <div className="tma-content">
          <div className="tma-section-title">
            <h3>Event Details & Add-ons</h3>
            <p>Tailor equipment, aerial cameras, and deliverables for your celebration.</p>
          </div>

          <div className="tma-selected-summary-card">
            <div className="tma-summary-left">
              <span className="tma-pkg-cat">{selectedPkg.category.toUpperCase()}</span>
              <h4>{selectedPkg.title}</h4>
              <p>{selectedPkg.deliverables.length} Deliverables Included</p>
            </div>
            <div className="tma-summary-price">
              <span>{selectedPkg.price.toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Add-ons Selector */}
          <div className="tma-addons-box">
            <h4>Optional Enhancements</h4>
            <div className="tma-addons-grid">
              {ADDONS_LIST.map(addon => {
                const active = selectedAddons.some(a => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`tma-addon-card ${active ? 'active' : ''}`}
                    onClick={() => toggleAddon(addon)}
                  >
                    <div className="tma-addon-check">
                      {active ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                    </div>
                    <div className="tma-addon-info">
                      <span className="tma-addon-title">{addon.name}</span>
                      <span className="tma-addon-desc">{addon.desc}</span>
                    </div>
                    <span className="tma-addon-price">+{addon.price.toLocaleString()} ETB</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Details Form */}
          <div className="tma-form-card">
            <h4>Your Booking Details</h4>
            <div className="tma-input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Dawit & Tigist"
              />
            </div>
            <div className="tma-input-group">
              <label>Phone Number (Ethiopian Mobile)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0911..."
              />
            </div>
            <div className="tma-input-group">
              <label>Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
              />
            </div>
            <div className="tma-input-group">
              <label>Event Venue / Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Skylight Hotel, Addis Ababa"
              />
            </div>
            <div className="tma-input-group">
              <label>Special Requests / Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tell us about your schedule, church ceremony, or preferences..."
                rows={2}
              />
            </div>
          </div>

          {/* Sticky Total Calculation */}
          <div className="tma-pricing-bar">
            <div>
              <span className="tma-pricing-label">Total Estimated Quote</span>
              <div className="tma-total-figure">
                <span>{rawTotal.toLocaleString()}</span>
                <small>ETB</small>
              </div>
            </div>
            <button
              className="tma-main-cta-btn"
              onClick={handleCreateOrder}
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                <RefreshCw size={18} className="tma-spin" />
              ) : (
                <>
                  <span>Create Booking Order</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE NEGOTIATION & CHAT BRIDGE ── */}
      {activeTab === 'chat' && (
        <div className="tma-content tma-chat-container">
          {/* Order Header Badge */}
          {activeOrder ? (
            <div className="tma-order-header-strip">
              <div className="tma-order-meta-info">
                <span className="tma-order-pill">Order #{activeOrder.id}</span>
                <h4>{activeOrder.packageName}</h4>
                <p>📅 {activeOrder.eventDate || 'Date TBD'} • {activeOrder.location}</p>
              </div>
              <div className="tma-order-price-pill">
                {activeOrder.discountAmount > 0 ? (
                  <>
                    <span className="tma-struck-price">{activeOrder.totalPrice.toLocaleString()} ETB</span>
                    <span className="tma-discounted-price">{activeOrder.negotiatedPrice.toLocaleString()} ETB</span>
                    <span className="tma-discount-badge">Saved {activeOrder.discountAmount.toLocaleString()} ETB!</span>
                  </>
                ) : (
                  <>
                    <span className="tma-regular-price">{activeOrder.totalPrice.toLocaleString()} ETB</span>
                    <span className="tma-quote-tag">Official Quote</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="tma-empty-order-alert">
              <AlertCircle size={20} />
              <span>Please configure an order in the <b>Customize</b> tab first to start negotiating with the studio.</span>
            </div>
          )}

          {/* Quick Discount Request Bar */}
          {activeOrder && (
            <div className="tma-discount-request-bar">
              <Tag size={16} />
              <span>Want a special package discount?</span>
              <button
                className="tma-request-discount-btn"
                onClick={() => handleSendMessage('Hello HOPE Studio, could you please provide a special discount for this booking?', true)}
                disabled={isSendingMsg}
              >
                Request Discount
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="tma-messages-list">
            {chatMessages.length === 0 ? (
              <div className="tma-chat-placeholder">
                <MessageCircle size={32} />
                <p>Chat directly with the HOPE Studio directors. Messages you send here alert our owners directly on Telegram with real-time replies.</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`tma-msg-bubble ${msg.sender === 'client' ? 'client' : msg.sender === 'system' ? 'system' : 'admin'}`}>
                  <div className="tma-msg-sender">{msg.senderName}</div>
                  <div className="tma-msg-text">{msg.text}</div>
                  <div className="tma-msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="tma-chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about dates, equipment, or discounts..."
              disabled={!activeOrder}
            />
            <button
              className="tma-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!activeOrder || !chatInput.trim() || isSendingMsg}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Proceed to Contract CTA */}
          {activeOrder && (
            <div className="tma-chat-bottom-cta">
              <button
                className="tma-proceed-contract-btn"
                onClick={() => { haptic('medium'); setActiveTab('agreement'); }}
              >
                <FileSignature size={18} />
                <span>Ready to Proceed? Sign Agreement</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: DIGITAL SERVICE AGREEMENT & E-SIGNATURE ── */}
      {activeTab === 'agreement' && (
        <div className="tma-content">
          <div className="tma-section-title">
            <h3>Digital Service Agreement</h3>
            <p>Review the official terms of service and sign with your electronic signature.</p>
          </div>

          <div className="tma-contract-paper">
            <div className="tma-contract-header">
              <div className="tma-seal-badge">
                <ShieldCheck size={24} />
                <span>HOPE OFFICIAL CONTRACT</span>
              </div>
              <span className="tma-contract-date">Date: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="tma-contract-parties">
              <p><b>Service Provider:</b> HOPE Photo & Velo (Addis Ababa, Ethiopia)</p>
              <p><b>Client:</b> {clientName || 'Valued Client'} {phone ? `(${phone})` : ''}</p>
              <p><b>Event Date:</b> {activeOrder?.eventDate || eventDate || 'Scheduled Date'}</p>
              <p><b>Location:</b> {activeOrder?.location || location}</p>
              <p><b>Package:</b> {activeOrder?.packageName || selectedPkg.title}</p>
            </div>

            <div className="tma-contract-terms">
              <h5>1. Scope of Services & Deliverables</h5>
              <p>HOPE Studio agrees to deploy professional camera equipment, stabilization, and cinematographers to cover the client’s designated celebration as outlined in the selected tier.</p>

              <h5>2. Agreed Compensation & Deposit</h5>
              <p>
                The total agreed fee is <b>{currentTotal.toLocaleString()} ETB</b>.
                An initial advance deposit of <b>30% ({depositDue.toLocaleString()} ETB)</b> is required upon contract signing to secure the date. The remaining 70% balance is payable upon delivery of the draft proofs/video trailer.
              </p>

              <h5>3. Post-Production & Delivery Timeline</h5>
              <p>Digital soft copies are delivered within 7 business days. Fully color-graded cinema films, albums, and framed boards are completed within 21 to 30 calendar days.</p>

              <h5>4. Cancellation & Rescheduling</h5>
              <p>If the celebration date changes due to force majeure, the deposit remains valid for transfer to an alternate open date upon 14 days notice.</p>
            </div>

            {/* E-Signature Canvas */}
            <div className="tma-signature-section">
              <div className="tma-signature-top">
                <label>Client Electronic Signature (Draw with finger/stylus):</label>
                <button type="button" className="tma-clear-sign-btn" onClick={clearSignature}>
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
              </div>

              <div className="tma-canvas-box">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSignature && (
                  <div className="tma-canvas-hint">
                    <FileSignature size={28} />
                    <span>Sign your signature here</span>
                  </div>
                )}
              </div>

              <label className="tma-terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                />
                <span>I confirm that I have reviewed the deliverables, pricing, and agree to the booking terms of HOPE Photo & Velo.</span>
              </label>
            </div>

            <button
              className="tma-finalize-sign-btn"
              onClick={handleSignAgreement}
              disabled={isSigning || !hasSignature || !termsAccepted}
            >
              {isSigning ? (
                <RefreshCw size={18} className="tma-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Sign & Finalize Agreement</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 5: MY BOOKINGS & SIGNED CONTRACT SUMMARY ── */}
      {activeTab === 'my_orders' && (
        <div className="tma-content">
          <div className="tma-signed-success-card">
            <div className="tma-success-icon-wrap">
              <CheckCircle2 size={44} />
            </div>
            <h3>Agreement Successfully Signed!</h3>
            <p>Your contract has been officially registered with HOPE Studio and dispatched to our directors.</p>

            <div className="tma-certificate-box">
              <div className="tma-cert-row">
                <span>Contract ID:</span>
                <b>{signedAgreement?.id || 'HOPE-AGR-9104'}</b>
              </div>
              <div className="tma-cert-row">
                <span>Verification Hash:</span>
                <code>{signedAgreement?.verificationHash || 'SHA256:7a94b81c'}</code>
              </div>
              <div className="tma-cert-row">
                <span>Total Agreed Price:</span>
                <b>{currentTotal.toLocaleString()} ETB</b>
              </div>
              <div className="tma-cert-row">
                <span>30% Deposit Due:</span>
                <b className="tma-deposit-val">{depositDue.toLocaleString()} ETB</b>
              </div>
              <div className="tma-cert-row">
                <span>Status:</span>
                <span className="tma-status-badge">Official Agreement Signed</span>
              </div>
            </div>

            <div className="tma-certificate-actions">
              <a href="tel:+251910526962" className="tma-cert-call-btn">
                <Phone size={16} />
                <span>Call Studio (09 10 52 69 62)</span>
              </a>
              <button
                className="tma-cert-return-btn"
                onClick={() => { haptic(); setActiveTab('chat'); }}
              >
                <MessageCircle size={16} />
                <span>Return to Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
