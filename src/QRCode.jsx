import React, { useState } from 'react';

/**
 * High-performance, scannable QR Code component
 * Renders a crisp QR code using high-resolution vector/image representation
 * with instant fallback and loading states.
 */
export default function QRCode({
  value,
  size = 180,
  color = '1a1614',
  bgColor = 'ffffff',
  className = '',
  label = 'Scan to verify'
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const encodedData = encodeURIComponent(value || '');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&color=${color}&bgcolor=${bgColor}&margin=6&ecc=M&data=${encodedData}`;

  return (
    <div
      className={`velo-qr-container ${className}`}
      style={{
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: `#${bgColor}`,
        padding: '12px',
        borderRadius: '16px',
        border: '1px solid #ede8e1',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {!loaded && !error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              borderRadius: '10px',
              fontSize: '11px',
              color: '#888'
            }}
          >
            Generating QR…
          </div>
        )}

        {!error ? (
          <img
            src={qrUrl}
            alt={label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: loaded ? 'block' : 'none',
              borderRadius: '8px'
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : (
          /* Fallback offline SVG block representation if network blocks external QR API */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              textAlign: 'center',
              background: '#fdfcfb',
              border: '2px dashed #b89248',
              borderRadius: '8px'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#1a1614', letterSpacing: '0.05em' }}>
              HOPE VERIFICATION
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#b89248', marginTop: '4px' }}>
              {value}
            </div>
          </div>
        )}
      </div>

      {label && (
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 600,
            color: '#7a6e66',
            marginTop: '8px',
            textAlign: 'center',
            letterSpacing: '0.02em'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
