import { Pregunta, EjeTematico, Prueba, AlumnoBasico, Curso, ReporteTabuladoCurso } from '../types';
import { currentUserProfesorPremilitar } from './mockData';

export const ejesTematicosLenguaje2MMock: EjeTematico[] = [
  { id: 'eje-len-2m-1', codigo: 'LEN-LIT-2M', nombre: 'Lectura de Textos Literarios (Narrativa y Epistolar)', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-2', codigo: 'LEN-NOLIT-2M', nombre: 'Lectura de Textos No Literarios (Expositivos y Científicos)', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-3', codigo: 'LEN-ARG-2M', nombre: 'Lectura Crítica de Textos Argumentativos y Medios Masivos', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-4', codigo: 'LEN-ESC-2M', nombre: 'Escritura y Fundamentación Textual (Desarrollo y Rúbricas)', asignaturaId: 'asig-2' }
];

export const cursoLenguaje2MMock: Curso = {
  id: 'curso-2m',
  nombre: '2° Medio',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  establecimiento: 'Escuela Premilitar Héroes de la Concepción',
  anio: 2026,
  codigoInvitacion: 'LEN2M2026'
};

export const alumnosLenguaje2MMock: AlumnoBasico[] = [];

export const pruebaLenguaje2MMock: Prueba = {
  id: 'prueba-len2m-101',
  titulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
  descripcion: 'Evaluación formativa oficial SIMCE (Agosto 2026): Textos expositivos, artículos de opinión, reportajes, divulgación científica botánica y literatura epistolar.',
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  cursoId: 'curso-2m',
  cursoNombre: '2° Medio',
  codigoPublico: 'SIMCE-2M-LEN-AGO',
  duracionMinutos: 90,
  creadoEn: '2026-08-16',
  preguntasIds: [
    'preg-len2m-01', 'preg-len2m-02', 'preg-len2m-03', 'preg-len2m-04', 'preg-len2m-05',
    'preg-len2m-06', 'preg-len2m-07', 'preg-len2m-08', 'preg-len2m-09', 'preg-len2m-10',
    'preg-len2m-11', 'preg-len2m-12', 'preg-len2m-13', 'preg-len2m-14', 'preg-len2m-15',
    'preg-len2m-16', 'preg-len2m-17', 'preg-len2m-18', 'preg-len2m-19', 'preg-len2m-20',
    'preg-len2m-21', 'preg-len2m-22', 'preg-len2m-23', 'preg-len2m-24', 'preg-len2m-25',
    'preg-len2m-26', 'preg-len2m-27', 'preg-len2m-28', 'preg-len2m-29', 'preg-len2m-30'
  ],
  totalPreguntas: 30,
  estado: 'activa'
};


export const preguntasLenguaje2MMock: Pregunta[] = [
  {
    id: 'preg-len2m-01',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 1: Lee el siguiente texto expositivo y contesta las preguntas de la 1 a la 4.\n\n### La paradisíaca cabaña en el sur de Chile que puedes arrendar con Airbnb\nAirbnb es la aplicación de moda entre los viajeros, porque puedes arrendar todo tipo de alojamiento en todo el mundo. Si tu próximo destino es el sur de Chile y buscas desconectarte completamente del ruido de la ciudad, esta pequeña cabaña frente al lago Rupanco seguro te sorprenderá.\nCon Airbnb puedes arrendar alojamientos en cualquier parte del mundo. Si quieres aprovechar las increíbles casas disponibles en Chile, hay varias opciones que puedes revisar. Y si tu idea es conectarte con la naturaleza y la magia del sur de Chile, a las orillas del lago Rupanco, en Los Lagos, hay una pequeña cabaña de Airbnb que seguro te encantará.\nEs una casa muy acogedora que está en la cima de una colina, con una vista impresionante del lago, las montañas y volcanes. Está ubicada en medio de un gran fundo donde podrás hacer todo tipo de actividades campestres y típicas del sur chileno, para que disfrutes de la naturaleza en todo su esplendor.\nEn el lugar hay senderos, cascadas, animales de granja y miradores, que podrás recorrer para vivir la experiencia completa.\nSi prefieres quedarte descansando, el alojamiento está ambientado para que lo hagas con todas las comodidades. Ojo, acá la idea es desconectarse, por lo que no hay televisión ni wifi, y apenas una compañía telefónica tiene señal en el sector.\nLa cabaña se divide en dos sectores: la habitación, con camas, sillones, un baño completo y calefacción a leña; y el quincho, que es un espacio abierto con la cocina, donde además hay una parrilla y una mesa con toda la vista al fundo.\nLa habitación tiene una cama matrimonial y otra nido, por lo que hay capacidad para cuatro personas. Además, los ventanales son enormes, porque la idea es que disfrutes de la naturaleza en todo momento.\n\n**Las evaluaciones**\n49 personas han evaluado este alojamiento, con un promedio de 5 estrellas. Muchos de los huéspedes que han alojado en esta cabaña de Airbnb destacan la atención y comodidad del lugar.\n\"Este lugar es maravilloso. Fuimos con mi marido y bebé de 1 año. Los animales, la flora y el lago es la combinación perfecta para dejar atónito a cualquiera. La vista es incomparable y la calidez de la gente que vive ahí es un plus enorme. Un vecino hasta nos dio una clase de horticultura en su huerta. Después nos invitó a cosechar frambuesas y arándanos. Los tábanos solo estaban alrededor del lago por lo que no pudimos hacer kayak. Pero en la casa no hubo más que un par, nada molesto\", comenta una de las personas que arrendó este alojamiento por Airbnb.\nOjo, que los dueños del fundo advierten que el lugar puede ser inseguro para niños y mascotas, porque tiene un balcón y estufa a leña.\n¿Quieres arrendarla? El precio por noche es de $ 70.000, e incluye todas las actividades disponibles en este gran fundo en Los Lagos.\n\n---\n\n**1. ¿Cuál es la función de Airbnb?**",
    alternativas: [
      { letra: 'A', texto: "Obtener alojamiento en el sur de Chile.", es_correcta: false },
      { letra: 'B', texto: "Conseguir alojamiento en cualquier lugar del mundo.", es_correcta: true },
      { letra: 'C', texto: "Desconectar a los usuarios del ruido de la ciudad.", es_correcta: false },
      { letra: 'D', texto: "Facilitar el arriendo de una cabaña en el lago Rupanco.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-02',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 1 (Continuación):\n\n**2. ¿Qué se puede afirmar sobre el entorno de la cabaña?**",
    alternativas: [
      { letra: 'A', texto: "Que el volcán se puede visitar a pie desde el alojamiento.", es_correcta: false },
      { letra: 'B', texto: "Que cuenta con un lago, al que no se puede acceder por la presencia de tábanos.", es_correcta: false },
      { letra: 'C', texto: "Que presenta un clima frío durante la mayor parte del año.", es_correcta: false },
      { letra: 'D', texto: "Que cuenta con múltiples paisajes que son visibles desde la cabaña por su ubicación en altura.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-03',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 1 (Continuación):\n\n**3. ¿Qué opción contiene información correcta sobre la cabaña?**",
    alternativas: [
      { letra: 'A', texto: "Puede albergar hasta cuatro huéspedes.", es_correcta: true },
      { letra: 'B', texto: "Tiene vista al lago, pero no a los volcanes.", es_correcta: false },
      { letra: 'C', texto: "Cuenta con dos dormitorios y un baño.", es_correcta: false },
      { letra: 'D', texto: "En el quincho, se pueden encontrar animales de granja.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-04',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 1 (Continuación):\n\n**4. ¿Qué implicancias tiene que no haya televisión ni wifi en la cabaña?**",
    alternativas: [
      { letra: 'A', texto: "Dificulta la comunicación con los dueños de la casa.", es_correcta: false },
      { letra: 'B', texto: "Imposibilita comunicarse en caso de emergencia.", es_correcta: false },
      { letra: 'C', texto: "Beneficia la desconexión y el disfrute del lugar.", es_correcta: true },
      { letra: 'D', texto: "Favorece la relación con vecinos y familiares.", es_correcta: false }
    ],
    respuestaCorrecta: "C",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-05',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 2: Lee el siguiente artículo de opinión y contesta de la pregunta 5 a la 11.\n\nUna cantidad no despreciable de intelectuales y estudiosos dedicados al comportamiento y prácticas sociales del nuevo siglo, han llamado sistemáticamente la atención sobre los alcances y consecuencias de las llamadas \"redes sociales virtuales\". Bajo esta denominación caben una serie de relaciones entre personas, grupos o asociaciones mayores con intereses comunes y cuyo canal de comunicación es internet. Los efectos de estas nuevas formas de relaciones humanas son insospechados y vale decir que esta verdadera revolución comunicacional no tiene precedente alguno a nivel de escala y masificación planetaria. Claramente, refleja una de las mayores expresiones de lo que en 1961 Marchall McLuhan llamó \"Aldea Global\".\nEn la actualidad, millones de personas de forma simultánea pueden acceder a través de Facebook, Twitter, Instagram o SnapChat a una misma noticia, fenómeno o acontecimiento desde distintas localizaciones geográficas y dar una opinión fundada o infundada sobre el particular. No obstante, los beneficios que estas redes conllevan en términos del acceso a toneladas de información cada segundo, no es menos cierto que estas se han transformado también en formas de ajusticiamiento social, repudio, condena e, incluso, incitación a la violencia contra grupos, nacionalidades o minorías adscritas a creencias u opciones específicas.\nEn un sentido, por ejemplo, las redes sociales han sido el medio por el cual puede ajusticiarse a un abusador sexual -hecho que en los últimos meses ha sido la tónica en Chile- exponiéndolo al escarnio público a través de una visibilización inmediata y lapidaria (acto que muchas veces avanza con mayor rapidez que la propia justicia institucional), lo que ha permitido probablemente -y a buena hora- que los índices de abuso vayan gradualmente disminuyendo por el pánico que suscita la exposición global de un acto irracional e inmoral que antes quedaba limitado a una escala menor, en los rincones de la burocracia del sistema penal. Todo ello, ha beneficiado claramente a las víctimas, que ven una justicia no solo legal sino social con mayores consecuencias nefastas para los victimarios.\nParalelamente, estas redes ha servido también para cometer las mayores injusticias contra todo tipo de personas y sin argumentos plausibles, dado el poco juicio y criterio que a veces impera para \"criticar\" y denostar a alguien. Si asumimos con profundidad que las redes sociales se convirtieron -sobre todo a partir del año 2000- en la herramienta más utilizada por la gente para resolver cuestiones privadas o públicas, además del éxito mediático asegurado por la repercusión inmediata que alcanzan, podemos observar que su utilización negativa ha socavado los cimientos de la prudencia y la sensatez humana. Este socavamiento puede ser el resultado de la poca empatía para ponerse en el lugar de ese otro al que se cuestiona, sin fundamento o simplemente por rencor injustificado. Aún más, solo por creer, a buenas y a primeras, que ese otro me ha ofendido o pasado a llevar o simplemente por el goce de un twittero anónimo de destruir, recordando que un gran porcentaje de los mensajes por redes sociales están dirigidos a ventilar errores estigmatizando a diversos usuarios y no usuarios de internet.\n\n---\n\n**5. ¿Cuál es una síntesis adecuada de los párrafos uno y dos del texto leído?**",
    alternativas: [
      { letra: 'A', texto: "Las consecuencias negativas de las redes sociales en el siglo XXI.", es_correcta: false },
      { letra: 'B', texto: "Los insospechados efectos de los medios de comunicación en la actualidad.", es_correcta: false },
      { letra: 'C', texto: "La magnitud que ha alcanzado Facebook, Twitter, Instagram y SnapChat.", es_correcta: false },
      { letra: 'D', texto: "La magnitud y los efectos del fenómeno social denominado \"redes sociales\".", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-06',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 2 (Continuación):\n\n**6. ¿Cuál es la idea principal del último párrafo?**",
    alternativas: [
      { letra: 'A', texto: "Las redes sociales han servido como medio para cometer actos de injusticia y poca empatía.", es_correcta: true },
      { letra: 'B', texto: "Los nefastos efectos que está ocasionando internet en la sociedad chilena y mundial en la actualidad.", es_correcta: false },
      { letra: 'C', texto: "El socavamiento de la sociedad actual es el resultado del mal manejo de los medios masivos de comunicación.", es_correcta: false },
      { letra: 'D', texto: "La doble cara de las redes sociales como medios de expresión social y cultural.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-07',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 2 (Continuación):\n\n**7. ¿Qué concepto acuñado por Marshall McLuhan en 1961 se menciona en el texto para reflejar la escala y masificación de las redes sociales virtuales?**",
    alternativas: [
      { letra: 'A', texto: "Redes de relaciones humanas", es_correcta: false },
      { letra: 'B', texto: "Revolución comunicacional", es_correcta: false },
      { letra: 'C', texto: "Aldea Global", es_correcta: true },
      { letra: 'D', texto: "Redes sociales virtuales", es_correcta: false }
    ],
    respuestaCorrecta: "C",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-08',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 2 (Continuación):\n\n**8. Según el fragmento, ¿a partir de qué año las redes sociales se convirtieron en la herramienta más utilizada por la gente para resolver cuestiones privadas o públicas?**",
    alternativas: [
      { letra: 'A', texto: "1961", es_correcta: false },
      { letra: 'B', texto: "2000", es_correcta: true },
      { letra: 'C', texto: "2010", es_correcta: false },
      { letra: 'D', texto: "2020", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-09',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 2 (Continuación):\n\n**9. ¿Cuál de las siguientes preguntas sintetiza el contenido del texto leído?**",
    alternativas: [
      { letra: 'A', texto: "¿Cuál es el peligro de las redes sociales en los últimos años?", es_correcta: false },
      { letra: 'B', texto: "¿Cuál es el impacto de las redes sociales como medio de expresión?", es_correcta: false },
      { letra: 'C', texto: "¿En qué consisten los análisis sobre las relaciones humanas en la actualidad?", es_correcta: false },
      { letra: 'D', texto: "¿Cuál es el efecto de las redes sociales y su relación con la prudencia, la justicia y la empatía en el ser humano actual?", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-10',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 2 (Continuación):\n\n**10. ¿Qué efecto positivo destaca el autor respecto al rol de las redes sociales frente a delitos como el abuso sexual?**",
    alternativas: [
      { letra: 'A', texto: "Que sustituyen de manera definitiva al sistema penal institucional.", es_correcta: false },
      { letra: 'B', texto: "Que generan un escarnio público inmediato que inhibe la reiteración de conductas por temor a la exposición.", es_correcta: true },
      { letra: 'C', texto: "Que garantizan indemnizaciones económicas inmediatas a las familias afectadas.", es_correcta: false },
      { letra: 'D', texto: "Que eliminan por completo la necesidad de presentar denuncias ante la justicia.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-11',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 2 (Continuación):\n\n**11. A partir de lo expuesto en el tercer y cuarto párrafo sobre el \"ajusticiamiento social\" en las redes sociales, se puede inferir que el autor considera que este fenómeno:**",
    alternativas: [
      { letra: 'A', texto: "Es la solución definitiva y más justa para erradicar los delitos burocráticos del sistema penal.", es_correcta: false },
      { letra: 'B', texto: "Es un mecanismo de doble filo que, aunque expone abusos, carece de filtros de prudencia, sensatez y empatía.", es_correcta: true },
      { letra: 'C', texto: "Tiene como único objetivo principal el goce anónimo de destruir la reputación de personas inocentes.", es_correcta: false },
      { letra: 'D', texto: "Sustituirá por completo a la justicia institucional debido a su rapidez y visibilización inmediata.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-12',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 3: Lee el siguiente fragmento de reportaje y contesta las preguntas de la 12 a la 17.\n\n### La clase media en Chile: Vive su momento más heterogéneo\nEl imaginario colectivo puede recrear con precisión al hombre medio de hace cuarenta años o más. Un tipo que terminó el colegio, pero que no necesitó pasar por la universidad para encontrar un trabajo estable en el sistema público. Que llegaba a fin de mes casi sin apuros y que seguramente adhería a un partido político, ¿su sueño cumplido? La casa propia.\n\n**Los cambios de una clase social**\nEl escenario cambió después de los setenta. El nuevo sistema económico desvaneció el rol protector del Estado y la movilidad social ya no es protagonizada por grandes grupos de población: la migración campo-ciudad entre 1920 y 1960 permitió mejorar el piso económico a un grupo importante de la población de ese entonces. Hoy, esa movilidad es individual. Y es ascendente y descendente, lo que desordena la baraja especialmente de la clase media, el grupo al que entre el 60% y 80% de la población dice pertenecer (aunque solo abarca alrededor del 45% de ella). Décadas atrás, no llegaban al 30% de la población.\nLa clase media está en el momento de mayor diversidad en el último siglo. Rompió los moldes de hace unas décadas. Está compuesta por distintas capas demasiado disímiles entre sí. Si antes entregaba una imagen de un grupo homogéneo, hoy su composición es heterogénea y sus miembros están unidos solo por un rango económico. Quienes pertenecen a ella evocan ideas muy confrontadas para definirse dentro de este grupo, como educación, esfuerzo, trabajo, tranquilidad, casa propia, auto, deudas o vivir con lo justo. Más profundo aún, quienes la componen no tienen una identidad clara, porque no encuentran un relato que las acompañe en el tiempo.\nEsa clase media que nos imaginamos hace algunas décadas y que tenía condiciones tan identificables como objetivos de vida ya no existe y una persona de clase media hoy tiene poco que ver con ese pasado. \"Tienen una identidad bastante revuelta y les cuesta definir quiénes son. La definición de superficie está: 'sí, soy de clase media'. Pero no pueden ir más allá de eso\", explica Emmanuelle Barozet, académica de la U. de Chile y directora del Proyecto Desigualdades. En casi una decena de focus group con personas de clase media, Barozet les escuchó ideas que servían de base: llegar a fin de mes sin apuro, tener una casa y una jubilación decente. \"Pero si fuera de clase media no me debería ir tan mal. No debería llegar a fin de mes con sobresaltos\" decían. También desconocían el rol del Estado: si antes el Estado jugaba un rol protector, hoy una persona de clase media desconoce su papel: trabaja para una empresa, el sistema de salud pertenece al sector privado, su jubilación también y si tiene casa propia la puede perder si un familiar se enferma de gravedad. El Estado existe para subsidiar a los pobres, no a ellos.\n\n---\n\n**12. ¿Qué porcentaje de la población dice pertenecer a la clase media hoy en día, según los datos expuestos en el texto?**",
    alternativas: [
      { letra: 'A', texto: "Alrededor del 45%", es_correcta: false },
      { letra: 'B', texto: "Entre el 60% y 80%", es_correcta: true },
      { letra: 'C', texto: "Menos del 30%", es_correcta: false },
      { letra: 'D', texto: "Exactamente el 50%", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-13',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: "Lectura 3 (Continuación):\n\n**13. ¿Qué fenómeno histórico ocurrido entre 1920 y 1960 permitió mejorar el piso económico a un grupo importante de la población de ese entonces?**",
    alternativas: [
      { letra: 'A', texto: "La creación del Proyecto Desigualdades.", es_correcta: false },
      { letra: 'B', texto: "El nuevo sistema económico implantado después de los setenta.", es_correcta: false },
      { letra: 'C', texto: "La migración campo-ciudad.", es_correcta: true },
      { letra: 'D', texto: "El ingreso masivo a la educación universitaria.", es_correcta: false }
    ],
    respuestaCorrecta: "C",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-14',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 3 (Continuación):\n\n**14. ¿Cuál es la idea central del segundo párrafo?**",
    alternativas: [
      { letra: 'A', texto: "Actualmente, la movilidad social es experimentada por individuos y no por grandes grupos, como ocurría antes.", es_correcta: true },
      { letra: 'B', texto: "La movilidad social se caracteriza por ser ascendente y descendente en gran parte de la población.", es_correcta: false },
      { letra: 'C', texto: "Las consecuencias del escenario político y económico de los años 60 en el desarrollo de Chile en la actualidad.", es_correcta: false },
      { letra: 'D', texto: "Entre los años 1920 y 1960 Chile experimentó la movilidad social más importante de su historia.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-15',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 3 (Continuación):\n\n**15. ¿Cuál es la idea principal del penúltimo párrafo del texto leído?**",
    alternativas: [
      { letra: 'A', texto: "Los miembros de la clase media están vinculados, principalmente, por un aspecto económico.", es_correcta: false },
      { letra: 'B', texto: "La ideología de la clase media no ha sido homogénea en Chile.", es_correcta: false },
      { letra: 'C', texto: "La clase media chilena propiamente tal, se conformó a fines del siglo XX.", es_correcta: false },
      { letra: 'D', texto: "La clase media está conformada por un grupo heterogéneo y diverso de individuos sin un relato unificado.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-16',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 3 (Continuación):\n\n**16. ¿Cuál es la idea fundamental del último párrafo?**",
    alternativas: [
      { letra: 'A', texto: "La diversidad de formas de vida de los miembros de la clase media.", es_correcta: false },
      { letra: 'B', texto: "Los sujetos que pertenecen a la clase media viven disconformes su realidad.", es_correcta: false },
      { letra: 'C', texto: "No existe voluntad por parte del gobierno para definir claramente a la clase media.", es_correcta: false },
      { letra: 'D', texto: "La falta de una identidad clara y homogénea en la clase media actual junto a la desprotección estatal percibida.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-17',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 3 (Continuación):\n\n**17. ¿Qué pregunta sintetiza correctamente la información de la lectura anterior?**",
    alternativas: [
      { letra: 'A', texto: "¿Cuáles eran las características de las clases sociales en Chile en las décadas pasadas?", es_correcta: false },
      { letra: 'B', texto: "¿En qué se diferencian la clase media actual y la de décadas anteriores en Chile?", es_correcta: true },
      { letra: 'C', texto: "¿Por qué en la actualidad la clase media provoca ambigüedad identitaria en los individuos?", es_correcta: false },
      { letra: 'D', texto: "¿Cuáles son las contradicciones presentes en la clase media en la actualidad?", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-18',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4: Lea el siguiente artículo periodístico y conteste las preguntas de la 18 a la 25.\n\n### Los tejocotes en la medicina tradicional y su potencial terapéutico\nLos tejocotes pertenecen a un género de plantas cuya taxonomía no ha sido aún bien establecida. Sin embargo, se han destacado por su uso en la medicina tradicional e incluso se han empleado para producir medicamentos herbolarios. Debido a sus propiedades, los estudios farmacológicos demuestran su efectividad, seguridad y eficacia, principalmente para el tratamiento de algunas enfermedades cardiovasculares.\n\n**Taxonomía, distribución geográfica y botánica**\nDesentrañar la taxonomía del género *Crataegus* es muy complejo: pertenece a la familia Rosaceae y subfamilia Maloideae; en México, las especies de este género son conocidas como tejocotes (Cervantes-Paz y cols., 2018) y en Europa se les llama espinos. Las especies de *Crataegus* se encuentran en las zonas templadas del norte de América, Asia Oriental y Central y Europa. Algunos autores reportan 1 000 especies distribuidas en Asia y Europa (Alirezalu y cols., 2020), mientras que otros indican que hay 1.200 especies en todo el mundo (Cervantes-Paz y cols., 2018), de las cuales entre 150 y 200 se localizan en el continente americano y tan sólo 15 especies están en México (García-Mateos y cols., 2012). La descripción botánica de *C. mexicana* indica que son arbustos grandes, o bien árboles pequeños; en la Figura 1 se muestra el árbol, las frutas y las flores del tejocote (Lesur, 2017).\n\n**Uso tradicional**\nEn distintas regiones, los frutos de este género se consumen de manera directa, o bien son utilizados como materia prima para elaborar mermeladas, jaleas, vino, jugo y diversos alimentos dulces. Para estos usos tradicionales, principalmente se cultivan algunas especies, como *C. pinnatifida* en Asia Oriental; *C. azarolus* y *C. germanica* en Europa, y *C. mexicana* y *C. opaca* en América.\nDiferentes partes de la planta también se pueden utilizar en la medicina tradicional para tratar la diarrea, el insomnio, la enfermedad de la vesícula biliar y algunas patologías respiratorias (tos, gripe, bronquitis y asma) (García-Mateos y cols., 2012). En el libro de Materia Médica, escrito en el siglo I de nuestra era por Dioscorides, se mencionan por primera vez los remedios elaborados a partir de las hojas y flores del género *Crataegus* para curar las enfermedades cardíacas; asimismo, en la medicina tradicional china el uso de estas plantas aparece registrado en la primera farmacopea, Tang Ben Cao, en el año 659. Hasta el siglo XIX se documentó su uso en América para tratar diversas enfermedades cardiacas (Nabavi y cols., 2015).\nEn 1930 se comenzó la investigación científica de las preparaciones de *Crataegus*, y en 1941 los extractos (infusiones, maceraciones, tinturas y decocciones acuosas) de esta planta se describieron en la farmacopea alemana. En 2016, la Asociación Médica Europea, por conducto del Comité de Medicamentos a Base de Hierbas, declaró la validez del uso tradicional de *Crataegus* para tratar problemas cardiacos (Holubarsch y cols., 2018) y en la actualidad se tienen extractos estandarizados, entre los cuales los más estudiados y conocidos son el WS 1442 (CardioMax) y el Li 132, los cuales son utilizados para el tratamiento de la insuficiencia cardíaca y de la hipertensión. En el continente europeo se permite usar las hojas, flores y frutas para tratar los padecimientos cardíacos debido a que estos tejidos vegetales poseen efectos antiespasmódicos, cardiotónicos, hipotensores y antiateroscleróticos (Nabavi y cols., 2015).\n\n**Propiedades farmacológicas del género Crataegus**\nAdemás de utilizarse para tratar diversas enfermedades, sobre todo cardiovasculares, también hay evidencias que demuestran otras actividades biológicas de las especies de *Crataegus spp.* Algunos estudios señalan los efectos sobre el sistema digestivo para proteger la mucosa gástrica; adicionalmente, los tejocotes ayudan a tratar la diabetes y la obesidad, tienen actividad antimicrobiana y actúan contra algunos parásitos protozoarios. También son anticancerígenos, antioxidantes y resultan benéficos para el sistema nervioso gracias a sus efectos ansiolíticos, además de que cuentan con actividad antiinflamatoria e inmunomoduladora (García-Mateos y cols., 2012).\nCon respecto a las propiedades para tratar padecimientos cardiovasculares, se ha comprobado que *Crataegus* posee efectos antiateroscleróticos que ayudan al tratamiento para la insuficiencia cardiaca crónica clase II según la New York Heart Association. Asimismo, se ha reportado su efecto inotrópico positivo, efecto remodelador anticardiaco, efecto de agregación antiplaquetaria, protección contra la lesión por isquemia/reperfusión y acción antiarrítmica. También hay estudios de su efecto vasodilatador, el cual se produce por la vía del óxido nítrico dependiente del endotelio (Cervantes-Paz y cols., 2018; Nabavi y cols., 2015).\n\n**Uso en la medicina tradicional**\nEl género *Crataegus* se ha utilizado desde la antigüedad en la medicina tradicional para tratar diferentes padecimientos a partir de las evidencias de sus propiedades farmacológicas, principalmente para el tratamiento de enfermedades cardiovasculares, como la insuficiencia cardiaca y la hipertensión. Todas estas propiedades farmacológicas se deben al contenido de sus principales compuestos bioactivos, los cuales pueden tener a futuro otras aplicaciones terapéuticas.\n\n*Diana López Fitz — Facultad de Química, Universidad Autónoma de Querétaro.*\n\n---\n\n**18. ¿Cuál es el propósito comunicativo del primer párrafo?**",
    alternativas: [
      { letra: 'A', texto: "Presentar de manera sintética los temas que se abordarán en el artículo.", es_correcta: true },
      { letra: 'B', texto: "Mencionar los beneficios médicos que posee el consumo de tejocotes.", es_correcta: false },
      { letra: 'C', texto: "Persuadir acerca de la eficacia médica de consumir tejocotes.", es_correcta: false },
      { letra: 'D', texto: "Introducir los estudios taxonómicos sobre los tejocotes.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-19',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**19. ¿Con qué finalidad se menciona a Dioscorides y Tang Ben Cao en el texto?**",
    alternativas: [
      { letra: 'A', texto: "Para hacer un recorrido histórico sobre el Crataegus.", es_correcta: false },
      { letra: 'B', texto: "Para destacar a dos estudiosos antiguos que escribieron sobre el uso curativo del Crataegus.", es_correcta: false },
      { letra: 'C', texto: "Para presentar las principales influencias que recibió la medicina americana en el siglo XIX.", es_correcta: false },
      { letra: 'D', texto: "Para demostrar la antigüedad milenaria de los estudios sobre el uso medicinal del género Crataegus.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-20',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_len_2m/image1.jpeg',
    enunciado: "Lectura 4 (Continuación):\n\n*Figura 1: Representación botánica del árbol, frutos y flores de tejocote (Crataegus mexicana)*\n\n**20. ¿Qué función comunicativa tiene la figura en el artículo?**",
    alternativas: [
      { letra: 'A', texto: "Mostrar diversos tipos de Crataegus mexicana.", es_correcta: false },
      { letra: 'B', texto: "Ilustrar visualmente las partes botánicas de la planta del tejocote (árbol, flores y frutos).", es_correcta: true },
      { letra: 'C', texto: "Representar el ciclo vital de la planta Crataegus mexicana.", es_correcta: false },
      { letra: 'D', texto: "Contrastar las características del tejocote con las del espino.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-21',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**21. ¿Con qué finalidad se mencionan distintos años (siglo I, 659, 1930, 1941, 2016) en el artículo?**",
    alternativas: [
      { letra: 'A', texto: "Para precisar cuándo ocurrieron ciertos hitos y organizarlos temporalmente en una cronología científica.", es_correcta: true },
      { letra: 'B', texto: "Para evidenciar que la emisora es experta en herbología e historia botánica.", es_correcta: false },
      { letra: 'C', texto: "Para demostrar que el interés científico por el tejocote ha trascendido las barreras temporales.", es_correcta: false },
      { letra: 'D', texto: "Para graficar que los avances científicos en torno al tejocote fueron espaciados temporalmente.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-22',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**22. ¿Qué elemento mencionado en el texto tiene la función discursiva de ejemplificar especies cultivadas tradicionalmente?**",
    alternativas: [
      { letra: 'A', texto: "C. azarolus, C. germanica, C. pinnatifida y C. mexicana.", es_correcta: true },
      { letra: 'B', texto: "La farmacopea alemana de 1941.", es_correcta: false },
      { letra: 'C', texto: "Los efectos antiespasmódicos e hipotensores.", es_correcta: false },
      { letra: 'D', texto: "El Comité de medicamentos a base de hierbas.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-23',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**23. ¿Cuál es el propósito del apartado titulado \"Propiedades farmacológicas del género Crataegus\"?**",
    alternativas: [
      { letra: 'A', texto: "Exponer los avances médicos asociados a los tejocotes.", es_correcta: false },
      { letra: 'B', texto: "Enumerar y detallar los diversos beneficios biológicos y médicos comprobados que poseen los tejocotes.", es_correcta: true },
      { letra: 'C', texto: "Persuadir acerca del consumo de tejocotes con finalidad médica.", es_correcta: false },
      { letra: 'D', texto: "Explicar cómo los componentes de los tejocotes actúan en el cuerpo humano.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-24',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**24. ¿Cuál es la intención comunicativa predominante del texto anterior?**",
    alternativas: [
      { letra: 'A', texto: "Persuadir a la comunidad médica sobre el uso de tejocotes.", es_correcta: false },
      { letra: 'B', texto: "Relatar la historia científica de los tejocotes en la medicina.", es_correcta: false },
      { letra: 'C', texto: "Exponer datos botánicos, tradicionales y farmacológicos rigurosos sobre los tejocotes y sus aplicaciones terapéuticas.", es_correcta: true },
      { letra: 'D', texto: "Explicar biológicamente el uso del tejocote en la medicina tradicional.", es_correcta: false }
    ],
    respuestaCorrecta: "C",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-25',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 4 (Continuación):\n\n**25. ¿Con qué propósito se incluye \"Facultad de Química, Universidad Autónoma de Querétaro\" al pie del texto?**",
    alternativas: [
      { letra: 'A', texto: "Para señalar la institución que llevó a cabo las investigaciones mencionadas en el artículo.", es_correcta: false },
      { letra: 'B', texto: "Para respaldar la validez y rigurosidad de la información, situando a la autora como especialista respaldada por una institución académica.", es_correcta: true },
      { letra: 'C', texto: "Para destacar que la Universidad mencionada se interesa por el tema abordado en el artículo.", es_correcta: false },
      { letra: 'D', texto: "Para resaltar que el estudio se realizó en un país y ciudad específica y sus resultados se vinculan con ese lugar.", es_correcta: false }
    ],
    respuestaCorrecta: "B",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-26',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 5: Lee el siguiente fragmento de libro y contesta las preguntas de la 26 a la 30.\n\n¡Estoy tan cansado de polémicas, de exclusividades, de fanatismos! En tu casa puedo entrar sin vestirme con un uniforme, sin someterme a la recitación de un Corán, sin renunciar a nada de mi patria interior. Junto a ti no tengo ya que disculparme, no tengo que defenderme, no tengo que probar nada. Como en Tournus, hallo la paz. Más allá de mis palabras torpes, más allá de los razonamientos que me pueden engañar, tú consideras en mí simplemente al Hombre, tú honras en mí al embajador de creencias, de costumbres, de amores particulares. Si difiero de ti, lejos de menoscabarte, te engrandezco. Me interrogas como se interroga al viajero.\nYo, que como todos, experimento la necesidad de ser reconocido, me siento puro en ti y voy hacia ti. Tengo necesidad de ir allí donde soy puro. Jamás han sido mis fórmulas ni mis andanzas las que te informaron acerca de lo que soy, sino que la aceptación de quien soy te ha hecho, necesariamente, indulgente para con esas andanzas y esas fórmulas. Te estoy agradecido porque me recibes tal como soy. ¿Qué he de hacer con un amigo que me juzga? Si recibo a un amigo en mi mesa, le ruego que se siente, si renguea, pero no le pido que baile.\nAmigo mío, tengo necesidad de ti como de una cumbre donde se puede respirar. Tengo necesidad de acodarme junto a ti, una vez más a orillas del Saona, sobre la mesa de una pequeña hostería de tablones desunidos, y de invitar allí a dos marineros en cuya compañía brindaremos en la paz de una sonrisa semejante al día. Si todavía combato, combatiré un poco por ti. Tengo necesidad de ti para creer mejor en el advenimiento de esa sonrisa. Tengo necesidad de ayudarte a vivir (...)\n\n*Fuente: Antoine de Saint-Exupéry, 1972. Carta a un rehén (fragmento).*\n\n---\n\n**26. De la lectura del fragmento anterior, ¿qué es válido deducir del emisor?**",
    alternativas: [
      { letra: 'A', texto: "Que aspira quedarse a vivir permanentemente en casa de su amigo.", es_correcta: false },
      { letra: 'B', texto: "Que busca la complicidad de su amigo en todas las cosas de su vida.", es_correcta: false },
      { letra: 'C', texto: "Que quiere que su amigo tenga el mismo pensamiento de él.", es_correcta: false },
      { letra: 'D', texto: "Que anhela estar libre de cualquier imposición, dogma o juicio a su individualidad y voluntad.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-27',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 5 (Continuación):\n\n**27. Del párrafo dos, ¿qué es posible inferir del emisor?**",
    alternativas: [
      { letra: 'A', texto: "Que busca la empatía.", es_correcta: false },
      { letra: 'B', texto: "Que busca el afecto.", es_correcta: false },
      { letra: 'C', texto: "Que busca la compañía.", es_correcta: false },
      { letra: 'D', texto: "Que busca la pureza espiritual y la autenticidad libre de máscaras.", es_correcta: true }
    ],
    respuestaCorrecta: "D",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-28',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: "Lectura 5 (Continuación):\n\n**28. Del último párrafo del texto, ¿qué es posible inferir de la amistad entre el emisor del fragmento y su amigo?**",
    alternativas: [
      { letra: 'A', texto: "Que está basada en un sentimiento fraternal sincero, profundo y de mutuo refugio vital.", es_correcta: true },
      { letra: 'B', texto: "Que se caracteriza por presentar sentimientos propios de un amor de pareja.", es_correcta: false },
      { letra: 'C', texto: "Que comenzó a muy temprana edad, debido a la compatibilidad de caracteres.", es_correcta: false },
      { letra: 'D', texto: "Que se sustenta gracias a que ambos tienen similares intereses en la vida.", es_correcta: false }
    ],
    respuestaCorrecta: "A",
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-29',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-4',
    habilidadId: 'hab-len-3',
    tipo: 'desarrollo',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 5 (Continuación — Pregunta de Desarrollo):\n\n**29. ¿El autor considera que la verdadera amistad debe ser completamente incondicional y libre de juicios?**\n\nResponde con un **Sí** o un **No** y justifica tu respuesta localizando dos ejemplos o frases específicas del segundo párrafo que muestren la postura del narrador frente a las opiniones o juicios de un amigo.\n\n*(Rúbrica: 2 Puntos: Respuesta afirmativa + 2 citas textuales o paráfrasis precisas del párrafo 2; 1 Punto: Respuesta afirmativa + 1 cita; 0 Puntos: Respuesta negativa o sin justificación).*",
    alternativas: [],
    respuestaCorrecta: "Sí. Justificación: El narrador rechaza ser juzgado ('¿Qué he de hacer con un amigo que me juzga?') y enfatiza la aceptación incondicional ('Te estoy agradecido porque me recibes tal como soy' / 'Si recibo a un amigo en mi mesa, le ruego que se siente, si renguea, pero no le pido que baile').",
    puntaje: 2,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  },

  {
    id: 'preg-len2m-30',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-4',
    habilidadId: 'hab-len-3',
    tipo: 'desarrollo',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: "Lectura 5 (Continuación — Pregunta de Desarrollo):\n\n**30. ¿Sugiere el texto que las diferencias de opinión o de origen entre dos personas debilitan el vínculo de su amistad?**\n\nResponde con un **Sí** o un **No** y justifica tu respuesta citando un ejemplo textual extraído del primer párrafo donde el autor explique qué sucede cuando él \"difiere\" de su amigo.\n\n*(Rúbrica: 2 Puntos: Respuesta negativa + cita textual exacta del párrafo 1; 1 Punto: Respuesta negativa + paráfrasis incompleta; 0 Puntos: Respuesta afirmativa o errónea).*",
    alternativas: [],
    respuestaCorrecta: "No. Justificación: El autor afirma explícitamente en el primer párrafo: 'Si difiero de ti, lejos de menoscabarte, te engrandezco', señalando que las diferencias enriquecen la relación humana en vez de debilitarla.",
    puntaje: 2,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026'
  }
];
