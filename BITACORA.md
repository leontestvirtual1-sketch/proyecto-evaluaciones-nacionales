# 📖 Bitácora de Desarrollo — Sysget Saber

Registro oficial de avances, tareas ejecutadas y soluciones técnicas del proyecto.

### [2026-08-17] Aislamiento Estricto de Ambientes (Demo vs Producción), Conteo Dinámico de Trial y Limpieza de Alumnos en Impresión

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
