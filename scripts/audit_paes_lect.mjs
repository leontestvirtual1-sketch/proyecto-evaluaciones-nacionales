import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditPaesLect() {
  const { data: evalData } = await supabase
    .from('evaluaciones')
    .select('*')
    .like('id', '%paes-lect%');

  console.log('Evaluaciones PAES Lect:', evalData);

  const { data: pregs } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta, fuente')
    .like('id', 'preg-paes-lec-26-%')
    .order('id', { ascending: true });

  console.log(`Total preguntas PAES Lect: ${pregs ? pregs.length : 0}`);

  if (pregs) {
    const conForma = pregs.filter(p => {
      const enunHas = /FORMA \d+/i.test(p.enunciado || '');
      const altHas = (p.alternativas || []).some(a => /FORMA \d+/i.test(a.texto || ''));
      return enunHas || altHas;
    });

    console.log(`Preguntas con "FORMA \\d+": ${conForma.length}`);
    conForma.forEach(p => console.log(`  - ${p.id}`));

    const conAltLargas = pregs.filter(p => {
      return (p.alternativas || []).some(a => (a.texto || '').length > 250);
    });

    console.log(`Preguntas con alternativas > 250 chars: ${conAltLargas.length}`);
    conAltLargas.forEach(p => {
      console.log(`  - ${p.id}:`);
      p.alternativas.forEach(a => {
        if (a.texto && a.texto.length > 250) {
          console.log(`    [${a.letra}] (${a.texto.length} chars): ${a.texto.substring(0, 100)}...`);
        }
      });
    });
  }
}

auditPaesLect();
