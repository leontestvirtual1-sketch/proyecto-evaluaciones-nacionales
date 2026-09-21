# ADR 004: Trazabilidad y Verificación Automatizada de Contenido Oficial

- **Estado**: Aceptado
- **Fecha**: 2026-09-21
- **Autores**: Equipo Sysget Saber / Antigravity
- **Mapeo de Directivas**: Directiva 1 (Aislamiento de Ambientes), Directiva 11 (Zero Secrets), Directiva 12 (Fidelidad Absoluta a la Fuente), CONSTRAINTS Bloque 7 (Integridad de Contenido Oficial)

---

## Contexto y Planteamiento del Problema

Durante la auditoría integral de evaluaciones (septiembre 2026), se detectó que varias pruebas oficiales en la plataforma presentaban anomalías severas de contenido:
1. **Preguntas inventadas y redactadas manualmente**: En el Ensayo 3 de SIMCE Matemática 2° Medio, 25 de 35 preguntas habían sido sintetizadas artificialmente en lugar de extraerse textualmente del PDF oficial, generando contradicciones críticas con las figuras geométricas (ej. preguntas de trigonometría sobre diagramas de semejanza).
2. **Sesgo estadístico extremo en clavijeros**: Evaluaciones como Lectura 2° Medio Ensayo 6 presentaban 34 de 35 alternativas asignadas arbitrariamente a la letra 'A' (97% de sesgo), al carecer de un solucionario con texto procesable.
3. **Contaminación de extracción OCR y MathType**: Presencia de pies de página derramados en alternativas (`FORMA 101  2026`), marcas de agua de terceros (`umaximo.com`) y caracteres Unicode Private Use Area (PUA `\uF000`–`\uF0FF`) generados por convertidores MathType defectuosos.

El riesgo para una plataforma de evaluaciones nacionales es crítico: pérdida total de credibilidad pedagógica, calificaciones distorsionadas para colegios y eventuales sanciones regulatorias.

---

## Opciones Consideradas

1. **Revisión Manual Humana Ocasional (Spot-checks)**:
   - *Pros*: No requiere código adicional.
   - *Contras*: Propenso a error humano, incapaz de prevenir regresiones tras nuevas migraciones o seeds y no auditable sistemáticamente en CI.

2. **Validación Exclusiva por Restricciones de Base de Datos (CHECK Constraints)**:
   - *Pros*: Garantiza tipos de datos y rangos válidos a nivel SQL.
   - *Contras*: Una base de datos no puede verificar si el texto coincide con un PDF externo ni validar la autenticidad psicométrica de las claves sin un modelo de datos excesivamente complejo.

3. **Sistema Integral de Manifiestos Versionados + Quality Gate Automatizado + Bloqueo Estructural de Catálogo (Opción Elegida)**:
   - *Pros*: Trazabilidad criptográfica del documento de origen (SHA-256), verificación determinista contra clavijeros oficiales en milisegundos, compuerta de bloqueo estructural (`verificada_at IS NOT NULL`) que impide que contenido no auditado llegue a docentes o estudiantes.
   - *Contras*: Requiere un paso previo de digitalización y creación de manifiestos para cada nueva evaluación incorporada al catálogo.

---

## Decisión

Se adopta una arquitectura de **Integridad y Trazabilidad Curricular Oficial** basada en cuatro pilares:

### 1. Manifiestos de Claves Oficiales Versionados en Git
Cada evaluación oficial del catálogo cuenta con un manifiesto inmutable en `scripts/data/claves_oficiales/<evaluacion>.json` que estipula:
- Identificador canónico de la evaluación (`evaluacion_id`).
- Nombre oficial y entidad emisora (`fuente`).
- Huella digital criptográfica SHA-256 del PDF del instrumento y/o solucionario oficial (`sha256_pdf`).
- Total exacto de preguntas (`n_preguntas`), preguntas puntuables y piloto (`preguntas_piloto`).
- Puntaje total esperado según tabla de especificación curricular (`puntaje_esperado`).
- Clavijero oficial mapeado pregunta por pregunta (`claves`).

### 2. Quality Gate Automatizado (`verify:content`)
Se implementa el ejecutable `scripts/verify_evaluations_integrity.mjs` (invocable vía `npm run verify:content`), el cual valida rigurosamente en modo solo lectura:
- **Totalidad y Contigüidad**: Cantidad de preguntas coincide 100% con el manifiesto y los IDs son secuenciales.
- **Conformidad de Alternativas**: Cada pregunta tiene alternativas válidas con exactamente una opción marcada como correcta, concordando estrictamente con el clavijero oficial.
- **Detección de Sesgo Estadístico**: Advertencia si una letra supera el 45% y falla inmediata (`process.exit(1)`) si supera el 60% de frecuencia en pruebas con $\ge 20$ preguntas.
- **Higiene Textual y Libre de Contaminación**: Rechazo estricto de textos espurios (`FORMA \d+`, `umaximo.com`, `\d+ / \d+`), desbordamiento de alternativas (>300 caracteres) y caracteres corruptos PUA (`\uF000`–`\uF0FF`).
- **Disponibilidad de Recursos Multimedia**: Verificación asíncrona mediante peticiones HTTP `HEAD` de que todas las imágenes referenciadas en `imagen_url` responden código 200 OK en CDN.
- **Higiene del Directorio Público**: Verificación de que `public/` no contiene archivos PDF confidenciales ni solucionarios.

### 3. Bloqueo Estructural de Catálogo en Base de Datos
- Las evaluaciones requieren `verificada_at timestamptz` no nulo en la tabla `evaluaciones` para ser catalogadas.
- Los endpoints de catálogo público (`api/evaluaciones-catalogo.ts`) y vistas del docente (`useBancoEvaluaciones.ts`) filtran obligatoriamente `es_catalogo = true AND verificada_at IS NOT NULL`.
- Evaluaciones dudosas o pendientes de digitalización (como SIMCE Lectura 2M o ensayos mock) permanecen con `es_catalogo = false`, `estado = 'borrador'` y `verificada_at = NULL`.

### 4. Compromisos Contractuales en el Repositorio
Se formalizan como reglas no negociables:
- **`CONSTRAINTS.md` (Bloque 7)**: Prohibición absoluta de redactar preguntas a mano para ensayos oficiales; obligatoriedad de `npm run verify:content` en 0 errores antes de cualquier publicación.
- **`DIRECTIVAS.md` (Directiva 12)**: Fidelidad Absoluta a la Fuente. Toda discrepancia entre la base de datos y el PDF oficial detiene la tarea y exige resolución con el propietario.

---

## Consecuencias

### Positivas
- **Fidelidad Curricular Certificada**: Los estudiantes y colegios rinden exactamente los instrumentos validados por el MINEDUC y DEMRE.
- **Cero Regresiones Silenciosas**: Cualquier mutación no autorizada o seed defectuoso es detectado automáticamente por la suite de pruebas unitarias (`tests/content-integrity.test.ts`) y el script `verify:content`.
- **Transparencia Institucional**: Las pautas de corrección docente (`docs/pautas/`) se derivan programáticamente de los manifiestos oficiales verificados, eliminando errores de transcripción humana.

### Consideraciones
- Incorporar una nueva prueba oficial al catálogo requiere digitalizar el PDF oficial, extraer sus figuras en alta resolución, registrar el SHA-256 en el manifiesto JSON y ejecutar la validación antes de asignar `verificada_at`.
