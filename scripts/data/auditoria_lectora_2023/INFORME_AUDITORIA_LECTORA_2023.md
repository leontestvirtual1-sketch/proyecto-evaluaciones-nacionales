# Auditoría PAES Competencia Lectora 2023 (Forma 103) — Informe de Cotejo y Snapshot
**Fecha de ejecución y verificación:** 9 de noviembre de 2026  
**Evaluación ID:** `eval-paes-lect-2023-f103`  
**Estado:** Conciliación 100% completada contra base de datos activa y cuadernillo oficial DEMRE.

---

## 1. Resumen Ejecutivo de la Auditoría

| Métrica | Estado | Detalle |
| :--- | :---: | :--- |
| **Total Preguntas Conciliadas** | **65 / 65** | Todas las 65 preguntas oficiales están presentes y en orden secuencial estricto. |
| **Coincidencia de Claves Oficiales** | **65 / 65 (100%)** | Clavijero DEMRE Forma 103 verificado al 100% contra las respuestas correctas en DB. |
| **Preguntas Piloto** | **5 identificadas** | Ítems 1, 19, 26, 33 y 37 correctamente catalogados conforme al folleto oficial. |
| **Opciones por Pregunta** | **4 (A–D)** | Los 65 reactivos poseen exactamente 4 alternativas ordenadas conforme al formato DEMRE. |
| **Lecturas Editoriales** | **8 / 8** | Las 8 lecturas cuentan con su pasaje inicial completo, citas y preguntas asociadas. |
| **Imágenes Asignadas** | **7 asignaciones** | Preguntas con soporte visual específico (Q1, Q3, Q12, Q24, Q33, Q34, Q59). |

---

## 2. Asignación y Auditoría de Recursos Visuales

El análisis de imágenes del informe previo señalaba dudas sobre imágenes no identificadas y archivos redundantes en la carpeta local. A continuación se expone la asignación real y activa en la base de datos de producción:

| Pregunta Oficial | Lectura | Imagen Asignada en BD | Origen / Página PDF | Estado y Observación |
| :---: | :---: | :--- | :---: | :--- |
| **1** | Lectura 1 | `figura_p04_guias_alimentarias_minsal.png` | Pág. 4 | ✅ Infografía oficial de guías alimentarias MINSAL. |
| **3** | Lectura 1 | `figura_p04_guias_alimentarias_minsal.png` | Pág. 4 | ✅ Apoyo visual legítimo para cotejo directo en ítem 3. |
| **12** | Lectura 2 | `figura_p13_q12_cinematografia_movimiento.png` | Pág. 13 | ✅ Secuencia de Muybridge que la prueba oficial repite legítimamente en Pág. 13. |
| **24** | Lectura 4 | `evaluaciones/1794239217873_eoyrqqs.jpg` | Pág. 22 | ✅ Ilustración docente / clase de inglés (Lectura 4). |
| **33** | Lectura 5 | `evaluaciones/1794239363488_5dkdobt.jpg` | Pág. 26 | ✅ Ficha botánica de almácigos (Lectura 5). |
| **34** | Lectura 5 | `evaluaciones/1794239409409_dv0y9xv.jpg` | Pág. 27 | ✅ Diagrama de trasplante de hierbas (Lectura 5). |
| **59** | Lectura 8 | `evaluaciones/1794239889604_m0am94j.jpg` | Pág. 42 | ✅ Ilustración y mapa de cultura Chinchorro (Lectura 8). |

> **Nota sobre archivos locales huérfanos/redundantes (`figura_p08_niepce.png`, `figura_p09_daguerrotipo.png`, etc.):**  
> Ninguna de esas imágenes con nombres equívocos está vinculada en las preguntas de la base de datos actual. Quedan como archivos locales descartados de la extracción original y no contaminan el contenido de la plataforma.

---

## 3. Matriz de Cotejo Completa (65 Preguntas)

| N° | ID de Pregunta | Lectura | Clave DB | Clave DEMRE | Piloto | Alts | Imagen | Resumen Enunciado |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `preg-paes-lec-23-01` | L1 | **A** | A ✅ | ⭐ SÍ | 4 | 📷 | **1. ¿Qué se afirma en el texto sobre la hipertensión?... |
| **2** | `preg-paes-lec-23-02` | L1 | **B** | B ✅ | No | 4 | — | **2. ¿Por qué se plantea un enfoque intersectorial para abordar la prevenci... |
| **3** | `preg-paes-lec-23-03` | L1 | **C** | C ✅ | No | 4 | 📷 | **3. ¿A cuál de las siguientes políticas o estrategias corresponde la figur... |
| **4** | `preg-paes-lec-23-04` | L1 | **B** | B ✅ | No | 4 | — | **4. ¿Qué se dice en el texto sobre la asociación FECHIPAN?**... |
| **5** | `preg-paes-lec-23-05` | L1 | **D** | D ✅ | No | 4 | — | **5. ¿Cuál de las siguientes medidas se encarga de proveer de alimentos de ... |
| **6** | `preg-paes-lec-23-06` | L1 | **A** | A ✅ | No | 4 | — | **6. ¿Qué estrategia del MINSAL es reconocida como símbolo de vida sana y a... |
| **7** | `preg-paes-lec-23-07` | L1 | **C** | C ✅ | No | 4 | — | **7. ¿Qué elemento de este texto otorga credibilidad a la información?**... |
| **8** | `preg-paes-lec-23-08` | L2 | **B** | B ✅ | No | 4 | — | A partir del segmento anterior de Wikipedia, ¿qué se puede afirmar acerca d... |
| **9** | `preg-paes-lec-23-09` | L2 | **B** | B ✅ | No | 4 | — | **9. ¿Cuál es el antecedente más antiguo de las películas de cine?**... |
| **10** | `preg-paes-lec-23-10` | L2 | **D** | D ✅ | No | 4 | — | **10. ¿A cuál de los siguientes inventores se le atribuye el origen de la f... |
| **11** | `preg-paes-lec-23-11` | L2 | **B** | B ✅ | No | 4 | — | **11. ¿Cuál de los siguientes inventores mejoró la luminosidad de las fotog... |
| **12** | `preg-paes-lec-23-12` | L2 | **B** | B ✅ | No | 4 | 📷 | **12. ¿Qué representa la siguiente figura dentro del fragmento leído?**... |
| **13** | `preg-paes-lec-23-13` | L2 | **A** | A ✅ | No | 4 | — | **13. ¿Qué logró Eastman una vez que obtuvo los derechos sobre el método in... |
| **14** | `preg-paes-lec-23-14` | L2 | **A** | A ✅ | No | 4 | — | **14. ¿Cuál de las siguientes propiedades de la cámara KODAK BROWNIE se des... |
| **15** | `preg-paes-lec-23-15` | L2 | **D** | D ✅ | No | 4 | — | **15. A partir de la lectura del fragmento, ¿cómo se puede definir la cinem... |
| **16** | `preg-paes-lec-23-16` | L2 | **C** | C ✅ | No | 4 | — | **16. Respecto a la participación de los inventores en el desarrollo de la ... |
| **17** | `preg-paes-lec-23-17` | L3 | **D** | D ✅ | No | 4 | — | **17. ¿Qué consecuencia tuvo la lluvia para la filmación de la película?**... |
| **18** | `preg-paes-lec-23-18` | L3 | **D** | D ✅ | No | 4 | — | **18. Según lo presentado en el fragmento leído, ¿cuál es el nombre del mie... |
| **19** | `preg-paes-lec-23-19` | L3 | **D** | D ✅ | ⭐ SÍ | 4 | — | **19. Según lo planteado en el fragmento leído, ¿para qué el director vació... |
| **20** | `preg-paes-lec-23-20` | L3 | **A** | A ✅ | No | 4 | — | **20. A partir del fragmento leído, ¿qué opción presenta una dificultad par... |
| **21** | `preg-paes-lec-23-21` | L3 | **B** | B ✅ | No | 4 | — | **21. ¿Qué opción presenta información que se puede desprender del fragment... |
| **22** | `preg-paes-lec-23-22` | L3 | **A** | A ✅ | No | 4 | — | **22. Según el autor, ¿qué efecto tuvo la ofrenda a la Paccha Mama?**... |
| **23** | `preg-paes-lec-23-23` | L3 | **C** | C ✅ | No | 4 | — | **23. A partir del contenido del fragmento leído, ¿quién podría ser el lect... |
| **24** | `preg-paes-lec-23-24` | L4 | **D** | D ✅ | No | 4 | 📷 | **24. ¿De qué forma la profesora Viviana logra enseñar inglés a sus estudia... |
| **25** | `preg-paes-lec-23-25` | L4 | **C** | C ✅ | No | 4 | — | **25. ¿Qué estrategia usa Ken para establecer las reglas en sus clases?**... |
| **26** | `preg-paes-lec-23-26` | L4 | **D** | D ✅ | ⭐ SÍ | 4 | — | **26. ¿Cuál de los siguientes profesores utiliza la tecnología como recurso... |
| **27** | `preg-paes-lec-23-27` | L4 | **B** | B ✅ | No | 4 | — | **27. ¿Cuál de los profesores es un experto en ayudar a los alumnos con dif... |
| **28** | `preg-paes-lec-23-28` | L4 | **A** | A ✅ | No | 4 | — | **28. ¿Cómo se podría caracterizar la enseñanza de Randy de acuerdo al méto... |
| **29** | `preg-paes-lec-23-29` | L4 | **A** | A ✅ | No | 4 | — | **29. ¿Cuál de los siguientes objetivos de los docentes se encuentra presen... |
| **30** | `preg-paes-lec-23-30` | L4 | **D** | D ✅ | No | 4 | — | **30. ¿Con qué propósito se muestran las experiencias de los cuatro profeso... |
| **31** | `preg-paes-lec-23-31` | L4 | **B** | B ✅ | No | 4 | — | **31. Si un docente necesita incorporar nuevas herramientas tecnológicas pa... |
| **32** | `preg-paes-lec-23-32` | L4 | **C** | C ✅ | No | 4 | — | **32. ¿A quién está dirigido el fragmento leído?**... |
| **33** | `preg-paes-lec-23-33` | L5 | **D** | D ✅ | ⭐ SÍ | 4 | 📷 | **33. ¿Qué opción presenta otro título adecuado al contenido global de la l... |
| **34** | `preg-paes-lec-23-34` | L5 | **C** | C ✅ | No | 4 | 📷 | **34. En relación con el ajenjo, ¿qué necesidad de lectura satisface la sec... |
| **35** | `preg-paes-lec-23-35` | L5 | **C** | C ✅ | No | 4 | — | **35. Según la sección “Interés agronómico”, ¿cuál es el primer paso que de... |
| **36** | `preg-paes-lec-23-36` | L5 | **A** | A ✅ | No | 4 | — | **36. ¿Qué opción presenta otro título adecuado al contenido de la sección ... |
| **37** | `preg-paes-lec-23-37` | L5 | **B** | B ✅ | ⭐ SÍ | 4 | — | **37. ¿Cuál de las siguientes personas puede consumir ajenjo sin problemas?... |
| **38** | `preg-paes-lec-23-38` | L5 | **A** | A ✅ | No | 4 | — | **38. Con relación al ajenjo, ¿qué función cumple principalmente la sección... |
| **39** | `preg-paes-lec-23-39` | L5 | **B** | B ✅ | No | 4 | — | **39. Si una persona pretende propagar el ajenjo por estacas, ¿cuándo debe ... |
| **40** | `preg-paes-lec-23-40` | L5 | **D** | D ✅ | No | 4 | — | **40. Una persona intentó propagar el ajenjo por división de matas, sin emb... |
| **41** | `preg-paes-lec-23-41` | L6 | **D** | D ✅ | No | 4 | — | **41. ¿Cuál es el propósito del texto leído?**... |
| **42** | `preg-paes-lec-23-42` | L6 | **D** | D ✅ | No | 4 | — | **42. ¿Qué recurso utilizado en el texto permite generar cercanía con el le... |
| **43** | `preg-paes-lec-23-43` | L6 | **C** | C ✅ | No | 4 | — | **43. A partir del párrafo inicial, ¿cómo se puede calificar el aporte de l... |
| **44** | `preg-paes-lec-23-44` | L6 | **D** | D ✅ | No | 4 | — | **44. ¿Qué característica tienen en común las innovaciones mencionadas en e... |
| **45** | `preg-paes-lec-23-45` | L6 | **B** | B ✅ | No | 4 | — | **45. ¿Qué advertencia plantea la autora acerca del cultivo de algas?**... |
| **46** | `preg-paes-lec-23-46` | L6 | **A** | A ✅ | No | 4 | — | **46. Según el texto, ¿qué característica de las baterías de los vehículos ... |
| **47** | `preg-paes-lec-23-47` | L6 | **D** | D ✅ | No | 4 | — | **47. ¿Cuál de las innovaciones descritas en el texto es objetada por la co... |
| **48** | `preg-paes-lec-23-48` | L6 | **A** | A ✅ | No | 4 | — | **48. En el último párrafo, ¿a quiénes critica indirectamente la autora del... |
| **49** | `preg-paes-lec-23-49` | L7 | **C** | C ✅ | No | 4 | — | **49. ¿Qué función cumplen las preguntas incluidas en el texto?**... |
| **50** | `preg-paes-lec-23-50` | L7 | **C** | C ✅ | No | 4 | — | **50. Según el texto, ¿cuál era el propósito original de hacer maquetas?**... |
| **51** | `preg-paes-lec-23-51` | L7 | **A** | A ✅ | No | 4 | — | **51. Según el texto, ¿qué permitió el estudio de la “cupulita”?**... |
| **52** | `preg-paes-lec-23-52` | L7 | **B** | B ✅ | No | 4 | — | **52. ¿Cómo se puede calificar la conducta de Brunelleschi al negarse a pre... |
| **53** | `preg-paes-lec-23-53` | L7 | **A** | A ✅ | No | 4 | — | **53. Según el autor, ¿qué riesgo implica el uso de recursos computacionale... |
| **54** | `preg-paes-lec-23-54` | L7 | **B** | B ✅ | No | 4 | — | **54. ¿Qué tienen en común Dennis Dollens y Otl Aicher?**... |
| **55** | `preg-paes-lec-23-55` | L7 | **D** | D ✅ | No | 4 | — | **55. ¿A qué se refiere el autor en el siguiente enunciado? «El “render”, o... |
| **56** | `preg-paes-lec-23-56` | L7 | **A** | A ✅ | No | 4 | — | **56. ¿Qué conceptos se relacionan con el reloj digital y el reloj analógic... |
| **57** | `preg-paes-lec-23-57` | L7 | **C** | C ✅ | No | 4 | — | **57. Según el autor del texto, ¿qué acciones permiten la creación de una o... |
| **58** | `preg-paes-lec-23-58` | L7 | **D** | D ✅ | No | 4 | — | **58. ¿Quién inspiró la carrera arquitectónica de Renzo Piano?**... |
| **59** | `preg-paes-lec-23-59` | L8 | **A** | A ✅ | No | 4 | 📷 | **59. De acuerdo con la lectura, ¿cómo se puede calificar el proceso de pos... |
| **60** | `preg-paes-lec-23-60` | L8 | **C** | C ✅ | No | 4 | — | **60. ¿Cuál es la función del siguiente segmento dentro del fragmento leído... |
| **61** | `preg-paes-lec-23-61` | L8 | **B** | B ✅ | No | 4 | — | **61. ¿Qué aspecto social de la cultura chinchorro destaca el Ministerio de... |
| **62** | `preg-paes-lec-23-62` | L8 | **A** | A ✅ | No | 4 | — | **62. ¿Cuál es el rol de la Universidad de Tarapacá en la obtención del rec... |
| **63** | `preg-paes-lec-23-63` | L8 | **A** | A ✅ | No | 4 | — | **63. De acuerdo con la lectura, ¿qué institución estará a cargo de adminis... |
| **64** | `preg-paes-lec-23-64` | L8 | **C** | C ✅ | No | 4 | — | **64. ¿Cuál es una evidencia de que las momias eran parte de la vida cotidi... |
| **65** | `preg-paes-lec-23-65` | L8 | **A** | A ✅ | No | 4 | — | **65. Según el fragmento leído, ¿qué fenómeno permite profundizar en el val... |

---

## 4. Estado de Formato y Estructura Editorial

1. **Separación de Párrafos y Bloques**:
   - Las 8 lecturas poseen su texto íntegro en las preguntas de inicio de lectura (Q1, Q8, Q17, Q24, Q33, Q41, Q50, Q59).
   - En las preguntas de continuación (ej. Q51 a Q58), el texto largo no se repite para agilizar la lectura del estudiante, encabezado con `Lectura N (Continuación):`.
2. **Delimitador de Pregunta tras Lecturas Extensas**:
   - Implementado en `EnunciadoRenderer.tsx` un divisor destacado (`PREGUNTA ASOCIADA A LA LECTURA:`) que separa inequívocamente la bibliografía/citas de la lectura del reactivo a contestar.
3. **Limpieza de Marcadores**:
   - Sin asteriscos huérfanos (`**`) al final de enunciados.
   - Paginación del Banco de Preguntas corregida para reiniciar a Página 1 al seleccionar instrumentos.
