# ADR 005: Calificación Segura en Servidor y Aislamiento de Claves en el Cliente

- **Estado**: Aceptado
- **Fecha**: 2026-09-21
- **Autores**: Equipo Sysget Saber / Antigravity
- **Mapeo de Directivas**: Directiva 1 (Aislamiento de Ambientes), Directiva 3 (Supabase First), Directiva 4 (RBAC Estricto), Directiva 10 (Zero Secrets), CONSTRAINTS Bloque 1 (Seguridad y Multi-Tenant)

---

## Contexto y Planteamiento del Problema

En la arquitectura original de la aplicación se detectaron vulnerabilidades críticas en el flujo de rendición y corrección de evaluaciones por parte de los estudiantes:

1. **Fuga de Claves al Navegador del Estudiante**:
   - Al cargar una evaluación para rendición en el componente de alumno, las consultas SQL (`select('*')`) y hooks transferían la totalidad de los datos de la pregunta al navegador web, incluyendo los campos `respuesta_correcta` y los flags booleanos `es_correcta: true` dentro del arreglo de alternativas.
   - Cualquier estudiante con conocimientos básicos de herramientas de desarrollo (DevTools: pestaña *Red/Network*, inspección de componentes React o consola JavaScript) podía extraer el clavijero completo antes de contestar la primera pregunta.

2. **Calificación en el Lado del Cliente (Client-Side Grading)**:
   - Existía un mecanismo de respaldo (*fallback local*) en `AlumnoEvaluationView.tsx` que, en caso de fallo de red o error de API, calculaba el puntaje y las respuestas correctas directamente en el navegador del alumno.

3. **Inseguridad en el Endpoint de Calificación (`api/grade-evaluation.ts`)**:
   - **Riesgo de IDOR y Suplantación**: El endpoint leía `alumnoId` directamente desde el cuerpo de la petición HTTP (`req.body.alumnoId`), permitiendo a un atacante calificar o sobreescribir rendiciones en nombre de cualquier otro estudiante.
   - **Ausencia de Validación de Sesión**: No se requería un encabezado `Authorization: Bearer` con token JWT válido de Supabase Auth.
   - **Vulnerabilidad a Replay (Doble Envío)**: No existía compuerta contra el reenvío múltiple de rendiciones para una misma combinación de evaluación y estudiante.
   - **Secretos Débiles y Fallbacks**: El archivo implementaba un fallback con un JWT falso hardcodeado para la `service_role_key`, violando las directivas de seguridad.

---

## Opciones Consideradas

1. **Ofuscación en el Cliente (Base64, Hashing o Cifrado Simétrico)**:
   - *Pros*: No requiere cambios en la infraestructura de backend.
   - *Contras*: Seguridad por oscuridad. Cualquier clave o algoritmo incrustado en el bundle JavaScript es fácilmente reversible mediante ingeniería inversa.

2. **Calificación en el Navegador con Envío de Hash Criptográfico**:
   - *Pros*: Reduce carga en el servidor.
   - *Contras*: Mantiene las respuestas correctas en la memoria del dispositivo del estudiante y no previene la inspección de DOM o estado en tiempo real.

3. **Arquitectura Zero-Trust: Calificación Exclusiva en Servidor con Aislamiento Estricto de Claves (Opción Elegida)**:
   - *Pros*: Las respuestas correctas **nunca** abandonan la base de datos ni viajan hacia el entorno del estudiante. El servidor valida la identidad criptográfica del usuario, califica de forma aislada y persiste la rendición de manera inmutable.
   - *Contras*: Requiere conectividad con el backend y mayor rigor en el manejo de sesiones en el frontend.

---

## Decisión

Se implementa una arquitectura **Zero-Trust de Calificación y Aislamiento de Claves**:

### 1. Endpoint Centralizado y Blindado (`/api/grade-evaluation`)
- **Autenticación Obligatoria**: Se exige `Authorization: Bearer <sessionToken>`. La función `getAuthUser(req)` valida criptográficamente el JWT ante Supabase Auth.
- **Identidad Inmutable**: El `alumno_id` se extrae exclusivamente de `user.id` del token validado. El campo `alumnoId` del cuerpo de la petición se ignora por completo, neutralizando ataques de tipo IDOR.
- **Compuerta Anti-Replay**: Se comprueba la no existencia de una rendición previa finalizada para la tupla `(prueba_id, alumno_id)`. Se generan identificadores únicos mediante `crypto.randomUUID()`.
- **Fail-Fast de Variables de Entorno**: Se eliminan todos los fallbacks hardcodeados de credenciales. La ausencia de `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_URL` aborta inmediatamente con error 500 seguro, sin exponer detalles internos (`err.message`).
- **Respuesta Segura**: La API devuelve el resultado procesado (`puntaje`, `total_preguntas`, `estado: 'corregida'`) sin filtrar datos sensibles del sistema.

### 2. Sanitización y Perímetros de Entrega de Preguntas
- **Vista del Estudiante (`App.tsx` y `AlumnoEvaluationView.tsx`)**:
  - Toda pregunta suministrada al runner del alumno pasa obligatoriamente por el sanitizador `getPreguntasForRunner()`, el cual fuerza `respuestaCorrecta = null` y muta cada alternativa con `es_correcta = false`.
  - El *fallback local* de calificación en el cliente queda estrictamente restringido a evaluaciones etiquetadas como demostración pública (`if (!esDemo) return;`).
- **Función RPC en Base de Datos**:
  - Se crea la función PostgreSQL `get_preguntas_evaluacion(p_evaluacion_id UUID)` con `SECURITY DEFINER`, que proyecta las preguntas excluyendo la columna `respuesta_correcta` y purgando las marcas `es_correcta` del JSON de alternativas.
- **Banco de Preguntas Docente (`useBancoPreguntas.ts`)**:
  - Se eliminan las consultas abiertas `select('*')`, reemplazándolas por proyección explícita de columnas (`BANCO_DOCENTE_COLUMNS`). Este acceso está blindado por políticas RLS y RBAC restringido a docentes y administradores.

### 3. Automatización de Pruebas de Regresión
Se incorporan suites de pruebas unitarias automatizadas:
- `tests/grade-evaluation-security.test.ts`: Valida rechazo de peticiones sin token (401), bloqueo de IDOR, inmutabilidad de identidad y manejo seguro de errores.
- `tests/student-runner-security.test.ts`: Comprueba que ninguna estructura de datos enviada al runner del estudiante contenga claves ni alternativas marcadas como verdaderas.

---

## Consecuencias

### Positivas
- **Integridad Psicométrica Total**: Es materialmente imposible para un estudiante anticipar o copiar respuestas correctas mediante inspección técnica del cliente web o análisis de tráfico HTTP.
- **No Repudio y Trazabilidad**: Cada calificación está respaldada por la identidad autenticada del estudiante, con marca temporal y UUID criptográfico.
- **Cumplimiento de Estándares de Seguridad**: Alineado con las mejores prácticas OWASP en protección de APIs (evasión de BOLA/IDOR) y directivas institucionales.

### Consideraciones
- Los estudiantes requieren una sesión autenticada activa para que sus rendiciones oficiales sean recibidas y evaluadas. Las pruebas en modo offline o sin conectividad quedan reservadas a evaluaciones pedagógicas demostrativas (`es_demo`).
