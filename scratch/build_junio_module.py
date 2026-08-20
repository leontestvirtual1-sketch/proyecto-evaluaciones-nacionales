import docx
import re
import json

doc = docx.Document('evaluaciones_fuente/Ensayo+SIMCE+Lenguaje+2° Medio+Junio 2026.docx')

# Extract unique text blocks from tables
cells_seen = set()
ordered_texts = []
for t in doc.tables:
    for r in t.rows:
        for c in r.cells:
            txt = c.text.strip()
            if txt and txt not in cells_seen:
                cells_seen.add(txt)
                ordered_texts.append(txt)

print(f"Extracted {len(ordered_texts)} unique text blocks.")

# Let's organize the 4 readings
readings = {
    1: """Lectura 1: Lee con atención el siguiente texto expositivo y contesta las preguntas de la 1 a la 8.

### Un estudio analizó su comportamiento en cuatro zoos
#### Los chimpancés también tienen 'policías' para resolver conflictos

La convivencia suele generar conflictos. Y no solo entre los seres humanos. Los animales también tienen sus roces y sus estrategias para resolverlos. Como los chimpancés. Un equipo de investigadores de la Universidad de Zurich ha confirmado que en algunas comunidades de estos primates hay individuos que actúan como mediadores cuando se producen tensiones o peleas. Estos 'policías' intervienen hasta que logran restablecer la paz y el orden en su grupo.

Según explican en un artículo publicado en la revista 'PLOS ONE', este tipo de comportamiento en chimpancés había sido documentado solo de forma accidental. Ahora, los investigadores, liderados por Claudia Rudolf von Rohr, observaron y compararon a cuatro grupos de chimpancés en cautividad en diferentes zoológicos. Pese a ello, aclaran que no se trata de un comportamiento generalizado en estos primates.

Los primatólogos explican que estos animales intervienen de manera imparcial, ya que su objetivo es garantizar la estabilidad del grupo. Por ello, cuantos más individuos estén involucrados en la pelea, más posibilidades hay de que otro intervenga, pues representan una mayor amenaza para el bienestar de la comunidad. Los autores señalan que hacer de 'policía' es arriesgado, ya que deben acercarse a dos o más chimpancés enzarzados en una disputa, con el consiguiente peligro de que ellos mismos sean agredidos. Pero el beneficio que obtienen, añaden, es superior al riesgo que asumen.

**Árbitros**
Estos mediadores actúan de forma pacífica, sin agredir a los miembros involucrados en la pelea, por lo que los científicos prefieren llamarlos 'árbitros'. Esta intervención 'policial', aclaran, se diferencia de otros comportamientos que se dan en las comunidades de chimpancés para resolver un conflicto, como la dominación, el castigo o la reconciliación.

Carel van Schaik, investigadora del Instituto y Museo Antropológico de la Universidad de Zurich y una de las firmantes de este trabajo, señala a ELMUNDO.es que es "extremadamente raro" que todos los miembros del grupo estén involucrados en un conflicto. El único caso que conoce es cuando un macho ha matado a una cría.

**Las causas del conflicto**
En el Zoo Walter, en Gossau (Suiza), los primatólogos tuvieron la oportunidad de estudiar una comunidad de chimpancés a la que se acababan de incorporar algunas hembras, una circunstancia que había alterado el grupo. La llegada de sus nuevas compañeras había obligado a redefinir el papel de los machos y el lugar que ocupan en el ranking de la comunidad, poniendo en peligro su estabilidad. En este caso concreto, surgió un conflicto entre dos machos. Los otros chimpancés estudiados vivían en los zoológicos de Chester (Reino Unido), Arnhem (Holanda) y Basel (Suiza). Todos ellos pertenecen a la especie *Pan troglodytes*.

Sin embargo, los chimpancés no solo se pelean por cuestiones relacionadas con su reproducción, como la rivalidad por conseguir pareja. Los conflictos también se desencadenan por el acceso a recursos.

**Los mejores 'policías'**
Pero ni todos los miembros del grupo sirven para ejercer de 'policía' ni todos se atreven a hacerlo. No sorprende que normalmente sean los machos o las hembras más respetadas en el grupo los que suelen mediar en los conflictos. "Los machos intervienen de forma más frecuente que las hembras, pero no de forma exclusiva. Y éste es un aspecto muy importante para interpretar su comportamiento. Además, los individuos más ancianos son los más propensos a mediar en un conflicto. Es decir, no solo actúan como policías los machos", señala van Schaik.

Y es que, al igual que ocurre en las sociedades humanas, también hay autoridades entre estos primates. Los autores señalan que la preocupación por la estabilidad de la comunidad está muy desarrollada en las personas y, según sugieren los resultados de este estudio, también en los chimpancés, nuestros parientes más próximos. A pesar de ello, aclaran que no es frecuente observar este tipo de comportamiento, por lo que son necesarios más estudios antes de generalizarlo.

No solo el chimpancé actúa como 'policía' para resolver conflictos en su grupo. Este comportamiento ha sido observado también en otros animales, como el bonobo, el gorila de montaña, el orangután de Borneo en cautividad y en varias especies de macaco y mono.""",

    2: """Texto 2: Lee el siguiente reportaje y contesta las preguntas de la 9 a la 14.

### Cinco mitos laborales que la ciencia desmiente

1. ¿Los jóvenes son mejores empleados? ¿El estrés laboral masculino es más frecuente? ¿Qué profesionales son más felices? ¿Un semestre sabático nos podría quitar el estrés? Esto es lo que aclaran los últimos estudios científicos que desmienten algunas ideas bastante asentadas en la cultura popular sobre el trabajo.

2. Los jóvenes no son mejores empleados. Michael Falkenstein, del Instituto alemán Leibniz, ha demostrado que los trabajadores de edad avanzada procesan las imágenes y los sonidos y toman decisiones a la misma velocidad que sus compañeros más jóvenes. Solo son un poco más lentos a la hora de "pulsar el botón", es decir, en los movimientos. Eso sí, lentos pero seguros, ya que según ha demostrado Falkenstein los empleados veteranos cometen menos errores.

3. El estrés laboral no afecta más a los hombres. De hecho, sometidas a los mismos niveles de estrés que sus compañeros masculinos, las mujeres tienden a adquirir más malos hábitos, como llevar una vida sedentaria, comer grasas y azúcares en exceso, fumar y consumir demasiada cafeína. Las enfermedades neurodegenerativas no nos atacan a todos por igual. Según la revista American Journal of Industrial Medicine, los mayores índices de Parkinson y Alzheimer se registran en banqueros, granjeros, dentistas, peluqueros y profesores.

4. Los médicos no son más felices. Los profesionales más propensos a sufrir depresión son los que trabajan en el sector de servicios, en atención primaria o en hostelería. En el extremo opuesto se encuentran los arquitectos, los técnicos instaladores, los ingenieros y los científicos.

5. Las vacaciones no son mejores cuanto más largas. Cuando se trata de descansar, la calidad es lo más importante. Es lo que afirma Dov Even, un psicólogo organizacional de la Universidad de Tel Aviv que lleva una década comparando los niveles de estrés crónico de los trabajadores antes, durante y después de un período de descanso. Con un "semestre sabático" el nivel de estrés desciende lo mismo que el de otros empleados que solo descansaban una semana. Por eso recomienda que, si podemos elegir, optemos por vacaciones más cortas, pero más frecuentes, en lugar de un mes completo de ocio continuado.""",

    3: """Texto 3: Lee el siguiente texto expositivo y contesta las preguntas de la 15 a la 20.

### Ficha Descriptiva: La Papaya (Melón de los trópicos)
También conocida como Melón de los trópicos o Melón de Árbol, la Papaya es el fruto comestible del árbol *Carica Papaya*.

**Orígenes**
El *Carica Papaya* es un árbol originario de México. En la época precolombina, los pueblos del Caribe ingerían el fruto verde para luchar contra los trastornos gastrointestinales. También lo usaban para ablandar la carne de pulpo o las carnes.

**Características**
Este fruto es una baya ovoide o redondeada, de 20 a 30 cm de largo, y que pesa de 1 a 5 kg. El fruto verde se vuelve amarillo al madurar. La epidermis, de unos pocos milímetros de espesor, es lisa y frágil. El corte transversal muestra una pulpa anaranjada a roja, que rodea una cavidad central llena de semillas esféricas, no comestibles, grises o negras. Entre las múltiples variedades existentes, las más difundidas en el mercado europeo son la *Sunrise* y la *Golden* que corresponden a las variedades de fruto pequeño de 300 a 700 g. La *Formosa* es una variedad de fruto más grande cuyo peso puede ser superior a 1 kilo. Este se consume generalmente fresco, pero también puede utilizarse para la extracción de una enzima proteolítica muy demandada, la papaína.

Cuando se incisa, la piel de la papaya verde despide un líquido blanco que coagula rápidamente. La acción digestiva y disolvente de las proteínas que caracterizan a la papaína se utiliza de forma terapéutica, en la industria del cuero, de la lana, de la seda, en la cervecería y en las industrias alimentaria y farmacéutica.

A pesar de los numerosos trabajos de transgénesis realizados para llegar a variedades casi perfectas, son las variedades de tipo silvestre las que producen frutos de pulpa anaranjada más sabrosos.

**Producción**
La papaya es siempre un fruto de intensa comercialización. La producción mundial anual se estima actualmente en 15 millones de toneladas y se concentra en Asia en un 51%, en el continente americano en un 39% y en África en un 10%. El consumo local sigue siendo el principal mercado para la producción, mientras que las exportaciones mundiales, que ascienden a unas 400.000 toneladas, están dirigidas principalmente por los países latinoamericanos. México es el principal exportador mundial de esta fruta. Pero es la India la que llega a la cabeza de los países productores de papayas con una cosecha de 5,9 millones de toneladas. Este país es seguido por Brasil con 1,5 Mt y Malasia con 1,3 Mt.""",

    4: """Texto 4: Lee el siguiente texto ensayístico y contesta las preguntas de la 21 a la 30.

### Ensayo sobre los celos y la psicología individual

Hay buenos muchachitos, que les amargan la vida a sus respectivas novias promoviendo tempestades de celos, que son realmente tormentas en vasos de agua, con lluvias de lágrimas y truenos de recriminaciones. Generalmente las mujeres son menos celosas que los hombres. Y si son inteligentes, aun cuando sean celosas, se cuidan muy bien de descubrir tal sentimiento, porque saben que la exposición de semejante debilidad las entrega atadas de pies y manos al fulano que les sorbió el seso. De cualquier manera; el sentimiento de los celos es digno de estudio, no por los disgustos que provoca, sino por lo que revela en cuanto a psicología individual.

Puede establecerse esta regla: cuanto menos mujeres ha tratado un individuo, más celoso es. La novedad del sentimiento amoroso conturba, casi asusta, y trastorna la vida de un individuo poco acostumbrado a tales descargas y cargas de emoción. La mujer llega a constituir para este sujeto un fenómeno divino, exclusivo. Se imagina que la suma de felicidad que ella suscita en él, puede proporcionársela a otro hombre; y entonces Fulano se toma la cabeza, espantado al pensar que toda "su" felicidad, está depositada en esa mujer, igual que en un banco. Ahora bien, en tiempos de crisis, ustedes saben perfectamente que los señores y señoras que tienen depósitos en instituciones bancarias, se precipitan a retirar sus depósitos, poseídos de la locura del pánico. Algo igual ocurre en el celoso. Con la diferencia que él piensa que si su "banco" quiebra, no podrá depositar su felicidad ya en ninguna parte. Siempre ocurre esta catástrofe mental con los pequeños financieros sin cancha y los pequeños enamorados sin experiencia.

Frecuentemente, también, el hombre es celoso de la mujer cuyo mecanismo psicológico no conoce. Ahora bien: para conocer el mecanismo psicológico de la mujer, hay que tratar a muchas, y no elegir precisamente a las ingenuas para enamorarse, sino a las "vivas", las astutas y las desvergonzadas, porque ellas son fuente de enseñanzas maravillosas para un hombre sin experiencia, y le enseñan (involuntariamente, por supuesto) los mil resortes y engranajes de que "puede" componerse el alma femenina.

Los pequeños enamorados, como los pequeños financistas, tienen en su capital de amor una sensibilidad tan prodigiosa, que hay mujeres que se desesperan de encontrarse frente al hombre a quien quieren, pero que les atormenta la vida con sus estupideces infundadas.

Los celos constituyen un sentimiento inferior, bajuno. El hombre, cela casi siempre a la mujer que no conoce, que no ha estudiado, y que casi siempre es superior intelectualmente a él. En síntesis, el celo es la envidia al revés. Lo más grave en la demostración de los celos es que el individuo, involuntariamente, se pone a merced de la mujer. La mujer en ese caso, puede hacer de él lo que se le antoja. Lo maneja a su voluntad. El celo (miedo de que ella lo abandone o prefiera a otro) pone de manifiesto la débil naturaleza del celoso, su pasión extrema, y su falta de discernimiento. Y un hombre inteligente, jamás le demuestra celos a una mujer, ni cuando es celoso. Se guarda prudentemente sus sentimientos; y ese acto de voluntad repetido continuamente en las relaciones con el ser que ama, termina por colocarle en un plano superior al de ella, hasta que al llegar a determinado punto de control interior, el individuo "llega a saber que puede prescindir de esa mujer el día que ella no proceda con él como es debido".

A su vez la mujer, que es sagaz e intuitiva, termina por darse cuenta de que con una naturaleza tan sólidamente plantada no se puede jugar, y entonces las relaciones entre ambos sexos se desarrollan con una normalidad que raras veces deja algo que desear, o terminan para mejor tranquilidad de ambos."""
}

print("Readings defined successfully.")
