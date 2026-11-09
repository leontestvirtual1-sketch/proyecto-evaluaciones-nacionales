/**
 * tests/verify-student-access.test.ts
 * 
 * Tests de Verificación para Nivel 1: Validación de RUT Oficial para Estudiantes
 * 
 * Verifica:
 * 1. Formato y sanitización de RUT (con y sin puntos/guion, K mayúscula/minúscula).
 * 2. Validación de pertenencia a nómina oficial (Florencia, Ignacia, estudiantes demo).
 * 3. Rechazo de RUTs inexistentes o que no pertenecen a la nómina.
 * 4. Consistencia entre el email asignado y el RUT ingresado (mitigación de suplantación).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { cleanRut, formatRut } from '../api/verify-student-access';

function createMockReqRes(method: string, body: any, headers: Record<string, string> = {}) {
  const req = {
    method,
    body,
    headers: { origin: 'https://sysget-saber.vercel.app', ...headers }
  };

  let statusCode = 200;
  let responseData: any = null;
  const resHeaders: Record<string, string> = {};

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
    setHeader(name: string, value: string) {
      resHeaders[name] = value;
      return this;
    },
    end() {
      return this;
    },
    _getData: () => responseData,
    _getStatusCode: () => statusCode
  };

  return { req, res };
}

test('--- Suite: Nivel 1 Validación de RUT Oficial Estudiante ---', async (t) => {

  await t.test('cleanRut: normaliza correctamente formatos con puntos, guiones y espacios', () => {
    assert.equal(cleanRut('23.386.193-6'), '233861936');
    assert.equal(cleanRut('23386193-6'), '233861936');
    assert.equal(cleanRut(' 233861936 '), '233861936');
    assert.equal(cleanRut('12.345.678-k'), '12345678K');
  });

  await t.test('formatRut: aplica formato con puntos y guion', () => {
    assert.equal(formatRut('233861936'), '23.386.193-6');
    assert.equal(formatRut('233158755'), '23.315.875-5');
  });

  await t.test('POST sin RUT retorna 400 Bad Request', async () => {
    const { req, res } = createMockReqRes('POST', {
      codigo: 'PAES-M1-2026-F113',
      rut: ''
    });

    await handler(req, res);
    assert.equal(res._getStatusCode(), 400);
    assert.equal(res._getData().ok, false);
  });

  await t.test('POST con RUT no perteneciente a nómina retorna 403 Forbidden', async () => {
    const { req, res } = createMockReqRes('POST', {
      codigo: 'PAES-M1-2026-F113',
      rut: '99.999.999-9'
    });

    await handler(req, res);
    assert.equal(res._getStatusCode(), 403);
    assert.equal(res._getData().ok, false);
    assert.match(res._getData().error, /no coincide/i);
  });

  await t.test('POST con RUT válido de Florencia León retorna 200 y datos del estudiante', async () => {
    const { req, res } = createMockReqRes('POST', {
      codigo: 'PAES-M1-2026-F113',
      rut: '23.315.875-5',
      email: 'florenciaangelicaleonpizarro@gmail.com'
    });

    await handler(req, res);
    assert.equal(res._getStatusCode(), 200);
    const data = res._getData();
    assert.equal(data.ok, true);
    assert.match(data.alumno.nombre, /florencia/i);
    assert.equal(cleanRut(data.alumno.rut), '233158755');
  });

  await t.test('POST con RUT válido de Ignacia León retorna 200 y datos del estudiante', async () => {
    const { req, res } = createMockReqRes('POST', {
      codigo: 'PAES-M1-2026-F113',
      rut: '233861936',
      email: 'ignaciaandrealeonpizarro@gmail.com'
    });

    await handler(req, res);
    assert.equal(res._getStatusCode(), 200);
    const data = res._getData();
    assert.equal(data.ok, true);
    assert.match(data.alumno.nombre, /ignacia/i);
    assert.equal(cleanRut(data.alumno.rut), '233861936');
  });

  await t.test('Mitigación de suplantación: RUT de otra alumna con email de Florencia retorna 403', async () => {
    const { req, res } = createMockReqRes('POST', {
      codigo: 'PAES-M1-2026-F113',
      rut: '23.386.193-6', // RUT de Ignacia
      email: 'florenciaangelicaleonpizarro@gmail.com' // Email de Florencia
    });

    await handler(req, res);
    assert.equal(res._getStatusCode(), 403);
    assert.equal(res._getData().ok, false);
    assert.match(res._getData().error, /pertenece a otro estudiante/i);
  });
});
