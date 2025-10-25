import Otter from "../characters/otter.js"
import Source from "../source.js"
import Build from "../build.js"
/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */

export default class mainScene extends Phaser.Scene {
    constructor(){
        super({key: 'mainScene'});
    }

    init(){

    }

    preload(){
        this.load.image('map', 'assets/mainScene/map.png');
        this.load.image('otter', 'assets/imagenesWeb/smallant.png');
        this.load.image('paint', 'assets/mainScene/paint.jpeg');
        this.load.image('destroyedHouse', 'assets/mainScene/destroyedHouse.jpg');
        this.load.image('house', 'assets/mainScene/house.png');
        this.load.image('buildSources', 'assets/mainScene/buildSources.jpg')
        this.load.image('spaceKey', 'assets/mainScene/keyboard_space.png')
    }

    #inputs; //Variable privada para los inputs
    create(){
        this.createAnims()

        let map = this.add.image(0, 0, 'map').setOrigin(0, 0);
        
        //Límites del mapa
         this.physics.world.setBounds(0, 0, map.width, map.height);
         this.cameras.main.setBounds(0, 0, map.width, map.height);

        //Controles
        
         //Asignamos las teclas para usarlas en escena
             this.#inputs = { //# significa que es una propiedad a la cual solo se puede acceder desde la propia clase
                 spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
                 keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                 keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                 keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                 keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
                }
            
         //Creamos una función con los estados de todas las teclas
             const inputStates = ()=> ({
                 isDown: false,
                 isUp: true,
                 justDown: false,
                 justUp: false
                });
         
         //Variables que sean la función descrita anteriormente creando copias diferentes con sus respectivos estados
             this.spaceKey = inputStates();
             this.keyW = inputStates();
             this.keyA = inputStates();
             this.keyS = inputStates();
             this.keyD = inputStates();

         //Suscripciones a eventos de input
             for (const key in this.#inputs)
             {
                //al presionar la tecla
                this.#inputs[key].on('down', ()=> {
                     this[key].isDown = true;
                     this[key].isUp = false;
                     this[key].justDown = true;
                });
    
                //al soltar la tecla
                this.#inputs[key].on('up', ()=> {
                     this[key].isDown = false;
                     this[key].isUp = true;
                     this[key].justUp = true;
                });
             }

        //Nutria y movimiento de cámara
        this. otter = new Otter(this, this.scale.width/2, this.scale.height/2, 20, 'otter');
        this.cameras.main.startFollow(this.otter);

        

        //Instanciar medios naturales de obtención de recursos
        this.createSources();

        //Instanciar construcciones
        this.createBuilds();

        //HUD
        this.createHUD();
    }

    update(){

        //Resetear just de los inputs
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
        for (const key in inputs)
        {
            inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
    }

    createAnims()
    {

    }

    createSources()
    {
        new Source(this, 1200, 1200, 'paint', 0, 0, 1, this.otter, 5);
    }

    createBuilds()
    {
        new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3, this.otter)
    }

    createHUD()
    {

    }
}