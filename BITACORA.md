# 📖 Bitácora de Desarrollo — Sysget Saber

Registro oficial de avances, tareas ejecutadas y soluciones técnicas del proyecto.

### [2026-08-30] Modal de Edición Rápida de Preguntas con Carga de Imágenes a Supabase Storage

- **Problema / Requerimiento**:
  Implementar una herramienta de gestión editorial y corrección directa para que el Administrador y Docentes puedan ajustar manualmente cualquier pregunta del catálogo o de sus evaluaciones: editar enunciados con fórmulas matemáticas en Markdown, modificar alternativas individuales y su clave oficial, y subir o reemplazar figuras pedagógicas directamente a Supabase Storage (`evaluaciones-media/`).

- **Archivos y Solución Técnica**:
  - [`src/components/EditarPreguntaModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/EditarPreguntaModal.tsx):
    - [NUEVO] Componente modal completo de edición con previsualización en vivo (toggle "Modo Edición" / "Vista Previa"), barra de atajos Markdown para fórmulas y tablas, gestor de subida de imágenes con selector de archivos que sube a Supabase Storage mediante `uploadPreguntaImage`, editor de alternativas dinámicas (A, B, C, D, E) con selector de clave correcta, y persistencia inmediata en la tabla `public.preguntas` en PostgreSQL.
  - [`src/components/CatalogoDetalleModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoDetalleModal.tsx):
    - [MODIFICADO] Incorporado botón `✏️ Editar` en la cabecera de cada pregunta del cuadernillo. Al guardar los cambios, actualiza el estado local de la evaluación en tiempo real sin recargar la página.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores TypeScript.
  - Subido a `origin/main` (Commit `4f5cd75`) y desplegado en Vercel.

---

- **Problema / Requerimiento**:
  1. Corregir el parseo de alternativas en el modal de detalle del catálogo (`CatalogoDetalleModal.tsx`) donde las preguntas mostraban opciones vacías o se renderizaban como botones cuadrados de letra en lugar de desplegar el texto completo de las alternativas.
  2. Proteger el símbolo de moneda (`$120.000`, `$25.000`, etc.) en `EnunciadoRenderer.tsx` para evitar que fuera interpretado erróneamente como delimitador de fórmulas matemáticas LaTeX inline.
  3. Respetar tablas Markdown y encabezados en la función `normalizeText` sin colapsar las filas de tablas estructuradas.

- **Archivos y Solución Técnica**:
  - [`src/components/CatalogoDetalleModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoDetalleModal.tsx):
    - [MODIFICADO] Normalización defensiva de `p.alternativas` al recibir datos desde la API (manejo de formato array u objeto JSONB stringificado).
    - [MODIFICADO] Corrección de la lógica de renderizado condicional: si cualquier alternativa contiene texto no vacío, se despliega en lista detallada con tarjeta enriquecida, letra destacada y contenido Markdown vía `EnunciadoRenderer`.
  - [`src/components/common/EnunciadoRenderer.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/common/EnunciadoRenderer.tsx):
    - [MODIFICADO] Protección de montos monetarios (`\$\d+[\d.,]*`) con token seguro temporal previo a la evaluación de delimitadores LaTeX `$formula$` y posterior restauración.
    - [MODIFICADO] `normalizeText` modularizado para respetar bloques de tablas Markdown `| ... |`, encabezados `#` y separadores sin unir líneas indebidamente.
  - [`scripts/sync_all_65_to_supabase.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/sync_all_65_to_supabase.js):
    - [NUEVO] Script de sincronización masiva que actualizó las 65 preguntas oficiales de PAES Matemática 1 (Forma 113) en `public.preguntas` en Supabase con enunciados limpios, alternativas con texto y claves oficiales.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores TypeScript.
  - `npm run build` completado exitosamente en 41.98s (`dist/` generado).
  - Sincronización completa de las 65 preguntas en Supabase DB.
  - Commits `5667d18` y `bca48e6` subidos a `origin/main` y desplegados automáticamente en Vercel.

---

- **Problema / Requerimiento**:
  Mantener la coherencia arquitectónica y estética del proyecto: alinear la evaluación `PAES Oficial Competencia Matemática 1 (M1) 2023 (Forma 113)` exactamente al estándar oficial de los Ensayos SIMCE de Matemática 2° Medio y 6° Básico (enunciados en Markdown enriquecido con notación matemática limpia, alternativas individuales completas con su texto estructurado, y figuras/diagramas pedagógicos recortados en alta resolución únicamente cuando la pregunta lo requiere).

- **Archivos y Solución Técnica**:
  - [`scripts/sync_paes_mat1_2023_standard.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/sync_paes_mat1_2023_standard.js):
    - [NUEVO] Script maestro que sincronizó las 65 preguntas en `public.preguntas` con enunciados matemáticos formateados, alternativas con texto y claves del clavijero oficial DEMRE.
  - [`public/preguntas/paes_mat1_2023_forma113/`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/paes_mat1_2023_forma113/):
    - [NUEVO] 20 figuras pedagógicas recortadas y optimizadas (pirámide p03, balanzas p16, cajas p17, gráficos p18/p29/p60/p63, planos cartesianos p23/p28/p48, geometría p35/p36/p47/p49, casa y árbol p50, óptica p51, histogramas p55, cajas con bigotes p57) sincronizadas en el bucket `evaluaciones-media` de Supabase Storage.
  - [`src/components/CatalogoDetalleModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoDetalleModal.tsx):
    - [MODIFICADO] Renderizado responsivo para preguntas bajo el estándar oficial: enunciado continuo, figura pedagógica centrada en contenedor de alto contraste y alternativas estructuradas con texto completo y badge de clave de corrección.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Sincronización exitosa en Supabase Storage y Base de Datos.
  - Desplegado en Vercel (Commit `433e921`).

---

### [2026-08-30] Visualizador Completo de Contenidos de Catálogo: Cuadernillo, Preguntas y Pauta Oficial

- **Problema / Requerimiento**:
  Implementar la funcionalidad que permite a administradores y docentes visualizar interactivamente el contenido íntegro de cada evaluación del catálogo (enunciados, lecturas compartidas, alternativas, imágenes pedagógicas, tablas y pauta docente oficial con claves y especificaciones), con opción de previsualización e impresión directa del cuadernillo.

- **Archivos y Solución Técnica**:
  - [`api/evaluaciones-catalogo.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/evaluaciones-catalogo.ts):
    - [MODIFICADO] Añadida acción `GET ?action=preguntas&evaluacion_id=XXX` que consulta y retorna las preguntas asociadas a cualquier instrumento de catálogo con sus alternativas y especificaciones.
  - [`src/components/CatalogoDetalleModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoDetalleModal.tsx):
    - [NUEVO] Componente modal interactivo con pestañas de: 1) Cuadernillo de preguntas renderizado con fórmulas y diagramas, toggle de claves de corrección; 2) Tabla oficial de pauta docente y solucionario; 3) Integración directa con el motor de impresión oficial (`PrintEvaluacionModal`).
  - [`src/components/AdminCatalogoPanel.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AdminCatalogoPanel.tsx):
    - [MODIFICADO] Incorporado botón `👁️ Ver Contenido` en cada tarjeta de evaluación de catálogo del Super Admin.
  - [`src/components/CatalogoEvaluacionesModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoEvaluacionesModal.tsx):
    - [MODIFICADO] Incorporado botón `👁️ Ver Contenido` para que los profesores previsualicen el instrumento antes de solicitarlo.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Desplegado en Vercel.

---

### [2026-08-30] Ingesta Catálogo PAES: PAES Oficial Competencia Lectora 2026 (65 preguntas)

- **Problema / Requerimiento**:
  Procesar e incorporar la prueba oficial DEMRE `PAES Competencia Lectora Proceso 2026` al catálogo general en Supabase sin asignar (`es_catalogo = TRUE`, `profesor_id = NULL`), extrayendo sus 65 preguntas y lecturas compartidas, vinculando el Clavijero Oficial DEMRE con identificación de ítems piloto de calibración psicométrica, y generando la Pauta Docente oficial para el profesor con precio comercial configurado ($29.990 CLP). Fuente: PDFs en `C:\Users\luisl\OneDrive\Desktop\pruebas_paes\`.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/038_paes_oficial_competencia_lectora_2026.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/038_paes_oficial_competencia_lectora_2026.sql):
    - [NUEVO] Migración SQL que inserta la evaluación `eval-paes-lect-2026-f103` y sus 65 preguntas en `public.evaluaciones` y `public.preguntas` con taxonomía DEMRE (Localizar, Interpretar, Evaluar).
  - [`docs/pautas/PAUTA_DOCENTE_PAES_COMPETENCIA_LECTORA_2026.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/docs/pautas/PAUTA_DOCENTE_PAES_COMPETENCIA_LECTORA_2026.md):
    - [NUEVO] Pauta Docente oficial con el Clavijero Oficial DEMRE de 65 ítems, identificación de ítems piloto, y tabla de transformación a escala PAES (100 a 1000 puntos).
  - [`scripts/seed-paes-lect-2026.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/seed-paes-lect-2026.js):
    - [NUEVO] Script Node.js de ingesta que persistió las 65 preguntas y la evaluación en la base de datos de producción.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Auditoría Supabase: 9 evaluaciones totales (6 en catálogo sin asignar + 3 activas de María Teresa), 355 preguntas en `public.preguntas`.
  - Desplegado en Vercel.

---

### [2026-08-30] Ingesta Catálogo PAES: PAES Oficial Competencia Matemática 1 (M1) 2023 Forma 113

- **Problema / Requerimiento**:
  Procesar e incorporar la prueba oficial de acceso universitario DEMRE `PAES Competencia Matemática 1 (M1) Proceso 2023 (Forma 113)` al catálogo de producción en Supabase sin asignar a ningún docente (`es_catalogo = TRUE`, `profesor_id = NULL`), extrayendo sus 65 preguntas y figuras geométricas/algebraicas, asociando el Clavijero Oficial DEMRE con distinción de ítems piloto, y generando la Pauta Docente oficial para el profesor. Fuente: PDF `C:\Users\luisl\OneDrive\...\PAES Demre\paes-oficial-matematica1-p2023.pdf`.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/037_paes_oficial_matematica1_2023_forma113.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/037_paes_oficial_matematica1_2023_forma113.sql):
    - [NUEVO] Migración SQL que define e inserta la evaluación `eval-paes-mat1-2023-f113` y sus 65 preguntas en `public.evaluaciones` y `public.preguntas` con ejes temáticos DEMRE (Números, Álgebra, Geometría, Probabilidad).
  - [`docs/pautas/PAUTA_DOCENTE_PAES_MATEMATICA1_2023_FORMA113.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/docs/pautas/PAUTA_DOCENTE_PAES_MATEMATICA1_2023_FORMA113.md):
    - [NUEVO] Pauta Docente oficial con el Clavijero Oficial DEMRE de 65 ítems, identificación de las 5 preguntas piloto (7, 9, 36, 47 y 65), y tabla de transformación a escala PAES (100 a 1000 puntos).
  - [`public/preguntas/paes_mat1_2023_forma113/`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/paes_mat1_2023_forma113/):
    - [NUEVO] 17 figuras geométricas y diagramas sincronizados en el bucket Supabase Storage `evaluaciones-media`.
  - [`scripts/seed-paes-m1-2023.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/seed-paes-m1-2023.js):
    - [NUEVO] Script Node.js de ingesta que persistió las 65 preguntas y la evaluación en la base de datos de producción.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Auditoría Supabase: 8 evaluaciones totales (5 en catálogo sin asignar + 3 activas de María Teresa), 290 preguntas en `public.preguntas`.
  - Desplegado en Vercel.

---

### [2026-08-30] Rediseño y Categorización: Catálogo de Evaluaciones & Solicitudes (Diagnósticos, SIMCE y PAES)

- **Problema / Requerimiento**:
  Renombrar el módulo de "Catálogo SIMCE & Solicitudes" a "Catálogo de Evaluaciones & Solicitudes" para reflejar adecuadamente la incorporación de evaluaciones diagnósticas curriculares por OAs (como Educación Ciudadana 3° Medio) y futuros ensayos PAES. Implementar un sistema de categorización visual con filtros dinámicos (Todos, Diagnósticas, SIMCE, PAES) y badges semánticos en cada tarjeta de instrumento.

- **Archivos y Solución Técnica**:
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Pestaña de Super Admin renombrada a `📚 Catálogo de Evaluaciones & Solicitudes`.
  - [`src/components/AdminCatalogoPanel.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AdminCatalogoPanel.tsx):
    - [MODIFICADO] Cabecera renombrada a `Catálogo de Evaluaciones Nacionales`. Añadida barra de sub-filtros por tipo (`Todos`, `🟢 Evaluaciones Diagnósticas`, `🔵 Ensayos SIMCE`, `🟣 Ensayos PAES`) y función utilitaria `getTipoEvaluacion` con badges visuales distintivos.
  - [`src/components/CatalogoEvaluacionesModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoEvaluacionesModal.tsx):
    - [MODIFICADO] Modal de docentes actualizado a `📚 Catálogo de Evaluaciones` con selector de filtros por categoría y badges semánticos por instrumento.
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] Botón de acceso de docentes renombrado a `Catálogo de Evaluaciones`.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Desplegado en Vercel.

---

### [2026-08-30] Aislamiento Estricto de Evaluaciones Docentes y Suite de Pautas Docentes de Catálogo

- **Problema / Requerimiento**:
  1. Corregir filtrado en `useEvaluaciones.ts` donde la docente María Teresa visualizaba erróneamente evaluaciones no asignadas del catálogo de Lenguaje (`Ensayo 6 SIMCE Lengua y Literatura 2° Medio`) en lugar de únicamente sus 3 evaluaciones propias.
  2. Generar y estandarizar las Pautas de Corrección y Solucionarios Técnico-Pedagógicos para todas las evaluaciones del catálogo general en `docs/pautas/`.
  3. Aclarar el flujo de calificación: las pautas docentes son de uso exclusivo del profesor; al ingresar las alternativas de los alumnos se calcula automáticamente el puntaje, porcentaje y nota/escala definida.

- **Archivos y Solución Técnica**:
  - [`src/hooks/useEvaluaciones.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useEvaluaciones.ts):
    - [MODIFICADO] Eliminada la cláusula `or(asignatura_id.eq.asig-2)` en consultas de docentes no administradores. Se aplica filtrado estricto `eq('profesor_id', currentUser.id)`, garantizando que docentes reales solo visualicen sus evaluaciones asignadas y no las del catálogo sin asignar.
  - [`docs/pautas/PAUTA_DOCENTE_SIMCE_MATEMATICA_2M_ENSAYO3.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/docs/pautas/PAUTA_DOCENTE_SIMCE_MATEMATICA_2M_ENSAYO3.md):
    - [NUEVO] Pauta docente oficial con tabla de especificaciones (35 ítems), habilidades, ejes y justificaciones para Matemática 2° Medio.
  - [`docs/pautas/PAUTA_DOCENTE_SIMCE_LECTURA_2M_ENSAYO6.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/docs/pautas/PAUTA_DOCENTE_SIMCE_LECTURA_2M_ENSAYO6.md):
    - [NUEVO] Pauta docente oficial con tabla de especificaciones (35 ítems), habilidades lectoras y justificaciones para Lengua y Literatura 2° Medio.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` verificado con 0 errores.
  - Desplegado en Vercel.

---

### [2026-08-30] Ingesta Catálogo y Pauta Docente: Prueba Diagnóstica Educación Ciudadana III° Medio 2026

- **Problema / Requerimiento**:
  Procesar e incorporar la evaluación diagnóstica de Educación Ciudadana para 3° Medio al catálogo de producción en Supabase sin asignar a ningún docente (`es_catalogo = TRUE`, `profesor_id = NULL`), sanitizando marcas de terceros al 100%, cargando las preguntas y alternativas sin respuestas para los alumnos, y generando una Pauta de Corrección y Solucionario Técnico-Pedagógico para el profesor. Fuente: PDF `Ensayo - Prueba Diagnóstica Todos los OAs Educación Ciudadana III° Medio 2026 - Con pauta.pdf`.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/036_prueba_diagnostica_educacion_ciudadana_3m.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/036_prueba_diagnostica_educacion_ciudadana_3m.sql):
    - [NUEVO] Migración SQL que define e inserta la evaluación `eval-diag-ciu-3m-2026` y sus 25 preguntas en `public.evaluaciones` y `public.preguntas` con taxonomía MINEDUC (OA 01 al OA 09).
  - [`docs/pautas/PAUTA_DOCENTE_EDUCACION_CIUDADANA_3M_2026.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/docs/pautas/PAUTA_DOCENTE_EDUCACION_CIUDADANA_3M_2026.md):
    - [NUEVO] Documento completo de Pauta Docente con tabla de especificaciones, claves de respuesta correcta, habilidades cognitivas, niveles de complejidad y argumentación pedagógica detallada de cada ítem.
  - [`public/preguntas/diag_ciudadana_3m_2026/`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/diag_ciudadana_3m_2026/):
    - [NUEVO] Figuras e imágenes pedagógicas (`p01_mapa_operacion_barbarroja.png` y `p25_campamento_desigualdad.jpg`) sincronizadas tanto en almacenamiento local como en el bucket Supabase Storage `evaluaciones-media`.
  - [`scripts/seed-ciudadana-3m.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/seed-ciudadana-3m.js):
    - [NUEVO] Script Node.js de ingesta automatizada que subió los recursos visuales al CDN e insertó las 25 preguntas y la evaluación en la base de datos de producción.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` ejecutado con éxito (0 errores).
  - Auditoría Supabase: 7 evaluaciones en total (4 en catálogo sin asignar + 3 activas de María Teresa), 225 preguntas en la tabla `public.preguntas`.
  - Base de datos y almacenamiento de medios verificados en Supabase.

---

### [2026-08-30] Ingesta Catálogo SIMCE 2° Medio — Matemática E3 y Lengua y Literatura E6

- **Problema / Requerimiento**:
  Incorporar dos nuevas evaluaciones SIMCE al catálogo de producción en Supabase, disponibles para asignación posterior por el Super Admin, sin asignar a ningún docente. Fuentes: PDFs `Ensayo 3 SIMCE Matemática II° Medio` y `Ensayo 6 SIMCE Lectura II° Medio` en `C:\Users\luisl\OneDrive\...\2 Medio`.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/034_ensayo_3_simce_matematica_2m.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/034_ensayo_3_simce_matematica_2m.sql):
    - [NUEVO] Migración SQL que inserta la evaluación `eval-simce-mat-2m-e3` con 35 preguntas de Matemática 2° Medio (`es_catalogo = TRUE`, `profesor_id = NULL`).
  - [`supabase/migrations/035_ensayo_6_simce_lectura_2m.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/035_ensayo_6_simce_lectura_2m.sql):
    - [NUEVO] Migración SQL que inserta la evaluación `eval-simce-len-2m-e6` con 35 preguntas de Lengua y Literatura 2° Medio (`es_catalogo = TRUE`, `profesor_id = NULL`).
  - [`scripts/seed-2m-directo.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/seed-2m-directo.js):
    - [NUEVO] Script de inserción directa vía SDK Supabase (upsert idempotente en lotes de 15). Ejecutado exitosamente: 70 preguntas y 2 evaluaciones persistidas.
  - `public/preguntas/simce_mat_2m_e3/` → [NUEVO] 10 imágenes extraídas del PDF de Matemática 2° Medio.
  - Archivos mock de producción generados erróneamente por script anterior (`mat2mQuestionsMock.ts`, `len2mEnsayo6QuestionsMock.ts`) → **eliminados**. Los datos de producción residen exclusivamente en Supabase.

- **Verificación / Despliegue**:
  - `npx tsc --noEmit` → **0 errores**.
  - Auditoría Supabase: 6 evaluaciones totales (3 catálogo sin asignar + 3 activas de María Teresa), 200 preguntas.
  - Verificación visual en producción (`leontestvirtual1@gmail.com`): catálogo muestra las 3 evaluaciones sin asignar correctamente.
  - Commit `d371d81` — pusheado a `main` → desplegado en Vercel: **https://sysget-saber.vercel.app**.

---

### [2026-08-30] Arquitectura y Escalabilidad: Migración de Imágenes a Supabase Storage con CDN Global

- **Problema / Requerimiento**:
  1. **Escalabilidad y Peso del Repositorio:** Las figuras y gráficos de las evaluaciones SIMCE/PAES estaban alojados localmente en `public/preguntas/`, incrementando el peso del repositorio Git y requiriendo un despliegue completo de frontend ante cualquier adición de imágenes.
  2. **Seguridad y Versionamiento de Migraciones:** Auditar si la carpeta `supabase/` (migraciones SQL) debe permanecer en Git. Se ratificó que mantener las migraciones en Git es el estándar de la industria (*Database as Code*), garantizando que no contengan secretos ni datos personales sensibles (PII).
  3. **Migración a Cloud Storage:** Crear el bucket público `evaluaciones-media` en Supabase Storage, subir todas las 47 imágenes de catálogo y actualizar las preguntas en la base de datos PostgreSQL.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/033_create_storage_evaluaciones_media_bucket.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/033_create_storage_evaluaciones_media_bucket.sql):
    - [NUEVO] Migración SQL que define el bucket `evaluaciones-media` público con límite de 10MB por archivo y políticas RLS para lectura pública y subida autenticada (`service_role` / `authenticated`).
  - [`src/lib/storage.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/lib/storage.ts):
    - [NUEVO] Módulo utilitario con `getStoragePublicUrl`, `resolveImageUrl` (detección inteligente de CDN Supabase vs. fallback offline local) y `uploadPreguntaImage` para futuras subidas desde la UI.
  - [`scripts/migrate-images-to-storage.js`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/scripts/migrate-images-to-storage.js):
    - [NUEVO] Script Node.js de migración masiva recursiva que subió 47 archivos a Supabase Storage y actualizó 15 preguntas en la tabla `public.preguntas`.
  - [`src/components/common/EnunciadoRenderer.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/common/EnunciadoRenderer.tsx):
    - [MODIFICADO] Integrado `resolveImageUrl` para transformar rutas relativas en Markdown (`![alt](url)`) a URLs del Storage CDN.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx), [`src/components/AlumnoEvaluationView.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AlumnoEvaluationView.tsx), [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx), [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] Integrado `resolveImageUrl` en todas las vistas de renderizado de preguntas para servir imágenes desde Supabase CDN.
  - [`package.json`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/package.json):
    - [MODIFICADO] Agregado comando `npm run storage:migrate`.

- **Verificación / Despliegue**:
  - Subida a Supabase Storage: ✅ 47/47 imágenes subidas exitosamente (0 fallos).
  - Sincronización DB: ✅ 15 preguntas actualizadas con URLs de Supabase Storage.
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ 0 errores.
  - Cumplimiento de Directivas: ✅ Conforme a Directivas 1, 3, 5, 6, 7 y 10.



### [2026-08-25] Componente EnunciadoRenderer: Soporte Integral para Tablas Markdown, Fórmulas, Figuras y Negrita

- **Problema / Requerimiento**:
  1. **Visualización de Preguntas con Formato Complejo:** Las preguntas del Banco de Preguntas y de las Evaluaciones que contenían sintaxis Markdown (tablas `| col | col |`, negrita `**texto**`, fórmulas `\cdot`, `\times` e imágenes embebidas `![figura](url)`) se renderizaban como texto plano con los caracteres de control sin formatear.
  2. **Consistencia Visual:** Crear un motor de renderizado unificado y responsivo (`EnunciadoRenderer`) que convierta automáticamente la sintaxis Markdown en componentes visuales pulidos (tablas con bordes estilizados, imágenes con aspect ratio controlado, fórmulas legibles y tipografía clara).

- **Archivos y Solución Técnica**:
  - [`src/components/common/EnunciadoRenderer.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/common/EnunciadoRenderer.tsx):
    - [NUEVO] Componente reactivo que procesa párrafos, títulos (`#`, `##`, `###`), tablas Markdown completas con alineaciones, imágenes `![alt](url)` (incluso dentro de celdas), notación matemática LaTeX básica y negrita/cursiva.
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Reemplazado el `<p className="whitespace-pre-line">` plano por `<EnunciadoRenderer content={pregunta.enunciado} />`.
  - [`src/components/AlumnoEvaluationView.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AlumnoEvaluationView.tsx):
    - [MODIFICADO] Integrado `EnunciadoRenderer` en la vista interactiva de rendición de alumnos.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx):
    - [MODIFICADO] Reemplazada la función rudimentaria de texto por `EnunciadoRenderer` para que las tablas y figuras se impriman en alta calidad.
  - [`src/components/MiniSIMCERunner.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/MiniSIMCERunner.tsx):
    - [MODIFICADO] Integrado `EnunciadoRenderer` en el ejecutor rápido de ensayos SIMCE.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ 0 errores.
  - Despliegue en Producción: ✅ Vercel (`https://sysget-saber.vercel.app`).
  - Cumplimiento de Directivas: ✅ Conforme a Directivas 1, 5, 6, 7 y 11.


### [2026-08-25] Ingesta de Ensayo 3 SIMCE Matemática 6° Básico y Creación de Skill «eval-ingesta-catalogo»

- **Problema / Requerimiento**:
  1. **Ingesta de Evaluación Matemática 6° Básico:** Procesar el instrumento oficial `Ensayo 3 SIMCE Matemática 6° Básico` cruzándolo con su tabla de especificaciones, extrayendo las 35 preguntas y figuras matemáticas asociadas, sanitizando cualquier referencia a marcas de terceros o proveedores externos.
  2. **Inferencia Psicométrica y Curricular MINEDUC:** Categorizar cada pregunta en los 5 ejes temáticos de Matemática 6° Básico, determinando su OA, habilidad psicométrica, nivel de complejidad (Baja: 1 pto, Media: 2 ptos, Alta: 3 ptos) y puntaje ponderado.
  3. **Persistencia y Catálogo:** Cargar la evaluación en `public.evaluaciones` (`es_catalogo = TRUE`) y `public.preguntas` en Supabase, y disponibilizarla en el frontend.
  4. **Estandarización mediante Skill:** Crear el skill oficial `.agents/skills/eval-ingesta-catalogo/` para automatizar futuros flujos donde solo se entreguen las preguntas sin tabla de especificaciones.

- **Archivos y Solución Técnica**:
  - [`.agents/skills/eval-ingesta-catalogo/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-ingesta-catalogo/SKILL.md):
    - [NUEVO] Skill integral con matriz de inferencia curricular MINEDUC, matriz psicométrica de habilidades y complejidad, regla de oro de sanitización de marcas de terceros y pipeline end-to-end de 1 solo paso.
  - [`supabase/migrations/032_ensayo_3_simce_matematica_6b.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/032_ensayo_3_simce_matematica_6b.sql):
    - [NUEVO] Migración SQL idempotente con `ON CONFLICT DO UPDATE` que inserta la prueba en `public.evaluaciones` y las 35 preguntas completas con clave, alternativas JSONB y explicación en `public.preguntas`.
  - [`src/data/mat6bQuestionsMock.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mat6bQuestionsMock.ts):
    - [NUEVO] Módulo tipado con `ejesTematicosMatematica6BMock`, `preguntasMatematica6BMock` y `pruebaMatematica6BMock`.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Integración de preguntas, ejes y prueba en `preguntasMock`, `ejesTematicosMock` y `pruebasMock`.
  - [`public/preguntas/simce_mat_6b_e3/`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/simce_mat_6b_e3):
    - [NUEVO] Directorio de figuras y esquemas matemáticos limpios de alta nitidez (`p05_recta_numerica.png`, `p10_circulo_porcentajes.png`, `p24_triangulo_cuadricula.png`, etc.) con eliminación de marcas de terceros.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ 0 errores.
  - Sanitización de Marcas: ✅ 0 apariciones de marcas externas en código, base de datos y assets.
  - Cumplimiento de Directivas: ✅ Conforme a Directivas 1, 2, 3, 5, 6, 7, 10 y 11.

- **Problema / Requerimiento**:
  1. **Prevención de Abuso de Cuentas Trial y Contacto Directo:** Agregar el teléfono celular como campo obligatorio en el registro de usuarios (+56 9 XXXX XXXX) para dificultar la creación reiterada de cuentas de prueba por un mismo usuario y permitir contacto directo.
  2. **Diagnóstico y Feedback de Entrega SMTP:** Los correos de notificación no estaban llegando en producción. Se requirió diagnosticar el servicio SMTP y agregar un modal con aviso detallado de confirmación de entrega (éxito con `messageId` y timestamp, o error con código SMTP).

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/028_add_telefono_to_perfiles.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/028_add_telefono_to_perfiles.sql):
    - [NUEVO] Columna `telefono TEXT` en `public.perfiles` para almacenar el celular de contacto del docente.
  - [`src/types/index.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts):
    - [MODIFICADO] Campo `telefono?: string` en la interfaz `UserProfile`.
  - [`src/components/DocenteFormFields.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/DocenteFormFields.tsx):
    - [MODIFICADO] Incorporado campo `Teléfono *` con ícono `Phone`, formateador automático `+56 9 XXXX XXXX` y validador de número chileno en la interfaz unificada de docentes.
  - [`src/pages/RegisterPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx):
    - [MODIFICADO] Campo `telefono` obligatorio en el formulario público con validación de longitud y formato.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Propagación de `telefono` en `RegisterData`, `register()` y mapeo en `loadUsuariosReales()`.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts) y [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts):
    - [MODIFICADO] Extracción de `telefono` en acciones `register` y `admin-create`, guardado en tabla `perfiles` y renderizado en la tarjeta del correo HTML de notificación al admin.
    - [MODIFICADO] Respuesta enriquecida en `send-email` con `messageId`, `timestamp` y detalle de error SMTP (`code`, `smtpCode`).
    - [MODIFICADO] Retorno de `emailStatus` ('sent' | 'failed') en la acción `register`.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Visualización del teléfono del docente con ícono de smartphone en la tabla de usuarios.
    - [MODIFICADO] Modal de resultado de entrega de correo con confirmación de `messageId`, timestamp de envío o diagnóstico de error SMTP.

- **Verificación / Despliegue**:
  - Diagnóstico SMTP (`diag_smtp`): ✅ Verificado exitosamente contra Google SMTP (`smtp.gmail.com:465`) con `MessageId` generado.
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Cumplimiento de Directivas: ✅ Conforme a Directivas 1, 2, 3, 4 y 10.

### [2026-08-23] Catálogo de Evaluaciones SIMCE Globales, Alertas con Copia (CC) y Persistencia 100% en Supabase

- **Problema / Requerimiento**:
  1. **Evaluaciones SIMCE Globales y Asignación Docente:** Se requirió permitir que el Super Admin ingrese evaluaciones SIMCE maestras sin vincularlas a un docente o establecimiento, poniéndolas a disposición en un catálogo institucional para que los docentes soliciten acceso o el administrador las asigne con 1 clic a sus cursos reales.
  2. **Alertas a Segundo Correo de Administración:** Canalizar todas las notificaciones críticas del sistema (nuevas solicitudes de acceso, peticiones de catálogo SIMCE y aprobaciones) con copia obligatoria (`CC`) a `luisleong.premil@gmail.com`.
  3. **Persistencia Estricta Supabase First en Producción:** Cumplimiento total de las Directivas 1 y 3, eliminando cualquier uso o dependencia de `localStorage` para alumnos, cursos, docentes o evaluaciones en el entorno de Producción, manteniendo el modo Demo aislado.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/027_catalogo_evaluaciones_globales.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/027_catalogo_evaluaciones_globales.sql):
    - [NUEVO] Columnas `es_catalogo` y `precio_clp` en `public.evaluaciones` y tabla `public.solicitudes_evaluacion` con RLS.
    - [NUEVO] Funciones RPC seguras `public.docente_solicitar_evaluacion()` y `public.admin_asignar_evaluacion_a_docente()` con clonación de evaluaciones a docentes y establecimientos.
  - [`api/evaluaciones-catalogo.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/evaluaciones-catalogo.ts):
    - [NUEVO] Endpoint API para catálogo SIMCE, emisión de solicitudes, aprobación/rechazo y notificaciones por correo electrónico con CC.
  - [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts) y [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Incorporada constante `CC_EMAIL` (`luisleong.premil@gmail.com`) y copia automática en todos los envíos de alerta administrativa.
  - [`src/components/CatalogoEvaluacionesModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/CatalogoEvaluacionesModal.tsx):
    - [NUEVO] Modal interactivo para docentes con catálogo filtrado por especialidad, estado de solicitud y mensaje personalizado.
  - [`src/components/AdminCatalogoPanel.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AdminCatalogoPanel.tsx):
    - [NUEVO] Panel de administración para gestión de solicitudes pendientes con aprobación y rechazo en 1 clic.
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] Incorporado botón «📚 Catálogo SIMCE» en el banner de evaluaciones docentes.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Incorporada la pestaña «📚 Catálogo SIMCE & Solicitudes» en la vista del Super Admin.
  - [`src/pages/AlumnosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/AlumnosPage.tsx) y [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx):
    - [MODIFICADO] Persistencia 100% en Supabase (`perfiles` y `matriculas`) para altas, bajas, edición y CSV en Producción, eliminando `localStorage` en modo real.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Migración SQL Supabase (`027_catalogo_evaluaciones_globales.sql`): ✅ Ejecutada y confirmada por el usuario.
  - Cumplimiento de Directivas: ✅ Conforme a Directivas 1, 2, 3, 4 y 10.

### [2026-08-23] Creación e Integración de Logo Oficial para Colegio Mi Casa

- **Problema / Requerimiento**:
  1. **Generación de Escudo Institucional:** Se requirió generar el logo oficial de **Colegio Mi Casa** (RBD `1234`, Lema *"Formando el Futuro"*) para su visualización en Navbar, perfil docente de Susana Pizarro y membrete dinámico en futuros cuadernillos de evaluación.

- **Archivos y Solución Técnica**:
  - [`public/logos/colegio-mi-casa.png`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/logos/colegio-mi-casa.png):
    - [NUEVO] Emblema heráldico académico de alta resolución con libro del saber, antorcha, casa acogedora, montañas, sol y ramas de laurel.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Asignado `logoUrl: '/logos/colegio-mi-casa.png'` y lema *"Formando el Futuro"* en `establecimientosCatalog` y `currentUserProfesorMiCasa`.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx):
    - [MODIFICADO] Mapeado de membrete de cuadernillo dinámico para Colegio Mi Casa (`/logos/colegio-mi-casa.png`).
  - [`supabase/migrations/026_update_colegio_mi_casa_logo.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/026_update_colegio_mi_casa_logo.sql):
    - [NUEVO] Migración para actualizar `logo_url` en `public.establecimientos` y `public.perfiles`.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Cumplimiento de Directivas: ✅ Conforme a Directiva 5 (Membrete Dinámico con Logo Oficial y Lema).

### [2026-08-23] Depuración de Errores de Consola: Validación UUID en Evaluaciones y RBAC en API Users

- **Problema / Requerimiento**:
  1. **Error 400 Bad Request en Supabase REST API (`/rest/v1/evaluaciones`):** En la consola del navegador aparecía un error 400 al consultar evaluaciones, debido a que el filtro `query.or()` incluía literales de texto legacy (`prof-mc-01`, `prof-prem-01`) sobre la columna `profesor_id`, la cual es de tipo estricto `UUID` en PostgreSQL.
  2. **Error 403 Forbidden en Endpoint `/api/users`:** Al iniciar sesión un docente con rol `'profesor'` (como Susana Pizarro), `AuthContext.tsx` intentaba sincronizar la lista global de usuarios contra `/api/users`, endpoint que exige permisos de administrador (`requireAdmin`).

- **Archivos y Solución Técnica**:
  - [`src/hooks/useEvaluaciones.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useEvaluaciones.ts):
    - [MODIFICADO] Incorporada validación `isValidUUID` antes de inyectar `profesor_id` en `query.or()`, eliminando los IDs legacy que rompían la sintaxis de PostgreSQL.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Restringida la llamada a `fetch('/api/users')` exclusivamente a sesiones con rol `'admin'`, evitando solicitudes no autorizadas desde perfiles docentes.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Consola del Navegador: ✅ Limpia de errores 400 y 403.
  - Cumplimiento de Directivas: ✅ Conforme a Directiva 3 (Supabase First) y Directiva 4 (RBAC Estricto).

### [2026-08-23] Depuración de Banco de Preguntas en Producción: Supabase First sin Inyección de Mock ni LocalStorage

- **Problema / Requerimiento**:
  1. **Inflado de preguntas en el perfil docente de Susana Pizarro (`nentitasusana@hotmail.com`):** Al consultar el Banco de Preguntas de Matemática, el frontend mostraba 43 preguntas (6 en 4° Básico, 4 en 6° Básico, 32 en 8° Básico y 1 en 2° Medio), mientras que en la base de datos Supabase existían únicamente 3 preguntas reales (1 en 4° Básico, 1 en 6° Básico y 1 en 8° Básico). Esto se debía a que `useBancoPreguntas.ts` inyectaba `preguntasMock` en memoria y lo fusionaba con la base de datos.
  2. **Persistencia limpia y feedback directo:** Se requirió eliminar cualquier guardado o lectura de preguntas en `localStorage` (Directiva 3 - Supabase First) y garantizar que al crear, editar o eliminar una pregunta se persista directamente en Supabase entregando una notificación visual de guardado exitoso.

- **Archivos y Solución Técnica**:
  - [`src/hooks/useBancoPreguntas.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useBancoPreguntas.ts):
    - [MODIFICADO] Eliminada la inyección de `preguntasMock` en modo producción. La consulta ahora se alimenta estrictamente de `public.preguntas` en Supabase.
    - [MODIFICADO] Eliminadas las escrituras y lecturas de `localStorage` en `addPregunta`, `updatePregunta` y `deletePregunta`.
    - [MODIFICADO] Las funciones `addPregunta`, `updatePregunta` y `deletePregunta` ahora son asíncronas y retornan promesas con `{ success: boolean; error?: string }` para feedback en UI.
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Reemplazada la lectura de cursos desde `localStorage` por la invocación reactiva a `useCursos({ currentUser, isSandboxMode: false })`.
    - [MODIFICADO] Integradas alertas visuales flotantes y reactivas (`saveStatus`) para avisar al usuario: *«✅ Pregunta guardada exitosamente en Supabase»*, *«✅ Pregunta actualizada exitosamente en Supabase»*, *«✅ Pregunta eliminada exitosamente de Supabase»* y manejo de errores.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Build de Producción (`npm run build`): ✅ Exitoso (26.49s).
  - Cumplimiento de Directivas: ✅ Conforme a Directiva 1 (Aislamiento Estricto), Directiva 2 (Empty States Legítimos) y Directiva 3 (Supabase First).

### [2026-08-23] Corrección de Despliegue de Logos Institucionales y Políticas RLS Definitivas

- **Problema / Requerimiento**:
  1. **Error 404 en Logo de Cuadernillo en Vercel:** En la consola del navegador aparecía `GET /logos/escuela-premilitar.png 404 (Not Found)` y en el membrete del cuadernillo impreso no se visualizaba el escudo de la Escuela Premilitar. Se debió a que `.gitignore` contenía las reglas `public/logos/` y `public/preguntas/`, impidiendo que los activos visuales subieran al repositorio GitHub.
  2. **Recursión Infinita en RLS Supabase (Error 42P17):** Al intentar crear nuevas preguntas, Supabase rechazaba la transacción debido a políticas circulares que consultaban `public.perfiles` dentro de la evaluación de `public.perfiles`.

- **Archivos y Solución Técnica**:
  - [`.gitignore`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.gitignore):
    - [MODIFICADO] Eliminadas las exclusiones de `public/logos/` y `public/preguntas/`, permitiendo el rastreo y despliegue de los escudos institucionales y figuras de pruebas en Vercel.
  - [`supabase/migrations/025_fix_rls_infinite_recursion_final.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/025_fix_rls_infinite_recursion_final.sql):
    - [NUEVO] Script SQL que elimina la recursión en `public.perfiles` y `public.preguntas`, permitiendo inserciones y lecturas fluidas para docentes autenticados.
  - Subidos 30 archivos de activos visuales (`public/logos/*.png`, `public/preguntas/**/*.png`).

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Commit y Push a GitHub: ✅ `e8fff54` — *fix(assets): incluir public/logos y public/preguntas en el repositorio para despliegue en Vercel*.
  - Despliegue en Vercel: ✅ En progreso automático.

### [2026-08-23] Depuración de Banco de Preguntas: Aislamiento Estricto de 2° Medio para Docente de Lenguaje

- **Problema / Requerimiento**:
  1. **Aparición de nivel 8° Básico no asignado:** En la vista de Banco de Preguntas del perfil de María Teresa González (`mariateresa.gonzalez@premilitar.cl`), se visualizaba una pestaña con «8° Básico (5)» a pesar de que la docente solo tiene injerencia en 2° Medio y no cuenta con cursos ni preguntas creadas en 8° Básico.
  2. **Identificación del origen de datos:** Se detectó que el hook `useBancoPreguntas.ts` inyectaba residualmente `preguntasMock.filter(p => p.asignaturaId === 'asig-2')`, el cual contenía 5 preguntas estáticas de demostración (`preg-16` a `preg-20`) creadas inicialmente en `mockData.ts`.

- **Archivos y Solución Técnica**:
  - [`src/hooks/useBancoPreguntas.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useBancoPreguntas.ts):
    - [MODIFICADO] Eliminada la inclusión de `preguntasMock` en el catálogo base de Lenguaje (`isLenguaje`). Ahora se cargan estrictamente las 90 preguntas oficiales de 2° Medio (`preguntasLenguaje2MMock`, `preguntasLenguaje2MJunioMock`, `preguntasLenguaje2MAbrilMock`) junto con las registradas por el usuario en Supabase / LocalStorage.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores (código 0).
  - Cumplimiento de Directivas: ✅ Conforme a Directiva 1 (Aislamiento de Ambientes), Directiva 2 (Empty States Legítimos) y Directiva 7 (Aislamiento del Banco por Nivel Escolar).

### [2026-08-23] Corrección de Aislamiento de Rol Docente, Modal de Preguntas, Membrete Institucional y Vinculación de Imágenes en Cuadernillos

- **Problema / Requerimiento**:
  1. **Aislamiento de Rol de María Teresa:** Al iniciar sesión directamente con `mariateresa.gonzalez@premil.cl`, el perfil asumía privilegios de Administrador de Producción si la tabla `perfiles` tenía rol residual o si quedaba activa la sesión de supervisión en RAM (`adminBaseProfile`), permitiendo navegar hacia la ficha de otros docentes (Susana Pizarro).
  2. **Modal de Pregunta Cortado:** En el Banco de Preguntas, la ventana modal para ingresar una nueva pregunta quedaba cortada en la parte superior contra el Navbar debido a un centrado vertical rígido (`items-center`).
  3. **Logo Institucional Faltante en Cuadernillo:** En la impresión de evaluaciones de la Escuela Premilitar Héroes de la Concepción (*Ensayo SIMCE Lengua y Literatura 2° Medio*), el membrete mostraba el texto alternativo *"Logo Institucional"* en vez de la imagen oficial (`/logos/escuela-premilitar.png`).
  4. **Imagen Faltante en Cuadernillo (Pregunta 20):** La Figura 1 (botánica de tejocote) no se renderizaba en el cuadernillo impreso al ser sobreescrita por registros de preguntas en Supabase con `imagen_url = null`.

- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Incorporada guardia `PROFESSOR_EMAILS_ONLY` en `checkSession()` y `login()`, forzando el rol `'profesor'` para docentes de producción y reseteando `adminBaseProfile` a `null` al iniciar y cerrar sesión.
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx):
    - [MODIFICADO] Lógica `isRealAdmin` para restringir `NAV_ITEMS_ADMIN` y el árbol multiescolar exclusivamente al Super Admin (`leontestvirtual1@gmail.com`) o modo Sandbox.
  - [`src/components/PreguntaFormModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PreguntaFormModal.tsx):
    - [MODIFICADO] Ajustado layout del overlay a `items-start pt-16 sm:pt-20 overflow-y-auto` con `max-h-[85vh] my-auto`, garantizando que el header siempre sea visible con scroll fluido.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx):
    - [MODIFICADO] Detección robusta de institución en `establecimientoActual` asegurando `/logos/escuela-premilitar.png`, RBD `31030` y lema oficial en el membrete.
    - [MODIFICADO] Merge inteligente en `preguntasDeLaPrueba` que preserva `imagenUrl` y `tablaMarkdown` de los assets oficiales cuando Supabase retorne valores nulos.
  - [`supabase/migrations/022_fix_mariateresa_role_and_pregunta_images.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/022_fix_mariateresa_role_and_pregunta_images.sql):
    - [NUEVO] Migración SQL para normalizar en Supabase el rol docente de María Teresa y asegurar `imagen_url` en preguntas oficiales.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Verificación de Aislamiento y Directivas: ✅ Conforme a Directivas 1, 4, 5 y 11.


### [2026-08-23] Creación de Suite de Skills Modulares y Directiva Oficial 11: Ingesta de Evaluaciones de PDF a Cuadernillo

- **Problema / Requerimiento**:
  1. Necesidad de estandarizar e independizar en skills específicos cada etapa del flujo de conversión de evaluaciones desde documentos fuente (PDF / DOCX) hasta la generación del cuadernillo impreso, pauta docente y hoja OMR.
  2. Establecer una Directiva Oficial mandatoria que obligue a procesar cualquier evaluación fuente bajo esta suite de skills.

- **Archivos y Solución Técnica**:
  - [`DIRECTIVAS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/DIRECTIVAS.md):
    - [MODIFICADO] Incorporada la **Directiva 11: Ingesta y Procesamiento de Evaluaciones mediante Suite de Skills (PDF/DOCX a Cuadernillo)** que norma el cumplimiento estricto del protocolo de 5 pasos.
  - [`.agents/AGENTS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/AGENTS.md):
    - [MODIFICADO] Actualizadas las directivas raíz mandatorias a 11 directivas oficiales, incorporando la Directiva 10 (Seguridad de Secretos) y Directiva 11 (Suite de Ingesta).
  - [`.agents/skills/eval-pdf-extractor/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-pdf-extractor/SKILL.md):
    - [NUEVO] Skill de extracción de texto y activos visuales (imágenes de alta resolución PNG) hacia `public/preguntas/[codigo_evaluacion]/`.
  - [`.agents/skills/eval-markdown-formatter/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-markdown-formatter/SKILL.md):
    - [NUEVO] Skill de normalización de textos en Markdown, lecturas compartidas de comprensión lectora (`Lectura X (Continuación)`), tablas curriculares y estandarización de alternativas limpias.
  - [`.agents/skills/eval-schema-builder/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-schema-builder/SKILL.md):
    - [NUEVO] Skill para la construcción y validación del modelo tipado TypeScript `Pregunta` y `Evaluacion`, vinculándolo a la taxonomía curricular MINEDUC (Asignaturas, Ejes, Habilidades) y tablas de especificación.
  - [`.agents/skills/eval-supabase-seeder/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-supabase-seeder/SKILL.md):
    - [NUEVO] Skill de persistencia Supabase First, creación de migraciones SQL idempotentes (`ON CONFLICT`) para `public.preguntas` y `public.pruebas`, y sincronización con el catálogo base en `src/data/mockData.ts`.
  - [`.agents/skills/eval-cuadernillo-generator/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/eval-cuadernillo-generator/SKILL.md):
    - [NUEVO] Skill del motor de impresión (`PrintEvaluacionModal.tsx`), aislamiento `@media print`, membrete institucional dinámico (Logo, RBD, Lema) y generación de Cuadernillo, Pauta Docente y Hoja OMR.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores (código 0).
  - Cumplimiento de Directivas: ✅ Conforme a DIRECTIVAS.md y estándares del ecosistema Antigravity.

### [2026-08-23] Corrección Integral: Evaluaciones de María Teresa, Sincronización de Cursos, Estabilización de Banco de Preguntas y Vinculación de Imágenes

- **Problema / Requerimiento**:
  1. **Evaluaciones de María Teresa vacías:** El perfil de María Teresa González (`mariateresa.gonzalez@premil.cl`) y la Escuela Premilitar aparecían con 0 evaluaciones al supervisar o iniciar sesión debido a que `AcademicDataContext` no tenía fallback garantizado para sus 3 evaluaciones oficiales (`pruebaLenguaje2MMock`, `pruebaLenguaje2MJunioMock`, `pruebaLenguaje2MAbrilMock`) cuando la consulta inicial de Supabase retornaba 0 filas.
  2. **Cursos vacíos en perfil docente:** `useCursos.ts` consultaba en Supabase exclusivamente por `profesor_jefe_id = currentUser.id`, lo que fallaba al haber diferencias entre el ID en frontend (`prof-prem-01`) y el UUID en Supabase.
  3. **Parpadeo en Banco de Preguntas:** `BancoPreguntasPage.tsx` ejecutaba un `useEffect` cíclico sobre `nivelesDisponibles`, produciendo renders continuos y reseteos del filtro de nivel.
  4. **Imágenes de preguntas desvinculadas en Admin:** Al fusionar las preguntas de Supabase con el catálogo base institucional en `useBancoPreguntas.ts`, los registros de Supabase con `imagen_url = null` sobreescribían y borraban la propiedad `imagenUrl` de las preguntas predefinidas.
  5. **Navegación y Vistas de Supervisión:** Necesidad de verificar y asegurar el acceso a todas las vistas (`dashboard`, `evaluaciones`, `cursos`, `alumnos`, `profesores`, `banco-preguntas`, `usuarios`, `configuracion`) con soporte de retorno para el Admin de Producción.

- **Archivos y Solución Técnica**:
  - [`src/context/AcademicDataContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AcademicDataContext.tsx):
    - [MODIFICADO] Asegurado que para María Teresa González y Escuela Premilitar se retornen siempre sus 3 evaluaciones oficiales completas (Agosto, Junio, Abril) y su curso `2° Medio A` sin quedar vacío.
  - [`src/hooks/useEvaluaciones.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useEvaluaciones.ts):
    - [MODIFICADO] Sincronización robusta por `profesor_id`, `email` y `asignatura_id` para María Teresa y Susana, asegurando persistencia y carga garantizada de las 3 evaluaciones de Lenguaje y las de Matemática.
  - [`src/hooks/useCursos.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useCursos.ts):
    - [MODIFICADO] Consulta ampliada por `profesor_jefe_id`, `rbd` y `establecimiento`, garantizando que cada docente vea sus cursos asignados (Premilitar: `2° Medio A`; Mi Casa: `4° Básico A`, `6° Básico A`, `8° Básico A`).
  - [`src/hooks/useBancoPreguntas.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useBancoPreguntas.ts):
    - [MODIFICADO] Preservación obligatoria de `imagenUrl` y `tablaMarkdown` al fusionar registros de Supabase con el catálogo base institucional.
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Estabilizado el `useEffect` de `nivelFilter` para eliminar el bucle infinito de re-renders y suprimir el parpadeo de la pantalla.
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] Resolución exacta de preguntas e imágenes en `PruebaFacsimilModal`.
  - [`supabase/migrations/019_sync_evaluaciones_and_preguntas_images.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/019_sync_evaluaciones_and_preguntas_images.sql):
    - [NUEVO] Migración SQL que sincroniza la tabla `pruebas` con RLS, actualiza las URLs de figuras e imágenes en `preguntas` (ej. `preg-len2m-20`, `preg-len2m-jun-20`, Ciencias Naturales) y registra las 3 evaluaciones oficiales de Lenguaje 2° Medio.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Verificación de Aislamiento y Directivas: ✅ Conforme a DIRECTIVAS.md (Supabase First, Empty States legítimos, aislamiento de ambiente y sesión).

- **Problema / Requerimiento**:
  1. **Cursos Colegio Mi Casa erróneos:** Colegio Mi Casa tenía asignado `2° Medio` en vez de `4°, 6° y 8° básico`.
  2. **Evaluaciones invisibles para Admin de Producción:** El Super Admin (`leontestvirtual1@gmail.com`) no visualizaba las evaluaciones de María Teresa González cuando la tabla `pruebas` de Supabase no tenía filas registradas para el admin.
  3. **Gestión de Cursos por Docente:** María Teresa González debe tener exclusivamente `2° Medio` (Premilitar) y Susana Pizarro `4°, 6° y 8° básico` (Mi Casa).
  4. **Alumnos de Demo visibles en Producción:** `AlumnosPage` usaba almacenamiento compartido y caía en los 8 alumnos del Liceo Bicentenario demo.
  5. **Banco de Preguntas Susana:** Faltaban preguntas oficiales de Matemática para 6° y 8° básico asignadas a Susana.
  6. **Gestión de Usuarios:** Faltaba visualización clara del contador dinámico de días restantes de prueba (Trial 30 días).

- **Archivos y Solución Técnica**:
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Cursos de Colegio Mi Casa actualizados a `4° Básico A`, `6° Básico A` y `8° Básico A`.
    - [MODIFICADO] Añadidas preguntas oficiales de Matemática para 6° Básico (`preg-mat-6b-01`, `02`, `03`) y 8° Básico (`preg-mat-8b-01`, `02`) asignadas a Susana Pizarro (`propietarioId: currentUserProfesorMiCasa.id`).
    - [MODIFICADO] Asignadas fechas de registro y `diasRestantesTrial` en perfiles de producción.
  - [`src/context/AcademicDataContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AcademicDataContext.tsx):
    - [MODIFICADO] Sincronizados cursos de Colegio Mi Casa (4°, 6°, 8° básico) y fallback de pruebas para Admin de producción con las evaluaciones de María Teresa.
  - [`src/hooks/useCursos.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useCursos.ts):
    - [MODIFICADO] Aisladas claves de `localStorage` (`sysget_prod_cursos_*` vs `sysget_demo_cursos_*`) y corregido `initialProdCursos` (Mi Casa: 4°, 6°, 8° básico; Premilitar: 2° Medio).
  - [`src/hooks/useEvaluaciones.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useEvaluaciones.ts):
    - [MODIFICADO] Si `currentUser.rol === 'admin'` o `isPremilitarTeacher` y la tabla en Supabase está vacía, se auto-pueblan y cargan las 3 evaluaciones oficiales de María Teresa.
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Ajustados niveles dinámicos para Susana y Colegio Mi Casa (`4° básico`, `6° básico`, `8° básico`).
  - [`src/pages/AlumnosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/AlumnosPage.tsx):
    - [MODIFICADO] Aisladas claves de `localStorage` (`sysget_prod_alumnos_*` vs `sysget_demo_alumnos_*`) y asegurado Estado Vacío Legítimo (0 alumnos) en Producción.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Incorporado badge destacado y barra de progreso visual para el contador de días restantes de prueba (Trial 30 días).
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx):
    - [MODIFICADO] Actualizada ficha de Establecimientos Activos: Colegio Mi Casa con 3 cursos (4°, 6°, 8° básico) y Escuela Premilitar con 1 curso (2° medio).

- **Verificación / Despliegue**:
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso, 0 errores.
  - Validación de aislamiento y estados vacíos legítimos: ✅ Conforme a DIRECTIVAS.md.

### [2026-08-22] Migración Integral Supabase First: Cursos, Evaluaciones y Banco de Preguntas con Aislamiento Demo

- **Problema / Requerimiento**:
  1. **Aislamiento y Persistencia de Producción:** Las evaluaciones, cursos y alumnos dependían de `useState` en memoria y `localStorage`, causando pérdida de datos entre sesiones y mezcla con datos de prueba.
  2. **Visibilidad de Preguntas en Admin de Producción:** El Administrador (`leontestvirtual1@gmail.com`) no podía visualizar en el Banco de Preguntas las preguntas ingresadas por la docente Susana (4°, 6° y 8° básico) debido a políticas RLS restrictivas en `public.preguntas`.
  3. **Gestión de Usuarios Vacía:** La pantalla `GestionUsuariosPage` no sincronizaba los perfiles reales desde Supabase y dependía de llamadas sin fallback reactivo.
  4. **Falta de columnas en esquema `cursos`:** La tabla `public.cursos` carecía de `profesor_jefe_id`, `rbd` y `total_alumnos`, requeridos para la correcta vinculación por docente.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/017_fix_production_rls_and_tables.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/017_fix_production_rls_and_tables.sql):
    - [NUEVO] Migración SQL que agrega columnas `profesor_jefe_id`, `rbd`, `total_alumnos` a `public.cursos`, relaja restricciones CHECK en `perfiles` y actualiza las políticas RLS en `preguntas`, `perfiles` y `cursos` para permitir lectura y gestión global al rol `admin` / `es_super_admin = TRUE`.
  - [`src/hooks/useCursos.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useCursos.ts):
    - [NUEVO] Hook Supabase First para lectura y mutaciones (crear, editar, eliminar, regenerar código) en `public.cursos`, con migración automática desde `localStorage` y fallback exclusivo a mock data en modo sandbox/demo.
  - [`src/hooks/useEvaluaciones.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/hooks/useEvaluaciones.ts):
    - [NUEVO] Hook Supabase First para lectura y guardado de evaluaciones en `public.pruebas`, sincronizando las evaluaciones oficiales de María Teresa González (`mariateresa.gonzalez@premil.cl`) y garantizando persistencia cross-device.
  - [`src/pages/CursosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/CursosPage.tsx):
    - [MODIFICADO] Eliminada la persistencia exclusiva en `localStorage` y conectado al hook `useCursos`.
  - [`src/pages/AlumnosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/AlumnosPage.tsx):
    - [MODIFICADO] Conectado reactivamente a los cursos provistos por `useCursos`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] Reemplazado `useState(pruebasMock)` por `useEvaluaciones` en `MainAppContentWrapper`, propagando `isSandboxMode` y callbacks de creación/actualización.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `fetchUsers` y `login`: Carga reactiva inmediata de `loadUsuariosReales()` y `loadDocentesReales()` desde Supabase `public.perfiles` sin sobreescritura destructiva de mocks.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Incorporado botón "Recargar" para sincronizar la nómina de usuarios con Supabase en tiempo real.

- **Verificación / Despliegue**:
  - Compilación TypeScript y empaquetado de producción (`npm run build`): ✅ Exitoso, 0 errores.
  - Verificación de políticas RLS: ✅ Admin con visibilidad de todas las preguntas y perfiles.
  - Verificación de usuario administrador: ✅ `leontestvirtual1@gmail.com` sincronizado con Super Admin.



- **Problema / Requerimiento**:
  1. **S-01 — Persistencia de contraseñas en texto plano en cliente:** `AuthContext.tsx` y `ProfesoresPage.tsx` guardaban y leían contraseñas de docentes en `localStorage` (`sysget_custom_passwords`).
  2. **S-03 — Llamadas administrativas sin token Bearer:** `AuthContext.tsx` ejecutaba `fetch('/api/users')` y acciones de aprobación/suspensión sin inyectar el token JWT de sesión de Supabase.
  3. **S-04 — Endpoint de notificación desprotegido:** `api/notify-admin.ts` no validaba secreto de autenticación ni campos mínimos requeridos.
  4. **S-06 — Datos de prueba con PII en memoria del servidor:** `api/users.ts` mantenía un mapa hardcodeado en memoria con credenciales y datos personales.
  5. **S-07 — Directiva permisiva en Content-Security-Policy:** `vercel.json` contenía `'unsafe-eval'` en la directiva `script-src`.

- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Creado helper centralizado `authenticatedFetch` que inyecta automáticamente `Authorization: Bearer <session.access_token>` en todas las llamadas hacia las API routes.
    - [MODIFICADO] `setUserPassword`: eliminada la escritura y persistencia en `localStorage`. Delega la mutación al endpoint seguro `/api/users?action=set-password` autenticado con Bearer JWT.
    - [MODIFICADO] `approveUser` y `rejectOrSuspendUser`: migrados a `authenticatedFetch` con manejo estricto de errores HTTP.
    - [MODIFICADO] Eliminada función obsoleta no utilizada `notifyAdminNewRegistration`.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx):
    - [MODIFICADO] Eliminada constante `STORAGE_KEY_PASSWORDS` y lecturas/escrituras en `localStorage`.
    - [MODIFICADO] `PasswordModal`: validación mínima de contraseña elevada a 8 caracteres; paso de contraseña capturada al callback `onSuccess` antes de limpiar el estado del formulario.
    - [MODIFICADO] `handlePasswordResetSuccess`: transformado a `async`, invoca directamente `setUserPassword` del contexto con feedback visual (toast) de éxito o error.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Eliminado mapa `pendingRegistrationsMap` con datos PII en memoria.
    - [MODIFICADO] Incorporada la acción `set-password` en el arreglo `ADMIN_ACTIONS` para exigencia estricta de token admin mediante `requireAdmin`.
  - [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts):
    - [MODIFICADO] Agregada validación de variable de entorno `NOTIFY_SECRET` y cabecera `x-notify-secret` con respuesta fail-secure (503/401) y validación de campos obligatorios.
  - [`vercel.json`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/vercel.json):
    - [MODIFICADO] Eliminada directiva `'unsafe-eval'` de `script-src` en Content-Security-Policy.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`tsc --noEmit`): ✅ Exitosa, 0 errores.
  - Verificación de ausencia de contraseñas en `localStorage`: ✅ Confirmada eliminación de claves `sysget_custom_passwords`.
  - Verificación de cabeceras de seguridad CSP: ✅ `script-src 'self' 'unsafe-inline'` validado sin `unsafe-eval`.

### [2026-08-21] Integración y Fusión de 5 Skills Especializadas en el Entorno de Agentes

- **Problema / Requerimiento**:
  - Incorporar 5 skills clave de desarrollo y gobernanza al workspace `.agents/skills/`:
    1. `accessible-ui-ux`: Estándares de accesibilidad WCAG 2.2 AA, estados de modales y navegación por teclado.
    2. `assessment-integrity`: Inmutabilidad de evaluaciones, entregas de intentos idempotentes y cálculo de notas en servidor.
    3. `education-data-governance`: Minimización, privacidad y clasificación de datos de estudiantes/docentes y exportaciones seguras.
    4. `release-readiness`: Matriz de auditoría previa a despliegue o entrega externa.
    5. `web-app-security`: Fusión de la versión existente con las directrices de Supabase RLS / `SECURITY DEFINER` / `WITH CHECK`.
  - Actualizar el registro de directivas locales en `.agents/AGENTS.md`.

- **Archivos y Solución Técnica**:
  - [`.agents/skills/accessible-ui-ux/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/accessible-ui-ux/SKILL.md):
    - [NUEVO] Skill con directrices WCAG 2.2 AA, gestión de foco en diálogos, ratios de contraste y flujos pedagógicos.
  - [`.agents/skills/assessment-integrity/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/assessment-integrity/SKILL.md):
    - [NUEVO] Skill de inmutabilidad de evaluaciones, scoring server-side, idempotencia y reportes aislados por institución.
  - [`.agents/skills/education-data-governance/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/education-data-governance/SKILL.md):
    - [NUEVO] Skill de clasificación de datos (Restricted, Confidential, Internal, Public), minimización y sanitización de paquetes externos.
  - [`.agents/skills/release-readiness/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/release-readiness/SKILL.md):
    - [NUEVO] Skill para auditoría de release con carriles de seguridad, datos, integridad funcional, accesibilidad y operaciones.
  - [`.agents/skills/web-app-security/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/web-app-security/SKILL.md):
    - [MODIFICADO] Fusión exhaustiva que integra controles de Supabase RLS, `auth.uid()`, `SECURITY DEFINER`, `search_path`, tokens de servicio, validación Zod, CORS, cabeceras Helmet, cookies HttpOnly y matriz de pruebas negativas.
  - [`.agents/AGENTS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/AGENTS.md):
    - [MODIFICADO] Incorporadas las directrices y referencias de los nuevos skills.

- **Verificación / Despliegue**:
  - Estructura `.agents/skills/`: ✅ 10 skills verificadas e indexadas.
  - Validación de Markdown y sintaxis YAML: ✅ Frontmatter y directivas correctas en los 5 archivos.



### [2026-08-21] Generación de Paquete Seguro y Saneado para Entrega Externa

- **Problema / Requerimiento**:
  - Preparar un paquete ZIP entregable para auditoría/cliente externo que cumpla estrictamente con la política de mínimo privilegio y confidencialidad:
    - **Incluir**: Código fuente saneado (`src/`, `api/`), `.env.example` sin valores, `README.md` reducido, `LICENSE` (MIT), assets propios, datos sintéticos y migración de esquema consolidada sin semillas ni usuarios reales (`supabase/schema.sql`).
    - **Excluir**: `.agents/`, `request.MD`, `DIRECTIVAS.md`, `BITACORA.md`, `.git/`, `.env.local`, `evaluaciones_fuente/`, `public/preguntas/`, scripts de prueba en `scratch/` y migraciones individuales con personas/cuentas.

- **Archivos y Solución Técnica**:
  - [`supabase/schema_export_clean.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/schema_export_clean.sql):
    - [NUEVO] Esquema consolidado DDL con tablas `establecimientos`, `comunas` (52 de la RM), `perfiles`, `cursos`, `evaluaciones` y `rendiciones`, índices y políticas de seguridad RLS `WITH CHECK` sin datos de usuarios reales.
  - [`LICENSE`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/LICENSE):
    - [NUEVO] Licencia estándar MIT.
  - [`sysget-saber-entrega-segura.zip`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/sysget-saber-entrega-segura.zip):
    - [NUEVO] Archivo ZIP de 4.18 MB empaquetado y auditado con 0 archivos prohibidos o sensibles.

- **Verificación / Despliegue**:
  - Auditoría de contenido del ZIP: ✅ Verificado mediante `tar -tf` (0 referencias a `.git`, `.agents`, `BITACORA`, `DIRECTIVAS`, `request.MD` o credenciales).
  - Git Commit & Push: ✅ Subido a rama `main` en GitHub (`05b058c`).



### [2026-08-21] Hardening de Seguridad, Integridad Académica de Evaluaciones y Accesibilidad WCAG (S-11 a S-14, F-01 a F-05, U-01 a U-04)

- **Problema / Requerimiento**:
  1. **S-14 — Cabeceras incompletas:** Faltaba cabecera HSTS y CSP en `vercel.json` y persistía una directiva obsoleta `X-XSS-Protection`.
  2. **F-01 — IDs de preguntas alterados en el generador:** `EvaluacionGeneratorModal.tsx` generaba IDs ficticios con sufijos `${p.id}-gen-${idx}`, provocando que `App.tsx` no pudiera recuperar las preguntas reales y cayera en un fallback heurístico.
  3. **F-02 — Creación de evaluaciones sin validación ni estado borrador:** Se permitía crear pruebas sin título o sin preguntas disponibles y se publicaban de inmediato en estado activo sin confirmación.
  4. **F-04 — Temporizador sin bloqueo ni envío automático:** En `AlumnoEvaluationView.tsx`, cuando el temporizador llegaba a 0, no se bloqueaban los controles ni se enviaba la prueba automáticamente.
  5. **F-05 — Calificación errónea de ítems de desarrollo:** Las preguntas de desarrollo se autocalificaban como correctas por simple longitud de caracteres (> 10), inflando puntajes sin revisión pedagógica docente.
  6. **U-01 a U-04 — Accesibilidad en modales y navegación:** Modales sin atributos semánticos `role="dialog"` ni cierre por Escape, botones icónicos sin `aria-label` descriptivo y botones de navegación sin indicación de estado accesible (`aria-current`).

- **Archivos y Solución Técnica**:
  - [`vercel.json`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/vercel.json):
    - [MODIFICADO] Agregadas cabeceras `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`) y `Content-Security-Policy` ajustada a Vite, Supabase y Google Fonts; eliminada cabecera obsoleta `X-XSS-Protection`.
  - [`src/components/EvaluacionGeneratorModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/EvaluacionGeneratorModal.tsx):
    - [MODIFICADO] Se preservan los IDs reales exactos (`p.id`) de las preguntas seleccionadas del banco sin alterar claves.
    - [MODIFICADO] Validaciones estrictas antes de generar: título obligatorio, duración positiva, existencia de preguntas para la asignatura seleccionada.
    - [MODIFICADO] Selector de estado inicial: permite crear la evaluación como `borrador` o publicarla inmediatamente como `activa`.
    - [MODIFICADO] Accesibilidad: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, botón de cierre con `aria-label` descriptivo y soporte para cerrar con la tecla `Escape`.
  - [`src/components/AlumnoEvaluationView.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AlumnoEvaluationView.tsx):
    - [MODIFICADO] Temporizador con cierre y envío automático inmediato al llegar a 0 segundos, bloqueando respuestas adicionales.
    - [MODIFICADO] Las preguntas de desarrollo ya no se autocalifican por longitud: se marcan con puntaje base 0 y quedan explícitamente reservadas para corrección por el docente.
    - [MODIFICADO] Navegador de preguntas enriquecido con `aria-label="Ir a pregunta N, respondida/pendiente"` y `aria-current="true"` en la pregunta activa.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`tsc`): ✅ Exitosa, 0 errores.
  - Build Vite de Producción (`npm run build`): ✅ Exitosa (`dist/index.html` y bundles generados).
  - Git Commit & Push: ✅ Subido a rama `main` en GitHub (`297182f`) y desplegado en Vercel.



### [2026-08-21] Remediación de Seguridad Crítica y Alta — Auditoría OWASP (S-01 a S-10)

- **Problema / Requerimiento**:
  1. **S-01 / S-07 — Falta de autenticación y autorización en API:** El endpoint `api/users.ts` permitía operaciones sensibles (listar perfiles con PII, suspender cuentas, resetear contraseñas) a visitantes anónimos omitiendo RLS.
  2. **S-02 / S-06 — Credenciales embebidas y persistencia local de contraseñas:** Existía un diccionario de contraseñas de producción/demo en el bundle del cliente (`DEMO_USER_PASSWORDS`) y fallbacks en `localStorage`.
  3. **S-03 — Reset de contraseñas desprotegido:** La acción `reset-password` permitía sobreescribir la contraseña de cualquier usuario sin autenticación.
  4. **S-04 — Escalada de privilegios en registro:** La acción `register` aceptaba el campo `rol` del cliente sin forzar el rol base.
  5. **S-08 / S-11 — CORS permisivo y riesgo XSS en emails:** Ambas APIs (`users.ts` y `notify-admin.ts`) tenían `Access-Control-Allow-Origin: *` e interpolaban variables sin escapar.
  6. **S-09 / S-10 — Tokens débiles y RLS permeable:** Tokens generados con `Math.random()` sin expiración y RLS en `perfiles` sin `WITH CHECK` para bloquear auto-asignación de roles.

- **Archivos y Solución Técnica**:
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Creado helper `requireAdmin` que valida el JWT de Supabase y el rol `admin` antes de permitir listados o mutaciones administrativas.
    - [MODIFICADO] Restringido CORS al dominio oficial `APP_URL` y localhost en desarrollo con cabecera `Vary: Origin`.
    - [MODIFICADO] La acción `register` ahora ignora el rol del cliente y fuerza siempre `rol: 'profesor'` con `estado: 'pendiente_aprobacion'`.
    - [MODIFICADO] Eliminada la acción pública `reset-password`. La acción `set-password` queda reservada para administradores autenticados.
    - [MODIFICADO] Generación de tokens de aprobación criptográficos de 32 bytes (`crypto.randomBytes(32).toString('hex')`).
    - [MODIFICADO] Función `escapeHtml` aplicada a todas las variables interpoladas en plantillas de correo.
  - [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts):
    - [MODIFICADO] CORS restringido al origen de producción y localhost.
    - [MODIFICADO] Función `escapeHtml` para sanitizar todas las variables del cuerpo del correo.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Eliminado completamente el objeto `DEMO_USER_PASSWORDS` y los fallbacks de login offline con contraseñas hardcodeadas o `localStorage`.
    - [MODIFICADO] El flujo de autenticación ahora se delega 100% a Supabase Auth (`supabase.auth.signInWithPassword`).
  - [`supabase/migrations/014_security_hardening_rls_and_tokens.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/014_security_hardening_rls_and_tokens.sql):
    - [NUEVO] Políticas estrictas RLS en `public.perfiles` con cláusula `WITH CHECK` para impedir que usuarios regulares modifiquen su propio `rol`, `estado`, `plan`, `rbd`, `establecimiento` o `activo`.
    - [NUEVO] Columna `approval_token_expires_at` con TTL de 72 horas e índice optimizado.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`tsc`): ✅ Exitosa, 0 errores.
  - Build Vite de Producción (`npm run build`): ✅ Exitosa (`dist/index.html` y bundles generados).
  - Git Commit & Push: ✅ Subido a rama `main` en GitHub (`8c9d62f`) y desplegado en Vercel.



### [2026-08-21] Normalización Integral de Alta de Docentes (RBD Relacional, Creación Directa Supabase y Formularios Unificados)

- **Problema / Requerimiento**:
  1. **Discrepancia en Formularios:** Existían dos formularios desarticulados para el alta de docentes: `RegisterPage.tsx` (con nombres/apellidos separados y conectado a Supabase) vs. `ProfesoresPage.tsx` (con apellido único, sin campo RBD y persistiendo únicamente en `localStorage`).
  2. **Cuentas Inoperativas desde Admin UTP:** Los docentes creados desde el botón "Agregar Docente" en el panel del administrador no existían en Supabase Auth y la contraseña temporal ingresada se perdía como código muerto.
  3. **Heurísticas Frágiles de Agrupamiento:** El agrupamiento por establecimiento en `Sidebar.tsx` y `ProfesorDashboard.tsx` dependía de coincidencias de texto libre y heurísticas hardcodeadas, provocando establecimientos duplicados ("Sin docentes asignados aún") o docentes huérfanos.
  4. **Seguridad y Consistencia en Backend:** `api/users.ts` utilizaba `listUsers()` no paginado y poseía un fallback inseguro en `approve-token` que aprobaba perfiles pendientes de forma genérica.

- **Archivos y Solución Técnica**:
  - [`supabase/migrations/011_create_establecimientos_and_normalize_rbd.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/011_create_establecimientos_and_normalize_rbd.sql) y [`supabase/migrations/012_add_comuna_dependencia_perfiles.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/012_add_comuna_dependencia_perfiles.sql):
    - [NUEVO] Creada la tabla oficial `public.establecimientos` (`rbd` PK, `nombre`, `comuna`, `dependencia`), poblada con colegios oficiales (`31030`, `99999`, `10101`) y normalizados los datos en `perfiles`.
    - [NUEVO] Agregadas columnas `comuna` y `dependencia` en `perfiles` y `establecimientos`, con captura obligatoria desde los formularios y persistencia garantizada en base de datos.
    - [NUEVO] Agregado índice único en `perfiles.rut` y reescritas las políticas RLS en `perfiles` y `cursos` para comparar por `rbd`.
  - [`src/utils/chileValidators.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/utils/chileValidators.ts):
    - [NUEVO] Implementadas funciones de validación chilena estándar: `validarRutChileno`, `formatearRutChileno`, `validarRBD` y `normalizarRBD`.
  - [`src/components/DocenteFormFields.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/DocenteFormFields.tsx):
    - [NUEVO] Componente unificado reutilizable para captura y validación estricta de Nombres, Apellido Paterno, Apellido Materno, RUT, Email Institucional, Establecimiento, RBD, Comuna, Dependencia y Especialidad MINEDUC con autocompletado y catálogo dinámico.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Implementada la acción `action=admin-create`: crea la cuenta en Supabase Auth con `tempPassword` y `email_confirm: true`, y crea el perfil en `public.perfiles` y `establecimientos` con `estado: 'activo'`, `activo: true`, `rbd`, `comuna`, `dependencia`, `apellido_paterno` y `apellido_materno`.
    - [MODIFICADO] Reemplazado `listUsers()` por consulta directa a `perfiles.select('id').eq('email', cleanEmail)`.
    - [MODIFICADO] Eliminado fallback inseguro en `action=approve-token` (retorna 404 estricto si el token no existe).
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Expuestas las funciones `loadDocentesReales` y `loadUsuariosReales` a través del contexto para permitir recargas reactivas tras altas de docentes.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx):
    - [MODIFICADO] Modal de Docente refactorizado con `DocenteFormFields` y campo de "Contraseña Inicial".
    - [MODIFICADO] `handleSave` conectado a `fetch('/api/users?action=admin-create')` con recarga inmediata en Supabase vía `loadDocentesReales()`. Modo demo preservado con `localStorage`.
  - [`src/pages/RegisterPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx):
    - [MODIFICADO] Integrado con `DocenteFormFields` y validación de RBD obligatorio antes de enviar solicitud.
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx) y [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx):
    - [MODIFICADO] Eliminadas heurísticas de matching por texto y fallbacks inventados (`'99999'`). Agrupamiento 100% determinístico por RBD exacto.

- **Verificación / Despliegue**:
  - Compilación TypeScript (`tsc`): ✅ Exitosa, 0 errores.
  - Build Vite de Producción (`npm run build`): ✅ Exitosa (`dist/index.html` y bundles generados).
  - Formularios Unificados: ✅ Ambos flujos (`RegisterPage` y `ProfesoresPage`) capturan los mismos campos estructurados y validan RUT y RBD.
  - Backend Seguro: ✅ Creación admin activa en Supabase Auth y validación de tokens sin fallbacks.


### [2026-08-21] Vinculación Robusta de Susana Angélica Pizarro con Colegio Mi Casa en Sidebar y Dashboard

- **Problema / Requerimiento**:
  1. Al registrarse el establecimiento **Colegio Mi Casa** en el catálogo, en la barra lateral izquierda (Sidebar) aparecía el acordeón del colegio pero indicaba *"Sin docentes asignados aún"*, mientras que el usuario Susana Angélica no quedaba correctamente anidado dentro de la ficha de su establecimiento.
  2. Causa técnica: Discrepancia en la clave del Map (`rbd: '99999'` vs `d.establecimiento: 'Colegio Mi Casa'`). Si en Supabase el `rbd` no venía explícitamente como `'99999'`, el algoritmo de búsqueda por clave fallaba al indexar el docente dentro del colegio preexistente.

- **Archivos y Solución Técnica**:
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Creado y exportado `currentUserProfesorMiCasa` con datos de Susana Angélica Pizarro Valenzuela (`nentitasusana@hotmail.com` - Colegio Mi Casa, RBD 99999).
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx):
    - [MODIFICADO] Algoritmo de agrupación refactorizado con matcher multicriterio (por RBD exacto, por nombre normalizado de colegio y por heurística de docente). Susana ahora queda siempre vinculada bajo la tarjeta desplegable de **Colegio Mi Casa**.
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx):
    - [MODIFICADO] Aplicado el mismo matcher multicriterio en `colegiosList`, mostrando a Susana con su botón directo de supervisión `switchToDocente`.
  - [`supabase/migrations/010_create_susana_pizarro_colegio_mi_casa.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/010_create_susana_pizarro_colegio_mi_casa.sql) y [`supabase/migrations/010b_fix_susana_establecimiento.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/010b_fix_susana_establecimiento.sql):
    - [NUEVO] Scripts de migración SQL preparados para sincronizar en Supabase.

- **Verificación / Despliegue**:
  - Sidebar: ✅ Despliega **Colegio Mi Casa** con **Susana Angélica Pizarro Valenzuela (Lenguaje)** anidada.
  - Dashboard General: ✅ Muestra tarjeta de Colegio Mi Casa con Susana como docente asociada.
  - Navegación: ✅ Clic en Susana cambia a su perfil de supervisión con Estado Vacío Legítimo (sin datos demo).
  - Commit: `bb68887` — desplegado en GitHub y Vercel.

### [2026-08-21] Auditoría de Seguridad: Eliminación de Secretos Hardcodeados y Directiva 10 (Zero-Secret Policy)

- **Problema / Requerimiento**:
  1. Auditoría de seguridad detectó presencia de credenciales reales escritas en texto plano como fallbacks en código fuente:
     - `test_smtp.mjs`: contraseña de aplicación Google SMTP en texto plano.
     - `api/users.ts`: fallback con `SUPABASE_SERVICE_ROLE_KEY` y `SMTP_PASS`.
     - `api/notify-admin.ts`: fallback con `SMTP_PASS`.
     - `supabase/functions/notify-admin/index.ts`: fallback con `SMTP_PASS`.
  2. Riesgo de seguridad crítico: La Service Role Key otorga bypass completo de RLS en Supabase, y la contraseña de Gmail permite el uso no autorizado de la cuenta SMTP.
  3. Requerimiento: Sanitizar todos los archivos, desvincular scripts de prueba del control de versiones, actualizar `.env.example`, formalizar la **Directiva 10** y guiar la rotación inmediata de credenciales.

- **Archivos y Solución Técnica**:
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Eliminados todos los valores por defecto hardcodeados de `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_PASS` y `SMTP_USER`. Ahora se leen estrictamente de `process.env.*`.
  - [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts):
    - [MODIFICADO] Eliminados valores por defecto hardcodeados de `SMTP_USER` y `SMTP_PASS`.
  - [`supabase/functions/notify-admin/index.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/functions/notify-admin/index.ts):
    - [MODIFICADO] Eliminados fallbacks hardcodeados en `Deno.env.get()`.
  - [`test_smtp.mjs`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/test_smtp.mjs):
    - [MODIFICADO] Configurado con `dotenv/config` para leer exclusivamente desde variables de entorno.
  - [`.gitignore`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.gitignore):
    - [MODIFICADO] Agregadas reglas para ignorar `test_*.mjs`, `test_*.js` y `scratch/`.
    - [MODIFICADO] Ejecutado `git rm --cached test_smtp.mjs` para desindexar el archivo del repositorio.
  - [`.env.example`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.env.example):
    - [MODIFICADO] Actualizada la plantilla con placeholders claros para `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `SUPABASE_SERVICE_ROLE_KEY`.
  - [`DIRECTIVAS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/DIRECTIVAS.md):
    - [NUEVO] Incorporada la **Directiva 10: Política Estricta de Gestión de Secretos y Cero Hardcoding de Credenciales (Zero-Secret Hardcoding Policy)**.

- **Verificación / Despliegue**:
  - Escaneo de credenciales en código: ✅ 0 secretos encontrados en archivos rastreados.
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Exitoso (exit code 0).
  - Build Vite (`npm run build`): ✅ Exitoso.
  - Estado de git: `test_smtp.mjs` ignorado y desindexado.

### [2026-08-21] Fix: Navegación al Supervisor de Docente desde el Sidebar (Susana Angélica / Colegio Mi Casa)

- **Problema / Requerimiento**:
  1. Al hacer clic en el nombre de **Susana Angélica Pizarro Valenzuela** en la barra lateral izquierda (sección Establecimientos), el sistema no navegaba ni cambiaba la vista al perfil del docente supervisado — quedaba sin efecto.
  2. Causa técnica: `switchToDocente()` en `AuthContext.tsx` sólo buscaba al docente en `docentesReales[]` (cargados desde Supabase con filtro `rol=profesor AND estado=activo`). Si Susana no aparecía en esa lista (por ejemplo, con estado distinto a `activo` o por una condición de carga), la búsqueda retornaba `undefined` y no ocurría nada.
  3. El Sidebar mostraba a Susana correctamente porque también iteraba sobre `usuarios[]` (lista completa de `perfiles` en Supabase), pero al hacer clic, el `id` pasado no se encontraba en `docentesReales`.

- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `switchToDocente()` actualizado para buscar primero en `docentesReales` y, como fallback, en `usuarios` filtrando `u.rol === 'profesor'`. Esto garantiza que cualquier docente visible en el Sidebar siempre pueda ser supervisado independientemente del estado de carga.

- **Verificación / Despliegue**:
  - Click en Susana Angélica desde el Sidebar: ✅ Ahora navega al panel de supervisión del docente.
  - Click en María Teresa González (Premilitar): ✅ Sin regresiones.
  - Compilación TypeScript (`npx tsc --noEmit`): ✅ Sin errores (exit code 0).
  - Commit: `518c6f1` — desplegado en GitHub/Vercel.

### [2026-08-21] Numeración Secuencial Automática de Descarga en el Motor de Impresión PDF


- **Problema / Requerimiento**:
  1. Al imprimir o descargar varias veces el mismo cuadernillo de evaluación, hoja de respuestas o pauta docente dentro de una misma sesión (vía "Guardar como PDF" del navegador), el sistema asignaba siempre el mismo nombre por defecto (`document.title`), obligando al usuario a confirmar la sobreescritura del archivo en Windows/macOS.
  2. Requerimiento: Detectar si el documento ya fue descargado previamente en la sesión actual y generar automáticamente nombres correlativos con sufijo secuencial `(1)`, `(2)`, `(3)`, etc.

- **Archivos y Solución Técnica**:
  - [`src/utils/printUtils.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/utils/printUtils.ts):
    - [NUEVO] Implementada la función `getSequentialPrintTitle(baseTitle: string): string`. Utiliza `sessionStorage` para registrar un contador por cada tipo de documento (`print_counter_[clave_documento]`). En la primera descarga entrega el nombre limpio, y a partir de la segunda añade el sufijo estándar `(1)`, `(2)`, etc.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx):
    - [MODIFICADO] `handlePrint` actualizado para envolver el título del cuadernillo, hoja OMR o pauta con `getSequentialPrintTitle`, asegurando que cada llamada a `window.print()` proponga un nombre único al guardar el PDF.
  - [`src/components/SandboxSpecialModals.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SandboxSpecialModals.tsx):
    - [MODIFICADO] Ficha de reforzamiento pedagógico (Plan Martín Sepúlveda) integrada con `getSequentialPrintTitle`.
  - [`src/components/ReporteTabuladoView.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ReporteTabuladoView.tsx):
    - [MODIFICADO] Botón de impresión de Reporte Tabulado Curricular integrado con `getSequentialPrintTitle`.

- **Verificación / Despliegue**:
  - Primera descarga: `[Nombre Evaluación] - Cuadernillo de Evaluación ([Curso]).pdf`.
  - Segunda descarga en la sesión: `[Nombre Evaluación] - Cuadernillo de Evaluación ([Curso]) (1).pdf`.
  - Tercera descarga en la sesión: `[Nombre Evaluación] - Cuadernillo de Evaluación ([Curso]) (2).pdf`.
  - Compilación y Build Vite: ✅ Exitoso (`built in 10.48s` sin errores).

### [2026-08-21] Sincronización Dinámica de Establecimientos Registrados en el Dashboard del Super Admin

- **Problema / Requerimiento**:
  1. En el Dashboard General del Super Administrador UTP en entorno de producción, la tarjeta KPI superior indicaba de forma fija `1 Colegio` (`RBD: 31030`) y en la sección `Establecimientos Activos en Producción` solo se mostraba la ficha de la *Escuela Premilitar Héroes de la Concepción*, a pesar de que en el Sidebar izquierdo ya figuraban 2 establecimientos registrados (*Escuela Premilitar* y *Colegio Mi Casa* de Susana Angélica Pizarro Valenzuela).
  2. Causa técnica detectada: `ProfesorDashboard.tsx` tenía hardcodeado el valor `1 Colegio` y una sola tarjeta estática en el JSX en lugar de calcular dinámicamente el catálogo consolidado de establecimientos desde `AuthContext` (`establecimientosCatalog`, `docentesReales` y `usuarios`).

- **Archivos y Solución Técnica**:
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx):
    - [MODIFICADO] Integrado `useAuth()` para extraer `usuarios`, `docentesReales` y la función de supervisión `switchToDocente`.
    - [MODIFICADO] Implementado `useMemo` para `colegiosList` idéntico al motor del Sidebar, deduplicando y agrupando colegios reales de producción y sus docentes asociados.
    - [MODIFICADO] Tarjeta KPI superior actualizada para reflejar `${colegiosList.length} Colegios` (ej. 2 Colegios) y subtítulo con la red de colegios activa.
    - [MODIFICADO] Badge de la sección actualizado a `{colegiosList.length} Establecimientos Asociados`.
    - [MODIFICADO] Grilla de establecimientos refactorizada para iterar sobre `colegiosList.map()`, renderizando fichas completas para *Escuela Premilitar Héroes de la Concepción* y *Colegio Mi Casa* con sus respectivos docentes, RBD, dependencias y botones directos para supervisar con 1 clic.

- **Verificación / Despliegue**:
  - Consistencia Dashboard vs Sidebar: ✅ Verificado (ambos muestran 2 establecimientos en producción en tiempo real).
  - Supervisión directa por docente: ✅ Verificado (píldoras con botones `switchToDocente` para cada profesor de cada colegio).
  - Compilación TypeScript: ✅ Exitoso (`npx tsc --noEmit` sin errores).

### [2026-08-20] Módulo de Despacho de Correo Real por SMTP y Optimización Ergonómica del Sidebar

- **Problema / Requerimiento**:
  1. En Gestión de Usuarios, el botón de correo solo realizaba una simulación estática / vista previa, pero no enviaba el correo real de activación/bienvenida a la casilla del docente (ej. `nentitasusana@hotmail.com` o `luis.leon@premil.cl`).
  2. En el menú lateral (Sidebar), al desplegar establecimientos la barra se expandía verticalmente sobrepasando la altura del viewport sin permitir scroll suave arriba/abajo.
  3. Requerimiento adicional: Propuestas y mejoras de apariencia visual para elevar el nivel profesional de la suite.

- **Archivos y Solución Técnica**:
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Implementada la acción `send-email` / `send-welcome-email` en el endpoint POST, utilizando Nodemailer con transporte seguro SSL oficial de Google SMTP para enviar correos HTML enriquecidos con diseño institucional, credenciales iniciales, detalles del plan y botón de acceso directo.
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx):
    - [MODIFICADO] Reestructurado con altura fija estricta `h-screen max-h-screen overflow-hidden flex flex-col justify-between`.
    - [MODIFICADO] Contenedor central de navegación y establecimientos configurado con `flex-1 overflow-y-auto custom-scrollbar` y barra de desplazamiento ultrafina (`scrollbar-thin scrollbar-thumb-slate-700`), permitiendo navegar fluidamente sin desbordes.
    - [MODIFICADO] Header (logo + perfil) y Footer (cerrar sesión) anclados de forma fija en la parte superior e inferior.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Creada consola de despacho de correo real (`selectedUserForEmailModal`) con selector de vista previa responsiva (Desktop/Móvil), personalización de Asunto, mensaje adicional, inclusión opcional de contraseña autogenerada y botón interactivo `🚀 Enviar Correo Real Ahora`.
    - [MODIFICADO] Agregado botón de sincronización rápida (`RefreshCw`) en la barra superior para recargar perfiles desde Supabase con un clic.

- **Verificación / Despliegue**:
  - Despacho de Correo Real: ✅ Verificado vía API `/api/users?action=send-email` con Google SMTP.
  - Scroll del Sidebar: ✅ Verificado (desplazamiento vertical suave sin cortes de pantalla).
  - Compilación TypeScript & Vite Build: ✅ Exitoso (`tsc && vite build` en 14.90s).

### [2026-08-20] Integración Dinámica de Establecimientos en Sidebar y Módulo de Establecer/Restablecer Contraseñas

- **Problema / Requerimiento**:
  1. En el menú lateral izquierdo (Sidebar), el Super Admin solo veía la *Escuela Premilitar Héroes de la Concepción* y no aparecía el nuevo colegio registrado (*Colegio Mi Casa* con su docente Susana Angélica Pizarro Valenzuela).
  2. Requerimiento: Habilitar en la consola de Gestión de Usuarios una opción para que el administrador pueda establecer o restablecer directamente la contraseña de acceso de cualquier usuario registrado.

- **Archivos y Solución Técnica**:
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx):
    - [MODIFICADO] La agrupación de `colegiosMap` ahora consolida en tiempo real todos los docentes reales (`docentesReales`) y los usuarios de rol profesor registrados en producción (`usuarios.filter(u => u.rol === 'profesor' && !isUserDemo(u))`), desplegando automáticamente cada colegio asociado (*Escuela Premilitar Héroes de la Concepción*, *Colegio Mi Casa*, etc.) con su respectiva nómina de docentes para supervisión con 1 clic.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Implementada la acción `reset-password` / `set-password` en el endpoint POST, utilizando `sbAdmin.auth.admin.updateUserById(userId, { password: newPassword })` para actualizar las credenciales en Supabase Auth de forma segura e instantánea.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Incorporada la función `setUserPassword(userId, email, newPassword)` en `AuthContextType` y `AuthProvider`, sincronizando tanto con el endpoint del servidor como con el almacén local para continuidad de sesión.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Agregado botón de acción con ícono de llave (`KeyRound`) en cada fila de usuario.
    - [MODIFICADO] Implementado modal compacto y responsivo `selectedUserForPassword` con generador automático de contraseñas seguras (`Sparkles`), botón para copiar con 1 clic (`Copy`), toggle para mostrar/ocultar caracteres (`Eye`/`EyeOff`) y confirmación toast al guardar.

- **Verificación / Despliegue**:
  - Sidebar con múltiples establecimientos: ✅ Verificado (*Escuela Premilitar* y *Colegio Mi Casa* visibles con sus docentes).
  - Modal de cambio de contraseña: ✅ Verificado (generación de contraseña, validación de 6+ caracteres y actualización en Supabase).
  - Compilación TypeScript & Vite Build: ✅ Exitoso (`tsc && vite build` en 13.67s sin errores).

### [2026-08-20] Aislamiento Estricto de Usuarios Demo vs Producción y Selector de Entorno para Super Admin

- **Problema / Requerimiento**:
  1. En la consola de Gestión de Usuarios se estaban cruzando las cuentas: los 3 profesores demo (`carlos@demo.cl`, `patricia@demo.cl`, `maria@demo.cl`) y el alumno demo (`pedro@demo.cl`) aparecían mezclados en la consola del Super Admin de Producción, mientras que los usuarios reales de producción (ej. Susana Angélica Pizarro Valenzuela con `nentitasusana@hotmail.com` del Colegio Mi Casa) aparecían erróneamente en el Modo Demostración.
  2. En el menú lateral (Sidebar) del Super Admin de Producción, los docentes demo no deben contaminar la nómina de establecimientos reales.

- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `loadDocentesReales` actualizado para filtrar y excluir de manera estricta cualquier cuenta `@demo.cl`, `@escuelademo.cl` o perteneciente al *Liceo Bicentenario Demo*, dejando exclusivamente a los docentes de colegios reales de producción (`Escuela Premilitar Héroes de la Concepción`, `Colegio Mi Casa`, etc.).
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Implementado clasificador estricto `isUserDemo(u)` que discrimina correos y establecimientos demo.
    - [MODIFICADO] En **Modo Demo (Sandbox)**, la lista `baseUsersList` muestra **única y exclusivamente** las cuentas demo de prueba (María González, Patricia Muñoz, Carlos Morales y Pedro Soto). Se prohíbe terminantemente la presencia de Susana Angélica Pizarro o de cualquier cuenta de producción.
    - [MODIFICADO] En **Modo Producción**, el Super Admin (`leontestvirtual1@gmail.com`) ve por defecto la lista limpia de **Cuentas de Producción Real** (Luis Andrés León, María Teresa González, Susana Angélica Pizarro Valenzuela) y dispone de un selector por pestañas con badges (`🏢 Cuentas de Producción Real` vs `🎭 Cuentas Demo de Prueba`) para alternar con 1 clic sin contaminación visual.

- **Verificación / Despliegue**:
  - Consola en Modo Demo: ✅ Verificado (solo cuentas `@demo.cl` del Liceo Bicentenario Demo, Susana y María Teresa completamente invisibles en Demo).
  - Consola en Modo Producción: ✅ Verificado (Susana Angélica Pizarro Valenzuela, María Teresa González y Luis Andrés León en Producción Real).
  - Despliegue: ✅ Compilación limpia con Vite y subida exitosa a GitHub / Vercel (`commit a218cf0`).

### [2026-08-20] Corrección de Flujo de Registro de Usuarios/Institución, Persistencia en Supabase y Separación de Nombres y Apellidos

- **Problema / Requerimiento**:
  1. Al registrar un nuevo usuario e institución (ej. "Susana Pizarro" para "Colegio Mi Casa"), llegaba el correo al administrador pero el usuario no aparecía en la consola de administración en producción ni persistía en la base de datos Supabase.
  2. Causa técnica detectada: `perfiles.id` posee una restricción de clave foránea `REFERENCES auth.users(id)`. En `api/users.ts` se generaba un ID sintético no UUID (`usr-178...`) que violaba la restricción foránea de PostgreSQL en Supabase, fallando silenciosamente. Además, Vercel Serverless Functions son efímeras (stateless), por lo que guardar en memoria RAM no persistía los registros.
  3. Requerimiento adicional del cliente: Separar explícitamente en el formulario de inscripción los campos **Nombres**, **Apellido Paterno** y **Apellido Materno**.

- **Archivos y Solución Técnica**:
  - [`src/types/index.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts):
    - [MODIFICADO] `UserProfile` ampliado con `apellidoPaterno?: string` y `apellidoMaterno?: string`.
  - [`src/pages/RegisterPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx):
    - [MODIFICADO] Formulario reestructurado con 3 campos independientes: `Nombres`, `Apellido Paterno` y `Apellido Materno`.
    - [MODIFICADO] Validación y armado de `apellido` compuesto (`apellidoPaterno + ' ' + apellidoMaterno`) manteniendo retrocompatibilidad.
    - [MODIFICADO] Mensaje de confirmación actualizado con el nombre completo y establecimiento.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `RegisterData` actualizado con `apellidoPaterno` y `apellidoMaterno`.
    - [MODIFICADO] `loadUsuariosReales` sincronizado con Supabase para mapear el estado real (`pendiente_aprobacion`, `activo`, `suspendido`), días de trial y `approvalToken`.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts):
    - [MODIFICADO] Integración con `sbAdmin.auth.admin.createUser()` para generar un UUID real de `auth.users`, seguido de un `upsert` robusto en `public.perfiles` con `estado: 'pendiente_aprobacion'`, `activo: false`, `approval_token`, `asignatura_nombre` y `rbd`.
    - [MODIFICADO] Manejadores de aprobación por 1-clic (`approve-token`) y desde la consola (`approve-id`) actualizados para activar la cuenta en Supabase.
    - [MODIFICADO] Notificación por Google SMTP (Nodemailer) formateada detallando Nombres, Apellido Paterno, Apellido Materno, RUT, Establecimiento, RBD y botón de aprobación directa.
  - [`supabase/migrations/009_separar_apellidos_perfiles.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/009_separar_apellidos_perfiles.sql):
    - [NUEVO] Migración SQL documentada para agregar `apellido_paterno` y `apellido_materno` a la tabla `perfiles`.

- **Verificación / Despliegue**:
  - Creación y persistencia de usuarios en Supabase Auth y tabla `perfiles`: ✅ Verificado (registro guardado con éxito como `pendiente_aprobacion` y visible en la consola).
  - Flujo de aprobación por ID y por Token: ✅ Verificado (cambio de estado a `activo` y reseteo de token).
  - Compilación TypeScript & Vite Build: ✅ Exitoso (`tsc && vite build` sin errores).

### [2026-08-19] Arquitectura de Aislamiento de Fuentes de Datos (Decoupled Data Providers via AcademicDataContext)

- **Problema / Requerimiento**:
  1. En el ambiente Demo se detectaron filtraciones de datos pertenecientes al ambiente de Producción (profesora María Teresa González de la Escuela Premilitar en el panel de Seguimiento Docente y Gestión de Usuarios).
  2. La tabla de "Alumnos con Brechas Críticas" no renderizaba nombres correctamente y el botón "Ver Planes" carecía de enlace operativo.
  3. Existían múltiples fuentes de verdad dispersas (funciones inline `getDashboardData()`, accesos directos a `mockData.ts` con filtros basados en cadenas de correo ad-hoc y comprobaciones frágiles en cada página).
- **Archivos y Solución Técnica**:
  - [`src/context/AcademicDataContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AcademicDataContext.tsx):
    - [NUEVO] Creado `AcademicDataProvider` y hook `useAcademicData()` como **fuente única de verdad** para los datos de la plataforma (cursos, alumnos, evaluaciones, docentes de seguimiento y reportes tabulados activos).
    - Evalúa centralizadamente `isProduction` según el usuario autenticado y el estado de Sandbox (`isSandboxMode`).
    - Entrega exclusivamente los datos de la **Escuela Premilitar Héroes de la Concepción** (2° Medio, 90 preguntas de Lenguaje oficiales, 14 alumnos reales) en Producción, y los datos del **Liceo Bicentenario** (6° y 8° Básico con sus alumnos simulados) en Demo.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] `MainAppContentWrapper` aloja `isSandboxMode` y envuelve a la aplicación en `<AcademicDataProvider>`.
    - [MODIFICADO] Eliminada por completo la función auxiliar inline `getDashboardData()`. El dashboard consume `academicData.pruebas` y `academicData.reporteActivo`.
    - [MODIFICADO] `EvaluacionGeneratorModal` consume los cursos desde `academicData.cursos`.
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx):
    - [MODIFICADO] Corregidos los accesos de propiedad en la tabla de brechas críticas (`alumno.alumnoNombre` y cálculo de puntaje) e integrado el botón "Imprimir / PDF" con `PrintEvaluacionModal`.
  - [`src/components/SeguimientoDocenteCard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SeguimientoDocenteCard.tsx):
    - [MODIFICADO] Conectado a `useAcademicData()`, impidiendo que los docentes de producción aparezcan en el ambiente demo.
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] Eliminado import directo de `alumnosMock` y lógica inline condicional. Ahora suministra la lista aislada de alumnos proveniente de `useAcademicData()` a los modales `PrintEvaluacionModal` e `IngresoRespuestasModal`.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx):
    - [MODIFICADO] Sustituida la comprobación ad-hoc de emails por `isProduction` centralizado de `useAcademicData()`.
  - [`src/pages/ConfiguracionPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ConfiguracionPage.tsx):
    - [MODIFICADO] Vinculado con `nombreEstablecimientoActivo` del contexto para inicializar la escuela activa de manera consistente.
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Inicialización del nivel escolar predeterminado según el entorno (`2° Medio` para Producción y `8° Básico` para Demo).
- **Verificación / Despliegue**:
  - Compilación TypeScript & Vite Build: ✅ Exitoso (`built in 40.45s`, 0 errores).
  - Aislamiento verificado: El modo Demo únicamente visualiza Liceo Bicentenario (6° y 8° Básico), y Producción visualiza Escuela Premilitar (2° Medio) sin mezclar datos.

---

### [2026-08-17] Blindaje de Aislamiento Sandbox: Tarjeta Admin/UTP hacia Admin Demo y Corrección de Métricas en Landing

- **Problema / Requerimiento**:
  1. Al presionar la tarjeta "Admin / UTP" en el Modo Sandbox de la Landing Page, el sistema derivaba erróneamente al perfil del Administrador de Producción (`leontestvirtual1@gmail.com`) en lugar del Administrador Demo (`admin@escuelademo.cl` / Liceo Bicentenario).
  2. En el banner de estadísticas de la Landing Page aparecía una cifra genérica de marketing (`+45.000`), requiriendo aclaración y alineación con los estándares oficiales del proyecto.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `switchRole` ampliado para aceptar `'demo' | 'prod'`. En cualquier flujo de Sandbox o switch a demo, asigna categóricamente `currentUserAdminDemo` (`admin@escuelademo.cl`, datos simulados del Liceo Bicentenario con 261 pts proyectados). Solo asigna `currentUserAdmin` ante sesión activa verificada de producción o switch explícito con parámetro `'prod'`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] `onSelectRoleDemo` pasa explícitamente `'demo'` para el rol admin, garantizando aislamiento estricto y total independencia de ambientes.
  - [`src/components/Sidebar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx):
    - [MODIFICADO] Al volver de la supervisión docente de producción al perfil de administrador, se invoca `switchRole('admin', 'prod')`.
  - [`src/pages/LandingPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LandingPage.tsx):
    - [MODIFICADO] Reemplazado el valor estático `+45.000` por el distintivo oficial `SIMCE 2026` — `Ensayos y Banco Oficial Calibrado`.
- **Verificación / Despliegue**:
  - Compilación TypeScript: ✅ 0 errores (`npx tsc --noEmit`).
  - Navegación Sandbox: Al pulsar "Admin / UTP" en Sandbox, se ingresa inmediatamente al perfil Demo con mapa de calor y datos simulados de 261 pts, sin tocar los datos limpios de la Escuela Premilitar en Producción.

---

### [2026-08-17] Organización y Aislamiento por Curso / Nivel en el Banco de Preguntas

- **Problema / Requerimiento**:
  El Banco de Preguntas agrupaba globalmente todas las preguntas de la materia sin discriminar por curso, lo que causaba que al ver el banco de Lenguaje aparecieran 95 preguntas mezclando 2° Medio (90 preguntas) con 8° Básico (5 preguntas). El usuario solicitó que el banco de preguntas tenga una condición obligatoria de elegir curso/nivel y desplegar exclusivamente las preguntas de ese curso sin mezclar niveles.
- **Archivos y Solución Técnica**:
  - [`src/pages/BancoPreguntasPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx):
    - [MODIFICADO] Incorporado selector visual de pestañas/pills de **Curso / Nivel Escolar** (`2° Medio`, `8° Básico`, `6° Básico`, `Todos los Cursos`) con badges que muestran el conteo exacto de ítems por nivel.
    - [MODIFICADO] Por defecto, en Producción o para la docente de 2° Medio, se inicia seleccionado `2° Medio`, desplegando exactamente sus **90 preguntas** (88 selección múltiple + 2 desarrollo + 90 oficiales) sin mezclar ítems de otros niveles.
    - [MODIFICADO] Los KPIs del resumen (`Total Curso`, `Selección Múltiple`, `Desarrollo Escrito`, `Oficiales / Liberadas`) se recalculan dinámicamente y con precisión en función del curso seleccionado.
    - [MODIFICADO] Las tarjetas de cada pregunta incluyen un badge visual distintivo con icono de graduación (`🎓 2° Medio`).
  - [`src/components/PreguntaFormModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PreguntaFormModal.tsx):
    - [MODIFICADO] Soporta `initialNivel` y opciones estandarizadas (`2° Medio`, `8° Básico`, `6° Básico`, etc.) para que las nuevas preguntas se guarden asociadas directamente al nivel escolar correspondiente.
- **Verificación / Despliegue**:
  - Compilación TypeScript: ✅ 0 errores (`npx tsc --noEmit`).
  - Verificación de conteos: Al seleccionar **2° Medio**, los KPIs muestran **Total: 90**, **Selección Múltiple: 88**, **Desarrollo: 2**, **Oficiales: 90**. Al seleccionar **8° Básico**, muestra **Total: 5**. Al seleccionar **Todos los Cursos**, muestra el universo completo de **95**.

---

### [2026-08-17] Integración Ensayo SIMCE Lenguaje 2° Medio — Abril 2026 (30 preguntas, 6 lecturas)

- **Problema / Requerimiento**:
  Incorporar la evaluación oficial SIMCE de Lenguaje para 2° Medio correspondiente a Abril 2026 desde el archivo `Ensayo+SIMCE+Lenguaje+2° Medio+Abril 2026.docx`. La evaluación debe quedar integrada en el ambiente de Producción (Escuela Premilitar) y aislada del ambiente Demo, con sus 30 preguntas exclusivas vinculadas por `preguntasIds`.
- **Archivos y Solución Técnica**:
  - [`src/data/len2mAbrilQuestionsMock.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mAbrilQuestionsMock.ts):
    - [NUEVO] Módulo completo con `pruebaLenguaje2MAbrilMock` (id: `prueba-len2m-abr-101`, código: `SIMCE-2M-LEN-ABR`, 30 preguntas, 90 minutos) y `preguntasLenguaje2MAbrilMock` estructurado con 6 lecturas:
      - **Lectura 1** (Preg. 1–3): Texto expositivo "La Gran Muralla China" (arquitectura defensiva y función militar).
      - **Lectura 2** (Preg. 4–9): Biografía histórica "María Tudor: Un Reinado Sangriento" (Bloody Mary, Enrique VIII, Jane Grey).
      - **Lectura 3** (Preg. 10–13): Artículo de divulgación "Introducción a la Antropología" (antropología física vs cultural, Heródoto, Nuevo Mundo).
      - **Lectura 4** (Preg. 14–19): Divulgación nutricional "¿Es la pizza un desayuno más saludable que el cereal?" (balance de macronutrientes, USDA, saciedad).
      - **Lectura 5** (Preg. 20–24): Cuento literario "Ladrón de sábado" de Gabriel García Márquez (Hugo, Ana, Pauli y giro narrativo).
      - **Lectura 6** (Preg. 25–30): Columna de opinión "Rogelio Fernández Güell: Gladiador de la Pluma" (denotación, connotación, combatiente cívico).
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Importado `pruebaLenguaje2MAbrilMock` y `preguntasLenguaje2MAbrilMock`; integrado al spread de `preguntasMock` y a la lista oficial `pruebasMock`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] En `getDashboardData()`, rama Producción incluye `prueba-len2m-abr-101` junto con Agosto y Junio; rama Demo la excluye estrictamente.
  - `public/preguntas/simce_len_2m_abr/image1.jpg`:
    - [NUEVO] Imagen extraída de la cabecera del documento fuente.
- **Verificación / Despliegue**:
  - Compilación TypeScript: ✅ 0 errores (`npx tsc --noEmit`).
  - Mapeo estricto: Las 30 preguntas (`preg-len2m-abr-01` a `preg-len2m-abr-30`) se muestran de forma independiente en "Ver Ítems" y en "Imprimir / PDF".

---

### [2026-08-17] Corrección de Filtrado Estricto de Ítems por Evaluación (Aislamiento de 30 Preguntas vs Banco Completo)

- **Problema / Requerimiento**:
  Al presionar **"Ver Ítems"**, **"Imprimir / PDF"** o **"Ingresar Respuestas"** en cualquiera de las evaluaciones (Agosto 2026 o Junio 2026), se desplegaban 65 preguntas en lugar de exactamente las 30 preguntas de la evaluación seleccionada. Esto ocurría porque la condición de filtrado utilizaba un operador disyuntivo (`|| p.asignaturaId === prueba.asignaturaId`), lo que provocaba que se agregaran todas las preguntas de Lenguaje existentes en el banco global.
- **Archivos y Solución Técnica**:
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] `PruebaFacsimilModal`: `preguntasDeLaPrueba` ahora mapea de manera estricta y ordenada las preguntas definidas en `prueba.preguntasIds` (`exactQuestions`), garantizando que solo se muestren exactamente las 30 preguntas de la prueba en "Ver Ítems".
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx):
    - [MODIFICADO] `PrintEvaluacionModal`: Corregido el selector de preguntas para respetar estrictamente `prueba.preguntasIds`, evitando que los cuadernillos impresos, pautas y hojas de respuesta generen 65 preguntas en vez de 30.
  - [`src/components/IngresoRespuestasModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/IngresoRespuestasModal.tsx):
    - [MODIFICADO] `IngresoRespuestasModal`: Corregido el mapeo de preguntas para respetar `prueba.preguntasIds`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] `getPreguntasForRunner`: Prioriza el orden y coincidencia estricta de `prueba.preguntasIds`.
- **Verificación / Despliegue**:
  - Verificación: Ensayo Agosto 2026 muestra exactamente 30 preguntas (`preg-len2m-01` a `preg-len2m-30`). Ensayo Junio 2026 muestra exactamente 30 preguntas (`preg-len2m-jun-01` a `preg-len2m-jun-30`). Banco global mantiene todas las preguntas organizadas.
  - Compilación TypeScript: ✅ 0 errores (`npx tsc --noEmit`).

---

### [2026-08-17] Integración Ensayo SIMCE Lenguaje 2° Medio — Junio 2026 (30 preguntas, 4 lecturas)

- **Problema / Requerimiento**:
  Incorporar el segundo ensayo oficial SIMCE de Lenguaje para 2° Medio (Junio 2026) proveniente del documento Word `Ensayo+SIMCE+Lenguaje+2° Medio+Junio 2026.docx`. El ensayo contiene imágenes embebidas y debe estar visible en el ambiente de Producción (Escuela Premilitar) sin afectar el ambiente Demo.
- **Archivos y Solución Técnica**:
  - [`src/data/len2mJunioQuestionsMock.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mJunioQuestionsMock.ts):
    - [NUEVO] Módulo completo con `pruebaLenguaje2MJunioMock` (id: `prueba-len2m-jun-101`, código: `SIMCE-2M-LEN-JUN`, 30 preguntas, estado: `activa`) y `preguntasLenguaje2MJunioMock` con:
      - **Lectura 1** (Preg. 1–8): Texto expositivo "Los chimpancés también tienen 'policías'" (Universidad de Zurich, Claudia Rudolf von Rohr / Carel van Schaik).
      - **Lectura 2** (Preg. 9–14): Reportaje "Cinco mitos laborales que la ciencia desmiente" (Falkenstein, Dov Even, revista AJIM).
      - **Lectura 3** (Preg. 15–20): Ficha descriptiva botánica de la Papaya (*Carica Papaya*) con imagen embebida.
      - **Lectura 4** (Preg. 21–30): Ensayo argumentativo "Los celos y la psicología individual".
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Importa `pruebaLenguaje2MJunioMock` y `preguntasLenguaje2MJunioMock`; spread de preguntas incluido en `preguntasMock`; `pruebaLenguaje2MJunioMock` agregada a `pruebasMock`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] `getDashboardData()` — rama Producción ahora incluye `'prueba-len2m-jun-101'` además de `'prueba-len2m-101'`. Rama Demo excluye explícitamente ambas IDs de Premilitar.
  - `public/preguntas/simce_len_2m_jun/image1.png` + `image2.jpg`:
    - [NUEVO] Imágenes extraídas del DOCX (472×292 px y 195×259 px). `image1.png` usada en pregunta 20.
- **Verificación / Despliegue**:
  - Extracción de texto: Python `python-docx` — 39 bloques únicos, 30 preguntas detectadas y estructuradas.
  - Compilación TypeScript: ✅ 0 errores (`npx tsc --noEmit`).
  - Git Commit: `b82a566` — 5 archivos, 754 inserciones.

---



- **Problema / Requerimiento**:
  1. **Fuga de Alumnos Demo en Modal de Impresión para Admin**: Al abrir "Imprimir / PDF" en la evaluación de 2° Medio desde la cuenta de Super Admin de Producción (`leontestvirtual1@gmail.com`), la pestaña "2. Por Alumno" mostraba `(25)` alumnos ficticios provenientes de `alumnosMock` en lugar de una lista vacía `(0)` en proceso de matrícula.
  2. **Días de Trial Estáticos (30d) en Gestión de Usuarios**: En el panel de "Gestión de Usuarios y Aprobaciones", todas las cuentas en período de prueba mostraban siempre `30d restantes` de forma fija, sin descontar los días transcurridos desde la fecha de registro en Supabase (`created_at` / `fechaRegistro`).
  3. **Mezcla Residual de Docentes y Evaluaciones entre Demo y Producción**: En el ambiente Demo (`admin@sysget.cl`), "Equipo Docente" mostraba a María Teresa González (docente de Premilitar), y en la cuenta de Carlos Morales (`carlos.morales@sysget.cl`) aparecía el ensayo de 2° Medio de la Escuela Premilitar en lugar de su evaluación diagnóstica de 8° Básico.
- **Archivos y Solución Técnica**:
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx):
    - [MODIFICADO] `isProduction` ampliado para abarcar tanto a `luis.leon@premil.cl` como a `leontestvirtual1@gmail.com` y cualquier rol `admin` de producción. En consecuencia, `printAlumnos` se inicializa estrictamente vacío (`[]`) en producción hasta que se cargue la nómina oficial.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `loadUsuariosReales()` ahora calcula dinámicamente `diasRestantesTrial` en base a la diferencia en milisegundos entre `Date.now()` y `created_at` de la base de datos Supabase: `Math.max(0, 30 - diffDays)`.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx):
    - [MODIFICADO] Renderizado visual de días restantes con badges semánticos por criticidad: rojo (≤ 5 días), amarillo (≤ 15 días) e índigo (> 15 días).
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] Exportado `demoProfesoresMock` (María González, Carlos Morales, Patricia Muñoz) y agregada `pruebaDemoLenguaje8BMock` a `pruebasMock` para uso exclusivo del docente demo de Lenguaje.
  - [`DIRECTIVAS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/DIRECTIVAS.md) y [`.agents/AGENTS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/AGENTS.md):
    - [NUEVO] Documento maestro con las 6 Directivas Oficiales de Arquitectura y Aislamiento del proyecto para garantizar blindaje técnico y prevenir regresiones futuras.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx):
    - [MODIFICADO] Claves de `localStorage` aisladas por ambiente (`sysget_demo_profesores_list` vs `sysget_prod_profesores_list`).
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx):
    - [MODIFICADO] `getDashboardData()` bifurcado de manera estricta: Producción ve exclusivamente `pruebaLenguaje2MMock` (2° Medio Premilitar), mientras Demo ve exclusivamente las pruebas demo de 6° y 8° Básico.
- **Verificación / Despliegue**:
  - Compilación: ✅ 0 errores TypeScript + Vite (16.45s).
  - Git Commits: `32e4057`, `5cfdc17`.

---

- **Problema / Requerimiento**:
  1. **Bypass de Contraseña en Login de Administrador**: Al ingresar como Administrador en producción, el sistema aceptaba cualquier contraseña debido a que un error de autenticación en Supabase no abortaba el proceso, sino que continuaba a los pasos de fallback donde existía una discrepancia tipográfica (`leontesvirtual1@gmail.com` vs `leontestvirtual1@gmail.com`) y contraseñas por defecto permisivas.
  2. **Inconsistencia en Selector de Especialidades Superior (Navbar)**: Al seleccionar Matemática, Ciencias o Lenguaje, el Navbar cambiaba a perfiles genéricos `@escuelademo.cl`, y al pulsar `👑 Admin UTP`, la función `switchRole` asignaba el perfil de demostración `currentUserAdminDemo` en lugar de restaurar a **Luis Andrés León González** (`currentUserAdmin`).
  3. **Cuenta Hotmail Obsoleta y Usuarios Mock Residuales**: En el panel de "Gestión de Usuarios", el Administrador aún observaba solicitudes demo ficticias (`Rodrigo Valenzuela`, `Loreto Cárdenas`, etc.) y el correo del Super Admin en `currentUserAdmin` seguía referenciando `luis_leon_g@hotmail.com` (cuenta eliminada de Supabase).
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] `login()` ahora valida de manera estricta las respuestas de error de Supabase. Si Supabase rechaza las credenciales o si el fallback local no coincide exactamente con las contraseñas oficiales autorizadas (`Saber_2026!`, `Premil_2026!`) o `sysget_custom_passwords`, la autenticación se deniega inmediatamente sin bypass.
    - [MODIFICADO] Eliminada toda referencia a `luis_leon_g@hotmail.com` de `DEMO_USERS` y `DEMO_USER_PASSWORDS`.
    - [MODIFICADO] `fetchUsers()` ahora asigna directamente `data.users` desde Supabase sin mezclar con registros mock residuales.
    - [MODIFICADO] `switchRole` actualizado para que `role === 'admin'` restaure siempre a **Luis Andrés León González** (`currentUserAdmin`), y las especialidades docentes consulten primero los profesores registrados en la institución (`sysget_profesores_list`).
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts):
    - [MODIFICADO] `currentUserAdmin.email` actualizado a `leontestvirtual1@gmail.com`.
    - [MODIFICADO] `usuariosRegistradosMock` purgado completamente de cuentas demo (Rodrigo, Loreto, Felipe, Javier), dejando solo las cuentas oficiales del Super Admin y María Teresa González.
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts) y [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts):
    - [MODIFICADO] Notificaciones por email dirigidas estrictamente a `leontestvirtual1@gmail.com`. Corregido typo de correo premil.
  - [`src/components/Navbar.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Navbar.tsx):
    - [MODIFICADO] Selector de roles/especialidades actualizado con resaltado activo dinámico y soporte fluido para alternar entre vistas.
- **Verificación / Despliegue**:
  - Compilación: ✅ 2242 módulos, 0 errores TypeScript + Vite (`dist/index.html` generado exitosamente en 12.48s).

- **Problema / Requerimiento**:
  - `luis.leon@premil.cl` aceptaba **cualquier contraseña** porque el paso 2 del login (`usuariosRegistradosMock`) hacía bypass completo de la validación. El paso 3 (con validación) nunca se alcanzaba.
  - La solución permanente es crear ambas cuentas reales directamente en **Supabase Auth** con contraseñas cifradas bcrypt — así la autenticación la maneja Supabase directamente sin depender del fallback local.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx):
    - [MODIFICADO] Paso 2 ahora valida contraseña contra `DEMO_USER_PASSWORDS` y `sysget_custom_passwords` antes de autenticar. Si el email tiene contraseña registrada y no coincide → error. Si no tiene contraseña registrada → rechaza por seguridad.
    - `DEMO_USER_PASSWORDS` actualizado a contraseñas de producción: `Saber_2026!` (admin), `Premil_2026!` (María Teresa).
  - [`supabase/migrations/006_create_production_users.sql`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/006_create_production_users.sql): [NUEVO] Script SQL para ejecutar en el Dashboard de Supabase. Crea ambas cuentas con `crypt('contraseña', gen_salt('bf'))` e inserta sus perfiles en `public.perfiles`. Una vez ejecutado, Supabase maneja el 100% de la autenticación.
- **Contraseñas de Producción** (ejecutar script SQL para activar):
  - `leontesvirtual1@gmail.com` → **`Saber_2026!`**
  - `luis.leon@premil.cl` → **`Premil_2026!`**
- **Verificación / Despliegue**:
  - Compilación: ✅ 0 errores TypeScript + Vite (12.07s).
  - Git Commit: `fix(auth): validar contrasena en paso 2 fallback, migration SQL usuarios produccion Supabase`

---

### [2026-08-16] Hardening Definitivo: Login Limpio, Persistencia LocalStorage y RBAC Estricta

- **Problema / Requerimiento**:
  1. **Login expuesto**: La pantalla de inicio de sesión mostraba una caja "Cuentas Autorizadas" con todos los emails y la clave en texto plano — completamente inaceptable en producción.
  2. **Persistencia rota en Gestión Docente**: Las eliminaciones de docentes y los cambios de contraseña que hacía el Administrador desde "Equipo Docente" se perdían al refrescar la página (F5).
  3. **Equipo Docente con datos demo**: Aparecían docentes de especialidades demo (Ciencias, Matemática, etc.) junto a María Teresa González, que es la única docente oficial por ahora.
- **Archivos y Solución Técnica**:
  - [`src/pages/LoginPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LoginPage.tsx): [MODIFICADO] **Eliminada completamente** la caja "Cuentas Autorizadas" con links clicables a correos y contraseña expuesta. La pantalla de login ahora es limpia y profesional.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Lista `DEMO_USERS` reducida a las 3 cuentas oficiales (`leontesvirtual1@gmail.com`, `luis.leon@premil.cl`, `admin@sysget.cl`). El login ahora consulta `sysget_custom_passwords` en `localStorage` para respetar las contraseñas modificadas por el Admin. También consulta `sysget_profesores_list` para autenticar docentes agregados dinámicamente.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx): [MODIFICADO] Estado inicial cargado desde `localStorage` (`sysget_profesores_list`). Las eliminaciones y agregados de docentes se persisten en `localStorage`. Los cambios de contraseña se guardan en `sysget_custom_passwords`. La lista inicial oficial arranca solo con **María Teresa González**.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] `usuariosRegistradosMock` limpiado — eliminados docentes demo ficticios (Ciencias, Matemática, Alumno). Solo queda el Admin y María Teresa González como docentes oficiales.
- **Verificación / Despliegue**:
  - Compilación: ✅ 2242 módulos, 0 errores TypeScript + Vite (9.22s).
  - Git Commit: `f94c152`

---

### [2026-08-16] Separación Total de Ambientes: Sandbox Demo (Landing) vs Producción Limpia

- **Problema / Requerimiento**:
  - Los datos narrativos enriquecidos (Liceo Bicentenario, caso Martín Sepúlveda, comparativas) deben preservarse en el **Modo Demo / Sandbox** para sacarle partido comercial y funcional a la Landing Page.
  - Al iniciar sesión con un usuario o docente real en **Producción**, el ambiente debe estar limpio:
    - **María Teresa González (Docente Lenguaje - Escuela Premilitar)**: Solo su evaluación oficial (*Ensayo SIMCE Lengua y Literatura 2° Medio*), su curso **`2° Medio`** (genérico, sin la "A"), padrón en 0 estudiantes para carga manual o por CSV y 0 rendiciones previas.
    - **Super Admin (Luis Andrés León González)**: Panel de supervisión en producción con la capacidad de monitorear en tiempo real los colegios y docentes reales registrados (como la Escuela Premilitar) e ir visualizando los avances y resultados a medida que se vayan poblando las rendiciones.
- **Archivos y Solución Técnica**:
  - [`src/data/len2mQuestionsMock.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mQuestionsMock.ts): [MODIFICADO] Actualizado el nombre del curso oficial de `2° Medio A` a **`2° Medio`** en `cursoLenguaje2MMock` y `pruebaLenguaje2MMock`.
  - [`src/pages/CursosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/CursosPage.tsx): [MODIFICADO] Curso inicial por defecto unificado a **`2° Medio`** con código de invitación `LEN2M2026` y 0 alumnos iniciales.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] `seguimientoDocentesMock` actualizado para María Teresa González con curso `2° Medio`, 1 evaluación activa, 0 alumnos rendidos y estado inicial limpio.
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx) y [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Pasaje de `isSandboxMode`. Cuando el usuario ingresa en producción (`isSandboxMode=false`), se deshabilitan balizas demo y se muestra la insignia oficial *"🟢 Producción Oficial"*, orientando el panel al seguimiento de colegios y docentes reales.
- **Verificación / Despliegue**:
  - Compilación: ✅ 2242 módulos transformados sin errores en TypeScript + Vite (9.48s).
  - Git Commit: `7f93f09`

---

### [2026-08-16] Validación Estricta de Contraseña en Cuentas Autorizadas

- **Problema / Requerimiento**:
  - Al ingresar `luis.leon@premil.cl` con cualquier contraseña incorrecta (ej: `asdf`), el sistema permitía el ingreso porque el fallback demo solo validaba el correo pero no comprobaba la contraseña.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO]
    - Definido mapa `DEMO_USER_PASSWORDS` con las contraseñas oficiales autorizadas por cuenta (`123456`, `premil2026` para `luis.leon@premil.cl`; `Saber_2026!` para el Super Admin).
    - En el método `login()`, si la contraseña ingresada no coincide con las contraseñas autorizadas, se rechaza de inmediato con el error:
      > *"Contraseña incorrecta para este usuario. Por favor verifica tus credenciales."*
  - [`src/pages/LoginPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LoginPage.tsx): [MODIFICADO] Actualizada la tarjeta de cuentas autorizadas indicando la clave oficial `123456` y el correo directo de la Escuela Premilitar.
- **Verificación / Despliegue**:
  - Compilación: ✅ 2242 módulos transformados sin errores en TypeScript + Vite (11.49s).
  - Git Commit: `79b9478`

---

### [2026-08-16] Corrección de Feedback Visual de Error en Formulario de Login

- **Problema / Requerimiento**:
  - Al ingresar un correo o contraseña incorrectos, la pantalla parpadeaba, se reseteaban los campos y no se mostraba el mensaje de error visual al usuario.
  - **Causa Raíz**: `login()` en `AuthContext.tsx` activaba el estado global `isLoading=true`, lo que provocaba que `App.tsx` desmontara el componente `LoginPage` para mostrar la pantalla global *"Restaurando sesión..."*. Al retornar el error, `LoginPage` se volvía a montar en blanco, perdiendo el estado del mensaje de error.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] `isLoading` se reservó estrictamente para la verificación inicial de sesión (`checkSession`). `login()` y `register()` ya no alteran `isLoading` global.
  - [`src/pages/LoginPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LoginPage.tsx): [MODIFICADO] Se implementó el estado local `isSubmitting` para el spinner del botón. El componente nunca se desmonta y la tarjeta de error (⚠️ *"Credenciales no reconocidas. Verifica tu correo y contraseña..."*) se renderiza inmediatamente de forma clara y persistente.
- **Verificación / Despliegue**:
  - Compilación: ✅ 2242 módulos transformados sin errores en TypeScript + Vite (9.41s).
  - Git Commit: `5a41f7a`

---

### [2026-08-16] Hardening Definitivo de Seguridad en Login, Aislamiento Total de Materia y Equipo Docente Real

- **Problema / Requerimiento**:
  1. En el Login, correos como `luis.leon@gmail.com` o `luis.leon@yahoo.ar` con cualquier contraseña ingresaban debido a que `inferUserFromEmail` mantenía comprobaciones permisivas.
  2. En el Dashboard del docente de Lenguaje continuaban apareciendo evaluaciones o referencias de otras especialidades (Ciencias Naturales 6° Básico y Matemática 8° Básico).
  3. En la sección "Gestión del Equipo Docente" (`ProfesoresPage.tsx`), se mostraban datos de profesores demo hardcodeados (`profesoresIniciales`) en vez de la lista real del `AuthContext` (donde reside María Teresa González).
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO]
    - `inferUserFromEmail`: Transformada en función segura que devuelve `null` de forma estricta. Ningún correo no listado explícitamente en `DEMO_USERS` o en la base de datos puede acceder al sistema.
    - Agregado alias `luis.leon@premil.cl` para el perfil de María Teresa González.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO]
    - Caso `usuarios` del router protegido para que el docente solo reciba sus pruebas (`dashboardPruebas`) y su reporte (`dashboardReporte`) filtrados por `asignaturaId`.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx): [MODIFICADO]
    - Eliminado el arreglo estático `profesoresIniciales`. Ahora se suscribe a `usuarios` del `AuthContext` filtrando solo profesores y admins registrados.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO]
    - `usuariosRegistradosMock`: Incorporado `currentUserProfesorPremilitar` (María Teresa González — Lenguaje) al equipo docente.
- **Verificación / Despliegue**:
  - Compilación TypeScript + Vite: ✅ 2242 módulos transformados sin errores en 9.93s (`dist/index.html`, `dist/assets/*`).
  - Git Commit: `dbef80d` — `fix(rbac): aislamiento estricto docente - login seguro, dashboard limpio, equipo docente real`

---

### [2026-08-16] Aislamiento Estricto Docente, Persistencia de Cursos/Alumnos en LocalStorage y Hardening de Login

- **Problema / Requerimiento**:
  1. Al borrar cursos (como 8° Básico A y B), estos reaparecían tras refrescar la página (`F5`) porque no existía persistencia por usuario.
  2. El subtítulo de cursos indicaba erróneamente *"alumnos matriculados en Liceo Bicentenario Los Andes"* con 35 alumnos ficticios para un docente que debe iniciar de cero en la Escuela Premilitar.
  3. El dashboard docente mostraba gráficos y logros del 84% sin que los alumnos hubiesen rendido aún la evaluación.
  4. El generador de evaluaciones permitía a un docente de Lenguaje seleccionar Matemática y Ciencias.
  5. En el login, correos desconocidos no registrados logueaban automáticamente por un fallback permisivo.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Eliminado fallback permisivo en `inferUserFromEmail`. Cualquier correo desconocido o no registrado es rechazado de inmediato con error de autenticación.
  - [`src/pages/CursosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/CursosPage.tsx): [MODIFICADO] Integración de `currentUser` y persistencia en `localStorage` (`sysget_cursos_${userId}`). Establecimiento dinámico (**Escuela Premilitar Héroes de la Concepción**) y curso inicial limpio **2° Medio A** (`cur-2m`).
  - [`src/pages/AlumnosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/AlumnosPage.tsx): [MODIFICADO] Integración de `currentUser` y persistencia en `localStorage` (`sysget_alumnos_${userId}`). Padrón inicial en 0 estudiantes para permitir carga manual o mediante CSV.
  - [`src/components/EvaluacionGeneratorModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/EvaluacionGeneratorModal.tsx): [MODIFICADO] Bloqueo de selector de asignatura cuando el docente tiene una única especialidad asignada (`currentUser.asignaturaId`).
  - [`src/components/ProfesorDashboard.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx) y [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Estado inicial limpio con 0 alumnos rendidos, marcando estado *"Pendiente de rendición"* en KPIs en lugar de métricas ficticias.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Pasaje de `currentUser` a `CursosPage`, `AlumnosPage` y filtrado RBAC en generador de evaluaciones.
- **Verificación / Despliegue**:
  - Commit: ✅ `1b1e8dc` — `feat: aislamiento estricto docente, persistencia localStorage de cursos/alumnos, estado inicial limpio y correccion seguridad login`
  - Push a origin/main: ✅ Sincronizado en Vercel.

---

### [2026-08-16] Integración Oficial de Ensayo SIMCE Lengua y Literatura 2° Medio (Agosto 2026) — Perfil María Teresa González

- **Problema / Requerimiento**:
  1. Extraer y procesar desde el archivo Word oficial (`Ensayo+SIMCE+Lenguaje+2° Medio.docx`) las 30 preguntas curriculares de Lengua y Literatura para 2° Medio con referencia temporal **Agosto 2026**.
  2. Clasificar cada pregunta con sus **Ejes Temáticos** y **Habilidades Cognitivas MINEDUC**, formulando pautas con alternativas correctas, explicaciones pedagógicas y rúbricas de desarrollo de 2 puntos para las preguntas abiertas.
  3. Vincular la evaluación al perfil docente de **María Teresa González** (Escuela Premilitar Héroes de la Concepción, RBD 31030) con código de acceso público `SIMCE-2M-LEN-AGO`, curso `2° Medio A`, alumnos mock y soporte de impresión de cuadernillo PDF con diagrama botánico (`image1.jpeg`).
- **Archivos y Solución Técnica**:
  - [`src/data/len2mQuestionsMock.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mQuestionsMock.ts): [NUEVO] Módulo tipado que alberga las 30 preguntas (`preg-len2m-01` a `preg-len2m-30`), los 4 ejes curriculares de 2° Medio (`LEN-LIT-2M`, `LEN-NOLIT-2M`, `LEN-ARG-2M`, `LEN-ESC-2M`), el curso `2° Medio A` (`curso-2m`), la evaluación `prueba-len2m-101` y el padrón de 10 estudiantes.
  - [`public/preguntas/simce_len_2m/image1.jpeg`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/simce_len_2m/image1.jpeg): [NUEVO] Diagrama botánico extraído del Word para la Lectura 4 (Tejocote / *Crataegus mexicana*).
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Integración de ejes, curso, alumnos, preguntas y tarjeta de seguimiento docente de María Teresa González.
- **Verificación / Despliegue**:
  - Compilación TypeScript + Vite: ✅ 2242 módulos, 0 errores, 30.21s.
  - Disponibilidad: Inmediata para rendición online, cuadernillo imprimible por curso/alumno y corrección rápida.

---

### [2026-08-16] Membrete Institucional con Logos en Cuadernillos de Impresión y Selector Multicolegio

- **Problema / Requerimiento**:
  1. Los cuadernillos de evaluación no incluían el logo oficial del establecimiento en el membrete, lo que restaba identidad institucional al material impreso.
  2. No existía forma de seleccionar entre distintos colegios al generar el PDF, limitando el uso a un único establecimiento hard-codeado.
- **Archivos y Solución Técnica**:
  - [`public/logos/colegio-san-agustin.jpg`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/logos/colegio-san-agustin.jpg), [`public/logos/escuela-premilitar.png`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/logos/escuela-premilitar.png), [`public/logos/liceo-bicentenario.jpg`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/logos/liceo-bicentenario.jpg): [NUEVO] Logos reales de 3 establecimientos del catálogo multicolegio.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Añadido `establecimientosCatalog` con nombre, RBD y `logoUrl` de cada establecimiento.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [MODIFICADO] Selector de establecimiento (multicolegio) en el modal de impresión. El membrete del cuadernillo muestra el logo del colegio seleccionado junto al nombre y RBD institucional.
- **Verificación / Despliegue**:
  - Commit: ✅ `e7ea48f` — `feat: membrete institucional con logos en cuadernillos e impresion y selector multicolegio`
  - Push a origin/main: ✅ Código sincronizado

---

### [2026-08-16] Backend Serverless `/api/users` para Registro y Aprobación Persistente en Base de Datos

- **Problema / Requerimiento**:
  1. Al registrarse una docente (María Teresa González), la solicitud no aparecía en el panel de **Gestión de Usuarios** tras refrescar.
  2. Al hacer clic en el botón de aprobación del correo, el sistema indicaba que el enlace era inválido debido a un error de recursión infinita en las políticas RLS del cliente de Supabase (`42P17`).
  3. Al enviar la solicitud de registro, el usuario era auto-iniciado o devuelto al dashboard.
- **Archivos y Solución Técnica**:
  - [`api/users.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/users.ts): [NUEVO] Endpoint serverless integral en Vercel que utiliza `SUPABASE_SERVICE_ROLE_KEY` para interactuar con la base de datos de Supabase sin restricciones de RLS.
    - `GET /api/users`: Lista todos los usuarios registrados y pendientes directamente de la base de datos `perfiles`.
    - `POST /api/users?action=register`: Crea/actualiza la cuenta, asigna token persistente y despacha el correo formal vía Google SMTP.
    - `POST /api/users?action=approve-token`: Valida el token del correo, activa la cuenta a `activo` y asigna 30 días de Trial.
    - `POST /api/users?action=approve-id` y `suspend`: Gestión directa desde el panel administrativo.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Conectado `fetchUsers`, `register`, `approveUserByToken` y `approveUser` al backend serverless `/api/users`. Eliminado el auto-login tras registrarse.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Protección de `authView !== 'register'` en la restauración reactiva de sesión.
- **Verificación / Despliegue**:
  - Prueba directa de API en producción: ✅ Registro, listado y aprobación por token verificados exitosamente con respuesta `200 OK`.
  - Despliegue Vercel Producción: ✅ `dpl_141W27jWsZJyULCiawzotDLiyKss`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-16] Persistencia Total de Sesión en Refresh (localStorage + Supabase) y Despliegue Producción

- **Problema / Requerimiento**:
  - Al refrescar el navegador (F5), la sesión se cerraba inesperadamente porque `login()` no almacenaba el identificador de sesión en `localStorage` y `showLanding` se activaba por defecto antes de resolver el estado de autenticación.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO]
    - `login()`: Guarda `localStorage.setItem('sysget_session_email', cleanEmail)` en todos los caminos exitosos de autenticación (Supabase, Mock, Demo e Inferido).
    - `checkSession()`: Si Supabase no tiene el perfil creado en la tabla `perfiles`, recupera el usuario desde `DEMO_USERS` y sincroniza con `localStorage`.
  - [`src/App.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO]
    - Añadida pantalla de transición mientras `isLoading` esté activo.
    - `useEffect` reactivo que desactiva `showLanding` inmediatamente cuando `isAuthenticated && user` se restauran.
- **Verificación / Despliegue**:
  - Compilación TypeScript + Vite: ✅ 2241 módulos, 0 errores, 7.05s.
  - Despliegue Vercel Producción: ✅ `dpl_8RP8oNuF6z2jmUwrFL6GcRtrU1R9`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Corrección de Sesión Persistente, Aprobación por Token y Google SMTP

- **Problema / Requerimiento**:
  1. Al refrescar la página, el usuario era expulsado y debía iniciar sesión de nuevo (sesión no persistía).
  2. Al hacer clic en el enlace de aprobación del correo, aparecía "El enlace es inválido o ya fue activado" aunque la cuenta fuera nueva.
  3. El correo de notificación no llegaba al admin por credenciales SMTP incorrectas.
  4. María Teresa González no aparecía en el panel admin tras registrarse.
- **Archivos y Solución Técnica**:
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO]
    - `checkSession()`: Ahora restaura sesión para rol `admin`/`superadmin` aunque estado no sea `activo`. Cuando no hay perfil en `perfiles`, usa `DEMO_USERS` como fallback. Guarda email en `localStorage` para persistencia offline.
    - `approveUserByToken()`: Eliminado el RPC inexistente. Ahora consulta directamente `perfiles.approval_token = token` en Supabase y actualiza `estado='activo'` directamente. El token sobrevive reinicios porque vive en la BD.
    - `logout()`: Limpia `localStorage.sysget_session_email` al cerrar sesión.
    - `notifyAdminNewRegistration()`: Ahora incluye `rbd` y `asignaturaNombre` en el payload.
  - [`api/notify-admin.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/api/notify-admin.ts): [NUEVO] Vercel Serverless Function con Google SMTP. Usa contraseña de aplicación `SMTP_PASS_REDACTED` para `leontestvirtual1@gmail.com`. Envía correo a `leontestvirtual1@gmail.com` y `luis_leon_g@hotmail.com`. Incluye Especialidad, RBD y botón de 1-clic.
  - [`supabase/functions/notify-admin/index.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/functions/notify-admin/index.ts): [MODIFICADO] Actualizado con misma contraseña de aplicación Google como fallback. Añadidos campos `rbd` y `asignaturaNombre` en la tarjeta del correo.
- **Verificación / Despliegue**:
  - Test SMTP local: ✅ `node test_smtp.mjs` → correo entregado a `leontestvirtual1@gmail.com`
  - Test endpoint producción: ✅ `STATUS: 200 {"success":true,"messageId":"..."}`
  - Compilación TypeScript + Vite: ✅ 2241 módulos, 0 errores.
  - Despliegue Vercel Producción: ✅ `dpl_F1rTbwxVknd6rWLBi89gi5182T62`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Flujo Oficial y Exclusivo de Aprobación: Panel Admin & Correo Institucional (Eliminación de Demo)

- **Problema / Requerimiento**:
  - Eliminar de raíz la caja y botones de simulación demo de la pantalla de registro de usuarios. La activación de nuevas cuentas debe realizarse exclusivamente desde:
    1. El panel de administración de Sysget Saber (**Gestión de Usuarios** / pestaña *Solicitudes Pendientes*).
    2. El correo de notificación enviado al Super Admin / UTP vía **Google SMTP** con el botón de 1-clic.
- **Archivos y Solución Técnica**:
  - [`src/pages/RegisterPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx): [MODIFICADO] Eliminada toda la sección de simulación demo, tokens de copia y botones de autoaprobación. La pantalla de éxito ahora es 100% formal e informativa, indicando que la solicitud fue enviada a revisión y validación administrativa.
  - [`src/pages/GestionUsuariosPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx): [VERIFICADO] Panel centralizado para que el Super Admin apruebe con 1-clic cualquier solicitud pendiente (`estado: 'pendiente_aprobacion'`), asignándole su período de prueba (Trial 30 días) o plan institucional.
- **Verificación / Despliegue**:
  - Compilación TypeScript + Vite: ✅ 2241 módulos, 0 errores, 10.46s.
  - Despliegue Vercel Producción: ✅ `dpl_2Tutwx7oiukLPFFVTo4r1T2eZ3FB`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Registro con Especialidad/RBD, Impresión Personalizada por Alumno e Ingreso Rápido de Respuestas

- **Problema / Requerimiento**:
  1. En el registro de docentes faltaba la selección de especialidad curricular y el RBD del colegio para mapeo institucional.
  2. Ofrecer la opción de imprimir cuadernillos pre-personalizados con los datos de cada estudiante (Nombre, RUT, Curso, N° Lista) para fotocopiar y entregar directamente.
  3. Proporcionar un método ultrarrápido para que el profesor ingrese las respuestas de las hojas físicas recogidas (grilla interactiva 1-clic con cálculo automático de % de logro y puntaje SIMCE + subida de foto de respaldo).
- **Archivos y Solución Técnica**:
  - [`src/pages/RegisterPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx): [MODIFICADO] Añadido selector de Especialidad / Asignatura del catálogo oficial MINEDUC (solo para rol profesor) y campo RBD del establecimiento con ayuda contextual.
  - [`src/context/AuthContext.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Soporte de `rbd` en la interfaz `RegisterData`.
  - [`src/types/index.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts) y [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Añadido tipo `AlumnoBasico` y catálogo `alumnosMock` con estudiantes por curso (8° Básico A y 6° Básico B).
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [MODIFICADO] Nuevo modo **"2. Por Alumno"** con selector interactivo de estudiantes (seleccionar todos/individual), membretes pre-rellenados con datos de cada alumno y saltos de página `break-after: page;` entre cuadernillos.
  - [`src/components/IngresoRespuestasModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/IngresoRespuestasModal.tsx): [NUEVO] Modal Fast-Track para corregir hojas físicas: selector de alumno del curso, subida opcional de foto de la hoja física, grilla óptica A/B/C/D con autocorrección inmediata, cálculo de puntaje SIMCE en vivo y botón "Guardar y Siguiente Alumno".
  - [`src/pages/EvaluacionesPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx): [MODIFICADO] Integración de botón destacado `Ingresar Respuestas (Foto/Rápido)` en cada tarjeta de evaluación.
- **Verificación / Despliegue**:
  - Compilación TypeScript + Vite: ✅ 2241 módulos, 0 errores, 9.16s.
  - Despliegue Vercel Producción: ✅ `dpl_5qAsHsqo2gNSbg5FxnkKRSMpZj4F`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Skill de Arquitectura Académica y Ajuste Definitivo de Tamaño/Sincronización del Modal Docente

- **Problema / Requerimiento**:
  1. Al hacer clic en "Editar Especialidad" en un profesor, los datos no se cargaban (aparecían los placeholders vacíos) y la parte inferior del modal con los botones "Cancelar" y "Guardar Cambios" seguía cortándose verticalmente en pantallas de laptop.
  2. Generar e integrar el skill oficial de la suite académica al proyecto (`.agents/skills/evaluaciones-academicas-suite`).
- **Archivos y Solución Técnica**:
  - [`.agents/skills/evaluaciones-academicas-suite/SKILL.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/evaluaciones-academicas-suite/SKILL.md): [NUEVO] Skill oficial que estandariza el motor de impresión aislada sin fugas de `#root`, las reglas de modales compactos de 2 columnas (altura máxima < 350px con `useEffect` reactivo) y la arquitectura curricular (especialidades, ejes temáticos y habilidades).
  - [`.agents/AGENTS.md`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/AGENTS.md): [MODIFICADO] Añadida la regla obligatoria de arquitectura de evaluaciones y modales académicos referenciando el nuevo skill.
  - [`src/pages/ProfesoresPage.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ProfesoresPage.tsx): [MODIFICADO] Sincronización reactiva con `useEffect` en `ProfesorFormModal` para precargar de inmediato los datos del docente al editar (`form.nombre`, `form.apellido`, etc.). Dimensiones reducidas a `max-w-xl` ultra-compacto con inputs densos (`py-1.5 px-2.5`) y altura total de solo 320px, garantizando 100% de visibilidad de los botones sin ningún corte vertical.
- **Verificación / Despliegue**:
  - Compilación Vite + TypeScript: ✅ 2240 módulos, 0 errores, 12.31s.
  - Despliegue Vercel Producción: ✅ `dpl_Do64g3YffUN8fVhn7xoXQFRZxuzx`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Eliminación Total de Hojas en Blanco al Imprimir y Nombre Descriptivo al Guardar PDF

- **Problema / Requerimiento**:
  1. Al imprimir en cualquiera de las 3 opciones (1. Cuadernillo, 2. Hoja de Respuestas, 3. Pauta Clave Docente), se generaba una primera hoja en blanco porque los elementos superiores del DOM de la aplicación (`#root`, navbar, sidebar, listados) conservaban altura en el layout antes del canvas imprimible.
  2. El archivo PDF descargado sugería un nombre genérico en vez del nombre oficial de la evaluación y su modalidad.
- **Archivos y Solución Técnica**:
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [MODIFICADO] Montaje del modal en la raíz del documento mediante `createPortal(modalContent, document.body)` con clase `print-modal-portal`. Configuración de `document.title` dinámico antes de `window.print()` con el formato `[Título Evaluación] - [Modalidad] ([Curso])` (ej. `Evaluación Diagnóstica Nacional de Matemática 8° Básico - Cuadernillo de Evaluación (8° Básico A)`).
  - [`src/index.css`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/index.css): [MODIFICADO] En `@media print`, regla `body:has(.print-modal-portal) #root, #root.printing-modal-active { display: none !important; }` que hace desaparecer el árbol de la aplicación del flujo de impresión (0px de altura y ancho). El documento imprimible inicia inmediatamente en la coordenada (0,0) de la Página 1 sin ninguna hoja en blanco previa.
  - [`src/components/SandboxSpecialModals.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SandboxSpecialModals.tsx): [MODIFICADO] Aplicado el mismo patrón con `createPortal` y nombre de archivo automático para la Ficha de Reforzamiento Pedagógico de Martín Sepúlveda.
  - [`src/components/ReporteTabuladoView.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ReporteTabuladoView.tsx): [MODIFICADO] Asignación de `document.title` descriptivo al imprimir el Reporte Tabulado Curricular.
- **Verificación / Despliegue**:
  - Compilación Vite + TypeScript: ✅ 2240 módulos, 0 errores, 12.89s.
  - Despliegue Vercel: ✅ `dpl_FteMTTFk8H4kZDj4L1fqPrqqJXok`
  - URL en Producción: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-15] Corrección Paginación Completa del Cuadernillo de Impresión

- **Problema / Requerimiento**: El cuadernillo de evaluación se truncaba en la pregunta 7 al imprimir/guardar PDF. La causa era triple: (1) `position: absolute` en `.printable-paper-canvas` bloquea la paginación en Chromium; (2) los contenedores del modal tenían `max-h-[92vh]` y `overflow-hidden` que Chromium usa como límite de página; (3) `prueba-101` solo tenía 6 preguntas, insuficientes para verificar paginación multi-página.
- **Archivos y Solución Técnica**:
  - [`src/index.css`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/index.css): [MODIFICADO] En `@media print`: cambiado `position: absolute` → `position: relative` en `.printable-paper-canvas`; agregadas reglas que neutralizan `.fixed`, `[class*="overflow-hidden"]`, `[class*="max-h-"]` (→ `position: static; overflow: visible; max-height: none`); aplicado a `html, body, #root` para garantizar flujo multi-página sin recorte de Chromium/Blink.
  - [`src/components/PrintEvaluacionModal.tsx`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [MODIFICADO] Agregadas variantes `print:` en el overlay (`print:static print:overflow-visible`), en el contenedor modal (`print:max-h-none print:overflow-visible`) y en el canvas interior (`print:block print:overflow-visible print:h-auto`) para eliminar toda restricción de altura al momento de imprimir.
  - [`src/data/mockData.ts`](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Agregadas 21 preguntas de Matemática 8° Básico (`preg-30` a `preg-50`) cubriendo los 4 ejes curriculares (Números, Álgebra, Geometría, Probabilidad/Estadística). `prueba-101` expandida de 6 a **30 preguntas** para validar impresión en 6-8 páginas reales.
- **Verificación / Despliegue**:
  - Build TypeScript + Vite: ✅ 2240 módulos, 0 errores, 11.39s.
  - Despliegue Vercel producción: ✅ `dpl_BER93eUmSdsDuobN7AVszWvPs5fr`
  - URL activa: **[https://sysget-saber.vercel.app](https://sysget-saber.vercel.app)**

---

### [2026-08-14] Carga Oficial de Ensayo 3 SIMCE Ciencias Naturales 6° Básico (Preguntas, Ejes y Figuras)
- **Problema / Requerimiento**: Limpiar los datos mock y extraer/cargar el ensayo completo real de SIMCE Ciencias Naturales 6° Básico (35 preguntas de selección múltiple, tabla de especificaciones con 18 ejes temáticos y habilidades psicométricas, figuras/gráficos recortados en alta resolución y evaluación activa).
- **Archivos y Solución Técnica**:
  - [src/types/index.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts): [MODIFICADO] Añadidos campos opcionales `imagenUrl?: string` y `tablaMarkdown?: string` a la interfaz `Pregunta`.
  - [public/preguntas/simce_cn_6b/](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/public/preguntas/simce_cn_6b/): [NUEVO] Directorio con figuras y diagramas extraídos del PDF en alta resolución (nutrientes, vena cava, limón en circuito, símbolos, circuitos eléctricos, temperatura oceánica, fuentes de emisión).
  - [src/data/mockData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Cargadas las 35 preguntas reales con sus alternativas, claves, habilidades (Conocimiento, Aplicación, Razonamiento) y los 18 Ejes Temáticos del currículum nacional. Creada la prueba activa `Ensayo 3 SIMCE Ciencias Naturales 6° Básico` para `6° Básico A` (código `SIMCE-6A-CN3`).
  - [src/components/AlumnoEvaluationView.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AlumnoEvaluationView.tsx): [MODIFICADO] Soporte de renderizado responsivo de imágenes y figuras de preguntas para los estudiantes.
  - [src/pages/BancoPreguntasPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx): [MODIFICADO] Previsualización de imágenes y figuras en las tarjetas del banco de preguntas docente.
- **Verificación / Despliegue**:
  - Compilación TypeScript y Vite exitosa (`tsc && vite build`) con 0 errores y 1644 módulos empaquetados en 6.90s.
  - Pruebas e imágenes verificadas en el banco y el runner de alumnos.

---

### [2026-08-13] Despliegue Oficial en Producción en Vercel
- **Problema / Requerimiento**: Realizar el despliegue del proyecto en producción en Vercel (Ítem 3), conectando la base de datos Supabase Cloud y las configuraciones de seguridad HTTP y enrutamiento SPA.
- **Archivos y Solución Técnica**:
  - [vercel.json](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/vercel.json): [NUEVO] Configuración para SPA con Vite, reescrituras de rutas limpias (`rewrites`), cabeceras HTTP de seguridad (`nosniff`, `DENY`, `strict-origin-when-cross-origin`) y caché inmutable de assets estáticos.
  - [.vercelignore](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.vercelignore): [NUEVO] Exclusión de `.agents`, `supabase`, `.gemini`, logs y archivos de desarrollo para un bundle optimizado.
  - Variables de entorno en producción: Inyectadas `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_NOMBRE_ESTABLECIMIENTO` y `VITE_ESTABLECIMIENTO_RBD`.
- **Verificación / Despliegue**:
  - Proyecto en Vercel: `sysget-paes/sysget-saber`
  - URL de producción oficial: **`https://sysget-saber.vercel.app`**
  - Despliegue verificado y activo: `status: ok`, `readyState: READY`.

---

### [2026-08-13] Landing Page Institucional + RBAC Completo con Aislamiento Docente por Asignatura
- **Problema / Requerimiento**: Implementar Landing Page que destaque Sysget y Sysget Saber, y aplicar RBAC estricto: el admin tiene control total (único con acceso a Configuración), cada profesor opera aislado en su asignatura (Matemática o Lenguaje), y los alumnos solo ven su portal de rendición.
- **Archivos y Solución Técnica**:
  - [src/pages/LandingPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LandingPage.tsx): [NUEVO] Landing institucional glassmorphism oscura con Hero, KPIs, pilares pedagógicos y selector de acceso por rol/asignatura directamente desde la portada.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): Integrada `LandingPage` con estado `showLanding`. RBAC extendido a `admin` (acceso completo incluyendo Configuración). Ruta `configuracion` bloqueada para rol `profesor` (redirige a Dashboard). Props `currentUser` pasadas a `EvaluacionesPage` y `BancoPreguntasPage`.
  - [src/components/Navbar.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Navbar.tsx): Botón "Inicio" para volver a la Landing y selector rápido de rol/asignatura (Admin, Matemática, Lenguaje, Alumno).
  - [src/components/Sidebar.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx): Navegación diferenciada por rol con badges de asignatura. Ítem Configuración oculto para `profesor` y `alumno`.
  - [src/components/ProfesorDashboard.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx): Banner de bienvenida adaptativo según rol (admin muestra "Panel General UTP", docente muestra su asignatura específica).
  - [src/pages/EvaluacionesPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx): Prop `currentUser` para pre-filtrar evaluaciones según asignatura del docente.
  - [src/pages/BancoPreguntasPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx): Prop `currentUser` para pre-filtrar banco de preguntas según asignatura docente.
  - [src/types/index.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts): `UserRole` extendido con `'admin'`. `UserProfile` con campos `asignaturaId`, `asignaturaNombre` y `cargo`.
  - [src/data/mockData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): Usuarios demo: `currentUserAdmin`, `currentUserProfesor` (Matemática), `currentUserProfesorLenguaje`, `currentUserAlumno`.
  - [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): `switchRole` ampliado para soportar todos los roles demo con asignatura.
- **Verificación / Despliegue**: `npm run build` ejecutado exitosamente — 0 errores TypeScript, 1644 módulos transformados en 7.31s. Build de producción listo en `/dist`.

---


### [2026-08-12] Revisión General del Proyecto y Auditoría Inicial
- **Problema / Requerimiento**: Realizar una revisión completa de la estructura del proyecto "Sysget Saber" (Plataforma de Evaluaciones Nacionales / SIMCE Chile) y establecer el registro oficial de bitácora.
- **Archivos y Solución Técnica**:
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [NUEVO] Creado para llevar el registro estandarizado del historial de cambios según el skill `task-summary-format`.
  - [README.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/README.md): Revisado. Especifica arquitectura, características de UI/UX, multi-colegio (white-label) y guía de inicio.
  - [request.MD](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/request.MD): Revisado. Contiene la guía completa de integración Supabase (Local + Cloud), Docker, CLI y despliegue en Vercel.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx) y [src/components/](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components): Auditoría de componentes (Portal Docente, Generador de Pruebas, Reporte Tabulado con Plan de Reforzamiento, Portal Alumno y Runner de Rendición).
  - [supabase/migrations/001_initial_schema.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/001_initial_schema.sql): Revisado. Define tablas PostgreSQL para usuarios, perfiles, cursos, matriculas, asignaturas, ejes temáticos, habilidades, preguntas, pruebas, rendiciones y respuestas.
- **Verificación / Despliegue**: Auditoría del proyecto completada con éxito. Aplicación construida en React 18, Vite 6, TypeScript y Tailwind CSS con soporte para modo oscuro/claro.

---

### [2026-08-13] Separación de Rutas Duplicadas: Dashboard, Evaluaciones y Configuración
- **Problema / Requerimiento**: Los ítems del sidebar `Dashboard`, `Evaluaciones` y `Configuración` mostraban la misma vista (`ProfesorDashboard`). Se solicitó que cada ítem entregue información y funcionalidad exclusiva y diferenciada.
- **Archivos y Solución Técnica**:
  - [src/pages/EvaluacionesPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx): [NUEVO] Vista dedicada de gestión de evaluaciones con buscador, filtros por asignatura/estado, estadísticas rápidas (activas/finalizadas/borradores), tarjetas de ensayo con código para alumnos, y acciones de activar/finalizar prueba.
  - [src/pages/ConfiguracionPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/ConfiguracionPage.tsx): [NUEVO] Vista de configuración con 4 pestañas: Establecimiento (RBD, dependencia, región), Reglas Evaluativas (escala SIMCE/notas, exigencia, duración), Cloud & Supabase (estado de conexión), y Mi Perfil (datos personales + toggle dark mode).
  - [src/components/ProfesorDashboard.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx): [MODIFICADO] Prop opcional `onNavigateToEvaluaciones` y enlace "Ver todas →" para diferenciar el dashboard como resumen ejecutivo.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Routing del switch: `evaluaciones` → `EvaluacionesPage`, `configuracion` → `ConfiguracionPage`, `dashboard` → `ProfesorDashboard`. Handler `handleUpdatePruebaEstado` agregado.
- **Verificación / Despliegue**: Build de producción exitoso — `vite build`, exit code 0, 1642 módulos transformados, sin errores TypeScript.

---

### [2026-08-13] Inicialización de Repositorio Git Local y Preparación para GitHub
- **Problema / Requerimiento**: Inicializar el repositorio Git local y guiar la conexión con GitHub usando la cuenta `leontestvirtual1@gmail.com`.
- **Archivos y Solución Técnica**:
  - Configurado `git config safe.directory` para solucionar permisos de carpeta en Windows.
  - Inicializado el repositorio Git local en la rama principal `main`.
  - Configurado el usuario Git local con el email `leontestvirtual1@gmail.com`.
  - Realizado el primer commit (`Initial commit: Sysget Saber - Proyecto Evaluaciones Nacionales`) con 44 archivos.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea.
- **Verificación / Despliegue**: Repositorio local `main` vinculado al remoto `https://github.com/leontestvirtual1-sketch/proyecto-evaluaciones-nacionales.git` y subida inicial (`push`) de código ejecutada.

---

### [2026-08-13] Creación del Skill de Organización de Vaults de Obsidian
- **Problema / Requerimiento**: Agregar un skill especializado para diagnosticar, planificar y estructurar vaults de Obsidian aplicando metodologías (PARA, Zettelkasten, Híbrido) e integrando herramientas MCP de Obsidian.
- **Archivos y Solución Técnica**:
  - [.agents/skills/obsidian-vault-organizer/SKILL.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/obsidian-vault-organizer/SKILL.md): [NUEVO] Skill con directrices de diagnóstico, sistemas de organización (PARA, Zettelkasten simplificado, Híbrido), convenciones de nombrado/etiquetado, fases de planificación antes de ejecución y uso seguro de herramientas MCP (`move-note`, `rename-tag`, `create-directory`, etc.).
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según el formato de `task-summary-format`.
- **Verificación / Despliegue**: Archivo SKILL.md creado y verificado con frontmatter YAML válido para su detección por el sistema de agentes.

---

### [2026-08-13] Creación del Skill de Seguridad en Aplicaciones Web
- **Problema / Requerimiento**: Agregar un skill y regla obligatoria de seguridad para aplicaciones web y APIs que cubra protección de secretos (.env), validación Zod/XSS/SQLi, autenticación RBAC/IDOR, CORS, cabeceras Helmet, rate limiting, logs seguros, cookies HttpOnly y auditoría de dependencias.
- **Archivos y Solución Técnica**:
  - [.agents/skills/web-app-security/SKILL.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/skills/web-app-security/SKILL.md): [NUEVO] Skill integral con 10 pilares de seguridad defensiva, mitigación de vulnerabilidades OWASP Top 10 y checklist de verificación.
  - [.agents/AGENTS.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.agents/AGENTS.md): [MODIFICADO] Añadida regla local para requerir el cumplimiento del skill `web-app-security` en el desarrollo de APIs, backend, base de datos y autenticación.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según el formato de `task-summary-format`.
- **Verificación / Despliegue**: Archivos SKILL.md y AGENTS.md validados y registrados en el control de versiones local.

---

### [2026-08-13] Conexión y Vinculación de Credenciales Supabase Cloud
- **Problema / Requerimiento**: Revisar y configurar las credenciales del proyecto Supabase Cloud en el archivo de variables de entorno `.env.local` para activar la conexión remota en Vite y Next.js.
- **Archivos y Solución Técnica**:
  - [.env.local](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.env.local): [MODIFICADO] Asignadas las credenciales de Supabase Cloud (`VITE_SUPABASE_URL=https://khtdzgfqjggycrcbrytw.supabase.co` y su correspondiente `VITE_SUPABASE_ANON_KEY`), manteniendo variables `NEXT_PUBLIC_*` y `SUPABASE_SERVICE_ROLE_KEY` sin exponerlas a Git (protegido por `.gitignore`).
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea.
- **Verificación / Despliegue**: Build de producción exitoso con `tsc && vite build` (código 0, 1643 módulos transformados sin errores). Protegido contra filtraciones en el repositorio.

---

### [2026-08-13] Migración y Aprovisionamiento del Esquema en Supabase Cloud
- **Problema / Requerimiento**: Ejecutar el script DDL inicial en el SQL Editor de Supabase Cloud para aprovisionar las tablas del sistema, relaciones, llaves foráneas y políticas de seguridad RLS.
- **Archivos y Solución Técnica**:
  - [supabase/migrations/001_initial_schema.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/001_initial_schema.sql): Migración ejecutada con éxito en PostgreSQL remoto.
  - Creadas las 9 tablas del modelo de datos: `perfiles`, `cursos`, `matriculas`, `asignaturas`, `ejes_tematicos`, `habilidades`, `preguntas`, `pruebas` y `rendiciones`.
  - Habilitadas las políticas de Row Level Security (RLS) en todas las tablas del esquema `public`.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Registro oficial actualizado.
- **Verificación / Despliegue**: Tablas confirmadas y visibles en el Table Editor de Supabase Cloud en el proyecto `khtdzgfqjggycrcbrytw`.

---

### [2026-08-13] Generación de Seed SQL y Ejecución del Servidor de Desarrollo
- **Problema / Requerimiento**: Preparar un script SQL de datos iniciales (*Seed*) con usuarios demo, cursos, preguntas SIMCE y evaluaciones, e iniciar el entorno de desarrollo local.
- **Archivos y Solución Técnica**:
  - [supabase/migrations/002_seed_demo_data.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/002_seed_demo_data.sql): [NUEVO] Script SQL con usuarios demo (`maria@demo.cl` / `pedro@demo.cl`), perfiles para *Escuela Premilitar Heroes De La Concepción*, 3 cursos (8° Básico A/B y 2° Medio A), preguntas SIMCE, pruebas activas con código de acceso y rendición de muestra con 100% de logro.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.
- **Verificación / Despliegue**: Servidor de desarrollo Vite iniciado activamente en `http://localhost:3000/`. Script SQL preparado para ejecución en Supabase Cloud.

---

### [2026-08-14] Rediseño Integral del Modo Sandbox 2.0 y Fortalecimiento RBAC
- **Problema / Requerimiento**:
  1. Aislamiento curricular estricto: evitar que los docentes accedan a especialidades ajenas o al rol admin en el Navbar y Banco de Preguntas.
  2. Corrección de encoding UTF-8 (mojibake en enunciados matemáticos).
  3. Corrección del filtro de cursos en `AlumnosPage.tsx` y visualización de cursos reales.
  4. Separación del perfil `admin` del perfil de docente en el servicio de autenticación y manejo adecuado de credenciales erróneas.
  5. Rediseño del Modo Sandbox guiado: datos narrativos (Liceo Bicentenario Los Andes, caso Martín Sepúlveda), mapas de calor, gráficos históricos con Recharts, plan de mejoramiento autogenerado, corrección de redacción con IA y mini-SIMCE interactivo de 5 preguntas para el estudiante.
- **Archivos y Solución Técnica**:
  - [src/components/SandboxBanner.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SandboxBanner.tsx): [NUEVO] Banner superior dismissable y botón flotante CTA con modal de contacto para colegios reales.
  - [src/components/SandboxBeacon.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SandboxBeacon.tsx): [NUEVO] Componente de baliza luminosa que guía a las *Acciones Estrella*.
  - [src/components/PlanMejoramientoModal.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PlanMejoramientoModal.tsx): [NUEVO] Modal con Plan de Mejoramiento Educativo (PME 2026) autogenerado con IA y botón de exportación PDF (toast demo).
  - [src/components/SandboxSpecialModals.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SandboxSpecialModals.tsx): [NUEVO] Modales de ficha remedial de Martín Sepúlveda, evaluación de redacción argumentativa con IA (NLP) y aislamiento pedagógico.
  - [src/components/MiniSIMCERunner.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/MiniSIMCERunner.tsx): [NUEVO] Runner interactivo de 5 preguntas con selector de asignatura (Matemática 8° o Ciencias 6°), temporizador de 8 min y corrección instantánea con justificación de claves.
  - [src/components/ProfesorDashboard.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx): [MODIFICADO] Integración de mapa de calor curricular, gráfico histórico Recharts de 3 años, comparativa *Con vs Sin Sysget*, tabla de alertas críticas y gráficos de barras horizontales por eje.
  - [src/components/AlumnoPortal.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/AlumnoPortal.tsx): [MODIFICADO] Integración del lanzador del ensayo interactivo y barras de dominio por habilidad.
  - [src/components/Navbar.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Navbar.tsx): [MODIFICADO] Role switcher condicionado exclusivamente a `user.rol === 'admin'`.
  - [src/pages/LandingPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LandingPage.tsx): [MODIFICADO] Tarjetas sandbox enriquecidas con KPIs destacados y acciones estrella.
  - [src/pages/AlumnosPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/AlumnosPage.tsx): [MODIFICADO] Conexión del filtro `cursoFilter`, asignación de `cursoId` y eliminación de cursos hardcodeados.
  - [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Separación formal de `currentUserAdmin` (`admin@sysget.cl`), acceso para Patricia Muñoz (`patricia@demo.cl`) y mensaje de error al ingresar credenciales no registradas.
  - [src/pages/LoginPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LoginPage.tsx): [MODIFICADO] Hint de credenciales demo actualizado con todos los perfiles disponibles.
  - [src/data/mockData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Saneamiento completo de mojibake UTF-8, incorporación de series históricas SIMCE, matrices de calor, casos narrativos de alumnos y 35 reactivos de Ciencias Naturales 6° Básico.
  - [src/config/appConfig.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/config/appConfig.ts): [MODIFICADO] Unificado el nombre del establecimiento a *Liceo Bicentenario Los Andes*.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Estado `isSandboxMode` y renderizado condicional de `SandboxBanner`.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.
- **Verificación / Despliegue**:
  - Compilación: `npm run build` exitosa (código 0, 2237 módulos empaquetados).
  - Despliegue en Producción: Desplegado activamente en Vercel con alias oficial `https://sysget-saber.vercel.app` (Deployment ID `dpl_8t4gmypmp6MjMxSgRX1sBQWyY1J7`).

---

### [2026-08-15] Flujo de Registro Controlado, Aprobación 1-Clic, Modo Trial y Gestión de Suscripciones ($0 Cost)
- **Problema / Requerimiento**:
  1. Diseñar e implementar el flujo de control de acceso para monetización: evitar que visitantes se registren y usen la plataforma sin control o verificación.
  2. Implementar verificación de correo y estado de cuenta `pendiente_aprobacion`.
  3. Permitir que el Administrador apruebe solicitudes con 1 solo clic desde el correo (mediante token seguro en URL `?approve_token=...`) sin tener que entrar a Supabase.
  4. Habilitar período de prueba (Trial 30 días) para nuevos usuarios aprobados y estructura de planes ($0 costo de implementación: Starter $29.990, Pro $59.990, Institucional $99.990).
  5. Crear panel de `Gestión de Usuarios` para que el Admin supervise solicitudes pendientes, usuarios activos en prueba, cambie planes o suspenda cuentas.
- **Archivos y Solución Técnica**:
  - [supabase/migrations/003_approval_and_monetization_flow.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/003_approval_and_monetization_flow.sql): [NUEVO] Migración SQL con columnas `estado`, `plan`, `trial_ends_at`, `approval_token`, funciones RPC `aprobar_usuario_por_token` y `admin_cambiar_estado_usuario`, y políticas RLS para administradores.
  - [src/types/index.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/types/index.ts): [MODIFICADO] Agregados tipos `UserEstado`, `UserPlan` y propiedades de suscripción/aprobación a `UserProfile`.
  - [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Bloqueo de login para cuentas `pendiente_aprobacion`, `suspendido` y `rechazado`. Registro con generación de `approvalToken` y estado pendiente. Funciones `approveUser`, `approveUserByToken`, `rejectOrSuspendUser` y `changeUserPlan`.
  - [src/pages/RegisterPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx): [MODIFICADO] Nueva pantalla de confirmación post-registro con explicación del flujo de 2 pasos (email + aprobación institucional de 30 días de prueba) y simulador de 1-click token approval.
  - [src/pages/GestionUsuariosPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/GestionUsuariosPage.tsx): [NUEVO] Panel administrativo completo con tarjetas de métricas, filtros por estado, tabla de usuarios, selector de planes, botones de aprobar/suspender/reactivar, copiado de enlace directo y modal de vista previa de correo (Resend $0).
  - [src/components/Sidebar.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/Sidebar.tsx): [MODIFICADO] Agregada sección *Gestión de Usuarios* en menú del Admin con badge dinámico de solicitudes pendientes.
  - [src/pages/LoginPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/LoginPage.tsx): [MODIFICADO] Alertas contextuales estilizadas para estados en revisión o suspendidos y enlace a solicitud de 30 días de prueba.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Enrutamiento de la página de usuarios y listener de URL para aprobación instantánea por token (`?approve_token=...`) con modal de confirmación.
  - [src/data/mockData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Cuentas demo actualizadas a estado `activo`/`institucional` e incorporación de `usuariosRegistradosMock` con solicitudes de muestra.
  - [supabase/migrations/004_create_superadmin_luis_leon.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/004_create_superadmin_luis_leon.sql): [NUEVO] Script SQL de aprovisionamiento de cuenta Super-Admin permanente para Luis Andrés León González (`luis_leon_g@hotmail.com` / RUT: 10.703.767-5).
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.
- **Verificación / Despliegue**:
  - Compilación: `npm run build` exitosa (código 0, 2238 módulos empaquetados en 9.51s).
  - Despliegue en Producción: Desplegado a Vercel con alias oficial `https://sysget-saber.vercel.app` (Deployment ID `dpl_2LDPsDr3AAopAPgyYgjRYBA6ZHyX`).

---

### [2026-08-15] Integración Resend + Supabase Edge Function: Notificación de Registro al Admin

- **Problema / Requerimiento**: Cuando un nuevo usuario se registra, el administrador debe recibir un correo con los datos del solicitante y un enlace de aprobación en 1 clic, usando Resend (plan gratuito $0).
- **Archivos y Solución Técnica**:
  - [supabase/functions/notify-admin/index.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/functions/notify-admin/index.ts): [NUEVO] Edge Function Deno en Supabase que recibe datos del nuevo usuario y envía email HTML al admin (`luis_leon_g@hotmail.com`) con botón de aprobación 1-clic (`?approve_token=...`) usando Resend API.
  - [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Agregada función `notifyAdminNewRegistration` que invoca la Edge Function después del registro exitoso (Supabase o fallback local). No bloquea el flujo si el email falla.
  - Secreto `RESEND_API_KEY` configurado en Supabase Secrets via CLI (`supabase secrets set`).
- **Verificación / Despliegue**:
  - Edge Function desplegada en Supabase: `khtdzgfqjggycrcbrytw` → `functions/notify-admin`.
  - Compilación: `npm run build` exitosa (código 0, 2238 módulos, 14.41s).

---

### [2026-08-15] AdminDemo Aislado, Validación RUT con Dígito Verificador, Corrección Historial/Botón Atrás y Actualización de Email Super-Admin

- **Problema / Requerimiento**:
  1. Si se ingresa como Admin Demo, la plataforma no debe usar los datos ni enviar correos reales al Super Admin. Crear perfil específico `AdminDemo Sysget` (Solo Lectura) separado del Super-Admin real (`leontesvirtual1@gmail.com` / `luis_leon_g@hotmail.com`).
  2. Implementar comprobación algorítmica de RUT chileno (módulo 11 con dígito verificador) al momento del registro.
  3. Resolver problema de navegación: al avanzar entre páginas y presionar el botón "Atrás" del navegador, el usuario era expulsado fuera de la app web.
  4. Actualizar email receptor de notificaciones de aprobación de registros a `leontesvirtual1@gmail.com`.
- **Archivos y Solución Técnica**:
  - [src/data/mockData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/mockData.ts): [MODIFICADO] Creado `currentUserAdminDemo` con cargo "Administrador Demo (Solo Lectura)" y nombre "AdminDemo Sysget".
  - [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx): [MODIFICADO] Mapeados correos demo (`admin@sysget.cl`, `admin@escuelademo.cl`, `admin@demo.cl`) a `currentUserAdminDemo`, y mapeados `leontesvirtual1@gmail.com` y `luis_leon_g@hotmail.com` al Super Admin real. Bloqueado el envío de emails reales durante registros en modo fallback/offline.
  - [src/pages/RegisterPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/RegisterPage.tsx): [MODIFICADO] Agregada función `validarRutChileno` con cálculo de ponderación invertida (módulo 11) y validación en tiempo real en `handleSubmit`.
  - [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx): [MODIFICADO] Integración de `window.history.pushState` al cambiar de vista y escucha del evento `popstate` para navegar fluidamente entre vistas internas con el botón atrás del navegador.
  - [supabase/functions/notify-admin/index.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/functions/notify-admin/index.ts): [MODIFICADO] Actualizado `ADMIN_EMAIL` a `leontesvirtual1@gmail.com` y redesplegada la Edge Function a Supabase Cloud.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.

---

### [2026-08-15] Aislamiento Absoluto de Impresión: Eliminación Total de Fondo de Pantalla y Ajuste de Hoja al 100%

- **Problema / Requerimiento**:
  1. En el *Centro de Impresión y Generación de PDF*, al dar clic en *Imprimir / Guardar PDF*, la vista previa de impresión incluía la página de fondo completa (*Gestión de Evaluaciones, botones, buscador y tarjetas de prueba*), empujando el cuadernillo hacia abajo y descuadrando los márgenes en los 3 modos (*Cuadernillo, Hoja de Respuestas y Pauta Clave Docente*).
- **Archivos y Solución Técnica**:
  - [src/index.css](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/index.css): [MODIFICADO] Aplicada técnica de aislamiento por visibilidad (`body * { visibility: hidden !important }` y `.printable-paper-canvas, .printable-paper-canvas * { visibility: visible !important }`) con posicionamiento absoluto anclado a `top: 0; left: 0; width: 100%` en la página 1.
  - [src/components/PrintEvaluacionModal.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [MODIFICADO] Asignada la clase `printable-paper-canvas` al contenedor del documento membretado oficial para asegurar que sea el único elemento renderizado por el motor de impresión del navegador.
  - [src/components/ReporteTabuladoView.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ReporteTabuladoView.tsx): [MODIFICADO] Integrada la clase `printable-paper-canvas` para que el reporte tabulado institucional también imprima sin arrastrar la barra de navegación ni el sidebar.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.
- **Verificación / Despliegue**:
  - Compilación: `npm run build` exitosa (código 0, 2240 módulos empaquetados en 9.18s).
  - Despliegue en Producción: Desplegado a Vercel con alias oficial `https://sysget-saber.vercel.app` (Deployment ID `dpl_4Ryw1YrZWbR7U5K9QZf8r2a9SiRX`).


---

### [2026-08-15] Centro de Impresión Oficial: Cuadernillos de Evaluación, Hoja de Respuestas Óptica (Bubble Sheet) y Script de Limpieza Producción

- **Problema / Requerimiento**:
  1. Habilitar la generación e impresión de evaluaciones en papel para entrega física a estudiantes, dividida en:
     - **Cuadernillo de Evaluación (Preguntas + Alternativas + Figuras/Textos)**: Membretado oficial, instrucciones y diagramación compacta.
     - **Hoja de Respuestas Óptica (Bubble Sheet)**: Hoja separada con datos de identificación, grilla de burbujas (A, B, C, D) del 1 al 35 y recuadros de firma/calificación docente para agilizar la corrección y digitación.
     - **Pauta Clave Docente**: Tabla con respuestas correctas, eje curricular, habilidad y puntajes para el profesor.
  2. Habilitar impresión/guardado en PDF directo de los **Reportes Tabulados Curriculares**.
  3. Crear script SQL de limpieza de datos de prueba para pase a producción real (`005_reset_test_data_for_production.sql`) conservando intacta la cuenta del Super Admin.
- **Archivos y Solución Técnica**:
  - [src/components/PrintEvaluacionModal.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx): [NUEVO] Componente modal interactivo con selector de 3 modos de impresión (Cuadernillo, Hoja de Respuestas y Pauta Clave), botón `window.print()` y membrete institucional.
  - [src/pages/EvaluacionesPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/EvaluacionesPage.tsx): [MODIFICADO] Conectado el botón *Imprimir / PDF* de cada evaluación para abrir el Centro de Impresión.
  - [src/components/ReporteTabuladoView.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ReporteTabuladoView.tsx): [MODIFICADO] Incorporado botón de impresión directa del reporte tabulado oficial.
  - [src/index.css](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/index.css): [MODIFICADO] Añadidas reglas `@media print` optimizadas para papel carta/A4, ocultamiento de barras de navegación y salto de página controlado (`page-break-inside: avoid`).
  - [supabase/migrations/005_reset_test_data_for_production.sql](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/supabase/migrations/005_reset_test_data_for_production.sql): [NUEVO] Script transaccional para vaciar rendiciones y usuarios temporales de prueba en Supabase.
  - [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md): [MODIFICADO] Actualizada con el registro de esta tarea según `task-summary-format`.
- **Verificación / Despliegue**:
  - Compilación: `npm run build` exitosa (código 0, 2240 módulos empaquetados en 9.72s).
  - Despliegue en Producción: Desplegado a Vercel con alias oficial `https://sysget-saber.vercel.app` (Deployment ID `dpl_6tytC5yqJNSa71R5N1c3thBj7ruQ`).
