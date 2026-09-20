import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Verificando estado post-migración 054 en Supabase...');

  // 1. Cabecera de evaluación
  const { data: evalRow } = await supabase
    .from('evaluaciones')
    .select('id, titulo, total_preguntas')
    .eq('id', 'eval-paes-lect-2026-f103')
    .single();

  console.log('Evaluación:', evalRow);

  // 2. Preguntas
  const { data: pregs } = await supabase
    .from('preguntas')
    .select('id, alternativas, respuesta_correcta, puntaje, fuente')
    .like('id', 'preg-paes-lec-26-%')
    .order('id', { ascending: true });

  console.log(`Total preguntas recuperadas: ${pregs.length}`);

  // Verificar alternativas > 250
  const largos = pregs.filter(p => p.alternativas.some(a => a.texto.length > 250));
  console.log(`Preguntas con alternativas > 250 chars: ${largos.length}`);

  // Verificar FORMA 101 en alternativas
  const conPie = pregs.filter(p => p.alternativas.some(a => a.texto.includes('FORMA 101')));
  console.log(`Preguntas con "FORMA 101" en alternativas: ${conPie.length}`);

  // Verificar que cada pregunta tiene exactamente 1 alternativa correcta
  const malCorrecta = pregs.filter(p => {
    const corrCount = p.alternativas.filter(a => a.es_correcta).length;
    return corrCount !== 1;
  });
  console.log(`Preguntas con alternativas es_correcta != 1: ${malCorrecta.length}`);

  // Distribución de claves
  const dist = {};
  for (const p of pregs) {
    dist[p.respuesta_correcta] = (dist[p.respuesta_correcta] || 0) + 1;
  }
  console.log('Distribución de claves en DB:', dist);
}

verify();
