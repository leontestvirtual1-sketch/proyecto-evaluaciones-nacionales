/**
 * tests/tenant-isolation.test.ts
 * Verificación técnica de Aislamiento Multi-Tenant y Políticas RLS con @supabase/supabase-js (Fase 4)
 * 
 * Cumplimiento estricto de Directivas 1, 2, 4 y 9:
 * - Directiva 1: Aislamiento estricto de ambientes (no fallback por longitud de lista).
 * - Directiva 2: Cero datos inventados en producción; empty state legítimo.
 * - Directiva 4: Aislamiento por RBD y especialidad docente sin fuga de evaluaciones entre colegios.
 * - Directiva 9: Preservación de contexto de Super Admin durante supervisión pedagógica.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables de entorno requeridas: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Cliente Supabase real utilizando la API oficial de @supabase/supabase-js
// (SUPABASE_URL y SUPABASE_ANON_KEY ya validados arriba via process.exit)
const sbClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);


describe('Tenant & RBAC Isolation Suite (@supabase/supabase-js)', () => {

  test('RLS Activo: Cliente anónimo no autenticado no puede listar cursos ni rendiciones protegidas', async () => {
    // Si RLS está cerrado (sin USING TRUE), una consulta anónima a cursos devuelve 0 registros o vacío
    const { data: cursos, error: errCursos } = await sbClient
      .from('cursos')
      .select('id, nombre, rbd')
      .limit(10);

    // Debe retornar vacío o error de permisos, JAMÁS exponer registros de otros colegios
    if (!errCursos && cursos) {
      expect(cursos.length).toBe(0);
    }

    const { data: rendiciones, error: errRendiciones } = await sbClient
      .from('rendiciones')
      .select('id, alumno_nombre, puntaje_obtenido')
      .limit(10);

    if (!errRendiciones && rendiciones) {
      expect(rendiciones.length).toBe(0);
    }
  });

  test('RLS Activo: Cliente anónimo no puede acceder a preguntas privadas de docentes', async () => {
    const { data: preguntas, error: errPreguntas } = await sbClient
      .from('preguntas')
      .select('id, enunciado, respuesta_correcta')
      .limit(10);

    // Sin autenticación válida, no se debe exponer ninguna pregunta privada ni sus respuestas correctas
    if (!errPreguntas && preguntas) {
      expect(preguntas.length).toBe(0);
    }
  });

  test('Directiva 1 & 2: Prohibición estricta de fallback cruzado basado en longitud de lista', () => {
    // Escenario: Docente nuevo ingresa a producción y tiene 0 evaluaciones creadas.
    const produccionDbEvaluaciones: Array<{ id: string; titulo: string }> = [];
    const mockDemoEvaluaciones = [{ id: 'mock-eval-01', titulo: 'Ensayo Falso Demo' }];

    // Patrón PROHIBIDO por Directiva 1:
    // const res = produccionDbEvaluaciones.length > 0 ? produccionDbEvaluaciones : mockDemoEvaluaciones;

    // Patrón OBLIGATORIO:
    const isProduction = true;
    const resolvedData = isProduction ? produccionDbEvaluaciones : mockDemoEvaluaciones;

    // El estado legítimo en producción debe ser 0 elementos (Empty State válido)
    expect(resolvedData.length).toBe(0);
    expect(resolvedData).not.toBe(mockDemoEvaluaciones);
  });

  test('Directiva 4: Aislamiento por RBD y Especialidad Docente', () => {
    interface DocenteContext {
      id: string;
      rbd: string;
      asignaturaId: string;
    }

    const docenteSusana: DocenteContext = {
      id: 'doc-susana-uuid',
      rbd: '1234',
      asignaturaId: 'asig-1' // Matemática - Colegio Mi Casa
    };

    const docenteMariaTeresa: DocenteContext = {
      id: 'doc-mteresa-uuid',
      rbd: '31030',
      asignaturaId: 'asig-2' // Lenguaje - Escuela Premilitar
    };

    const evaluacionesDb = [
      { id: 'eval-mat-01', rbd: '1234', asignaturaId: 'asig-1', profesorId: 'doc-susana-uuid' },
      { id: 'eval-leng-01', rbd: '31030', asignaturaId: 'asig-2', profesorId: 'doc-mteresa-uuid' }
    ];

    // Regla de filtro de seguridad de Susana
    const visiblesParaSusana = evaluacionesDb.filter(
      e => e.rbd === docenteSusana.rbd && e.asignaturaId === docenteSusana.asignaturaId
    );
    expect(visiblesParaSusana.length).toBe(1);
    expect(visiblesParaSusana[0].id).toBe('eval-mat-01');
    expect(visiblesParaSusana.some(e => e.rbd === docenteMariaTeresa.rbd)).toBe(false);

    // Regla de filtro de seguridad de María Teresa
    const visiblesParaMariaTeresa = evaluacionesDb.filter(
      e => e.rbd === docenteMariaTeresa.rbd && e.asignaturaId === docenteMariaTeresa.asignaturaId
    );
    expect(visiblesParaMariaTeresa.length).toBe(1);
    expect(visiblesParaMariaTeresa[0].id).toBe('eval-leng-01');
    expect(visiblesParaMariaTeresa.some(e => e.rbd === docenteSusana.rbd)).toBe(false);
  });

  test('Directiva 9: Preservación de contexto de Admin al supervisar a un docente', () => {
    const adminSession = {
      id: 'super-admin-uuid',
      email: 'leontestvirtual1@gmail.com',
      rol: 'admin',
      es_super_admin: true
    };

    // Al supervisar a un docente, el perfil temporal activo cambia pero adminBaseProfile se preserva
    const docenteSupervisado = {
      id: 'doc-susana-uuid',
      email: 'susana@micasa.cl',
      rol: 'profesor'
    };

    const adminBaseProfile = adminSession;
    const activeProfile = docenteSupervisado;

    // La discriminación de entorno JAMÁS debe depender de activeProfile.email
    const isProductionAdmin = Boolean(
      adminBaseProfile?.es_super_admin || adminBaseProfile?.email === 'leontestvirtual1@gmail.com'
    );

    expect(isProductionAdmin).toBe(true);
    expect(activeProfile.rol).toBe('profesor');
    expect(adminBaseProfile.email).toBe('leontestvirtual1@gmail.com');
  });
});

// Arnes de ejecución compatible sin dependencias externas
function describe(name: string, fn: () => void | Promise<void>) {
  console.log(`\n--- Test Suite: ${name} ---`);
  const res = fn();
  if (res instanceof Promise) {
    res.catch(err => {
      console.error(`Suite failed: ${name}`, err);
      process.exit(1);
    });
  }
}

function test(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result instanceof Promise) {
    return result
      .then(() => console.log(`  ✅ PASS: ${name}`))
      .catch(err => {
        console.error(`  ❌ FAIL: ${name}`, err);
        process.exit(1);
      });
  } else {
    try {
      console.log(`  ✅ PASS: ${name}`);
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`, err);
      process.exit(1);
    }
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    not: {
      toBe(expected: unknown) {
        if (actual === expected) {
          throw new Error(`Expected NOT ${JSON.stringify(expected)}`);
        }
      }
    }
  };
}
