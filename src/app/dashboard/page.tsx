"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

const IcHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcLock = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcCheck = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcX = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.59 4.5 2 2 0 0 1 3.56 2.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z"/></svg>;
const IcCal = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

type MonAnnonce = {
  id: string;
  titre: string;
  prix: number;
  quartier: string;
  disponible: boolean;
};

type Demande = {
  id: string;
  date_entree: string;
  duree_mois: number;
  message: string | null;
  statut: string;
  annonces: { titre: string } | null;
  profils: { nom: string | null; prenom: string | null; telephone: string | null } | null;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [annonces, setAnnonces] = useState<MonAnnonce[]>([]);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function charger() {
      if (!user) return;

      const { data: mesAnnonces } = await supabase
        .from("annonces")
        .select("id, titre, prix, quartier, disponible")
        .eq("bailleur_id", user.id);

      setAnnonces(mesAnnonces || []);

      // "annonces!inner" force une jointure : seules les réservations
      // dont l'annonce liée appartient à ce bailleur sont récupérées.
      const { data: mesDemandes } = await supabase
        .from("reservations")
        .select(`
          id, date_entree, duree_mois, message, statut,
          annonces!inner(titre, bailleur_id),
          profils(nom, prenom, telephone)
        `)
        .eq("annonces.bailleur_id", user.id)
        .order("cree_le", { ascending: false });

      setDemandes((mesDemandes as any) || []);
      setLoading(false);
    }
    if (user) charger();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  async function repondre(id: string, statut: "acceptee" | "refusee") {
    await supabase.from("reservations").update({ statut }).eq("id", id);
    setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  }

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", color: "#888" }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 40px", textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><IcLock /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A3C5E", margin: "0 0 12px" }}>Connexion requise</h2>
          <p style={{ color: "#777", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>Connecte-toi pour accéder à ton tableau de bord.</p>
          <a href="/auth" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  const statutStyle = (s: string) => {
    if (s === "acceptee") return { bg: "#EAF5EA", color: "#2E7D32", label: "Acceptée" };
    if (s === "refusee") return { bg: "#FDECEC", color: "#C0392B", label: "Refusée" };
    return { bg: "#FFF3E0", color: "#E87722", label: "En attente" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "'Sora','Segoe UI',sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><IcHome /></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </a>
          <a href="/publier" style={{ padding: "8px 16px", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 14, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", textDecoration: "none" }}>+ Publier</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E", margin: "0 0 28px" }}>Mon tableau de bord</h1>

        {/* MES ANNONCES */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Mes annonces ({annonces.length})</h2>
          {annonces.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", color: "#888", fontSize: 14 }}>
              Tu n'as encore publié aucune annonce.{" "}
              <a href="/publier" style={{ color: "#2E75B6", fontWeight: 600 }}>Publier une annonce</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {annonces.map((a) => (
                <a key={a.id} href={`/annonce/${a.id}`} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", border: "1px solid #E8E4DE" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>{a.titre}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>{a.quartier} · {a.prix.toLocaleString("fr-FR")} XAF/mois</div>
                  </div>
                  <span style={{ background: a.disponible ? "#EAF5EA" : "#F7F5F2", color: a.disponible ? "#2E7D32" : "#888", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>
                    {a.disponible ? "Disponible" : "Indisponible"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* DEMANDES REÇUES */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Demandes de réservation ({demandes.length})</h2>
          {demandes.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", color: "#888", fontSize: 14 }}>
              Aucune demande reçue pour le moment.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {demandes.map((d) => {
                const s = statutStyle(d.statut);
                const nomLocataire = d.profils?.prenom || d.profils?.nom
                  ? `${d.profils?.prenom || ""} ${d.profils?.nom || ""}`.trim()
                  : "Locataire";
                return (
                  <div key={d.id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E8E4DE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{nomLocataire}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Pour : {d.annonces?.titre || "Annonce"}</div>
                      </div>
                      <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>{s.label}</span>
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "#666", marginBottom: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcCal /> {d.date_entree} · {d.duree_mois} mois</span>
                      {d.profils?.telephone && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcPhone /> {d.profils.telephone}</span>
                      )}
                    </div>

                    {d.message && (
                      <p style={{ fontSize: 13, color: "#555", background: "#F7F5F2", padding: "10px 12px", borderRadius: 10, margin: "0 0 12px" }}>{d.message}</p>
                    )}

                    {d.statut === "en_attente" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => repondre(d.id, "acceptee")}
                          style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#2E7D32", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
                          <IcCheck /> Accepter
                        </button>
                        <button onClick={() => repondre(d.id, "refusee")}
                          style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#C0392B", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
                          <IcX /> Refuser
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}