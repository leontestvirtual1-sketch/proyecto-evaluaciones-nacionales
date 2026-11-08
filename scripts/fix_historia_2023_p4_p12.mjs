import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const questionsToFix = [
  {
    id: 'preg-paes-his-23reg-04',
    enunciado: '**4. Actualmente, en Chile existen distintas instancias de participación ciudadana que están reguladas por ley. ¿Cuál de las siguientes opciones señala una de estas instancias?**',
    alternativas: [
      { letra: 'A', texto: 'La participación en la junta de vecinos del barrio.', es_correcta: true },
      { letra: 'B', texto: 'La participación en encuestas de opinión política.', es_correcta: false },
      { letra: 'C', texto: 'La participación en la aprobación de proyectos de ley.', es_correcta: false },
      { letra: 'D', texto: 'La participación en debates políticos en redes sociales.', es_correcta: false }
    ],
    respuesta_correcta: 'A'
  },
  {
    id: 'preg-paes-his-23reg-05',
    enunciado: '**5. Lee el siguiente texto sobre el patrimonio en Chile:**\n\n> «El vínculo entre diversidad y patrimonio trae consigo la necesidad de la descentralización y la importancia de establecer sistemas de participación ciudadana cuyos resultados sean vinculantes y consideren en su diseño la pluralidad de miradas, por un lado, y el establecimiento de regulaciones legales que permitan a las comunidades ejercer derechos sobre su patrimonio cultural y natural frente a las variadas presiones económicas y políticas que enfrentan, por otro».\n\n*Consejo Nacional de la Cultura y las Artes. (2017). Tramas de la diversidad. Reflexiones, debates y propuestas en torno al patrimonio en Chile.*\n\n**La cita anterior recoge algunas conclusiones extraídas a partir de unas instancias de diálogo y reflexión sobre el patrimonio y el rol del Estado chileno en esta materia, que fueron realizadas por el Consejo Nacional de la Cultura y las Artes. De acuerdo al análisis de la cita, ¿cuál de las siguientes acciones debe realizar el Estado para resguardar el patrimonio de cada territorio?**',
    alternativas: [
      { letra: 'A', texto: 'Diseñar leyes que eviten la aprobación de proyectos que requieran el uso de recursos naturales.', es_correcta: false },
      { letra: 'B', texto: 'Crear instituciones regionales que tomen decisiones autónomas respecto a la planificación territorial.', es_correcta: false },
      { letra: 'C', texto: 'Establecer mecanismos de consulta popular a nivel local para tomar decisiones sobre la defensa del medio ambiente.', es_correcta: true },
      { letra: 'D', texto: 'Organizar un sistema de protección medioambiental que priorice las manifestaciones culturales de las minorías étnicas.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-23reg-06',
    enunciado: '**6. Lee el siguiente texto sobre las Organizaciones No Gubernamentales:**\n\n> «Las organizaciones no gubernamentales (ONG) son un componente central de las sociedades modernas. No solo representan y canalizan intereses de la sociedad civil sino que también estas entidades complementan las acciones de los sectores gubernamentales y de negocios y desarrollan funciones de carácter público, suministrando un amplio espectro de servicios públicos que mejoran la calidad de vida de las comunidades donde se desempeñan. Asimismo, este sector emplea una gran cantidad de profesionales de forma remunerada y voluntaria y los aportes que reciben son tanto de carácter público como privado así como de carácter nacional e internacional».\n\n*Chile Transparente (sin fecha). ONG’S. chiletransparente.cl.*\n\n**La cita anterior alude a las Organizaciones No Gubernamentales (ONG), las cuales forman parte del mundo actual y están presentes en variados aspectos de la vida cotidiana. En este contexto y considerando la cita, ¿cuál es una de las principales características de este tipo de organizaciones?**',
    alternativas: [
      { letra: 'A', texto: 'Invertir en negocios de utilidad social.', es_correcta: false },
      { letra: 'B', texto: 'Luchar por el éxito de los programas de gobierno.', es_correcta: false },
      { letra: 'C', texto: 'Desarrollar funciones sociales de manera autónoma.', es_correcta: true },
      { letra: 'D', texto: 'Mejorar la empleabilidad de los jóvenes más vulnerables.', es_correcta: false },
      { letra: 'E', texto: 'Reemplazar al Estado en funciones vinculadas al ámbito jurídico.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-23reg-07',
    enunciado: '**7. En Chile, el Servicio Electoral (SERVEL) es un organismo autónomo, con personalidad jurídica y patrimonio propio, que administra los procesos electorales y plebiscitarios. Considerando estos antecedentes, ¿qué función ejerce este organismo para asegurar la transparencia del sistema electoral chileno?**',
    alternativas: [
      { letra: 'A', texto: 'Promueve cuotas de participación de los partidos políticos.', es_correcta: false },
      { letra: 'B', texto: 'Fiscaliza los límites de gastos de las campañas electorales.', es_correcta: true },
      { letra: 'C', texto: 'Fomenta el proceso de regionalización del padrón electoral.', es_correcta: false },
      { letra: 'D', texto: 'Analiza el impacto político de los resultados de una elección.', es_correcta: false }
    ],
    respuesta_correcta: 'B'
  },
  {
    id: 'preg-paes-his-23reg-08',
    enunciado: '**8. Desde los inicios de la era industrial, la humanidad inició un progresivo aumento de las emisiones de CO₂ y otros gases de efecto invernadero, ya que la idea de progreso dominante implicaba mantener el crecimiento sostenido de la producción. Desde la perspectiva de la sustentabilidad, ¿cuál es una idea relativa al progreso que se ha consolidado durante las últimas décadas?**',
    alternativas: [
      { letra: 'A', texto: 'La explotación intensiva de los recursos productivos disponibles.', es_correcta: false },
      { letra: 'B', texto: 'La tecnología como recurso capaz de reemplazar al ser humano.', es_correcta: false },
      { letra: 'C', texto: 'La protección del medioambiente como prioridad en el desarrollo.', es_correcta: true },
      { letra: 'D', texto: 'La mantención inalterada de las condiciones físicas de los ecosistemas.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-23reg-09',
    enunciado: '**9. Durante el siglo XX se dio un nuevo impulso a la explotación cuprífera en Chile, estimulando el desarrollo de la Gran Minería del Cobre. Respecto de los efectos generados por esta actividad productiva, ¿cuál es uno de los impactos que ha provocado en el territorio donde se lleva a cabo la extracción?**',
    alternativas: [
      { letra: 'A', texto: 'La migración obligada desde las ciudades cercanas a los centros mineros.', es_correcta: false },
      { letra: 'B', texto: 'La sustitución en el uso de las energías sustentables por otras de tipo convencional.', es_correcta: false },
      { letra: 'C', texto: 'El cambio masivo de los usos del suelo rural en las localidades cercanas a los nuevos yacimientos.', es_correcta: false },
      { letra: 'D', texto: 'La disminución del volumen de agua disponible en las fuentes hídricas cercanas a los yacimientos.', es_correcta: true }
    ],
    respuesta_correcta: 'D'
  },
  {
    id: 'preg-paes-his-23reg-10',
    enunciado: '**10. Actualmente, en una democracia las personas tienen responsabilidades respecto del conjunto de la sociedad. Desde la perspectiva del bien común, ¿cuál de las siguientes acciones corresponde a una actitud cívica responsable?**',
    alternativas: [
      { letra: 'A', texto: 'Difundir la identidad de personas que cometan delitos.', es_correcta: false },
      { letra: 'B', texto: 'Fijar una indemnización frente a algún menoscabo generado.', es_correcta: false },
      { letra: 'C', texto: 'Denunciar la vulneración de derechos en la institución competente.', es_correcta: true },
      { letra: 'D', texto: 'Aplicar sanciones a quienes transgreden los derechos de las personas.', es_correcta: false }
    ],
    respuesta_correcta: 'C'
  },
  {
    id: 'preg-paes-his-23reg-11',
    enunciado: '**11. En Chile, una de las manifestaciones de la participación política de la ciudadanía es la elección de representantes mediante el voto. Considerando la periodicidad con que se realizan las elecciones, ¿de qué forma ha contribuido la participación electoral al fortalecimiento de la democracia?**',
    alternativas: [
      { letra: 'A', texto: 'Evitando la polarización de las tendencias políticas.', es_correcta: false },
      { letra: 'B', texto: 'Otorgando legitimidad a las decisiones que se toman.', es_correcta: true },
      { letra: 'C', texto: 'Fomentando la probidad pública de quienes fueron electos.', es_correcta: false },
      { letra: 'D', texto: 'Limitando el surgimiento de un número excesivo de partidos políticos.', es_correcta: false }
    ],
    respuesta_correcta: 'B'
  },
  {
    id: 'preg-paes-his-23reg-12',
    enunciado: '**12. Actualmente, mantener el crecimiento económico de manera responsable en Chile, exige considerar el cuidado de los ecosistemas. ¿Qué medida ha implementado el Estado chileno para propiciar un desarrollo sostenible?**',
    alternativas: [
      { letra: 'A', texto: 'Establecer un marco jurídico para la protección del medio ambiente.', es_correcta: true },
      { letra: 'B', texto: 'Estatizar la explotación de los recursos naturales existentes en el país.', es_correcta: false },
      { letra: 'C', texto: 'Decretar la prohibición del uso de combustibles fósiles a nivel domiciliario.', es_correcta: false },
      { letra: 'D', texto: 'Implementar un plan de estatización de la explotación de recursos naturales.', es_correcta: false }
    ],
    respuesta_correcta: 'A'
  }
];

async function run() {
  console.log("=== REPARACIÓN DE PREGUNTAS HISTORIA 2023 REGULAR (P4 a P12) ===");
  
  // 1. Generar migración SQL 065
  let sqlMigration = `-- Migración 065: Corrección de preguntas P4 a P12 de Historia 2023 Regular (Forma 103)\n`;
  sqlMigration += `-- Reemplazo de textos de instrucciones administrativas y hojas de respuesta por enunciados y alternativas oficiales DEMRE\n`;
  sqlMigration += `-- Fecha: ${new Date().toISOString()}\n\n`;

  for (const q of questionsToFix) {
    const escEnunciado = q.enunciado.replace(/'/g, "''");
    const escAlts = JSON.stringify(q.alternativas).replace(/'/g, "''");
    sqlMigration += `UPDATE public.preguntas SET enunciado = '${escEnunciado}', alternativas = '${escAlts}'::jsonb, respuesta_correcta = '${q.respuesta_correcta}' WHERE id = '${q.id}';\n`;
  }

  fs.writeFileSync('supabase/migrations/065_fix_historia_2023_p4_p12.sql', sqlMigration, 'utf8');
  console.log("Migración 065 guardada en supabase/migrations/065_fix_historia_2023_p4_p12.sql");

  // 2. Aplicar directamente a Supabase
  for (const q of questionsToFix) {
    const { error } = await supabase
      .from('preguntas')
      .update({
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        respuesta_correcta: q.respuesta_correcta
      })
      .eq('id', q.id);

    if (error) {
      console.error(`Error al actualizar ${q.id}:`, error);
    } else {
      console.log(`✓ [${q.id}] actualizada con éxito (Clave: ${q.respuesta_correcta}, Alts: ${q.alternativas.length})`);
    }
  }

  console.log("\nVerificación final en base de datos:");
  const { data: verified } = await supabase
    .from('preguntas')
    .select('id, respuesta_correcta, alternativas')
    .in('id', questionsToFix.map(q => q.id));

  for (const v of verified) {
    console.log(`  • ${v.id}: Clave = ${v.respuesta_correcta}, Alternativas = ${v.alternativas.length}`);
  }
}

run();

