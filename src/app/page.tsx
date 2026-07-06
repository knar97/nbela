"use client";
import { useState } from "react";

const listings = [
  { id: 1, title: "Studio meublé moderne", quartier: "Bastos", type: "Studio meublé", prix: 85000, surface: 32, note: 4.8, avis: 24, emoji: "🏢", badge: "Coup de cœur", equip: ["WiFi", "Clim", "Cuisine", "Sécurité"] },
  { id: 2, title: "Appartement T2 moderne", quartier: "Santa Barbara", type: "Appartement meublé", prix: 150000, surface: 65, note: 4.9, avis: 41, emoji: "🏠", badge: "Top Nbela", equip: ["WiFi", "Parking", "Gardien", "Balcon"] },
  { id: 3, title: "Chambre moderne simple", quartier: "Melen", type: "Chambre simple", prix: 35000, surface: 18, note: 4.5, avis: 12, emoji: "🛏️", badge: null, equip: ["WiFi", "Eau chaude", "Clim"] },
  { id: 4, title: "Studio simple lumineux", quartier: "Ngousso", type: "Studio simple", prix: 55000, surface: 28, note: 4.6, avis: 18, emoji: "🪟", badge: "Nouveau", equip: ["WiFi", "Cuisine", "Clim"] },
  { id: 5, title: "Appartement T3 meublé", quartier: "Essos", type: "Appartement meublé", prix: 220000, surface: 90, note: 4.7, avis: 33, emoji: "🏡", badge: null, equip: ["WiFi", "Parking", "Piscine", "Gardien"] },
  { id: 6, title: "Chambre meublée VIP", quartier: "Omnisports", type: "Chambre meublée", prix: 50000, surface: 22, note: 4.9, avis: 29, emoji: "✨", badge: "Populaire", equip: ["WiFi", "Clim", "TV", "Eau chaude"] },
];

const quartiers = ["Tous", "Bastos", "Santa Barbara", "Melen", "Ngousso", "Essos", "Omnisports"];
const types = ["Tous types", "Chambre simple", "Chambre meublée", "Studio simple", "Studio meublé", "Appartement simple", "Appartement meublé"];

// Icônes SVG inline — gris moderne #6B7280
const IC = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  homeW: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  searchW: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  pinW: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5C07A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  star: <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  starB: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  heart: (filled: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#E87722" : "none"} stroke={filled ? "#E87722" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  building: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>,
  grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  wifi: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedQuartier, setSelectedQuartier] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous types");
  const [prixMax, setPrixMax] = useState(300000);
  const [favs, setFavs] = useState<number[]>([]);

  const filtered = listings.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.quartier.toLowerCase().includes(search.toLowerCase());
    const matchQuartier = selectedQuartier === "Tous" || l.quartier === selectedQuartier;
    const matchType = selectedType === "Tous types" || l.type === selectedType;
    return matchSearch && matchQuartier && matchType && l.prix <= prixMax;
  });

  const toggleFav = (id: number) => setFavs((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: "100vh", background: "#F7F5F2", color: "#1A1A2E" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.homeW}</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="#annonces" style={{ padding: "8px 16px", borderRadius: 8, color: "#555", fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>{IC.grid} Annonces</a>
            <a href="/auth" style={{ padding: "8px 16px", borderRadius: 8, color: "#1A3C5E", fontWeight: 600, fontSize: 14, border: "1.5px solid #1A3C5E", textDecoration: "none" }}>Connexion</a>
            <a href="/auth" style={{ padding: "8px 18px", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 14, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", textDecoration: "none" }}>Publier</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#1A3C5E 0%,#2E75B6 60%,#1A3C5E 100%)", padding: "72px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(232,119,34,0.12)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,119,34,0.2)", border: "1px solid rgba(232,119,34,0.4)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            {IC.pinW}<span style={{ color: "#F5C07A", fontSize: 13, fontWeight: 600 }}>Yaoundé, Cameroun</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
            Trouve ton logement idéal<br /><span style={{ color: "#E87722" }}>à Yaoundé</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(15px,2vw,18px)", marginBottom: 40, lineHeight: 1.6 }}>
            Chambres, studios et appartements modernes — meublés ou non.<br />Réservez en ligne en toute sécurité.
          </p>
          <div style={{ background: "#fff", borderRadius: 16, padding: 8, display: "flex", gap: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F7F5F2", borderRadius: 10 }}>
              {IC.search}
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Quartier, type de logement..." style={{ border: "none", background: "none", outline: "none", fontSize: 15, color: "#1A1A2E", width: "100%", fontFamily: "inherit" }} />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#F7F5F2", fontSize: 14, color: "#333", fontFamily: "inherit", cursor: "pointer", minWidth: 160 }}>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#E87722,#c9621a)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              {IC.searchW} Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#fff", padding: "28px 24px", borderBottom: "1px solid #E8E4DE" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,80px)", flexWrap: "wrap" }}>
          {[
            { icon: IC.building, val: "500+", label: "Annonces actives" },
            { icon: IC.starB, val: "4.8★", label: "Note moyenne" },
            { icon: IC.heart(true), val: "3 000+", label: "Locataires satisfaits" },
            { icon: IC.shield, val: "24h", label: "Délai de réponse" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "#1A3C5E" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ANNONCES */}
      <section id="annonces" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 800, margin: 0 }}>Annonces disponibles</h2>
            <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>{filtered.length} logement{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <select value={selectedQuartier} onChange={(e) => setSelectedQuartier(e.target.value)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #E8E4DE", background: "#fff", fontSize: 14, fontFamily: "inherit", cursor: "pointer", color: "#333" }}>
              {quartiers.map((q) => <option key={q}>{q}</option>)}
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "1.5px solid #E8E4DE", background: "#fff" }}>
              <span style={{ fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>Max : {(prixMax / 1000).toFixed(0)}k XAF</span>
              <input type="range" min={30000} max={300000} step={5000} value={prixMax} onChange={(e) => setPrixMax(Number(e.target.value))} style={{ width: 100, accentColor: "#E87722" }} />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>Aucun logement trouvé</p>
            <p style={{ fontSize: 14 }}>Essaie de modifier tes filtres</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {filtered.map((l) => (
              <div key={l.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E4DE", transition: "transform 0.2s,box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                <div style={{ height: 200, background: "linear-gradient(135deg,#D6E4F0,#EBF3FB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  {l.badge && <div style={{ position: "absolute", top: 12, left: 12, background: l.badge === "Top Nbela" ? "#1A3C5E" : "#E87722", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{l.badge}</div>}
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(l.id); }} style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    {IC.heart(favs.includes(l.id))}
                  </button>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.3 }}>{l.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0, marginLeft: 8 }}>
                      {IC.star}<span style={{ fontSize: 13, fontWeight: 700 }}>{l.note}</span>
                      <span style={{ fontSize: 12, color: "#aaa" }}>({l.avis})</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, color: "#888", fontSize: 13 }}>
                    {IC.pin} {l.quartier} · {l.surface} m²
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {l.equip.slice(0, 3).map((eq) => (
                      <span key={eq} style={{ background: "#F0F6FF", color: "#2E75B6", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        {IC.wifi} {eq}
                      </span>
                    ))}
                    {l.equip.length > 3 && <span style={{ background: "#F7F5F2", color: "#888", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>+{l.equip.length - 3}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#1A3C5E" }}>{l.prix.toLocaleString("fr-FR")}</span>
                      <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>XAF/mois</span>
                    </div>
                    <a href="/annonce" style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#E87722,#c9621a)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Voir →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ background: "#1A3C5E", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, marginBottom: 8 }}>Comment ça marche ?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 48, fontSize: 15 }}>Trouvez et réservez votre logement en 3 étapes simples</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 32 }}>
            {[
              { num: "01", svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(232,119,34,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, title: "Recherchez", desc: "Filtrez par quartier, budget et type de logement." },
              { num: "02", svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(232,119,34,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: "Visitez", desc: "Consultez photos et vidéos, planifiez une visite." },
              { num: "03", svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(232,119,34,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>, title: "Réservez", desc: "Payez via Mobile Money et recevez votre contrat." },
            ].map((s) => (
              <div key={s.num} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(232,119,34,0.15)", border: "2px solid rgba(232,119,34,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{s.svg}</div>
                <div style={{ color: "#E87722", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>{s.num}</div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAILLEUR */}
      <section style={{ background: "#FFF8F3", padding: "56px 24px", borderTop: "1px solid #F0E8DF" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E87722" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/></svg>
          </div>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", margin: "0 0 12px" }}>Vous êtes bailleur ?</h2>
          <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>Publiez vos annonces gratuitement et touchez des milliers de locataires sérieux à Yaoundé.</p>
          <a href="/auth" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>Publier une annonce gratuite</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", padding: "40px 24px 24px", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.homeW}</div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, maxWidth: 260 }}>La plateforme de référence pour la location immobilière à Yaoundé, Cameroun.</p>
            </div>
            {[
              { title: "Logements", items: ["Chambres", "Studios", "Appartements", "Meublés"] },
              { title: "Quartiers", items: ["Bastos", "Santa Barbara", "Melen", "Ngousso"] },
              { title: "Aide", items: ["Contact", "FAQ", "CGU", "Signaler"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{col.title}</div>
                {col.items.map((item) => <div key={item} style={{ fontSize: 13, marginBottom: 6, cursor: "pointer" }}>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, fontSize: 12, textAlign: "center" }}>
            © 2026 Nbela — Tous droits réservés · Yaoundé, Cameroun
          </div>
        </div>
      </footer>
    </div>
  );
}