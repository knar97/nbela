"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  deconnexion: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  deconnexion: async () => {},
});

// Ce composant enveloppe toute l'app. Il vérifie une seule fois si une
// session existe déjà (utilisateur déjà connecté avant), puis reste à
// l'écoute de tout changement (connexion, déconnexion, dans n'importe
// quel onglet/page) pour garder "user" toujours à jour.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vérifie s'il existe déjà une session au chargement de l'app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Écoute tout changement futur (connexion, déconnexion, expiration)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Nettoyage : arrête l'écoute quand le composant est retiré
    return () => subscription.unsubscribe();
  }, []);

  async function deconnexion() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook utilisé dans n'importe quelle page pour savoir qui est connecté.
// Exemple d'usage : const { user, loading, deconnexion } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}