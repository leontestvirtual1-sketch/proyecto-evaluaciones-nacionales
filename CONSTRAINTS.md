# CONSTRAINTS.md — Contrato Inmutable de Calidad
**Sysget Saber — Plataforma de Evaluaciones Nacionales**
*Generado con `constraint-driven-development` · 2026-09-17*

Este archivo define la barra de calidad que **nunca puede ser reducida** por ningún agente de IA, desarrollador o refactorización. Toda PR o commit que debilite cualquier umbral aquí establecido debe ser rechazada.

> [!CAUTION]
> **Violación de cualquiera de estos umbrales es motivo de rechazo inmediato del cambio.**

---

## 🛡️ Bloque 1: TypeScript Estricto (mapeado a Directivas 1–4, 10)

| Restricción | Umbral Obligatorio |
|---|---|
| Errores en `npx tsc --noEmit` | **0 errores** (código de salida 0) |
| Supresión de errores `@ts-ignore` | **Prohibido absolutamente** |
| Supresión de errores `@ts-expect-error` | Prohibido salvo comentario justificado con ticket |
| Aserciones de tipo `as any` | Prohibido — usar tipado explícito o `unknown` |
| Variables sin tipar en funciones públicas | Prohibido — todos los parámetros y retornos deben tener tipo explícito |

**Verificación automática:**
```bash
npx tsc --noEmit   # debe salir con código 0
```

---

## 🧹 Bloque 2: ESLint y Calidad de Código (mapeado a Directivas 1, 2, 9)

| Restricción | Umbral Obligatorio |
|---|---|
| Errores de ESLint | **0 errores** |
| Supresores `eslint-disable` sin justificación de ticket | **Prohibidos** |
| Funciones con más de 3 niveles de anidamiento | Prohibidas — usar retorno temprano o extracción |
| Funciones con más de 50 líneas de código lógico | Señal de refactorización necesaria |
| Variables no utilizadas | 0 — usar `_prefix` si el parámetro es requerido por firma |

---

## 🏛️ Bloque 3: Directivas de Arquitectura (mapeado 1:1 con DIRECTIVAS.md)

### Directiva 1 — Aislamiento de Ambientes
```
PROHIBIDO:
  const data = produccion.length > 0 ? produccion : mockData;

OBLIGATORIO:
  const data = isProduction ? produccionData : demoData;
  // La discriminación NUNCA se basa en si la lista tiene elementos.
```
**Violaciones que disparan rechazo:** Cualquier operador ternario que use `.length`, `.length > 0`, `|| []`, o `?? mockData` para alternar entre datos reales y mock.

### Directiva 2 — Empty States Legítimos
```
PROHIBIDO:
  if (!alumnos || alumnos.length === 0) setAlumnos(alumnosMock);

OBLIGATORIO:
  // Total: 0 es un estado válido. Mostrar:
  <EmptyState mensaje="En proceso de carga de nómina oficial" />
```
**Violaciones que disparan rechazo:** Cualquier `setAlumnos(mock)`, `setEvaluaciones(mock)` o inicialización con datos inventados en ruta de producción.

### Directiva 4 — Aislamiento por RBD y Especialidad
```
PROHIBIDO en consultas RLS-bypass:
  SELECT * FROM evaluaciones   -- sin filtro WHERE rbd = ...

OBLIGATORIO:
  SELECT * FROM evaluaciones WHERE rbd = current_user_rbd()
```
**Violaciones que disparan rechazo:** Cualquier consulta que cruce datos entre colegios distintos o que exponga `respuesta_correcta` al cliente.

### Directiva 9 — Sesión de Admin preservada
```
PROHIBIDO:
  const isProduction = currentUser.email === 'leontestvirtual1@gmail.com';

OBLIGATORIO:
  const isProduction = adminBaseProfile?.es_super_admin
    || PRODUCTION_ADMIN_EMAILS.has(adminBaseProfile?.email);
```
**Violaciones que disparan rechazo:** Detectar ambiente basado en `currentUser.email` cuando existe `adminBaseProfile` en contexto.

### Directiva 10 — Prohibición de Hardcoding de Secretos
```
PROHIBIDO:
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGci...';
  const PASS = process.env.SMTP_PASS || 'mi_password_real';

OBLIGATORIO:
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');
```
**Violaciones que disparan rechazo:** Cualquier cadena que se parezca a un JWT (`eyJ`), token Bearer, hash bcrypt (`$2b$`) o contraseña SMTP en el código fuente.

---

## 🧪 Bloque 4: Tests (mapeado a Directiva 6)

| Restricción | Umbral Obligatorio |
|---|---|
| Tests omitidos con `.skip()` o `xit()` | **0** — ningún test puede estar deshabilitado sin comentario y ticket |
| Tests sin aserciones reales (tests vacíos) | **Prohibidos** |
| Suite `tenant-isolation.test.ts` | Debe pasar al 100% antes de cada release |
| Suite `pedagogical-scoring.test.ts` | Debe pasar al 100% antes de cada release |
| Cobertura de lógica de negocio crítica | ≥ 90% de las funciones de `scoringUtils.ts` |

---

## 🔒 Bloque 5: Seguridad (mapeado a Directivas 4, 10)

| Restricción | Umbral Obligatorio |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` en archivos `src/` | **Prohibido absolutamente** |
| `respuesta_correcta` expuesta en respuesta HTTP al cliente | **Prohibido absolutamente** |
| Consultas SQL sin parámetros tipados (inyección SQL) | **Prohibido** — usar RPC o consultas parametrizadas |
| CORS abierto (`Access-Control-Allow-Origin: *`) en endpoints de escritura | **Prohibido** |
| Variables de entorno secretas en `.env` commiteado a Git | **Prohibido** |

---

## 📦 Bloque 6: Build de Producción

| Restricción | Umbral Obligatorio |
|---|---|
| Errores en `npm run build` | **0 errores** (código de salida 0) |
| Advertencias de build ignoradas sin justificación | Prohibido |
| Tamaño del chunk principal (`index.js`) | Máximo 600 KB (gzip) |
| Dependencias con vulnerabilidades CVSS ≥ 7.0 | **0** — bloquea release |

**Verificación de build:**
```bash
npm run build    # debe salir con código 0
npm audit --audit-level=high   # 0 vulnerabilidades high/critical
```

---

## ✅ Checklist de Auditoría Pre-Commit

Antes de cualquier commit en `main`:
- [ ] `npx tsc --noEmit` → 0 errores
- [ ] Sin ningún `@ts-ignore`, `@ts-expect-error` no justificado o `as any` nuevo
- [ ] Sin ningún `eslint-disable` no justificado
- [ ] Sin fallback cruzado de datos (Directiva 1)
- [ ] Sin datos Mock inyectados en rutas de producción (Directiva 2)
- [ ] Sin secretos hardcodeados (Directiva 10)
- [ ] Tests existentes siguen pasando al 100%
- [ ] `BITACORA.md` actualizada con la tarea completada
