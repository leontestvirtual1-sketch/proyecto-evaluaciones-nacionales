-- ============================================================
-- Sysget Saber — Migración 013: Tabla Oficial de Comunas y Regiones
-- ============================================================

-- 1. Crear tabla de comunas
CREATE TABLE IF NOT EXISTS public.comunas (
  id              SERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE,
  region_numero   TEXT NOT NULL DEFAULT '13',
  region_nombre   TEXT NOT NULL DEFAULT 'Región Metropolitana de Santiago',
  provincia       TEXT NOT NULL DEFAULT 'Santiago',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.comunas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de comunas" ON public.comunas;
CREATE POLICY "Lectura pública de comunas"
  ON public.comunas FOR SELECT
  USING (TRUE);

-- 2. Poblar las 52 comunas de la Región Metropolitana con sus respectivas provincias
INSERT INTO public.comunas (nombre, region_numero, region_nombre, provincia) VALUES
  -- Provincia de Santiago (32 comunas)
  ('Cerrillos', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Cerro Navia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Conchalí', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('El Bosque', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Estación Central', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Huechuraba', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Independencia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Cisterna', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Florida', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Granja', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Pintana', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('La Reina', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Las Condes', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Barnechea', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Espejo', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Lo Prado', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Macul', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Maipú', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Ñuñoa', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Pedro Aguirre Cerda', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Peñalolén', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Providencia', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Pudahuel', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Quilicura', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Quinta Normal', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Recoleta', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Renca', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Joaquín', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Miguel', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('San Ramón', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Santiago', '13', 'Región Metropolitana de Santiago', 'Santiago'),
  ('Vitacura', '13', 'Región Metropolitana de Santiago', 'Santiago'),

  -- Provincia de Cordillera (3 comunas)
  ('Pirque', '13', 'Región Metropolitana de Santiago', 'Cordillera'),
  ('Puente Alto', '13', 'Región Metropolitana de Santiago', 'Cordillera'),
  ('San José de Maipo', '13', 'Región Metropolitana de Santiago', 'Cordillera'),

  -- Provincia de Chacabuco (3 comunas)
  ('Colina', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),
  ('Lampa', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),
  ('Til Til', '13', 'Región Metropolitana de Santiago', 'Chacabuco'),

  -- Provincia de Maipo (4 comunas)
  ('Buin', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Calera de Tango', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('Paine', '13', 'Región Metropolitana de Santiago', 'Maipo'),
  ('San Bernardo', '13', 'Región Metropolitana de Santiago', 'Maipo'),

  -- Provincia de Melipilla (5 comunas)
  ('Alhué', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('Curacaví', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('María Pinto', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('Melipilla', '13', 'Región Metropolitana de Santiago', 'Melipilla'),
  ('San Pedro', '13', 'Región Metropolitana de Santiago', 'Melipilla'),

  -- Provincia de Talagante (5 comunas)
  ('El Monte', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Isla de Maipo', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Padre Hurtado', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Peñaflor', '13', 'Región Metropolitana de Santiago', 'Talagante'),
  ('Talagante', '13', 'Región Metropolitana de Santiago', 'Talagante')
ON CONFLICT (nombre) DO NOTHING;

-- 3. Crear índice de búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_comunas_nombre ON public.comunas(nombre);
CREATE INDEX IF NOT EXISTS idx_comunas_provincia ON public.comunas(provincia);

-- 4. Verificación
SELECT COUNT(*) as total_comunas_rm FROM public.comunas;
SELECT nombre, provincia FROM public.comunas ORDER BY provincia, nombre;
