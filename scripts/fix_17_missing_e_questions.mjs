import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const eUpdates = [
  {
    id: 'preg-paes-his-24reg-28',
    eText: 'La falta de vínculo entre diferentes sectores de la población fue la causa de la crisis social.'
  },
  {
    id: 'preg-paes-his-25reg-46',
    eText: 'la conformación de la Organización de las Naciones Unidas, creada con el propósito de ser un espacio de diálogo y colaboración entre los Estados.'
  },
  {
    id: 'preg-paes-fis-25inv-08',
    enun: '**8. Una persona de 60 kg desciende en ascensor, el cual frena con una aceleración de magnitud 0,25 m/s². Considerando que en ese momento la persona está sobre una pesa y que la magnitud de la aceleración de gravedad es igual a 10 m/s², ¿cuál es la medida que indicará la pesa mientras frena el ascensor?**',
    alts: [
      { letra: 'A', texto: '15 N', es_correcta: false },
      { letra: 'B', texto: '60 N', es_correcta: false },
      { letra: 'C', texto: '150 N', es_correcta: false },
      { letra: 'D', texto: '585 N', es_correcta: false },
      { letra: 'E', texto: '615 N', es_correcta: true }
    ]
  },
  {
    id: 'preg-paes-fis-25inv-48',
    eText: 'C6H12O6'
  },
  {
    id: 'preg-paes-fis-25inv-50',
    eText: '45 mL'
  },
  {
    id: 'preg-paes-fis-25inv-52',
    eText: '720 g de 5, se obtiene una solución que no puede disolver más soluto.'
  },
  {
    id: 'preg-paes-fis-25inv-73',
    eText: '13,0 °C'
  },
  {
    id: 'preg-paes-fis-25reg-66',
    eText: 'las manos del joven ejercen sobre la cuerda en el extremo R.'
  },
  {
    id: 'preg-paes-qui-23reg-17',
    eText: 'la solución Y es más concentrada que la solución X.'
  },
  {
    id: 'preg-paes-qui-23reg-56',
    eText: 'Q'
  },
  {
    id: 'preg-paes-qui-23reg-63',
    eText: 'Amida'
  },
  {
    id: 'preg-paes-qui-23reg-72',
    eText: '58 %'
  },
  {
    id: 'preg-paes-qui-24inv-75',
    eText: 'la concentración final de la solución de NaOH, es 0,2 mol/L.'
  },
  {
    id: 'preg-paes-qui-25inv-12',
    enun: '**12. El análisis elemental de un compuesto orgánico indica solo la presencia de carbono, hidrógeno y oxígeno con una fórmula mínima CH2O. Si la masa molar del compuesto es aproximadamente 180 g/mol, entonces su fórmula molecular es**',
    alts: [
      { letra: 'A', texto: 'C2H4O2', es_correcta: false },
      { letra: 'B', texto: 'C3H6O3', es_correcta: false },
      { letra: 'C', texto: 'C4H8O4', es_correcta: false },
      { letra: 'D', texto: 'C5H10O5', es_correcta: false },
      { letra: 'E', texto: 'C6H12O6', es_correcta: true }
    ]
  },
  {
    id: 'preg-paes-qui-25inv-14',
    eText: '45 mL'
  },
  {
    id: 'preg-paes-qui-25inv-16',
    eText: '720 g de 5, se obtiene una solución que no puede disolver más soluto.'
  },
  {
    id: 'preg-paes-qui-25inv-26',
    eText: '615 N'
  }
];

async function applyEUpdates() {
  console.log(`Aplicando reparación a 17 preguntas con clave E...`);

  const sqlLines = [
    '--',
    '-- Migración 070: Restauración oficial de la alternativa E y enunciados truncados',
    '-- para las 17 preguntas PAES cuya clave oficial es E',
    '--',
    'BEGIN;'
  ];

  for (const item of eUpdates) {
    let finalAlts = [];
    let finalEnun = null;

    if (item.alts) {
      finalAlts = item.alts;
      finalEnun = item.enun;
    } else {
      // Obtener alts existentes
      const { data: q } = await supabase.from('preguntas').select('enunciado, alternativas').eq('id', item.id).single();
      const existingAlts = q.alternativas || [];
      // Marcar A-D como es_correcta: false
      const updatedExisting = existingAlts.map(a => ({
        letra: a.letra,
        texto: a.texto,
        es_correcta: false
      }));
      // Agregar E
      finalAlts = [
        ...updatedExisting.filter(a => a.letra !== 'E'),
        { letra: 'E', texto: item.eText, es_correcta: true }
      ];
      finalEnun = q.enunciado;
    }

    const { error } = await supabase
      .from('preguntas')
      .update({
        alternativas: finalAlts,
        ...(finalEnun ? { enunciado: finalEnun } : {}),
        respuesta_correcta: 'E'
      })
      .eq('id', item.id);

    if (error) {
      console.error(`Error actualizando ${item.id}:`, error);
    } else {
      console.log(`✓ Actualizada ${item.id} -> ${finalAlts.length} alternativas (Clave E)`);
    }

    const jsonAlts = JSON.stringify(finalAlts).replace(/'/g, "''");
    const enunSql = finalEnun ? `, enunciado = '${finalEnun.replace(/'/g, "''")}'` : '';
    sqlLines.push(`
UPDATE public.preguntas
SET alternativas = '${jsonAlts}'::jsonb,
    respuesta_correcta = 'E'${enunSql}
WHERE id = '${item.id}';`);
  }

  sqlLines.push('\nCOMMIT;\n');
  fs.writeFileSync('supabase/migrations/070_fix_17_missing_e_questions.sql', sqlLines.join('\n'), 'utf8');
  console.log('✓ Migración guardada en supabase/migrations/070_fix_17_missing_e_questions.sql');
}

applyEUpdates();
