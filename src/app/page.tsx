export default function HomePage() {
  const marker = "HERO_WOW_V1_OK_20260125_152438";

  return (
    <main className="d8-root">
      {/* Hidden marker for verification */}
      <div className="d8-hidden">{marker}</div>

      <section className="d8-hero">
        {/* Background layers */}
        <div className="d8-bg d8-bgBase" aria-hidden="true" />
        <div className="d8-bg d8-bgSweep" aria-hidden="true" />
        <div className="d8-bg d8-bgNoise" aria-hidden="true" />
        <div className="d8-bg d8-bgVignette" aria-hidden="true" />

        <div className="d8-shell">
          <div className="d8-badge d8-enter">
            <span className="d8-dot" />
            <span className="d8-badgeText">Dominat8 — Enterprise AI website automation</span>
            <span className="d8-badgePill">Premium</span>
          </div>

          <h1 className="d8-h1 d8-enter d8-delay1">
            Launch a{" "}
            <span className="d8-gradText">world-class</span>{" "}
            site
            <br />
            in minutes — not weeks.
          </h1>

          <p className="d8-sub d8-enter d8-delay2">
            Dominat8 generates pages, writes SEO, and prepares your publish pipeline —
            so you ship faster with control, consistency, and confidence.
          </p>

          <div className="d8-ctaRow d8-enter d8-delay3">
            <a className="d8-btn d8-btnPrimary" href="/new">
              Build my site
              <span className="d8-btnArrow">→</span>
            </a>

            <a className="d8-btn d8-btnSecondary" href="/templates">
              View templates
            </a>

            <div className="d8-proof">
              <div className="d8-proofTop">Built for serious launches</div>
              <div className="d8-proofSub">Structured outputs • Repeatable quality • Clean publishing</div>
            </div>
          </div>

          <div className="d8-cards d8-enter d8-delay4">
            <div className="d8-card">
              <div className="d8-cardTitle">Finish-for-me</div>
              <div className="d8-cardBody">From brief → full site structure, automatically.</div>
            </div>
            <div className="d8-card">
              <div className="d8-cardTitle">SEO V2</div>
              <div className="d8-cardBody">Titles, descriptions, sitemap, and IA built in.</div>
            </div>
            <div className="d8-card">
              <div className="d8-cardTitle">Publish-ready</div>
              <div className="d8-cardBody">A clean pipeline from spec → live pages.</div>
            </div>
          </div>

          <div className="d8-bottomFade" aria-hidden="true" />
        </div>
      </section>

      <section className="d8-footer">
        <small>Marker: {marker}</small>
      </section>

      <style>{\
        :root { color-scheme: dark; }
        .d8-root{
          min-height:100vh;
          background:#000;
          color:#fff;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        }
        .d8-hidden{ position:absolute; left:-9999px; top:-9999px; }

        /* Hero layout */
        .d8-hero{
          position:relative;
          min-height:92vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:96px 20px 72px;
        }
        .d8-shell{
          position:relative;
          width:min(1120px, 100%);
          z-index:2;
        }

        /* Background layers */
        .d8-bg{ position:absolute; inset:0; z-index:0; }
        .d8-bgBase{
          background-image:url('/hero/hero-bg.svg');
          background-size:cover;
          background-position:center;
          transform:scale(1.03);
          filter:saturate(1.12) contrast(1.05);
        }
        .d8-bgSweep{
          background:
            radial-gradient(900px 520px at 32% 30%, rgba(124,92,255,0.34), rgba(0,0,0,0) 62%),
            radial-gradient(780px 480px at 52% 38%, rgba(77,210,255,0.18), rgba(0,0,0,0) 60%),
            linear-gradient(110deg, rgba(124,92,255,0.18), rgba(77,210,255,0.10), rgba(0,0,0,0) 65%);
          mix-blend-mode:screen;
          opacity:0.95;
          animation:d8Sweep 10s ease-in-out infinite;
        }
        .d8-bgNoise{
          background-image:url('/hero/noise.svg');
          background-size:420px 420px;
          opacity:0.16;
          mix-blend-mode:overlay;
        }
        .d8-bgVignette{
          background:
            radial-gradient(900px 540px at 35% 32%, rgba(0,0,0,0.08), rgba(0,0,0,0.75) 72%),
            linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.78));
        }

        /* Badge */
        .d8-badge{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.16);
          background:rgba(0,0,0,0.38);
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 50px rgba(0,0,0,0.55);
          margin-bottom:18px;
        }
        .d8-dot{
          width:8px; height:8px; border-radius:999px;
          background:#7CFFB2;
          box-shadow: 0 0 0 6px rgba(124,255,178,0.10);
        }
        .d8-badgeText{
          font-size:13px;
          letter-spacing:0.2px;
          opacity:0.92;
          white-space:nowrap;
        }
        .d8-badgePill{
          margin-left:6px;
          font-size:12px;
          padding:4px 10px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.14);
          background:rgba(255,255,255,0.06);
          opacity:0.9;
        }

        /* Headline */
        .d8-h1{
          font-size:clamp(2.6rem, 4.9vw, 4.3rem);
          line-height:1.03;
          letter-spacing:-1px;
          margin:0 0 16px;
          text-shadow: 0 16px 60px rgba(0,0,0,0.65);
        }
        .d8-gradText{
          background: linear-gradient(135deg, rgba(124,92,255,1), rgba(77,210,255,1));
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .d8-sub{
          max-width:760px;
          font-size:clamp(1.05rem, 1.35vw, 1.2rem);
          line-height:1.6;
          opacity:0.82;
          margin:0 0 26px;
        }

        /* CTA */
        .d8-ctaRow{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          align-items:flex-start;
        }
        .d8-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:14px 18px;
          border-radius:14px;
          text-decoration:none;
          user-select:none;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;
          will-change: transform;
        }
        .d8-btnPrimary{
          font-weight:900;
          color:#06070b;
          background: linear-gradient(135deg, #7c5cff, #4dd2ff);
          box-shadow: 0 18px 70px rgba(124,92,255,0.22);
        }
        .d8-btnPrimary:hover{
          transform: translateY(-1px);
          box-shadow: 0 22px 90px rgba(124,92,255,0.30);
        }
        .d8-btnArrow{
          margin-left:10px;
          font-weight:900;
          opacity:0.85;
        }
        .d8-btnSecondary{
          font-weight:800;
          color:#fff;
          border:1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.36);
          backdrop-filter: blur(12px);
        }
        .d8-btnSecondary:hover{
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.22);
          box-shadow: 0 18px 70px rgba(0,0,0,0.55);
        }

        /* Proof block */
        .d8-proof{
          margin-left: 6px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(12px);
          max-width: 420px;
        }
        .d8-proofTop{ font-weight:800; opacity:0.95; margin-bottom:2px; }
        .d8-proofSub{ font-size:13px; opacity:0.72; line-height:1.35; }

        /* Cards */
        .d8-cards{
          margin-top:28px;
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap:12px;
          max-width: 980px;
        }
        .d8-card{
          border:1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.34);
          backdrop-filter: blur(14px);
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 18px 80px rgba(0,0,0,0.45);
        }
        .d8-cardTitle{ font-weight:900; margin-bottom:6px; letter-spacing:-0.2px; }
        .d8-cardBody{ opacity:0.78; font-size:14px; line-height:1.45; }

        /* Bottom transition */
        .d8-bottomFade{
          position:absolute;
          left:0; right:0; bottom:-1px;
          height:120px;
          background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1));
          z-index:1;
          pointer-events:none;
        }

        /* Footer */
        .d8-footer{
          padding: 22px 20px 46px;
          opacity:0.65;
          text-align:center;
        }

        /* Motion: one tasteful entrance + subtle background sweep */
        .d8-enter{
          animation: d8Enter 680ms cubic-bezier(.2,.8,.2,1) both;
        }
        .d8-delay1{ animation-delay: 80ms; }
        .d8-delay2{ animation-delay: 150ms; }
        .d8-delay3{ animation-delay: 220ms; }
        .d8-delay4{ animation-delay: 290ms; }

        @keyframes d8Enter{
          from{ opacity:0; transform: translateY(8px); filter: blur(1px); }
          to{ opacity:1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes d8Sweep{
          0%{ transform: translate3d(0,0,0) scale(1.0); opacity:0.80; }
          50%{ transform: translate3d(-1.5%, 1%, 0) scale(1.02); opacity:0.98; }
          100%{ transform: translate3d(0,0,0) scale(1.0); opacity:0.80; }
        }

        @media (prefers-reduced-motion: reduce){
          .d8-enter{ animation:none !important; }
          .d8-bgSweep{ animation:none !important; }
          .d8-btn{ transition:none !important; }
        }

        @media (max-width: 720px){
          .d8-proof{ max-width: 100%; }
          .d8-badgeText{ white-space:normal; }
        }
      \}</style>
    </main>
  );
}
