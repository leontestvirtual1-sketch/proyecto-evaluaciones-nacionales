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
1. **Compilación Obligatoria**: `npx tsc --noEmit` con 0 errores TypeScript antes de realizar commit.
2. **Actualización de `BITACORA.md`**: Detallar problema/requerimiento, archivos modificados y verificación.
3. **Registro en Obsidian**: Actualizar `Bitacora-AAAA-MM-DD.md` y `Ficha-Principal-Evaluaciones.md` en el vault.

---

## 7. 🎓 Directiva de Aislamiento del Banco de Preguntas por Curso / Nivel Escolar
> **Principio**: *Las preguntas de distintos niveles escolares nunca deben mezclarse en la visualización ni en el cómputo de métricas.*
> *Establecida: 2026-08-17*

* **Selector Obligatorio de Nivel**: El Banco de Preguntas debe siempre mostrar un selector visual de Curso/Nivel (p.ej. `2° Medio`, `8° Básico`, `6° Básico`, `Todos los Cursos`) antes de desplegar los ítems.
* **Filtrado Estricto**: Al seleccionar un nivel, solo se muestran preguntas cuyo campo `nivelEscolar` coincida exactamente con ese nivel. Nunca se aplican operadores `||` sobre `asignaturaId` como condición alternativa de fallback.
* **KPIs Dinámicos por Nivel**: Los contadores de resumen (`Total`, `Selección Múltiple`, `Desarrollo Escrito`, `Oficiales / Liberadas`) se recalculan exclusivamente sobre el subconjunto de preguntas del nivel activo.
* **Nivel por Defecto en Producción**: En el entorno de Producción, el selector se inicializa en el nivel del curso asignado a la docente activa (p. ej. `2° Medio` para María Teresa González en la Escuela Premilitar).
* **Badge Visual Obligatorio**: Cada tarjeta de pregunta en el banco debe mostrar un badge de nivel escolar (`🎓 2° Medio`, `📚 8° Básico`, etc.) para identificación inmediata.
* **Creación de Nuevas Preguntas**: El formulario de creación (`PreguntaFormModal`) debe pre-rellenar el campo `nivelEscolar` con el nivel activo del selector, evitando clasificaciones incorrectas.

---

## 8. 📊 Directiva de Datos Históricos Oficiales SIMCE (Agencia de Calidad)
> **Principio**: *Los datos de la Agencia de Calidad de la Educación constituyen la Línea Base Oficial del sistema y deben integrarse en el panel de administración de Producción exclusivamente, nunca en el ambiente Demo.*
> *Establecida: 2026-08-17*

* **Fuente de Verdad Externa**: Los puntajes SIMCE históricos, distribución de niveles de aprendizaje y brechas por género provienen directamente de la Agencia de Calidad. No se inventan ni interpolan datos.
* **Archivos de Datos Tipados**: Cada establecimiento con datos reales debe tener su propio archivo `src/data/simceHistorico<Establecimiento>Data.ts` con interfaces TypeScript explícitas y sin exportar hacia ambientes Demo.
* **Componente Exclusivo de Producción**: El componente visual de la Línea Base SIMCE (p. ej. `SimceHistoricoPremilSection`) se renderiza **solo** dentro del bloque `isProductionAdmin` del `ProfesorDashboard`. Está prohibido importarlo en paneles Demo o Sandbox.
* **Gráficos Requeridos**: Todo módulo de Línea Base SIMCE debe incluir al menos:
  1. **Tendencia GSE**: Puntaje del colegio vs promedio nacional del mismo grupo socioeconómico con línea de meta.
  2. **Niveles de Aprendizaje**: Distribución porcentual Insuficiente / Elemental / Adecuado (barras apiladas).
  3. **Brecha por Género**: Puntaje Mujeres vs Hombres con alerta pedagógica automática si la brecha ≥ 10 pts.
* **Alerta de Estancamiento**: Si un grupo (mujeres u hombres) registra variación ≤ 1 pt entre los últimos 2 años, el componente debe emitir visualmente una alerta pedagógica de estancamiento.
* **Nota de Restricción Estadística**: Los años con datos marcados con asterisco (*) por tamaño de muestra insuficiente deben ser señalados en el tooltip y/o leyenda del gráfico.
* **Meta 2026 Visible**: La línea de referencia de meta (240 pts para GSE Medio Bajo) debe ser siempre visible en el gráfico de Tendencia GSE como línea de referencia punteada en color ámbar.

---

## 9. 🔐 Directiva de Detección de Ambiente por Sesión de Admin, No por Email del Usuario Activo
> **Principio**: *El ambiente (Producción / Demo) se determina por la **sesión que abrió el administrador**, no por el email del usuario cuya vista está activa en ese momento.*
> *Establecida: 2026-08-21 — origen: bug crítico "datos demo al supervisar docente real Susana Angélica Pizarro Valenzuela"*

### Problema Documentado
Cuando el Admin de Producción (`leontestvirtual1@gmail.com`) ejecuta `switchToDocente(susana)`, el estado global `user` cambia al perfil de Susana (`nentitasusana@hotmail.com`). Si cualquier componente o contexto evalúa el ambiente basándose solo en `user.email`, lo interpretará como "no producción" y cargará datos Demo/Sandbox (Liceo Bicentenario Los Andes).

### Regla Obligatoria
* **Fuente de verdad del ambiente**: `adminBaseProfile` (perfil del admin que inició la sesión). Si `adminBaseProfile.email` ∈ `PRODUCTION_ADMIN_EMAILS`, **toda la sesión es de producción**, independientemente del docente supervisado.
* **`AcademicDataContext.isProduction`** DEBE evaluar `adminBaseProfile` **antes** que `currentUser.email`.
* **Prohibido**: Usar `currentUser.email === 'leontestvirtual1@gmail.com'` como única condición cuando existe supervisión activa de docente.
* **`PRODUCTION_ADMIN_EMAILS`**: Mantener como `Set<string>` centralizado en `AcademicDataContext.tsx`. Nunca duplicar emails hardcodeados en múltiples archivos.
* **Prop obligatorio**: `AcademicDataProvider` debe recibir y procesar `adminBaseProfile?: UserProfile | null` junto a `currentUser`.

### Implementación de Referencia (patrón oficial)
```tsx
// En AcademicDataContext.tsx
const PRODUCTION_ADMIN_EMAILS = new Set(['leontestvirtual1@gmail.com', 'leontesvirtual1@gmail.com']);

const isProduction = useMemo(() => {
  if (isSandboxMode) return false;
  if (!currentUser) return false;
  // 1. Sesión iniciada por admin de producción (aunque supervise a otro docente)
  if (adminBaseProfile && PRODUCTION_ADMIN_EMAILS.has(adminBaseProfile.email.toLowerCase())) return true;
  // 2. Admin o docente de producción logueados directamente
  return PRODUCTION_ADMIN_EMAILS.has(currentUser.email.toLowerCase()) || currentUser.email === 'luis.leon@premil.cl';
}, [currentUser, adminBaseProfile, isSandboxMode]);
```

### Tabla de Casos de Uso
| Situación | `user.email` | `adminBaseProfile.email` | `isProduction` correcto |
|---|---|---|---|
| Admin logueado directamente | `leontestvirtual1@gmail.com` | `null` | ✅ `true` |
| Admin supervisando María Teresa | `luis.leon@premil.cl` | `leontestvirtual1@gmail.com` | ✅ `true` |
| Admin supervisando Susana Angélica | `nentitasusana@hotmail.com` | `leontestvirtual1@gmail.com` | ✅ `true` |
| Docente demo logueado | `maria.gonzalez@sysget.cl` | `null` | ❌ `false` → Demo |
| Admin Demo logueado | `admin@escuelademo.cl` | `null` | ❌ `false` → Demo |

### Corolario: Perfil de Susana en Construcción
El perfil de Susana Angélica (Colegio Mi Casa) se encuentra en **proceso de poblamiento**. Hasta que se completen sus datos en Supabase, el sistema debe:
- Mostrar su sección con **Estado Vacío Legítimo** (Directiva 2): 0 cursos, 0 alumnos, "En proceso de carga".
- **Nunca** mostrar datos del Liceo Bicentenario Demo en su vista.
