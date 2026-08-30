import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

async function uploadImages() {
  console.log('📤 Subiendo imágenes a Supabase Storage (bucket evaluaciones-media)...');
  const imgDir = path.resolve(__dirname, '../public/preguntas/diag_ciudadana_3m_2026');
  if (!fs.existsSync(imgDir)) return {};

  const files = fs.readdirSync(imgDir);
  const uploadedUrls = {};

  for (const f of files) {
    const filePath = path.join(imgDir, f);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `diag_ciudadana_3m_2026/${f}`;
    const contentType = f.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const { data, error } = await supabase.storage
      .from('evaluaciones-media')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.warn(`  ⚠️ Error subiendo ${f}:`, error.message);
    } else {
      const { data: pubData } = supabase.storage.from('evaluaciones-media').getPublicUrl(storagePath);
      uploadedUrls[f] = pubData.publicUrl;
      console.log(`  ✅ ${f} -> ${pubData.publicUrl}`);
    }
  }
  return uploadedUrls;
}

async function main() {
  console.log('🚀 Iniciando ingesta de Educación Ciudadana 3° Medio...');
  
  // 1. Subir imágenes
  const uploadedUrls = await uploadImages();

  // 2. Obtener admin user id
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id;
  console.log(`Admin ID: ${adminId}`);

  // 3. Crear evaluación en catálogo
  const evaluacion = {
    id: 'eval-diag-ciu-3m-2026',
    titulo: 'Prueba Diagnóstica Todos los OAs Educación Ciudadana III° Medio 2026',
    descripcion: 'Evaluación diagnóstica oficial de Educación Ciudadana para 3° Medio. Evalúa los Objetivos de Aprendizaje OA 01 al OA 09: Orden Geopolítico y Guerra Fría, Historia Contemporánea de Chile, Quiebre Democrático y Régimen Militar, Derechos Humanos, Estado de Derecho y Desafíos de Inclusión Social.',
    asignatura_id: 'asig-4',
    nivel: '3° Medio',
    tiempo_limite: 90,
    estado: 'activa',
    es_catalogo: true,
    precio_clp: 0,
    descripcion_catalogo: 'Evaluación diagnóstica estandarizada de Educación Ciudadana 3° Medio con 25 ítems de selección múltiple basada en los programas oficiales MINEDUC, análisis de fuentes históricas y pauta docente detallada.',
    profesor_id: null,
    total_preguntas: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: evErr } = await supabase.from('evaluaciones').upsert(evaluacion, { onConflict: 'id' });
  if (evErr) {
    console.error('❌ Error insertando evaluación:', evErr.message);
  } else {
    console.log(`✅ Evaluación insertada: ${evaluacion.titulo}`);
  }

  // 4. Cargar y formatear preguntas
  const parsedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/ciudadana_3m_parsed.json'), 'utf8'));

  const explicaciones = {
    1: "La invasión de la Unión Soviética por parte de las fuerzas del Eje en junio de 1941 recibió la denominación militar oficial de 'Operación Barbarroja', constituyendo el mayor frente terrestre de la Segunda Guerra Mundial.",
    2: "Tras la devastación de la Segunda Guerra Mundial, Europa occidental experimentó la reconstrucción y fortalecimiento de sus regímenes democráticos representativos, la expansión de los derechos civiles y la consolidación del Estado de Bienestar.",
    3: "El estilo de liderazgo personalista, populista y de apelación directa a las masas para superar el parlamentarismo oligárquico caracterizó la presidencia de Carlos Ibáñez del Campo (1927-1931).",
    4: "En su discurso presidencial, Arturo Alessandri Palma criticaba la 'tiranía colectiva del Congreso' durante la época parlamentaria y la necesidad urgente de fortalecer el Poder Ejecutivo a través de la Constitución de 1925.",
    5: "El modelo ISI (Industrialización por Sustitución de Importaciones), impulsado en Chile con la creación de la CORFO (1939), buscaba producir localmente bienes de consumo para reducir la vulnerabilidad frente a las crisis externas.",
    6: "El Estado de Bienestar busca garantizar un piso mínimo de derechos sociales básicos para toda la ciudadanía, priorizando la cobertura universal de salud, educación, previsión y vivienda digna.",
    7: "La Guerra Fría fue una confrontación global multidimensional donde Estados Unidos y la URSS compitieron en esferas tecnológicas, espaciales, científicas, culturales y propagandísticas sin llegar a un enfrentamiento militar directo.",
    8: "El impacto ideológico de la Revolución Cubana en América Latina promovió en sectores de la izquierda la convicción de que la vía armada y la movilización insurreccional eran mecanismos válidos para la transformación revolucionaria.",
    9: "La disolución de la Unión Soviética en 1991 puso fin al orden bipolar de la Guerra Fría y consolidó a Estados Unidos como la superpotencia hegemónica preponderante en el sistema internacional.",
    10: "La crisis de la economía salitrera y la falta de empleo y condiciones mínimas en el campo empujaron una masiva migración rural-urbana hacia Santiago, Valparaíso y Concepción en la década de 1930.",
    11: "La Reforma Agraria (iniciada bajo Alessandri Rodríguez y profundizada por Frei Montalva y Allende) permitió a numerosas familias campesinas acceder a la propiedad de la tierra y mejorar sus condiciones materiales de vida.",
    12: "Una de las medidas de mayor trascendencia histórica del gobierno de la Unidad Popular fue la Nacionalización y Estatización de la Gran Minería del Cobre, aprobada por unanimidad parlamentaria en 1971.",
    13: "La Constitución de 1980 estableció un régimen presidencialista autoritario y reforzado, otorgando amplias atribuciones al Jefe de Estado sobre el Congreso, las Fuerzas Armadas y los órganos del Estado.",
    14: "Frente a las sistemáticas violaciones a los derechos humanos cometidas por organismos de seguridad (DINA, CNI), los tribunales de justicia chilenos mostraron una generalizada ineficacia al rechazar la inmensa mayoría de los recursos de amparo.",
    15: "El modelo neoliberal implementado a partir de 1975 ('política de shock') tuvo como medida central una drástica reducción del gasto público, privatización de empresas estatales y retracción del Estado en áreas sociales.",
    16: "La Alianza Democrática (1983), liderada principalmente por el Partido Demócrata Cristiano junto a sectores socialistas moderados y radicales, promovió una transición institucional y una salida pacífica/negociada a la dictadura.",
    17: "A partir de la flexibilización de las medidas de destierro a mediados de la década de 1980, miles de chilenos exiliados por motivos políticos retornaron gradualmente al país para incorporarse a la vida cívica y opositora.",
    18: "La 'Revolución Pingüina' de 2006 representó una histórica y masiva movilización de estudiantes secundarios que exigió el fin de la LOCE, la gratuidad del pase escolar y profundas transformaciones a la calidad educativa.",
    19: "La Comisión Nacional de Verdad y Reconciliación (creada por el Presidente Patricio Aylwin en 1990 y presidida por Raúl Rettig) elaboró el Informe Rettig para esclarecer las desapariciones forzadas y ejecuciones políticas.",
    20: "El principio de Universalidad establece que los Derechos Humanos son inherentes a todos los seres humanos sin distinción alguna de nacionalidad, etnia, género, religión o condición socioeconómica.",
    21: "El rechazo laboral basado exclusivamente en el credo religioso de una persona constituye una vulneración directa al derecho constitucional a la no discriminación y a la libertad de conciencia y trabajo.",
    22: "En un auténtico Estado de Derecho rige el principio de legalidad e imperio de la ley; cualquier actuación gubernamental basada en la arbitrariedad o voluntad personal de los gobernantes sin norma previa vulnera este principio.",
    23: "El Recurso de Amparo (Habeas Corpus), consagrado en el artículo 21 de la Constitución, protege la libertad personal y seguridad individual ante detenciones ilegales o arbitrarias.",
    24: "La Ley 20.609 (Ley Antidiscriminación o Ley Zamudio) sanciona judicialmente actos u omisiones que importen una distinción o exclusión arbitraria fundada en motivos como la orientación sexual, identidad de género o religión.",
    25: "El crecimiento de asentamientos precarios y campamentos evidencia que el acceso equitativo a una vivienda digna, con servicios básicos y entorno seguro, constituye uno de los desafíos prioritarios del Estado de Chile."
  };

  const preguntas = [];

  for (const p of parsedData) {
    const num = String(p.numero).padStart(2, '0');
    
    // Asignar URL de imagen pública si aplica
    let imgUrl = null;
    if (p.numero === 1) {
      imgUrl = uploadedUrls['p01_mapa_operacion_barbarroja.png'] || '/preguntas/diag_ciudadana_3m_2026/p01_mapa_operacion_barbarroja.png';
    } else if (p.numero === 25) {
      imgUrl = uploadedUrls['p25_campamento_desigualdad.jpg'] || '/preguntas/diag_ciudadana_3m_2026/p25_campamento_desigualdad.jpg';
    }

    preguntas.push({
      id: `preg-ciu3m-diag-${num}`,
      propietario_id: adminId,
      asignatura_id: 'asig-4',
      eje_tematico_id: p.eje_id,
      habilidad_id: p.habilidad_id,
      tipo: 'seleccion_multiple',
      nivel: '3° Medio',
      dificultad: p.complejidad,
      imagen_url: imgUrl,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      respuesta_correcta: p.clave,
      puntaje: p.puntaje,
      fuente: 'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  console.log(`\n📦 Insertando ${preguntas.length} preguntas en Supabase (lotes de 15)...`);
  let success = 0;
  for (let i = 0; i < preguntas.length; i += 15) {
    const batch = preguntas.slice(i, i + 15);
    const { error: pregErr } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
    if (pregErr) {
      console.error(`❌ Error en lote ${i + 1}-${i + batch.length}:`, pregErr.message);
    } else {
      console.log(`✅ Lote ${i + 1}-${i + batch.length} insertado.`);
      success += batch.length;
    }
  }

  console.log(`\n🎉 Ingesta exitosa: ${success}/${preguntas.length} preguntas persistidas en Supabase.`);
}

main();
