"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

const IcHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcArrowLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IcImage = () => <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IcResize = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
const IcLayers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A3C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const IcShield = ({ color = "#6B7280", size = 14 }: { color?: string; size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
const IcCal = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcMsg = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

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

export default function DetailAnnonce() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [dateEntree, setDateEntree] = useState("");
  const [duree, setDuree] = useState("1");
  const [message, setMessage] = useState("");
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationEnvoyee, setReservationEnvoyee] = useState(false);
  const [reservationErreur, setReservationErreur] = useState("");

  // Charge l'annonce précise correspondant à l'id présent dans l'URL.
  useEffect(() => {
    async function chargerAnnonce() {
      const { data, error } = await supabase
        .from("annonces")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setAnnonce(data);
      setLoading(false);
    }
    if (id) chargerAnnonce();
  }, [id]);

  async function envoyerReservation() {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    if (!dateEntree || !annonce) return;

    setReservationLoading(true);
    const { error } = await supabase.from("reservations").insert({
      annonce_id: annonce.id,
      locataire_id: user.id,
      date_entree: dateEntree,
      duree_mois: Number(duree),
      message: message || null,
      statut: "en_attente",
    });

    if (error) {
      setReservationErreur("Erreur lors de l'envoi : " + error.message);
      setReservationLoading(false);
      return;
    }

    setReservationEnvoyee(true);
    setReservationLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", color: "#888" }}>
        Chargement...
      </div>
    );
  }

  if (notFound || !annonce) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", gap: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>Annonce introuvable</p>
        <a href="/" style={{ color: "#2E75B6", fontWeight: 600, textDecoration: "none" }}>← Retour à l'accueil</a>
      </div>
    );
  }

  const totalPayer = annonce.prix * Number(duree) + annonce.caution;

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: "100vh", background: "#F7F5F2", color: "#1A1A2E" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><IcHome /></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </a>
          <a href="/" style={{ padding: "8px 14px", borderRadius: 8, color: "#555", fontSize: 14, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}><IcArrowLeft /> Retour</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* TITRE */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#1A3C5E", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>
              {annonce.type.charAt(0).toUpperCase() + annonce.type.slice(1)}
            </span>
            <span style={{ background: annonce.meuble ? "#EAF5EA" : "#F7F5F2", color: annonce.meuble ? "#2E7D32" : "#888", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>
              {annonce.meuble ? "Meublé" : "Non meublé"}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, margin: "0 0 8px" }}>{annonce.titre}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "#666", fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcPin /> {annonce.adresse || annonce.quartier}</span>
          </div>
        </div>

        {/* GALERIE (placeholder en attendant le systeme de photos) */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#D6E4F0,#EBF3FB)", height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcImage />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px,100%)", gap: 32, alignItems: "start" }}>

          {/* GAUCHE */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 32 }}>
              {annonce.surface && (
                <div style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", textAlign: "center", border: "1px solid #E8E4DE" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><IcResize /></div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{annonce.surface} m²</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Surface</div>
                </div>
              )}
              {annonce.etage !== null && (
                <div style={{ background: "#fff", borderRadius: 12, padding: "16px 14px", textAlign: "center", border: "1px solid #E8E4DE" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><IcLayers /></div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Étage {annonce.etage}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Étage</div>
                </div>
              )}
            </div>

            {annonce.description && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8E4DE", marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>Description</h2>
                <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{annonce.description}</p>
              </div>
            )}
          </div>

          {/* DROITE — Réservation */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8E4DE", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{annonce.prix.toLocaleString("fr-FR")}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>XAF / mois</span>
                </div>
                {annonce.caution > 0 && (
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Caution : {annonce.caution.toLocaleString("fr-FR")} XAF</div>
                )}
              </div>

              {!reservationEnvoyee ? (
                <div style={{ padding: 24 }}>
                  {reservationErreur && (
                    <div style={{ background: "#FDECEC", border: "1px solid #F5C6C6", color: "#C0392B", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
                      {reservationErreur}
                    </div>
                  )}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcCal /> Date d'entrée souhaitée</label>
                    <input type="date" value={dateEntree} onChange={(e) => setDateEntree(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcClock /> Durée de location</label>
                    <select value={duree} onChange={(e) => setDuree(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none" }}>
                      {["1", "2", "3", "6", "12"].map((d) => <option key={d} value={d}>{d} mois</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><IcMsg /> Message au bailleur (optionnel)</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Présente-toi brièvement..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0D9D0", fontSize: 14, fontFamily: "inherit", background: "#FAFAF8", color: "#1A1A2E", outline: "none", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ background: "#F7F5F2", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", marginBottom: 8 }}>
                      <span>{annonce.prix.toLocaleString("fr-FR")} × {duree} mois</span>
                      <span>{(annonce.prix * Number(duree)).toLocaleString("fr-FR")} XAF</span>
                    </div>
                    {annonce.caution > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", marginBottom: 10 }}>
                        <span>Caution</span><span>{annonce.caution.toLocaleString("fr-FR")} XAF</span>
                      </div>
                    )}
                    <div style={{ borderTop: "1px solid #E0D9D0", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
                      <span>Total</span><span>{totalPayer.toLocaleString("fr-FR")} XAF</span>
                    </div>
                  </div>
                  <button onClick={envoyerReservation} disabled={!dateEntree || reservationLoading}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, background: dateEntree ? "linear-gradient(135deg,#E87722,#c9621a)" : "#ddd", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: dateEntree ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    {reservationLoading ? "Envoi..." : user ? "Demander la réservation" : "Se connecter pour réserver"}
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 12, marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <IcShield size={12} /> Demande envoyée directement au bailleur
                  </p>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF5EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <IcShield color="#2E7D32" size={32} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>Demande envoyée !</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>Le bailleur a été notifié de ta demande.</p>
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