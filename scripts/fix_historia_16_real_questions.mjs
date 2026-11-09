import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const updates = [
  // ==========================================
  // 1. his-24inv (P7 to P12)
  // ==========================================
  {
    id: 'preg-paes-his-24inv-07',
    enunciado: '**7. La alternancia en el poder es uno de los rasgos que evidencia el carácter democrático de un sistema político. Al respecto, ¿qué se busca resguardar mediante el uso de este principio democrático?**',
    alternativas: [
      { letra: 'A', texto: 'Imposibilitar el abuso de las autoridades.', es_correcta: false },
      { letra: 'B', texto: 'Evitar la disidencia política en la sociedad.', es_correcta: false },
      { letra: 'C', texto: 'Impedir el desarrollo de actos de corrupción.', es_correcta: false },
      { letra: 'D', texto: 'Prevenir la concentración del mando político.', es_correcta: true }
    ],
    respuesta_correcta: 'D'
  },
  {
    id: 'preg-paes-his-24inv-08',
    enunciado: '**8. La democracia es una forma de gobierno en la que se enfatiza el respeto del principio de mayoría. Considerando la realidad chilena, ¿en cuál de las siguientes situaciones se aplica este principio?**',
    alternativas: [
      { letra: 'A', texto: 'En la aplicación de justicia en tribunales.', es_correcta: false },
      { letra: 'B', texto: 'En la conformación de los partidos políticos.', es_correcta: false },
      { letra: 'C', texto: 'En el desarrollo de las elecciones periódicas.', es_correcta: true },
      { letra: 'D', texto: 'En la designación de los gabinetes ministeriales.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-24inv-09',
    enunciado: '**9. En Chile, el derecho a voto permite elegir a diferentes representantes y autoridades. De esta manera, el año 2021 se eligieron mediante votación popular, a los gobernadores regionales, quienes reemplazarán en parte de sus funciones a los intendentes regionales. ¿Cuál es la importancia de esta elección en el contexto de democratización de la sociedad chilena?**',
    alternativas: [
      { letra: 'A', texto: 'Aumenta la soberanía del Estado a escala regional.', es_correcta: false },
      { letra: 'B', texto: 'Incentiva el avance hacia un modelo de gobierno federal.', es_correcta: false },
      { letra: 'C', texto: 'Entrega mayor poder de gestión a las comunidades regionales.', es_correcta: true },
      { letra: 'D', texto: 'Erradica los conflictos de intereses entre el Poder Ejecutivo y las autoridades regionales.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-24inv-10',
    enunciado: '**10. En Chile, la separación de los poderes del Estado se encuentra consagrada en la Constitución. En el contexto de un sistema democrático, ¿cuál es la importancia de establecer la división de los poderes del Estado?**',
    alternativas: [
      { letra: 'A', texto: 'Evita el predominio de un poder estatal por sobre otro.', es_correcta: true },
      { letra: 'B', texto: 'Impide los actos de corrupción en los organismos públicos.', es_correcta: false },
      { letra: 'C', texto: 'Define la estructura jerárquica de las instituciones estatales.', es_correcta: false },
      { letra: 'D', texto: 'Establece los procedimientos para la alternancia en el poder.', es_correcta: false }
    ],
    respuesta_correcta: 'A'
  },
  {
    id: 'preg-paes-his-24inv-11',
    enunciado: '**11. Lee el siguiente texto sobre el Estado de derecho:**\n\n> «El estado de derecho puede definirse como un principio de gobernanza en el que todas las personas, instituciones y entidades, públicas y privadas, incluido el propio Estado, están sometidas a leyes que se promulgan públicamente, se hacen cumplir por igual y se aplican con independencia».\n\n*Organización de las Naciones Unidas. (s.f.). ¿Qué es el Estado de Derecho? https://www.un.org/ruleoflaw/es/what-is-the-rule-of-law/*\n\n**El texto corresponde a la definición que la Organización de las Naciones Unidas (ONU) hace del Estado de derecho. De acuerdo con esta definición, ¿en cuál de las siguientes situaciones opera el Estado de derecho en un Estado soberano?**',
    alternativas: [
      { letra: 'A', texto: 'Cuando un poder del Estado puede intervenir en las decisiones que adopta otro poder.', es_correcta: false },
      { letra: 'B', texto: 'Cuando los proyectos de ley son aprobados mediante la votación directa de los ciudadanos.', es_correcta: false },
      { letra: 'C', texto: 'Cuando la actuación de las autoridades públicas está limitada por las normas jurídicas.', es_correcta: true },
      { letra: 'D', texto: 'Cuando el Estado permite el acceso a la información privada de quienes trabajan en la administración pública.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-24inv-12',
    enunciado: '**12. Los medios de comunicación actúan como intérpretes de aquellos hechos que estiman interesantes y que pudieran suscitar la atención de la población. Considerando lo anterior, ¿por qué el acceso a una información veraz colabora con el desarrollo de una sociedad democrática?**',
    alternativas: [
      { letra: 'A', texto: 'Porque asegura una mayor participación electoral.', es_correcta: false },
      { letra: 'B', texto: 'Porque otorga representatividad a las autoridades.', es_correcta: false },
      { letra: 'C', texto: 'Porque garantiza los acuerdos entre actores políticos.', es_correcta: false },
      { letra: 'D', texto: 'Porque fortalece el diálogo pluralista de la ciudadanía.', es_correcta: true }
    ],
    respuesta_correcta: 'D'
  },

  // ==========================================
  // 2. his-24reg (P7 to P12)
  // ==========================================
  {
    id: 'preg-paes-his-24reg-07',
    enunciado: '**7. La calidad de un sistema democrático depende del funcionamiento de las instituciones, del correcto equilibrio entre los poderes del Estado y de la existencia de mecanismos que favorezcan la participación de la ciudadanía. En este sentido, ¿cuál de las siguientes medidas contribuye a robustecer la democracia?**',
    alternativas: [
      { letra: 'A', texto: 'Mejorar la capacidad del veto legislativo del Presidente de la República.', es_correcta: false },
      { letra: 'B', texto: 'Establecer límites a la representatividad política de los gobiernos regionales.', es_correcta: false },
      { letra: 'C', texto: 'Favorecer la continuidad de un presidente a través de reelecciones sucesivas.', es_correcta: false },
      { letra: 'D', texto: 'Promover la paridad de género en las elecciones de cargos de representación.', es_correcta: true }
    ],
    respuesta_correcta: 'D'
  },
  {
    id: 'preg-paes-his-24reg-08',
    enunciado: '**8. Lee el siguiente texto referido a la importancia de los medios de comunicación en un contexto de vida democrática:**\n\n> «Además del control de informaciones, especialmente en su operación noticiosa, a través de los componentes de entretenimiento (pero también de las noticias) los medios pueden ejercer influencias más amplias de orden cultural e ideológico, delimitando los marcos interpretativos o universos del discurso socialmente aceptable, legitimando ciertos intereses, estados de cosas».\n\n*Sánchez, E. (2005). Medios de comunicación y democracia. Norma.*\n\n**De acuerdo con lo señalado en la cita, ¿qué rol cumplen los medios de comunicación en la vida democrática?**',
    alternativas: [
      { letra: 'A', texto: 'Canalizan los problemas que afectan a la ciudadanía.', es_correcta: false },
      { letra: 'B', texto: 'Orientan la opinión de la ciudadanía en materia política.', es_correcta: true },
      { letra: 'C', texto: 'Resguardan la objetividad en el ejercicio del periodismo.', es_correcta: false },
      { letra: 'D', texto: 'Expresan el pluralismo de visiones existente en la sociedad.', es_correcta: false }
    ],
    respuesta_correcta: 'B'
  },
  {
    id: 'preg-paes-his-24reg-09',
    enunciado: '**9. El funcionamiento de un sistema democrático depende del comportamiento de diversos factores que pueden mejorar o empeorar la calidad de la democracia. Respecto del caso chileno, ¿cuál es una situación que debe ser superada para mejorar la calidad de la democracia?**',
    alternativas: [
      { letra: 'A', texto: 'La escasa diversidad de partidos políticos existentes.', es_correcta: false },
      { letra: 'B', texto: 'Las restricciones impuestas a la participación electoral.', es_correcta: false },
      { letra: 'C', texto: 'La disparidad de oportunidades para el desarrollo regional.', es_correcta: true },
      { letra: 'D', texto: 'El reducido acceso a la información de las instituciones públicas.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-24reg-10',
    enunciado: '**10. En la Constitución Política de 1980 se establecieron las condiciones del sistema político y las relaciones entre el Estado y las personas. Igualmente, se definieron ciertas situaciones en las que la aplicación de lo estipulado por esta carta fundamental implica la suspensión de derechos y garantías establecidas en ella. ¿En cuál de las siguientes circunstancias se produce la ocurrencia de esta eventualidad?**',
    alternativas: [
      { letra: 'A', texto: 'En un llamado a plebiscito por parte de la ciudadanía.', es_correcta: false },
      { letra: 'B', texto: 'En la ocurrencia de una catástrofe que altera el orden social.', es_correcta: true },
      { letra: 'C', texto: 'En la detección de prácticas de cohecho en un proceso eleccionario.', es_correcta: false },
      { letra: 'D', texto: 'En la identificación de casos de corrupción por parte de las autoridades.', es_correcta: false }
    ],
    respuesta_correcta: 'B'
  },
  {
    id: 'preg-paes-his-24reg-11',
    enunciado: '**11. En Chile, la realización de una nueva votación entre aquellos candidatos que obtuvieron las dos primeras mayorías relativas en una elección presidencial es un mecanismo establecido por ley. ¿Cuál es la importancia de este mecanismo para el buen funcionamiento del sistema democrático?**',
    alternativas: [
      { letra: 'A', texto: 'Permite asegurar el pluripartidismo político.', es_correcta: false },
      { letra: 'B', texto: 'Impide la polarización política en la sociedad.', es_correcta: false },
      { letra: 'C', texto: 'Legitima la representatividad del gobierno entrante.', es_correcta: true },
      { letra: 'D', texto: 'Garantiza la transparencia en la institucionalidad pública.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-24reg-12',
    enunciado: '**12. En Chile, de acuerdo con la legislación vigente, las empresas y organismos del Estado no pueden hacer aportes directos a las campañas electorales. ¿Qué situación se pretende evitar con esta disposición?**',
    alternativas: [
      { letra: 'A', texto: 'La generación de ventajas para un sector político específico.', es_correcta: true },
      { letra: 'B', texto: 'El surgimiento de nuevos partidos políticos afines al gobierno.', es_correcta: false },
      { letra: 'C', texto: 'El deterioro de la transparencia en el acceso a la información pública.', es_correcta: false },
      { letra: 'D', texto: 'La apropiación indebida de recursos públicos por parte de empresas privadas.', es_correcta: false }
    ],
    respuesta_correcta: 'A'
  },

  // ==========================================
  // 3. his-25inv (P9 to P12)
  // ==========================================
  {
    id: 'preg-paes-his-25inv-09',
    enunciado: '**9. Durante gran parte de la historia republicana de Chile, quien ocupa el cargo de Presidente de la República ha realizado la ceremonia de cuenta anual o mensaje presidencial ante el Congreso Nacional y con la presencia de diversas autoridades. En el contexto del funcionamiento del sistema democrático chileno, ¿qué propósito tiene la realización de esta ceremonia?**',
    alternativas: [
      { letra: 'A', texto: 'Permitir al Poder Legislativo interpelar al Poder Ejecutivo.', es_correcta: false },
      { letra: 'B', texto: 'Exigir el apoyo de ambas cámaras al programa de gobierno.', es_correcta: false },
      { letra: 'C', texto: 'Anunciar a la ciudadanía las nuevas leyes que serán aprobadas.', es_correcta: false },
      { letra: 'D', texto: 'Fortalecer el conocimiento ciudadano de la gestión del gobierno.', es_correcta: true }
    ],
    respuesta_correcta: 'D'
  },
  {
    id: 'preg-paes-his-25inv-10',
    enunciado: '**10. El Servicio Electoral (SERVEL) es un organismo estatal chileno que vela por el correcto funcionamiento de las elecciones y el cumplimiento de las normativas relacionadas con la actividad política. Considerando lo anterior, ¿cuál de las siguientes funciones ejerce el SERVEL?**',
    alternativas: [
      { letra: 'A', texto: 'El desarrollo de encuestas de opinión durante el periodo de campaña.', es_correcta: false },
      { letra: 'B', texto: 'La evaluación del cumplimiento de las metas programáticas propuestas.', es_correcta: false },
      { letra: 'C', texto: 'La fiscalización del financiamiento de las campañas de las candidaturas.', es_correcta: true },
      { letra: 'D', texto: 'El diseño de los estatutos que regulan el funcionamiento de los partidos.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-25inv-11',
    enunciado: '**11. En un sistema político, la oposición está compuesta por grupos de personas o partidos políticos que defienden ideas y propósitos distintos a los que poseen quienes están a cargo del Poder Ejecutivo. En el contexto de una sociedad democrática, ¿por qué es importante que exista oposición?**',
    alternativas: [
      { letra: 'A', texto: 'Porque asegura el correcto funcionamiento de las alianzas.', es_correcta: false },
      { letra: 'B', texto: 'Porque garantiza la periodicidad de los procesos electorales.', es_correcta: false },
      { letra: 'C', texto: 'Porque contribuye a la supervisión de la gestión del gobierno.', es_correcta: true },
      { letra: 'D', texto: 'Porque funciona con independencia de los poderes económicos.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-25inv-12',
    enunciado: '**12. Lee la siguiente interpretación sobre la legitimidad del poder en democracia:**\n\n> «Democracia quiere decir que el poder es legítimo solo si es investido desde abajo, solo si es emanación de la voluntad popular, es decir, concretamente, en la medida en que sea libremente consentido […] Hablamos de democracia para aludir, a grandes rasgos, a una sociedad libre, no oprimida por un poder político discrecional e incontrolado».\n\n*Sartori, G. (2012). ¿Qué es la Democracia?*\n\n**¿En qué elemento propio de los sistemas democráticos se basa lo planteado en el texto?**',
    alternativas: [
      { letra: 'A', texto: 'En el respeto de la igualdad ante la ley.', es_correcta: false },
      { letra: 'B', texto: 'En el desarrollo de elecciones periódicas.', es_correcta: true },
      { letra: 'C', texto: 'En la existencia de un sistema multipartidista.', es_correcta: false },
      { letra: 'D', texto: 'En la probidad en el ejercicio de la función pública.', es_correcta: false }
    ],
    respuesta_correcta: 'B'
  }
];

async function applyFix() {
  console.log(`Aplicando corrección a ${updates.length} preguntas en Supabase...`);
  
  let successCount = 0;
  for (const q of updates) {
    const { error } = await supabase
      .from('preguntas')
      .update({
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        respuesta_correcta: q.respuesta_correcta
      })
      .eq('id', q.id);

    if (error) {
      console.error(`Error actualizando ${q.id}:`, error);
    } else {
      console.log(`✓ Actualizada ${q.id} (Clave: ${q.respuesta_correcta})`);
      successCount++;
    }
  }

  console.log(`\nCompletado: ${successCount} / ${updates.length} preguntas reparadas.`);

  // Generar migración SQL
  const sqlLines = [
    '--',
    '-- Migración 068: Reparación oficial de 16 preguntas de Historia 2024 Invierno, 2024 Regular y 2025 Invierno',
    '-- Extraídas fielmente desde los cuadernillos oficiales DEMRE (sin instrucciones ni concatenaciones de folleto)',
    '--',
    'BEGIN;'
  ];

  for (const q of updates) {
    const jsonAlts = JSON.stringify(q.alternativas).replace(/'/g, "''");
    const escapedEnun = q.enunciado.replace(/'/g, "''");
    sqlLines.push(`
UPDATE public.preguntas
SET enunciado = '${escapedEnun}',
    alternativas = '${jsonAlts}'::jsonb,
    respuesta_correcta = '${q.respuesta_correcta}'
WHERE id = '${q.id}';`);
  }

  sqlLines.push('\nCOMMIT;\n');

  fs.writeFileSync('supabase/migrations/068_fix_historia_16_real_questions.sql', sqlLines.join('\n'), 'utf8');
  console.log('✓ Archivo de migración generado: supabase/migrations/068_fix_historia_16_real_questions.sql');
}

applyFix();

