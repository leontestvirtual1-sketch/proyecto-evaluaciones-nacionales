-- ==============================================================================
-- Migración 035: Ensayo 6 SIMCE Lectura II° Medio (Catálogo Global Sin Asignar)
-- Nivel: 2° Medio | Asignatura: asig-2 | es_catalogo = TRUE | profesor_id = NULL
-- ==============================================================================
BEGIN;

-- 1. Registrar o actualizar la evaluación en public.evaluaciones
INSERT INTO public.evaluaciones (
  id, titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, 
  es_catalogo, precio_clp, descripcion_catalogo, profesor_id, total_preguntas, created_at, updated_at
) VALUES (
  'eval-simce-len-2m-e6',
  'Ensayo 6 SIMCE Lengua y Literatura 2° Medio',
  'Evaluación formativa SIMCE de Comprensión Lectora para 2° Medio. Cuatro lecturas comprensivas: Texto Narrativo («El fiscal»), Divulgación Médica («Miedo odontológico»), Ensayo Argumentativo («Productividad») y Poema Lírico («A mi hijo»).',
  'asig-2',
  '2° Medio',
  90,
  'activa',
  TRUE,
  0,
  'Evaluación integral estándar SIMCE de Lengua y Literatura 2° Medio con 35 ítems de selección múltiple sobre lecturas literarias, no literarias y argumentativas.',
  NULL,
  35,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  asignatura_id = EXCLUDED.asignatura_id,
  nivel = EXCLUDED.nivel,
  tiempo_limite = EXCLUDED.tiempo_limite,
  estado = EXCLUDED.estado,
  es_catalogo = TRUE,
  total_preguntas = EXCLUDED.total_preguntas,
  updated_at = NOW();

-- 2. Insertar las 35 preguntas de Lectura 2° Medio
DO $insert_len2m$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'leontestvirtual1@gmail.com' LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM auth.users LIMIT 1;
  END IF;

  INSERT INTO public.preguntas (
    id, propietario_id, asignatura_id, eje_tematico_id, habilidad_id,
    tipo, nivel, dificultad, imagen_url,
    enunciado, alternativas, respuesta_correcta, puntaje, fuente,
    created_at, updated_at
  ) VALUES
    ('preg-len2m-e6-01', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '### LECTURA 1: Lee el siguiente texto y responde las preguntas de la 1 a la 7.

**El fiscal (Fragmento)**  
*Carmen de Burgos Seguí*

Julio había venido de Sevilla aquella misma mañana, y sentado junto a su novia, bajo el emparrado que cubría la puerta, la miraba embelesado, mientras los labios se negaban a formular las ideas, como si la palabra fuese impotente para expresar sus sentimientos.

—¡Eh, muchacho! Que nada me has dicho del juicio de ayer —dijo con su acostumbrada franqueza el padre de Eloísa, interrumpiendo la dulce contemplación.
—Ya lo verá usted mañana en los periódicos... Dicen que estuve elocuente... Buenas amistades —añadió con falsa modestia.
—No —replicó él, contento de su futuro yerno—, ¡tú vales mucho! ¿Y el fallo del Tribunal y del Jurado?
—Ambos estuvieron conformes con lo que yo había pedido.
—¿Qué pediste? —preguntó aún el viejo.
—Veinte años de presidio para el cómplice y la muerte en garrote para el asesino —dijo con frialdad Julio.
Eloísa se estremeció vivamente.
—¡La muerte! ¡Dios mío! ¿Y tú has pedido eso?
—Era mi deber —contestó el joven con orgullo profesional.
—¡Pero matar a un hombre! ¡Tener la responsabilidad de una vida!
—No soy yo quien lo mata; es la Ley. Yo solo soy el instrumento.

---

**1. Según el texto, ¿por qué Julio se negó inicialmente a hablar del juicio cuando llegó a la casa?**', '[{"letra": "A", "texto": "Porque estaba profundamente absorto contemplando a su novia Eloísa.", "es_correcta": true}, {"letra": "B", "texto": "Porque sentía culpa por haber pedido la pena de muerte para el reo.", "es_correcta": false}, {"letra": "C", "texto": "Porque el padre de Eloísa no aprobaba su trabajo como fiscal.", "es_correcta": false}, {"letra": "D", "texto": "Porque la sentencia definitiva aún no era confirmada por el Tribunal.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-02', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**2. ¿Cuál fue la sentencia solicitada por Julio para el acusado principal en el juicio?**', '[{"letra": "A", "texto": "La pena de muerte en garrote.", "es_correcta": true}, {"letra": "B", "texto": "Veinte años de presidio con trabajos forzados.", "es_correcta": false}, {"letra": "C", "texto": "Cadena perpetua sin beneficios.", "es_correcta": false}, {"letra": "D", "texto": "El destierro definitivo de Sevilla.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-03', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**3. ¿Qué actitud manifiesta Eloísa al enterarse de la petición formulada por su novio?**', '[{"letra": "A", "texto": "Horror e indignación moral ante la idea de condenar a muerte a un ser humano.", "es_correcta": true}, {"letra": "B", "texto": "Orgullo por el prestigio y elocuencia profesional demostrados por Julio.", "es_correcta": false}, {"letra": "C", "texto": "Indiferencia frente a las decisiones judiciales del tribunal.", "es_correcta": false}, {"letra": "D", "texto": "Preocupación por las represalias que la familia del acusado pudiera tomar.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-04', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**4. ¿Cómo justifica Julio su decisión de solicitar la máxima pena para el acusado?**', '[{"letra": "A", "texto": "Argumentando que él actúa únicamente como un instrumento imparcial del deber y la Ley.", "es_correcta": true}, {"letra": "B", "texto": "Afirmando que el acusado era una persona peligrosa para el pueblo sevillano.", "es_correcta": false}, {"letra": "C", "texto": "Sosteniendo que las órdenes provenían directamente del presidente del Tribunal.", "es_correcta": false}, {"letra": "D", "texto": "Explicando que deseaba ganar notoriedad en la prensa local.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-05', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**5. ¿Cuál es el significado contextual del término «embelesado» en el primer párrafo?**', '[{"letra": "A", "texto": "Fascinado o cautivado profundamente por la presencia de su amada.", "es_correcta": true}, {"letra": "B", "texto": "Agotado físicamente tras el largo viaje desde Sevilla.", "es_correcta": false}, {"letra": "C", "texto": "Preocupado por las consecuencias públicas del juicio.", "es_correcta": false}, {"letra": "D", "texto": "Distraído por el entorno natural bajo el emparrado.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-06', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**6. A partir del diálogo, ¿qué contraste fundamental se establece entre Julio y Eloísa?**', '[{"letra": "A", "texto": "El apego estricto y frío a la norma institucional frente a la compasión y sensibilidad ética humana.", "es_correcta": true}, {"letra": "B", "texto": "El deseo de reconocimiento social frente a la humildad de la vida rural.", "es_correcta": false}, {"letra": "C", "texto": "La devoción religiosa tradicional frente al laicismo moderno.", "es_correcta": false}, {"letra": "D", "texto": "La ambición económica de la juventud frente a la resignación de la vejez.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-07', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**7. ¿Cuál es el propósito principal del autor al incluir la intervención del padre de Eloísa al inicio?**', '[{"letra": "A", "texto": "Quebrar la atmósfera íntima de los novios e introducir el conflicto temático central de la narración.", "es_correcta": true}, {"letra": "B", "texto": "Mostrar la desconfianza del padre hacia las capacidades laborales del futuro yerno.", "es_correcta": false}, {"letra": "C", "texto": "Informar a los lectores sobre la profesión de los antepasados de la familia.", "es_correcta": false}, {"letra": "D", "texto": "Explicar las leyes procesales vigentes en la Sevilla de la época.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-08', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '### LECTURA 2: Lee el siguiente texto y responde las preguntas de la 8 a la 16.

**La escala del miedo en la consulta odontológica**  
*Martín et al., Revista de Salud y Odontología*

Con este diagnóstico, los especialistas advirtieron la necesidad de hacer una evaluación previa del estado emocional del paciente para planificar con anticipación una estrategia de abordaje específica de su caso que disminuya el temor.

«La investigación para la creación de una escala de miedo a la atención odontológica surge de constatar que cerca del 60% de la población posterga sus tratamientos por ansiedad severa o fobia al dolor», explica la Dra. Martín. La respuesta fisiológica ante el instrumental rotatorio o las agujas activa el sistema nervioso simpático, elevando la frecuencia cardíaca y la presión arterial de forma automática.

El estudio propone una escala clínica estandarizada (Escala EMOD) que clasifica a los pacientes en tres niveles: leve (manejo comunicativo verbal), moderado (técnicas de desensibilización sistemática y pausas) y severo (intervención farmacológica con óxido nitroso o apoyo psicológico previo). De esta manera, el tratamiento deja de ser un procedimiento invasivo imprevisto y se transforma en un protocolo estructurado de atención humanizada.

---

**8. ¿Cuál es el porcentaje aproximado de la población que posterga sus tratamientos dentales por temor o ansiedad?**', '[{"letra": "A", "texto": "Cerca del 60%.", "es_correcta": true}, {"letra": "B", "texto": "Alrededor del 25%.", "es_correcta": false}, {"letra": "C", "texto": "Exactamente el 40%.", "es_correcta": false}, {"letra": "D", "texto": "Más del 80%.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-09', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**9. ¿Qué efecto fisiológico experimenta un paciente al activarse su sistema nervioso simpático en la consulta?**', '[{"letra": "A", "texto": "Aumento de la frecuencia cardíaca y de la presión arterial.", "es_correcta": true}, {"letra": "B", "texto": "Disminución inmediata del flujo sanguíneo cerebral.", "es_correcta": false}, {"letra": "C", "texto": "Relajación muscular y somnolencia profunda.", "es_correcta": false}, {"letra": "D", "texto": "Pérdida temporal de la sensibilidad en las encías.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-10', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**10. Según la propuesta del estudio, ¿qué estrategia corresponde aplicar a los pacientes con nivel moderado de ansiedad?**', '[{"letra": "A", "texto": "Técnicas de desensibilización sistemática y pausas programadas durante el procedimiento.", "es_correcta": true}, {"letra": "B", "texto": "Mera explicación verbal básica sin alterar los tiempos clínicos.", "es_correcta": false}, {"letra": "C", "texto": "Sedación profunda inmediata con anestesia general.", "es_correcta": false}, {"letra": "D", "texto": "Derivación obligatoria e inmediata a psiquiatría hospitalaria.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-11', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**11. ¿Cuál es el objetivo principal de la implementación de la Escala EMOD en la práctica clínica?**', '[{"letra": "A", "texto": "Transformar la atención odontológica en un protocolo humanizado y personalizado según el nivel de temor del paciente.", "es_correcta": true}, {"letra": "B", "texto": "Reducir los costos operativos de los consultorios dentales mediante menos uso de instrumental.", "es_correcta": false}, {"letra": "C", "texto": "Eliminar por completo el uso de anestésicos locales en todos los tratamientos.", "es_correcta": false}, {"letra": "D", "texto": "Acelerar la velocidad con la que se realizan las intervenciones quirúrgicas complejas.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-12', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**12. A partir del texto, ¿qué se puede inferir sobre las consecuencias de no evaluar el estado emocional del paciente antes de atenderlo?**', '[{"letra": "A", "texto": "Que el paciente puede sufrir crisis de pánico o abandonar definitivamente el tratamiento iniciado.", "es_correcta": true}, {"letra": "B", "texto": "Que los materiales de restauración dental perderán su adherencia química.", "es_correcta": false}, {"letra": "C", "texto": "Que el profesional será multado automáticamente por las autoridades sanitarias.", "es_correcta": false}, {"letra": "D", "texto": "Que los pacientes con fobia leve requerirán hospitalización de urgencia.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-13', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**13. ¿Qué función cumple la cita directa de la Dra. Martín en el segundo párrafo?**', '[{"letra": "A", "texto": "Aportar un respaldo de autoridad científica que justifica la pertinencia y relevancia del estudio.", "es_correcta": true}, {"letra": "B", "texto": "Criticar la formación académica tradicional de los odontólogos generales.", "es_correcta": false}, {"letra": "C", "texto": "Promocionar una marca específica de equipamiento rotatorio y anestesia.", "es_correcta": false}, {"letra": "D", "texto": "Contradecir las conclusiones de estudios internacionales anteriores.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-14', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**14. ¿Cuál es el significado de la palabra «invasivo» en el contexto del último párrafo?**', '[{"letra": "A", "texto": "Que agrede, incomoda o penetra el espacio físico y corporal del paciente generando rechazo.", "es_correcta": true}, {"letra": "B", "texto": "Que se propaga como una enfermedad infecciosa en la comunidad.", "es_correcta": false}, {"letra": "C", "texto": "Que vulnera las leyes sobre protección de datos clínicos.", "es_correcta": false}, {"letra": "D", "texto": "Que se realiza sin el consentimiento informado del tutor legal.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-15', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '**15. ¿Qué tipo de texto es la Lectura 2 y cuál es su estructura predominante?**', '[{"letra": "A", "texto": "Texto expositivo-divulgativo estructurado en problema, causa y propuesta de solución.", "es_correcta": true}, {"letra": "B", "texto": "Texto narrativo testimonial con estructura de inicio, nudo y desenlace.", "es_correcta": false}, {"letra": "C", "texto": "Texto dramático con acotaciones y parlamentos en conflicto.", "es_correcta": false}, {"letra": "D", "texto": "Texto normativo compuesto por artículos de ley y decretos obligatorios.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-16', v_admin_id, 'asig-2', 'eje-len-2', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**16. Si tuvieras que sintetizar la idea global del texto en un solo enunciado, ¿cuál sería el más preciso?**', '[{"letra": "A", "texto": "La odontología moderna requiere evaluar el estado emocional del paciente para adaptar los procedimientos y asegurar una atención libre de trauma.", "es_correcta": true}, {"letra": "B", "texto": "El uso del torno dental debe ser reemplazado completamente por fármacos relajantes.", "es_correcta": false}, {"letra": "C", "texto": "La mayoría de las personas no cuida sus dientes por falta de recursos económicos.", "es_correcta": false}, {"letra": "D", "texto": "Las agujas son el único factor que desencadena temor en los tratamientos médicos.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-17', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '### LECTURA 3: Lee el siguiente texto y responde las preguntas de la 17 a la 25.

**El mito de vivir de lo que amas**  
*Columna de opinión*

El discurso de la productividad actual insiste en la consigna de «vivir de lo que amas». Y sí, ¿cuántos de los que estamos en este espacio no quisiéramos dejar nuestros trabajos actuales y dedicarnos a nuestras pasiones todos los días? Hacer rentable nuestro más grande gusto parece la cúspide de la autorrealización contemporánea.

Sin embargo, este mandato encierra una trampa perversa: la monetización obligatoria del ocio y de la creatividad. Al convertir un pasatiempo —la pintura, la música, la escritura o la jardinería— en nuestra única fuente de sustento económico, el goce desinteresado queda subordinado a las leyes del mercado, a los algoritmos de visibilidad y a las métricas de rendimiento. Lo que antes era un refugio contra la rutina se transforma en una nueva fuente de agotamiento (burnout).

No todo lo que amamos debe convertirse en un modelo de negocio. Defender el valor de hacer cosas sin propósito lucrativo es hoy un acto de resistencia indispensable para preservar la salud mental y la genuina libertad creadora.

---

**17. Según el autor, ¿en qué consiste la «consigna de la productividad actual»?**', '[{"letra": "A", "texto": "En la idea de que las personas deben convertir sus pasiones en su fuente de ingresos económicos.", "es_correcta": true}, {"letra": "B", "texto": "En trabajar jornadas extensas sin derecho a vacaciones ni descansos.", "es_correcta": false}, {"letra": "C", "texto": "En reemplazar el trabajo humano por sistemas de inteligencia artificial.", "es_correcta": false}, {"letra": "D", "texto": "En priorizar el ahorro individual por sobre el consumo de bienes de lujo.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-18', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**18. ¿Cuál es la «trampa perversa» que el autor denuncia en el segundo párrafo?**', '[{"letra": "A", "texto": "La monetización forzada del ocio, que supedita el goce creativo a las métricas y exigencias del mercado.", "es_correcta": true}, {"letra": "B", "texto": "El aumento excesivo de los impuestos a los trabajadores independientes.", "es_correcta": false}, {"letra": "C", "texto": "La falta de plataformas digitales para comercializar productos artísticos.", "es_correcta": false}, {"letra": "D", "texto": "La escasa formación financiera que reciben los jóvenes en las escuelas.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-19', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**19. ¿Qué término utiliza el autor para referirse al estado de agotamiento extremo provocado por esta dinámica?**', '[{"letra": "A", "texto": "Burnout.", "es_correcta": true}, {"letra": "B", "texto": "Insomnio.", "es_correcta": false}, {"letra": "C", "texto": "Apatía.", "es_correcta": false}, {"letra": "D", "texto": "Desidia.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-20', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**20. ¿Qué postura defiende el autor en la conclusión del texto?**', '[{"letra": "A", "texto": "Reivindicar el valor del ocio no lucrativo como un espacio esencial para la salud mental y la creatividad.", "es_correcta": true}, {"letra": "B", "texto": "Renunciar a cualquier tipo de empleo formal para dedicarse a la vida ermitaña.", "es_correcta": false}, {"letra": "C", "texto": "Prohibir la venta de obras de arte en redes sociales y galerías.", "es_correcta": false}, {"letra": "D", "texto": "Obligar a las empresas a financiar los pasatiempos de sus trabajadores.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-21', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**21. ¿Con qué propósito el autor califica el ocio no lucrativo como un «acto de resistencia»?**', '[{"letra": "A", "texto": "Para enfatizar que oponerse a la lógica mercantil sobre la vida íntima es una defensa activa de la autonomía personal.", "es_correcta": true}, {"letra": "B", "texto": "Para convocar a una huelga laboral masiva en contra de las empresas tecnológicas.", "es_correcta": false}, {"letra": "C", "texto": "Para sugerir que la creación artística debe ser exclusivamente de corte político-partidista.", "es_correcta": false}, {"letra": "D", "texto": "Para demostrar que los pasatiempos tradicionales son superiores a las profesiones modernas.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-22', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '**22. ¿Cuál es el tono discursivo predominante en la columna de opinión?**', '[{"letra": "A", "texto": "Crítico, reflexivo y persuasivo.", "es_correcta": true}, {"letra": "B", "texto": "Burlesco, sarcástico y despectivo.", "es_correcta": false}, {"letra": "C", "texto": "Pesimista, melancólico y resignado.", "es_correcta": false}, {"letra": "D", "texto": "Neutro, técnico e impersonal.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-23', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**23. En la frase «el goce desinteresado queda subordinado a las leyes del mercado», ¿qué expresa la palabra «subordinado»?**', '[{"letra": "A", "texto": "Sometido o condicionado a una jerarquía o interés superior.", "es_correcta": true}, {"letra": "B", "texto": "Igualado en importancia con otros factores económicos.", "es_correcta": false}, {"letra": "C", "texto": "Recompensado económicamente de forma justa.", "es_correcta": false}, {"letra": "D", "texto": "Protegido por las regulaciones del derecho comercial.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-24', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '**24. ¿A qué público lector está orientada principalmente esta columna de opinión?**', '[{"letra": "A", "texto": "A jóvenes, trabajadores y creadores inmersos en la cultura digital y laboral contemporánea.", "es_correcta": true}, {"letra": "B", "texto": "A economistas expertos en comercio internacional y aranceles aduaneros.", "es_correcta": false}, {"letra": "C", "texto": "A directores de fábricas industriales de producción en cadena.", "es_correcta": false}, {"letra": "D", "texto": "A historiadores dedicados al estudio de la Revolución Industrial del siglo XIX.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-25', v_admin_id, 'asig-2', 'eje-len-3', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**25. ¿Cuál de los siguientes argumentos debilitaría más la tesis del autor?**', '[{"letra": "A", "texto": "Demostrar que una amplia mayoría de personas que monetizan sus pasiones incrementan su bienestar psicológico y nunca experimentan estrés comercial.", "es_correcta": true}, {"letra": "B", "texto": "Señalar que el mercado digital facilita la venta de productos artesanales.", "es_correcta": false}, {"letra": "C", "texto": "Afirmar que los pasatiempos requieren invertir dinero en materiales de calidad.", "es_correcta": false}, {"letra": "D", "texto": "Explicar que la jardinería tiene efectos terapéuticos comprobados en adultos mayores.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-26', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-1', 'seleccion_multiple', '2° Medio', 'baja', NULL, '### LECTURA 4: Lee el siguiente poema y responde las preguntas de la 26 a la 35.

**A mi hijo (Composición Lírica)**

No te prometo un mar sin tempestades,
ni un sendero de flores sin espinas;
los años te traerán sus claridades
y sombras que en el viento adivinas.

Construirás tu morada con desvelos,
aprenderás que el triunfo no es la meta,
sino el camino andado bajo cielos
que exigen la bravura del atleta.

Si te acercas y tropiezas,
si te lastimas y lloras,
no te ocultes en tristezas
que en el dolor te mejoras.

Camina, pues, con la mirada al frente,
que la vida es la arcilla y tú la frente.', '[{"letra": "A", "texto": "La promesa de que la vida estará exenta de sufrimientos.", "es_correcta": false}, {"letra": "B", "texto": "La advertencia honesta de que la existencia presenta tanto adversidades como aprendizajes.", "es_correcta": true}, {"letra": "C", "texto": "La obligación de superar el éxito material de sus antepasados.", "es_correcta": false}, {"letra": "D", "texto": "El reproche por haber elegido un camino arriesgado.", "es_correcta": false}]'::jsonb, 'B', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-27', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**27. En la segunda estrofa, ¿qué afirmación define mejor la concepción del «éxito» según el hablante lírico?**', '[{"letra": "A", "texto": "El éxito no radica en alcanzar un resultado final, sino en el esfuerzo y aprendizaje vivido a lo largo del proceso.", "es_correcta": true}, {"letra": "B", "texto": "El éxito consiste en conseguir medallas y reconocimientos públicos veloces.", "es_correcta": false}, {"letra": "C", "texto": "El éxito es acumular riquezas para construir una morada imponente.", "es_correcta": false}, {"letra": "D", "texto": "El éxito depende exclusivamente del favor y la suerte del destino.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-28', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**28. ¿A qué alude la expresión «te acercas y tropiezas / te lastimas y lloras» en la penúltima estrofa?**', '[{"letra": "A", "texto": "A las caídas, errores y frustraciones naturales e inevitables del crecimiento y maduración humana.", "es_correcta": true}, {"letra": "B", "texto": "A un accidente físico grave ocurrido durante la infancia del hijo.", "es_correcta": false}, {"letra": "C", "texto": "A la falta de cuidado y atención de los padres hacia el hijo.", "es_correcta": false}, {"letra": "D", "texto": "A la derrota en una competición deportiva escolar.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-29', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**29. En el verso «que en el dolor te mejoras», ¿qué visión sobre el sufrimiento se transmite?**', '[{"letra": "A", "texto": "Una visión formativa y resiliente, donde superar el dolor fortalece el temple y la madurez.", "es_correcta": true}, {"letra": "B", "texto": "Una visión trágica y pesimista que condena al ser humano a la angustia eterna.", "es_correcta": false}, {"letra": "C", "texto": "Una visión médica sobre la necesidad de resistir tratamientos físicos.", "es_correcta": false}, {"letra": "D", "texto": "Una visión de resignación pasiva ante el castigo divino.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-30', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**30. ¿Qué figura literaria predomina en la expresión «la vida es la arcilla» del verso final?**', '[{"letra": "A", "texto": "Metáfora.", "es_correcta": true}, {"letra": "B", "texto": "Hipérbole.", "es_correcta": false}, {"letra": "C", "texto": "Onomatopeya.", "es_correcta": false}, {"letra": "D", "texto": "Aliteración.", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-31', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**31. ¿Cuál es el significado de la metáfora de la «arcilla» en el contexto del poema?**', '[{"letra": "A", "texto": "Que la vida es una materia maleable que cada persona tiene la responsabilidad y libertad de moldear con sus acciones.", "es_correcta": true}, {"letra": "B", "texto": "Que la existencia humana es frágil y se desintegra fácilmente como el barro seco.", "es_correcta": false}, {"letra": "C", "texto": "Que el destino está predeterminado por el origen social de la familia.", "es_correcta": false}, {"letra": "D", "texto": "Que los objetos materiales no tienen ningún valor espiritual.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-32', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'media', NULL, '**32. ¿Qué relación afectiva y comunicativa se establece entre el emisor lírico y el receptor del poema?**', '[{"letra": "A", "texto": "Un vínculo de afecto paternal caracterizado por el consejo protector, la sabiduría y el aliento a la autonomía.", "es_correcta": true}, {"letra": "B", "texto": "Una relación distante y autoritaria basada en mandatos estrictos e incuestionables.", "es_correcta": false}, {"letra": "C", "texto": "Un lazo de rivalidad generacional entre padre e hijo.", "es_correcta": false}, {"letra": "D", "texto": "Una relación de dependencia económica mutua.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-33', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-2', 'seleccion_multiple', '2° Medio', 'baja', NULL, '**33. ¿Cuál es la estructura formal de rima predominante en las estrofas del poema?**', '[{"letra": "A", "texto": "Rima consonante cruzada o alterna (ABAB / CDCD).", "es_correcta": true}, {"letra": "B", "texto": "Rima asonante continua (AAAA).", "es_correcta": false}, {"letra": "C", "texto": "Verso libre sin rima ni métrica definida.", "es_correcta": false}, {"letra": "D", "texto": "Rima pareada (AABB).", "es_correcta": false}]'::jsonb, 'A', 1, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-34', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'media', NULL, '**34. ¿Qué actitud lírica asume el hablante en el poema?**', '[{"letra": "A", "texto": "Actitud apostrófica o apelativa, al dirigirse directamente a un ''tú'' (su hijo) para aconsejarlo.", "es_correcta": true}, {"letra": "B", "texto": "Actitud puramente enunciativa, limitándose a describir un paisaje exterior.", "es_correcta": false}, {"letra": "C", "texto": "Actitud carmínica introspectiva que solo habla de sí mismo sin dirigirse a nadie.", "es_correcta": false}, {"letra": "D", "texto": "Actitud épica de narración de batallas militares antiguas.", "es_correcta": false}]'::jsonb, 'A', 2, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW()),
    ('preg-len2m-e6-35', v_admin_id, 'asig-2', 'eje-len-1', 'hab-len-3', 'seleccion_multiple', '2° Medio', 'alta', NULL, '**35. ¿Cuál es el tema central o temple de ánimo que engloba a todo el poema?**', '[{"letra": "A", "texto": "El amor paternal como guía orientadora para afrontar con coraje y dignidad los desafíos de la vida.", "es_correcta": true}, {"letra": "B", "texto": "La nostalgia melancólica por la pérdida irremediable de la juventud.", "es_correcta": false}, {"letra": "C", "texto": "El miedo paralizante frente a la soledad de la vejez.", "es_correcta": false}, {"letra": "D", "texto": "La crítica social contra las dificultades de la vida moderna.", "es_correcta": false}]'::jsonb, 'A', 3, 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    asignatura_id = EXCLUDED.asignatura_id,
    eje_tematico_id = EXCLUDED.eje_tematico_id,
    habilidad_id = EXCLUDED.habilidad_id,
    tipo = EXCLUDED.tipo,
    nivel = EXCLUDED.nivel,
    dificultad = EXCLUDED.dificultad,
    imagen_url = EXCLUDED.imagen_url,
    enunciado = EXCLUDED.enunciado,
    alternativas = EXCLUDED.alternativas,
    respuesta_correcta = EXCLUDED.respuesta_correcta,
    puntaje = EXCLUDED.puntaje,
    fuente = EXCLUDED.fuente,
    updated_at = NOW();
END $insert_len2m$;

COMMIT;