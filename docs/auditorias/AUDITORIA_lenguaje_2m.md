# Auditoría de Integridad: Evaluaciones Lenguaje y Literatura 2° Medio (Abril, Junio, Agosto)

**Instrumentos Analizados:**
1. `Ensayo SIMCE Lenguaje 2° Medio Abril 2026.docx` (30 preguntas) → `prueba-len2m-abr-101` / `src/data/len2mAbrilQuestionsMock.ts`
2. `Ensayo SIMCE Lenguaje 2° Medio Junio 2026.docx` (30 preguntas) → `prueba-len2m-jun-101` / `src/data/len2mJunioQuestionsMock.ts`
3. `Ensayo SIMCE Lenguaje 2° Medio Agosto 2026.docx` (30 preguntas) → `prueba-len2m-101` / `src/data/len2mQuestionsMock.ts`
4. `eval-simce-len-2m-e6` (Ensayo 6 SIMCE Lengua y Literatura 2° Medio en Supabase)

---

## 1. Resumen Ejecutivo y Diagnóstico Crítico

| Evaluación | Ubicación | Claves / Clavijero en Fuente DOCX | Distribución de Claves en DB | Estado de Publicación |
|---|---|---|---|---|
| **Abril 2026** (30 pregs) | Mocks locales y DB (`preg-len2m-abr-%`) | ❌ No incluye solucionario en el DOCX fuente | **A: 19 (63.3%)**, C: 5, B: 6 | `verificada_at: NULL`, `es_catalogo: false` (Bloqueada) 🛡️ |
| **Junio 2026** (30 pregs) | Mocks locales y DB (`preg-len2m-jun-%`) | ❌ No incluye solucionario en el DOCX fuente | **B: 21 (70.0%)**, C: 8, A: 1 | `verificada_at: NULL`, `es_catalogo: false` (Bloqueada) 🛡️ |
| **Agosto 2026** (30 pregs) | Mocks locales y DB parcial (`preg-len2m-%`) | ❌ No incluye solucionario en el DOCX fuente | B: 2, D: 3, A: 2, C: 2 (incompleta en DB) | `verificada_at: NULL`, `es_catalogo: false` (Bloqueada) 🛡️ |
| **Ensayo 6** (35 pregs) | Supabase DB (`preg-len2m-e6-%`) | Fuente PDF scanned sin clave | **A: 34 (97.1%)**, B: 1 | `verificada_at: NULL`, `es_catalogo: false` (Bloqueada) 🛡️ |

---

## 2. Hallazgos Detallados de Integridad

### 2.1 Ausencia de Clavijero Oficial en Archivos DOCX
- La inspección programática de los archivos `.docx` originales revela que únicamente contienen el texto de las lecturas compartidas y las preguntas con sus 4 alternativas. No se incorporó tabla de especificación ni pauta de corrección con las claves correctas.

### 2.2 Sesgo Artificial Extremo en Respuestas de la DB
- **Abril 2026:** 19 de 30 preguntas tienen asignada la letra **"A"** (63.3%), lo que supera el umbral máximo de tolerancia del 60% establecido en `CONSTRAINTS.md`.
- **Junio 2026:** 21 de 30 preguntas tienen asignada la letra **"B"** (70.0%), evidenciando una asignación arbitraria o automatizada durante la ingesta original.
- **Ensayo 6:** 34 de 35 preguntas tienen asignada la clave **"A"** (97.1%).

### 2.3 Cumplimiento de Directivas 1 y 2 (Entorno de Producción)
- En modo producción (`isProduction = true`), el sistema consulta exclusivamente la tabla `evaluaciones` de Supabase filtrando por `verificada_at IS NOT NULL` y `es_catalogo = true`.
- Dado que todas estas evaluaciones presentan `verificada_at: NULL` y `es_catalogo: false`:
  - **Ninguna de estas pruebas es accesible para alumnos o docentes en el catálogo institucional de producción.**
  - Las compuertas de seguridad construidas en la Fase 1 y Fase 5 protegen eficazmente la integridad del sistema.

---

## 3. Plan de Remediación Futuro
Para habilitar cualquiera de estos ensayos en el catálogo oficial:
1. Conseguir o elaborar la pauta pedagógica colegiada oficial para los 3 ensayos de Lenguaje 2° Medio.
2. Actualizar las columnas `respuesta_correcta` en `preguntas` y la propiedad `es_correcta` en `alternativas`.
3. Crear el manifiesto JSON con la pauta verificada.
4. Pasar el quality gate `verify:content` antes de asignar fecha en `verificada_at`.
