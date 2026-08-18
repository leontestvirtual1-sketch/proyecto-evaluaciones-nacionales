# 🛠️ Manual de Implementación y Arquitectura Técnica — Sysget Saber
### Guía de Ingeniería desde Cero, Registro de Issues Críticos y Soluciones de Arquitectura

---

## 📑 1. Ficha Técnica e Infraestructura del Proyecto

| Componente | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite | Compilación ultrarrápida (HMR), tipado estático estricto y cero sobrecarga de bundle. |
| **Estilos & UI** | Tailwind CSS + Lucide Icons | Diseño responsive, componentes modales compactos, modo oscuro dinámico y micro-animaciones. |
| **Visualización & Gráficos** | Recharts | Renderizado SVG reactivo para mapas de calor, líneas de tendencia GSE y barras apiladas. |
| **Backend & Base de Datos** | Supabase (PostgreSQL + Auth + RLS) | Persistencia relacional, autenticación segura y políticas de aislamiento a nivel de fila (Multi-tenant). |
| **Módulo Serverless & Correo** | Vercel Serverless Functions + Google SMTP | Envío transaccional vía Nodemailer (smtp.gmail.com:465 SSL) con  de costo fijo. |
| **Hosting & CI/CD** | Vercel | Despliegue continuo automatizado desde rama main en GitHub. |

---

## 🏗️ 2. Arquitectura de Datos y Entidades Centrales

`
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   perfiles      │──────<│ rendiciones     │>──────│   evaluaciones  │
│ (Admin/Docente) │       │ (Resultados)    │       │ (SIMCE / PAES)  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │                         │
                                   │                         │
                          ┌─────────────────┐       ┌─────────────────┐
                          │   respuestas    │       │    preguntas    │
                          │   alumnos       │       │ (Banco Oficial) │
                          └─────────────────┘       └─────────────────┘
`

### Definición de Tipos TypeScript Clave (src/types/index.ts):
* UserProfile: Identidad, RUT, rol (dmin, profesor, lumno), RBD asociado, asignatura asignada y estado de suscripción (	rial, institucional).
* Prueba: Instrumento de evaluación con código oficial (SIMCE-2M-LEN-ABR), asignatura, curso, duración, estado (orrador, ctiva, inalizada) y vector estricto de preguntasIds: string[].
* Pregunta: Reactivo calibrado con texto/lectura, opciones (A, B, C, D), alternativa correcta, eje temático, habilidad MINEDUC, nivel escolar (2° Medio, 8° Básico) y rúbrica analítica para preguntas de desarrollo.
* SimceHistoricoPremilData: Estructura oficial de datos de la Agencia de Calidad (2016–2025) con puntaje colegio, promedio GSE, distribución de niveles (%) y desglose por género.

---

## 🚨 3. Registro de Issues Críticos y Soluciones de Ingeniería

Durante el desarrollo e implementación del proyecto se enfrentaron 7 desafíos técnicos de alta complejidad. A continuación se documenta la causa raíz y la solución técnica de cada uno:

---

### 🔴 ISSUE 1: Aislamiento Radical Demo vs. Producción (Principio Anti-Fallback)
* **Síntoma / Problema**: Cuando un usuario ingresaba a Producción con un colegio real sin alumnos cargados aún, la plataforma inyectaba automáticamente datos simulados del *Liceo Bicentenario* o de docentes de demostración (María González, Carlos Morales).
* **Causa Raíz**: Existencia de operadores ternarios permisivos del tipo:
  \text{listaAlumnos} = \text{alumnosReales.length} > 0 \;?\; \text{alumnosReales} : \text{alumnosMock}
* **Solución de Ingeniería**:
  1. Se eliminó todo fallback disyuntivo en App.tsx, ProfesorDashboard.tsx y mockData.ts.
  2. Se instituyó la **Directiva de Estados Vacíos Legítimos (*Empty States*)**: en producción, tener 0 alumnos o 0 evaluaciones es un estado válido de inicio de ciclo.
  3. La discriminación de ambiente se realiza por identidad estricta: isProductionAdmin (leontestvirtual1@gmail.com) vs isDemoUser (dmin@sysget.cl / dmin@escuelademo.cl).

---

### 🔴 ISSUE 2: Hardening de Autenticación y Cierre de Fallback Permisivo
* **Síntoma / Problema**: Al intentar iniciar sesión con correos no registrados, el sistema intentaba "adivinar" el rol creando perfiles genéricos al vuelo.
* **Causa Raíz**: Función inferUserFromEmail que contenía patrones heurísticos permisivos (mail.includes('admin')).
* **Solución de Ingeniería**:
  1. Refactorización de inferUserFromEmail a **rechazo categórico (eturn null)**.
  2. Autenticación cerrada: solo se permite acceso a correos explícitamente registrados en base de datos o en DEMO_USERS.
  3. Contraseñas protegidas y reseteos persistidos en sysget_user_passwords.

---

### 🔴 ISSUE 3: Recursión Infinita RLS en Supabase y Endpoint Serverless (/api/users.ts)
* **Síntoma / Problema**: Error 42P17 (infinite recursion detected in policy for relation "perfiles") al consultar usuarios desde el cliente Supabase.
* **Causa Raíz**: Las políticas Row Level Security (RLS) en PostgreSQL consultaban la misma tabla perfiles para validar si el uth.uid() era administrador, generando un bucle recursivo.
* **Solución de Ingeniería**:
  1. Creación de una API Serverless /api/users.ts ejecutada en backend seguro.
  2. Uso de la SUPABASE_SERVICE_ROLE_KEY en el servidor para eludir el bloqueo RLS de lectura de administradores.
  3. Integración de envío de correos de aprobación de usuarios mediante **Google SMTP** (
odemailer vía Gmail) con token de 1-clic.

---

### 🔴 ISSUE 4: Diagramación del Motor de Impresión PDF y Reglas OMR (@media print)
* **Síntoma / Problema**:
  1. El cuadernillo impreso cortaba preguntas y alternativas a la mitad de la página.
  2. Aparecían hojas en blanco huérfanas al final del documento.
  3. La hoja de respuestas ópticas se desbordaba a 2 páginas.
* **Solución de Ingeniería**:
  1. En src/components/PrintEvaluacionModal.tsx se implementaron directivas CSS @media print de flujo continuo:
     * page-break-inside: avoid / reak-inside: avoid sobre .print-pregunta-block.
     * page-break-before: always exclusivamente en la portada, hoja de respuestas y pauta docente.
  2. Hoja de respuestas rediseñada en **4 columnas compactas de burbujas**, asegurando que 35 preguntas quepan exactamente en **1 sola página A4/Carta**.
  3. Eliminación de inyección de alumnos ficticios en la pestaña *"2. Por Alumno"*.

---

### 🔴 ISSUE 5: El Bug de las 65 Preguntas (Fuga Cruzada de Ítems en Evaluaciones)
* **Síntoma / Problema**: Al abrir "Ver Ítems" o "Imprimir" del ensayo de 30 preguntas de Junio 2026, la vista desplegaba 65 preguntas continuas (mezclando preguntas de Agosto y Junio).
* **Causa Raíz**: El filtro en los modales contenía la condición:
  \text{preguntas} = \text{banco.filter}(p \implies \text{prueba.preguntasIds.includes}(p.id) \;\mathbf{||}\; p.asignaturaId === \text{prueba.asignaturaId})
  El operador || arrastraba todas las preguntas de la materia en el banco.
* **Solución de Ingeniería**:
  1. Se eliminó la cláusula disyuntiva en PruebaFacsimilModal.tsx, PrintEvaluacionModal.tsx, IngresoRespuestasModal.tsx y App.tsx.
  2. Mapeo estricto por diccionario indexado:
     `	ypescript
     const byId = new Map(banco.map(p => [p.id, p]));
     const exactQuestions = prueba.preguntasIds.map(id => byId.get(id)).filter(Boolean);
     `
  3. Garantía absoluta: Cada ensayo entrega exactamente sus **30 preguntas oficiales**.

---

### 🔴 ISSUE 6: Mezcla Curricular en el Banco de Preguntas (Organización por Nivel Escolar)
* **Síntoma / Problema**: El Banco de Lenguaje mostraba 95 preguntas mezclando 2° Medio (90) con 8° Básico (5), distorsionando los KPIs de selección múltiple y desarrollo.
* **Solución de Ingeniería**:
  1. En src/pages/BancoPreguntasPage.tsx se construyó un selector visual de pestañas por **Curso / Nivel Escolar** (2° Medio, 8° Básico, 6° Básico, Todos los Cursos).
  2. Recálculo dinámico de KPIs: Al seleccionar 2° Medio, los contadores reflejan con exactitud matemática:
     * Total: **90** | Selección Múltiple: **88** | Desarrollo: **2** | Oficiales: **90**.
  3. Inyección automática del nivel activo en el formulario de creación PreguntaFormModal.tsx.

---

### 🔴 ISSUE 7: Ruteo del Modo Sandbox hacia Admin Demo
* **Síntoma / Problema**: Al pulsar la tarjeta "Admin / UTP" en el banner de Sandbox de la Landing Page, la sesión abría el panel de Producción de la Escuela Premilitar en lugar del panel simulado del Liceo Bicentenario.
* **Causa Raíz**: switchRole('admin') no recibía el contexto de ejecución y leía la sesión de localStorage, asignando currentUserAdmin (leontestvirtual1@gmail.com).
* **Solución de Ingeniería**:
  1. Extensión de la firma: switchRole(role, extra?: 'demo' | 'prod' | ...).
  2. En el Sandbox de LandingPage.tsx, la tarjeta invoca explícitamente switchRole('admin', 'demo'), asignando sin excepción a **currentUserAdminDemo** (dmin@escuelademo.cl / Liceo Bicentenario, 261 pts proyectados).
  3. Al volver de supervisión docente en Producción, Sidebar.tsx invoca switchRole('admin', 'prod').

---

## 📊 4. Integración de la Línea Base SIMCE (Agencia de Calidad)

Se estructuró el módulo SimceHistoricoPremilSection.tsx alimentado por simceHistoricoPremilData.ts con la información oficial de la Escuela Premilitar (RBD 31030-1, Lenguaje II Medio):

`
Agencia de Calidad (2016-2025) ──> simceHistoricoPremilData.ts ──> SimceHistoricoPremilSection.tsx
                                                                         │
                                       ┌─────────────────────────────────┼─────────────────────────────────┐
                                       ▼                                 ▼                                 ▼
                              📈 Tendencia GSE                  🎯 Niveles Aprendizaje             👥 Brecha Género
                            (194 a 219 pts vs 240)             (Insuficiente: 83.7% a 72.0%)      (👩 230 vs 👨 213 pts)
`

---

## 🚀 5. Procedimiento de Instalación, Configuración y Despliegue desde Cero

### 1. Clonación del Repositorio
`ash
git clone https://github.com/leontestvirtual1-sketch/proyecto-evaluaciones-nacionales.git
cd proyecto-evaluaciones-nacionales
`

### 2. Instalación de Dependencias
`ash
npm install
`

### 3. Configuración de Variables de Entorno (.env.local)
`nv
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=leontestvirtual1@gmail.com
SMTP_PASS=tu-app-password-de-google
`

### 4. Verificación de Tipos TypeScript
`ash
npx tsc --noEmit
`
*(Debe retornar código de salida 0 sin ningún error).*

### 5. Ejecución en Entorno Local de Desarrollo
`ash
npm run dev
`
Acceso local en: http://localhost:5173.

### 6. Despliegue a Producción (Vercel)
1. Conectar el repositorio de GitHub en [Vercel Dashboard](https://vercel.com).
2. Configurar las variables de entorno en *Project Settings ➔ Environment Variables*.
3. Cada git push origin main realiza un build y despliegue automático de producción.

---

## 📌 6. Resumen de Archivos Clave del Código Fuente

| Archivo | Responsabilidad Principal |
| :--- | :--- |
| [src/App.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/App.tsx) | Enrutador raíz, control de sesión de ambientes (Demo/Prod), persistencia y runner de evaluación. |
| [src/context/AuthContext.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/context/AuthContext.tsx) | Proveedor de autenticación, control de roles (switchRole), hardening de login y gestión de docentes. |
| [src/components/ProfesorDashboard.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/ProfesorDashboard.tsx) | Dashboard principal con vistas aisladas para Producción (Línea Base SIMCE) y Demo (Mapa de calor PME). |
| [src/components/SimceHistoricoPremilSection.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/SimceHistoricoPremilSection.tsx) | Componente visual interactivo con gráficos Recharts de la Agencia de Calidad de la Educación. |
| [src/pages/BancoPreguntasPage.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/pages/BancoPreguntasPage.tsx) | Banco de reactivos con filtrado estricto por Nivel Escolar y recálculo de métricas. |
| [src/components/PrintEvaluacionModal.tsx](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/components/PrintEvaluacionModal.tsx) | Motor de diagramación PDF para cuadernillos, pautas docentes y hojas de respuesta OMR de 1 página. |
| [src/data/simceHistoricoPremilData.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/simceHistoricoPremilData.ts) | Datos históricos oficiales del SIMCE para la Escuela Premilitar (2016–2025). |
| [src/data/len2mAbrilQuestionsMock.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mAbrilQuestionsMock.ts) | Ensayo SIMCE Lenguaje 2° Medio — Abril 2026 (30 preguntas, 6 lecturas). |
| [src/data/len2mJunioQuestionsMock.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/data/len2mJunioQuestionsMock.ts) | Ensayo SIMCE Lenguaje 2° Medio — Junio 2026 (30 preguntas, 4 lecturas). |
| [DIRECTIVAS.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/DIRECTIVAS.md) | Directivas oficiales y mandatorias de arquitectura y desarrollo del sistema. |
| [BITACORA.md](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/BITACORA.md) | Registro histórico cronológico de tareas, soluciones técnicas y commits realizados. |

---
*Sysget Saber © 2026 — Documentación Oficial de Ingeniería de Software.*
