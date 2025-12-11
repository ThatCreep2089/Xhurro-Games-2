# Xhurro-Games-2

Copyright © 2025 Víctor Martínez Moreno, Ismael Ortega Sánchez, Alicia Pérez Bumalag y Claudia Pérez Campoo           Todos los derechos reservados.
Los autores de la documentación, código y recursos de este trabajo, conceden permiso permanente a los profesores de la Facultad de Informática de la Universidad Complutense de Madrid para utilizar nuestro material, con sus comentarios y evaluaciones, con fines educativos o de investigación; ya sea para obtener datos agregados de forma anónima como para utilizarlo total o parcialmente reconociendo expresamente nuestra autoría.

Equipo de desarrollo:
Martínez Moreno, Víctor
Ortega Sánchez, Ismael
Pérez Bumanlag, Alicia
Pérez Campoo, Claudia

Enlace a web: https://thatcreep2089.github.io/Xhurro-Games-2

Cartas utilizadas:
Slot 0: EN BLANCO (AO8)
Slot 1: NUTRIA CON SOMBRERO (P01)
Slot 2: NAVI (P24)
Slot 3: TERRAFORMING MARS (M09)
Slot 4: FINAL FANTASY (M30)
Slot 5: PROFESORES DE LA FDI (P02)

## INDICE:
ESTE PROYECTO ES UN TRABAJO UNIVERSITARIO
<details>
  <summary> Descripción </summary>
El juego es un RPG sin combates donde tenemos a una nutria como protagonista que, guiada por el hada Toni, tendrá que reconstruir su subconsciente (el cual está sometido a un proceso de cambio) ayudándose de las emociones en una serie de días. Si no lo consigue se perderá en su subconsciente, si lo consigue superará su proceso de desarrollo personal con éxito.
</details>

  
<details>
<summary> GDD </summary>
<table>
<tr>
<td width="10"></td>
<td>
<details>
<summary> Resumen </summary>

<table>
<tr>
<td width="20"></td>
<td>
<details>
<summary> Género y PEGI </summary>
	
## Género y PEGI
Se trata de un juego RPG/Aventura y recolección de recursos,donde el protagonista tendrá que recolectar recursos para reconstruir si subsoncietne.


EL PEGI es /, ya que es un juego que aunque toque algún tema algo más profundo no contiene ningún acto de violencia, uso de sustancias, etc.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Lore </summary>
  
## Lore
Una nutria tenía una vida normal como la de cualquier otra nutria, pero todas las nutrias cambiamos, nunca somos la misma nutria…


La nutria entra en un proceso de desarrollo personal debido a un trastorno disociativo donde su mente cambia y su subconsciente está en un proceso de reconstrucción. 


Para poder pasar ese proceso con éxito tendrá que reconstruir su subconsciente en menos de seis días.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Características principales </summary>
  
## Características principales
-Explora los paisajes del subconsciente de la nutria en vista cenital.


-Recolecta emociones para reconstruir el subconsciente.


-Adéntrate en la historia de superación personal de una pequeña nutria.


-Reconstruye el subconsciente antes de alcanzar la fecha límite.


-Arte estilo pastel-style / crayón-style.


-Controla a la nutria con el teclado y el ratón.
</details>
</td>
</tr>
</table>
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
	<summary> Objetivo del juego</summary>
	
## Objetivo del juego
El objetivo del juego es reconstruir el subconsciente de la nutria con los recursos obtenidos antes de que acaben los seis días, si consigue reconstruir

todos los edificios/estructuras ganará en caso, contrario perderá.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
	<summary> CoreLoop</summary>
	
## CoreLoop
<img width="608" height="468" alt="image" src="https://github.com/user-attachments/assets/7f237e4b-969a-4fda-8f43-a01723906bc8" style="display:block; margin: 0 auto;" />
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
<summary> Mecánicas </summary>
<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Movimiento </summary>	

## Movimiento
El jugador podrá moverse en 4 direcciones, siendo los vectores de movimiento sobre el eje x (0,1), (1,0), (0,-1), (-1,0) 

y mirará hacia donde se mueve en todo momento. También estará normalizado, de forma que no se mueva más rápido en diagonal que en los ejes.


El movimiento será inmediato, sin aceleración y digital para hacer unos controles más responsivos.


El personaje frenará completamente con la colisión con estructuras y objetos sobre el suelo en el mapa (decoraciones, casas y recursos naturales).


Si se encuentra dentro de un dialogo se bloqueará el movimiento del juegadro hasat que salga de él.


<img width="361" height="162" alt="image" src="https://github.com/user-attachments/assets/ebe38496-31a2-4f32-9103-eb32a81e2946" />

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Recursos </summary>

## Recursos
En el juego se podrán encontrar tres recursos:

**Pintura:** la cual representa integridad / bondad

	
**Origami:** la cual representa perseverancia / paciencia


**Arcilla:** la cual representa determinación / valentía


Estos se conseguirán de diversas maneras, una de ellas será completando misiones y otra será recolectarlos de su medio natural.


Para recolectarlos en su medio natural, el jugador deberá acercarse a la fuente del recurso y 


pulsar la tecla de interacción unos segundos, obteniendo así poco a poco el recurso de la fuente. Este requerirá de una cantidad determinada de energía para conseguirlo, si no, no se podrá extraer.


Solo habrá tres tipo de fuentes de recurso en todo el mapa y no se agotan. 


Un río de pintura de donde se obtendrá la pintura, unas flores de papel de donde se obtendrá el origami y unas piedras de donde se obtendrá la arcilla.

<div><img width="418" height="65" alt="image" src="https://github.com/user-attachments/assets/34983065-e42f-4112-a038-427de1ad5c35" /></div>
<div><img width="480" height="419" alt="image" src="https://github.com/user-attachments/assets/0ab708b9-0311-4dd3-889b-58cfabd1d3fb" /></div>

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Dialogos </summary>
	
## Dialogos
Los personajes podrán hablar entre ellos, para ello aparecerá un cuadro de texto en pantalla donde empezarán a aparecer 


las frases letra por letra junto con una imagen ampliada del personaje que habla y su nombre.


Si se interactúa mientras el texto se está escribiendo, el texto se completará al instante.


Si se interactúa cuando el texto ha terminado de escribirse, aparecerá el siguiente texto junto con la imagen del personaje 


que habla y su nombre (todo esto sin que desaparezca la burbuja). En caso de no haber siguiente texto, la burbuja desaparecerá junto con el texto, la imagen y el nombre del personaje.


Cada vuadro de texto tendrá un colar para diferenciar quien habla, además de que todos los cuadros de texto tienen la misma fuente.


<div><img width="898" height="422" alt="image" src="https://github.com/user-attachments/assets/15a3fe0e-a00c-4e6a-9efd-19586ff9d856" /></div>



<div><img width="829" height="361" alt="image" src="https://github.com/user-attachments/assets/25d0ceba-db88-4932-b9a7-e4f571225bfd" /></div>
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Minijuegos </summary>
	
## Minijuegos
Mientras la nutria explora el mundo se encontrará con NPCs  que tendrán una misión, 


esta misión es un pequeño minijuego el cual dará una cantidad de recursos a cambio de gastar una cantidad de estamina.


Al interactuar con el NPC, Navi(el hada que sigue al personaje) empezará a hablar con el NPC, este le explicará el minijuego, y tras esto aparecerá un pop-up donde aparecerán los siguientes elementos:


**Nombre de la misión.**


**Tipo de recompensa.**


**Coste de la misión.**


**Imágenes descriptivas.**


**Descripción detallada.**


**Botón de aceptar que iniciará la misión al ser pulsado.**


**Botón de rechazar, que cerrará el pop-up junto con todos sus elementos al ser pulsado.**


Las misiones serán minijuegos que darán NPCs los cuales son:


**Whack-A-Mole:** 

Aparecerán topos cada cierto tiempo en un hoyo aleatorio y se tendrá que aplastarlos con el click del ratón. 


Los topos darán cierta cantidad de puntuación al golpearlos. Obstáculos surgirán aleatoriamente en lugar de topos, estos serán dinamitas que, al ser golpeadas, restarán una cantidad fija de puntos.  


El objetivo será llegar a una puntuación en el tiempo límite. El jugador verá 9 agujeros en pantalla (3x3) de los cuales saldrán los topos o las dinamitas 


(pueden aparecer topos y dinamitas simultáneamente en distintos agujeros o solo un topo/dinamita).


<div><img width="900" height="672" alt="image" src="https://github.com/user-attachments/assets/1920e37e-a0da-4234-a6c0-07ad8d59f288" /></div>



<div><img width="896" height="665" alt="image" src="https://github.com/user-attachments/assets/bcb561e8-a1de-4081-a9e2-9415eb36df4c" /></div>


**Ilumina los fantasmas:** 

Por medio de una antorcha la cual se puede arrastrar (moviendo el ratón), se tendrá que alumbrar a distintos fantasmas para que desaparezcan (disminuirán su tamaño poco a poco). 


Si consigues eliminarlos te darán una cantidad fija de puntos, por el contrario al no conseguirlo, se acercarán a ti y te quitarán puntos. 


El objetivo, al igual que en el minijuego anterior, será llegar a una puntuación determinada en un tiempo límite. 


El jugador verá un escenario/paisaje oscuro y empezarán a aparecer fantasmas por la pantalla (cada vez en más abundancia conforme pase el tiempo). 


Estos se encontrarán en una posición fija o moviéndose por la pantalla.


<div><img width="902" height="678" alt="image" src="https://github.com/user-attachments/assets/8c80ca9a-3988-4999-a2d7-488a2411492b" /></div>



<div><img width="900" height="671" alt="image" src="https://github.com/user-attachments/assets/7fe74feb-6f75-49d7-ad60-207b1ff41b61" /></div>


**Puzzle:** 

Se tendrá que completar una imagen la cual se dividirá en piezas y tendrán una rotación distinta de 0 en el eje z. 


El jugador tendrá que girar las piezas haciendo clic en ellas. 


La perspectiva del jugador será una cuadrícula en la que tendremos que las piezas. 


Si no se completa la imagen en el tiempo establecido, no se darán puntos, por el contrario si se consigue se entregará una cantidad fija de estos.


La puntuación de los minijuegos dará una cantidad de recursos en función de los puntos, de forma que existe la posibilidad de que el gasto de estamina 


no salga rentable dependiendo de completar o no el minijuego (el minijuego del puzle solo te da puntos si completas la imagen en el tiempo establecido) 


o los puntos que consigues (en el minijuego de los topos y de los fantasmas siempre se ganan puntos, pero pueden ser más o menos). 


<div><img width="898" height="672" alt="image" src="https://github.com/user-attachments/assets/c1e8ba48-74f6-4f57-b448-29792d28d74a" /></div>



<div><img width="893" height="670" alt="image" src="https://github.com/user-attachments/assets/d963223d-1bf8-45f2-9c3f-43bfc11be7b2" /></div>



Todos los minijuegos se desarrollan en pantalla completa y en primera persona.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Paso del tiempo </summary>
	
## Paso del tiempo
La nutria tiene 6 días para terminar de construir su subconsciente pero, ¿cómo pasa el tiempo?.


El jugador cuenta con una barra de estamina, cuando esta llegue a 0 el día pasará.


La nutria aparece todos los días en el mismo sitio (su caseta).
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Estamina </summary>
	
## Estamina
La barra de estamina aparecerá completa con 100 puntos al principio de cada día y no se podrá rellenar de otra manera.


Cuando la barra se vacía por completo el día pasa para recargarse de nuevo en el siguiente.


Las formas de disminuir la estamina son las siguientes:


Recoger 4 de cualquier recurso independientemente del que sea y el orden gastará 10 de estamina (cantidad humilde).


Terminar una misión consumirá 30 de estamina (cantidad elevada).


<img width="177" height="72" alt="image" src="https://github.com/user-attachments/assets/fac7e01d-56ba-4ccb-9f52-147a3fd073eb" />

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Reconstrucción </summary>
	
## Reconstrucción
En el juego se encontrarán estructuras u objetos destruidos/distorsionados, estos se podrán reconstruir y para ello se necesitará una cantidad de recursos específicos.


Al acercarse al objeto/estructura aparecerá un pequeño texto con el nombre del objeto y los recursos necesarios para repararlo. 


Si se interactúa y se tiene los recursos necesarios la estructura/objeto se construirá/dejará de estar distorsionada.

<div><img width="707" height="581" alt="image" src="https://github.com/user-attachments/assets/459e831e-8941-44b8-a688-098967c7a289" /></div>


<div><img width="612" height="322" alt="image" src="https://github.com/user-attachments/assets/cf5ad750-ab85-4990-94a5-bd43c9dd0c6d" /></div>
</details>
</td>
</tr>
</table>
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
	<summary> Interfaz </summary>
<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Controles </summary>
	
## Controles
[W][A][S][D]: movimiento cartesiano.


[Espacio]: interacción.


[Esc]: acceder al menú.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Camara </summary>
	
## Camara
La cámara se colocará en posición cenital siguiendo a la nutria constantemente. 


Esta será del tamaño de la ventana del juego en la página web.


Si el movimiento de la cámara implica que este se salga de los límites del layout del nivel, esta no se moverá (para que no se salga del mapa).
</details></td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
<summary> HUD </summary>
		
## HUD
En cuanto al HUD, en la zona superior izquierda de la pantalla se podrán apreciar los recursos obtenidos. 


En la zona superior derecha se podrá obtener la estamina que se tiene en cada momento.


<img width="895" height="102" alt="image" src="https://github.com/user-attachments/assets/80fbf7e4-f348-4841-987c-f0dfb34b9558" />



En cuanto a los diálogos aparecerá en la zona inferior un recuadro con una imagen del personaje que está hablando, su nombre y el texto.


<img width="887" height="522" alt="image" src="https://github.com/user-attachments/assets/7e5e2170-559a-46ec-ab74-7ad05b209abe" />


Para las misiones encontraremos un pop-up que cubrirá toda la pantalla, contendrá el nombre de la misión en la zona superior izquierda, 


un poco más abajo una descripción detallada junto con una o varias imágenes que ayuden a entender el minijuego de la misión de un vistazo.


Encontraremos además el coste de la misión (estamina) y la recompensa (las recompensas van en función de los puntos conseguidos a final de la partida, información más detallada en minijuegos). 


En la zona inferior podemos ver los botones para rechazar o aceptar la misión.


<img width="897" height="674" alt="image" src="https://github.com/user-attachments/assets/057fbd99-db42-4fc8-ad2b-a69ee52423be" />

</details>
</td>
</tr>
</table>

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
<summary> Mundo del juego </summary>
<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Personajes </summary>
	
## Personajes
Nutria: protagonista de la historia. Es el personaje que controla el jugador. 

Es una nutria con un sombrero y pintada de manera abstracta tipo Picasso .


<img width="342" height="313" alt="image" src="https://github.com/user-attachments/assets/bc7dee86-5351-4b5f-9dfc-657c5b466d58"style="display:block; margin: 0 auto;" />


NPCs para obtener misiones:
Toni: se parecerá a Timmy Turner pero con el aspceto de TOni.


<img width="256" height="256" alt="image" src="https://github.com/user-attachments/assets/a2a56a00-f4e5-47fc-9934-a8c2d6337d90" style="display:block; margin: 0 auto;" />


Pablo: se pareceerá a Jimmy Neutron pero con los aspectos de Pablo 


<img width="201" height="327" alt="image" src="https://github.com/user-attachments/assets/06745476-ef1c-47b4-8cfb-a8e4e9914a69" style="display:block; margin: 0 auto;" />


Ish: Forma parte de la banda EXODIA y no puede separarse de sus dos queridos compañeros de aventuras, Ma y El. Tiene el aspecto de un brazo derecho con mucha masa muscular.


Ma: Forma parte de la banda EXODIA y no puede separarse de sus dos queridos compañeros de aventuras, Ish y El. Tiene el aspecto de la cabeza de un profesor de AA (como las pilas).


El: Forma parte de la banda EXODIA y no puede separarse de sus dos queridos compañeros de aventuras, Ish y Ma. Tiene el aspecto de un brazo izquierdo con mucha masa muscular.


<img width="587" height="296" alt="image" src="https://github.com/user-attachments/assets/fba897a9-2549-4413-8358-253b7822c677" style="display:block; margin: 0 auto;" />


Cleon y Rome: Una pareja feliz con una enorme determinación para seguir adelante con su relación. 


Cleon, que tendrá el aspecto de uno de los profesores de P2 con el vestido de novia, no puede separarse de su mujer con el traje de novia; 


Rome, con la apariencia de uno de los profesores de P2.


<img width="495" height="452" alt="image" src="https://github.com/user-attachments/assets/1fe8fbdd-a035-424e-853a-ab613fc7bba9" />

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="20"></td>
<td>
<details>
	<summary> Mapa del mundo </summary>

## Mapa del mundo
Representa la mente de la nutria, posiblemente se divida estéticamente en 5 zonas temáticas, por ejemplo: Un bosque quemado, una laguna, un parque, una zona de río y un campo de flores o jardín. Las zonas estarán interconectadas entre sí.


<img width="525" height="394" alt="image" src="https://github.com/user-attachments/assets/113e546b-6576-46c4-8bc7-c76897a69a2e" style="display:block; margin: 0 auto;" />
</details>
</td>
</tr>
</table>

</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
	<summary> Experiencia de juego </summary>

## Experiencia de juego
El jugador se sumergirá en una historia de superación donde poco a poco empezará a reconstruir su subconsciente, 


se trata de una experiencia de juego tranquila con una dinámica simple de recolección de recursos y construcción en la que el jugador no se enfrenta a situaciones frenéticas como combates o similares.


En cuanto a los minijuegos a pesar de ser sencillos y no requerir de una respuesta rápida de forma que no se pone al jugador en tensión sí que requieren un poco de concentración, 


todo esto sin alejarse de la experiencia relajada del gameplay.


En general, el juego busca constantemente una experiencia relajada para el jugador de forma que pueda jugar al juego sin requerir mucha concentración en la mayoría de los casos.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
<summary> Estética y contenido </summary>

## Estética y contenido
La estética del juego está enfocada a manualidades y arte, de esta forma el contenido visual del juego tiene un acabado pastel que hace que parezca que los personajes, objetos de la escena y fondos y escenarios están pintados con cera en un lienzo, haciendo referencia también a que el subconsciente como un lienzo que cada uno dibuja y colorea a su manera.

En cuanto a la música se encontrarán temas tranquilos y que transmitan relajación y los efectos de sonido serán grabaciones de audio creadas por los desarrolladores con sus voces y sonidos encontrados en la vida cotidiana como puede ser el sonido de dejar un tenedor en un plato, de abrir una lata de refresco, entre otras cosas.
</details>
</td>
</tr>
</table>

<table>
<tr>
<td width="10"></td>
<td>
<details>
	<summary> Referencias </summary>

## Referencias
Psychonauts: estética y ambientación en  la mente de una persona con algún tipo de trauma.


<img width="436" height="550" alt="image" src="https://github.com/user-attachments/assets/d44c5d04-602a-4a5c-8e77-252c8e195255" />


Paper Mario: los recursos que se recogen en el juego son manualidades que representan algún tipo de emoción/sentimiento.


<img width="1456" height="728" alt="image" src="https://github.com/user-attachments/assets/2a21ca25-166e-47ed-911c-dfecc1dd7b29" />


La mecánica se realiza en un tiempo determinado con un número limitado de acciones como: “Fear and Hunger: Termina” o "The Legend of Zelda Majora 's Mask".


<img width="785" height="627" alt="image" src="https://github.com/user-attachments/assets/5feb2fa4-6dec-435d-b853-add2c5b75739" />


Expedition 33: al ser un RPG / Aventura basado en un mundo de pintura.


<img width="727" height="731" alt="image" src="https://github.com/user-attachments/assets/9ada1218-7885-492b-a6ca-d20e611f95b3" />


Stardew Valley y Animal Crossing: por el modo de paso de días y gestión de recursos para construir.


<img width="767" height="439" alt="image" src="https://github.com/user-attachments/assets/f16577eb-9868-41ae-8495-1c1d5a8b869c" />


Mario Party: los minijuegos y como se muestran al jugador se asemejan mucho a los de esta saga.


<img width="396" height="198" alt="image" src="https://github.com/user-attachments/assets/c3276bc3-7b52-40eb-bd9c-c1f41771729d" />

</details>
</td>
</tr>
</table>

</details>
<details>
	<summary>Assets</summary>

## Assets
Los assets realizados irán acordes a la estética ya que tienen que tener algun tipo de aspecto artístico de alguno de esos movimientos (abstaracción,cubísmo,etc.)

Los assests usados para los NPC son los profesores de la UCM pero represetnados de manera satírica asociandolos con algun tipo de broma,pero ninguna de mal gusto.
No obstante la mayor parte de assets son placehoders o imagenes usadas para la web o placeHolder.

Los assets creados por los encargados de arte durante el desarrollo del proyecto se adhieren a una licencia de copyright en la que se reservan todos los derechos de autor.
</details>
##Gráfico de architectura


<img width="2657" height="3184" alt="New_Diagram" src="https://github.com/user-attachments/assets/bb5109da-9ca7-44b8-8eb3-117fda34674d" />

<details>
	
</details>
