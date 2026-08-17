import { Pregunta, Prueba } from '../types';

// Ejes temáticos reutilizados desde len2mQuestionsMock (mismos IDs para banco compartido)
// eje-len-2m-1: Lectura de Textos Literarios
// eje-len-2m-2: Lectura de Textos No Literarios (Expositivos y Científicos)
// eje-len-2m-3: Lectura Crítica de Textos Argumentativos
// eje-len-2m-4: Escritura y Fundamentación Textual

export const pruebaLenguaje2MJunioMock: Prueba = {
  id: 'prueba-len2m-jun-101',
  titulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026',
  descripcion: 'Evaluación formativa SIMCE (Junio 2026): Textos expositivos sobre comportamiento animal, reportaje de mitos laborales, ficha descriptiva botánica y ensayo argumentativo sobre celos.',
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  cursoId: 'curso-2m',
  cursoNombre: '2° Medio',
  codigoPublico: 'SIMCE-2M-LEN-JUN',
  duracionMinutos: 90,
  creadoEn: '2026-06-15',
  preguntasIds: [
    'preg-len2m-jun-01', 'preg-len2m-jun-02', 'preg-len2m-jun-03', 'preg-len2m-jun-04', 'preg-len2m-jun-05',
    'preg-len2m-jun-06', 'preg-len2m-jun-07', 'preg-len2m-jun-08', 'preg-len2m-jun-09', 'preg-len2m-jun-10',
    'preg-len2m-jun-11', 'preg-len2m-jun-12', 'preg-len2m-jun-13', 'preg-len2m-jun-14', 'preg-len2m-jun-15',
    'preg-len2m-jun-16', 'preg-len2m-jun-17', 'preg-len2m-jun-18', 'preg-len2m-jun-19', 'preg-len2m-jun-20',
    'preg-len2m-jun-21', 'preg-len2m-jun-22', 'preg-len2m-jun-23', 'preg-len2m-jun-24', 'preg-len2m-jun-25',
    'preg-len2m-jun-26', 'preg-len2m-jun-27', 'preg-len2m-jun-28', 'preg-len2m-jun-29', 'preg-len2m-jun-30'
  ],
  totalPreguntas: 30,
  estado: 'activa'
};

const LECTURA_1 = `Texto 1: Lee con atención el siguiente texto expositivo y responde las preguntas 1 a la 8.

### Un estudio analizó su comportamiento en cuatro zoos
#### Los chimpancés también tienen 'policías' para resolver conflictos

La convivencia suele generar conflictos. Y no solo entre los seres humanos. Los animales también tienen sus roces y sus estrategias para resolverlos. Como los chimpancés. Un equipo de investigadores de la Universidad de Zurich ha confirmado que en algunas comunidades de estos primates hay individuos que actúan como mediadores cuando se producen tensiones o peleas. Estos 'policías' intervienen hasta que logran restablecer la paz y el orden en su grupo.

Según explican en un artículo publicado en la revista *PLOS ONE*, este tipo de comportamiento en chimpancés había sido documentado solo de forma accidental. Ahora, los investigadores, liderados por Claudia Rudolf von Rohr, observaron y compararon a cuatro grupos de chimpancés en cautividad en diferentes zoológicos. Pese a ello, aclaran que no se trata de un comportamiento generalizado en estos primates.

Los primatólogos explican que estos animales intervienen de manera imparcial, ya que su objetivo es garantizar la estabilidad del grupo. Por ello, cuantos más individuos estén involucrados en la pelea, más posibilidades hay de que otro intervenga, pues representan una mayor amenaza para el bienestar de la comunidad. Los autores señalan que hacer de 'policía' es arriesgado, ya que deben acercarse a dos o más chimpancés enzarzados en una disputa, con el consiguiente peligro de que ellos mismos sean agredidos. Pero el beneficio que obtienen, añaden, es superior al riesgo que asumen.

**Árbitros**

Estos mediadores actúan de forma pacífica, sin agredir a los miembros involucrados en la pelea, por lo que los científicos prefieren llamarlos 'árbitros'. Esta intervención 'policial', aclaran, se diferencia de otros comportamientos que se dan en las comunidades de chimpancés para resolver un conflicto, como la dominación, el castigo o la reconciliación.

Carel van Schaik, investigadora del Instituto y Museo Antropológico de la Universidad de Zurich y una de las firmantes de este trabajo, señala que es "extremadamente raro" que todos los miembros del grupo estén involucrados en un conflicto. El único caso que conoce es cuando un macho ha matado a una cría.

**Las causas del conflicto**

En el Zoo Walter, en Gossau (Suiza), los primatólogos tuvieron la oportunidad de estudiar una comunidad de chimpancés a la que se acababan de incorporar algunas hembras, una circunstancia que había alterado el grupo. La llegada de sus nuevas compañeras había obligado a redefinir el papel de los machos y el lugar que ocupan en el ranking de la comunidad, poniendo en peligro su estabilidad. En este caso concreto, surgió un conflicto entre dos machos. Los otros chimpancés estudiados vivían en los zoológicos de Chester (Reino Unido), Arnhem (Holanda) y Basel (Suiza). Todos ellos pertenecen a la especie *Pan troglodytes*.

Sin embargo, los chimpancés no solo se pelean por cuestiones relacionadas con su reproducción, como la rivalidad por conseguir pareja. Los conflictos también se desencadenan por el acceso a recursos.

**Los mejores 'policías'**

Pero ni todos los miembros del grupo sirven para ejercer de 'policía' ni todos se atreven a hacerlo. No sorprende que normalmente sean los machos o las hembras más respetadas en el grupo los que suelen mediar en los conflictos. "Los machos intervienen de forma más frecuente que las hembras, pero no de forma exclusiva. Y éste es un aspecto muy importante para interpretar su comportamiento. Además, los individuos más ancianos son los más propensos a mediar en un conflicto. Es decir, no solo actúan como policías los machos", señala van Schaik.

Y es que, al igual que ocurre en las sociedades humanas, también hay autoridades entre estos primates. Los autores señalan que la preocupación por la estabilidad de la comunidad está muy desarrollada en las personas y, según sugieren los resultados de este estudio, también en los chimpancés, nuestros parientes más próximos. A pesar de ello, aclaran que no es frecuente observar este tipo de comportamiento, por lo que son necesarios más estudios antes de generalizarlo.`;

const LECTURA_2 = `Texto 2: Lee el siguiente reportaje y responde las preguntas 9 a la 14.

### Cinco mitos laborales que la ciencia desmiente

1. ¿Los jóvenes son mejores empleados? ¿El estrés laboral masculino es más frecuente? ¿Qué profesionales son más felices? ¿Un semestre sabático nos podría quitar el estrés? Esto es lo que aclaran los últimos estudios científicos que desmienten algunas ideas bastante asentadas en la cultura popular sobre el trabajo.

2. Los jóvenes no son mejores empleados. Michael Falkenstein, del Instituto alemán Leibniz, ha demostrado que los trabajadores de edad avanzada procesan las imágenes y los sonidos y toman decisiones a la misma velocidad que sus compañeros más jóvenes. Solo son un poco más lentos a la hora de "pulsar el botón", es decir, en los movimientos. Eso sí, lentos pero seguros, ya que según ha demostrado Falkenstein los empleados veteranos cometen menos errores.

3. El estrés laboral no afecta más a los hombres. De hecho, sometidas a los mismos niveles de estrés que sus compañeros masculinos, las mujeres tienden a adquirir más malos hábitos, como llevar una vida sedentaria, comer grasas y azúcares en exceso, fumar y consumir demasiada cafeína. Las enfermedades neurodegenerativas no nos atacan a todos por igual. Según la revista *American Journal of Industrial Medicine*, los mayores índices de Parkinson y Alzheimer se registran en banqueros, granjeros, dentistas, peluqueros y profesores.

4. Los médicos no son más felices. Los profesionales más propensos a sufrir depresión son los que trabajan en el sector de servicios, en atención primaria o en hostelería. En el extremo opuesto se encuentran los arquitectos, los técnicos instaladores, los ingenieros y los científicos.

5. Las vacaciones no son mejores cuanto más largas. Cuando se trata de descansar, la calidad es lo más importante. Es lo que afirma Dov Even, un psicólogo organizacional de la Universidad de Tel Aviv que lleva una década comparando los niveles de estrés crónico de los trabajadores antes, durante y después de un período de descanso. Con un "semestre sabático" el nivel de estrés desciende lo mismo que el de otros empleados que solo descansaban una semana. Por eso recomienda que, si podemos elegir, optemos por vacaciones más cortas, pero más frecuentes, en lugar de un mes completo de ocio continuado.`;

const LECTURA_3 = `Texto 3: Lee el siguiente texto expositivo y responde las preguntas 15 a la 20.

### Ficha Descriptiva: La Papaya (*Carica Papaya*)

También conocida como Melón de los trópicos o Melón de Árbol, la Papaya es el fruto comestible del árbol *Carica Papaya*.

**Orígenes**

El *Carica Papaya* es un árbol originario de México. En la época precolombina, los pueblos del Caribe ingerían el fruto verde para luchar contra los trastornos gastrointestinales. También lo usaban para ablandar la carne de pulpo o las carnes.

**Características**

Este fruto es una baya ovoide o redondeada, de 20 a 30 cm de largo, y que pesa de 1 a 5 kg. El fruto verde se vuelve amarillo al madurar. La epidermis, de unos pocos milímetros de espesor, es lisa y frágil. El corte transversal muestra una pulpa anaranjada a roja, que rodea una cavidad central llena de semillas esféricas, no comestibles, grises o negras.

Entre las múltiples variedades existentes, las más difundidas en el mercado europeo son la *Sunrise* y la *Golden*, que corresponden a las variedades de fruto pequeño de 300 a 700 g. La *Formosa* es una variedad de fruto más grande cuyo peso puede ser superior a 1 kilo. Este se consume generalmente fresco, pero también puede utilizarse para la extracción de una enzima proteolítica muy demandada: la papaína.

Cuando se incisa, la piel de la papaya verde despide un líquido blanco que coagula rápidamente. La acción digestiva y disolvente de las proteínas que caracterizan a la papaína se utiliza de forma terapéutica, en la industria del cuero, de la lana, de la seda, en la cervecería y en las industrias alimentaria y farmacéutica.

A pesar de los numerosos trabajos de transgénesis realizados para llegar a variedades casi perfectas, son las variedades de tipo silvestre las que producen frutos de pulpa anaranjada más sabrosos.

**Producción**

La papaya es siempre un fruto de intensa comercialización. La producción mundial anual se estima actualmente en 15 millones de toneladas y se concentra en Asia en un 51%, en el continente americano en un 39% y en África en un 10%. El consumo local sigue siendo el principal mercado para la producción, mientras que las exportaciones mundiales, que ascienden a unas 400.000 toneladas, están dirigidas principalmente por los países latinoamericanos. México es el principal exportador mundial de esta fruta. Pero es la India la que llega a la cabeza de los países productores de papayas con una cosecha de 5,9 millones de toneladas. Este país es seguido por Brasil con 1,5 Mt y Malasia con 1,3 Mt.`;

const LECTURA_4 = `Texto 4: Lee el siguiente ensayo y responde las preguntas 21 a la 30.

### Ensayo sobre los celos y la psicología individual

Hay buenos muchachitos, que les amargan la vida a sus respectivas novias promoviendo tempestades de celos, que son realmente tormentas en vasos de agua, con lluvias de lágrimas y truenos de recriminaciones. Generalmente las mujeres son menos celosas que los hombres. Y si son inteligentes, aun cuando sean celosas, se cuidan muy bien de descubrir tal sentimiento, porque saben que la exposición de semejante debilidad las entrega atadas de pies y manos al fulano que les sorbió el seso. De cualquier manera; el sentimiento de los celos es digno de estudio, no por los disgustos que provoca, sino por lo que revela en cuanto a psicología individual.

Puede establecerse esta regla: cuanto menos mujeres ha tratado un individuo, más celoso es. La novedad del sentimiento amoroso conturba, casi asusta, y trastorna la vida de un individuo poco acostumbrado a tales descargas y cargas de emoción. La mujer llega a constituir para este sujeto un fenómeno divino, exclusivo. Se imagina que la suma de felicidad que ella suscita en él, puede proporcionársela a otro hombre; y entonces Fulano se toma la cabeza, espantado al pensar que toda "su" felicidad, está depositada en esa mujer, igual que en un banco. Ahora bien, en tiempos de crisis, ustedes saben perfectamente que los señores y señoras que tienen depósitos en instituciones bancarias, se precipitan a retirar sus depósitos, poseídos de la locura del pánico. Algo igual ocurre en el celoso. Con la diferencia que él piensa que si su "banco" quiebra, no podrá depositar su felicidad ya en ninguna parte. Siempre ocurre esta catástrofe mental con los pequeños financieros sin cancha y los pequeños enamorados sin experiencia.

Frecuentemente, también, el hombre es celoso de la mujer cuyo mecanismo psicológico no conoce. Ahora bien: para conocer el mecanismo psicológico de la mujer, hay que tratar a muchas, y no elegir precisamente a las ingenuas para enamorarse, sino a las "vivas", las astutas y las desvergonzadas, porque ellas son fuente de enseñanzas maravillosas para un hombre sin experiencia, y le enseñan (involuntariamente, por supuesto) los mil resortes y engranajes de que "puede" componerse el alma femenina.

Los pequeños enamorados, como los pequeños financistas, tienen en su capital de amor una sensibilidad tan prodigiosa, que hay mujeres que se desesperan de encontrarse frente al hombre a quien quieren, pero que les atormenta la vida con sus estupideces infundadas.

Los celos constituyen un sentimiento inferior, bajuno. El hombre, cela casi siempre a la mujer que no conoce, que no ha estudiado, y que casi siempre es superior intelectualmente a él. En síntesis, el celo es la envidia al revés. Lo más grave en la demostración de los celos es que el individuo, involuntariamente, se pone a merced de la mujer. La mujer en ese caso, puede hacer de él lo que se le antoja. Lo maneja a su voluntad. El celo (miedo de que ella lo abandone o prefiera a otro) pone de manifiesto la débil naturaleza del celoso, su pasión extrema, y su falta de discernimiento. Y un hombre inteligente, jamás le demuestra celos a una mujer, ni cuando es celoso. Se guarda prudentemente sus sentimientos; y ese acto de voluntad repetido continuamente en las relaciones con el ser que ama, termina por colocarle en un plano superior al de ella.

A su vez la mujer, que es sagaz e intuitiva, termina por darse cuenta de que con una naturaleza tan sólidamente plantada no se puede jugar, y entonces las relaciones entre ambos sexos se desarrollan con una normalidad que raras veces deja algo que desear, o terminan para mejor tranquilidad de ambos.`;

export const preguntasLenguaje2MJunioMock: Pregunta[] = [
  // ─────────────────────────────────────────────
  // LECTURA 1: Los chimpancés policías (Preg. 1-8)
  // ─────────────────────────────────────────────
  {
    id: 'preg-len2m-jun-01',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `${LECTURA_1}\n\n---\n\n**1. ¿Qué rasgo, según el texto, es compartido por humanos y chimpancés?**`,
    alternativas: [
      { letra: 'A', texto: 'Ambos poseen individuos mediadores que intervienen imparcialmente en conflictos.', es_correcta: true },
      { letra: 'B', texto: 'En ambas especies los machos son los únicos que resuelven los conflictos.', es_correcta: false },
      { letra: 'C', texto: 'Tanto humanos como chimpancés se pelean solo por acceso a recursos alimenticios.', es_correcta: false },
      { letra: 'D', texto: 'Ambas especies conviven en cautiverio en zoológicos de Europa.', es_correcta: false }
    ],
    respuestaCorrecta: 'A',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-02',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 1 (Continuación):\n\n**2. ¿Cuál es el objetivo del chimpancé al intervenir imparcialmente en un conflicto?**`,
    alternativas: [
      { letra: 'A', texto: 'Lograr el bien personal del árbitro que interviene.', es_correcta: false },
      { letra: 'B', texto: 'Demostrar superioridad física sobre los contendientes.', es_correcta: false },
      { letra: 'C', texto: 'Garantizar la estabilidad y el bienestar del grupo.', es_correcta: true },
      { letra: 'D', texto: 'Castigar a los chimpancés que iniciaron el conflicto.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-03',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 1 (Continuación):\n\n**3. ¿Cuál es el riesgo de ser policía para un chimpancé?**`,
    alternativas: [
      { letra: 'A', texto: 'Ser rechazado por la manada si la intervención fracasa.', es_correcta: false },
      { letra: 'B', texto: 'Ser agredido al acercarse a chimpancés en plena disputa.', es_correcta: true },
      { letra: 'C', texto: 'Perder su rango jerárquico dentro del grupo.', es_correcta: false },
      { letra: 'D', texto: 'Quedarse sin acceso a recursos alimenticios.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-04',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 1 (Continuación):\n\n**4. ¿Qué es correcto decir sobre los chimpancés estudiados?**`,
    alternativas: [
      { letra: 'A', texto: 'Que la mitad de ellos vive en cautiverio en zoos sudamericanos.', es_correcta: false },
      { letra: 'B', texto: 'Que pertenecen a la especie *Pan troglodytes* y viven en zoos europeos.', es_correcta: true },
      { letra: 'C', texto: 'Que provienen de cuatro países distintos de África.', es_correcta: false },
      { letra: 'D', texto: 'Que fueron estudiados exclusivamente en zoológicos de Suiza.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-05',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 1 (Continuación):\n\n**5. ¿Qué chimpancés suelen ser policías con mayor frecuencia?**`,
    alternativas: [
      { letra: 'A', texto: 'Las hembras.', es_correcta: false },
      { letra: 'B', texto: 'Los más jóvenes.', es_correcta: false },
      { letra: 'C', texto: 'Los machos y los individuos de mayor edad.', es_correcta: true },
      { letra: 'D', texto: 'Los más débiles físicamente.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-06',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 1 (Continuación):\n\n**6. ¿Qué se puede afirmar sobre los chimpancés árbitros?**`,
    alternativas: [
      { letra: 'A', texto: 'Que están presentes en todas las sociedades de su especie.', es_correcta: false },
      { letra: 'B', texto: 'Que es poco frecuente verlos en acción, por lo que se necesitan más estudios.', es_correcta: true },
      { letra: 'C', texto: 'Que intervienen principalmente en disputas por alimentos.', es_correcta: false },
      { letra: 'D', texto: 'Que usan la dominación como método principal de arbitraje.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-07',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 1 (Continuación):\n\n**7. ¿A qué limitación del estudio hacen referencia los investigadores de la Universidad de Zurich?**`,
    alternativas: [
      { letra: 'A', texto: 'Que solo observaron a chimpancés hembras durante el experimento.', es_correcta: false },
      { letra: 'B', texto: 'Que los resultados no pueden generalizarse porque el comportamiento arbitral no es frecuente.', es_correcta: true },
      { letra: 'C', texto: 'Que los zoológicos no representan el ambiente natural de los chimpancés.', es_correcta: false },
      { letra: 'D', texto: 'Que el estudio se realizó en un solo zoológico de Suiza.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-08',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 1 (Continuación):\n\n**8. Según el texto, ¿qué puede causar conflicto?**`,
    alternativas: [
      { letra: 'A', texto: 'La incorporación de hembras y sus crías a grupos ya establecidos.', es_correcta: false },
      { letra: 'B', texto: 'Solo la rivalidad reproductiva entre machos jóvenes.', es_correcta: false },
      { letra: 'C', texto: 'La rivalidad por conseguir pareja y el acceso a recursos.', es_correcta: true },
      { letra: 'D', texto: 'La intervención de chimpancés externos al grupo.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 2: Mitos laborales (Preg. 9-14)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-jun-09',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `${LECTURA_2}\n\n---\n\n**9. ¿Cuál es la idea fundamental del segundo párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'Todos los trabajadores mayores son más eficientes que los jóvenes.', es_correcta: false },
      { letra: 'B', texto: 'Los trabajadores veteranos son más lentos en movimientos pero cometen menos errores.', es_correcta: true },
      { letra: 'C', texto: 'Los jóvenes son mejores empleados porque se mueven más rápidamente.', es_correcta: false },
      { letra: 'D', texto: 'El Instituto Leibniz demostró que la edad no influye en el desempeño laboral.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-10',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 2 (Continuación):\n\n**10. ¿Cuál sería el título más apropiado al contenido del fragmento leído?**`,
    alternativas: [
      { letra: 'A', texto: 'Características de los trabajadores y sus contextos laborales.', es_correcta: false },
      { letra: 'B', texto: 'Los problemas y soluciones de la situación laboral en la actualidad.', es_correcta: false },
      { letra: 'C', texto: 'La ciencia desmiente creencias populares sobre el mundo del trabajo.', es_correcta: true },
      { letra: 'D', texto: 'Estudios sobre la felicidad y el estrés en los ambientes laborales.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-11',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 2 (Continuación):\n\n**11. ¿Cuál es la idea principal del último párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'El estrés crónico de los trabajadores disminuye con vacaciones largas.', es_correcta: false },
      { letra: 'B', texto: 'Que la calidad del descanso importa más que su duración.', es_correcta: true },
      { letra: 'C', texto: 'Que un semestre sabático es indispensable para recuperarse del estrés.', es_correcta: false },
      { letra: 'D', texto: 'Que los empleados deben tomarse un mes completo de vacaciones.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-12',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 2 (Continuación):\n\n**12. Según el párrafo 4, ¿qué influye en la "felicidad" de los trabajadores?**`,
    alternativas: [
      { letra: 'A', texto: 'Los que atienden público son los menos propensos a sufrir depresión.', es_correcta: false },
      { letra: 'B', texto: 'El tipo de actividad profesional que desempeñan.', es_correcta: true },
      { letra: 'C', texto: 'El nivel de estrés crónico acumulado por años.', es_correcta: false },
      { letra: 'D', texto: 'La cantidad de días de vacaciones que tienen disponibles.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-13',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 2 (Continuación):\n\n**13. ¿Qué información es real con respecto al párrafo 3?**`,
    alternativas: [
      { letra: 'A', texto: 'El estrés laboral afecta más a hombres según los estudios citados.', es_correcta: false },
      { letra: 'B', texto: 'Las mujeres bajo estrés tienden a adquirir más malos hábitos que los hombres.', es_correcta: true },
      { letra: 'C', texto: 'El estrés crónico produce las mismas enfermedades en hombres y mujeres.', es_correcta: false },
      { letra: 'D', texto: 'Las enfermedades de Parkinson y Alzheimer son más comunes en mujeres.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-14',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 2 (Continuación):\n\n**14. ¿Qué función tiene el primer párrafo?**`,
    alternativas: [
      { letra: 'A', texto: 'Dar argumentos sobre la importancia del tema.', es_correcta: false },
      { letra: 'B', texto: 'Presentar conclusiones definitivas del texto.', es_correcta: false },
      { letra: 'C', texto: 'Plantear preguntas retóricas que anticipan los mitos que el texto desmentirá.', es_correcta: true },
      { letra: 'D', texto: 'Describir el estado actual del mercado laboral en el mundo.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 3: La Papaya (Preg. 15-20)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-jun-15',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `${LECTURA_3}\n\n---\n\n**15. ¿En qué se diferencian las características de las papayas Sunrise y Golden con la papaya Formosa?**`,
    alternativas: [
      { letra: 'A', texto: 'Las variedades Sunrise y Golden son más dulces que la Formosa.', es_correcta: false },
      { letra: 'B', texto: 'La Formosa tiene frutos de mayor tamaño (superior a 1 kg) que Sunrise y Golden (300-700 g).', es_correcta: true },
      { letra: 'C', texto: 'La Formosa se usa solo para extracción industrial y las otras para consumo fresco.', es_correcta: false },
      { letra: 'D', texto: 'Sunrise y Golden son variedades transgénicas y la Formosa es silvestre.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-16',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 3 (Continuación):\n\n**16. ¿Qué tienen en común las papayas Sunrise, Golden y Formosa?**`,
    alternativas: [
      { letra: 'A', texto: 'Deben consumirse cuando el fruto está verde para aprovechar la papaína.', es_correcta: false },
      { letra: 'B', texto: 'Todas son variedades del árbol *Carica Papaya* difundidas en el mercado europeo.', es_correcta: true },
      { letra: 'C', texto: 'Las tres tienen un peso superior a 1 kilogramo.', es_correcta: false },
      { letra: 'D', texto: 'Producen frutos de pulpa anaranjada de sabor más sabroso al ser silvestres.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-17',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 3 (Continuación):\n\n**17. ¿Qué relación puede establecerse entre las localidades mundiales mencionadas bajo el apartado Producción?**`,
    alternativas: [
      { letra: 'A', texto: 'Todas las regiones mencionadas producen papaya en igual cantidad.', es_correcta: false },
      { letra: 'B', texto: 'Asia, América y África concentran la producción mundial, pero Asia y América también lideran las exportaciones.', es_correcta: true },
      { letra: 'C', texto: 'África exporta la mayor cantidad de papaya al mercado europeo.', es_correcta: false },
      { letra: 'D', texto: 'Los países latinoamericanos producen más toneladas que Asia.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-18',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 3 (Continuación):\n\n**18. Según la temática del texto, ¿qué similitud comparten Brasil y la India?**`,
    alternativas: [
      { letra: 'A', texto: 'Ambos países tienen la papaya como su principal producto de exportación.', es_correcta: false },
      { letra: 'B', texto: 'Ambos son grandes productores de papaya a nivel mundial.', es_correcta: true },
      { letra: 'C', texto: 'Ambos países usan la papaya exclusivamente en la industria farmacéutica.', es_correcta: false },
      { letra: 'D', texto: 'Ambos cultivan la variedad Formosa como su principal papaya comercial.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-19',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    enunciado: `Texto 3 (Continuación):\n\n**19. Según el texto, ¿qué tienen en común Asia y América?**`,
    alternativas: [
      { letra: 'A', texto: 'Ambos continentes tienen la papaya como su principal fruto exportado.', es_correcta: false },
      { letra: 'B', texto: 'Juntos concentran el 90% de la producción mundial de papaya.', es_correcta: true },
      { letra: 'C', texto: 'Ambos usan la papaya exclusivamente para consumo interno.', es_correcta: false },
      { letra: 'D', texto: 'Ambos continentes cultivan papayas de tipo silvestre exclusivamente.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-20',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-2',
    habilidadId: 'hab-len-1',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'baja',
    imagenUrl: '/preguntas/simce_len_2m_jun/image1.png',
    enunciado: `Texto 3 (Continuación):\n\n*[Figura 1: Representación visual de la papaya Carica Papaya con sus variedades características]*\n\n**20. ¿De qué variedad de papaya se extrae la papaína?**`,
    alternativas: [
      { letra: 'A', texto: 'Papaya Sunrise', es_correcta: false },
      { letra: 'B', texto: 'Papaya Formosa', es_correcta: false },
      { letra: 'C', texto: 'De cualquier variedad de *Carica Papaya*, ya que la enzima está en la piel del fruto verde.', es_correcta: true },
      { letra: 'D', texto: 'Solo de la papaya Golden, por su alto contenido en enzimas.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  // ─────────────────────────────────────────────────────
  // LECTURA 4: Ensayo sobre los celos (Preg. 21-30)
  // ─────────────────────────────────────────────────────
  {
    id: 'preg-len2m-jun-21',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `${LECTURA_4}\n\n---\n\n**21. De la lectura del párrafo dos, ¿cuál es una de las causas que se puede inferir que provoca los celos?**`,
    alternativas: [
      { letra: 'A', texto: 'El exceso de confianza que el enamorado tiene en su pareja.', es_correcta: false },
      { letra: 'B', texto: 'La falta de experiencia amorosa y el desconocimiento de otras mujeres.', es_correcta: true },
      { letra: 'C', texto: 'La superioridad intelectual del celoso sobre su pareja.', es_correcta: false },
      { letra: 'D', texto: 'La decisión deliberada del hombre de demostrar su pasión.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-22',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**22. ¿Cuál de las siguientes opciones contiene una deducción válida del texto leído?**`,
    alternativas: [
      { letra: 'A', texto: 'El amor erótico elimina por completo los celos en una relación.', es_correcta: false },
      { letra: 'B', texto: 'Las mujeres nunca sienten celos según el autor del ensayo.', es_correcta: false },
      { letra: 'C', texto: 'El hombre con más experiencia amorosa tenderá a ser menos celoso.', es_correcta: true },
      { letra: 'D', texto: 'Los celos son siempre positivos para la estabilidad de la pareja.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-23',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**23. ¿Qué se puede inferir sobre la ideología del emisor del texto respecto a las relaciones amorosas?**`,
    alternativas: [
      { letra: 'A', texto: 'Que considera que las mujeres deben expresar sus celos libremente.', es_correcta: false },
      { letra: 'B', texto: 'Que valora la experiencia, el autocontrol y el dominio de las propias emociones en la relación de pareja.', es_correcta: true },
      { letra: 'C', texto: 'Que considera que los celos son un signo de amor verdadero.', es_correcta: false },
      { letra: 'D', texto: 'Que promueve el distanciamiento emocional como única solución a los celos.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-24',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**24. Respecto a los celos, ¿qué es posible inferir del texto leído?**`,
    alternativas: [
      { letra: 'A', texto: 'Que para el emisor el individuo celoso es intelectualmente superior a su pareja.', es_correcta: false },
      { letra: 'B', texto: 'Que los celos revelan la debilidad del celoso y le hacen perder poder en la relación.', es_correcta: true },
      { letra: 'C', texto: 'Que los celos son una forma sana de demostrar afecto profundo.', es_correcta: false },
      { letra: 'D', texto: 'Que el celoso siempre actúa con plena conciencia de sus actos.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-25',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**25. De acuerdo al texto leído, ¿qué opción contiene una inferencia válida sobre lo que representa el amor para el celoso?**`,
    alternativas: [
      { letra: 'A', texto: 'El amor es una fuente de alegría que el celoso comparte generosamente.', es_correcta: false },
      { letra: 'B', texto: 'El amor funciona como un banco donde deposita toda su felicidad, volviéndolo vulnerable a perderla.', es_correcta: true },
      { letra: 'C', texto: 'El amor es para el celoso una experiencia liberadora y enriquecedora.', es_correcta: false },
      { letra: 'D', texto: 'El amor es un sentimiento que el celoso comparte en equilibrio con su pareja.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-26',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 4 (Continuación):\n\n**26. Según el texto, ¿cuál es la regla que se establece respecto a la experiencia de un hombre con las mujeres y los celos?**`,
    alternativas: [
      { letra: 'A', texto: 'A más experiencia amorosa, más celos experimenta el hombre.', es_correcta: false },
      { letra: 'B', texto: 'Cuanto menos mujeres ha tratado un individuo, más celoso es.', es_correcta: true },
      { letra: 'C', texto: 'Solo los hombres mayores con experiencia son capaces de sentir celos profundos.', es_correcta: false },
      { letra: 'D', texto: 'La regla es que los hombres jóvenes nunca sienten celos.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-27',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-2',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'media',
    enunciado: `Texto 4 (Continuación):\n\n**27. Para conocer el "mecanismo psicológico" de la mujer, ¿a qué tipo de mujeres aconseja tratar el autor?**`,
    alternativas: [
      { letra: 'A', texto: 'A las más ingenuas y emotivas.', es_correcta: false },
      { letra: 'B', texto: 'A las más intelectuales y estudiosas.', es_correcta: false },
      { letra: 'C', texto: 'A las "vivas", las astutas y las desvergonzadas.', es_correcta: true },
      { letra: 'D', texto: 'A las más jóvenes e inexperientes.', es_correcta: false }
    ],
    respuestaCorrecta: 'C',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-28',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**28. ¿Qué busca ilustrar el autor al comparar al hombre celoso con un "pequeño financiero" en tiempos de crisis?**`,
    alternativas: [
      { letra: 'A', texto: 'Que el celoso es un buen administrador de sus recursos emocionales.', es_correcta: false },
      { letra: 'B', texto: 'Que el celoso, como el pequeño inversionista en crisis, actúa irracionalmente por pánico ante la pérdida.', es_correcta: true },
      { letra: 'C', texto: 'Que el amor romántico y las finanzas son actividades similares.', es_correcta: false },
      { letra: 'D', texto: 'Que los hombres celosos son más astutos para proteger sus relaciones.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-29',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**29. A partir de los argumentos del quinto párrafo, ¿por qué un hombre inteligente decide ocultar sus celos?**`,
    alternativas: [
      { letra: 'A', texto: 'Porque teme que su pareja lo abandone si los conoce.', es_correcta: false },
      { letra: 'B', texto: 'Porque ocultarlos le permite ubicarse en un plano de superioridad y autocontrol frente a ella.', es_correcta: true },
      { letra: 'C', texto: 'Porque los celos son un sentimiento que avergüenza socialmente.', es_correcta: false },
      { letra: 'D', texto: 'Porque la mujer es incapaz de detectar los celos del hombre.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  },

  {
    id: 'preg-len2m-jun-30',
    asignaturaId: 'asig-2',
    ejeTematicoId: 'eje-len-2m-3',
    habilidadId: 'hab-len-3',
    tipo: 'seleccion_multiple',
    nivel: '2° Medio',
    dificultad: 'alta',
    enunciado: `Texto 4 (Continuación):\n\n**30. ¿Qué interpretación se deduce de la frase "el celo es la envidia al revés" en el contexto de la lectura?**`,
    alternativas: [
      { letra: 'A', texto: 'Que la envidia y los celos son sentimientos completamente opuestos sin relación entre sí.', es_correcta: false },
      { letra: 'B', texto: 'Que así como la envidia desea lo que otro posee, los celos temen que otro posea lo propio.', es_correcta: true },
      { letra: 'C', texto: 'Que los celos son siempre más intensos y peligrosos que la envidia.', es_correcta: false },
      { letra: 'D', texto: 'Que el celoso es en realidad un envidioso disfrazado de enamorado.', es_correcta: false }
    ],
    respuestaCorrecta: 'B',
    puntaje: 1,
    fuente: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Junio 2026'
  }
];
