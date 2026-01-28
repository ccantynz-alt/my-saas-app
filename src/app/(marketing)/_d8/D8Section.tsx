'use client';

import React from 'react';

type Props = React.PropsWithChildren<{
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
  kicker?: string;
}>;

/**
 * D8Section: premium framing wrapper (safe defaults)
 * This file exists primarily to unblock Vercel builds when pages import ../_d8/D8Section
 */

export function D8Container({ children, className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: 1160,
        margin: '0 auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function D8Surface({ children, className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
        boxShadow: '0 30px 90px rgba(0,0,0,0.45), 0 20px 55px rgba(168,85,247,0.08)',
        padding: '18px 18px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function D8Divider() {
  return <div style={{ height: 1, width: '100%', background: 'rgba(255,255,255,0.10)', margin: '18px 0' }} />;
}

export function D8Kicker({ children, className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 999,
        background: 'linear-gradient(90deg, rgba(168,85,247,0.18), rgba(59,130,246,0.10))',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(237,234,247,0.92)',
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 800,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function D8Title({ children, className, style }: Props) {
  return (
    <h2
      className={className}
      style={{
        marginTop: 14,
        fontSize: 28,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        fontWeight: 900,
        color: '#F6F2FF',
        textShadow: '0 18px 70px rgba(168,85,247,0.16)',
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function D8SubTitle({ children, className, style }: Props) {
  return (
    <p
      className={className}
      style={{
        marginTop: 10,
        fontSize: 14,
        lineHeight: 1.6,
        color: 'rgba(237,234,247,0.72)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function D8Grid({ children, className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 12,
        marginTop: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function D8Section({ children, id, className, style, kicker, title, subtitle }: Props) {
  return (
    <section id={id} className={className} style={{ padding: '18px 0', ...style }}>
      <D8Container>
        <D8Surface>
          {kicker ? <D8Kicker>{kicker}</D8Kicker> : null}
          {title ? <D8Title>{title}</D8Title> : null}
          {subtitle ? <D8SubTitle>{subtitle}</D8SubTitle> : null}
          {children ? <div style={{ marginTop: 14 }}>{children}</div> : null}
        </D8Surface>
      </D8Container>
    </section>
  );
}

/* ---- Extra named exports requested by importing pages ---- */


export default D8Section;