"use client";
import { useState } from "react";

// SVG icons inline — gris moderne #6B7280
const IcPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcStar = ({ fill = true }) => <svg width="13" height="13" viewBox="0 0 24 24" fill={fill ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcHome = ({ color = "#fff" }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcArrowLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IcHeart = ({ filled }: { filled: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#E87722" : "none"} stroke={filled ? "#E87722" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcShield = ({ color = "#6B7280", size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
const IcMsg = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcCal = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcChevDown = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcChevUp = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;
const IcBed = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M22 4v16"/><path d="M2 8h20"/><path d="M2 16h20"/><path d="M6 8v8"/><path d="M10 8v8"/></svg>;
const IcBath = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
const IcResize = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
const IcLayers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;

const equips = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>, label: "WiFi Fibre" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 0 1 1.8 2.3V21a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V10a2.5 2.5 0 0 1 1.8-2.3L10 7V4a2 2 0 0 1 4 0v3z"/></svg>, label: "Climatisation" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>, label: "Cuisine équipée" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>, label: "Eau chaude" },
  { icon: <IcShield color="#6B7280" size={16} />, label: "Sécurité 24h" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: "Parking" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>, label: "Télévision" },
  { icon: <IcBed />, label: "Lit queen size" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: "Bureau" },
  { icon: <IcHome color="#6B7280" />, label: "Balcon" },
];

const avisListe = [
  { nom: "Pauline M.", date: "Avril 2026", note: 5, commentaire: "Logement impeccable, très propre et bien situé. Le bailleur est très réactif. Je recommande vivement !" },
  { nom: "Jean-Pierre K.", date: "Mars 2026", note: 5, commentaire: "Studio moderne et fonctionnel, tout comme décrit. WiFi rapide, eau chaude, rien à redire." },
  { nom: "Aminata D.", date: "Février 2026", note: 4, commentaire: "Très bon séjour, quartier calme et sécurisé. Petit bémol sur le parking parfois plein." },
];

const annonce = {
  titre: "Studio meublé moderne — Bastos", quartier: "Bastos", type: "Studio meublé",
  prix: 85000, caution: 170000, surface: 32, etage: 3, note: 4.8, avis: 24,
  dateDisponible: "01 Juin 2026",
  description: `Beau studio moderne entièrement meublé situé au cœur du quartier Bastos, le quartier diplomatique de Yaoundé.\n\nIdéal pour un(e) professionnel(le) ou étudiant(e) cherchant confort et sécurité. Le logement est lumineux, bien ventilé et bénéficie d'une vue dégagée depuis le balcon.\n\nLe studio dispose d'une cuisine équipée, d'une salle de bain moderne avec eau chaude, d'un lit queen size, armoire intégrée, bureau de travail et connexion WiFi fibre optique.`,
  regles: ["Non fumeur", "Pas d'animaux", "Pas de fête", "Calme après 22h"],
  bailleur: { nom: "M. Tchoupo André", membre: "Membre depuis 2024", note: 4.9, annonces: 3, reponse: "98%", delai: "< 1 heure" },
  photos: ["🏢", "🛏️", "🍳", "🚿", "🌇"],
  adresse: "Rue Bastos, près de l'Ambassade de France, Yaoundé",
};

export default function DetailAnnonce() {
  const [photoActive, setPhotoActive] = useState(0);
  const [showAllEquip, setShowAllEquip] = useState(false);
  const [dateEntree, setDateEntree] = useState("");
  const [duree, setDuree] = useState("1");
  const [message, setMessage] = useState("");
  const [reservationEnvoyee, setReservationEnvoyee] = useState(false);
  const [fav, setFav] = useState(false);

  const equipAffich = showAllEquip ? equips : equips.slice(0, 6);
  const totalPayer = annonce.prix * parseInt(duree) + annonce.caution;

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: "100vh", background: "#F7F5F2", color: "#1A1A2E" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><IcHome /></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </a>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, color: "#555", fontSize: 14, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}><IcArrowLeft /> Retour</a>
            <button onClick={() => setFav(!fav)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #E8E4DE", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: fav ? "#E87722" : "#555", fontFamily: "inherit" }}>
              <IcHeart filled={fav} /> {fav ? "Sauvegardé" : "Sauvegarder"}
            </button>
            <a href="/auth" style={{ padding: "8px 16px", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 14, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", textDecoration: "none" }}>Connexion</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* TITRE */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#1A3C5E", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{annonce.type}</span>
            <span style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}>
              <IcShield color="#2E7D32" size={12} /> Disponible dès le {annonce.dateDisponible}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, margin: "0 0 8px" }}>{annonce.titre}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "#666", fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcPin /> {annonce.adresse}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcStar /> <strong>{annonce.note}</strong> ({annonce.avis} avis)</span>
          </div>
        </div>

        {/* GALERIE */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#D6E4F0,#EBF3FB)", height: 340, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, position: "relative", marginBottom: 10 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {annonce.photos.map((_, i) => (
                <div key={i} onClick={() => setPhotoActive(i)} style={{ width: i === photoActive ? 20 : 8, height: 8, borderRadius: 100, background: i === photoActive ? "#E87722" : "rgba(255,255,255,0.7)", cursor: "pointer", transition: "all 0.2s" }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {annonce.photos.map((p, i) => (
              <div key={i} onClick={() => setPhotoActive(i)} style={{ flex: 1, height: 70, borderRadius: 10, background: "linear-gradient(135deg,#D6E4F0,#EBF3FB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer", border: i === photoActive ? "2.5px solid #E87722" : "2.5px solid transparent", transition: "border 0.2s" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px,100%)", gap: 32, alignItems: "start" }}>

          {/* GAUCHE */}
          <div>
            {/* Infos rapides */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 32 }}>
              {[
                { icon: <IcResize />, val: `${annonce.surface} m²`, label: "Surface" },
                { icon: <IcLayers />, val: `Étage ${annonce.etage}`, label: "Étage" },
                { icon: <IcBed />, val: "1 chambre", label: "Chambre" },
                { icon: <IcBath />, val: "1 sdb", label: "Salle de bain" },
              ].map((info) => (
                <div key={info.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", textAlign: "center", border: "1px solid #E8E4DE" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{info.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{info.val}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{info.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>Description</h2>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{annonce.description}</p>
            </div>

            {/* Équipements */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>Équipements</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
                {equipAffich.map((eq) => (
                  <div key={eq.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F7F5F2", borderRadius: 10 }}>
                    {eq.icon}<span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{eq.label}</span>
                  </div>
                ))}
              </div>
              {equips.length > 6 && (
                <button onClick={() => setShowAllEquip(!showAllEquip)} style={{ marginTop: 14, background: "none", border: "1.5px solid #1A3C5E", color: "#1A3C5E", fontWeight: 700, fontSize: 14, padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                  {showAllEquip ? <><IcChevUp /> Voir moins</> : <><IcChevDown /> Voir tout ({equips.length})</>}
                </button>
              )}
            </div>

            {/* Règles */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>Règles du logement</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {annonce.regles.map((r) => <span key={r} style={{ background: "#FFF3E0", color: "#E87722", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 100, border: "1px solid #FFCC80" }}>{r}</span>)}
              </div>
            </div>

            {/* Avis */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Avis des locataires</h2>
                <span style={{ background: "#1A3C5E", color: "#fff", fontWeight: 800, fontSize: 14, padding: "4px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}><IcStar /> {annonce.note}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {avisListe.map((a) => (
                  <div key={a.nom} style={{ padding: 16, background: "#F7F5F2", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{a.nom[0]}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{a.nom}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>{a.date}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: a.note }).map((_, i) => <IcStar key={i} />)}</div>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.6 }}>{a.commentaire}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bailleur */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>Votre bailleur</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#E87722,#c9621a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 22 }}>{annonce.bailleur.nom[3]}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{annonce.bailleur.nom}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{annonce.bailleur.membre}</div>
                  <div style={{ fontSize: 13, color: "#E87722", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><IcStar /> {annonce.bailleur.note} · {annonce.bailleur.annonces} annonces</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "#F7F5F2", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><IcShield size={12} /> Taux de réponse</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#1A3C5E" }}>{annonce.bailleur.reponse}</div>
                </div>
                <div style={{ background: "#F7F5F2", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><IcClock /> Délai de réponse</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#1A3C5E" }}>{annonce.bailleur.delai}</div>
                </div>
              </div>
              <button style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid #1A3C5E", background: "#fff", color: "#1A3C5E", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <IcMsg /> Contacter le bailleur
              </button>
            </div>
          </div>

          {/* DROITE — Réservation */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8E4DE", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{annonce.prix.toLocaleString("fr-FR")}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>XAF / mois</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Caution : {annonce.caution.toLocaleString("fr-FR")} XAF</div>
              </div>

              {!reservationEnvoyee ? (
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcCal /> Date d'entrée souhaitée</label>
                    <input type="date" value={dateEntree} onChange={(e) => setDateEntree(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcClock /> Durée de location</label>
                    <select value={duree} onChange={(e) => setDuree(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none" }}>
                      {["1","2","3","6","12"].map((d) => <option key={d} value={d}>{d} mois</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcMsg /> Message (optionnel)</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Présentez-vous brièvement..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ background: "#F7F5F2", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", marginBottom: 8 }}>
                      <span>{annonce.prix.toLocaleString("fr-FR")} × {duree} mois</span>
                      <span>{(annonce.prix * parseInt(duree)).toLocaleString("fr-FR")} XAF</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", marginBottom: 10 }}>
                      <span>Caution</span><span>{annonce.caution.toLocaleString("fr-FR")} XAF</span>
                    </div>
                    <div style={{ borderTop: "1px solid #E0D9D0", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
                      <span>Total</span><span>{totalPayer.toLocaleString("fr-FR")} XAF</span>
                    </div>
                  </div>
                  <button onClick={() => { if (dateEntree) setReservationEnvoyee(true); }} disabled={!dateEntree}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, background: dateEntree ? "linear-gradient(135deg,#E87722,#c9621a)" : "#ddd", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: dateEntree ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    Réserver ce logement
                  </button>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {["MTN Money", "Orange Money"].map((p) => <div key={p} style={{ flex: 1, textAlign: "center", padding: "6px", background: "#F7F5F2", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "#666" }}>{p}</div>)}
                  </div>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 12, marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <IcShield size={12} /> Paiement sécurisé — Remboursable sous 48h
                  </p>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF5EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><IcShield color="#2E7D32" size={32} /></div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>Demande envoyée !</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>Le bailleur a été notifié. Vous recevrez une réponse dans moins d'1 heure.</p>
                  <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    <IcHome /> Retour à l'accueil
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: "#111827", padding: "24px", color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 13, marginTop: 48 }}>
        © 2026 Nbela — Tous droits réservés · Yaoundé, Cameroun
      </footer>
    </div>
  );
}