"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ShieldIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
const LockIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UploadIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid #E0D9D0", fontSize: 15, fontFamily: "inherit",
  background: "#FAFAF8", color: "#1A1A2E", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6, display: "block" };
const errStyle: React.CSSProperties = { fontSize: 12, color: "#E53935", marginTop: 4 };

export default function PublierPage() {
  const { user, loading: authLoading } = useAuth();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("studio");
  const [meuble, setMeuble] = useState(false);
  const [prix, setPrix] = useState("");
  const [caution, setCaution] = useState("");
  const [surface, setSurface] = useState("");
  const [etage, setEtage] = useState("");
  const [quartier, setQuartier] = useState("");
  const [adresse, setAdresse] = useState("");

  // Fichiers photo sélectionnés, en attente d'upload
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [etapeEnvoi, setEtapeEnvoi] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!titre.trim()) e.titre = "Le titre est requis";
    if (!quartier.trim()) e.quartier = "Le quartier est requis";
    if (!prix || Number(prix) <= 0) e.prix = "Indique un prix valide";
    return e;
  };

  function ajouterPhotos(fichiers: FileList | null) {
    if (!fichiers) return;
    const nouveauxFichiers = Array.from(fichiers).slice(0, 6 - photos.length);
    setPhotos((prev) => [...prev, ...nouveauxFichiers]);
    nouveauxFichiers.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((prev) => [...prev, url]);
    });
  }

  function retirerPhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function publier() {
    if (!user) return;

    // 1. Créer l'annonce. On utilise .select().single() pour récupérer
    // l'id généré, nécessaire ensuite pour associer les photos.
    const { data: nouvelleAnnonce, error: erreurAnnonce } = await supabase
      .from("annonces")
      .insert({
        bailleur_id: user.id,
        titre,
        description: description || null,
        type,
        meuble,
        prix: Number(prix),
        caution: caution ? Number(caution) : 0,
        surface: surface ? Number(surface) : null,
        etage: etage ? Number(etage) : null,
        quartier,
        adresse: adresse || null,
        disponible: true,
      })
      .select()
      .single();

    if (erreurAnnonce || !nouvelleAnnonce) {
      setErrors({ global: "Erreur lors de la publication : " + erreurAnnonce?.message });
      return;
    }

    // 2. Uploader chaque photo, une par une, dans le bucket "photos".
    // Le chemin utilise l'id de l'annonce pour organiser les fichiers.
    if (photos.length > 0) {
      setEtapeEnvoi("Envoi des photos...");
      for (let i = 0; i < photos.length; i++) {
        const fichier = photos[i];
        const chemin = `${nouvelleAnnonce.id}/${Date.now()}-${i}-${fichier.name}`;

        const { error: erreurUpload } = await supabase.storage
          .from("photos")
          .upload(chemin, fichier);

        if (erreurUpload) {
          console.error("Erreur upload photo:", erreurUpload);
          continue; // On continue avec les autres photos même si une échoue
        }

        // Récupère l'URL publique de la photo qu'on vient d'uploader
        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(chemin);

        // 3. Enregistre la référence de la photo dans la table "photos"
        await supabase.from("photos").insert({
          annonce_id: nouvelleAnnonce.id,
          url: urlData.publicUrl,
          ordre: i,
        });
      }
    }

    setSuccess(true);
  }

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setEtapeEnvoi("Publication de l'annonce...");
    await publier();
    setLoading(false);
    setEtapeEnvoi("");
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif" }}>
        <p style={{ color: "#888" }}>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 40px", textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><LockIcon /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A3C5E", margin: "0 0 12px" }}>Connexion requise</h2>
          <p style={{ color: "#777", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>Tu dois être connecté pour publier une annonce sur Nbela.</p>
          <a href="/auth" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 40px", textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EAF5EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><ShieldIcon /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A3C5E", margin: "0 0 12px" }}>Annonce publiée !</h2>
          <p style={{ color: "#777", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>Ton annonce est maintenant visible par tous les visiteurs de Nbela.</p>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            <HomeIcon /> Voir les annonces
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "'Sora','Segoe UI',sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><HomeIcon /></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E", margin: "0 0 6px" }}>Publier une annonce</h1>
        <p style={{ color: "#888", fontSize: 14, margin: "0 0 28px" }}>Remplis les informations de ton logement. Il sera visible immédiatement.</p>

        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>

          {errors.global && (
            <div style={{ background: "#FDECEC", border: "1px solid #F5C6C6", color: "#C0392B", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>
              {errors.global}
            </div>
          )}

          {/* PHOTOS */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Photos du logement (jusqu'à 6)</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid #E0D9D0" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => retirerPhoto(i)}
                    style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <XIcon />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <label style={{ aspectRatio: "1", borderRadius: 10, border: "2px dashed #E0D9D0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#FAFAF8", gap: 4 }}>
                  <UploadIcon />
                  <span style={{ fontSize: 11, color: "#888" }}>Ajouter</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => ajouterPhotos(e.target.files)} style={{ display: "none" }} />
                </label>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>Une annonce avec photos reçoit beaucoup plus de demandes.</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Titre de l'annonce</label>
            <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Studio meublé moderne à Bastos" style={inputStyle} />
            {errors.titre && <div style={errStyle}>{errors.titre}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Décris le logement, son environnement, ses équipements..." style={{ ...inputStyle, resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Type de logement</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                <option value="chambre">Chambre</option>
                <option value="studio">Studio</option>
                <option value="appartement">Appartement</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Meublé ?</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: true, l: "Oui" }, { v: false, l: "Non" }].map((opt) => (
                  <button key={opt.l} type="button" onClick={() => setMeuble(opt.v)}
                    style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${meuble === opt.v ? "#1A3C5E" : "#E0D9D0"}`, background: meuble === opt.v ? "#EBF3FB" : "#FAFAF8", color: meuble === opt.v ? "#1A3C5E" : "#888", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Prix mensuel (XAF)</label>
              <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="85000" style={inputStyle} />
              {errors.prix && <div style={errStyle}>{errors.prix}</div>}
            </div>
            <div>
              <label style={labelStyle}>Caution (XAF)</label>
              <input type="number" value={caution} onChange={(e) => setCaution(e.target.value)} placeholder="170000" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Surface (m²)</label>
              <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="32" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Étage</label>
              <input type="number" value={etage} onChange={(e) => setEtage(e.target.value)} placeholder="3" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Quartier</label>
            <input value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Ex : Bastos" style={inputStyle} />
            {errors.quartier && <div style={errStyle}>{errors.quartier}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Adresse précise (optionnel)</label>
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Ex : Rue Bastos, près de l'ambassade" style={inputStyle} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 12, background: loading ? "#aaa" : "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? (etapeEnvoi || "Publication en cours...") : "Publier l'annonce"}
          </button>
        </div>
      </div>
    </div>
  );
}