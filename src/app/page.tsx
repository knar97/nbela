"use client";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ── Icônes SVG inline — gris moderne, aucune dépendance externe ──
const IC = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  searchW: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  pinW: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5C07A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  heart: (filled: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#E87722" : "none"} stroke={filled ? "#E87722" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  building: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  image: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  ruler: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="1"/><path d="M6 7v3M10 7v5M14 7v3M18 7v5"/></svg>,
};

// Type calqué exactement sur les colonnes de la table "annonces" dans Supabase.
// Aucun champ ici n'existe s'il n'est pas dans le schema.sql.
type Annonce = {
  id: string;
  titre: string;
  description: string | null;
  type: string;
  meuble: boolean;
  prix: number;
  caution: number;
  surface: number | null;
  etage: number | null;
  quartier: string;
  adresse: string | null;
  disponible: boolean;
};

const quartiers = ["Tous", "Bastos", "Santa Barbara", "Melen", "Ngousso", "Essos", "Omnisports"];
const types = ["Tous types", "chambre", "studio", "appartement"];

export default function Home() {
  const { user, loading: authLoading, deconnexion } = useAuth();
  const [listings, setListings] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQuartier, setSelectedQuartier] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous types");
  const [prixMax, setPrixMax] = useState(300000);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    async function chargerAnnonces() {
      const { data, error } = await supabase
        .from("annonces")
        .select("*")
        .eq("disponible", true);

      if (error) {
        console.error("Erreur chargement annonces:", error);
        setLoading(false);
        return;
      }
      setListings(data || []);
      setLoading(false);
    }
    chargerAnnonces();
  }, []);

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.titre.toLowerCase().includes(search.toLowerCase()) ||
      l.quartier.toLowerCase().includes(search.toLowerCase());
    const matchQuartier = selectedQuartier === "Tous" || l.quartier === selectedQuartier;
    const matchType = selectedType === "Tous types" || l.type === selectedType;
    const matchPrix = l.prix <= prixMax;
    return matchSearch && matchQuartier && matchType && matchPrix;
  });

  const toggleFav = (id: string) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: "100vh", background: "#F7F5F2", color: "#1A1A2E" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{IC.home}</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="#annonces" style={{ padding: "8px 16px", borderRadius: 8, color: "#555", fontWeight: 500, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>{IC.grid} Annonces</a>
            {authLoading ? null : user ? (
              <button
                onClick={async () => { await deconnexion(); window.location.href = "/"; }}
                style={{ padding: "8px 16px", borderRadius: 8, color: "#1A3C5E", fontWeight: 600, fontSize: 14, border: "1.5px solid #1A3C5E", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}
              >
                {user.email} · Déconnexion
              </button>
            ) : (
              <a href="/auth" style={{ padding: "8px 16px", borderRadius: 8, color: "#1A3C5E", fontWeight: 600, fontSize: 14, border: "1.5px solid #1A3C5E", textDecoration: "none" }}>Connexion</a>
            )}
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
            Chambres, studios et appartements modernes — meublés ou non.
          </p>
          <div style={{ background: "#fff", borderRadius: 16, padding: 8, display: "flex", gap: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F7F5F2", borderRadius: 10 }}>
              {IC.search}
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Quartier, titre..." style={{ border: "none", background: "none", outline: "none", fontSize: 15, color: "#1A1A2E", width: "100%", fontFamily: "inherit" }} />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#F7F5F2", fontSize: 14, color: "#333", fontFamily: "inherit", cursor: "pointer", minWidth: 160 }}>
              {types.map((t) => <option key={t} value={t}>{t === "Tous types" ? t : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <button style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#E87722,#c9621a)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              {IC.searchW} Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* ANNONCES */}
      <section id="annonces" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 800, margin: 0 }}>Annonces disponibles</h2>
            <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>
              {loading ? "Chargement..." : `${filtered.length} logement${filtered.length > 1 ? "s" : ""} trouvé${filtered.length > 1 ? "s" : ""}`}
            </p>
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <p style={{ fontSize: 15 }}>Chargement des annonces...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>Aucun logement trouvé</p>
            <p style={{ fontSize: 14 }}>Essaie de modifier tes filtres, ou reviens plus tard.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {filtered.map((l) => (
              <div key={l.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E4DE", transition: "transform 0.2s,box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>

                {/* Vignette : icône image neutre en attendant le vrai systeme de photos (table "photos") */}
                <div style={{ height: 200, background: "linear-gradient(135deg,#D6E4F0,#EBF3FB)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {IC.image}
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(l.id); }}
                    style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    {IC.heart(favs.includes(l.id))}
                  </button>
                </div>

                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.3 }}>{l.titre}</h3>

                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, color: "#888", fontSize: 13 }}>
                    {IC.pin} {l.quartier}
                    {l.surface && <>&nbsp;· {IC.ruler} {l.surface} m²</>}
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    <span style={{ background: "#F0F6FF", color: "#2E75B6", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                      {l.type.charAt(0).toUpperCase() + l.type.slice(1)}
                    </span>
                    <span style={{ background: l.meuble ? "#EAF5EA" : "#F7F5F2", color: l.meuble ? "#2E7D32" : "#888", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                      {l.meuble ? "Meublé" : "Non meublé"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#1A3C5E" }}>{l.prix.toLocaleString("fr-FR")}</span>
                      <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>XAF/mois</span>
                    </div>
                    <a href={`/annonce`} style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#E87722,#c9621a)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Voir →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA BAILLEUR */}
      <section style={{ background: "#FFF8F3", padding: "56px 24px", borderTop: "1px solid #F0E8DF" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          {IC.building}
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", margin: "16px 0 12px" }}>Vous êtes bailleur ?</h2>
          <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>Publiez vos annonces gratuitement et touchez des milliers de locataires sérieux à Yaoundé.</p>
          <a href="/auth" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 24px rgba(26,60,94,0.25)" }}>
            Publier une annonce gratuite
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", padding: "32px 24px", color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 13 }}>
        © 2026 Nbela — Tous droits réservés · Yaoundé, Cameroun
      </footer>
    </div>
  );
}