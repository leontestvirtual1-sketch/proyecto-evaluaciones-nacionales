-- ============================================================================
-- Migración 036: Prueba Diagnóstica Todos los OAs Educación Ciudadana III° Medio 2026
-- Catálogo General Sysget Saber (es_catalogo = TRUE, profesor_id = NULL)
-- Total Preguntas: 25 | 100% Sanitizado (Cero marcas de terceros)
-- ============================================================================

BEGIN;

-- 1. Cabecera en public.evaluaciones
INSERT INTO public.evaluaciones (
  id, titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, es_catalogo, precio_clp, descripcion_catalogo, profesor_id, total_preguntas, created_at, updated_at
) VALUES (
  'eval-diag-ciu-3m-2026',
  'Prueba Diagnóstica Todos los OAs Educación Ciudadana III° Medio 2026',
  'Evaluación diagnóstica oficial de Educación Ciudadana para 3° Medio. Evalúa los Objetivos de Aprendizaje OA 01 al OA 09: Orden Geopolítico y Guerra Fría, Historia Contemporánea de Chile, Quiebre Democrático y Régimen Militar, Derechos Humanos, Estado de Derecho y Desafíos de Inclusión Social.',
  'asig-4',
  '3° Medio',
  90,
  'activa',
  TRUE,
  0,
  'Evaluación diagnóstica estandarizada de Educación Ciudadana 3° Medio con 25 ítems de selección múltiple basada en los programas oficiales MINEDUC, análisis de fuentes históricas y pauta docente detallada.',
  NULL,
  25,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  es_catalogo = EXCLUDED.es_catalogo,
  updated_at = NOW();

-- 2. Ítems en public.preguntas
INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-01',
  'asig-4',
  'eje-his-2',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  '/preguntas/diag_ciudadana_3m_2026/p01_mapa_operacion_barbarroja.png',
  'Observa el siguiente mapa.

El recurso muestra un avance militar señalado con flechas durante 1941. ¿Qué operación militar representa este acontecimiento
dentro del contexto de la Segunda Guerra Mundial?',
  '[{"letra": "A", "texto": "Operación Torch.", "es_correcta": false}, {"letra": "B", "texto": "Operación Overlord.", "es_correcta": false}, {"letra": "C", "texto": "Operación Barbarroja.", "es_correcta": true}, {"letra": "D", "texto": "Operación Market Garden.", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-02',
  'asig-4',
  'eje-his-2',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Durante la posguerra, Europa occidental experimentó diversas transformaciones políticas. A partir de lo ocurrido en la región, ¿cuál
de los siguientes procesos caracteriza mejor la evolución política de ese sector del continente?',
  '[{"letra": "A", "texto": "Instalación de gobiernos con fuerte control central y ausencia de libertades civiles.", "es_correcta": false}, {"letra": "B", "texto": "Fragmentación territorial de países europeos como consecuencia directa de la posguerra.", "es_correcta": false}, {"letra": "C", "texto": "Recuperación progresiva de instituciones democráticas y ampliación de las libertades públicas.", "es_correcta": true}, {"letra": "D", "texto": "Reorganización estatal basada en acuerdos que promovieron la uniformidad ideológica entre las potencias.", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-03',
  'asig-4',
  'eje-his-1',
  'hab-lec-1',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  NULL,
  'Lee el siguiente texto.

Durante esta etapa, el país presenció la aparición de un estilo de gobierno que apelaba directamente a las emociones y
expectativas de amplios sectores sociales. La figura presidencial se proyectaba como un líder fuerte, cercano y capaz de encarnar
las demandas de quienes se sentían postergados.

El discurso oficial combinaba mensajes nacionalistas con llamados a la unidad frente a las tensiones sociales, y buscaba
consolidar una imagen de autoridad que pudiera resolver conflictos mediante decisiones rápidas y centralizadas. La adhesión de
las masas se volvió un elemento clave, alentada por medidas que prometían orden, estabilidad y protección frente a las élites
tradicionales.

Memoria chilena. (s/f). Transformaciones políticas en Chile, primera mitad del siglo XX. memoriachilena.gob.cl

¿Qué Presidente de Chile se vincula con las características descritas en la fuente?',
  '[{"letra": "A", "texto": "Juan Antonio Ríos.", "es_correcta": false}, {"letra": "B", "texto": "Pedro Aguirre Cerda.", "es_correcta": false}, {"letra": "C", "texto": "Carlos Ibáñez del Campo.", "es_correcta": true}, {"letra": "D", "texto": "Jorge Alessandri Rodríguez.", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-04',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Lee el siguiente texto.

El régimen gubernamental se había hecho imposible día a día. Los regímenes de Gobierno están basados sobre el equilibrio de
los Poderes Ejecutivo y Legislativo. Entre nosotros se habían subvertido los valores, y el Poder Ejecutivo se había convertido en
un esclavo de la tiranía irresponsable y colectiva del Congreso. Al expresar este concepto, no me refiero a personas. Es necesario
modificar nuestro régimen de Gobierno; establecer un Ejecutivo  que rija los destinos del país bajo su responsabilidad, y un
Congreso que legisle y fiscalice: pero que no se inmiscuya en los actos de la Administración, porque esto trae como consecuencia
el trastorno y equivale a socavar por sus cimientos las bases republicanas.

Alessandri, A. (1925). Discurso presidencial. Universitaria.

¿Qué problemática específica menciona Arturo Alessandri Palma en su discurso?',
  '[{"letra": "A", "texto": "Indica que el país mantenía un orden estable y sin alteraciones.", "es_correcta": false}, {"letra": "B", "texto": "Señala que existía un funcionamiento político frágil y difícil de sostener.", "es_correcta": true}, {"letra": "C", "texto": "Afirma que el modelo vigente debía continuar sin modificaciones estructurales.", "es_correcta": false}, {"letra": "D", "texto": "Sostiene que era necesario eliminar cualquier forma de balance entre funciones del Estado.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-05',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Tras la crisis de 1929, Chile adoptó un nuevo modelo económico orientado a disminuir su dependencia del exterior. ¿Cuál de las
siguientes opciones expresa de manera precisa la finalidad central de ese enfoque?',
  '[{"letra": "A", "texto": "Promover mejoras generales en las condiciones de bienestar social.", "es_correcta": false}, {"letra": "B", "texto": "Impulsar la participación activa de toda la población en tareas productivas.", "es_correcta": false}, {"letra": "C", "texto": "Concentrar el poder económico en figuras de autoridad con amplia capacidad de decisión.", "es_correcta": false}, {"letra": "D", "texto": "Reorientar la actividad nacional hacia la elaboración interna de bienes antes adquiridos en el extranjero.", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-06',
  'asig-4',
  'eje-his-2',
  'hab-lec-1',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  NULL,
  'Durante las décadas de 1950 y 1970, varios países adoptaron políticas conocidas como “Estado de bienestar”. Según dicho
enfoque, ¿qué acción buscaba priorizar este modelo?',
  '[{"letra": "A", "texto": "Impulsar la transferencia de empresas estatales hacia privados.", "es_correcta": false}, {"letra": "B", "texto": "Reducir el rol gubernamental en las actividades económicas nacionales.", "es_correcta": false}, {"letra": "C", "texto": "Asegurar el acceso de la población a servicios esenciales como salud, educación y protección.", "es_correcta": true}, {"letra": "D", "texto": "Promover la eliminación del sistema económico vigente para establecer uno completamente distinto.", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-07',
  'asig-4',
  'eje-his-2',
  'hab-lec-3',
  'seleccion_multiple',
  '3° Medio',
  'alta',
  NULL,
  '¿Qué postura crítica refleja adecuadamente la dinámica del enfrentamiento global entre Estados Unidos y la Unión Soviética?',
  '[{"letra": "A", "texto": "Sostener que la Unión Soviética dominó ampliamente la economía internacional.", "es_correcta": false}, {"letra": "B", "texto": "Calificar a la Unión Soviética como un país perteneciente al bloque subdesarrollado.", "es_correcta": false}, {"letra": "C", "texto": "Afirmar que Estados Unidos carecía de capacidad para disputar liderazgo a nivel mundial.", "es_correcta": false}, {"letra": "D", "texto": "Reconocer que ambas potencias compararon su influencia en campos como tecnología, ciencia y vida social.", "es_correcta": true}]'::jsonb,
  'D',
  3,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-08',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Tras el triunfo de la Revolución Cubana, diversas organizaciones latinoamericanas reinterpretaron el rol de la violencia política.
Asociada a este cambio de perspectiva, ¿qué consecuencia concreta se observó en Chile?',
  '[{"letra": "A", "texto": "Desaparición de los movimientos estudiantiles críticos del sistema político nacional.", "es_correcta": false}, {"letra": "B", "texto": "Surgimiento de grupos que justificaron las armas como vía de transformación política.", "es_correcta": true}, {"letra": "C", "texto": "Incremento del apoyo militar chileno a movimientos insurgentes de otros países de la región.", "es_correcta": false}, {"letra": "D", "texto": "Consolidación de una alianza estable entre partidos de derecha e izquierda para evitar conflictos internos.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-09',
  'asig-4',
  'eje-his-2',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Tras la disolución de la Unión Soviética en 1991, el escenario internacional experimentó transformaciones profundas. ¿Qué suceso
describe de mejor forma el nuevo reordenamiento global?',
  '[{"letra": "A", "texto": "Se produjo un intento exitoso por restablecer el antiguo sistema soviético.", "es_correcta": false}, {"letra": "B", "texto": "Apareció una división física en Europa marcada por la creación de un muro en Berlín.", "es_correcta": false}, {"letra": "C", "texto": "Ocurrió una transición de las economías occidentales hacia un proyecto político comunista.", "es_correcta": false}, {"letra": "D", "texto": "Se consolidó la posición de Estados Unidos como principal actor dominante en el sistema mundial.", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-10',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Durante la década de 1930, el país experimentó un creciente desplazamiento desde zonas rurales hacia centros urbanos. ¿Qué
factor explica mejor este cambio demográfico?',
  '[{"letra": "A", "texto": "La influencia de proyectos políticos que promovían ideológicamente la vida en las ciudades.", "es_correcta": false}, {"letra": "B", "texto": "La migración ante la falta de ingresos estables y la disminución de oportunidades laborales en el campo.", "es_correcta": true}, {"letra": "C", "texto": "La búsqueda de espacios donde las prácticas culturales tradicionales pudieran difundirse con mayor rapidez.", "es_correcta": false}, {"letra": "D", "texto": "La necesidad de abandonar territorios afectados por desastres ambientales que impedían continuar actividades productivas.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-11',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Lee el siguiente texto.

Antes de que llegara la Reforma Agraria, vivíamos todos apretados en una pieza y casi no alcanzaba para comer. Después de que
nos entregaron una parcela, la cosa cambió: sembramos más, vendimos en la feria y pudimos ahorrar un poco. Mi marido compró
herramientas nuevas y hasta alcanzó para que los niños siguieran estudiando. Fue la primera vez que sentimos que el trabajo del
campo nos daba para salir adelante.

Museo de la Educación Gabriela Mistral. (1994). Testimonios rurales del siglo XX. Santiago.

A partir de la información, ¿qué opción refleja una consecuencia de la Reforma Agraria para ciertos sectores rurales?',
  '[{"letra": "A", "texto": "La reducción de oportunidades educativas infantiles.", "es_correcta": false}, {"letra": "B", "texto": "El deterioro generalizado de actividades agrícolas familiares.", "es_correcta": false}, {"letra": "C", "texto": "La mejora de posibilidades económicas y materiales de algunas familias.", "es_correcta": true}, {"letra": "D", "texto": "El rechazo masivo del campesinado hacia los programas impulsados por el Estado.", "es_correcta": false}]'::jsonb,
  'C',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-12',
  'asig-4',
  'eje-his-1',
  'hab-lec-3',
  'seleccion_multiple',
  '3° Medio',
  'alta',
  NULL,
  'Durante el gobierno de Salvador Allende (1970–1973), distintas propuestas encontraron niveles muy disímiles de respaldo
político. Considerando el clima político de la época, ¿cuál de las siguientes medidas destacó por recibir un apoyo ampliamente
transversal?',
  '[{"letra": "A", "texto": "La estatización de la gran minería asociada al cobre.", "es_correcta": true}, {"letra": "B", "texto": "La reforma educacional que proponía la Escuela Nacional Unificada.", "es_correcta": false}, {"letra": "C", "texto": "La implementación del Sistema Nacional Único de Distribución de Alimentos.", "es_correcta": false}, {"letra": "D", "texto": "La intervención estatal directa en todos los medios de comunicación privados.", "es_correcta": false}]'::jsonb,
  'A',
  3,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-13',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'En relación con el sistema político definido por la Constitución de 1980, ¿cuál de las siguientes opciones describe una de sus
características centrales?',
  '[{"letra": "A", "texto": "Se otorgó al Presidente una posición de predominio dentro del aparato estatal.", "es_correcta": true}, {"letra": "B", "texto": "Se eliminó cualquier forma de participación de figuras parlamentarias designadas.", "es_correcta": false}, {"letra": "C", "texto": "Se aseguró que la totalidad del Congreso fuera escogida mediante votación popular.", "es_correcta": false}, {"letra": "D", "texto": "Se incorporó formalmente a los sectores políticos de izquierda dentro del diseño institucional.", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-14',
  'asig-4',
  'eje-his-1',
  'hab-lec-3',
  'seleccion_multiple',
  '3° Medio',
  'alta',
  NULL,
  'Lee el siguiente texto.

Diversos centros de detención funcionaron en el país bajo control de organismos de seguridad del Estado, donde se aplicaron
métodos de interrogatorio caracterizados por la violencia física y psicológica. Estos procedimientos fueron utilizados para obtener
información y desarticular redes opositoras. A pesar de las reiteradas denuncias de víctimas y familiares, las instituciones
encargadas de impartir justicia no actuaron con la celeridad ni la independencia necesarias para frenar estas prácticas.

Comisión Nacional de Verdad y Reconciliación. (1991). Informe Rettig. Santiago.

De acuerdo con la fuente, ¿qué afirmación es correcta?',
  '[{"letra": "A", "texto": "El sistema judicial fue ineficaz al enfrentar prácticas de violencia utilizadas por los organismos de seguridad.", "es_correcta": true}, {"letra": "B", "texto": "Las medidas de represión fueron exclusivamente responsabilidad de grupos civiles sin participación institucional.", "es_correcta": false}, {"letra": "C", "texto": "Los métodos de interrogatorio empleados se aplicaron de manera aislada y sin relación con organismos estatales.", "es_correcta": false}, {"letra": "D", "texto": "Las denuncias presentadas fueron investigadas de forma inmediata y permitieron detener rápidamente los abusos.", "es_correcta": false}]'::jsonb,
  'A',
  3,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-15',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'La imposición del neoliberalismo en Chile supuso un cambio en la economía predominante. ¿Cuál fue la medida MÁS drástica en la
implementación de este modelo?',
  '[{"letra": "A", "texto": "La transferencia al Estado de la propiedad y administración de sectores estratégicos, con el fin de aumentar la intervención en la economía.", "es_correcta": false}, {"letra": "B", "texto": "La implementación de controles directos sobre los precios de bienes básicos, fijándolos de manera centralizada para regular el consumo de la población.", "es_correcta": false}, {"letra": "C", "texto": "El establecimiento de mayores aranceles y tributos a los productos importados, con el objetivo de proteger la industria nacional frente al comercio internacional.", "es_correcta": false}, {"letra": "D", "texto": "La aplicación de un fuerte recorte del gasto estatal, que implicó disminuir la inversión pública, reducir programas sociales y limitar la participación del Estado en la economía.", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-16',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Durante la primera mitad de la década de 1980 se conformaron distintas coaliciones políticas en Chile. Una de ellas fue la “Alianza
Democrática”. ¿Con cuál de los siguientes partidos se vinculó directamente esta coalición?',
  '[{"letra": "A", "texto": "Renovación Nacional, que entregó respaldo político al gobierno militar.", "es_correcta": false}, {"letra": "B", "texto": "Democracia Cristiana, que promovió una salida negociada al régimen autoritario.", "es_correcta": true}, {"letra": "C", "texto": "Movimiento de Unión Nacional, que defendió la continuidad del régimen de facto.", "es_correcta": false}, {"letra": "D", "texto": "Unión Demócrata Independiente, que impulsó el proyecto de la Constitución de 1980.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-17',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Lee el siguiente texto.

Con el avance del proceso de apertura política, numerosas familias comenzaron a reencontrarse tras años de separación. Quienes
habían partido al extranjero por motivos políticos regresaron poco a poco al país, trayendo consigo memorias de destierro y la
esperanza de reconstruir sus vidas en un Chile que iniciaba un lento retorno a la democracia.

Fundación Museo de la Memoria y los Derechos Humanos. (2010). Testimonios del exilio chileno. Santiago.

Durante la década de 1980, Chile experimentó transformaciones políticas y sociales significativas. A partir de la información, ¿qué
proceso es el MÁS representativo de la situación descrita?',
  '[{"letra": "A", "texto": "La negociación de acuerdos formales entre oposición y gobierno militar.", "es_correcta": false}, {"letra": "B", "texto": "El retorno gradual de exiliados que buscaban reintegrarse a la vida nacional.", "es_correcta": true}, {"letra": "C", "texto": "La reorganización interna de los partidos políticos previo al plebiscito de 1988.", "es_correcta": false}, {"letra": "D", "texto": "El incremento de la confrontación armada entre movimientos opositores y el régimen militar.", "es_correcta": false}]'::jsonb,
  'B',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-18',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'Durante la segunda mitad de la década de 2000, diversos grupos estudiantiles comenzaron a cuestionar las bases del sistema
educativo chileno. ¿Qué acontecimiento desencadenó de manera decisiva la articulación del movimiento secundario a nivel
nacional?',
  '[{"letra": "A", "texto": "La apertura de matrículas universitarias sin cobro para nuevos estudiantes, orientada a facilitar el acceso a la educación superior.", "es_correcta": false}, {"letra": "B", "texto": "La puesta en marcha de la Jornada Escolar Completa, que reorganizó el tiempo escolar como parte de una reforma curricular de largo plazo.", "es_correcta": false}, {"letra": "C", "texto": "El establecimiento del derecho universal a completar la enseñanza media, impulsado como política pública para ampliar la cobertura educativa.", "es_correcta": false}, {"letra": "D", "texto": "La movilización masiva de estudiantes que exigió transformaciones estructurales en el sistema educativo, conocida por su alta organización y alcance.", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-19',
  'asig-4',
  'eje-his-1',
  'hab-lec-1',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  NULL,
  'Lee el siguiente texto.

Fue creada por el Presidente Patricio Aylwin como una de las primeras medidas de su gobierno, con el propósito de avanzar en el
esclarecimiento global de la verdad sobre las graves violaciones a los derechos humanos cometidas entre el 11 de septiembre
de 1973 y el 11 de marzo de 1990, durante la dictadura militar. Tuvo el mandato de investigar casos de desaparición forzada,
ejecución política y muerte por abuso de agentes del Estado. Además de recopilar testimonios, elaboró un resumen destinado a
reconocer públicamente a las víctimas, recomendar medidas de reparación y contribuir a la reconciliación nacional. Su creación
marcó un hito en la apertura democrática y en el compromiso del Estado con la verdad y la justicia en materia de derechos
humanos.”

Subsecretaría de Derechos Humanos. (s/f). https://pdh.minjusticia.gob.cl

¿A qué política del gobierno de Patricio Aylwin (1990-1994) alude el texto?',
  '[{"letra": "A", "texto": "Comisión Nacional Contra la Tortura, encargada de documentar torturas sistemáticas.", "es_correcta": false}, {"letra": "B", "texto": "Corporación Nacional de Reparación y Reconciliación, enfocada en compensaciones económicas.", "es_correcta": false}, {"letra": "C", "texto": "Informe Rettig (Comisión Nacional de Verdad y Reconciliación), centrado en desapariciones y ejecuciones políticas.", "es_correcta": true}, {"letra": "D", "texto": "Informe Valech (Comisión Nacional sobre Prisión Política y Tortura), dedicada a documentar víctimas de tortura y encarcelamiento político.", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-20',
  'asig-4',
  'eje-his-1',
  'hab-lec-1',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  NULL,
  'Lee el siguiente texto.

Los derechos que incluye la Declaración Universal de los Derechos Humanos pertenecen a todas las personas por el mero hecho
de existir, sin distinción de nacionalidad, género, edad, origen social, condición económica, creencias o cualquier otra
característica. Estos derechos operan como un marco ético común que reconoce la dignidad inherente a todos los seres humanos
y establece que su protección debe aplicarse en todo tiempo y lugar.

Amnistía Internacional. (s/f). Características de los derechos humanos. https://www.amnistiacatalunya.org/edu/es/historia

¿Qué característica de los derechos humanos se describe en el texto?',
  '[{"letra": "A", "texto": "Universalidad", "es_correcta": true}, {"letra": "B", "texto": "Indivisibilidad", "es_correcta": false}, {"letra": "C", "texto": "Inalienabilidad", "es_correcta": false}, {"letra": "D", "texto": "Imprescriptibilidad", "es_correcta": false}]'::jsonb,
  'A',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-21',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'En un proceso de selección de personal, una empresa rechaza a una postulante únicamente por su religión, a pesar de que cumple
con todos los requisitos para el cargo. ¿Qué derecho fundamental se ve afectado de forma más directa en esta situación?',
  '[{"letra": "A", "texto": "La garantía de acceder a un empleo sin ser excluido por motivos de discriminación.", "es_correcta": true}, {"letra": "B", "texto": "La protección vinculada a obtener prestaciones frente a enfermedad u otras contingencias.", "es_correcta": false}, {"letra": "C", "texto": "La protección frente a accidentes y riesgos donde se realizan las tareas propias de un cargo.", "es_correcta": false}, {"letra": "D", "texto": "La garantía relacionada con recibir una remuneración suficiente y equitativa por funciones desempeñadas.", "es_correcta": false}]'::jsonb,
  'A',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-22',
  'asig-4',
  'eje-his-1',
  'hab-lec-3',
  'seleccion_multiple',
  '3° Medio',
  'alta',
  NULL,
  'En un curso sobre ciudadanía se analizan qué condiciones deben existir para que un país sea considerado un Estado de Derecho.
¿Qué situación se escapa a ese tipo de organización política?',
  '[{"letra": "A", "texto": "La consagración de procedimientos que garantizan el ejercicio de libertades fundamentales frente a eventuales arbitrariedades.", "es_correcta": false}, {"letra": "B", "texto": "La existencia de mecanismos que permiten que cada poder del Estado limite posibles abusos de los otros, evitando la concentración del poder.", "es_correcta": false}, {"letra": "C", "texto": "La obligación de los funcionarios públicos de rendir cuentas sobre la legalidad de sus actos, incluso cuando sean evaluados por órganos independientes.", "es_correcta": false}, {"letra": "D", "texto": "La adopción de decisiones gubernamentales sin sujeción a normas previas, sustentadas principalmente en la autoridad personal de quienes ejercen el cargo.", "es_correcta": true}]'::jsonb,
  'D',
  3,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-23',
  'asig-4',
  'eje-his-1',
  'hab-lec-1',
  'seleccion_multiple',
  '3° Medio',
  'baja',
  NULL,
  'Lee el siguiente texto.

“Aquella acción que la Constitución concede a toda persona detenida, presa o arrestada con infracción a la Constitución o a la ley,
o que sufra cualquier otra privación, perturbación o amenaza en su derecho a la libertad personal y seguridad individual.”

Biblioteca del Congreso Nacional de Chile. (s/f). Ley Fácil. https://www.bcn.cl

¿Qué recurso de resguardo de derechos describe la fuente?',
  '[{"letra": "A", "texto": "Nulidad", "es_correcta": false}, {"letra": "B", "texto": "Garantía", "es_correcta": false}, {"letra": "C", "texto": "Amparo", "es_correcta": true}, {"letra": "D", "texto": "Casación", "es_correcta": false}]'::jsonb,
  'C',
  1,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-24',
  'asig-4',
  'eje-his-1',
  'hab-lec-2',
  'seleccion_multiple',
  '3° Medio',
  'media',
  NULL,
  'La Ley 20.609 sanciona actos de discriminación arbitraria. ¿Qué situación podría ser denunciada bajo esta ley?',
  '[{"letra": "A", "texto": "Tarifas de transporte público rebajadas para adultos mayores.", "es_correcta": false}, {"letra": "B", "texto": "Ajustes salariales en una empresa estatal basados en criterios internos.", "es_correcta": false}, {"letra": "C", "texto": "Exigencia de un corte de cabello específico para los miembros del ejército.", "es_correcta": false}, {"letra": "D", "texto": "Rechazo de un estudiante en un establecimiento educativo debido a su orientación sexual.", "es_correcta": true}]'::jsonb,
  'D',
  2,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

INSERT INTO public.preguntas (
  id, asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, imagen_url, enunciado, alternativas, respuesta_correcta, puntaje, fuente, created_at, updated_at
) VALUES (
  'preg-ciu3m-diag-25',
  'asig-4',
  'eje-his-1',
  'hab-lec-3',
  'seleccion_multiple',
  '3° Medio',
  'alta',
  '/preguntas/diag_ciudadana_3m_2026/p25_campamento_desigualdad.jpg',
  'Observa la siguiente imagen.

A partir de lo observado, ¿cuál es uno de los desafíos del Estado de Chile en relación con la pobreza y desigualdad?',
  '[{"letra": "A", "texto": "Priorizar la relocalización inmediata de las familias hacia zonas rurales alejadas.", "es_correcta": false}, {"letra": "B", "texto": "Fomentar la autoconstrucción de viviendas como solución principal al déficit habitacional.", "es_correcta": false}, {"letra": "C", "texto": "Diseñar políticas públicas que aseguren acceso equitativo a vivienda digna y servicios básicos.", "es_correcta": true}, {"letra": "D", "texto": "Implementar mecanismos de control policial que eviten la expansión de asentamientos informales.", "es_correcta": false}]'::jsonb,
  'C',
  3,
  'Prueba Diagnóstica Educación Ciudadana 3° Medio 2026',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  enunciado = EXCLUDED.enunciado,
  alternativas = EXCLUDED.alternativas,
  respuesta_correcta = EXCLUDED.respuesta_correcta,
  puntaje = EXCLUDED.puntaje,
  imagen_url = EXCLUDED.imagen_url,
  updated_at = NOW();

COMMIT;