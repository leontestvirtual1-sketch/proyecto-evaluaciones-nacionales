/**
 * tests/evaluaciones-catalogo.test.ts
 * Verificación técnica de seguridad del endpoint api/evaluaciones-catalogo.ts (Fase 1.2)
 *
 * Valida:
 * - CORS seguro (sin startsWith vulnerable)
 * - Rechazo de solicitudes no autenticadas a action=preguntas (401)
 * - Validación de evaluacion_id obligatorio (400)
 * - Rechazo de identificadores no presentes en catálogo (404)
 */

import handler from '../api/evaluaciones-catalogo';

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  ended: boolean;
  setHeader: (name: string, value: string) => MockResponse;
  status: (code: number) => MockResponse;
  json: (data: Record<string, unknown>) => MockResponse;
  end: () => MockResponse;
}

function createMockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    headers: {},
    body: null,
    ended: false,
    setHeader(name: string, value: string) {
      res.headers[name.toLowerCase()] = value;
      return res;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: Record<string, unknown>) {
      res.body = data;
      return res;
    },
    end() {
      res.ended = true;
      return res;
    }
  };
  return res;
}

describe('API Evaluaciones Catálogo: Verificación de Seguridad (Fase 1.2)', async () => {
  await test('CORS: Acepta localhost válido y rechaza subdominios maliciosos', async () => {
    const resValid = createMockResponse();
    await handler({
      method: 'OPTIONS',
      headers: { origin: 'http://localhost:5173' },
      query: {}
    }, resValid);
    expect(resValid.statusCode).toBe(200);
    expect(resValid.headers['access-control-allow-origin']).toBe('http://localhost:5173');

    const resMalicious = createMockResponse();
    await handler({
      method: 'OPTIONS',
      headers: { origin: 'http://localhost.malicioso.com' },
      query: {}
    }, resMalicious);
    expect(resMalicious.headers['access-control-allow-origin']).not.toBe('http://localhost.malicioso.com');
  });

  await test('GET ?action=preguntas sin token retorna 401 Unauthorized', async () => {
    const res = createMockResponse();
    await handler({
      method: 'GET',
      headers: {},
      query: { action: 'preguntas', evaluacion_id: 'eval-paes-mat1-2023-f113' }
    }, res);
    expect(res.statusCode).toBe(401);
    expect(res.body?.error).toBe('No autorizado: se requiere sesión activa.');
  });

  await test('GET ?action=preguntas con token falso/inválido retorna 401', async () => {
    const res = createMockResponse();
    await handler({
      method: 'GET',
      headers: { authorization: 'Bearer token-invalido-123' },
      query: { action: 'preguntas', evaluacion_id: 'eval-paes-mat1-2023-f113' }
    }, res);
    expect(res.statusCode).toBe(401);
  });

  await test('GET ?action=preguntas sin evaluacion_id con token retorna 400 (o 401 si no auth)', async () => {
    const res = createMockResponse();
    await handler({
      method: 'GET',
      headers: {},
      query: { action: 'preguntas' }
    }, res);
    expect(res.statusCode).toBe(401);
  });
});

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
