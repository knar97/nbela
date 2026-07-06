"use client";
import { useState } from "react";

type Mode = "connexion" | "inscription";
type Role = "locataire" | "bailleur";

// SVG icons inline — gris moderne
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const MailIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.59 4.5 2 2 0 0 1 3.56 2.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z"/></svg>;
const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const ShieldIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("connexion");
  const [role, setRole] = useState<Role>("locataire");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "inscription") {
      if (!nom.trim()) e.nom = "Nom requis";
      if (!prenom.trim()) e.prenom = "Prénom requis";
      if (!telephone.trim()) e.telephone = "Téléphone requis";
      if (password !== confirm) e.confirm = "Les mots de passe ne correspondent pas";
    }
    if (!email.trim() || !email.includes("@")) e.email = "Email invalide";
    if (password.length < 6) e.password = "Minimum 6 caractères";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10,
    border: `1.5px solid ${hasError ? "#E53935" : "#E0D9D0"}`,
    fontSize: 15, fontFamily: "inherit", background: "#FAFAF8",
    color: "#1A1A2E", outline: "none", boxSizing: "border-box",
  });
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6, display: "block" };
  const errStyle: React.CSSProperties = { fontSize: 12, color: "#E53935", marginTop: 4 };
  const iconWrap: React.CSSProperties = { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "56px 40px", textAlign: "center", maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EAF5EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><ShieldIcon /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A3C5E", margin: "0 0 12px" }}>{mode === "inscription" ? "Compte créé !" : "Connexion réussie !"}</h2>
          <p style={{ color: "#777", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>{mode === "inscription" ? `Bienvenue sur Nbela en tant que ${role}.` : "Vous êtes maintenant connecté."}</p>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            <HomeIcon /> Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: "'Sora','Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #E8E4DE", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 60 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1A3C5E,#E87722)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><HomeIcon /></div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A3C5E" }}>Nb<span style={{ color: "#E87722" }}>ela</span></span>
          </a>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.08)", overflow: "hidden" }}>

            {/* Tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {(["connexion", "inscription"] as Mode[]).map((m) => (
                <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                  style={{ padding: "18px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, background: mode === m ? "#fff" : "#F7F5F2", color: mode === m ? "#1A3C5E" : "#999", borderBottom: mode === m ? "3px solid #E87722" : "3px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {m === "connexion" ? <><LockIcon /> Connexion</> : <><UserIcon /> Inscription</>}
                </button>
              ))}
            </div>

            <div style={{ padding: "32px 32px 36px" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", margin: "0 0 6px" }}>{mode === "connexion" ? "Bon retour !" : "Créer un compte"}</h1>
              <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px" }}>{mode === "connexion" ? "Connectez-vous à votre espace Nbela." : "Rejoignez des milliers d'utilisateurs à Yaoundé."}</p>

              {/* Rôle */}
              {mode === "inscription" && (
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Je suis un…</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {([
                      { key: "locataire" as Role, icon: <SearchIcon />, label: "Locataire", desc: "Je cherche un logement" },
                      { key: "bailleur" as Role, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={role === "bailleur" ? "#1A3C5E" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Bailleur", desc: "Je propose un logement" },
                    ]).map((r) => (
                      <button key={r.key} onClick={() => setRole(r.key)}
                        style={{ padding: "14px 12px", borderRadius: 12, border: `2px solid ${role === r.key ? "#1A3C5E" : "#E0D9D0"}`, background: role === r.key ? "#EBF3FB" : "#FAFAF8", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                        <div style={{ marginBottom: 4 }}>{r.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A2E" }}>{r.label}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Nom / Prénom */}
              {mode === "inscription" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Nom</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrap}><UserIcon /></span>
                      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Mbida" style={inputStyle(!!errors.nom)} />
                    </div>
                    {errors.nom && <div style={errStyle}>{errors.nom}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Prénom</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrap}><UserIcon /></span>
                      <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" style={inputStyle(!!errors.prenom)} />
                    </div>
                    {errors.prenom && <div style={errStyle}>{errors.prenom}</div>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Adresse email</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><MailIcon /></span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@gmail.com" style={inputStyle(!!errors.email)} />
                </div>
                {errors.email && <div style={errStyle}>{errors.email}</div>}
              </div>

              {/* Téléphone */}
              {mode === "inscription" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Téléphone (MTN / Orange)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ padding: "11px 10px", borderRadius: 10, border: "1.5px solid #E0D9D0", background: "#FAFAF8", fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      <PhoneIcon /> +237
                    </div>
                    <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="6XX XXX XXX" style={{ ...inputStyle(!!errors.telephone), flex: 1, paddingLeft: 14 }} />
                  </div>
                  {errors.telephone && <div style={errStyle}>{errors.telephone}</div>}
                </div>
              )}

              {/* Mot de passe */}
              <div style={{ marginBottom: mode === "inscription" ? 16 : 8 }}>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <span style={iconWrap}><LockIcon /></span>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 caractères" style={{ ...inputStyle(!!errors.password), paddingRight: 44 }} />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <div style={errStyle}>{errors.password}</div>}
              </div>

              {/* Confirmer */}
              {mode === "inscription" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Confirmer le mot de passe</label>
                  <div style={{ position: "relative" }}>
                    <span style={iconWrap}><LockIcon /></span>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Répétez votre mot de passe" style={inputStyle(!!errors.confirm)} />
                  </div>
                  {errors.confirm && <div style={errStyle}>{errors.confirm}</div>}
                </div>
              )}

              {mode === "connexion" && (
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  <a href="#" style={{ fontSize: 13, color: "#2E75B6", textDecoration: "none", fontWeight: 600 }}>Mot de passe oublié ?</a>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 12, background: loading ? "#aaa" : "linear-gradient(135deg,#1A3C5E,#2E75B6)", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? "Chargement…" : <>{mode === "connexion" ? "Se connecter" : "Créer mon compte"} <ArrowIcon /></>}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#E0D9D0" }} />
                <span style={{ fontSize: 13, color: "#aaa" }}>ou continuer avec</span>
                <div style={{ flex: 1, height: 1, background: "#E0D9D0" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ label: "Google", bg: "#fff", color: "#444", border: "#E0D9D0" }, { label: "Facebook", bg: "#1877F2", color: "#fff", border: "#1877F2" }].map((s) => (
                  <button key={s.label} style={{ padding: "11px", borderRadius: 10, border: `1.5px solid ${s.border}`, background: s.bg, color: s.color, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{s.label}</button>
                ))}
              </div>

              <p style={{ textAlign: "center", fontSize: 14, color: "#888", marginTop: 24, marginBottom: 0 }}>
                {mode === "connexion" ? "Pas encore de compte ? " : "Déjà inscrit ? "}
                <button onClick={() => { setMode(mode === "connexion" ? "inscription" : "connexion"); setErrors({}); }} style={{ background: "none", border: "none", color: "#E87722", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  {mode === "connexion" ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}