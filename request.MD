# Crear guía completa de setup local + deploy a producción

local_setup_guide = """

# ============================================================

# GUÍA COMPLETA: LOCAL → PRODUCCIÓN

# Simce Trainer con Vercel + Supabase

# ============================================================

## PARTE 1: SETUP LOCAL (tu máquina)

### Requisitos previos

```bash
# 1. Node.js 18+ (recomendado 20 LTS)
node --version  # Debe decir v18.x o v20.x

# 2. npm o pnpm (pnpm recomendado)
npm install -g pnpm

# 3. Git
git --version

# 4. Supabase CLI
npm install -g supabase
supabase --version  # Debe ser >= 1.150

# 5. Docker Desktop (para Supabase local)
# Descargar de: https://www.docker.com/products/docker-desktop
# Asegurarse de que esté corriendo antes de iniciar Supabase local
```

### Paso 1: Crear proyecto Next.js 14

```bash
# Crear proyecto con shadcn/ui (ya incluye Tailwind, TypeScript, App Router)
npx shadcn@latest init --yes --template next --base-color slate

# Nombre del proyecto: simce-trainer
cd simce-trainer
```

Esto crea:

- `app/` con App Router
- `components/ui/` con shadcn/ui
- `lib/utils.ts`
- `tailwind.config.ts`
- `next.config.js`

### Paso 2: Instalar dependencias de Supabase

```bash
# Cliente Supabase para browser + server (App Router compatible)
pnpm add @supabase/supabase-js @supabase/ssr

# Para tipos generados de la base de datos
pnpm add -D supabase

# Utilidades
pnpm add uuid @types/uuid
pnpm add -D @types/uuid
```

### Paso 3: Inicializar Supabase local

```bash
# Inicializar proyecto Supabase local (crea carpeta supabase/)
supabase init

# Iniciar servicios locales (PostgreSQL, Auth, Storage, Realtime, Studio)
supabase start

# Ver estado
supabase status

# Output esperado:
# API URL: http://127.0.0.1:54321
# GraphQL URL: http://127.0.0.1:54321/graphql/v1
# S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
# DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# Studio URL: http://127.0.0.1:54323
# Inbucket URL: http://127.0.0.1:54324
```

**URLs importantes:**

- **Studio:** http://127.0.0.1:54323 → Interfaz web para ver tablas, ejecutar SQL, ver Auth
- **API:** http://127.0.0.1:54321 → Endpoint de Supabase
- **DB:** postgresql://postgres:postgres@127.0.0.1:54322/postgres → Conexión directa PostgreSQL

### Paso 4: Crear schema en local

```bash
# Copiar el schema SQL a la carpeta de migrations
mkdir -p supabase/migrations
cp /ruta/a/simce_trainer_supabase_schema.sql supabase/migrations/000001_initial_schema.sql

# Aplicar migration al local
supabase db reset

# Verificar que las tablas se crearon
# Ir a Studio → Table Editor → Deberías ver: perfiles, cursos, preguntas, pruebas, etc.
```

### Paso 5: Configurar variables de entorno local

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

> **Nota:** Las claves anónimas de Supabase local son siempre las mismas (son fijas para desarrollo). Nunca las uses en producción.

### Paso 6: Crear clientes Supabase

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El middleware puede manejar esto
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El middleware puede manejar esto
          }
        },
      },
    }
  )
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirección por rol (ejemplo básico)
  if (request.nextUrl.pathname.startsWith('/profesor') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
```

```typescript
// middleware.ts (raíz del proyecto)
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Paso 7: Seed de datos de prueba

```bash
# Crear archivo de seed
mkdir -p supabase/seed
```

Crear `supabase/seed/seed_data.sql`:

```sql
-- Seed: Datos de prueba para desarrollo local

-- 1. Crear usuario admin/profesor de prueba
-- Primero crear en auth.users (Supabase local lo hace automáticamente con la API)
-- Luego insertar en perfiles

INSERT INTO perfiles (id, rut, nombre, apellido, email, rol, establecimiento)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '12345678-9', 'María', 'González', 'maria@demo.cl', 'profesor', 'Escuela Demo'),
  ('00000000-0000-0000-0000-000000000002', '87654321-0', 'Pedro', 'Soto', 'pedro@demo.cl', 'alumno', 'Escuela Demo'),
  ('00000000-0000-0000-0000-000000000003', '11111111-1', 'Ana', 'López', 'ana@demo.cl', 'alumno', 'Escuela Demo'),
  ('00000000-0000-0000-0000-000000000004', '22222222-2', 'Carlos', 'Martínez', 'carlos@demo.cl', 'alumno', 'Escuela Demo');

-- 2. Crear curso
INSERT INTO cursos (id, nombre, nivel, profesor_id, establecimiento, anio, codigo_invitacion)
VALUES ('11111111-1111-1111-1111-111111111111', '8° Básico A', '8° básico', '00000000-0000-0000-0000-000000000001', 'Escuela Demo', 2026, 'DEMO2026');

-- 3. Matricular alumnos
INSERT INTO matriculas (alumno_id, curso_id)
VALUES 
  ('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111'),
  ('00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111'),
  ('00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111');

-- 4. Insertar preguntas de ejemplo (Matemática 8° Básico)
INSERT INTO preguntas (asignatura_id, eje_tematico_id, habilidad_id, tipo, nivel, dificultad, enunciado, alternativas, respuesta_correcta, puntaje, fuente)
VALUES 
  -- Pregunta 1: Números - Aplicación
  (
    (SELECT id FROM asignaturas WHERE codigo = 'MAT'),
    (SELECT id FROM ejes_tematicos WHERE codigo = 'MAT-NUM-8'),
    (SELECT id FROM habilidades WHERE codigo = 'MAT-APL'),
    'seleccion_multiple', '8° básico', 'media',
    'Un curso compró 2 cajas de plumones. Cada caja contenía 10 plumones. Repartieron esos plumones en partes iguales entre 4 grupos de trabajo. ¿Cuántos plumones recibió cada grupo?',
    '[{"letra":"A","texto":"3 plumones","es_correcta":false},{"letra":"B","texto":"5 plumones","es_correcta":true},{"letra":"C","texto":"8 plumones","es_correcta":false},{"letra":"D","texto":"16 plumones","es_correcta":false}]',
    'B', 1, 'SIMCE liberado'
  ),
  -- Pregunta 2: Álgebra - Razonamiento
  (
    (SELECT id FROM asignaturas WHERE codigo = 'MAT'),
    (SELECT id FROM ejes_tematicos WHERE codigo = 'MAT-ALG-8'),
    (SELECT id FROM habilidades WHERE codigo = 'MAT-RAZ'),
    'seleccion_multiple', '8° básico', 'alta',
    'Cierto juego consiste en dar un paso hacia adelante si se saca una ficha azul y un paso hacia atrás si se saca una ficha roja. Si Juan sacó 20 fichas en total y terminó 2 pasos más adelante de donde partió, ¿cuántas fichas de cada color sacó?',
    '[{"letra":"A","texto":"8 azules y 12 rojas","es_correcta":false},{"letra":"B","texto":"10 azules y 10 rojas","es_correcta":false},{"letra":"C","texto":"11 azules y 9 rojas","es_correcta":true},{"letra":"D","texto":"12 azules y 8 rojas","es_correcta":false}]',
    'C', 1, 'SIMCE liberado'
  ),
  -- Pregunta 3: Geometría - Aplicación
  (
    (SELECT id FROM asignaturas WHERE codigo = 'MAT'),
    (SELECT id FROM ejes_tematicos WHERE codigo = 'MAT-GEO-8'),
    (SELECT id FROM habilidades WHERE codigo = 'MAT-APL'),
    'seleccion_multiple', '8° básico', 'media',
    'Un triángulo tiene lados de 6 cm, 8 cm y 10 cm. ¿Es un triángulo rectángulo?',
    '[{"letra":"A","texto":"Sí, porque 6² + 8² = 10²","es_correcta":true},{"letra":"B","texto":"No, porque 6 + 8 = 14","es_correcta":false},{"letra":"C","texto":"Sí, porque todos sus lados son pares","es_correcta":false},{"letra":"D","texto":"No se puede determinar con esa información","es_correcta":false}]',
    'A', 1, 'Original'
  ),
  -- Pregunta 4: Probabilidad - Razonamiento
  (
    (SELECT id FROM asignaturas WHERE codigo = 'MAT'),
    (SELECT id FROM ejes_tematicos WHERE codigo = 'MAT-PRO-8'),
    (SELECT id FROM habilidades WHERE codigo = 'MAT-RAZ'),
    'seleccion_multiple', '8° básico', 'alta',
    'En una urna hay 5 bolas rojas y 3 bolas azules. Se extrae una bola, se anota su color y se devuelve a la urna. Luego se extrae una segunda bola. ¿Cuál es la probabilidad de que ambas bolas sean rojas?',
    '[{"letra":"A","texto":"25/64","es_correcta":true},{"letra":"B","texto":"5/8","es_correcta":false},{"letra":"C","texto":"10/16","es_correcta":false},{"letra":"D","texto":"25/56","es_correcta":false}]',
    'A', 1, 'Original'
  ),
  -- Pregunta 5: Desarrollo
  (
    (SELECT id FROM asignaturas WHERE codigo = 'MAT'),
    (SELECT id FROM ejes_tematicos WHERE codigo = 'MAT-ALG-8'),
    (SELECT id FROM habilidades WHERE codigo = 'MAT-APL'),
    'desarrollo', '8° básico', 'media',
    'Resuelve la ecuación 2x² - 8x + 6 = 0. Explica cada paso del procedimiento.',
    '[]',
    NULL, 2, 'Original'
  );
```

Aplicar seed:

```bash
# Aplicar seed al local
supabase db reset --seed-file supabase/seed/seed_data.sql

# O si ya tienes datos y quieres solo insertar el seed:
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed/seed_data.sql
```

### Paso 8: Generar tipos TypeScript de la base de datos

```bash
# Generar tipos desde el schema local
supabase gen types typescript --local > types/database.ts

# Esto crea types/database.ts con todos los tipos de tablas, columnas, enums, etc.
```

### Paso 9: Correr el proyecto en local

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir en navegador: http://localhost:3000
```

**Verificar que todo funciona:**

1. Ir a http://localhost:3000 → Debería cargar la app
2. Ir a Supabase Studio http://127.0.0.1:54323 → Ver tablas creadas
3. Ir a Table Editor → Ver perfiles, preguntas, etc.

---

## PARTE 2: FLUJO DE DESARROLLO DIARIO

### Comandos que usarás todos los días

```bash
# 1. Asegurarte de que Docker Desktop está corriendo
# 2. Iniciar Supabase local (si no está corriendo)
supabase start

# 3. En otra terminal, correr Next.js
pnpm dev

# 4. Ver logs de Supabase
supabase logs start

# 5. Hacer cambios en el schema → crear migration
supabase migration new nombre_del_cambio
# Editar el archivo generado en supabase/migrations/
supabase db reset  # Aplicar cambios (CUIDADO: borra datos)
# O para migraciones sin perder datos:
supabase db push

# 6. Actualizar tipos TypeScript después de cambiar schema
supabase gen types typescript --local > types/database.ts

# 7. Detener Supabase local
supabase stop

# 8. Detener y borrar TODO (volumenes de Docker)
supabase stop --backup-no  # NO borra datos
supabase stop --no-backup   # BORRA TODO (cuidado)
```

### Estructura de trabajo recomendada

```
Día a día:
├── Mañana: supabase start → pnpm dev
├── Durante el día: editar código → hot reload automático
├── Cambios en BD: supabase migration new → editar → supabase db reset
├── Al finalizar: git add . → git commit → git push
└── Deploy: se hace automático al push a main (Vercel)
```

---

## PARTE 3: SUBIR A PRODUCCIÓN

### Paso 1: Crear proyecto Supabase en la nube

```bash
# Login a Supabase
supabase login

# Crear nuevo proyecto en la nube
supabase projects create simce-trainer-prod

# Seguir instrucciones: elegir organización, región (South America - São Paulo es el más cercano a Chile), plan (Free)

# Obtener el project-ref (ej: abcdefghijklmnopqrst)
supabase projects list
```

### Paso 2: Link proyecto local con proyecto cloud

```bash
# Link local → cloud
supabase link --project-ref abcdefghijklmnopqrst

# Verificar que está linkeado
supabase status
```

### Paso 3: Subir schema a producción

```bash
# Push todas las migrations al proyecto cloud
supabase db push

# Verificar en Supabase Dashboard (https://app.supabase.com)
# Ir a tu proyecto → Table Editor → Deberías ver todas las tablas
```

### Paso 4: Subir seed de datos a producción

```bash
# Opción A: Ejecutar seed SQL directo en el SQL Editor de Supabase Dashboard
# Copiar contenido de supabase/seed/seed_data.sql y pegar en SQL Editor → Run

# Opción B: Desde CLI (si tienes pocos datos)
supabase db reset --linked
# CUIDADO: Esto borra TODO en producción y aplica migrations + seed
```

> **IMPORTANTE:** En producción NO uses los UUIDs fijos del seed. Los usuarios deben registrarse vía Auth.

### Paso 5: Configurar Auth en producción

1. Ir a Supabase Dashboard → Authentication → Providers
2. Habilitar **Email** (Magic Link o Password)
3. Habilitar **Google OAuth** (opcional, para MVP puede ser solo email)
   - Crear credenciales en Google Cloud Console
   - Copiar Client ID y Client Secret a Supabase
4. Configurar **Site URL** y **Redirect URLs**:
   - Site URL: `https://simce-trainer.vercel.app`
   - Redirect URLs: `https://simce-trainer.vercel.app/auth/callback`

### Paso 6: Configurar Storage buckets en producción

1. Ir a Supabase Dashboard → Storage
2. Crear buckets:
   - `respuestas-desarrollo` (private)
   - `avatars` (public)
   - `reportes-pdf` (private)
3. Configurar policies RLS para cada bucket (igual que en local)

### Paso 7: Crear proyecto en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Inicializar proyecto (desde la raíz de simce-trainer)
vercel

# Seguir instrucciones:
# - ¿Set up and deploy? Yes
# - ¿Which scope? [tu usuario]
# - ¿Link to existing project? No
# - ¿What's your project name? simce-trainer
```

### Paso 8: Configurar variables de entorno en Vercel

```bash
# Setear variables de entorno en Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Valor: https://abcdefghijklmnopqrst.supabase.co (tu URL de producción)

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Valor: la anon key de tu proyecto (Settings → API)

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Valor: la service_role key (Settings → API → service_role)
```

O hacerlo desde Vercel Dashboard:

1. Ir a tu proyecto → Settings → Environment Variables
2. Agregar las 3 variables anteriores

### Paso 9: Deploy

```bash
# Deploy manual
vercel --prod

# O simplemente hacer push a main (si configuraste GitHub integration)
git add .
git commit -m "Ready for production"
git push origin main
# Vercel hará deploy automático
```

### Paso 10: Verificar producción

1. Abrir URL de Vercel (ej: `https://simce-trainer.vercel.app`)
2. Probar registro de usuario
3. Probar crear prueba como profesor
4. Probar rendir prueba como alumno
5. Verificar que los datos se guardan en Supabase cloud

---

## PARTE 4: COMANDOS RÁPIDOS DE REFERENCIA

### Supabase Local

```bash
supabase start              # Iniciar todos los servicios
supabase stop               # Detener (conserva datos)
supabase stop --no-backup   # Detener y borrar TODO
supabase status             # Ver estado y URLs
supabase db reset           # Resetear BD (aplica migrations + seed)
supabase db push            # Push migrations al proyecto linkeado
supabase migration new X    # Crear nueva migration
supabase gen types typescript --local > types/database.ts  # Generar tipos
supabase logs start         # Ver logs en tiempo real
```

### Next.js / Vercel

```bash
pnpm dev                    # Servidor de desarrollo local
pnpm build                  # Build de producción local
pnpm start                  # Servir build local
vercel                      # Deploy preview
vercel --prod               # Deploy a producción
```

### PostgreSQL Local (directo)

```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
# Dentro de psql:
\\dt                          # Listar tablas
\\d perfiles                  # Ver estructura de tabla
SELECT * FROM perfiles;     # Ver datos
\\q                          # Salir
```

---

## PARTE 5: SOLUCIÓN DE PROBLEMAS COMUNES

### Problema: "supabase start" falla

```bash
# Verificar que Docker Desktop está corriendo
docker ps

# Si hay conflictos de puertos, cambiar puertos
supabase start --exclude imgproxy

# O limpiar todo y reiniciar
supabase stop --no-backup
supabase start
```

### Problema: "pnpm dev" no conecta a Supabase

```bash
# Verificar que .env.local existe y tiene las URLs correctas
cat .env.local

# Verificar que Supabase local está corriendo
supabase status

# Probar conexión directa
curl http://127.0.0.1:54321/rest/v1/perfiles \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Problema: RLS bloquea queries

```bash
# Temporalmente desactivar RLS para debug (solo local!)
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

ALTER TABLE perfiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE pruebas DISABLE ROW LEVEL SECURITY;
-- ... etc

# REACTIVAR después de debug:
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
```

### Problema: Tipos TypeScript desactualizados

```bash
# Regenerar tipos después de cada cambio en schema
supabase gen types typescript --local > types/database.ts

# Si estás en producción:
supabase gen types typescript --project-id abcdefghijklmnopqrst > types/database.ts
```

### Problema: Deploy en Vercel falla

```bash
# Verificar que todas las variables de entorno están seteadas
vercel env ls

# Ver logs del deploy
vercel logs --all

# Hacer build local para ver errores
pnpm build
```

"""

with open('/mnt/agents/output/local_setup_guide.md', 'w') as f:
    f.write(local_setup_guide)

print("✅ Guía de setup local → producción guardada")
print(f"📄 Archivo: local_setup_guide.md")
print(f"🔧 Incluye: Comandos exactos, seed de datos, flujo diario, troubleshooting")
