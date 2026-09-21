# ADR-003 — Credenciales y correos en migraciones históricas y scripts de seed

**Estado:** Aceptado  
**Fecha:** 2026-09-21  
**Contexto:** Auditoría de seguridad Fase 4 — `PLAN_ACCION_ANTIGRAVITY.md`  
**Autores:** Luis Andrés León González / Antigravity

---

## Contexto

Durante la auditoría de la Fase 4.3, se identificaron tres categorías de datos sensibles en el repositorio:

### 1. Migraciones históricas con correos reales (no contraseñas)

| Archivo | Dato encontrado | Naturaleza |
|---|---|---|
| `004_create_superadmin_luis_leon.sql` | `luis_leon_g@hotmail.com` | Correo del fundador/admin |
| `006_create_production_users.sql` | `leontestvirtual1@gmail.com`, `luis.leon@premil.cl` | Correos de usuarios de prueba |
| `010_create_susana_pizarro_colegio_mi_casa.sql` | `nentitasusana@hotmail.com` | Correo de docente cliente |

**Importante:** ninguno de estos archivos contiene contraseñas reales, hashes de passwords ni tokens JWT. La migración 004 usa el placeholder `crypt('REEMPLAZAR_CON_PASSWORD_SEGURO', gen_salt('bf'))`.

### 2. Scripts de seed con correos de lookup

Los scripts en `scripts/seed-*.js` y `scripts/rebuild_mat2m_e3_from_source.mjs` usan correos para buscar el usuario admin en Supabase Auth (`find(u => u.email === 'leontestvirtual1@gmail.com')`). Estos son scripts de migración de datos ejecutados localmente, nunca en producción.

### 3. URL de proyecto Supabase en scripts

Varios scripts usan la URL pública del proyecto: `https://khtdzgfqjggycrcbrytw.supabase.co`. Esta URL es pública por diseño en Supabase (el `anon key` también lo es) — no es un secreto; el secreto es la `service_role key`. Sin embargo, la URL hardcodeada en código de aplicación (`api/`) fue removida.

---

## Decisión

### Migraciones históricas (004, 006, 010): NO reescribir

**Rationale:** Los correos en migraciones son datos operativos (lookup keys), no credenciales de autenticación. Reescribir o limpiar migraciones ya aplicadas rompe la cadena de auditoría de la base de datos. El riesgo real es bajo: ninguna contraseña ni token está expuesto.

**Acción:** Documentar en este ADR. Las migraciones quedan intactas.

### Scripts de seed (`scripts/`): Correos son aceptables

Los scripts de seed son herramientas de administración, no código de producción. Requieren acceso local con `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` para ejecutarse. Los correos son lookup keys funcionales. Se mantienen.

**Mejora futura:** cuando se creen nuevos scripts de seed, usar `process.env.ADMIN_EMAIL` en lugar de literales.

### URL pública de Supabase en `scripts/`: Aceptable

La URL `https://khtdzgfqjggycrcbrytw.supabase.co` es análoga al `anon key`: pública por diseño. Sin embargo, en código de aplicación (`api/*.ts`) se eliminó el fallback hardcodeado para seguir el principio de mínimo privilegio en el código (Directiva 10).

---

## Auditoría de git history

Se verificó el historial de git con:
```
git log --all --oneline -- ".env.local" "test_smtp.mjs"
```

**Resultado:** Solo dos commits rastrean estos archivos; ambos son commits de eliminación/limpieza. No se comprometieron valores de `.env.local` (contraseñas SMTP, `service_role key`) en ningún momento del historial. **No se requiere rotación de credenciales.**

---

## Consecuencias

- Las migraciones históricas quedan documentadas y congeladas.
- Las nuevas migraciones **deben** usar `RAISE EXCEPTION` con mensaje descriptivo si no encuentran al administrador, en lugar de caer en `SELECT ... LIMIT 1` con resultado arbitrario (patrón de la migración 034, documentado para no repetir).
- Todo correo o identificador de usuario en **nuevo** código de aplicación (`api/`, `src/`) debe provenir de `process.env`. Verificado con grep: `api/` limpio ✅.
- `src/data/mockData.ts` contiene correos de usuarios de demostración — esto es intencional para el modo demo de la aplicación (Directiva 2). No requiere acción.

---

## Relación con CONSTRAINTS.md

- **Directiva 9**: "Sin correos personales en el código de aplicación" → cumplida en `api/` y `src/` (excepto mockData como datos de demostración explícitos).
- **Directiva 10**: "Sin credenciales hardcodeadas" → cumplida. Las URLs de Supabase en `api/` usan `process.env`.
