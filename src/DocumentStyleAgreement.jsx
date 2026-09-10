// src/DocumentStyleAgreement.jsx — Official Document-Style Legal Agreement with Download PDF
import React from 'react';
import { FileText, Download, Printer, Check, Shield } from 'lucide-react';
import SignaturePad from './SignaturePad.jsx';

const ASSET = '/assets';

export default function DocumentStyleAgreement({
  agreement,
  clientName = '',
  phone = '',
  eventDate = '',
  location = 'Addis Ababa',
  totalPrice = 0,
  depositAmount = 0,
  remainingBalance = 0,
  signature = null,
  onSign = () => {},
  onClearSignature = () => {},
  lang = 'am',
  readOnly = false,
  orderId = '',
  onDownloadPdf = null,
}) {
  const agr = agreement || {};
  const deliverables = agr.deliverables || [];
  const clauses = agr.clauses || [];
  const refNum = orderId ? `HOPE-AGR-${orderId.replace('HOPE-', '')}` : (agr.id ? `HOPE-${agr.id.toUpperCase()}` : 'HOPE-AGR-2026');
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const effectiveTotal = totalPrice || agr.price || 0;
  const effectiveDeposit = depositAmount || Math.round(effectiveTotal * (agr.depositRate || 0.5));
  const effectiveRemaining = remainingBalance !== undefined && remainingBalance !== null
    ? remainingBalance
    : (effectiveTotal - effectiveDeposit);

  const handlePrint = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      window.print();
    }
  };

  return (
    <div className="doc-paper-wrapper">
      {/* ── Top Action Toolbar (Hidden during Print) ── */}
      <div className="doc-toolbar doc-no-print">
        <div className="doc-toolbar-left">
          <FileText size={16} className="doc-toolbar-icon" />
          <div>
            <span className="doc-toolbar-title">
              {lang === 'am' ? 'ይፋዊ የስምምነት ሰነድ (Official Document)' : 'Official Agreement Document'}
            </span>
            <span className="doc-toolbar-ref">{refNum}</span>
          </div>
        </div>
        <div className="doc-toolbar-actions">
          <button type="button" className="doc-btn-pdf" onClick={handlePrint} title="Save as PDF or Print">
            <Download size={14} />
            <span>{lang === 'am' ? '📄 PDF አውርድ / Download' : '📄 Download PDF'}</span>
          </button>
          <button type="button" className="doc-btn-secondary" onClick={() => window.print()} title="Print Document">
            <Printer size={14} />
            <span>{lang === 'am' ? 'አትም' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* ── THE PHYSICAL DOCUMENT SHEET (White Paper, Formal Legal Styling) ── */}
      <div className="legal-doc-sheet" id="legal-agreement-doc">
        {/* Letterhead */}
        <div className="doc-letterhead-strip">
          <div className="doc-logo-col">
            <img src={`${ASSET}/hope-logo.png`} alt="HOPE Studio" className="doc-official-logo" />
          </div>
          <div className="doc-center-info">
            <h1 className="doc-brand-am">ሆፕ ፎቶ እና ቪዲዮ ስቱዲዮ</h1>
            <h2 className="doc-brand-en">HOPE PHOTO &amp; VELO STUDIO</h2>
            <p className="doc-subhead">የሰርግ እና ዝግጅቶች ፎቶግራፊ፣ ሲኒማቲክ ቪዲዮ እና ላሚኔት አልበም ማዕከል</p>
            <p className="doc-address-line">
              📍 ትጋት የንግድ ማዕከል 2ኛ ፎቅ ፣ 22 ሃያሁለት ፣ አዲስ አበባ | 📞 09 10 52 69 62 / 09 95 27 08 94
            </p>
          </div>
          <div className="doc-emblem-col">
            <div className="doc-gold-seal">
              <span className="seal-star">★ ★ ★</span>
              <span className="seal-txt">OFFICIAL</span>
              <span className="seal-txt-sub">HOPE CONTRACT</span>
            </div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div className="doc-title-box">
          <div className="doc-title-am">የአገልግሎት እና የፎቶግራፊ ውል ስምምነት ሰነድ</div>
          <div className="doc-title-en">OFFICIAL CLIENT SERVICE &amp; PRODUCTION CONTRACT</div>
        </div>

        {/* Document Metadata Row */}
        <div className="doc-meta-bar">
          <div><strong>የውል መለያ ቁጥር (Ref №):</strong> <code>{refNum}</code></div>
          <div><strong>የተዘጋጀበት ቀን (Date):</strong> <span>{today}</span></div>
          <div><strong>የቀረጻ ቀን (Event Date):</strong> <span>{eventDate || 'የሚወሰን'}</span></div>
        </div>

        {/* Section 1: Parties */}
        <div className="doc-block">
          <div className="doc-block-header">
            <span className="doc-roman">፩</span>
            <span>ተዋዋይ ወገኖች (CONTRACTING PARTIES)</span>
          </div>
          <div className="doc-parties-grid">
            <div className="doc-party-col">
              <div className="doc-party-tag">አቅራቢ (SERVICE PROVIDER)</div>
              <div className="doc-party-details">
                <p><strong>ድርጅት:</strong> ሆፕ ፎቶ እና ቪዲዮ (HOPE Photo &amp; Velo)</p>
                <p><strong>አድራሻ:</strong> ትጋት ህንፃ 2ኛ ፎቅ ፣ 22 ፣ አዲስ አበባ</p>
                <p><strong>ስልክ:</strong> 09 10 52 69 62 / 09 95 27 08 94</p>
                <p><strong>ወኪል:</strong> ቢንያም አ. (ስራ አስኪያጅ)</p>
              </div>
            </div>
            <div className="doc-party-col">
              <div className="doc-party-tag">ተቀባይ / ደንበኛ (CLIENT / RECEIVER)</div>
              <div className="doc-party-details">
                <p><strong>ሙሉ ስም:</strong> {clientName || '_________________________'}</p>
                <p><strong>ስልክ ቁጥር:</strong> {phone || '_________________________'}</p>
                <p><strong>የቀረጻ ቀን:</strong> {eventDate || '_________________________'}</p>
                <p><strong>የቀረጻ ቦታ:</strong> {location || 'Addis Ababa'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Package & Deliverables */}
        <div className="doc-block">
          <div className="doc-block-header">
            <span className="doc-roman">፪</span>
            <span>የተመረጠ ፓኬጅ እና አገልግሎቶች (PACKAGE &amp; DELIVERABLES)</span>
          </div>
          <div className="doc-pkg-highlight">
            <span className="doc-pkg-label">የተመረጠው ፓኬጅ:</span>
            <strong className="doc-pkg-title">{agr.packageTitle || agr.name || 'HOPE Selected Package'}</strong>
            <span className="doc-pkg-cat">{agr.category ? agr.category.toUpperCase() : 'PRODUCTION'}</span>
          </div>

          <div className="doc-deliv-table">
            <div className="doc-deliv-head">
              <span className="col-idx">#</span>
              <span className="col-item">የተካተቱ አገልግሎቶች እና እቃዎች (Detailed Deliverables)</span>
              <span className="col-stat">ሁኔታ (Status)</span>
            </div>
            {deliverables.length > 0 ? (
              deliverables.map((d, i) => (
                <div key={i} className="doc-deliv-row">
                  <span className="col-idx">{i + 1}</span>
                  <span className="col-item">{d}</span>
                  <span className="col-stat"><Check size={12} color="#16a34a"/> የተካተተ (Included)</span>
                </div>
              ))
            ) : (
              <div className="doc-deliv-row">
                <span className="col-idx">1</span>
                <span className="col-item">Full Professional Photography &amp; Videography Suite</span>
                <span className="col-stat">ተካቷል</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Financial Terms & Schedule */}
        <div className="doc-block">
          <div className="doc-block-header">
            <span className="doc-roman">፫</span>
            <span>የክፍያ ሁኔታ እና የገንዘብ መጠን (FINANCIAL TERMS &amp; SCHEDULE)</span>
          </div>
          <div className="doc-finance-table">
            <div className="doc-finance-row">
              <span className="finance-label">ጠቅላላ የውል ዋጋ (Total Investment):</span>
              <strong className="finance-val">{effectiveTotal.toLocaleString()} ETB</strong>
            </div>
            <div className="doc-finance-row doc-finance-deposit">
              <span className="finance-label">የቅድሚያ ክፍያ 50% (Advance Deposit - 50% due at signing):</span>
              <strong className="finance-val deposit-highlight">{effectiveDeposit.toLocaleString()} ETB</strong>
            </div>
            <div className="doc-finance-row">
              <span className="finance-label">ቀሪ ክፍያ በማስረከቢያ ላይ (Remaining 50% upon delivery):</span>
              <strong className="finance-val">{effectiveRemaining.toLocaleString()} ETB</strong>
            </div>
          </div>
          <div className="doc-payment-notes">
            <strong>የክፍያ ደንብ:</strong> {agr.paymentTerms || 'ክፍያው በሁለት ጊዜ ሲሆን: 1. ውሉን ሲፈርሙ 50% ቅድመ ክፍያ 2. ከቀረጻ መልስ የቀሪ ክፍያ ማጠቃለያ። የተከፈለ ቅድመ ክፍያ ተመላሽ አይሆንም።'}
          </div>
        </div>

        {/* Section 4: Legal Clauses */}
        <div className="doc-block">
          <div className="doc-block-header">
            <span className="doc-roman">፬</span>
            <span>አጠቃላይ የውል ስምምነት አንቀጾች (TERMS &amp; CONDITIONS)</span>
          </div>
          <div className="doc-clauses-grid">
            {clauses.map((c, i) => {
              const head = lang === 'am' ? c.headingAm : (c.headingEn || c.headingAm);
              let body = lang === 'am' ? c.bodyAm : (c.bodyEn || c.bodyAm);
              body = (body || '')
                .replace('{clientName}', clientName || 'ደንበኛ')
                .replace('{eventDate}', eventDate || 'የቀጠሮ ቀን')
                .replace('{packageTitle}', agr.packageTitle || agr.name || 'ፓኬጅ')
                .replace('{agreedPrice}', `${effectiveTotal.toLocaleString()} ETB`)
                .replace('{depositAmount}', `${effectiveDeposit.toLocaleString()} ETB`)
                .replace('{remainingBalance}', `${effectiveRemaining.toLocaleString()} ETB`);

              return (
                <div key={i} className="doc-clause-card">
                  <h4 className="doc-clause-head">{head}</h4>
                  <p className="doc-clause-txt">{body}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Dual Signatures & Official Seal */}
        <div className="doc-block doc-sig-block">
          <div className="doc-block-header">
            <span className="doc-roman">፭</span>
            <span>የውል ማረጋገጫ እና ይፋዊ ፊርማ (EXECUTION &amp; SIGNATURES)</span>
          </div>
          <p className="doc-sig-disclaimer">
            ተዋዋይ ወገኖች ከላይ የተጠቀሱትን ዝርዝሮች፣ የአገልግሎት እቃዎች እና የክፍያ ሁኔታዎች አንብበው በመስማማት ይህንን ሰነድ በዲጂታል መንገድ አረጋግጠው ፈርመዋል።
          </p>

          <div className="doc-signatures-grid">
            {/* Left: Client Signature */}
            <div className="doc-signature-box">
              <div className="doc-sig-badge">የደንበኛ ፊርማ (Client Signature)</div>
              
              {!readOnly && (
                <div className="doc-pad-wrapper doc-no-print">
                  <SignaturePad onSign={onSign} onClear={onClearSignature} />
                </div>
              )}

              {signature ? (
                <div className="doc-sig-rendered">
                  <img src={signature} alt="Client Signature" className="doc-sig-image" />
                  <div className="doc-sig-hrule" />
                  <p className="doc-signer-name"><strong>{clientName || 'የደንበኛ ስም'}</strong></p>
                  <small className="doc-signer-date">የተፈረመበት ቀን: {today}</small>
                  <span className="doc-verified-badge"><Check size={11}/> ዲጂታል ፊርማ ተረጋግጧል</span>
                </div>
              ) : (
                <div className="doc-sig-blank">
                  <div className="doc-sig-hrule" />
                  <p className="doc-signer-name">ስም: {clientName || '_________________________'}</p>
                  <small className="doc-signer-date">ቀን: {today}</small>
                  {!readOnly && <p className="doc-sign-hint doc-no-print">✍️ እባክዎ ከላይ ባለው ሳጥን ውስጥ ይፈርሙ</p>}
                </div>
              )}
            </div>

            {/* Right: Studio Director Seal & Signature */}
            <div className="doc-signature-box doc-director-box">
              <div className="doc-sig-badge">የስቱዲዮ ስራ አስኪያጅ (Director &amp; Seal)</div>
              
              <div className="doc-seal-container">
                {/* Official Circular Red Rubber Stamp */}
                <div className="doc-red-stamp">
                  <div className="stamp-inner-border">
                    <span className="stamp-arc-top">★ HOPE PHOTO &amp; VELO ★</span>
                    <span className="stamp-center-title">OFFICIAL<br/>SEAL</span>
                    <span className="stamp-arc-bottom">★ ADDIS ABABA ★</span>
                  </div>
                </div>

                {/* Director Cursive Signature Graphic */}
                <div className="doc-director-sig">
                  <span className="director-cursive">Binyam A.</span>
                  <small className="director-role">Authorized Studio Director</small>
                </div>
              </div>

              <div className="doc-sig-hrule" />
              <p className="doc-signer-name"><strong>ቢንያም አ. (Binyam A.)</strong></p>
              <small className="doc-signer-date">ይፋዊ ማህተም እና ፊርማ • HOPE STUDIO</small>
              <span className="doc-verified-badge doc-badge-gold">✓ በስቱዲዮው የተረጋገጠ</span>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="doc-footer">
          <span>HOPE Photo &amp; Velo Studio • Addis Ababa • Official Legal Document</span>
          <span>Ref: {refNum} • Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
