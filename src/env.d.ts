/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOMBRE_ESTABLECIMIENTO?: string;
  readonly VITE_ESTABLECIMIENTO_RBD?: string;
  readonly VITE_ESTABLECIMIENTO_COMUNA?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
