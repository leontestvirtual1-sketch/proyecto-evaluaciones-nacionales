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



