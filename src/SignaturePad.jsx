// src/SignaturePad.jsx — Interactive signature canvas pad
import React, { useRef } from 'react';

export default function SignaturePad({ onSign, onClear }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);

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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f172a'; // dark elegant ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasDrawn.current = true;
  };

  const stop = (e) => {
    e.preventDefault();
    drawing.current = false;
    if (hasDrawn.current && canvasRef.current) {
      onSign(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onClear();
  };

  return (
    <div className="sig-pad-wrap">
      <canvas
        ref={canvasRef}
        width={480}
        height={140}
        className="sig-canvas"
        style={{ background: '#f8fafc', border: '1px dashed #94a3b8', borderRadius: '4px', width: '100%', touchAction: 'none' }}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
      />
      <div className="sig-pad-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span className="sig-line-label" style={{ fontSize: '11px', color: '#64748b' }}>✍️ Sign above</span>
        <button type="button" className="sig-clear-btn" onClick={clear} style={{ fontSize: '11px', background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}>Clear</button>
      </div>
    </div>
  );
}
