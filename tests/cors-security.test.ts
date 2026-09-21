import test from 'node:test';
import assert from 'node:assert/strict';
import { isOriginAllowed, setCorsHeaders } from '../api/_utils.js';

test('--- Test Suite: Verificación de Seguridad CORS (Fase 3.4) ---', async (t) => {
  const originalVercelEnv = process.env.VERCEL_ENV;
  const originalAppUrl = process.env.APP_URL;

  t.afterEach(() => {
    process.env.VERCEL_ENV = originalVercelEnv;
    process.env.APP_URL = originalAppUrl;
  });

  await t.test('En desarrollo: Acepta localhost y 127.0.0.1 con o sin puerto', () => {
    process.env.VERCEL_ENV = 'development';

    assert.equal(isOriginAllowed('http://localhost:5173'), true);
    assert.equal(isOriginAllowed('http://localhost:3000'), true);
    assert.equal(isOriginAllowed('http://localhost'), true);
    assert.equal(isOriginAllowed('http://127.0.0.1:8080'), true);
    assert.equal(isOriginAllowed('http://127.0.0.1'), true);
  });

  await t.test('Rechaza subdominios maliciosos que simulan localhost (anti-startsWith)', () => {
    process.env.VERCEL_ENV = 'development';

    assert.equal(isOriginAllowed('http://localhost.sitio-malo.com'), false);
    assert.equal(isOriginAllowed('http://localhost.attacker.io:5173'), false);
    assert.equal(isOriginAllowed('https://localhost.evil.com'), false);
    assert.equal(isOriginAllowed('http://127.0.0.1.malicious.com'), false);
  });

  await t.test('Acepta origen institucional de producción configurado en APP_URL', () => {
    process.env.APP_URL = 'https://sysget-saber.vercel.app';

    assert.equal(isOriginAllowed('https://sysget-saber.vercel.app'), true);
  });

  await t.test('Rechaza dominios de terceros no autorizados', () => {
    assert.equal(isOriginAllowed('https://random-site.com'), false);
    assert.equal(isOriginAllowed('https://phishing-saber.com'), false);
    assert.equal(isOriginAllowed(''), false);
    assert.equal(isOriginAllowed(undefined), false);
  });

  await t.test('En PRODUCCIÓN (VERCEL_ENV=production): Localhost está ESTRICTAMENTE RECHAZADO', () => {
    process.env.VERCEL_ENV = 'production';
    process.env.APP_URL = 'https://sysget-saber.vercel.app';

    assert.equal(isOriginAllowed('http://localhost:5173'), false);
    assert.equal(isOriginAllowed('http://localhost:3000'), false);
    assert.equal(isOriginAllowed('http://127.0.0.1:8080'), false);
    // Solo el dominio oficial está permitido
    assert.equal(isOriginAllowed('https://sysget-saber.vercel.app'), true);
  });

  await t.test('setCorsHeaders: aplica cabeceras exactas y Vary: Origin', () => {
    process.env.VERCEL_ENV = 'development';
    process.env.APP_URL = 'https://sysget-saber.vercel.app';

    const headers: Record<string, string> = {};
    const mockRes = {
      setHeader: (key: string, val: string) => {
        headers[key.toLowerCase()] = val;
      }
    };

    // Caso 1: Origen permitido (localhost en dev)
    setCorsHeaders(mockRes, 'http://localhost:5173');
    assert.equal(headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(headers['vary'], 'Origin');
    assert.equal(headers['access-control-allow-methods'], 'GET, POST, OPTIONS');

    // Caso 2: Origen malicioso -> cae a default APP_URL y no refleja el origen atacante
    setCorsHeaders(mockRes, 'http://localhost.atacante.com');
    assert.equal(headers['access-control-allow-origin'], 'https://sysget-saber.vercel.app');
  });
});
