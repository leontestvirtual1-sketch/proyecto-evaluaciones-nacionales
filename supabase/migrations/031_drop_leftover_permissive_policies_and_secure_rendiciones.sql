-- ==============================================================================
-- Migración 031: Cierre definitivo de políticas RLS residuales y blindaje de rendiciones
-- Fecha: 2026-08-23
-- 
-- 1. Elimina políticas permisivas históricas en public.perfiles
-- 2. Elimina políticas permisivas históricas en public.preguntas
-- 3. Elimina política FOR ALL en public.rendiciones (previene inyección de puntajes desde cliente)
-- ==============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. BLINDAJE DE TABLA public.perfiles
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Perfiles lectura segura" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura por autenticados" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles lectura autorizada" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles visibles segun pertenencia academica" ON public.perfiles;
DROP POLICY IF EXISTS "Perfiles propios o admin" ON public.perfiles;

-- Política definitiva: Cada usuario lee su propio perfil, o admin lee todos
CREATE POLICY "perfiles_select_estricto"
  ON public.perfiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR public.is_admin()
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. BLINDAJE DE TABLA public.preguntas
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Preguntas lectura segura" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas visibles por docente de su materia o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas lectura propietario o admin" ON public.preguntas;
DROP POLICY IF EXISTS "Docentes y admin leen preguntas" ON public.preguntas;
DROP POLICY IF EXISTS "Preguntas lectura publica" ON public.preguntas;

-- Política definitiva: Solo el docente propietario o el administrador pueden leer sus preguntas con clave
CREATE POLICY "preguntas_select_estricto"
  ON public.preguntas FOR SELECT
  TO authenticated
  USING (
    propietario_id = auth.uid()
    OR public.is_admin()
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. BLINDAJE DE TABLA public.rendiciones
-- ─────────────────────────────────────────────────────────────────────────────
-- Eliminar política FOR ALL sin WITH CHECK que permitía a alumnos insertar/modificar puntajes
DROP POLICY IF EXISTS "Alumnos ven y gestionan sus propias rendiciones" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones lectura alumno" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones insercion docente o admin" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones gestion completa docente o admin" ON public.rendiciones;
DROP POLICY IF EXISTS "Rendiciones acceso docente" ON public.rendiciones;

ALTER TABLE public.rendiciones ENABLE ROW LEVEL SECURITY;

-- 3.1 SELECT: El alumno solo puede LEER sus propias rendiciones (o el docente/admin de su colegio)
CREATE POLICY "rendiciones_select_estricto"
  ON public.rendiciones FOR SELECT
  TO authenticated
  USING (
    alumno_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = rendiciones.evaluacion_id
        AND e.profesor_id = auth.uid()
    )
  );

-- 3.2 INSERT/UPDATE/DELETE: Reservado exclusivamente para service_role (vía /api/grade-evaluation) y admin
CREATE POLICY "rendiciones_insert_admin_only"
  ON public.rendiciones FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "rendiciones_update_admin_only"
  ON public.rendiciones FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "rendiciones_delete_admin_only"
  ON public.rendiciones FOR DELETE
  TO authenticated
  USING (public.is_admin());

COMMIT;
