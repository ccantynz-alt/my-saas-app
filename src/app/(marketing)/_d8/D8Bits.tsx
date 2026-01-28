'use client';

import React from 'react';

type Props = React.PropsWithChildren<{
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}>;

/**
 * D8Bits: small premium UI primitives (safe defaults)
 * This file exists primarily to unblock Vercel builds when pages import ../_d8/D8Bits
 */

export function D8Badge({ children, className, style }: Props) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.03)',
        color: 'rgba(237,234,247,0.88)',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function D8Button({ children, href, onClick, className, style }: Props) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 14,
    textDecoration: 'none',
    fontWeight: 900,
    fontSize: 14,
    color: '#07070B',
    background: 'linear-gradient(90deg, rgba(168,85,247,1), rgba(59,130,246,1))',
    boxShadow: '0 18px 55px rgba(168,85,247,0.22), 0 10px 24px rgba(59,130,246,0.14)',
    border: '1px solid rgba(255,255,255,0.10)',
    ...style,
  };

  if (href) {
    return (
      <a href={href} className={className} style={baseStyle}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={baseStyle}>
      {children}
    </button>
  );
}

export function D8Card({ children, className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(0,0,0,0.25)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
        padding: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function D8FeatureList({ items }: { items: string[] }) {
  return (
    <ul style={{ marginTop: 12, paddingLeft: 18, color: 'rgba(237,234,247,0.74)', lineHeight: 1.7, fontSize: 14 }}>
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

export function D8FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 12 }}>
      {items.map((it, idx) => (
        <D8Card key={idx}>
          <div style={{ fontWeight: 900, color: 'rgba(237,234,247,0.92)', marginBottom: 6 }}>{it.q}</div>
          <div style={{ color: 'rgba(237,234,247,0.72)', lineHeight: 1.6, fontSize: 14 }}>{it.a}</div>
        </D8Card>
      ))}
    </div>
  );
}

export function D8PricingPreview() {
  return (
    <D8Card>
      <div style={{ fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 12, color: 'rgba(237,234,247,0.82)' }}>
        Pricing preview
      </div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        <D8Card>
          <div style={{ fontWeight: 900, color: 'rgba(237,234,247,0.92)' }}>Free</div>
          <D8FeatureList items={['Draft pages', 'Basic templates', 'Publish to dominat8.com']} />
        </D8Card>
        <D8Card>
          <div style={{ fontWeight: 900, color: 'rgba(237,234,247,0.92)' }}>Pro</div>
          <D8FeatureList items={['Custom domain', 'SEO automation', 'Faster publishing']} />
        </D8Card>
      </div>
    </D8Card>
  );
}

export function D8Steps() {
  return (
    <D8Card>
      <div style={{ fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 12, color: 'rgba(237,234,247,0.82)' }}>
        Generate → refine → publish
      </div>
      <div style={{ marginTop: 10, color: 'rgba(237,234,247,0.74)', lineHeight: 1.7, fontSize: 14 }}>
        1) Pick a template · 2) Generate content · 3) Polish & SEO · 4) Publish
      </div>
    </D8Card>
  );
}

/* ---- Extra named exports requested by importing pages ---- */


export default D8Card;