# 📖 Bitácora de Desarrollo — Sysget Saber

Registro oficial de avances, tareas ejecutadas y soluciones técnicas del proyecto.

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
