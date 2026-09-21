# Auditoría de Integridad: SIMCE Ciencias Naturales 6° Básico Ensayo 3

**Evaluación ID:** `prueba-cn6b-101` (Local Mock) / No persistida en Supabase `evaluaciones`  
**Fuentes Documentales:**
- Instrumento: `evaluaciones_fuente/Ensayo - Ensayo 3 SIMCE Ciencias Naturales 6° Básico.pdf` (16 páginas, 35 preguntas)
- Tabla de Especificación Oficial: `evaluaciones_fuente/Ensayo+3+SIMCE+Ciencias+Naturales+6°+Básico+(Tabla+de+especificación).pdf` (4 páginas, 35 ítems, 135 puntos totales ponderados)
- Carpeta de Figuras: `public/preguntas/simce_cn_6b/` (22 imágenes locales)

---

## 1. Resumen Ejecutivo y Diagnóstico de Arquitectura

| Métrica / Dimensión | Estado / Hallazgo |
|---|---|
| **Ubicación del Contenido** | Vive exclusivamente en código fuente cliente: `src/data/mockData.ts` (`preguntasMock[]`, IDs `preg-cn6b-01` a `35`) |
| **Persistencia en Supabase DB** | ❌ **No existe en base de datos de producción**. La tabla `evaluaciones` y `preguntas` no poseen registros para este ensayo. |
| **Total de Preguntas** | 35 preguntas en el mock y 35 preguntas en el PDF fuente. Coinciden en extensión. |
| **Puntaje Ponderado Fuente** | 135 puntos según la Tabla de Especificación oficial de Umáximo (ítems valorados entre 3, 4 y 5 pts). |
| **Disponibilidad para Docentes** | En modo producción (`isProduction = true`), las evaluaciones se leen desde la base de datos Supabase filtrando por `verificada_at IS NOT NULL`. Por ende, **este ensayo no es visible ni asignable en producción**. |
| **Riesgo de Publicación** | Nulo en producción debido a las compuertas de catálogo implementadas en la Fase 5. |

---

## 2. Recomendaciones de Acción para Migración Futura

Si el establecimiento o la administración decide incorporar formalmente esta evaluación al catálogo oficial de producción de Sysget Saber, se deberán completar los siguientes pasos estandarizados:

1. **Subida de Figuras al Storage Supabase:**
   - Migrar las 22 figuras locales de `public/preguntas/simce_cn_6b/` hacia el bucket `evaluaciones-media/simce_cn_6b/` para mantener la política de URLs absolutas con CDN y CDN caching.
2. **Generación de Migración SQL Transaccional:**
   - Crear la migración `052_seed_evaluacion_simce_cn_6b_e3.sql` insertando en `evaluaciones` con `id: 'eval-simce-cn-6b-e3'` y en `preguntas` con IDs `preg-cn6b-e3-01` a `35`.
   - Asignar los puntajes ponderados oficiales (total 135 pts) especificados en la tabla Umáximo.
3. **Creación del Manifiesto Oficial de Claves:**
   - Extraer y revalidar el clavijero oficial en `scripts/data/claves_oficiales/simce_cn_6b_e3.json` registrando los SHA-256 de los 2 PDFs.
4. **Validación con Quality Gate:**
   - Incorporar el prefijo `eval-simce-cn-6b-e3: 'preg-cn6b-e3-%'` en `scripts/verify_evaluations_integrity.mjs`.
   - Ejecutar `npm run verify:content` y certificar con `verificada_at = NOW()`.
