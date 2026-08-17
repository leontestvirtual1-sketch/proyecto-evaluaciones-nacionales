# 🏛️ Directivas Oficiales de Arquitectura y Desarrollo — Sysget Saber

Este documento establece las reglas y estándares mandatorios para el desarrollo, evolución y mantenimiento de la plataforma **Sysget Saber**. Todas las implementaciones, refactorizaciones y agentes de IA deben adherirse estrictamente a estas directivas.

---

## 1. 🛡️ Directiva de Aislamiento Estricto de Ambientes (Demo vs. Producción)
> **Principio**: *El entorno Demo y el entorno de Producción operan como dos universos completamente paralelos e independientes.*

* **Prohibición de Fallback Cruzado**: Jamás utilizar operadores del tipo `datosReales.length > 0 ? datosReales : datosMock`.
* **Identificación Explícita de Contexto**: La discriminación de entorno se realiza por la identidad del usuario (`isProductionAdmin`, `isDemoUser`, `isSandboxMode`), **nunca por si una lista tiene elementos o está vacía**.
* **Almacenamiento Local Aislado**: Todas las claves de `localStorage` deben tener prefijo de ambiente:
  - `sysget_demo_*` (para simulaciones, tours guiados y pruebas de venta).
  - `sysget_prod_*` (para colegios reales, listas de matrícula y contraseñas de producción).
* **Super Admin Producción (`leontestvirtual1@gmail.com`)**: No tiene colegio fijo asignado en la cabecera. Supervisa el catálogo multiescolar desde el Sidebar y no ve evaluaciones ni docentes de demostración.
* **Admin Demo (`admin@sysget.cl`)**: Opera únicamente sobre los datos simulados del Liceo Bicentenario Los Andes y sus docentes de demostración (María González, Carlos Morales, Patricia Muñoz).

---

## 2. 📭 Directiva de Estados Vacíos Legítimos (*Empty States*)
> **Principio**: *En Producción, tener 0 alumnos o 0 evaluaciones es un estado válido de inicio de ciclo escolar, no un error de carga.*

* **Sin Relleno Automático**: Si un curso en producción no tiene estudiantes matriculados, la pantalla de alumnos, el modal de impresión y los informes deben mostrar:
  - Total: **0 Alumnos**.
  - Estado: *"En proceso de carga de nómina oficial"*.
  - Enlace de acción: *"Cargar Nómina CSV / Excel"*.
* **Impresión Segura**: La pestaña *"2. Por Alumno"* del modal de impresión no debe inyectar alumnos ficticios si el curso está en proceso de poblamiento.

---

## 3. 🗄️ Directiva de Persistencia y Datos (Supabase First)
> **Principio**: *La fuente única de verdad en Producción es la base de datos PostgreSQL de Supabase.*

* **Jerarquía de Carga**:
  $$\text{Supabase (DB Real)} \longrightarrow \text{LocalStorage (Caché Offline)} \longrightarrow \text{Estado React}$$
* **Estructura Oficial de Entidades**:
  - `perfiles`: Usuarios del sistema, roles (`admin`, `profesor`, `alumno`), RBD asociado, plan (`trial`, `institucional`) y fecha de registro.
  - `establecimientos`: Datos institucionales (RBD, nombre oficial, escudo/logo, lema, dependencia).
  - `evaluaciones` y `preguntas`: Ensayos SIMCE/PAES con cobertura de ejes, habilidades y pautas pedagógicas.
  - `rendiciones` y `respuestas_alumnos`: Respuestas marcadas, porcentaje de logro y puntaje estandarizado nacional.
* **Cómputo Dinámico de Trial**: El período de prueba de 30 días siempre se calcula en base a la columna `created_at` del registro en base de datos:
  $$\text{Días Restantes} = \max(0,\, 30 - \text{días transcurridos desde el registro})$$

---

## 4. 🔐 Directiva de Seguridad y Control de Acceso (RBAC Estricto)
> **Principio**: *Aislamiento pedagógico total entre especialidades y colegios (Multi-Tenant).*

* **Aislamiento por Especialidad Docente**:
  - Un profesor de **Lenguaje** solo ve, edita y rinde pruebas de Lenguaje.
  - Un profesor de **Matemática** no tiene visibilidad sobre pruebas ni banco de Ciencias o Lenguaje.
* **Aislamiento por Establecimiento (RBD)**:
  - Los docentes y directivos de un colegio solo acceden a los cursos y estudiantes de su propio RBD.
* **Gestión de Contraseñas**:
  - La pantalla de login no debe exponer credenciales en texto plano.
  - Los reseteos de contraseña ejecutados por el Admin se persisten de forma segura y se validan con prioridad en el inicio de sesión.

---

## 5. 🖨️ Directiva del Motor de Impresión y Cuadernillos PDF
> **Principio**: *Los cuadernillos generados deben cumplir con los estándares formales del MINEDUC / DEMRE.*

* **Flujo Continuo sin Hojas en Blanco**: El maquetador CSS `@media print` debe aprovechar el espacio vertical de manera fluida, evitando saltos de página forzados que dejen preguntas solitarias o páginas vacías.
* **Membrete Dinámico**: El encabezado de cada cuadernillo toma automáticamente el **logo oficial**, **RBD** y **lema institucional** del colegio del docente que imprime.
* **Hojas de Respuesta y Pautas**: Las hojas de respuesta para escaneo óptico (OMR) y las pautas docentes de corrección siempre se generan en hojas independientes claramente rotuladas.

---

## 6. 📝 Directiva de Registro, Bitácora y Obsidian
> **Principio**: *Ninguna tarea se considera terminada sin trazabilidad en la bitácora técnica.*

Al concluir cualquier ajuste o módulo:
1. **Compilación Obligatoria**: `npm run build` con 0 errores TypeScript/Vite antes de realizar commit.
2. **Actualización de `BITACORA.md`**: Detallar problema/requerimiento, archivos modificados y verificación.
3. **Registro en Obsidian**: Actualizar la nota de avance correspondiente en el vault de documentación técnica.
