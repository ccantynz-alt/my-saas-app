export default function HomePage() {
  const marker = "HERO_WOW_V1_1_OK_20260125_152828";

  return (
    <main className="d8-root">
      {/* Hidden marker for verification */}
      <div className="d8-hidden">{marker}</div>

      <section className="d8-hero">
        {/* Background */}
        <div className="d8-bg d8-bgBase" aria-hidden="true" />
        <div className="d8-bg d8-bgVignette" aria-hidden="true" />

        {/* New: premium headline halo + side glow */}
        <div className="d8-halo d8-haloMain" aria-hidden="true" />
        <div className="d8-halo d8-haloSide" aria-hidden="true" />

        {/* New: subtle grain (pure CSS, no extra files) */}
        <div className="d8-grain" aria-hidden="true" />

        <div className="d8-shell">
          <div className="d8-badge">
            <span className="d8-dot" />
            <span className="d8-badgeText">Dominat8 — Enterprise AI website automation</span>
            <span className="d8-badgePill">Premium</span>
          </div>

          <h1 className="d8-h1">
            Launch a{" "}
            <span className="d8-gradText d8-strong">world-class</span>{" "}
            site
            <br />
            <span className="d8-h1Lite">in minutes — not weeks.</span>
          </h1>

          <p className="d8-sub">
            Dominat8 generates pages, writes SEO, and prepares your publish pipeline —
            so you ship faster with control, consistency, and confidence.
          </p>

          <div className="d8-ctaRow">
            <a className="d8-btn d8-btnPrimary" href="/new">
              Build my site <span className="d8-btnArrow">→</span>
            </a>

            <a className="d8-btn d8-btnSecondary" href="/templates">
              View templates
            </a>
          </div>

          <div className="d8-proofRow">
            <div className="d8-proof">
              <div className="d8-proofTop">Built for serious launches</div>
              <div className="d8-proofSub">
                Structured outputs • Repeatable quality • Clean publishing
              </div>
            </div>
          </div>

          <div className="d8-cards">
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

        /* New: slight left bias (feels designed, not template) */
        .d8-shell{
          position:relative;
          width:min(1120px, 100%);
          z-index:2;
          transform: translateX(-34px);
        }
        @media (max-width: 860px){
          .d8-shell{ transform:none; }
        }

        /* Background base */
        .d8-bg{ position:absolute; inset:0; z-index:0; }
        .d8-bgBase{
          background-image:url('/hero/hero-bg.svg');
          background-size:cover;
          background-position:center;
          transform:scale(1.03);
          filter:saturate(1.12) contrast(1.05);
        }
        .d8-bgVignette{
          background:
            radial-gradient(1000px 560px at 35% 32%, rgba(0,0,0,0.10), rgba(0,0,0,0.78) 72%),
            linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.82));
        }

        /* New: premium halo glows (tight, headline-focused) */
        .d8-halo{
          position:absolute;
          z-index:1;
          pointer-events:none;
          filter: blur(10px);
          opacity: 0.95;
        }
        .d8-haloMain{
          width: 920px;
          height: 560px;
          left: 120px;
          top: 110px;
          background:
            radial-gradient(closest-side at 35% 35%, rgba(124,92,255,0.52), rgba(0,0,0,0) 68%),
            radial-gradient(closest-side at 55% 45%, rgba(77,210,255,0.20), rgba(0,0,0,0) 70%);
        }
        .d8-haloSide{
          width: 760px;
          height: 520px;
          left: -140px;
          top: 220px;
          background:
            radial-gradient(closest-side at 55% 45%, rgba(77,210,255,0.14), rgba(0,0,0,0) 70%),
            radial-gradient(closest-side at 45% 35%, rgba(124,92,255,0.18), rgba(0,0,0,0) 72%);
          opacity: 0.65;
        }
        @media (max-width: 720px){
          .d8-haloMain{ left: -40px; top: 70px; width: 760px; height: 520px; }
          .d8-haloSide{ display:none; }
        }

        /* New: subtle grain overlay (no image) */
        .d8-grain{
          position:absolute;
          inset:0;
          z-index:1;
          pointer-events:none;
          opacity:0.10;
          background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 7px);
          mix-blend-mode: overlay;
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

        /* Headline micro polish */
        .d8-h1{
          font-size:clamp(2.7rem, 5.0vw, 4.35rem);
          line-height:1.03;
          letter-spacing:-1.15px;
          margin:0 0 16px;
          text-shadow: 0 18px 70px rgba(0,0,0,0.70);
        }
        .d8-strong{
          font-weight: 950;
          letter-spacing: -1.35px;
        }
        .d8-h1Lite{
          font-weight: 650;
          opacity: 0.96;
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
          align-items:center;
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
          box-shadow: 0 18px 70px rgba(124,92,255,0.24);
        }
        .d8-btnPrimary:hover{
          transform: translateY(-1px);
          box-shadow: 0 22px 92px rgba(124,92,255,0.32);
        }
        .d8-btnArrow{ margin-left:10px; font-weight:900; opacity:0.85; }
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

        /* Proof */
        .d8-proofRow{ margin-top: 14px; }
        .d8-proof{
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.26);
          backdrop-filter: blur(12px);
          max-width: 520px;
        }
        .d8-proofTop{ font-weight:900; opacity:0.95; margin-bottom:2px; }
        .d8-proofSub{ font-size:13px; opacity:0.72; line-height:1.35; }

        /* Cards */
        .d8-cards{
          margin-top:22px;
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
      \}</style>
    </main>
  );
}
