import { Pregunta, Prueba } from '../types';

export const pruebaLenguaje2MAbrilMock: Prueba = {
  id: 'prueba-len2m-abr-101',
  titulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026',
  descripcion: 'Evaluación formativa SIMCE (Abril 2026): La Gran Muralla China, Biografía de María Tudor, Fundamentos de la Antropología, Nutrición y Desayuno, Cuento Ladrón de sábado (G. García Márquez) y Gladiador de la Pluma (Rogelio Fernández Güell).',
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  cursoId: 'curso-2m',
  cursoNombre: '2° Medio',
  codigoPublico: 'SIMCE-2M-LEN-ABR',
  duracionMinutos: 90,
  creadoEn: '2026-04-15',
  preguntasIds: [
    'preg-len2m-abr-01', 'preg-len2m-abr-02', 'preg-len2m-abr-03', 'preg-len2m-abr-04', 'preg-len2m-abr-05',
    'preg-len2m-abr-06', 'preg-len2m-abr-07', 'preg-len2m-abr-08', 'preg-len2m-abr-09', 'preg-len2m-abr-10',
    'preg-len2m-abr-11', 'preg-len2m-abr-12', 'preg-len2m-abr-13', 'preg-len2m-abr-14', 'preg-len2m-abr-15',
    'preg-len2m-abr-16', 'preg-len2m-abr-17', 'preg-len2m-abr-18', 'preg-len2m-abr-19', 'preg-len2m-abr-20',
    'preg-len2m-abr-21', 'preg-len2m-abr-22', 'preg-len2m-abr-23', 'preg-len2m-abr-24', 'preg-len2m-abr-25',
    'preg-len2m-abr-26', 'preg-len2m-abr-27', 'preg-len2m-abr-28', 'preg-len2m-abr-29', 'preg-len2m-abr-30'
  ],
  totalPreguntas: 30,
  estado: 'activa'
};

const LECTURA_1 = `Lectura 1: Lee el siguiente texto expositivo y responde las preguntas de la 1 a la 3.

### La Gran Muralla China

1. En realidad no es una gran muralla. Lo que muchos han considerado la octava maravilla del mundo antiguo es más bien un entramado de muros y distintas estructuras defensivas construidas a lo largo del tiempo, bajo el mandato de diferentes dinastías y de forma dispar. Hasta el siglo XVI la construcción se hizo con tierra compactada.

2. El propósito de tamaña obra de ingeniería y arquitectura militar fue el de proteger a los diferentes imperios chinos de los ataques de los pueblos nómadas de las estepas del norte, conocidos genéricamente como hunos y mongoles. Con una longitud de más de 20.000 kilómetros desde el paso de Jiayuguan en el oeste hasta la costa este en Shanhaiguan, el muro atraviesa montañas, desiertos y valles, adaptándose al terreno con una monumentalidad asombrosa.`;

const LECTURA_2 = `Lectura 2: Lee la siguiente biografía histórica y responde las preguntas de la 4 a la 9.

### María Tudor: Un Reinado Sangriento

María I pasó a la historia no solo por ocupar el trono de Inglaterra, sino sobre todo por haber sido llamada *María la sangrienta*, nombre que en inglés es *Bloody Mary*, el mismo que se utiliza para el famoso cóctel inspirado en su apodo. En realidad, distintos hechos inesperados hicieron que María Tudor llegara al trono de Inglaterra, ya que lo cierto es que no estaba en la línea sucesoria directa como primogénita legítima para gobernar.

Hija de Enrique VIII y de su primera esposa, Catalina de Aragón, María fue declarada bastarda oficial y despojada de su título de princesa cuando su padre se divorció de su madre para casarse con Ana Bolena. Durante años vivió apartada de la corte, sufriendo humillaciones y persecuciones por mantener su férrea fe católica. Fue gracias a la intervención de Jane Seymour, la tercera esposa del rey, que María fue reintegrada parcialmente a la familia real.

Tras la muerte de Enrique VIII, subió al trono su medio hermano menor Eduardo VI, quien consolidó el protestantismo como religión oficial en Inglaterra por primera vez. Al morir prematuramente Eduardo VI a los 15 años, un grupo de nobles protestantes proclamó reina a Jane Grey para evitar la restauración católica. Sin embargo, María contó con un masivo respaldo popular, marchó sobre Londres y fue coronada legítimamente reina de Inglaterra en 1553. Durante su reinado de cinco años, María restableció el catolicismo y persiguió con implacable severidad a los líderes protestantes, enviando a la hoguera a cerca de trescientos disidentes religiosos, lo que forjó su temible reputación histórica.`;

const LECTURA_3 = `Lectura 3: Lee el siguiente artículo divulgativo y contesta las preguntas de la 10 a la 13.

### Introducción a la Antropología

"La antropología se divide en dos grandes áreas: la antropología física, que busca descubrir, describir y clasificar los rasgos físicos que diferencian a los seres humanos de las demás criaturas vivientes, y aquellos otros rasgos que distinguen las variedades dentro de la misma familia humana, y la antropología cultural y social, que se ocupa de la descripción y comparación de las civilizaciones y pueblos, analizando sus costumbres, estructuras de parentesco, mitos, lenguaje y organización económica.

Desde la antigüedad clásica ha existido curiosidad por el estudio de las diversas sociedades humanas. Ya en el siglo V a.C., Heródoto de Halicarnaso describió minuciosamente las costumbres, vestimentas y creencias de pueblos tan distantes como los egipcios, persas y escitas, sentando las bases proto-científicas de la observación etnográfica.

Sin embargo, fue a partir del siglo XV, con el descubrimiento del Nuevo Mundo y los grandes viajes de exploración ultramarina, cuando la civilización europea dispuso de una cantidad masiva de información sobre pueblos y culturas previamente desconocidos. Aunque inicialmente estos relatos estuvieron teñidos de sesgos y visiones eurocéntricas, constituyeron el material empírico fundamental que, junto con el avance de la geología y la paleontología en los siglos XVIII y XIX, permitió consolidar a la antropología como una disciplina científica moderna."`;

const LECTURA_4 = `Lectura 4: Lee el siguiente artículo de divulgación sobre nutrición y responde las preguntas de la 14 a la 19.

### ¿Es la pizza un desayuno más saludable que el cereal?

La pizza de desayuno suena extraño, pero tiene beneficios nutricionales frente a los cereales azucarados según expertos. Te decimos por qué podría ser una buena opción mañanera.

¿Te has preguntado alguna vez si la pizza podría ser una opción más saludable que los cereales para el desayuno? Según la nutricionista Chelsey Amer, una porción promedio de pizza contiene un balance más equilibrado de proteínas, carbohidratos complejos y grasas en comparación con un tazón de cereal refinado con leche, el cual suele aportar una descarga masiva de azúcares simples sin suficiente saciedad.

De acuerdo con datos del Departamento de Agricultura de EE.UU. (USDA), muchos cereales comerciales contienen hasta un 50% de azúcar añadido por porción, lo que genera un rápido pico de glucosa seguido de un bajón de energía a media mañana. En cambio, una porción de pizza elaborada con ingredientes tradicionales ofrece proteínas del queso y carbohidratos de la masa que prolongan la sensación de saciedad.

No obstante, los nutricionistas advierten que esto no significa que la pizza deba convertirse en el desayuno diario obligatorio, dado su contenido de sodio y grasas saturadas. La recomendación de los especialistas es optar por alternativas integrales, huevos, frutas frescas y yogur sin azúcar, dejando la pizza ocasional como un desayuno alternativo bien aprovechado.`;

const LECTURA_5 = `Lectura 5: Lee el siguiente cuento de Gabriel García Márquez y contesta las preguntas de la 20 a la 24.

### Ladrón de sábado
**Por Gabriel García Márquez**

Hugo, un ladrón que solo roba los fines de semana, entra en una casa un sábado por la noche. Ana, la dueña, una treintañera guapa e insomne empedernida, lo descubre in fraganti. Amenazada con la pistola, la mujer le entrega todas las joyas y cosas de valor, y le pide que no se acerque a Pauli, su niña de tres años. Sin embargo, la niña lo ve, y él la conquista con algunos trucos de magia. Hugo piensa: «¿Por qué irse tan pronto, si se está tan bien aquí?» Podría quedarse todo el fin de semana y gozar plenamente la situación, pues el marido -lo sabe porque los ha espiado- no regresa de su viaje de negocios hasta el domingo en la noche. El ladrón no lo piensa mucho: se pone los pantalones del señor de la casa y le pide a Ana que cocine para él, que saque el vino de la cava y que ponga algo de música para cenar, porque sin música no puede vivir.

A Ana, preocupada por Pauli, mientras prepara la cena se le ocurre algo para sacar al tipo de su casa. Pero no puede hacer gran cosa porque Hugo cortó los cables del teléfono, la casa está muy alejada, es de noche y nadie va a llegar. Ana decide poner una pastilla para dormir en la copa de Hugo. Durante la cena, el ladrón, que entre semana es velador de un banco, descubre que Ana es la conductora de su programa favorito de radio, el programa de música popular que oye todas las noches, sin falta. Hugo es su gran admirador y mientras escuchan al gran Benny cantando *Cómo fue* en un casete, hablan sobre música y músicos. Ana se arrepiente de dormirlo pues Hugo se comporta tranquilamente y no tiene intenciones de lastimarla ni violentarla, pero ya es tarde porque el somnífero ya está en la copa y el ladrón la bebe toda muy contento. Sin embargo, ha habido una equivocación, y quien ha tomado la copa con la pastilla es ella. Ana se queda dormida en un dos por tres.

A la mañana siguiente Ana despierta completamente vestida y muy bien tapada con una cobija, en su recámara. En el jardín, Hugo y Pauli juegan, ya que han terminado de hacer el desayuno. Ana se sorprende de lo bien que se llevan. Además, le encanta cómo cocina ese ladrón que, a fin de cuentas, es bastante atractivo. Ana empieza a sentir una extraña felicidad. 

En esos momentos una amiga pasa para invitarla a comer. Hugo se pone nervioso, pero Ana inventa que la niña está enferma y la despide de inmediato. Así los tres se quedan juntitos en casa a disfrutar del domingo. Hugo repara las ventanas y el teléfono que descompuso la noche anterior, mientras silba. Ana se entera de que él baila muy bien el danzón, baile que a ella le encanta pero que nunca puede practicar con nadie. Él le propone que bailen una pieza y se acoplan de tal manera que bailan hasta ya entrada la tarde. Pauli los observa, aplaude y, finalmente se queda dormida. Rendidos, terminan tirados en un sillón de la sala.

Para entonces ya se les fue el santo al cielo, pues es hora de que el marido regrese. Aunque Ana se resiste, Hugo le devuelve casi todo lo que había robado, le da algunos consejos para que no se metan en su casa los ladrones, y se despide de las dos mujeres con no poca tristeza. Ana lo mira alejarse. Hugo está por desaparecer y ella lo llama a voces. Cuando regresa le dice, mirándole muy fijo a los ojos, que el próximo fin de semana su esposo va a volver a salir de viaje. El ladrón de sábado se va feliz, bailando por las calles del barrio, mientras anochece.`;

const LECTURA_6 = `Lectura 6: Lee el siguiente fragmento de una columna de opinión y responde las preguntas de la 25 a la 30.

### Rogelio Fernández Güell: Gladiador de la Pluma

*«Al escribir, siempre he tenido ante los ojos la imagen de la Patria. Ella ha inspirado mis frases; ella ha guiado mis pasos y ella, en ocasiones, ha detenido el vuelo de mi pluma.»*  
— **Rogelio Fernández Güell**

Rogelio Fernández Güell (1883 - 1918), desde joven fue un gladiador de la pluma periodística, fustigando siempre a los enemigos del régimen democrático republicano. Conoció la cárcel cuando tenía tan solo 17 años por defender sus ideales con frases ácidas e intransigentes contra la tiranía y la corrupción.

Su pluma no fue un simple instrumento de redacción, sino una espada de combate cívico puesta al servicio de la libertad de expresión y la dignidad de los ciudadanos. Su legado perdura como testimonio del periodista que no claudica ante las presiones del poder autoritario.`;

export const preguntasLenguaje2MAbrilMock: Pregunta[] = [
  // ─────────────────────────────────────────────
  // LECTURA 1: La Gran Muralla China (Preg. 1-3)
  // ─────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-01',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `${LECTURA_1}\n\n---\n\n**1. ¿Cuál es el tema del fragmento anterior?**`,
    alternativas: [
      { letra: 'A', texto: 'Las ventajas de la gran muralla china.', es_correcta: false },
      { letra: 'B', texto: 'La civilización china en la antigüedad.', es_correcta: false },
      { letra: 'C', texto: 'La gran muralla china, su estructura y finalidad defensiva.', es_correcta: true },
      { letra: 'D', texto: 'Los ataques de las tribus nómadas en Asia.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-02',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 1 (Continuación):\n\n**2. ¿Cuál de las siguientes preguntas sintetiza el contenido del texto anterior?**`,
    alternativas: [
      { letra: 'A', texto: '¿Cómo es la gran muralla China y cuál es su propósito?', es_correcta: true },
      { letra: 'B', texto: '¿En qué siglo se construyó la muralla china?', es_correcta: false },
      { letra: 'C', texto: '¿Quiénes fueron los hunos y mongoles?', es_correcta: false },
      { letra: 'D', texto: '¿Por qué la muralla china es la octava maravilla del mundo?', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-03',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 1 (Continuación):\n\n**3. ¿Cuál es el contenido fundamental del segundo párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'Características estructurales y finalidad defensiva de la gran muralla China.', es_correcta: true },
      { letra: 'B', texto: 'La gran muralla China y sus materiales de tierra compactada.', es_correcta: false },
      { letra: 'C', texto: 'La historia de las dinastías chinas en el paso de Jiayuguan.', es_correcta: false },
      { letra: 'D', texto: 'Las rutas comerciales del este de China en Shanhaiguan.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 2: María Tudor (Preg. 4-9)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-04',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `${LECTURA_2}\n\n---\n\n**4. ¿Por qué María Tudor pasó a ser conocida como la "bastarda oficial"?**`,
    alternativas: [
      { letra: 'A', texto: 'Porque tuvo que renunciar a su título nobiliario tras el divorcio de su padre con Catalina de Aragón.', es_correcta: true },
      { letra: 'B', texto: 'Porque fue adoptada por Jane Seymour tras la muerte de su madre.', es_correcta: false },
      { letra: 'C', texto: 'Porque nunca fue reconocida legalmente por Enrique VIII.', es_correcta: false },
      { letra: 'D', texto: 'Porque huyó de la corte inglesa durante el reinado de Eduardo VI.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-05',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 2 (Continuación):\n\n**5. ¿Por qué María Tudor logra llegar al trono?**`,
    alternativas: [
      { letra: 'A', texto: 'Porque Jane Seymour intercedió por ella y contó con un amplio respaldo popular para derrocar a Jane Grey.', es_correcta: true },
      { letra: 'B', texto: 'Porque Eduardo VI la nombró directamente como su sucesora legítima.', es_correcta: false },
      { letra: 'C', texto: 'Porque el papa de Roma intervino militarmente en Londres.', es_correcta: false },
      { letra: 'D', texto: 'Porque Ana Bolena renunció a los derechos de sus propios hijos.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-06',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 2 (Continuación):\n\n**6. ¿A qué se refiere la conspiración contra María I, mencionada en el texto?**`,
    alternativas: [
      { letra: 'A', texto: 'A la proclamación de Jane Grey por parte de nobles protestantes para evitar que María asumiera el poder.', es_correcta: true },
      { letra: 'B', texto: 'A la quema de templos católicos en las afueras de Londres.', es_correcta: false },
      { letra: 'C', texto: 'Al matrimonio secreto de Enrique VIII con Ana Bolena.', es_correcta: false },
      { letra: 'D', texto: 'A la expulsión de diplomáticos españoles de Inglaterra.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-07',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Lectura 2 (Continuación):\n\n**7. Según el texto, ¿por quién es declarado el protestantismo como religión oficial en Inglaterra, por primera vez?**`,
    alternativas: [
      { letra: 'A', texto: 'Por María I.', es_correcta: false },
      { letra: 'B', texto: 'Por Enrique VIII.', es_correcta: false },
      { letra: 'C', texto: 'Por Eduardo VI.', es_correcta: true },
      { letra: 'D', texto: 'Por Jane Grey.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-08',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 2 (Continuación):\n\n**8. ¿Qué se puede sostener sobre María Tudor a partir del texto?**`,
    alternativas: [
      { letra: 'A', texto: 'Que su implacable defensa del catolicismo y persecución a protestantes le valió su trágico apodo histórico.', es_correcta: true },
      { letra: 'B', texto: 'Que logró que su padre se reconciliara definitivamente con la Iglesia de Roma.', es_correcta: false },
      { letra: 'C', texto: 'Que gobernó pacíficamente Inglaterra durante más de tres décadas.', es_correcta: false },
      { letra: 'D', texto: 'Que renunció al trono voluntariamente a favor de su hermana Isabel.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-09',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Lectura 2 (Continuación):\n\n**9. ¿Quién fue proclamada reina inmediatamente después de la muerte de Eduardo VI?**`,
    alternativas: [
      { letra: 'A', texto: 'María Tudor', es_correcta: false },
      { letra: 'B', texto: 'Isabel I', es_correcta: false },
      { letra: 'C', texto: 'Jane Grey', es_correcta: true },
      { letra: 'D', texto: 'Catalina de Aragón', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 3: Antropología (Preg. 10-13)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-10',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `${LECTURA_3}\n\n---\n\n**10. ¿Cuál de las siguientes preguntas sintetiza el contenido del primer párrafo?**`,
    alternativas: [
      { letra: 'A', texto: '¿Cuáles son los fines y ramas de la antropología física y cultural?', es_correcta: true },
      { letra: 'B', texto: '¿Cuáles son las ramas de la antropología cultural y sus finalidades?', es_correcta: false },
      { letra: 'C', texto: '¿Cuáles son los resultados del estudio antropológico en la antigüedad?', es_correcta: false },
      { letra: 'D', texto: '¿Cuáles son las características de las especies vivientes?', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-11',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 3 (Continuación):\n\n**11. ¿Cuál alternativa contiene una idea fundamental del segundo párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'Los alcances culturales de Heródoto son incompatibles con la ciencia moderna.', es_correcta: false },
      { letra: 'B', texto: 'Desde la antigüedad clásica ha existido interés sistemático por observar y describir las culturas humanas.', es_correcta: true },
      { letra: 'C', texto: 'El comportamiento humano solo puede explicarse a partir de los mitos griegos.', es_correcta: false },
      { letra: 'D', texto: 'Los estudios de Heródoto carecieron de todo valor histórico.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-12',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 3 (Continuación):\n\n**12. ¿Cuál alternativa contiene una idea fundamental del último párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'El siglo XV aportó material empírico masivo sobre nuevas culturas que impulsó el desarrollo científico de la antropología.', es_correcta: true },
      { letra: 'B', texto: 'Los relatos del siglo XV eran demasiado rigurosos para ser cuestionados.', es_correcta: false },
      { letra: 'C', texto: 'La geología y la paleontología reemplazaron a la antropología cultural.', es_correcta: false },
      { letra: 'D', texto: 'El Nuevo Mundo impidió el avance de las ciencias sociales europeas.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-13',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 3 (Continuación):\n\n**13. ¿Qué opción sintetiza de mejor manera el fragmento anterior?**`,
    alternativas: [
      { letra: 'A', texto: '«Breve historia del estudio de los pueblos o sociedades».', es_correcta: false },
      { letra: 'B', texto: '«Importancia y aporte de Heródoto en la antropología científica».', es_correcta: false },
      { letra: 'C', texto: '«Clasificación, génesis e historia de la antropología como disciplina».', es_correcta: true },
      { letra: 'D', texto: '«Importancia de la paleontología en el Nuevo Mundo».', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 4: Nutrición y Pizza (Preg. 14-19)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-14',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `${LECTURA_4}\n\n---\n\n**14. Según la introducción, ¿cuál es la intención del artículo?**`,
    alternativas: [
      { letra: 'A', texto: 'Que la pizza es mejor que cualquier desayuno tradicional.', es_correcta: false },
      { letra: 'B', texto: 'Explicar por qué la pizza podría ser una opción de desayuno nutricionalmente más equilibrada que los cereales azucarados.', es_correcta: true },
      { letra: 'C', texto: 'Demostrar que los cereales son el peor alimento inventado.', es_correcta: false },
      { letra: 'D', texto: 'Promover el consumo de comida rápida en los colegios.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-15',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 4 (Continuación):\n\n**15. ¿Qué elemento incluido en el texto cumple la función de dar credibilidad a la información proporcionada?**`,
    alternativas: [
      { letra: 'A', texto: 'La mención a la cantidad de calorías de la pizza.', es_correcta: false },
      { letra: 'B', texto: 'La cita de una nutricionista profesional y el respaldo de datos del Departamento de Agricultura de EE.UU. (USDA).', es_correcta: true },
      { letra: 'C', texto: 'El uso de preguntas retóricas al inicio del texto.', es_correcta: false },
      { letra: 'D', texto: 'La comparación con frutas y yogures frescos.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-16',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 4 (Continuación):\n\n**16. ¿Qué función cumplen las preguntas insertas en el texto anterior?**`,
    alternativas: [
      { letra: 'A', texto: 'Introducir temas que se desarrollarán y argumentarán posteriormente.', es_correcta: true },
      { letra: 'B', texto: 'Problematizar la postura de los expertos en nutrición.', es_correcta: false },
      { letra: 'C', texto: 'Cuestionar las preferencias alimentarias del lector.', es_correcta: false },
      { letra: 'D', texto: 'Desmentir de inmediato los mitos sobre la masa.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-17',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 4 (Continuación):\n\n**17. ¿Cuál es el propósito del último apartado del texto?**`,
    alternativas: [
      { letra: 'A', texto: 'Promover el consumo de pizza todos los días.', es_correcta: false },
      { letra: 'B', texto: 'Poner en perspectiva la recomendación, advirtiendo sobre el sodio y promoviendo una dieta equilibrada.', es_correcta: true },
      { letra: 'C', texto: 'Prohibir terminantemente el cereal procesado.', es_correcta: false },
      { letra: 'D', texto: 'Presentar una receta casera de masa integral.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-18',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Lectura 4 (Continuación):\n\n**18. Según el texto, ¿por qué elegir pizza de desayuno sería una opción inteligente en comparación con cereales procesados?**`,
    alternativas: [
      { letra: 'A', texto: 'Porque puede ser un desayuno más equilibrado en macronutrientes frente a cereales con exceso de azúcar.', es_correcta: true },
      { letra: 'B', texto: 'Porque no contiene ningún tipo de grasas saturadas.', es_correcta: false },
      { letra: 'C', texto: 'Por su altísimo contenido de sodio y colesterol.', es_correcta: false },
      { letra: 'D', texto: 'Porque aporta más vitaminas que la fruta fresca.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-19',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Lectura 4 (Continuación):\n\n**19. ¿Qué ayuda a la saciedad cuando se consume pizza al desayuno?**`,
    alternativas: [
      { letra: 'A', texto: 'La variedad de condimentos picantes que contiene.', es_correcta: false },
      { letra: 'B', texto: 'El contenido proteico del queso y las grasas combinadas con carbohidratos complejos.', es_correcta: true },
      { letra: 'C', texto: 'La ingesta de azúcar simple de rápida absorción.', es_correcta: false },
      { letra: 'D', texto: 'El acompañamiento exclusivo de café cargado.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 5: Cuento Ladrón de Sábado (Preg. 20-24)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-20',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `${LECTURA_5}\n\n---\n\n**20. De la lectura, ¿qué se puede inferir en torno al acto de Hugo, de pasar todo el fin de semana con Ana y su hija?**`,
    alternativas: [
      { letra: 'A', texto: 'Que había sido astutamente premeditado antes del asalto.', es_correcta: false },
      { letra: 'B', texto: 'Que representa un escape a su soledad y una búsqueda involuntaria de afecto y calidez familiar.', es_correcta: true },
      { letra: 'C', texto: 'Que buscaba cobrar un rescate millonario al marido.', es_correcta: false },
      { letra: 'D', texto: 'Que deseaba esconderse de la policía tras un asalto bancario.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-21',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 5 (Continuación):\n\n**21. Del texto leído, ¿qué se puede desprender acerca de la vida cotidiana y emocional de Ana?**`,
    alternativas: [
      { letra: 'A', texto: 'Que vive un matrimonio rutinario y distante donde experimenta insomnio y soledad afectiva.', es_correcta: true },
      { letra: 'B', texto: 'Que es una persona fría que no tiene ningún apego por su hija Pauli.', es_correcta: false },
      { letra: 'C', texto: 'Que se dedica exclusivamente a cuidar la huerta de su casa alejada.', es_correcta: false },
      { letra: 'D', texto: 'Que planeaba contratar a un nuevo locutor para su programa de radio.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-22',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 5 (Continuación):\n\n**22. Considerando la lectura del primer y segundo párrafo, ¿a qué se debe el giro que experimentan los sucesos de la historia?**`,
    alternativas: [
      { letra: 'A', texto: 'A la mutua empatía musical y la admiración sincera de Hugo por el trabajo radiofónico de Ana.', es_correcta: true },
      { letra: 'B', texto: 'A una amenaza violenta que obligó a Ana a fingir simpatía.', es_correcta: false },
      { letra: 'C', texto: 'A la llegada repentina de la amiga que los sorprendió cenando.', es_correcta: false },
      { letra: 'D', texto: 'Al valor monetario de las joyas que Ana le entregó voluntariamente.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-23',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 5 (Continuación):\n\n**23. ¿De cuál alternativa se puede desprender una causa principal que provoca el interés y simpatía de Ana hacia el ladrón?**`,
    alternativas: [
      { letra: 'A', texto: 'Su estado de soledad emocional junto con el encanto, la amabilidad y las atenciones domésticas de Hugo.', es_correcta: true },
      { letra: 'B', texto: 'El miedo constante a que Hugo pudiera lastimar a su hija Pauli.', es_correcta: false },
      { letra: 'C', texto: 'El deseo de vender las joyas robadas en el mercado clandestino.', es_correcta: false },
      { letra: 'D', texto: 'La necesidad urgente de encontrar un nuevo empleo para su marido.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-24',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-1',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 5 (Continuación):\n\n**24. ¿Qué sentido tiene el desenlace cuando Ana le avisa a Hugo que su esposo volverá a salir de viaje el próximo fin de semana?**`,
    alternativas: [
      { letra: 'A', texto: 'Constituye una invitación tácita para que Hugo regrese a visitarla en una nueva oportunidad.', es_correcta: true },
      { letra: 'B', texto: 'Es una advertencia para que la policía monte una emboscada en su casa.', es_correcta: false },
      { letra: 'C', texto: 'Representa una amenaza de que su esposo reforzará la seguridad de las ventanas.', es_correcta: false },
      { letra: 'D', texto: 'Muestra el rencor de Ana por haber perdido su domingo de descanso.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 6: Gladiador de la Pluma (Preg. 25-30)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-abr-25',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `${LECTURA_6}\n\n---\n\n**25. ¿Cuál es el significado denotativo (literal, objetivo) de "gladiador"?**`,
    alternativas: [
      { letra: 'A', texto: 'Persona dedicada a defender una fortaleza militar de algún enemigo.', es_correcta: false },
      { letra: 'B', texto: 'Persona que entrena físicamente a soldados para una guerra.', es_correcta: false },
      { letra: 'C', texto: 'Persona que en los juegos del circo romano combatía con armas contra otra o contra fieras.', es_correcta: true },
      { letra: 'D', texto: 'Gobernante supremo de una provincia del imperio romano.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-26',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 6 (Continuación):\n\n**26. ¿Cuál es el significado connotativo (simbólico, figurado) de "gladiador" en el contexto del texto?**`,
    alternativas: [
      { letra: 'A', texto: 'Combatiente cívico valeroso e incansable por una causa justa.', es_correcta: true },
      { letra: 'B', texto: 'Provocador violento de disturbios callejeros.', es_correcta: false },
      { letra: 'C', texto: 'Agresor impulsivo que busca la confrontación física.', es_correcta: false },
      { letra: 'D', texto: 'Especulador político sin principios morales.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-27',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 6 (Continuación):\n\n**27. ¿Qué matiz valorativo adquiere la expresión "gladiador de pluma" en el texto leído?**`,
    alternativas: [
      { letra: 'A', texto: 'Positivo y elogioso, destacando la valentía periodística del homenajeado.', es_correcta: true },
      { letra: 'B', texto: 'Neutro e indiferente respecto al oficio periodístico.', es_correcta: false },
      { letra: 'C', texto: 'Negativo y peyorativo, condenando sus escritos.', es_correcta: false },
      { letra: 'D', texto: 'Cómico y satírico sobre la juventud del escritor.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-28',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Lectura 6 (Continuación):\n\n**28. ¿Cuál es el significado connotativo de la palabra "ácidas" al calificar las frases de Rogelio Fernández en el texto leído?**`,
    alternativas: [
      { letra: 'A', texto: 'Fuertes, punzantes, mordaces y profundamente críticas contra la tiranía.', es_correcta: true },
      { letra: 'B', texto: 'Desabridas, insípidas e insustanciales.', es_correcta: false },
      { letra: 'C', texto: 'Injustas, desequilibradas y carentes de verdad.', es_correcta: false },
      { letra: 'D', texto: 'Carentes de impacto en el debate social.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-29',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 6 (Continuación):\n\n**29. ¿Cuál es la intención del emisor del fragmento al utilizar la expresión "gladiador de la pluma"?**`,
    alternativas: [
      { letra: 'A', texto: 'Manifestar que Rogelio Fernández, desde muy joven, utilizó el periodismo de combate cívico para oponerse a la opresión y defender la democracia.', es_correcta: true },
      { letra: 'B', texto: 'Manifestar que el periodista buscaba exclusivamente beneficios económicos y notoriedad.', es_correcta: false },
      { letra: 'C', texto: 'Demostrar que las armas de fuego son superiores a la palabra escrita.', es_correcta: false },
      { letra: 'D', texto: 'Criticar la intransigencia de los jóvenes escritores revolucionarios.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  },

  {
    id: 'preg-len2m-abr-30',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Lectura 6 (Continuación):\n\n**30. ¿Qué idea presente en el texto incidió en la interpretación de la expresión "gladiador de la pluma"?**`,
    alternativas: [
      { letra: 'A', texto: 'El hecho de haber enfrentado la cárcel a los 17 años y combatir permanentemente con sus escritos a los enemigos del régimen democrático.', es_correcta: true },
      { letra: 'B', texto: 'Su profesión de abogado en tribunales militares.', es_correcta: false },
      { letra: 'C', texto: 'Su afición por el circo y los deportes de lucha en Europa.', es_correcta: false },
      { letra: 'D', texto: 'La cantidad de libros publicados en editoriales extranjeras.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Abril 2026'
  }
];
