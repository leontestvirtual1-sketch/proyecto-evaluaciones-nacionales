# ADR 001: Aislamiento Multi-Tenant por RBD con Row Level Security (RLS) en Supabase

- **Estado**: Aceptado
- **Fecha**: 2026-09-17
- **Autores**: Equipo Sysget Saber
- **Mapeo de Directivas**: Directiva 1 (Aislamiento de Ambientes), Directiva 3 (Supabase First), Directiva 4 (RBAC Estricto), Directiva 10 (Zero Secrets)

---

## Contexto y Planteamiento del Problema

Sysget Saber opera como una plataforma multiescolar donde colegios municipales, particulares subvencionados y particulares pagados gestionan evaluaciones SIMCE y PAES. Cada establecimiento educacional en Chile está identificado de manera única por su **Rol Base de Datos (RBD)** otorgado por el MINEDUC.

El desafío fundamental es garantizar que:
1. Ningún docente, directivo o estudiante de un colegio pueda tener visibilidad, acceso o capacidad de mutación sobre datos (alumnos, pruebas, rendiciones, pautas) de otro establecimiento (riesgo de IDOR y fuga multi-tenant).
2. Los docentes de asignaturas específicas (ej. Matemática) no accedan a instrumentos ni claves de otras especialidades (ej. Lenguaje o Ciencias).
3. Los usuarios administradores y digitadores OMR autorizados puedan registrar rendiciones físicas sin comprometer el aislamiento curricular.

## Opciones Consideradas

1. **Filtrado Exclusivo en Capa de Aplicación (Frontend/BFF)**:
   - *Pros*: Fácil de implementar inicialmente.
   - *Contras*: Extremadamente vulnerable a bypass de API, llamadas directas al endpoint de Supabase o inyecciones desde la consola del navegador. Viola el principio de defensa en profundidad.

2. **Bases de Datos Separadas por Colegio (Database-per-tenant)**:
   - *Pros*: Aislamiento físico absoluto.
   - *Contras*: Costos de infraestructura desproporcionados, sobrecarga de mantenimiento de migraciones para cientos de colegios y complejidad en agregación de benchmarking SIMCE nacional.

3. **Multi-Tenancy Compartido con Row Level Security (RLS) en PostgreSQL/Supabase (Opción Elegida)**:
   - *Pros*: Aislamiento forzado a nivel de motor relacional de base de datos. Toda consulta SQL ejecutada con el token JWT del usuario (`auth.uid()`) evalúa automáticamente políticas RLS basadas en su RBD y rol en la tabla `perfiles`. Imposible de eludir desde el cliente.
   - *Contras*: Requiere funciones de seguridad declarativas (`SECURITY DEFINER`) cuidadosamente diseñadas para evitar recursión y garantizar rendimiento.

## Decisión

Se adopta la arquitectura **Supabase RLS Multi-Tenant por RBD**:

1. **Función Central de Identidad de RBD**:
   Se implementa la función `current_user_rbd()` en PostgreSQL con `SECURITY DEFINER` y `SET search_path = public`, la cual extrae el RBD del usuario autenticado directamente de `public.perfiles`:
   ```sql
   CREATE OR REPLACE FUNCTION public.current_user_rbd()
   RETURNS text
   LANGUAGE sql
   STABLE
   SECURITY DEFINER
   SET search_path = public
   AS $$
     SELECT rbd FROM public.perfiles WHERE id = auth.uid();
   $$;
   ```

2. **Políticas RLS en `rendiciones`**:
   - **Lectura**: Solo permitida si el `rbd` de la rendición coincide con `current_user_rbd()`, o si el usuario es Super Admin.
   - **Inserción/Modificación**: Permitida para administradores del RBD, el docente creador de la evaluación (`evaluaciones.profesor_id = auth.uid()`), o digitadores asignados a ese RBD.

3. **Aislamiento en `preguntas` y `evaluaciones`**:
   - Preguntas institucionales filtradas por el RBD del establecimiento.
   - Banco central oficial MINEDUC/DEMRE en modo de solo lectura para todos los docentes según su especialidad.

## Consecuencias

### Positivas
- **Seguridad Rigurosa**: Protección garantizada contra IDOR (Insecure Direct Object Reference) y fugas entre colegios.
- **Cumplimiento Normativo**: Alineado con los requerimientos de protección de datos de estudiantes menores de edad y gobernanza MINEDUC.
- **Trazabilidad**: Toda operación queda asociada al `auth.uid()` del usuario real y su establecimiento.

### Negativas / Mitigaciones
- **Sobrecarga de Evaluación RLS**: Se mitiga indexando las columnas `rbd`, `profesor_id` y `prueba_id` en PostgreSQL para asegurar tiempos de respuesta < 20 ms.
- **Sesiones de Supervisión**: Los administradores generales que supervisan docentes deben preservar el contexto de producción según la Directiva 9.
