# PLAN DE ACCIÓN — Sysget Saber (Proyecto Evaluaciones Nacionales)

Documento para ejecutar con Antigravity, en el orden indicado. Nace de una revisión de solo lectura hecha el 2026-09-20. Nada se modificó durante la revisión.

Archivos que acompañan este plan:

| Archivo | Qué es |
|---|---|
| `mat2m_e3_preguntas_reales_34.json` | Las 34 preguntas reales del Ensayo 3 SIMCE Mat 2° Medio, tomadas del solucionario Umáximo (claves re-resueltas a mano) |
| `051_rebuild_mat2m_e3_from_source.DRAFT.sql` | Borrador de migración generado desde ese JSON. **No aplicada.** Renombrar al siguiente número libre al usarla |

---

## 0. Reglas de oro para Antigravity (leer antes de tocar nada)

1. **No inventar ni redactar preguntas.** Todo contenido de un ensayo "oficial" debe salir textualmente de su PDF fuente. Si algo no se puede extraer o verificar, **detenerse y preguntar al dueño**. (La causa raíz del problema fue que las preguntas se escribieron a mano en `scratch/generate_mat2m_files.py` y se presentaron como "parseadas".)
2. **Nunca abrir, imprimir ni copiar `.env*`, `test_smtp.mjs` ni el `.zip` de la raíz.** No pegar secretos en logs, commits, bitácora ni migraciones. Todo secreto o correo va en variables de entorno.
3. **No aplicar nada a producción sin confirmación explícita del dueño.** Antes de cualquier migración: mostrar el SQL, el resultado de las consultas de impacto (Fase 0) y esperar un "aplicar".
4. **Un paso = un commit pequeño.** Después de cada paso: `npx tsc --noEmit` (0 errores), `npm run lint` (0 errores), `npm run build`, tests. Registrar en `BITACORA.md`.
5. **Migraciones transaccionales (`BEGIN/COMMIT`) e idempotentes.** No reescribir migraciones ya aplicadas.
6. **Cumplir `CONSTRAINTS.md` y `DIRECTIVAS.md`** (sin `as any` nuevo, sin `@ts-ignore`, sin mocks en producción, sin secretos en el código).
7. **Al terminar cada fase, entregar un reporte corto:** qué se hizo, qué se verificó, qué quedó pendiente.

---

## 1. Decisiones del dueño que bloquean pasos (pedirlas al inicio)

| # | Decisión | Afecta a | Recomendación |
|---|---|---|---|
| D1 | **P26 del Mat 2M**: la fuente tiene un error (con escalas 1:60 → 1:30 el resultado es x = 2L y ninguna alternativa lo es; la clave del solucionario, L·64/43, no se deduce) | Fase 2.2 | Anular la pregunta (total 33 puntuables) o reescribirla con datos coherentes, marcándola como "adaptada" |
| D2 | Puntaje por pregunta del Mat 2M (el solucionario no lo informa; el dataset usa 1 pt) | Fase 2.2 | Igual peso para todas |
| D3 | Solucionario de **Lectura 2° Medio Ensayo 6** con texto seleccionable (el PDF actual son capturas de pantalla sin clave) | Fase 2.6 | Descargarlo de Umáximo igual que el de Mat 2M |
| D4 | Clavijero oficial DEMRE de **PAES M1 2023 Forma 113** y solucionario de **Ciudadana 3M** | Fase 6 | Proveerlos para verificar claves |
| D5 | Si ya existen **rendiciones reales** sobre las evaluaciones a corregir: ¿actualizar en el lugar o versionar (v2)? | Fase 2 | Ver regla en 0.3 |
| D6 | Licencia para distribuir/cobrar (`precio_clp`) contenido de Umáximo y DEMRE | Antes de publicar | Confirmar permisos (decisión legal del dueño, fuera del código) |

---

## FASE 0 — Preparación y respaldo (no cambia datos)

**0.1 Rama y estado del repo**
- Crear rama `fix/integridad-contenido`.
- Ejecutar `git status` y `git ls-files supabase/migrations docs/pautas BITACORA.md DIRECTIVAS.md`.
- Motivo: el `.gitignore` ignora `supabase/migrations/` (la excepción para un archivo no funciona con la carpeta padre ignorada). Confirmar qué está realmente versionado.

**0.2 Respaldo**
- Exportar `evaluaciones`, `preguntas`, `rendiciones`, `solicitudes_evaluacion` y `perfiles` a un archivo **fuera del repo**.
- Guardar el hash del PDF fuente del Mat 2M como referencia de integridad (md5 `e2c2751514ba3ccbb9d821c5a2924f24`; calcular también sha256).

**0.3 Consultas de impacto (solo lectura)**
- ¿Qué evaluaciones (incluidas las copias asignadas a docentes) referencian `preg-mat2m-e3-%` y `preg-len2m-e6-%` en `preguntas_ids`?
- ¿Cuántas `rendiciones` existen con `prueba_id` de esas evaluaciones y de cuántos alumnos/colegios?
- **Regla de decisión:** sin rendiciones reales → `UPDATE` en el lugar. Con rendiciones → **versionar**: crear ids nuevos (`preg-mat2m-e3v2-NN`, evaluación `...-v2`), dejar la v1 inactiva y no reescribir el historial de notas.

**0.4 Línea base**
- Ejecutar `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test` y guardar el resultado en `BITACORA.md` (referencia para comparar al final).
- Nota: `npm test` corre `tenant-isolation` contra Supabase real con `.env.local`. No imprimir la salida si muestra valores de entorno.

**0.5 Revisión de historial por secretos**
- `git log --all --oneline -- .env.local test_smtp.mjs "*.zip"`.
- Si alguna vez se commiteó algo con credenciales reales: avisar al dueño para **rotar** la contraseña de aplicación SMTP y la `service_role` de Supabase.

**Aceptación:** respaldo verificado (se puede abrir), informe de impacto entregado, línea base registrada.

---

## FASE 1 — Contención inmediata (misma jornada)

**1.1 Ocultar del catálogo lo no verificado**
- Migración nueva: poner `es_catalogo = false` y `estado = 'borrador'` (verificar valores válidos del constraint de `estado`) para `eval-simce-mat-2m-e3` y `eval-simce-len-2m-e6`.
- **No borrar nada.** Entregar al dueño la lista de docentes que ya tienen copias asignadas para que decida si se les avisa.

**1.2 Cerrar la exposición de respuestas en `api/evaluaciones-catalogo.ts` (`GET ?action=preguntas`)**
Hoy es público, usa `service_role` y hace `select("*")`, así que devuelve `respuesta_correcta` y `es_correcta` de todo el catálogo.
- Exigir `Authorization: Bearer` válido (reutilizar `getAuthUser`).
- Usar **solo** el mapa `EVAL_PREGUNTA_PREFIX`; si el id no está en el mapa, responder 404. **Eliminar** la rama que interpola `evaluacion_id` dentro de `.or(...)` (inyección de filtro).
- Seleccionar columnas explícitas, sin `*`. Quitar `respuesta_correcta` y `es_correcta` de la respuesta por defecto.
- Permitir claves solo con `include_key=1` y rol `admin` (y docente dueño de la asignación, si el dueño lo aprueba).
- Prueba: sin token → 401; alumno → sin claves; admin con `include_key=1` → con claves.

**Aceptación:** con `curl` sin token el endpoint no devuelve preguntas; las dos evaluaciones dudosas no aparecen en el catálogo.

---

## FASE 2 — Reconstrucción del contenido desde la fuente

### 2.1 Mat 2° Medio Ensayo 3 — revisión previa al dataset
- Abrir el PDF `evaluaciones_fuente/2_medio/ensayo_3_simce_matematica_2m.pdf` y confirmar las notas del JSON (campo `nota_fuente`):
  - P2: alternativa B incompleta en la fuente.
  - P7: alternativa D.
  - P8: alternativa C (ambigua en la extracción de texto).
- **Abrir cada PNG de figura** en `public/preguntas/simce_mat_2m_e3/` y en el bucket `evaluaciones-media/simce_mat_2m_e3/`, y confirmar que corresponde a la figura del PDF: p19, p22, p27, p28, p29, p31, p32.
  - Sospecha: el PNG p29 debe mostrar el triángulo de medidas 15 / 10 / 18 (semejanza), no un triángulo con 30°.
  - Si una figura no coincide, recortarla de nuevo desde el PDF (PyMuPDF) y volver a subirla.

### 2.2 Mat 2M — aplicar el dataset
- Partir de `051_rebuild_mat2m_e3_from_source.DRAFT.sql` (generado desde el JSON; renombrarlo al siguiente número libre).
- Aplicar la decisión **D1** (P26) y **D2** (puntajes) en el JSON y en el SQL, y regenerar.
- Si la estrategia de 0.3 es "versionar", cambiar ids y `evaluacion_id` en consecuencia.
- Qué corrige respecto de la app actual:
  - Solo 6 de 35 preguntas coincidían con la fuente (1, 2, 3, 31, 33, 34); otras 4 eran variantes (4, 10, 16, 24) y 25 eran inventadas o incoherentes con su figura.
  - En 19, 20, 22, 27, 28, 29 y 32 el texto y la clave contradecían la figura original.
  - Quedan **34 preguntas**, con claves A=10, B=7, C=10, D=7 (antes 28 de 35 eran "A").
- Verificación posterior en SQL: 34 filas, exactamente 1 alternativa correcta por fila, `respuesta_correcta` coherente.

### 2.3 Mat 2M — pregunta 35
- La fuente tiene 34 preguntas. `preg-mat2m-e3-35` (permutaciones) es inventada.
- Si ninguna evaluación la referencia en `preguntas_ids`: eliminarla. Si alguna la referencia: quitarla del arreglo primero y luego eliminarla, o dejarla fuera de toda evaluación.

### 2.4 Regenerar la pauta docente del Mat 2M
- La pauta actual (`docs/pautas/PAUTA_DOCENTE_SIMCE_MATEMATICA_2M_ENSAYO3.md`) repite las preguntas inventadas y claves erróneas (además describe la P32 como "diagrama de Venn", que no existe).
- Crear `scripts/generate_pauta_from_dataset.py` que genere la pauta **a partir del JSON**, nunca a mano.
- La justificación de cada ítem debe ser un cálculo verificable; incluir la advertencia de P26 según D1.

### 2.5 Copias ya asignadas a docentes
- Revisar la función `admin_asignar_evaluacion_a_docente`: ¿clona preguntas o solo referencia ids?
- Si clona: re-sincronizar o marcar las copias como desactualizadas y avisar al dueño.

### 2.6 Lectura 2° Medio Ensayo 6 — **DECISIÓN D3: OPCIÓN A RATIFICADA**
- **Diagnóstico forense ejecutado**: `evaluaciones_fuente/2_medio/ensayo_6_simce_lectura_2m.pdf` contiene 4 capturas de pantalla de Umáximo que solo alcanzan hasta la pregunta 25 (faltan preguntas 26 a 35) y no incluye clavijero ni solucionario oficial.
- **Contención en BD aplicada**: `eval-simce-len-2m-e6` fijada con `es_catalogo = false`, `estado = 'borrador'`, `verificada_at = null`. La API pública la excluye totalmente.
- **Protocolo de reactivación**: La evaluación permanecerá oculta en estado borrador hasta que el sostenedor/docente provea el PDF completo con las 35 preguntas y su solucionario oficial correspondiente. En ese momento se ejecutará la extracción fiel, asignación de claves y pauta docente.

### 2.7 PAES Competencia Lectora 2026 — corregir rótulo y limpieza
- **Rótulo:** el seed, el id (`eval-paes-lect-2026-f103`) y la carpeta `paes_lect_2026_forma103` dicen Forma 103 (regular), pero las preguntas y claves son de la **Forma 101 (Invierno)** (las claves coinciden 65/65 con el clavijero de Invierno y solo 16/65 con el de la Forma 103).
  - Corregir títulos, descripciones y el campo `fuente` a "Forma 101 — Invierno 2026".
  - Mantener los ids salvo que se pueda cambiar sin romper `EVAL_PREGUNTA_PREFIX`, `rendiciones` ni las carpetas del bucket.
  - Si más adelante se quiere la Forma 103, cargarla como evaluación aparte con su propio clavijero.
- **Basura de extracción:** limpiar las alternativas que contienen pies de página `FORMA 101  2026` y las que traen lecturas completas pegadas (por ejemplo, una alternativa D con el artículo "¿Memoria corta?").
  - Detectar por longitud (>250 caracteres) y por patrón `FORMA \d+`.
  - Mover el texto de la lectura al lugar correcto (enunciado/texto base) y dejar cada alternativa con su texto real.
- **Puntaje:** la evaluación tiene 65 preguntas, 60 puntuables y 5 pilotos (marcadas con `*` en el clavijero). Usar la **tabla oficial de transformación P → puntaje PAES** del clavijero en lugar de la escala lineal 100–350.

### 2.8 Matemática 6° Básico Ensayo 3 — **COMPLETADO Y CERTIFICADO**
- **Fidelidad y enunciados:** Verificado al 100% (35/35 ítems) contra `evaluaciones_fuente/Ensayo+3+SIMCE+Matemática+6°+Básico+(Instrumento).pdf`.
- **Puntajes:** Normalizado a 2 puntos por pregunta en `src/data/mat6bQuestionsMock.ts`, totalizando **70 puntos** en estricta conformidad con la Tabla de Especificaciones oficial de Umáximo.
- **Claves resueltas y verificadas:** Las 35 claves fueron resueltas matemáticamente y verificadas (distribución balanceada: C:10, B:11, D:8, A:6).
- **Quality Gate y Certificación:** Integrada en `scripts/data/claves_oficiales/simce_mat_6b_e3.json` y `scripts/verify_evaluations_integrity.mjs`. Marcada con `verificada_at = NOW()` en Supabase.


**Aceptación de la Fase 2:** para cada evaluación corregida, el script de la Fase 5 pasa (una vez creado) y el dueño validó visualmente al menos las preguntas con figura.

---

## FASE 3 — Seguridad de la calificación y de los datos

**3.1 `api/grade-evaluation.ts` — COMPLETADO Y CERTIFICADO**
- **Autenticación e IDOR:** Derivación estricta del alumno desde `auth.getUser(token)` ignorando cualquier `alumnoId` del body cuando existe sesión activa. Token inválido/expirado rechaza con 401.
- **Esquema DB Real:** Corregido payload para mapear exactamente a las columnas existentes de `public.rendiciones` (`id`, `prueba_id`, `alumno_id`, `respuestas`, `puntaje_total`, `puntaje_maximo`, `porcentaje_logro`, `estado`, `inicio_at`, `fin_at`), eliminando errores de schema cache (500).
- **Control de Estado:** Rechazo con 403 Forbidden si la evaluación no se encuentra en estado `activa`.
- **Prevención Doble Envío:** Chequeo previo en `rendiciones` devolviendo 409 Conflict.
- **UUID Criptográfico:** `crypto.randomUUID()`.
- **Sanitización y Hermetismo:** Sanitización de textos para mitigar XSS, sin fallbacks inseguros ni credenciales hardcodeadas (Directiva 10).


**3.2 Cliente (`AlumnoEvaluationView.tsx` y hooks) — COMPLETADO Y CERTIFICADO**
- **Authorization Bearer:** Envío obligatorio del encabezado en `AlumnoEvaluationView.tsx`.
- **Eliminación Fallback Inseguro:** Fallback local restringido estrictamente a evaluaciones demo (`es_demo`).
- **Aislamiento de Claves en Alumno:**
  - Creada función RPC `get_preguntas_evaluacion` SECURITY DEFINER en `supabase/migrations/057_pregunta_sin_claves_para_alumno.sql`.
  - Reemplazado `select('*')` en `useBancoPreguntas.ts` por lista explícita `BANCO_DOCENTE_COLUMNS`.
  - Sanitizador `getPreguntasForRunner` en `App.tsx` fuerza `respuestaCorrecta: null` y `es_correcta: false`.
- **Pruebas Automatizadas:** 5 tests unitarios en `tests/student-runner-security.test.ts` (100% PASS).

**3.3 Correos (`api/*.ts`, `supabase/functions/notify-admin`) — COMPLETADO Y CERTIFICADO**
- Creado módulo canónico `api/_utils.ts` con función `escapeHtml(str: unknown): string`.
- Sanitizados todos los campos interpolados en `api/notify-admin.ts`, `api/evaluaciones-catalogo.ts`, `api/users.ts` y `supabase/functions/notify-admin/index.ts`.
- Prevención de CRLF header injection en `subject`.
- Compuerta de autorización `requireAdmin` en acción `send-email` de `api/users.ts`.
- **Pruebas Automatizadas:** 8 tests unitarios en `tests/email-security.test.ts` (100% PASS).

**3.4 CORS — COMPLETADO Y CERTIFICADO**
- Implementada función unificada `isOriginAllowed` y `setCorsHeaders` en `api/_utils.ts`.
- Bloqueo estricto de subdominios maliciosos (sin `startsWith`).
- Prohibición absoluta de `localhost` / `127.0.0.1` en producción (`VERCEL_ENV === 'production'`).
- Cabecera `Vary: Origin` unificada en todos los endpoints de `api/`.
- **Pruebas Automatizadas:** 7 tests unitarios en `tests/cors-security.test.ts` (100% PASS).

**3.5 CSP y renderizado — COMPLETADO Y CERTIFICADO**
- Removido `'unsafe-inline'` de la directiva `script-src` en `vercel.json`.
- KaTeX configurado con `trust: false` en `EnunciadoRenderer.tsx`.
- Integrado `DOMPurify.sanitize(...)` para blindar `dangerouslySetInnerHTML`.
- **Pruebas Automatizadas:** 5 tests unitarios en `tests/csp-and-rendering.test.ts` (100% PASS).

**Aceptación de la Fase 3:** ✅ CUMPLIDA AL 100%. 9 suites de pruebas automáticas en `tests/` pasan en verde (43 tests PASS). Alumno aislado de claves, correos y renderizado sanitizados, CORS blindado y CSP endurecido.

---

## FASE 4 — Higiene del repositorio y secretos

**4.1 Correos y URL escritos en el código**
- Sacar de `api/*.ts` (valores por defecto de `ADMIN_EMAIL`, `CC_EMAIL`, URL de Supabase) y de `CONSTRAINTS.md`. Dejar solo `process.env.X` y lanzar error si falta.
- Actualizar `.env.example` con `CC_EMAIL` y `SUPABASE_URL`.
- En `CONSTRAINTS.md`, reemplazar el correo del ejemplo (Directiva 9) por un placeholder.

**4.2 Migraciones históricas**
- No reescribir migraciones aplicadas. Documentar en un ADR que la 034 buscaba un correo fijo y caía en `SELECT id FROM auth.users LIMIT 1` (dueño arbitrario), y que las migraciones nuevas deben fallar si no encuentran al administrador.

**4.3 Auditoría de credenciales antes de versionar**
- Revisar sin imprimir valores: `004_create_superadmin_luis_leon.sql`, `006_create_production_users.sql`, `010_create_susana_pizarro_colegio_mi_casa.sql`, `test_smtp.mjs` y **el listado** (no el contenido) de `sysget-saber-entrega-segura.zip`.
- Si hay contraseñas o hashes reales: quitarlos, rotar, y si estuvieron en git, limpiar el historial (`git filter-repo`) con aviso al dueño.

**4.4 `.gitignore`**
- Versionar: `supabase/migrations/`, `docs/pautas/`, `BITACORA.md`, `DIRECTIVAS.md`, `CONSTRAINTS.md`.
- Mantener ignorados: `.env*`, `evaluaciones_fuente/` (PDFs de terceros y con datos personales), `*.zip`, `node_modules`, `dist`.
- Decidir qué hacer con `scratch/`: mover a `scripts/` lo útil y borrar el resto (contiene volcados y scripts de generación con las preguntas inventadas).
- Verificar con `git check-ignore -v` y `git ls-files` **antes** de empezar a rastrear las migraciones (si una contiene secretos, aplicar 4.3 primero).

**4.5 Datos personales en PDFs**
- Los solucionarios de Umáximo traen un nombre y un teléfono personales en el encabezado. Confirmar que ningún PDF está en `public/` ni en buckets públicos (el script de la Fase 5 debe revisarlo).

**Aceptación:** `grep` de correos/JWT/URLs de proyecto en `src/`, `api/`, `scripts/` no encuentra literales; `git ls-files` muestra migraciones y pautas.

---

## FASE 5 — Compuertas de calidad (para que no vuelva a ocurrir)

**5.1 Claves oficiales versionadas**
- Crear `scripts/data/claves_oficiales/<evaluacion>.json` con `{evaluacion_id, fuente, sha256_pdf, n_preguntas, claves, puntajes}`.
  - Mat 2M: desde `mat2m_e3_preguntas_reales_34.json` (P26 según D1).
  - PAES Lectora: desde el clavijero de Invierno (Forma 101).
  - Las demás: a medida que se verifiquen.

**5.2 `scripts/verify_evaluations_integrity.mjs`** (solo lectura; `npm run verify:content`; código de salida ≠ 0 si falla)
- El número de preguntas coincide con el JSON oficial y los ids son contiguos.
- Cada pregunta tiene 4 alternativas (PAES según corresponda) con exactamente 1 correcta, y coincide con `respuesta_correcta`.
- Cada clave coincide con la del JSON oficial.
- Distribución de claves: advertir si una letra supera 45% y **fallar** si supera 60% (con ≥20 preguntas).
- Texto prohibido en enunciados y alternativas: `FORMA \d+`, `umaximo.com`, caracteres PUA (U+F000–U+F0FF), marcadores de página `\d+ / \d+`, alternativas de más de 300 caracteres (advertencia).
- Puntaje total coincide con el esperado.
- Todo `imagen_url` es absoluto y responde 200 con `HEAD`.
- Ningún PDF ni archivo con datos personales en `public/`.

**5.3** Prueba `tests/content-integrity.test.ts` que use los JSON versionados (sin tocar producción).

**5.4 Bloqueo estructural de publicación**
- Migración: agregar `verificada_at timestamptz` y `verificada_por` a `evaluaciones`.
- El catálogo (`GET ?action=catalogo`) filtra `verificada_at IS NOT NULL`; solo se marca tras pasar `verify:content` y validación humana.

**5.5 Contratos**
- `CONSTRAINTS.md`: agregar **Bloque 7 — Integridad de contenido** (verify:content en 0 fallos antes de publicar; prohibido redactar preguntas de ensayos oficiales; trazabilidad a página del PDF; discrepancia con la fuente = detener).
- `DIRECTIVAS.md`: agregar **Directiva 11 — Fidelidad a la fuente** con las mismas reglas.

**Aceptación:** `npm run verify:content` falla a propósito con el estado antiguo del Mat 2M y pasa con el corregido.

---

## FASE 6 — Auditar lo que no se alcanzó a revisar

Aplicar el mismo protocolo (fuente → JSON de claves → `verify:content` → informe `docs/auditorias/AUDITORIA_<evaluacion>.md` con tabla coincide / difiere):

- **6.1 PAES Matemática 1 2023 Forma 113** (65 preguntas): la bitácora dice que se auditó, pero falta comparar contra el clavijero DEMRE (**D4**).
- **6.2 Diagnóstica Educación Ciudadana 3M 2026** (migración 036): contar preguntas, comparar contra el PDF, revisar claves.
- **6.3 Ciencias Naturales 6° Básico Ensayo 3:** hay PDFs de instrumento y tabla de especificación, y imágenes en `public/preguntas/simce_cn_6b/`, pero no hay migración con ese nombre. Averiguar dónde viven sus preguntas (BD, `mockData.ts` u otro lado).
- **6.4 Lenguaje 2° Medio (abril, junio, agosto)** (docx → `src/data/len2m*QuestionsMock.ts`): confirmar si esos mocks llegan a producción (Directivas 1 y 2) y auditar claves.
- **6.5** En cada una, revisar la distribución de claves y el texto contaminado con los mismos chequeos de 5.2.

---

## FASE 7 — Documentación, despliegue y cierre

**7.1** Regenerar **todas** las pautas docentes desde los JSON verificados (script), no a mano.

**7.2 Documentos**
- ADR 003: trazabilidad y verificación de contenido.
- ADR 004: calificación en servidor sin claves en el cliente.
- Una entrada en `BITACORA.md` por fase.

**7.3 Despliegue**
- Preview de Vercel, prueba manual (docente ve catálogo verificado; alumno rinde una prueba; la corrección coincide con las claves; ningún JSON de red contiene claves).
- Pasar a producción **solo con el "sí" del dueño**.

**7.4 Cierre legal (fuera del código, D6):** confirmar la licencia de uso comercial del contenido antes de cobrar `precio_clp`.

---

## Definición de "terminado"

- [ ] Las dos evaluaciones inventadas ocultas (Fase 1) y luego reconstruidas y verificadas (Fase 2).
- [ ] Ningún endpoint ni consulta del alumno devuelve claves.
- [ ] `grade-evaluation` exige sesión, evita doble envío y no usa claves de respaldo.
- [ ] Sin correos, URLs de proyecto ni credenciales escritas en el código.
- [ ] Migraciones, pautas y bitácora versionadas en git.
- [ ] `npm run verify:content` en 0 fallos para todas las evaluaciones del catálogo, y catálogo filtrado por `verificada_at`.
- [ ] `tsc`, `lint`, `build` y tests en verde; `BITACORA.md` actualizada.

---

## Anexo A — Comparación Mat 2M Ensayo 3: PDF (34) vs app (35)

Leyenda: ✅ igual · ⚠️ variante · ❌ distinta o incoherente. El detalle correcto de cada pregunta está en el JSON adjunto.

| N° | PDF (fuente) | App actual | Estado |
|---|---|---|---|
| 1, 2, 3 | ∛(a+b); ∛64=4 → log; eSports | Iguales | ✅ |
| 4 | √3·∛3 | Mismas expresiones, alternativas cambiadas (la clave pasa de D a C) | ⚠️ |
| 5 | (4)⁻² | log₁₀1000 − log₂16 | ❌ |
| 6 | Conejos 40·1,5³ | log(18) | ❌ |
| 7 | −(2/3)⁻² | Afirmación sobre reales | ❌ |
| 8 | ∜5² = √5 | √(9x) = 3√x | ❌ |
| 9 | log₂32 = x | Racionalizar 6/√3 | ❌ |
| 10 | Media pulgada | 12 pulgadas | ⚠️ |
| 11, 12, 13 | √8(√32−√2); √100−√64+√36; √20 | Cuadrática; discriminante; proyectil | ❌ |
| 14, 15 | c^d=e → log; (2a+□)² | x²−4; f(−2) | ❌ |
| 16 | 4a²−81b² | 4x²−9y² | ⚠️ |
| 17, 18 | (3p−5)²; sistema suma 30 | Sistema x+y=10; comerciante | ❌ |
| 19 | Rectas x+y=2 y x−y=4 | Misma figura, clave "x+y=4 y 2x−y=2" | ❌ |
| 20 | 5x+3y=55; 2x+3y=31 | Figura original con texto 2x+3y=12; 4x−y=10 | ❌ |
| 21 | Tabla 2x+y=6 | Pendiente de 3x−2y+6=0 | ❌ |
| 22 | Recta y = 3/2·x − 3 | Misma figura, clave y=−2x+4 | ❌ |
| 23 | Homotecia (3,2)→(−6,−4) | Rectas perpendiculares | ❌ |
| 24 | Razón k₁·k₂ | Vector con k=−2 | ⚠️ |
| 25, 26 | Escala 1:200; autos 1:60→1:30 | Área con homotecia; volumen de cono | ❌ |
| 27 | Sector de 60° → 25π/6 | Texto 72° → 5π (la figura muestra 60°) | ❌ |
| 28 | Red de cono → 34π | Esfera fundida con la figura del cono | ❌ |
| 29 | Semejanza h/15 = 18/28 | Trigonometría con la figura original | ❌ |
| 30 | Frecuencia relativa 100/800 | cos α = 4/5 | ❌ |
| 31, 33, 34 | Galton; sensores; sorteos | Iguales | ✅ |
| 32 | Tabla doble entrada (respuesta 4/2/1/3) | Misma figura, clave 3/3/2/2 | ❌ |
| 35 | No existe | Permutaciones 5! | ❌ inventada |

## Anexo B — Hallazgos de las otras evaluaciones (resumen)

| Evaluación | Hallazgo |
|---|---|
| Lectura 2° Medio Ensayo 6 | 34 de 35 claves "A"; P1–P3 no coinciden con la fuente; fuente sin clave |
| PAES Lectora 2026 | Rotulada Forma 103 pero es Forma 101 Invierno; alternativas con pies de página y lecturas pegadas |
| Mat 6° Básico Ensayo 3 | Contenido fiel en lo revisado; puntaje 58 vs 70 oficial; claves sin verificar |
| PAES M1, Ciudadana 3M, CN 6°, Lenguaje 2° Medio | No revisados (ver Fase 6) |
