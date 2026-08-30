/**
 * Actualiza precio_clp de la PAES M1 2023 a $29.990 CLP (precio piloto de lanzamiento)
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}
loadEnv();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Precios por instrumento (CLP)
const PRECIOS_CATALOGO = [
  // SIMCE - incluidos en plan suscripción (precio 0 = incluido en cuota)
  { id: 'eval-simce-mat-6b-ensayo3',   precio_clp: 0,      desc: 'Incluida en planes de suscripción Pro e Institucional.' },
  { id: 'eval-simce-mat-2m-ensayo3',   precio_clp: 0,      desc: 'Incluida en planes de suscripción Pro e Institucional.' },
  { id: 'eval-simce-lect-2m-ensayo6',  precio_clp: 0,      desc: 'Incluida en planes de suscripción Pro e Institucional.' },
  // Diagnósticas - incluidas en planes
  { id: 'diag_ciudadana_3m_2026',      precio_clp: 0,      desc: 'Prueba diagnóstica alineada a OAs MINEDUC. Incluida en planes de suscripción.' },
  // PAES - pago o plan Institucional
  { id: 'eval-paes-mat1-2023-f113',    precio_clp: 29990,  desc: 'Prueba oficial DEMRE PAES M1 2023 (65 ítems, clavijero DEMRE, pauta docente completa). Disponible para establecimientos con plan Institucional o como compra directa.' },
];

async function main() {
  console.log('💰 Actualizando precios del catálogo de evaluaciones...\n');
  for (const item of PRECIOS_CATALOGO) {
    const { error } = await supabase
      .from('evaluaciones')
      .update({ precio_clp: item.precio_clp, descripcion_catalogo: item.desc, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      console.log(`  ❌ ${item.id}: ${error.message}`);
    } else {
      const label = item.precio_clp === 0 ? '$0 (incluida en plan)' : `$${item.precio_clp.toLocaleString('es-CL')} CLP`;
      console.log(`  ✅ ${item.id}: ${label}`);
    }
  }

  // Verificar resultado final
  const { data: evals } = await supabase
    .from('evaluaciones')
    .select('id, titulo, nivel, precio_clp, es_catalogo')
    .eq('es_catalogo', true)
    .order('asignatura_id');

  console.log('\n=== CATÁLOGO ACTUALIZADO ===');
  for (const e of (evals || [])) {
    const precio = e.precio_clp === 0 ? 'INCLUIDA EN PLAN' : `$${e.precio_clp.toLocaleString('es-CL')} CLP`;
    console.log(`  • ${e.titulo.substring(0, 55).padEnd(55)} | ${precio}`);
  }
}

main();
