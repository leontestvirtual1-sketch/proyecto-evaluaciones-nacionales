---
name: evaluaciones-academicas-suite
description: Estándares arquitectónicos, patrones UI/UX y flujos de la suite de Evaluaciones Nacionales SIMCE y PAES (Sysget Saber), incluyendo motor de impresión aislado, modales compactos responsivos, catálogo de especialidades y pautas pedagógicas.
---

# 🎓 Skill: Suite de Evaluaciones Académicas Nacionales & SIMCE (Sysget Saber)

Este skill define los estándares técnicos, patrones de diseño de interfaz y flujos operativos para el desarrollo y mantenimiento de la plataforma **Sysget Saber**.

---

## 1. 🖨️ Motor de Impresión Aislada y Generación de PDF

### Aislamiento Absoluto de Impresión (Zero Leakage)
1. **Montaje en React Portal**: Todo componente o modal imprimible (`PrintEvaluacionModal`, fichas remediales) debe montarse en `document.body` mediante `createPortal(modalContent, document.body)` con la clase `print-modal-portal`.
2. **Ocultamiento Total de `#root`**:
   ```css
   @media print {
     body:has(.print-modal-portal) #root,
     #root.printing-modal-active {
       display: none !important;
     }
   }
   ```
   > **Regla crítica:** Usar `display: none` en `#root`, **nunca** `visibility: hidden`, para que los elementos superiores no ocupen espacio ni generen hojas en blanco al inicio.
3. **Nombre de Archivo PDF Dinámico**:
   Antes de llamar a `window.print()`, establecer `document.title` con el formato:
   `[Título de la Evaluación] - [Modalidad de Documento] ([Curso])`
   Y restaurar el título original 1000ms después.

---

## 2. 📐 Estándar de Modales Responsivos y Compactos

### Principios de Dimensionamiento (Zero Vertical Clipping)
- **Ancho Óptimo**: `max-w-xl` o `max-w-2xl` con márgenes `my-auto` y `max-h-[92vh]`.
- **Diseño en 2 Columnas**: Distribuir formularios de más de 4 campos en una grilla de 2 columnas (`grid grid-cols-1 sm:grid-cols-2 gap-2.5`) para mantener la altura total por debajo de **350px**.
- **Padding y Densidad**:
  - Inputs: `py-1.5 px-2.5 text-xs rounded-lg` (altura ~32-34px).
  - Labels: `text-[10px] font-bold text-slate-500 uppercase tracking-wider`.
  - Header & Footer: `pb-2.5 mb-2.5` y `pt-2.5 mt-2.5 border-t`.
- **Sincronización de Estado en Edición**:
  Siempre incluir `useEffect` para sincronizar el estado local cuando cambia la entidad a editar o la visibilidad del modal:
  ```tsx
  useEffect(() => {
    if (editingItem) {
      setForm({ ...editingItem });
    } else {
      setForm(initialState);
    }
  }, [editingItem, isOpen]);
  ```

---

## 3. 📚 Catálogo Curricular y Especialidades Docentes

### Jerarquía de Datos
1. **Asignaturas / Especialidades**: Código oficial (`MAT`, `LEN`, `CN`, `HIST`, `ING`, etc.) + Nombre + Ícono identificador.
2. **Ejes Temáticos**: Contenidos curriculares vinculados a cada asignatura (ej. *Números y Operaciones*, *Álgebra*, *Comprensión Lectora*).
3. **Habilidades Cognitivas / Psicométricas**: *Conocimiento*, *Aplicación*, *Razonamiento / Análisis*.

### Gestión Global y Aislamiento Docente
- Las especialidades se gestionan en **Configuración Global** (`ConfiguracionPage.tsx`) con opción de carga rápida de asignaturas oficiales MINEDUC en 1-clic.
- Los profesores quedan vinculados a su `asignaturaId`, permitiendo al Admin UTP monitorear el avance general y a cada docente enfocarse en su área.
