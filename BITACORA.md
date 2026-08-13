# 📖 Bitácora de Desarrollo — Sysget Saber

Registro oficial de avances, tareas ejecutadas y soluciones técnicas del proyecto.

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
