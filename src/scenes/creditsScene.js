import GameDataManager from "../GameDataManager.js";
export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }
    create() {

        //FONDO
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'creditsBg').setOrigin(0.5,0.5).setScale(0.37);

         // --- LOGO ---
        this.logo = this.add.image(
            this.game.config.width / 2,
            this.game.config.height + 100,   //empieza fuera de pantalla
            "TitleBanner"
        ).setOrigin(0.5, 0.5).setScale(0.6);

        // --- TEXTO ---
        const creditsText = `
        --- CRÉDITOS ---
        
        Desarrolladores:
        Alicia Pérez Bumanlag
        Claudia Pérez Campoo
        Ismaél Ortega Sánchez
        Víctor Martínez Moreno

        Arte:
        Alicia Pérez Bumanlag
        Claudia Pérez Campoo

        Música y efectos:
        Víctor Martínez Moreno

        Agradecimientos especiales: Tu nutria interior 🦦

        ¡Gracias por jugar!


        Ahora, el chiste del pan que habla...





        El chiste del pan que habla va sobre una fiesta local. Imaginemos que es un pueblo con rollo Patones de Arriba y Patones de Abajo. Patones de Arriba, ¿vale? No nos vamos a meter con el lore de Patones de Abajo porque va a ser alargar el chiste del pan que habla. ¿Quién quiere alargar el pan este que habla? ¿No ves? Si hablamos demasiado tiempo seguido, empezamos a hablar mal. Entonces, vamos a ser breves porque no quiero ni malgastar ni vuestro tiempo ni el mío. Entonces vamos a empezar a contar ya, ahora sí, sin interrupciones, el chiste del pan que habla.

        Ay, ¿para qué hypearlo? Total, faltan 365 días para la fiesta del pan que habla.
        Pues la expectación que te puedes esperar cuando faltan 365 días para un acontecimiento muy importante. Patones de Arriba todavía se está recuperando del jolgorio de la anterior fiesta del pan que habla. Entonces, pues a los 365 días ya empiezan a ponerse en marcha los primeros engranajes de la bien engrasada maquinaria que es la festividad del gluten parlante.

        Vale, es anual la fiesta, eso no es relevante. Más dos de fracaso. Los números exactos no nos aportan la realidad de los sentimientos de la historia. Yo podría ser exacto en las cifras, podría ser exacto a lo que ocurrió exactamente, ¿vale? Podría ser fiel a eso, pero haciendo eso no sería fiel a los sentimientos que evoca la historia. Entonces, tomáoslo casi como unas olimpiadas, ¿vale? Faltan 364 días para la fiesta del pan que habla. Es una cosa que tienen que hablar con el alcalde y que tienen que hablar incluso con las comarcas circundantes a Patones de Arriba porque la fiesta del pan que habla requiere de cierta infraestructura.

        Entonces lo empiezan a mover el primer día. Yo creo que incluso podrías decir que han perdido un poquito de tiempo que es crucial porque hace falta mucha organización de cara a llevar adelante una fiesta de tanta enjundia como la fiesta del pan que habla. Porque lo que no os he contado es que la fiesta del pan que habla es un fenómeno de masas.

        ¿Y qué clase de fenómeno de masas es? Pues es prácticamente un fenómeno de masas que mueve a gente de todo el mundo. Si os recuerda al Burning Man, el famoso Burning Man, el festival que tiene lugar en medio del desierto y del cual se entera gente de todo el mundo y viaja hasta ahí para tener un reducto de paz y comunidad aislados del resto del mundo —aunque luego realmente resulten ser hippies, que es lo peor que puedes cultivar en 2025… Bueno, no es lo peor que puedes cultivar en el clima sociopolítico actual que tenemos, ¿vale? Entendedme—, pero dentro del contexto del chiste, dentro de la maravillosa ficción del chiste en la cual no tienes que pensar en los nazis, pues evidentemente el público del Burning Man es relativamente selecto, pero el público de la fiesta del pan que habla, lo que no gana en selecto, lo gana en absoluto volumen.

        La fiesta del pan que habla es mundialmente conocida y todos los años suscita, en el menor de los casos, una curiosidad bastante grande; en el mayor de los casos, un fervor casi religioso o incluso que trasciende la religión. Entonces no podemos subestimar el papel que cumple la fiesta del pan que habla no solo en el folklore local, sino en la unidad de las comunidades humanas a lo largo de la historia. Casi como que debería tener un asiento en las conferencias, en las cumbres de la ONU.

        Y si os creéis que estoy exagerando, quiero que sepáis que cuando faltan 363 días, ya empiezan a verse las primeras reservas de alojamiento, viajes, vuelos, trenes, buses. Incluso hay gente que piensa en fletar taxis, casi con un año de adelanto, precisamente para asegurarse de que van a poder desplazarse por la periferia de Patones —o mejor dicho, de las comarcas— porque van a estar tan atestadas que van a tener que dar la vuelta, salirse casi como si estuviesen en la M40, para empezar a moverse ya por toda la infraestructura y sobre todo el barullo de gente que tiene lugar alrededor de la fiesta del pan que habla.

        Entonces, ya se empiezan a mover esos primeros negocios, esas primeras reservas, que de hecho incluso están a un precio especialmente asequible porque si reservas con tiempo suficiente vas a tener ventajas. Porque tu planificación se la estás dando en formato de estabilidad a los proveedores, ¿no? Ellos reciben estabilidad y tú a cambio vas a tener precios más bajos: el quid pro quo de toda la vida en el mundo de la hostelería, hotelería, restauración y los viajes.

        Faltan 362 días para la fiesta del pan que habla y como bien decís: Mascarons what is bro even happen about? Efectivamente, es una fiesta internacional y ya se empiezan a oír las primeras voces en inglés: Oh my God, es la fiesta del pan que habla, porque hay turismo, turismo alrededor ya no solo de la fiesta del pan que habla, sino de las consecuencias de la fiesta del pan que habla, de la cultura que hay alrededor.

        Hay gente que va a Patones solo por el merchandising. Y aunque es casi un tabú religioso perderse la fiesta pudiendo ir, para muchas personas es tan intensa que prefieren sencillamente decir que han estado ahí y traerse una camiseta: "He sobrevivido a la fiesta del pan que habla y lo único que me he llevado es esta estúpida camiseta."

        Es casi una tradición. Si tú ves a alguien con una de esas camisetas, es casi un 50/50 la probabilidad de que no haya estado realmente en la fiesta del pan que habla. Pero no voy a juzgar a quien no quiera estar en el núcleo neurálgico.

        Faltan 361 días.
        Ya hay gente viendo desde qué ángulos van a contemplar la fiesta, viendo si podrán hablar con el pregón, buscando insider information. Hay turismo de todas partes. La gente pregunta "Where we dropping boys?".

        Hay canciones del pan que habla. Hay álbumes. Hay incluso tesis doctorales sobre cómo divergen las versiones de las canciones, cómo se influyen mutuamente: tesis, antítesis, síntesis.

        Hay filosofía.
        Es la experiencia de lo sublime.

        La gente compara la fiesta del pan que habla con Neon Genesis Evangelion. Si bien la humanidad puede acabar unida en el LCL, hay discusiones sobre hasta qué punto esa disolución del ego se parece a perderse en la masa que acude a la fiesta. Es casi la primera experiencia religiosa sintética.

        Es el día 360 y ya hay artículos sobre cómo Dios ya no es ex machina, sino ex humana; el Dios que surge de la conexión humana. Para mucha gente la fiesta representa eso.

        Faltan 359 días y ya empiezan los primeros conflictos: adjudicación de sitios, viviendas, recursos, alojamiento. A veces la gente olvida que están en el mismo equipo.

        En mitad del relato, suena una notificación:
        Se han intentado loguear en mi Twitter desde Tokio.
        Es phishing.
        Vuelve al relato:

        Faltan 358 días…
        La gente llega incluso a Patones de Abajo.
        Faltan 357 días.
        Ya hay tiendas de campaña. Hay gente que acampa un año entero para garantizar poder estar a pie de cañón.

        Avanzamos una semana: 350 días.
        Patones está irreconocible, atestado, masificado.
        Faltan 349 días.
        Faltan 348 días.
        Las comarcas colindantes sufren pero también se aprovechan. Aparece el mercado de merchandising ilegítimo, lo cual se considera casi un sacrilegio.

        Faltan 347 días.
        Todo está atestado.
        La fiesta del pan que habla es como un Shepard tone: un misterio que siempre parece ascender.

        Faltan 346 días para la fiesta del pan que habla, y ya empieza a verse algo que los locales conocen muy bien: la mirada del peregrino, esa expresión mitad agotamiento, mitad iluminación, típica de quienes han decidido dedicar un año entero de su vida a esperar que un trozo de pan les diga algo. Cualquier cosa. Una sílaba. Un susurro glutenado. Algo que dé sentido a sus vidas.

        Y se entiende. Porque no es solo la fiesta: es la promesa.

        Faltan 345 días.
        Los comerciantes de Patones de Arriba empiezan a preparar las primeras masas. No para la fiesta—no, no, no, por Dios—, sino para que la gente tenga pan “de práctica”. Pan que no habla, pan normal, pan mudo. Pan que sirve para no volverse loco esperando el verdadero suceso. Nadie quiere un brote psicótico masivo por déficit de hidratos de carbono.

        Faltan 344 días.
        Las colas empiezan a formar laberintos tan complejos que un antropólogo las describe como “una manifestación contemporánea del Minotauro administrativo”.
        Hay gente que ya no recuerda en qué cola estaban. Hay bebés que han nacido en esas colas y que creen que la cola es su hogar. Hay ancianos que esperan su turno para pedir la vez.

        Faltan 343 días.
        Los ayuntamientos de Patones de Arriba y Patones de Abajo se reúnen.
        La tensión es diplomática.
        Se firman acuerdos.
        Se rompen acuerdos.
        Se reinstauran acuerdos, pero esta vez en documentos plastificados “para simbolizar su durabilidad espiritual”.

        Mientras tanto, alguien en Twitter escribe:

        “¿Y si el pan no habla este año?”
        Y ese simple tweet genera un derrumbe económico en la bolsa del pan precocido. Un desastre.

        Faltan 342 días.
        Los primeros gurús llegan al pueblo.
        Gente que dice saber qué dirá el pan.
        Gente que afirma que el pan no tiene por qué hablar con palabras, sino “con texturas”.
        Uno asegura haber recibido un mensaje telepático del pan que habla mientras mordía una chapata de oferta.
        Otro dice que el pan se comunicará a través de vibraciones cuánticas gluten-fotónicas.

        Nadie les cree del todo.
        Pero tampoco se atreve a desmentirlos.
        No sea que acierten.

        Faltan 341 días.
        Los influencers llegan.
        Es inevitable.
        El pan que habla se viraliza.
        Empiezan los vídeos:
        “24 HORAS VIVIENDO COMO SI EL PAN YA HABLARA”
        “Le regalo a mi novia un pan que habla (sale mal)”
        “ASMR: sonidos del pan antes de hablar”

        La mitad del pueblo vive ahora entre trípodes.

        Faltan 340 días.
        Los científicos llegan.
        Biólogos.
        Lingüistas.
        Filósofos.
        Un tipo con una bata que no es científico pero que la lleva por la estética.

        Todos intentan descifrar cómo puede hablar un pan.
        Nunca llegan a un consenso.
        El consenso más cercano es:

        “Bueno, a ver, podría ser un fenómeno emergente de la masa madre.”

        Faltan 339 días.
        Los fans más devotos comienzan a vagar en procesión nocturna, con barras de pan en alto, murmurando cánticos. Es poético hasta que te das cuenta de que uno de ellos intenta comerse la barra del de delante cuando no mira.

        Faltan 338 días.
        Y aquí sucede algo inexplicable:
        Se oye un rumor.
        Un posible susurro.
        Un quizá… “eh”.

        La gente entra en pánico.
        Las redes colapsan.
        Un panadero afirma que lo oyó claro.
        Otro panadero dice que fue su estómago.
        Un tercero dice que lo oyó decir “hola”.
        Un cuarto asegura que dijo “¿tenéis agua?” porque estaba un poco duro.

        Faltan 337 días.
        La supuesta palabra del pan —ese “eh” que quizá no fue un “eh”— ya ha provocado tres tesis doctorales, once peleas en Twitter y una ruptura sentimental en la que alguien dice:

        “Siempre supe que eras panescéptica.”
        Y la otra persona responde:
        “Es que no puedes basar tu espiritualidad en una hogaza.”

        Faltan 336 días.
        Las autoridades de Patones deciden emitir un comunicado oficial para calmar los ánimos:

        “El pan NO ha hablado.”
        En mayúsculas.
        En negrita.
        Firmado por el alcalde, el panadero mayor y una señora que pasaba por allí pero tenía buena caligrafía.

        Aun así, la gente sospecha que es un encubrimiento gubernamental.

        Faltan 335 días.
        Los panaderos empiezan a recibir preguntas inquietantes del peregrinaje turístico:
        —Disculpe, ¿este pan es prehablado?
        —¿Podría el pan hacer mansplaining si hablara?
        —Si lo tuesto, ¿pierde vocabulario?

        Los panaderos están agotados.

        Faltan 334 días.
        La ONU menciona tímidamente el fenómeno en una reunión cerrada.
        No como tema principal, sino como:

        “Bueno, oye, ¿y si este año también tenemos que mandar observadores a Patones por… lo del pan ese?”

        Faltan 333 días.
        Se empieza a vender merchandising no oficial con frases como:
        “YO CREO EN EL PAN”
        “GLUTEN ES AMOR”
        “PATONES 4EVER”

        Y una camiseta muy confusa que dice:
        “YO ESCUCHÉ AL PAN HABLAR PERO NADIE ME CREE”
        que causa debates sobre si es una referencia, un spoiler o un grito existencial.

        Faltan 332 días.
        Un filósofo llega desde Perú exclusivamente para anunciar:

        “El pan no habla: somos nosotros los que interpretamos su silencio.”
        Lo cual queda muy profundo hasta que alguien le recuerda que el pan literalmente habló el año pasado.

        Faltan 331 días.
        El fandom se fractura en facciones:

        Los Prehablantes, que creen que el pan ya habló.

        Los Ultrahablantes, que creen que hablará más fuerte este año.

        Los Panpuros, que creen que el pan solo debería decir una palabra y nada más.

        Los Glutenlibres, que van por la estética pero no pueden comer nada del evento.

        Las discusiones son intensas pero educadas.

        Faltan 330 días.
        Alguien filtra una foto borrosa del supuesto pan que hablará este año.
        Es tan borrosa que podría ser cualquier objeto redondo y marrón.
        Podría ser un pan.
        Podría ser un topo.
        Podría ser un zoom a la calva de un turista.

        Aun así la imagen alcanza millones de visualizaciones.

        Faltan 329 días.
        Los rumores se disparan.
        Skyrim ya tiene un mod del pan que habla.
        Hay una cuenta de TikTok que sube edit tras edit, con el pan haciendo lipsync de canciones de Stray Kids.
        Maniac queda sorprendentemente bien.

        Faltan 328 días.
        Un experto en acústica afirma que el pan podría tener “cuerdas glutenales” capaces de producir sonidos “entre el Do mayor y el espasmo de un ganso”.
        La declaración se hace viral.
        Nadie entiende nada, pero suena científico.

        Faltan 327 días.
        Algo pasa.
        No se sabe qué.
        Pero se nota en el ambiente.
        La gente está inquieta.
        El panadero jefe no sale de su obrador.
        Las campanas de la iglesia repican solas a veces.
        O quizá es el viento.
        O quizá es algo más.

        Faltan 326 días.
        Una anciana de Patones, la persona viva que más veces ha oído hablar al pan, dice:

        “Este año será distinto.”
        No aclara si para bien o para mal.
        Luego se va a dar de comer a sus gallinas en completo silencio dramático.

        El hype crece.
        El misterio crece.
        El pan… quién sabe.      
        `;

        /*
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⢀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⢀⠀⣿⡂⢹⡇⠀⠀⣰⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⢸⡇⢸⣇⢸⣇⠀⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠾⠀⠀⣏⠀⡆⠀⠀
                                ⢸⣷⢸⣇⣸⣇⠀⣾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣠⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢲⣂⠀⣿⡄⢸⡀⣤
                                ⢠⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣊⡝⠛⠙⠂⠄⠠⠀⠀⠀⠀⠀⠀⡀⠀⠄⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣦⣼⣷⣼⣁⠼
                                ⢸⣿⣿⣿⣿⣿⣿⣀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⡻⣥⢋⡔⡀⠀⠀⠀⠀⠂⠁⠀⠄⠀⠠⠀⠂⢀⠀⠐⠈⠀⢀⠠⢀⣀⡀⠘⣿⡟⢿⣿⣿⣄
                                ⠈⣿⣿⣿⣿⣿⣿⣿⠿⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣷⢯⣿⣾⡔⠀⠀⠀⠀⠀⠂⢁⠠⠈⢀⠐⠀⠂⡀⠂⠠⠈⠀⠀⠉⠁⠁⣀⣈⠧⠈⠻⣿⣿
                                ⠀⣿⣿⣟⢿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡟⠛⠉⡉⢸⡉⠁⢀⠀⠀⠀⠀⠠⢁⠂⡐⢈⠀⠂⡁⠂⠄⢁⠂⠄⠡⠈⠄⠂⠄⡈⠀⠂⡁⠀⢻⠇
                                ⠀⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠺⣿⡇⣤⡤⢔⡿⣇⠀⢦⠀⠀⠀⠀⠐⣀⠂⡐⠠⢈⡐⠠⠁⠌⡀⠂⠌⠠⠁⡌⢐⠂⠔⡈⠆⣔⣠⣯⠀
                                ⠘⡟⣛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⣿⣿⠗⡲⠏⠟⠿⠀⠈⠓⠀⠀⠀⠡⡀⠆⣁⠢⢁⠤⠑⡨⠐⠤⠑⡨⠐⡡⠐⡌⢌⠒⡄⠈⠉⠁⠁⠀
                                ⠃⡜⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣼⣿⡟⢡⡿⠿⠷⠀⠀⠀⠀⠀⢀⠱⣀⠣⢄⠢⡁⢆⠱⢠⠉⢆⠱⣀⠣⡐⠡⢌⠢⡘⠤⡁⠐⠒⠂⠂
                                ⠐⠐⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⢻⠸⣡⢶⣿⣟⡃⠀⠘⠀⠀⢆⠡⢂⡜⢠⠃⡜⢠⢃⠦⣉⠦⡑⢢⡑⠬⡑⡌⢢⢑⠢⠅⠀⠀⡀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠐⠀⢁⡰⢸⠣⠉⠉⠋⠉⠀⠀⠀⠀⠈⠀⠣⢡⠜⢢⠩⢔⢣⡘⢲⡐⠦⣙⠢⣌⠓⣌⠲⡡⢎⠥⠃⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣶⡶⠆⠁⠠⠁⠊⠐⠁⠈⠠⠄⠂⠉⠈⠖⠀⠀⠒⣶⢦⡁⠂⠀⠀⠀⠀⠀⠀⠀⠀⠘⠃⠁⠀⠀⠀⠁⠈⠱⢌⠳⣌⠳⣌⢣⡕⢮⡘⡅⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠏⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠘⡳⢬⠳⡜⢦⡹⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠋⠧⠹⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠃⢈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠠⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠓⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⡀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢀⢶⠀⡶⣲⠀⣆⡒⣰⠒⢦⢰⠀⢰⡆⣴⠐⣶⠒⣐⣒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣺⣿⣿⣿⠛
                                ⠀⠀⠀⠀⠀⠀⠐⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠞⠚⠃⠻⠴⠃⠦⠝⠘⠤⠎⠸⠤⠘⠧⠞⠀⠛⠀⠰⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⣾⣿⣿⣿⠃⠀
                                ⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⢀⣤⣤⣤⣄⠀⠀⢠⣤⠀⠀⣤⣄⠀⠀⠀⣤⣤⠀⢠⣤⣤⣤⣤⣤⡄⢠⣤⣄⠀⠀⠀⠀⣤⣤⡄⠀⠀⠀⢠⣤⡄⠀⠀⠀⢘⡮⡝⣿⣿⡿⢆⠁⠀
                                ⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⣰⣿⠏⠉⠉⢿⣷⠀⢸⣿⠀⠠⣿⣿⣧⡀⠀⣿⣿⠀⢸⣿⡏⠉⠉⠉⠁⢼⣿⣿⡄⠀⠀⢸⡿⣿⡇⠀⠀⢀⣿⢻⣷⠀⠀⠀⡞⡜⣹⣿⣿⡙⢆⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⢸⣿⠀⠐⣿⡯⢻⣷⡀⣿⣿⠀⢸⣿⣷⣶⣶⡆⠀⢺⣿⠹⣿⡀⢠⣿⠃⣿⡇⠀⠀⣾⡟⠀⢿⣧⠀⠀⢣⠣⢽⣿⣯⡙⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢿⣿⡀⠀⠀⣠⣤⠀⢸⣿⠀⢈⣿⡧⠀⠹⣿⣿⣿⠀⢸⣿⡇⠀⠀⠀⠀⢸⣿⡄⢻⣧⣾⡏⢠⣿⡇⠀⣼⣿⣷⣶⣾⣿⣇⠀⠀⠱⢸⣿⢣⠜⠁⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣶⣾⣿⠏⠀⢸⣿⠀⠀⣿⡷⠀⠀⠹⣿⣿⠀⢸⣿⣿⣿⣿⣿⡆⢸⣿⡆⠀⢿⡿⠀⢰⣿⡇⢀⣿⡏⠀⠀⠀⢹⣿⡀⠀⢁⢸⡇⠈⡆⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠈⠉⠉⠀⠀⠀⠈⠉⠀⠀⠉⠁⠀⠀⠀⠉⠉⠀⠈⠉⠉⠈⠉⠉⠁⠈⠉⠀⠀⠈⠁⠀⠀⠉⠁⠈⠉⠀⠀⠀⠀⠈⠉⠁⠐⡀⢸⡐⠁⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⢘⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀*/
        // El texto empieza debajo del logo
        this.text = this.add.text(
            this.game.config.width / 2,
            this.logo.y + 200,
            creditsText,
            {
                fontFamily: "bobFont",
                fontSize: "26px",
                color: "#000000ff",
                align: "center",
                wordWrap: { width: this.game.config.width * 0.8 }
            }
        ).setOrigin(0.53, 0);

        // Velocidad del scroll
        this.scrollSpeed = 0.4;
        this.chakeStartY = this.text.y - (this.game.config.height + 400); // aprox donde empieza el chiste
    }

    update() {
        // Aumentar velocidad cuando se llega al chiste del pan que habla
        let currentSpeed = this.scrollSpeed;
        if (this.text.y < this.chakeStartY) {
            currentSpeed = this.scrollSpeed * 100; // 100x más rápido en el chiste
        }
        
        this.logo.y -= currentSpeed;
        this.text.y -= currentSpeed;
        // Si el texto ha salido completamente de la pantalla, volver a menuScene
        if (this.text.y < -this.text.height) {
            GameDataManager.resetGame();
            this.sound.stopAll();
            this.scene.start('menuScene');
        }
    }
}