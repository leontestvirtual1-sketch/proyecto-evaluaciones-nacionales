# Informe de Auditoría Adversarial RLS (Doubt-Driven Development)
**Referencia**: Migración `043_fix_rls_rendiciones_and_preguntas_rbd.sql` y `042`
**Fecha**: 17 de Septiembre, 2026
**Metodología**: `doubt-driven-development` (Cuestionamiento crítico y ataque conceptual)

---

## 🎯 Resumen Ejecutivo

Al someter a prueba adversarial las políticas RLS consolidadas en las migraciones `042` y `043`, se detectaron **3 vectores de falla y bloqueo operativo**:

| # | Vector | Severidad | Impacto |
|---|---|---|---|
| **V-01** | Exclusión del Profesor de Asignatura (`e.profesor_id`) en `rendiciones` | **ALTA (Bloqueo)** | Si el profesor de Matemática evalúa a 8° Básico pero no es el "profesor jefe", queda ciego y no puede ver ni calificar las rendiciones de su prueba. |
| **V-02** | Inserción de rendiciones restringida solo al alumno (`alumno_id = auth.uid()`) | **ALTA (Bloqueo)** | Los alumnos de educación básica rinden en papel. Los docentes digitan las hojas OMR en el modal. El docente queda bloqueado para insertar las rendiciones en cliente. |
| **V-03** | Inserción de preguntas huérfanas con RBD nulo | **MEDIA** | `rbd IS NOT DISTINCT FROM current_user_rbd()` evalúa `TRUE` si ambos son NULL, permitiendo preguntas sin colegio asignado. |

---

## 🔍 Análisis Detallado de Vectores

### Vector 1: El dilema del Profesor de Asignatura vs. Profesor Jefe
- **Código analizado en 042 / 043**:
  ```sql
  WHERE e.id = prueba_id
    AND (c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
  ```
- **Escenario Adversarial**: 
  1. Susana es profesora de Matemática (RBD 1234).
  2. Carlos es profesor jefe del 8° Básico (RBD 1234).
  3. Susana crea la prueba *"SIMCE Matemática 8° Básico"* (`evaluaciones.profesor_id = Susana`).
  4. Cuando Susana intenta consultar el dashboard de resultados (`SELECT FROM rendiciones`), la subconsulta evalúa si `Carlos = Susana` (FALSO) o si Susana es Admin (FALSO).
  5. **Resultado**: Susana no puede ver las notas de los alumnos de su propia prueba.
- **Mitigación**:
  ```sql
  AND (e.profesor_id = auth.uid() OR c.profesor_jefe_id = auth.uid() OR public.is_admin_of_rbd(c.rbd))
  ```

---

### Vector 2: La digitación docente de hojas de respuesta (OMR)
- **Código analizado en 043**:
  ```sql
  CREATE POLICY "Rendiciones insertables por alumno autenticado"
    ON public.rendiciones FOR INSERT
    WITH CHECK (alumno_id = auth.uid());
  ```
- **Escenario Adversarial**:
  1. En 4° Básico, los niños no ingresan con login a la plataforma.
  2. La profesora abre `IngresoRespuestasModal.tsx` para transcribir las respuestas de la hoja física de Juanito (`alumno_id = uuid_juanito`).
  3. La consulta de inserción lleva la sesión de la profesora (`auth.uid() = uuid_profesora`).
  4. La regla exige `uuid_juanito = uuid_profesora` (FALSO).
  5. **Resultado**: Error PostgreSQL 42501 (*new row violates row-level security policy*).
- **Mitigación**:
  Permitir INSERT si `alumno_id = auth.uid()` **O** si el usuario autenticado es el docente de la prueba (`e.profesor_id`), el jefe de curso (`c.profesor_jefe_id`) o el admin del RBD.

---

### Vector 3: Prevención de preguntas sin RBD
- **Mitigación**:
  Exigir en el `WITH CHECK` de inserción de preguntas que `rbd IS NOT NULL` y coincida con `public.current_user_rbd()` salvo que el usuario sea Super Admin (`es_super_admin = TRUE`).
