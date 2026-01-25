"use client";

import React, { useEffect, useState } from "react";

function DemoPanel() {
  const [p, setP] = useState(0);
  const [h, setH] = useState("");
  const full = "This is how websites are made now.";

  useEffect(() => {
    let t: number[] = [];
    const add = (fn: () => void, ms: number) => t.push(window.setTimeout(fn, ms));

    add(() => setH(full.slice(0, 10)), 300);
    add(() => setH(full.slice(0, 22)), 600);
    add(() => setH(full), 900);

    [[400,20],[900,38],[1500,55],[2300,72],[3200,90],[4200,100]]
      .forEach(([ms,v]) => add(() => setP(v as number), ms as number));

    return () => t.forEach(clearTimeout);
  }, []);

  const card: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    overflow: "hidden"
  };

  return (
    <div style={card}>
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"14px 16px",
        borderBottom:"1px solid rgba(255,255,255,0.1)",
        background:"rgba(0,0,0,0.4)"
      }}>
        <span style={{width:10,height:10,borderRadius:999,background:"#ff5f56"}} />
        <span style={{width:10,height:10,borderRadius:999,background:"#ffbd2e"}} />
        <span style={{width:10,height:10,borderRadius:999,background:"#27c93f"}} />
        <div style={{
          margin:"0 auto",
          padding:"6px 12px",
          fontSize:11,
          color:"rgba(255,255,255,0.7)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:999,
          background:"rgba(255,255,255,0.05)"
        }}>
          dominat8.com / preview
        </div>
      </div>

      <div style={{padding:18}}>
        <div style={{
          fontSize:11,
          letterSpacing:2.4,
          textTransform:"uppercase",
          color:"rgba(255,255,255,0.6)"
        }}>
          Generating homepage
        </div>

        <div style={{
          marginTop:8,
          height:8,
          borderRadius:999,
          background:"rgba(255,255,255,0.12)",
          overflow:"hidden"
        }}>
          <div style={{
            width: p + "%",
            height:"100%",
            background:"rgba(255,255,255,0.4)",
            transition:"width 300ms ease"
          }} />
        </div>

        <div style={{
          marginTop:16,
          fontSize:18,
          fontWeight:800,
          color:"white",
          lineHeight:1.35
        }}>
          {h}
        </div>

        <div style={{marginTop:14, display:"flex", gap:8, flexWrap:"wrap"}}>
          {["SEO Ready","Sitemap Generated","Published"].map(t => (
            <span key={t} style={{
              padding:"8px 12px",
              borderRadius:999,
              fontSize:12,
              color:"rgba(255,255,255,0.9)",
              border:"1px solid rgba(255,255,255,0.16)",
              background:"rgba(255,255,255,0.06)"
            }}>✓ {t}</span>
          ))}
        </div>

        <div style={{
          marginTop:14,
          fontSize:11,
          color:"rgba(255,255,255,0.5)"
        }}>
          LIVE_20260126_084520
        </div>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const shell: React.CSSProperties = {
    minHeight:"100vh",
    display:"flex",
    alignItems:"center",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,0.12), transparent 60%)," +
      "radial-gradient(900px 500px at 90% 30%, rgba(255,255,255,0.08), transparent 55%)," +
      "linear-gradient(180deg,#050608 0%,#07080b 55%,#06070a 100%)",
    color:"white",
    fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
  };

  return (
    <section style={shell}>
      <div style={{
        maxWidth:1200,
        margin:"0 auto",
        padding:"0 24px",
        display:"grid",
        gridTemplateColumns:"1.1fr 0.9fr",
        gap:48,
        alignItems:"center"
      }}>
        <div>
          <h1 style={{
            fontSize:52,
            lineHeight:1.05,
            fontWeight:900,
            letterSpacing:-1.4
          }}>
            This is how websites are made now.
          </h1>

          <p style={{
            marginTop:18,
            fontSize:18,
            lineHeight:1.6,
            color:"rgba(255,255,255,0.72)",
            maxWidth:520
          }}>
            Describe your business. Your website assembles itself. Publish.
          </p>

          <div style={{marginTop:28, display:"flex", gap:14, alignItems:"center"}}>
            <a href="/builder" style={{
              padding:"14px 20px",
              borderRadius:14,
              background:"white",
              color:"black",
              fontWeight:900,
              textDecoration:"none",
              boxShadow:"0 18px 40px rgba(0,0,0,0.45)"
            }}>
              Build my site
            </a>

            <span style={{
              fontSize:13,
              color:"rgba(255,255,255,0.6)"
            }}>
              No templates. No setup.
            </span>
          </div>
        </div>

        <DemoPanel />
      </div>
    </section>
  );
}