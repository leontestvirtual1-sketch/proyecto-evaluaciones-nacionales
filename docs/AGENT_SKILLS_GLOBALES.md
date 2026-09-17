# Guía de Skills Globales de Agentes (Addy Osmani)

Este documento detalla la configuración, catálogo exhaustivo, explicación técnica y **un ejemplo práctico completo de ejecución por cada uno de los 25 skills de ingeniería de software** provenientes de [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), habilitados de forma **global** en tu entorno de Antigravity IDE.

---

## 🏛️ Ubicación y Alcance Global

Los skills residen en la raíz de configuración global de Antigravity:
```text
C:\Users\luisl\.gemini\config\skills\
```

Al estar en este directorio:
- Están activos automáticamente en **cualquier proyecto o repositorio** que abras en Antigravity IDE.
- No requieren ser copiados a la carpeta local `.agents/skills/` de cada nuevo proyecto.
- Operan bajo el principio de **Progressive Disclosure**: el agente solo carga el contenido completo del archivo `SKILL.md` cuando tú lo invocas o cuando detecta que tu tarea coincide con su propósito.

---

## 🔎 ¿Cómo comprobar que están habilitados en cualquier proyecto?

### 1. Detección Automática por Intención (*Progressive Disclosure*)
Cuando le pides al asistente tareas comunes de ingeniería, el agente detecta automáticamente la intención y activa el skill sin que tengas que recordar su nombre exacto:
- *"Haz un code review de este pull request o archivo"* &rarr; Activa `code-review-and-quality`.
- *"Vamos a implementar esta función con TDD"* &rarr; Activa `test-driven-development`.
- *"Optimiza el rendimiento y los renders de este componente"* &rarr; Activa `performance-optimization`.
- *"Entrevístame para definir qué necesitamos construir"* &rarr; Activa `interview-me`.

### 2. Invocación Explícita Directa
Puedes pedirle directamente al agente en el chat de cualquier proyecto:
```text
"Por favor aplica el skill test-driven-development para crear el servicio de cálculo de promedios."
"Usa el skill code-simplification en src/components/ProfesorDashboard.tsx."
```

### 3. Pregunta de Confirmación al Agente
En una conversación nueva dentro de cualquier proyecto, puedes preguntarle:
```text
"¿Cuáles son los skills globales disponibles en este entorno?"
```
El agente consultará su catálogo interno y te confirmará la lista completa.

### 4. Inspección física por Terminal (PowerShell)
```powershell
Get-ChildItem -Path "$env:USERPROFILE\.gemini\config\skills" | Select-Object Name
```

---

## ⚖️ Jerarquía y Precedencia (*Overriding*)

Si en un proyecto específico defines un skill con el mismo nombre en la ruta local:
```text
.agents/skills/<nombre_del_skill>/SKILL.md
```
Antigravity aplicará la siguiente prioridad:
1. **Workspace Project (`.agents/skills/`)**: Máxima prioridad (sobreescribe la versión global).
2. **Global Discovery (`~/.gemini/config/skills/`)**: Segunda prioridad (activo para todos los proyectos de tu máquina).
3. **Built-in Customizations**: Habilidades base del IDE.

---

## 🎯 Skills Recomendados de Mayor Impacto para Sysget Saber (Este Proyecto)

Basado en la arquitectura real de **Sysget Saber** (React + TypeScript + Supabase + aislamiento multi-tenant por RBD + motor pedagógico SIMCE/PAES), se han seleccionado los **6 skills globales prioritarios** con sus casos de uso concretos:

### 1. 🛡️ `doubt-driven-development` (Máxima Prioridad Actual)
- **Contexto en Sysget Saber**: Trabajo activo en la migración `supabase/migrations/043_fix_rls_rendiciones_and_preguntas_rbd.sql` y la suite de pruebas de aislamiento `tests/tenant-isolation.test.ts`. En un sistema multi-establecimiento, una fuga de datos o notas entre diferentes RBDs es una vulnerabilidad crítica.
- **Caso de uso**: Actuar como evaluador adversarial que intenta activamente "romper" las políticas de seguridad buscando fugas, bypasses de tokens o huecos donde un docente pueda ver datos de otro colegio.
- **Prompt listo para usar**:
  > *"Aplica `doubt-driven-development` sobre la migración 043 y las políticas RLS de `rendiciones`. Busca 3 escenarios donde un profesor del colegio A podría leer o alterar resultados del colegio B."*

### 2. 🧪 `test-driven-development` (TDD)
- **Contexto en Sysget Saber**: Cálculos pedagógicos sensibles:
  - Transformación de aciertos a puntaje estimado SIMCE / PAES.
  - Porcentaje de logro por **Eje Curricular** y **Habilidad MINEDUC**.
  - Clasificación de niveles de aprendizaje (*Insuficiente, Elemental, Adecuado*).
  - Procesamiento y validación de hojas OMR con respuestas múltiples, nulas o en blanco.
- **Caso de uso**: Garantizar con pruebas automatizadas que ninguna regla de negocio curricular falle ante casos extremos o de borde.
- **Prompt listo para usar**:
  > *"Usa `test-driven-development` para probar la función que calcula los porcentajes de logro por Eje Curricular cuando hay preguntas compartidas en textos de comprensión lectora."*

### 3. ⚖️ `constraint-driven-development`
- **Contexto en Sysget Saber**: El proyecto cuenta con **11 Directivas Obligatorias de Arquitectura** (`DIRECTIVAS.md`), tales como:
  - *Directiva 1*: Prohibición absoluta de fallback cruzado (`datosReales.length > 0 ? reales : mocks`).
  - *Directiva 2*: Total: 0 es un estado vacío legítimo, jamás inventar datos en Producción.
  - *Directiva 4*: Aislamiento estricto por especialidad docente y RBD.
- **Caso de uso**: Auditar cualquier diff antes de commit para verificar que ningún cambio viole estas reglas fundamentales del proyecto ni relaje el tipado estricto de TypeScript.
- **Prompt listo para usar**:
  > *"Activa `constraint-driven-development` y revisa el diff actual para asegurar que se respetan las Directivas 1 y 2 de Sysget Saber y no hay bypasses en las consultas."*

### 4. 🧹 `code-simplification`
- **Contexto en Sysget Saber**: Componentes interactivos como `src/components/IngresoRespuestasModal.tsx` y `src/components/ProfesorDashboard.tsx` manejan estados complejos (digitación de 35 preguntas, filtros de curso, confirmaciones y guardado masivo en lote).
- **Caso de uso**: Reducir la complejidad ciclomática y anidamientos excesivos en la lógica de guardado de respuestas sin alterar el comportamiento en pantalla.
- **Prompt listo para usar**:
  > *"Aplica `code-simplification` en la función de guardado y validación de alternativas de `IngresoRespuestasModal.tsx` para hacerla más plana y legible."*

### 5. ⚡ `performance-optimization`
- **Contexto en Sysget Saber**: En colegios con cursos de 45 alumnos o al visualizar el **Reporte Tabulado Curricular** (`ReporteTabuladoView.tsx`) con cientos de celdas de logro, los re-renders de React pueden ralentizar la interfaz.
- **Caso de uso**: Diagnosticar renderizados innecesarios, virtualizar listas de estudiantes o aplicar memoización estratégica (`useMemo`, `useDeferredValue`).
- **Prompt listo para usar**:
  > *"Usa `performance-optimization` para auditar `ReporteTabuladoView.tsx` y eliminar re-renders al alternar entre la vista de Habilidades y Ejes Curriculares."*

### 6. 📑 `documentation-and-adrs`
- **Contexto en Sysget Saber**: Decisiones de ingeniería muy bien definidas que deben quedar formalmente registradas para auditorías educativas o pases a producción:
  - Uso de impresión nativa `@media print` y ventanas desacopladas en vez de librerías pesadas de PDF en Canvas.
  - Arquitectura *Supabase First* con aislamiento estricto por RBD.
  - Flujo de ingesta de evaluaciones en 5 fases (extractor, formateador, esquema, seeder, cuadernillo).
- **Caso de uso**: Generar Architecture Decision Records (ADRs) estandarizados en la carpeta `docs/`.
- **Prompt listo para usar**:
  > *"Usa `documentation-and-adrs` para redactar el ADR del aislamiento multi-tenant por RBD a nivel de base de datos PostgreSQL (RLS)."*

---

## 📚 Catálogo, Explicación y Ejemplo Práctico de Cada Skill (1 al 25)

---

### 1. `spec-driven-development` (Equivalente: `/spec`)
- **Explicación**: Separa tajantemente la fase de especificación de la de codificación. Antes de escribir código, redacta un documento formal con contexto, objetivos, modelos de datos, endpoints, restricciones y casos de borde.
- **Cuándo usarlo**: Al idear un módulo nuevo o funcionalidad compleja donde el alcance técnico aún es difuso.
- **Ejemplo de Invocación**:
  ```text
  Usa spec-driven-development para diseñar el nuevo módulo de exportación de actas SIMCE en Excel. No programes aún; redacta la especificación completa.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  # Spec: Exportación Masiva de Actas SIMCE
  ## 1. Objetivos y Alcance
  - Generar un libro .xlsx con pestañas por curso (4° Básico A, B) y resumen institucional.
  ## 2. Modelo de Datos
  - Input: `{ evaluacionId: string, rbd: string, formato: 'detallado' | 'resumen' }`
  ## 3. Casos de Borde
  - Alumnos que rindieron con 0% de asistencia -> Marcar "Ausente", no promedio cero.
  - Caracteres especiales en nombres de alumnos -> Sanitizar UTF-8.
  ```

---

### 2. `planning-and-task-breakdown` (Equivalente: `/plan`)
- **Explicación**: Toma una especificación o requerimiento grande y lo descompone en una secuencia ordenada de micro-tareas independientes, cada una con archivos exactos y criterios de verificación.
- **Cuándo usarlo**: Cuando un cambio abarca más de 2 archivos o afecta diferentes capas de la aplicación.
- **Ejemplo de Invocación**:
  ```text
  Aplica planning-and-task-breakdown para implementar el filtrado por RBD en el panel de evaluaciones. Dame el plan ordenado.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Plan de Implementación: Filtrado por RBD
  1. **Tarea 1 (DB)**: Agregar índice `idx_evaluaciones_rbd` en `supabase/migrations/044_idx.sql`.
     - *Verificación*: Ejecutar `supabase db push` y validar en consola.
  2. **Tarea 2 (API)**: Añadir validación de parámetro `rbd` con Zod en `api/evaluaciones.ts`.
     - *Verificación*: Test unitario con request sin RBD -> HTTP 400.
  3. **Tarea 3 (UI)**: Pasar `currentRbd` al hook `useEvaluaciones` en `EvaluacionesPage.tsx`.
     - *Verificación*: Cargar vista de docente y confirmar que solo lista su colegio.
  ```

---

### 3. `incremental-implementation` (Equivalente: `/build`)
- **Explicación**: Ejecuta una implementación en "rebanadas finas" (*thin slices*) paso a paso. Modifica un archivo o función a la vez, compila y valida antes de pasar al siguiente.
- **Cuándo usarlo**: Al llevar a cabo planes de refactorización o desarrollo donde romper el build a mitad de camino cuesta horas de depuración.
- **Ejemplo de Invocación**:
  ```text
  Siguiendo incremental-implementation, ejecuta únicamente el paso 1 de nuestro plan: crea la interfaz TypeScript de Certificado.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Paso 1 completado en src/types/certificado.ts:
  export interface CertificadoRendicion {
    id: string;
    alumnoRut: string;
    evaluacionTitulo: string;
    puntajeObtenido: number;
    fechaEmision: string;
  }
  // ✅ Validación ejecutada: `npx tsc --noEmit` -> 0 errores.
  // Listo para proceder con el Paso 2 (función generadora).
  ```

---

### 4. `test-driven-development` (Equivalente: `/test`)
- **Explicación**: Aplica el ciclo estricto *Red &rarr; Green &rarr; Refactor*. Escribe primero una prueba unitaria que falle (rojo), luego el código mínimo para pasarla (verde) y finalmente optimiza.
- **Cuándo usarlo**: Al implementar cálculos numéricos, reglas de negocio, utilidades o al resolver un bug reportado.
- **Ejemplo de Invocación**:
  ```text
  Aplica test-driven-development para crear la función calcularLogroEje(preguntas, respuestas).
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // 1. ROJO: tests/logro.test.ts creado y ejecutado:
  test('retorna 0 si el alumno no respondió preguntas del eje', () => {
    expect(calcularLogroEje([], {})).toBe(0); // FALLA: calcularLogroEje is not defined
  });
  // 2. VERDE: función implementada en src/utils/logro.ts:
  export function calcularLogroEje(preguntas, respuestas) {
    if (!preguntas.length) return 0;
    const correctas = preguntas.filter(p => respuestas[p.id] === p.correcta).length;
    return Math.round((correctas / preguntas.length) * 100);
  } // ✅ Test pasa en verde con 100% de éxito.
  ```

---

### 5. `constraint-driven-development` (Equivalente: `/constraints`)
- **Explicación**: Protege los estándares de calidad del repositorio. Impide silenciar errores de linter con `@ts-ignore`, saltarse tests con `.skip()` o bajar los umbrales de cobertura.
- **Cuándo usarlo**: Cuando se realiza una refactorización de código legado y quieres blindar el proyecto contra malas prácticas o atajos.
- **Ejemplo de Invocación**:
  ```text
  Usa constraint-driven-development para auditar mis últimos cambios y certificar que no agregamos ninguna supresión de TypeScript ni relajamos las reglas de ESLint.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Auditoría de Restricciones (CONSTRAINTS.md)
  - 🚫 **Violación Detectada**: Se encontró `// @ts-ignore` en la línea 45 de `src/api.ts`.
  - 🛠️ **Corrección Aplicada**: Se tipó correctamente la respuesta como `Promise<ApiResponse<Evaluacion[]>>`.
  - ✅ **Aserciones de Tests**: 12/12 tests intactos (0 omitidos con `.skip()`).
  - ✅ **TypeScript Estricto**: 0 errores en `tsc --noEmit`.
  ```

---

### 6. `code-review-and-quality` (Equivalente: `/review`)
- **Explicación**: Conduce una revisión exhaustiva en 5 dimensiones: exactitud funcional, arquitectura y diseño, legibilidad, seguridad y rendimiento.
- **Cuándo usarlo**: Antes de enviar o fusionar un Pull Request crítico.
- **Ejemplo de Invocación**:
  ```text
  Usa code-review-and-quality para revisar el componente src/components/IngresoRespuestasModal.tsx.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Hallazgos de Code Review (5 Ejes)
  1. **Seguridad**: ⚠️ Falta validar que el `alumnoId` pertenezca al curso actual en el payload enviado.
  2. **Rendimiento**: 💡 La lista de 35 alternativas re-renderiza todo el modal en cada tecleo; se sugiere envolver cada fila en `React.memo`.
  3. **Legibilidad**: 👍 Nombres de variables limpios y manejo consistente de estados booleanos (`guardando`, `error`).
  4. **Accesibilidad**: ⚠️ Los botones de opción A/B/C/D carecen de atributo `aria-label` para lectores de pantalla.
  ```

---

### 7. `code-simplification` (Equivalente: `/code-simplify`)
- **Explicación**: Transforma código complejo, anidado o lleno de abstracciones prematuras en código plano, directo y fácil de comprender, preservando intacto el comportamiento.
- **Cuándo usarlo**: Al revisar funciones de 80+ líneas con `if/else` anidados en 4 niveles.
- **Ejemplo de Invocación**:
  ```text
  Aplica code-simplification en la función validarRendicion de src/utils/validaciones.ts.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```diff
  - if (datos) {
  -   if (datos.respuestas) {
  -     if (Object.keys(datos.respuestas).length > 0) {
  -       return true;
  -     } else { return false; }
  -   } else { return false; }
  - } else { return false; }
  + // Retorno temprano y simplificación de guarda:
  + if (!datos?.respuestas) return false;
  + return Object.keys(datos.respuestas).length > 0;
  ```

---

### 8. `performance-optimization` (Equivalente: `/webperf`)
- **Explicación**: Audita métricas web (Core Web Vitals), tamaño de bundles, renders innecesarios en React y consultas N+1 en bases de datos.
- **Cuándo usarlo**: Cuando la aplicación tiene demoras perceptibles al cambiar de pestaña o renderizar listas de más de 100 elementos.
- **Ejemplo de Invocación**:
  ```text
  Usa performance-optimization para analizar por qué la tabla de alumnos en ProfesoresPage.tsx se congela al escribir en el buscador.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Diagnóstico de Rendimiento
  - **Causa Raíz**: El filtro `.filter(a => a.nombre.includes(query))` se ejecuta en cada pulsación sobre 450 elementos sin `useMemo` ni `useDeferredValue`.
  - **Solución Propuesta**:
    1. Aplicar `useDeferredValue(query)` para no bloquear el hilo de render.
    2. Memoizar el resultado filtrado con `useMemo(() => ..., [alumnos, deferredQuery])`.
  - **Resultado**: El tiempo de bloqueo total (TBT) se reduce de 320ms a 12ms.
  ```

---

### 9. `shipping-and-launch` (Equivalente: `/ship`)
- **Explicación**: Checklist de pre-vuelo para producción: comprueba migraciones, secretos en variables de entorno, compilación de bundles, políticas CORS y plan de reversión (*rollback*).
- **Cuándo usarlo**: Justo antes de desplegar a Vercel, AWS o Netlify.
- **Ejemplo de Invocación**:
  ```text
  Aplica shipping-and-launch antes del pase a producción de la versión 1.5.0.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Checklist de Pase a Producción v1.5.0
  - [x] Migraciones ejecutadas: 043_fix_rls_rendiciones_and_preguntas_rbd.sql aplicada.
  - [x] Secretos: `SUPABASE_SERVICE_ROLE_KEY` configurado en Vercel, no expuesto en cliente.
  - [x] Bundle de Producción: `npm run build` completado sin advertencias.
  - [ ] **Plan de Rollback**: En caso de fallo crítico en auth, ejecutar `git revert HEAD` y redeploy del commit `a1b2c3d`.
  ```

---

### 10. `interview-me`
- **Explicación**: El agente adopta un rol socrático y te hace preguntas puntuales **una a la vez** para descubrir casos no pensados y afinar los requerimientos.
- **Cuándo usarlo**: Tienes una idea de funcionalidad pero sabes que faltan detalles que no has contemplado.
- **Ejemplo de Invocación**:
  ```text
  Quiero agregar un módulo de recuperación de pruebas para alumnos ausentes. Usa interview-me para definir las reglas.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```text
  Pregunta 1 de 4:
  ¿El alumno ausente debe rendir exactamente el mismo cuadernillo de preguntas original, o el sistema debe generar una versión paralela con las mismas habilidades pero distintas preguntas para evitar copias?
  (Escribe tu respuesta para continuar con la siguiente pregunta).
  ```

---

### 11. `api-and-interface-design`
- **Explicación**: Define esquemas de datos limpios, firmas TypeScript formales, códigos HTTP semánticos y modelos de error antes de programar endpoints.
- **Cuándo usarlo**: Al crear contratos entre frontend y backend para que ambos equipos trabajen en paralelo.
- **Ejemplo de Invocación**:
  ```text
  Usa api-and-interface-design para modelar la API de corrección masiva de pruebas OMR.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Contrato oficial en src/types/api/omr.ts
  export interface CorregirHojaRequest {
    evaluacionId: string;
    alumnoRut: string;
    marcasDetectadas: Record<number, 'A' | 'B' | 'C' | 'D' | 'BLANCO' | 'NULO'>;
  }
  export type CorregirHojaResponse = 
    | { status: 'success'; puntaje: number; porcentaje: number }
    | { status: 'error'; codigo: 'RUT_NO_MATRICULADO' | 'EVALUACION_CERRADA'; mensaje: string };
  ```

---

### 12. `frontend-ui-engineering`
- **Explicación**: Diseña componentes visuales con foco en estados vacíos (*empty states*), skeletons de carga, accesibilidad (teclado, ARIA), microinteracciones y armonía visual.
- **Cuándo usarlo**: Al crear una pantalla nueva o transformar un formulario básico en una experiencia moderna de alto impacto.
- **Ejemplo de Invocación**:
  ```text
  Aplica frontend-ui-engineering para diseñar la tarjeta de resumen SIMCE de un curso con barra de progreso de logro y badges de nivel.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```tsx
  // Tarjeta con Skeleton, Badge dinámico y ARIA accesible
  export const ResumenLogroCard = ({ porcentaje, cargando }: Props) => {
    if (cargando) return <div className="animate-pulse h-24 bg-slate-100 rounded-xl" />;
    const color = porcentaje >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700';
    return (
      <div role="region" aria-label="Nivel de Logro" className="p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
          {porcentaje >= 60 ? 'Adecuado' : 'Elemental'}
        </span>
        <div className="mt-2 text-2xl font-bold">{porcentaje}% de Logro</div>
      </div>
    );
  };
  ```

---

### 13. `context-engineering`
- **Explicación**: Analiza el árbol del proyecto y descarta archivos irrelevantes para mantener la ventana de contexto del asistente limpia y enfocada en lo esencial.
- **Cuándo usarlo**: En proyectos grandes cuando el agente se confunde entre archivos similares de carpetas distintas.
- **Ejemplo de Invocación**:
  ```text
  Usa context-engineering para resolver un fallo en el guardado de pautas: indícame qué 3 archivos debemos abrir y cuáles omitir.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Contexto Quirúrgico Recomendado
  - ✅ **Incluir**:
    1. `src/context/EvaluacionesContext.tsx` (estado local del guardado).
    2. `src/api/pautas.ts` (llamada fetch al endpoint).
    3. `supabase/migrations/032_pautas_table.sql` (esquema y tipos de columna).
  - ❌ **Omitir**: Vistas completas de UI, estilos CSS y reportes históricos.
  ```

---

### 14. `browser-testing-with-devtools`
- **Explicación**: Realiza pruebas interactivas en un navegador real, inspeccionando llamadas de red, estado de cookies y mensajes de consola mediante Chrome DevTools.
- **Cuándo usarlo**: Para verificar si una petición HTTP está fallando con CORS o por qué un modal no cierra al hacer clic afuera.
- **Ejemplo de Invocación**:
  ```text
  Usa browser-testing-with-devtools para abrir la ruta /evaluaciones y confirmar si hay errores en consola al cambiar el filtro de asignatura.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Verificación en Navegador
  - **Navegación**: URL `http://localhost:5173/evaluaciones` abierta exitosamente.
  - **Interacción**: Clic en selector `#filtro-asignatura` -> Opción 'Matemática'.
  - **Consola**: 0 errores de JavaScript detectados.
  - **Petición de Red**: `GET /api/evaluaciones?asignatura=Matematica` -> HTTP 200 (145ms).
  ```

---

### 15. `ci-cd-and-automation`
- **Explicación**: Configura y optimiza pipelines de integración y entrega continua (GitHub Actions, Vercel Checks), gestionando caching y paralelización.
- **Cuándo usarlo**: Al configurar pruebas automáticas obligatorias antes de que un PR pueda ser aprobado.
- **Ejemplo de Invocación**:
  ```text
  Usa ci-cd-and-automation para crear el workflow .github/workflows/ci.yml que corra lint, types y tests en paralelo.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```yaml
  name: CI Quality Gate
  on: [pull_request]
  jobs:
    validate:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: 20, cache: 'npm' }
        - run: npm ci
        - run: npx tsc --noEmit
        - run: npm test
  ```

---

### 16. `debugging-and-error-recovery`
- **Explicación**: Adopta un enfoque científico ante bugs: recrea el fallo, plantea hipótesis falsables, agrega logs o breakpoints lógicos y valida la solución con un test de no-regresión.
- **Cuándo usarlo**: Ante un error recurrente o inesperado donde no se conoce el origen exacto.
- **Ejemplo de Invocación**:
  ```text
  Aplica debugging-and-error-recovery sobre el error: "TypeError: Cannot read properties of undefined (reading 'filter')" en AlumnosPage.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Depuración Causa Raíz
  - **Hipótesis**: La consulta Supabase retorna `null` en lugar de `[]` cuando el curso no tiene alumnos matriculados.
  - **Comprobación**: Al ingresar a un curso nuevo, `data` es `null`, por lo que `alumnos.filter()` lanza error fatal.
  - **Solución**: Asignar valor por defecto: `const lista = data ?? [];`.
  - **Prevención**: Añadido test en `alumnos.test.ts` con lista vacía.
  ```

---

### 17. `deprecation-and-migration`
- **Explicación**: Gestiona migraciones complejas de esquemas o APIs sin tiempo de parada (*zero downtime*) usando la técnica expand/contract (añadir columna nueva, doble escritura, migrar datos, retirar columna vieja).
- **Cuándo usarlo**: Al cambiar nombres de tablas, columnas o firmas de funciones en producción.
- **Ejemplo de Invocación**:
  ```text
  Aplica deprecation-and-migration para renombrar la propiedad alumno_nombre a nombre_completo en nuestra API de alumnos sin romper clientes antiguos.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Fase 1: Expand (Soporte dual)
  export function mapAlumno(row: any) {
    const nombre = row.nombre_completo || row.alumno_nombre;
    return {
      nombre_completo: nombre,
      alumno_nombre: nombre, // Deprecado: Se eliminará en v3.0
    };
  }
  ```

---

### 18. `documentation-and-adrs`
- **Explicación**: Genera documentos de registro de decisiones arquitectónicas (ADRs) que capturan el contexto, las alternativas rechazadas y las justificaciones técnicas.
- **Cuándo usarlo**: Cuando tomas una decisión técnica de gran impacto que cualquier nuevo desarrollador en el equipo necesitará comprender.
- **Ejemplo de Invocación**:
  ```text
  Usa documentation-and-adrs para redactar el ADR-005 sobre el uso de CSS nativo (@media print) en lugar de librerías PDF basadas en Canvas.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  # ADR-005: Motor de Impresión Nativo vía CSS Print
  - **Estado**: Aceptado
  - **Contexto**: Librerías como html2canvas generaban PDFs de 15MB con texto rasterizado borroso y saltos de página defectuosos.
  - **Decisión**: Utilizar estilos `@media print` puros y `window.print()` en ventanas desacopladas.
  - **Consecuencias**: Impresión instantánea a 300 DPI vectoriales, 0 bytes de bundle extra, control milimétrico de saltos de página.
  ```

---

### 19. `doubt-driven-development`
- **Explicación**: Adopta el rol de un crítico adversarial que intenta "romper" tu plan o solución, buscando vulnerabilidades de seguridad, condiciones de carrera y supuestos falsos.
- **Cuándo usarlo**: Antes de aprobar cambios en autenticación, roles de usuario, permisos o transacciones financieras.
- **Ejemplo de Invocación**:
  ```text
  Aplica doubt-driven-development sobre nuestro nuevo flujo de impersonación de directores ("👑 Ver como Colegio").
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Ataque Adversarial al Flujo
  1. **Ataque de Token Replay**: ¿Qué pasa si el Super Admin impersona al colegio A, copia el JWT y luego intenta editar un curso del colegio B?
  2. **Persistencia Huérfana**: Si el Super Admin cierra la pestaña mientras impersona, ¿el localStorage guardará la sesión del docente y perderá su rol de administrador?
  - 🛡️ **Mitigación obligatoria**: Almacenar el token del admin en memoria de sesión volátil y requerir revalidación en cada petición de escritura.
  ```

---

### 20. `git-workflow-and-versioning`
- **Explicación**: Audita tu working tree y estructura commits pequeños y semánticos siguiendo la convención Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Cuándo usarlo**: Cuando tienes 10 archivos modificados y quieres hacer un commit ordenado y limpio para el historial.
- **Ejemplo de Invocación**:
  ```text
  Usa git-workflow-and-versioning para separar mis cambios actuales en commits lógicos con mensajes estándar.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```bash
  # Commit 1: Core de datos
  git add supabase/migrations/043_fix_rls.sql
  git commit -m "fix(db): aislar rendiciones por rbd en políticas rls"

  # Commit 2: Interfaz de usuario
  git add src/components/ProfesorDashboard.tsx
  git commit -m "feat(ui): ocultar selector de colegio cuando usuario es docente"
  ```

---

### 21. `idea-refine`
- **Explicación**: Estructura ideas tempranas mediante matrices de valor vs. esfuerzo, identificación del usuario objetivo y definición de la versión mínima viable (MVP).
- **Cuándo usarlo**: Cuando tienes una corazonada o propuesta nueva y quieres darle forma antes de proponerla formalmente.
- **Ejemplo de Invocación**:
  ```text
  Aplica idea-refine a mi propuesta de agregar gamificación con medallas para los alumnos en los ensayos SIMCE.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Refinamiento de Idea: Gamificación SIMCE
  - **Problema real**: Fatiga y desmotivación del estudiante al rendir ensayos largos de 35 preguntas.
  - **Matriz de Impacto**: Alto valor de enganche / Esfuerzo medio.
  - **MVP Recomendado**:
    - Medalla "Racha de Constancia" (rendir 3 ensayos seguidos).
    - Medalla "Superación" (+10% de mejora respecto al ensayo anterior).
    - Evitar medallas por velocidad para no fomentar respuestas al azar.
  ```

---

### 22. `observability-and-instrumentation`
- **Explicación**: Diseña el monitoreo de la aplicación: eventos clave a registrar, trazas de tiempo de respuesta, logs estructurados JSON y umbrales de alerta.
- **Cuándo usarlo**: Al implementar procesos en segundo plano o APIs críticas donde los fallos deben alertarse antes de que el usuario reclame.
- **Ejemplo de Invocación**:
  ```text
  Usa observability-and-instrumentation para registrar los tiempos de carga del reporte curricular masivo.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Instrumentación estructurada en src/utils/logger.ts
  const startTime = performance.now();
  try {
    const reporte = await generarReporteCurricular(cursoId);
    logger.info({
      event: 'reporte_generado_exito',
      cursoId,
      duracionMs: Math.round(performance.now() - startTime),
      totalAlumnos: reporte.alumnos.length
    });
  } catch (error) {
    logger.error({ event: 'reporte_fallido', cursoId, error: error.message });
  }
  ```

---

### 23. `security-and-hardening`
- **Explicación**: Aplica directrices de seguridad defensiva: validación estricta de esquemas (Zod), prevención de inyección SQL/NoSQL, sanitización XSS y cabeceras seguras (Helmet).
- **Cuándo usarlo**: En cualquier endpoint o formulario que acepte datos enviados por usuarios o terceros.
- **Ejemplo de Invocación**:
  ```text
  Aplica security-and-hardening en la función de importación masiva de alumnos desde archivo Excel.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Esquema Zod de validación y sanitización estricta
  import { z } from 'zod';

  export const AlumnoImportSchema = z.object({
    rut: z.string().regex(/^[0-9]+-[0-9kK]$/, 'Formato de RUT inválido'),
    nombre: z.string().min(2).max(80).transform(val => val.replace(/[<>]/g, '')), // Anti-XSS
    email: z.string().email().optional(),
    rbd: z.number().int().positive()
  });
  ```

---

### 24. `source-driven-development`
- **Explicación**: Consulta e implementa el código basándose exclusivamente en la documentación oficial vigente, evitando librerías descontinuadas o sintaxis deprecadas.
- **Cuándo usarlo**: Al migrar a versiones mayores de herramientas (ej. React Router v7, Supabase JS v2, Vite v6).
- **Ejemplo de Invocación**:
  ```text
  Usa source-driven-development para escribir la configuración de autenticación con Supabase usando el helper oficial @supabase/ssr.
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```typescript
  // Implementación verificada contra la documentación oficial de Supabase SSR:
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';

  export function createClient() {
    const cookieStore = cookies();
    return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
      }
    });
  }
  ```

---

### 25. `using-agent-skills`
- **Explicación**: La meta-habilidad que orquesta a todos los demás skills. Analiza el problema global y define la secuencia exacta de skills a activar para llevar un proyecto de la idea al despliegue.
- **Cuándo usarlo**: Al arrancar una iniciativa completa y necesites un flujo de trabajo estructurado de punta a punta.
- **Ejemplo de Invocación**:
  ```text
  Usa using-agent-skills para planificar la construcción del nuevo motor de impresión de diplomas escolares. ¿Qué skills usamos y en qué orden?
  ```
- **Ejemplo de Salida Generada por el Agente**:
  ```markdown
  ## Pipeline de Ejecución de Skills Orquestado:
  1. 📝 `spec-driven-development`: Redactar los requisitos del diploma (formatos, sellos, firmas).
  2. 🗺️ `planning-and-task-breakdown`: Desglosar en 3 tareas (diseño SVG, variables de impresión, modal).
  3. 🧪 `test-driven-development`: Crear pruebas de inyección de datos de alumnos en el diploma.
  4. 🎨 `frontend-ui-engineering`: Maquetar la plantilla con estilos `@media print`.
  5. 🔍 `code-review-and-quality`: Revisar legibilidad, contraste y soporte en navegadores.
  6. 🚀 `shipping-and-launch`: Verificar que la versión final esté lista para producción.
  ```
