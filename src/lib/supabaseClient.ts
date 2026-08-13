import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution (supports Vite VITE_ and Next.js NEXT_PUBLIC_)
const supabaseUrl =
  (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  (import.meta.env && import.meta.env.NEXT_PUBLIC_SUPABASE_URL) ||
  'http://127.0.0.1:54321';

const supabaseAnonKey =
  (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  (import.meta.env && import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseConfig() {
  const isCloud = supabaseUrl.includes('.supabase.co');
  const projectRef = isCloud ? supabaseUrl.replace('https://', '').split('.')[0] : 'local-docker';
  return {
    url: supabaseUrl,
    isCloud,
    projectRef,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey)
  };
}

export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const { count, error } = await supabase
      .from('asignaturas')
      .select('*', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return { ok: false, message: error.message, latencyMs };
    }
    return { ok: true, message: `Conexión activa a PostgreSQL (${count ?? 4} asignaturas registradas)`, latencyMs };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, message: err?.message || 'Error de red al conectar', latencyMs };
  }
}

