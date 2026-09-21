# Auditoría de Integridad: Prueba Diagnóstica Educación Ciudadana 3° Medio 2026

**Evaluación ID:** `eval-diag-ciu-3m-2026`  
**Fuente Oficial:** Umáximo — Prueba Diagnóstica Todos los OAs Educación Ciudadana III° Medio 2026  
**Documento Fuente:**
- Instrumento y Solucionario: `evaluaciones_fuente/3_medio/Prueba_Diagnostica_Educacion_Ciudadana_3M_2026.pdf` (SHA-256: `cee60117749a7742ed62a7604215a04961c8aad5d55f3d14cba6de7d5a8cb1fb`)

---

## 1. Resumen Ejecutivo

| Métrica | Valor | Estado |
|---|---|---|
| Total de Preguntas | 25 | Coincide 100% ✅ |
| Claves Coincidentes | 25 / 25 (100.0%) | 0 discrepancias ✅ |
| Distribución de Claves | C: 8 (32.0%), D: 7 (28.0%), B: 5 (20.0%), A: 5 (20.0%) | Sin sesgo (<60%) ✅ |
| Suma Puntajes DB | 49 pts (ponderados 1 a 3 pts según complejidad) | Coincide con tabla fuente ✅ |
| Marcas de Agua | 0 menciones de `umaximo.com` en enunciados/alternativas | 100% Limpio ✅ |
| Caracteres Corruptos PUA | 0 caracteres corruptos detectados | 100% Limpio ✅ |
| Imágenes Asociadas | 2 figuras (`preg-ciu3m-diag-01`, `preg-ciu3m-diag-10`) responden HTTP 200 | 100% Accesibles ✅ |
| Estado Catálogo | `verificada_at = NOW()` | Aprobada para catálogo ✅ |

---

## 2. Tabla Comparativa de Claves: Solucionario Oficial vs Base de Datos

| Pregunta | Clave Solucionario Oficial | Clave Sysget Saber (DB) | Puntaje | Estado |
|:---:|:---:|:---:|:---:|:---:|
| 1 | C | C | 2 | ✅ Coincide |
| 2 | C | C | 2 | ✅ Coincide |
| 3 | B | B | 2 | ✅ Coincide |
| 4 | C | C | 2 | ✅ Coincide |
| 5 | D | D | 2 | ✅ Coincide |
| 6 | A | A | 1 | ✅ Coincide |
| 7 | C | C | 2 | ✅ Coincide |
| 8 | B | B | 2 | ✅ Coincide |
| 9 | D | D | 2 | ✅ Coincide |
| 10 | B | B | 2 | ✅ Coincide |
| 11 | D | D | 2 | ✅ Coincide |
| 12 | A | A | 2 | ✅ Coincide |
| 13 | B | B | 2 | ✅ Coincide |
| 14 | D | D | 2 | ✅ Coincide |
| 15 | C | C | 2 | ✅ Coincide |
| 16 | A | A | 2 | ✅ Coincide |
| 17 | B | B | 2 | ✅ Coincide |
| 18 | D | D | 2 | ✅ Coincide |
| 19 | C | C | 2 | ✅ Coincide |
| 20 | D | D | 2 | ✅ Coincide |
| 21 | C | C | 2 | ✅ Coincide |
| 22 | C | C | 2 | ✅ Coincide |
| 23 | A | A | 2 | ✅ Coincide |
| 24 | A | A | 2 | ✅ Coincide |
| 25 | D | D | 2 | ✅ Coincide |

---

## 3. Hallazgos y Diagnóstico

1. **Fidelidad Absoluta:** Todas las 25 preguntas migradas originalmente en la migración `036_seed_evaluacion_ciudadana_3m_2026.sql` presentan correspondencia unívoca con el documento de evaluación diagnóstica.
2. **Distribución Homogénea:** No existe sesgo de alternativas. La letra más frecuente es C con un 32%, muy por debajo del umbral de alerta del 45% y crítico del 60%.
3. **Puntajes y Ponderaciones:** La suma total de puntajes en la base de datos es de 49 puntos, coincidiendo exactamente con la pauta docente.
