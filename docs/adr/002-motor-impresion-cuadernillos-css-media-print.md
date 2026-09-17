# ADR 002: Motor de Impresión de Cuadernillos Oficiales con CSS @media print

- **Estado**: Aceptado
- **Fecha**: 2026-09-17
- **Autores**: Equipo Sysget Saber
- **Mapeo de Directivas**: Directiva 5 (Motor de Impresión y Cuadernillos PDF), Directiva 11 (Suite de Skills PDF a Cuadernillo)

---

## Contexto y Planteamiento del Problema

Sysget Saber permite a los colegios generar tres tipos de documentos físicos listos para evaluación en sala de clases:
1. **Cuadernillos de Prueba**: Ensayos de 30 a 65 preguntas con lecturas compartidas de comprensión lectora, figuras geométricas, diagramas y alternativas.
2. **Hojas de Respuestas Ópticas (OMR)**: Hojas con burbujas de respuesta normalizadas para escaneo rápido con cámara/móvil o escáner tradicional.
3. **Pautas de Corrección Docente**: Clave de respuestas con justificación pedagógica, ejes temáticos y habilidades curriculares asociadas.

El problema histórico en soluciones web basadas en HTML-to-PDF del lado servidor (Puppeteer/wkhtmltopdf) o bibliotecas JS cliente tipo `jspdf`/`html2canvas` radica en:
- Alto consumo de memoria y CPU en el servidor al generar cuadernillos para cursos enteros (45 alumnos por curso).
- Degradación tipográfica y rasterización borrosa de textos y ecuaciones matemáticas.
- Rupturas de página inapropiadas que cortaban preguntas por la mitad o dejaban páginas en blanco innecesarias.

## Opciones Consideradas

1. **Generación de PDFs en Backend vía Headless Chrome (Puppeteer en Lambda/Edge)**:
   - *Pros*: Salida binaria descargable directa.
   - *Contras*: Límites severos de tiempo de ejecución (timeout) y memoria en Edge Functions cuando se procesan cuadernillos de 30 páginas; costos adicionales de infraestructura.

2. **Renderizado Directo con `jspdf` o `pdfmake` en Frontend**:
   - *Pros*: Se procesa en el cliente.
   - *Contras*: Dificultad para mantener paridad visual con el diseño web responsivo; problemas con fuentes personalizadas y renderizado de fórmulas complejas.

3. **Arquitectura CSS Nativa `@media print` en el Navegador con Canvas Imprimible (Opción Elegida)**:
   - *Pros*:
     - Rendimiento instantáneo (0 ms de espera de servidor).
     - Calidad vectorial perfecta a 300+ DPI soportada por el motor de impresión nativo del navegador del usuario.
     - Posibilidad de imprimir directamente a impresora física o guardar como PDF estándar.
     - Aprovechamiento de propiedades CSS modernas de paginación (`break-inside: avoid;`, `page-break-after: always;`, `orphans`, `widows`).
   - *Contras*: Requiere calibración rigurosa de reglas CSS para evitar saltos indeseados en navegadores Chromium y Firefox.

## Decisión

Se adopta la arquitectura de **Impresión Basada en CSS `@media print`** mediante el componente `PrintEvaluacionModal.tsx` y utilidades de impresión en `src/utils/printUtils.ts`:

1. **Aislamiento del Documento de Impresión**:
   Al invocar `window.print()`, se aplica la clase `.printable-paper-canvas` y se ocultan todos los elementos de navegación y UI periférica (`print:hidden`).

2. **Control de Flujo Continuo sin Hojas en Blanco**:
   - Cada bloque de pregunta (`.pregunta-item-print`) utiliza `break-inside: avoid;` para garantizar que el enunciado y sus 4 alternativas no se fracturen entre dos hojas.
   - Los textos de lectura compartida extensos admiten paginación fluida con encabezados repetibles de continuación (`Lectura X (Continuación):`).
   - Las Hojas de Respuestas OMR y la Pauta de Corrección Docente utilizan `break-before: page;` para comenzar estrictamente en su propia carátula independiente.

3. **Membrete Dinámico Institucional**:
   El membrete superior se inyecta dinámicamente con el escudo/logo institucional del colegio, su RBD oficial y lema educativo obtenido del perfil o contexto del establecimiento.

4. **Nombre Secuencial de Archivo**:
   Se implementa `getSequentialPrintTitle(titulo)` que renombra temporalmente `document.title` antes de invocar `window.print()`, garantizando que el PDF descargado tenga un nombre claro y ordenado.

## Consecuencias

### Positivas
- **Cero latencia de generación**: Respuesta inmediata en pantalla para cuadernillos de cualquier longitud.
- **Nitidez tipográfica 100% vectorial**: Sin artefactos de compresión ni pérdida de calidad en gráficos.
- **Ahorro de papel**: Eliminación total de páginas en blanco fantasma y óptima densidad de contenido por hoja.

### Negativas / Mitigaciones
- Requiere que las imágenes de figuras y preguntas estén optimizadas en tamaño y formato en `public/preguntas/` para cargarse al instante antes de abrir el diálogo de impresión.
