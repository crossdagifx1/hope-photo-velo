import React, { useState, useEffect } from 'react';
import {
  Lock, ShieldCheck, DollarSign, Package, Users, MessageSquare, Plus,
  Trash2, Edit3, Send, CheckCircle2, AlertCircle, RefreshCw, ChevronRight,
  TrendingUp, Calendar, Tag, ArrowRight, Eye, Phone, UserCheck, X, Search, Sparkles
} from 'lucide-react';
import './admin.css';

// Offline & Initial Defaults for Admin Control
const DEFAULT_ADMIN_PACKAGES = [
  { id: 'studio-session', category: 'studio', tier: 'basic', titleEn: 'Studio Session', titleAm: 'የስቱዲዮ ቀረጻ', price: 10000, deliverablesEn: ['20 Print Photos', '10 Post Photos', 'Professional Makeup', '150 Soft Copies'] },
  { id: 'studio-event', category: 'studio', tier: 'standard', titleEn: 'Event Coverage', titleAm: 'የክስተት ሽፋን', price: 14500, deliverablesEn: ['200 Thank-You Cards', '40×60 Board Photo', 'Professional Makeup', '10 Post Photos', '150 Soft Copies'] },
  { id: 'studio-production', category: 'studio', tier: 'premium', titleEn: 'Full Production Suite', titleAm: 'ሙሉ ፕሮዳክሽን አልበም', price: 18500, deliverablesEn: ['30×45 Laminate Album (10/20 Page)', '1 Sign Board', '200 Thank-You Cards', 'Professional Makeup', '150 Soft Copies'] },
  { id: 'wedding-bronze', category: 'wedding', tier: 'basic', titleEn: 'Bronze Package', titleAm: 'የሰርግ ብሮንዝ ቪዲዮ', price: 45000, deliverablesEn: ['2 Professional Cameras', 'Ronin Gimbal', 'Ameran Cinema Light', 'Trailer & Cinema Edit', 'Color Grading', 'All Soft Copies Free'] },
  { id: 'wedding-silver', category: 'wedding', tier: 'standard', titleEn: 'Silver Package', titleAm: 'የሰርግ ሲልቨር ቪዲዮ', price: 60000, deliverablesEn: ['3 Professional Cameras', 'Ronin Gimbal', 'Ameran Lighting', 'Trailer & Cinema Video', 'Color Grading', '40×60 Board Photo', 'All Soft Copies Free'] },
  { id: 'wedding-golden-plus', category: 'wedding', tier: 'premium', titleEn: 'Golden Plus Suite', titleAm: 'ጎልደን ፕላስ ሱዊት', price: 75000, deliverablesEn: ['4 Professional Cameras', 'Ronin Gimbal', 'Ameran Light', 'Trailer & Full Cinema Edit', 'Color Grading', '30×90 Laminate Album', '50×80 Wall Board', '40×60 Board Photo', 'All Soft Copies Free'] },
  { id: 'mesk-session', category: 'mesk', tier: 'basic', titleEn: 'Mesk Video Session', titleAm: 'የመስክ ቪዲዮ ቀረጻ', price: 16000, deliverablesEn: ['Cinematic Mesk Video', '1 Sign Board Photo', '150 Soft Copies', 'Color Grading'] },
  { id: 'mesk-album', category: 'mesk', tier: 'standard', titleEn: 'Mesk Video & Album', titleAm: 'የመስክ ቪዲዮ እና አልበም', price: 20000, deliverablesEn: ['Cinematic Mesk Video', '30×45 Laminate Album', '1 Sign Board', '150 Soft Copies'] },
  { id: 'mesk-grand-keepsake', category: 'mesk', tier: 'premium', titleEn: 'Grand Keepsake Suite', titleAm: 'ግራንድ ኪፕሴክ ሱዊት', price: 23000, deliverablesEn: ['30×90 Laminate Album (10/20 Page)', '50×80 Wall Board', '1 Sign Board Photo', '200 Thank-You Cards', '5 Save-the-Date Photos', '150 Soft Copies Free'] }
];

const DEFAULT_ADMIN_ADDONS = [
  { id: 'drone', name: '4K Aerial Drone Coverage', price: 6000, desc: 'Cinematic aerial footage of church, procession & venue', active: true },
  { id: 'extra-cam', name: 'Extra Cinema Camera Operator', price: 7500, desc: 'Captures spontaneous guest & family reactions', active: true },
  { id: 'rush-edit', name: '48-Hour Rush Video Delivery', price: 5000, desc: 'Priority post-production for immediate sharing', active: true },
  { id: 'wall-board', name: 'Deluxe 50×80 Acrylic Wall Board', price: 4000, desc: 'Museum-grade wall piece for living room', active: true },
  { id: 'makeup', name: 'VIP Bridal Makeup Artist', price: 4500, desc: 'Professional on-location makeup touchups', active: true }
];

const SAMPLE_ORDERS = [
  {
    id: 'HOPE-5954',
    clientName: 'Dawit & Tigist',
    telegramUsername: 'dawit_tigi',
    phone: '0911456789',
    packageName: 'Silver Package (Wedding Video)',
    totalPrice: 67500,
    negotiatedPrice: 65000,
    discountAmount: 2500,
    eventDate: '2026-10-15',
    location: 'Skylight Hotel, Addis Ababa',
    status: 'discount_offered'
  },
  {
    id: 'HOPE-2108',
    clientName: 'Hanna & Yared',
    telegramUsername: 'hanna_y',
    phone: '0922883344',
    packageName: 'Full Production Suite (Studio)',
    totalPrice: 18500,
    negotiatedPrice: 18500,
    discountAmount: 0,
    eventDate: '2026-11-02',
    location: 'Bole Studio, Addis Ababa',
    status: 'signed'
  }
];

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing' | 'services' | 'crm' | 'messages' | 'analytics'

  // Dashboard Data
  const [packages, setPackages] = useState(DEFAULT_ADMIN_PACKAGES);
  const [addons, setAddons] = useState(DEFAULT_ADMIN_ADDONS);
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [messages, setMessages] = useState({});
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Selected Order for Messaging / Inspection
  const [selectedOrderId, setSelectedOrderId] = useState('HOPE-5954');
  const [replyText, setReplyText] = useState('');
  const [discountInput, setDiscountInput] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // New Service Creator Form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Search & Filter in CRM
  const [crmSearch, setCrmSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState('all');

  // Verify PIN & Load Admin Data
  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setPinError('');

    if (pinInput.trim() !== 'HOPE2026') {
      setIsLoading(false);
      setPinError('Invalid Admin Master PIN. Please enter HOPE2026');
      return;
    }

    try {
      const res = await fetch(`/api/settings?includeAdminData=true&pin=${encodeURIComponent(pinInput.trim())}`);
      const data = await res.json();

      if (res.ok && data.settings) {
        setPackages(data.settings.packages || DEFAULT_ADMIN_PACKAGES);
        setAddons(data.settings.addons || DEFAULT_ADMIN_ADDONS);
        if (data.orders?.length) setOrders(data.orders);
        if (data.messages) setMessages(data.messages);
        if (data.agreements) setAgreements(data.agreements);
        if (data.orders?.length > 0) setSelectedOrderId(data.orders[0].id);
      }
    } catch (err) {
      // Fallback seamlessly to local defaults
    } finally {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/settings?includeAdminData=true&pin=${encodeURIComponent(pinInput)}`);
      const data = await res.json();
      if (res.ok && data.settings) {
        setPackages(data.settings.packages || []);
        setAddons(data.settings.addons || []);
        setOrders(data.orders || []);
        setMessages(data.messages || {});
        setAgreements(data.agreements || []);
      }
    } catch (e) {}
    setIsLoading(false);
  };

  // Update Package Price
  const handlePriceChange = (packageId, newPrice) => {
    setPackages(prev => prev.map(p => p.id === packageId ? { ...p, price: Number(newPrice) } : p));
  };

  // Save Packages Changes
  const handleSavePackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput
        },
        body: JSON.stringify({
          action: 'update_packages',
          payload: { packages }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Prices and packages successfully updated across the website and Telegram Mini App!');
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err) {
      alert('Failed to save package updates');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Custom Service / Add-on
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    setIsLoading(true);
    const newService = {
      id: 'addon-' + Date.now(),
      name: newServiceName,
      price: Number(newServicePrice),
      desc: newServiceDesc || 'Special custom service option',
      active: true
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput
        },
        body: JSON.stringify({
          action: 'add_custom_service',
          payload: { newService }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddons(data.addons);
        setNewServiceName('');
        setNewServicePrice('');
        setNewServiceDesc('');
        setSaveSuccess('New service added and active in Mini App!');
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (err) {
      alert('Failed to add service');
    } finally {
      setIsLoading(false);
    }
  };

  // Send Reply from Dashboard directly via Telegram Bot & Web
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedOrderId) return;
    setIsSendingReply(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput
        },
        body: JSON.stringify({
          action: 'reply_to_customer',
          payload: {
            orderId: selectedOrderId,
            text: replyText.trim(),
            senderName: 'HOPE Studio Director'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        await refreshData();
      }
    } catch (e) {
      alert('Failed to send reply message');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Grant Instant Discount
  const handleGrantDiscount = async () => {
    const amount = Number(discountInput);
    if (!amount || amount <= 0 || !selectedOrderId) {
      alert('Please enter a valid discount amount in ETB');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput
        },
        body: JSON.stringify({
          action: 'grant_discount',
          payload: {
            orderId: selectedOrderId,
            discountAmount: amount
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountInput('');
        await refreshData();
        setSaveSuccess(`Discount of ${amount.toLocaleString()} ETB applied and client notified via Telegram!`);
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch (e) {
      alert('Failed to grant discount');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm Deposit Received
  const handleConfirmDeposit = async (orderId) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: 'confirmed' })
      });
      await refreshData();
      setSaveSuccess(`Deposit confirmed for ${orderId}!`);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (e) {}
  };

  // Filtered Orders for CRM
  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.clientName || '').toLowerCase().includes(crmSearch.toLowerCase()) ||
      (o.id || '').toLowerCase().includes(crmSearch.toLowerCase()) ||
      (o.phone || '').includes(crmSearch);
    if (crmFilter === 'all') return matchSearch;
    return matchSearch && o.status === crmFilter;
  });

  // Analytics Metrics
  const totalPipeline = orders.reduce((sum, o) => sum + (o.negotiatedPrice || o.totalPrice || 0), 0);
  const confirmedDeposits = orders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + Math.round((o.negotiatedPrice || o.totalPrice || 0) * 0.3), 0);
  const signedContracts = orders.filter(o => o.status === 'signed' || o.status === 'confirmed').length;

  // Selected Order Object
  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const currentOrderMessages = currentOrder ? (messages[currentOrder.id] || []) : [];
  const currentOrderAgreement = currentOrder ? agreements.find(a => a.orderId === currentOrder.id) : null;

  /* ── 1. AUTHENTICATION VIEW ── */
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-icon">
            <ShieldCheck size={36} />
          </div>
          <h2>HOPE Studio Master Control</h2>
          <p>Please enter the studio administrator PIN to access live prices, user CRM, and the bot control center.</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Enter Admin PIN (Default: HOPE2026)"
              autoFocus
              required
            />
            {pinError && <div className="admin-pin-error">{pinError}</div>}
            <button type="submit" disabled={isLoading} className="admin-login-btn">
              {isLoading ? <RefreshCw size={18} className="admin-spin" /> : 'Unlock Admin Dashboard'}
            </button>
          </form>

          {onClose && (
            <button className="admin-close-link" onClick={onClose}>
              Return to Website
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── 2. MAIN DASHBOARD VIEW ── */
  return (
    <div className="admin-dashboard-container">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-logo-badge">HOPE STUDIO CONTROL</div>
          <span className="admin-status-indicator">● System Live & Synced</span>
        </div>

        <div className="admin-topbar-right">
          <button className="admin-refresh-btn" onClick={refreshData} title="Refresh Live Data">
            <RefreshCw size={15} className={isLoading ? 'admin-spin' : ''} />
            <span>Sync</span>
          </button>
          {onClose && (
            <button className="admin-exit-btn" onClick={onClose}>
              <X size={18} />
              <span>Exit Admin</span>
            </button>
          )}
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveSuccess && (
        <div className="admin-toast-success">
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <nav className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <DollarSign size={16} />
          <span>Prices & Packages (9)</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <Package size={16} />
          <span>Custom Add-ons</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'crm' ? 'active' : ''}`}
          onClick={() => setActiveTab('crm')}
        >
          <Users size={16} />
          <span>Clients & User CRM ({orders.length})</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={16} />
          <span>Unified Message & Bot Hub</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={16} />
          <span>Revenue Analytics</span>
        </button>
      </nav>

      {/* ── TAB 1: LIVE PACKAGES & PRICES EDITOR ── */}
      {activeTab === 'pricing' && (
        <div className="admin-tab-content">
          <div className="admin-section-header">
            <div>
              <h3>Live Service Packages & Pricing</h3>
              <p>Edit prices and deliverables here. Changes immediately sync to both the website and Telegram Mini App.</p>
            </div>
            <button className="admin-save-btn" onClick={handleSavePackages} disabled={isLoading}>
              <CheckCircle2 size={16} />
              <span>Save & Publish Live</span>
            </button>
          </div>

          <div className="admin-packages-grid">
            {packages.map(pkg => (
              <div key={pkg.id} className="admin-package-card">
                <div className="admin-pkg-cat-tag">{pkg.category?.toUpperCase()} • {pkg.tier?.toUpperCase()}</div>
                <h4 className="admin-pkg-title">{pkg.titleEn}</h4>
                <div className="admin-pkg-am">{pkg.titleAm}</div>

                <div className="admin-price-input-row">
                  <label>Price (ETB):</label>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={e => handlePriceChange(pkg.id, e.target.value)}
                    step="500"
                  />
                </div>

                <div className="admin-deliverables-list">
                  <span className="admin-deliv-label">Deliverables ({pkg.deliverablesEn?.length || 0}):</span>
                  <ul>
                    {(pkg.deliverablesEn || []).map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: CUSTOM SERVICES & ADD-ONS ── */}
      {activeTab === 'services' && (
        <div className="admin-tab-content">
          <div className="admin-section-header">
            <div>
              <h3>Custom Services & Add-on Extras</h3>
              <p>Add new cinema equipment, drone packages, or prints that customers can select in the Mini App.</p>
            </div>
          </div>

          <div className="admin-services-split">
            {/* Add New Service Form */}
            <form className="admin-service-form" onSubmit={handleAddService}>
              <h4>+ Create New Service Add-on</h4>
              <div className="admin-form-group">
                <label>Service / Equipment Name</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  placeholder="e.g. Cinema Crane Jib Arm 24ft"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Price (ETB)</label>
                <input
                  type="number"
                  value={newServicePrice}
                  onChange={e => setNewServicePrice(e.target.value)}
                  placeholder="e.g. 8000"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Customer Description</label>
                <textarea
                  value={newServiceDesc}
                  onChange={e => setNewServiceDesc(e.target.value)}
                  placeholder="Brief explanation of the value for the client..."
                  rows={2}
                />
              </div>
              <button type="submit" className="admin-btn-accent" disabled={isLoading}>
                <Plus size={16} />
                <span>Add to Mini App Catalog</span>
              </button>
            </form>

            {/* Existing Services List */}
            <div className="admin-services-list">
              <h4>Active Add-ons ({addons.length})</h4>
              {addons.map(addon => (
                <div key={addon.id} className="admin-addon-row">
                  <div>
                    <div className="admin-addon-name">{addon.name}</div>
                    <div className="admin-addon-desc">{addon.desc}</div>
                  </div>
                  <div className="admin-addon-rate">+{Number(addon.price).toLocaleString()} ETB</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CLIENT & USER CRM TRACKER ── */}
      {activeTab === 'crm' && (
        <div className="admin-tab-content">
          <div className="admin-section-header">
            <div>
              <h3>Customer & Booking CRM</h3>
              <p>Track Telegram users, client contact info, signed agreements, and deposit milestones.</p>
            </div>
            <div className="admin-crm-controls">
              <div className="admin-search-box">
                <Search size={15} />
                <input
                  type="text"
                  value={crmSearch}
                  onChange={e => setCrmSearch(e.target.value)}
                  placeholder="Search by client name, phone, order ID..."
                />
              </div>
              <select value={crmFilter} onChange={e => setCrmFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending_quote">Pending Quote</option>
                <option value="discount_offered">Discount Offered</option>
                <option value="signed">Agreement Signed</option>
                <option value="confirmed">Deposit Confirmed</option>
              </select>
            </div>
          </div>

          <div className="admin-crm-table-wrap">
            <table className="admin-crm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client Name</th>
                  <th>Contact</th>
                  <th>Event Date</th>
                  <th>Package</th>
                  <th>Quote</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-empty-table">No client records found matching search.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const finalPrice = order.negotiatedPrice || order.totalPrice || 0;
                    return (
                      <tr key={order.id} className={selectedOrderId === order.id ? 'row-selected' : ''}>
                        <td><code>{order.id}</code></td>
                        <td>
                          <b>{order.clientName}</b>
                          {order.telegramUsername && <small className="admin-tg-tag">@{order.telegramUsername}</small>}
                        </td>
                        <td>{order.phone || 'TBD'}</td>
                        <td>{order.eventDate || 'Not set'}</td>
                        <td>{order.packageName}</td>
                        <td>
                          <b>{finalPrice.toLocaleString()} ETB</b>
                          {order.discountAmount > 0 && (
                            <span className="admin-discount-badge">Saved {order.discountAmount.toLocaleString()}</span>
                          )}
                        </td>
                        <td>
                          <span className={`admin-status-pill status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="admin-action-btn"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setActiveTab('messages');
                            }}
                            title="Open in Message Hub"
                          >
                            <MessageSquare size={14} />
                            <span>Chat</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: UNIFIED MESSAGE & BOT REPLY HUB ── */}
      {activeTab === 'messages' && (
        <div className="admin-tab-content admin-messages-layout">
          {/* Left: Orders List */}
          <div className="admin-msg-threads">
            <h4>Customer Inquiries</h4>
            <div className="admin-thread-items">
              {orders.map(o => (
                <div
                  key={o.id}
                  className={`admin-thread-card ${selectedOrderId === o.id ? 'active' : ''}`}
                  onClick={() => setSelectedOrderId(o.id)}
                >
                  <div className="admin-thread-top">
                    <span className="admin-thread-id">{o.id}</span>
                    <span className={`admin-mini-status ${o.status}`}>{o.status}</span>
                  </div>
                  <div className="admin-thread-name">{o.clientName}</div>
                  <div className="admin-thread-pkg">{o.packageName}</div>
                  <div className="admin-thread-price">{(o.negotiatedPrice || o.totalPrice || 0).toLocaleString()} ETB</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Active Conversation Window */}
          {currentOrder ? (
            <div className="admin-chat-console">
              <div className="admin-chat-header">
                <div>
                  <h4>Order #{currentOrder.id} • {currentOrder.clientName}</h4>
                  <p>📞 {currentOrder.phone} • 📅 {currentOrder.eventDate || 'Date TBD'} • 📍 {currentOrder.location}</p>
                </div>
                <div className="admin-chat-header-actions">
                  <span className="admin-quote-badge">
                    Quote: <b>{(currentOrder.negotiatedPrice || currentOrder.totalPrice).toLocaleString()} ETB</b>
                  </span>
                  {currentOrder.status !== 'confirmed' && (
                    <button
                      className="admin-confirm-dep-btn"
                      onClick={() => handleConfirmDeposit(currentOrder.id)}
                    >
                      <CheckCircle2 size={14} />
                      <span>Confirm Deposit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="admin-quick-actions-bar">
                <div className="admin-discount-tool">
                  <Tag size={15} />
                  <span>Offer Custom Discount:</span>
                  <input
                    type="number"
                    value={discountInput}
                    onChange={e => setDiscountInput(e.target.value)}
                    placeholder="Amount in ETB (e.g. 2500)"
                  />
                  <button onClick={handleGrantDiscount} disabled={isLoading}>Apply Discount</button>
                </div>

                {currentOrderAgreement && (
                  <div className="admin-agreement-badge">
                    <ShieldCheck size={15} />
                    <span>Signed Contract: <code>{currentOrderAgreement.id}</code></span>
                  </div>
                )}
              </div>

              {/* Chat Stream */}
              <div className="admin-chat-stream">
                {currentOrderMessages.length === 0 ? (
                  <div className="admin-empty-chat">No messages recorded for this order yet.</div>
                ) : (
                  currentOrderMessages.map(m => (
                    <div key={m.id} className={`admin-bubble ${m.sender === 'admin' ? 'admin' : m.sender === 'system' ? 'system' : 'client'}`}>
                      <div className="admin-bubble-author">{m.senderName}</div>
                      <div className="admin-bubble-text">{m.text}</div>
                      <div className="admin-bubble-time">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Input Bar */}
              <div className="admin-reply-box">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                  placeholder="Type message to client (dispatches immediately via Telegram Bot & Mini App)..."
                />
                <button onClick={handleSendReply} disabled={isSendingReply || !replyText.trim()}>
                  {isSendingReply ? <RefreshCw size={16} className="admin-spin" /> : <Send size={16} />}
                  <span>Send Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="admin-empty-console">Select a customer order on the left to start chatting.</div>
          )}
        </div>
      )}

      {/* ── TAB 5: REVENUE ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="admin-tab-content">
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <span className="admin-metric-label">Total Booking Pipeline</span>
              <div className="admin-metric-val">{totalPipeline.toLocaleString()} <small>ETB</small></div>
              <span className="admin-metric-sub">{orders.length} total customer leads</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-label">Confirmed Advance Deposits</span>
              <div className="admin-metric-val val-green">{confirmedDeposits.toLocaleString()} <small>ETB</small></div>
              <span className="admin-metric-sub">30% reserved revenue</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-label">Signed Digital Contracts</span>
              <div className="admin-metric-val val-gold">{signedContracts}</div>
              <span className="admin-metric-sub">{orders.length ? Math.round((signedContracts / orders.length) * 100) : 0}% contract conversion</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
