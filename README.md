# 🎓 Sysget Saber — Plataforma de Evaluaciones (Chile)

Sistema web de **Evaluaciones y Ensayos Académicos** denominado **Sysget Saber**, diseñado para colegios y establecimientos educacionales en Chile. Permite a los profesores generar ensayos adaptados al currículum nacional (por Asignatura, Eje Temático y Habilidad Cognitiva), asignarlos a sus cursos, recibir las respuestas en tiempo real y acceder a un **Reporte Tabulado Inteligente** con **Planes de Acción de Reforzamiento** autogenerados.

---

## 🌟 Características Principales

### 👨‍🏫 1. Portal Docente (Profesor)
- **Dashboard de Métricas Key**: Mapeo visual de porcentaje de logro promedio, puntajes estimados en Escala Nacional (100 a 350 pts) y estado de entregas.
- **Generador de Evaluaciones**: Wizard de 3 pasos para ensamblar evaluaciones configurando cantidad de preguntas y cobertura por Ejes Temáticos (Números, Álgebra, Geometría, Probabilidades, Lectura) y Habilidades Cognitivas (Comprender, Aplicar, Razonar, Localizar, Reflexionar).
- **Códigos de Invitación de Evaluación**: Generación instantánea de códigos públicos (ej. `EVAL-8A-MAT`) para compartir con los estudiantes.

### 📊 2. Tabulación & Plan de Acción de Reforzamiento Autogenerado
- **Matriz por Alumno**: Visualización tabulada de puntajes, porcentaje de aciertos y estado de cada estudiante.
- **Gráficos por Eje Temático**: Identificación gráfica con código de colores (*Óptimo*, *Alerta*, *Crítico*).
- **Análisis de Preguntas Frecuentes**: Diagnóstico psicométrico de las preguntas con mayor porcentaje de error y su distractor principal.
- **Plan de Reforzamiento Pedagógico**: Generación automática de diagnósticos de error, sugerencias metodológicas para el profesor y recomendaciones de guías/ejercicios para nivelar al curso.

### 👨‍🎓 3. Portal de Estudiantes (Alumno)
- **Ingreso con Código o Selección de Evaluación Asignada**.
- **Módulo de Rendición en Vivo**:
  - Temporizador con cuenta regresiva.
  - Barra de progreso.
  - Navegador de preguntas (respondidas / pendientes).
  - Hoja de respuestas limpia para opciones múltiples y justificaciones de desarrollo escrito.
- **Retroalimentación Post-Envío**: Resultados inmediatos con estimación de puntaje.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Next.js / Vite, TypeScript.
- **Estilos & UI/UX**: Tailwind CSS, Lucide Icons, Glassmorphic Design, Modo Oscuro / Claro.
- **Base de Datos & Backend (Preparado)**: Supabase (PostgreSQL + Auth + Row Level Security).

---

## ⚙️ Configuración Multi-Colegio (White-Label)

Para desplegar esta misma aplicación en distintos colegios o establecimientos educacionales, simplemente edita el archivo [.env.local](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/.env.local) o modifica [src/config/appConfig.ts](file:///c:/Proyectos/Proyecto%20Evaluaciones%20Nacionales/src/config/appConfig.ts):

```env
# Personalización por Colegio
VITE_NOMBRE_ESTABLECIMIENTO="Colegio Bicentenario San Gabriel"
VITE_ESTABLECIMIENTO_RBD="12345-6"
VITE_ESTABLECIMIENTO_COMUNA="Santiago"

# Conexión a Supabase
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Toda la interfaz (Navbar, Sidebar, perfiles de profesores, estudiantes y encabezados de los reportes tabulados) heredará automáticamente la marca del colegio configurado.

---

## 🚀 Guía de Instalación y Ejecución Local

### Requisitos Previos
- Node.js 18+ (recomendado v20+ o v24+)
- npm o pnpm

### Pasos

1. **Clonar e instalar dependencias**:
   ```bash
   cd "c:\Proyectos\Proyecto Evaluaciones Nacionales"
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   # O con pnpm:
   pnpm dev
   ```
   Abre tu navegador en [http://localhost:3000](http://localhost:3000).

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🗄️ Estructura del Proyecto

```
c:/Proyectos/Proyecto Evaluaciones Nacionales/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Navegación y cambio de rol (Profesor/Alumno)
│   │   ├── StatCard.tsx                 # Tarjetas de métricas y KPI
│   │   ├── ProfesorDashboard.tsx        # Dashboard del docente
│   │   ├── EvaluacionGeneratorModal.tsx # Generador de evaluaciones
│   │   ├── ReporteTabuladoView.tsx      # Reporte tabulado y Plan de Reforzamiento
│   │   ├── AlumnoPortal.tsx             # Portal del estudiante
│   │   └── AlumnoEvaluationView.tsx     # Runner de rendición en vivo
│   ├── data/
│   │   └── mockData.ts                  # Banco de preguntas, ejes, habilidades y datos de prueba
│   ├── types/
│   │   └── index.ts                     # Interfaces TypeScript del sistema
│   ├── App.tsx                          # Controlador principal
│   ├── main.tsx                         # Punto de entrada React
│   └── index.css                        # Estilos globales y Tailwind CSS
├── index.html                           # Plantilla HTML5
├── package.json                         # Dependencias y scripts
├── tailwind.config.js                   # Tokens de diseño y colores
└── vite.config.ts                       # Configuración de Vite
```
