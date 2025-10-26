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
    }

    create(){
        let map = this.add.image(0, 0, 'map').setOrigin(0, 0);

        //Límites del mapa
        this.physics.world.setBounds(0, 0, map.width, map.height);
        this.cameras.main.setBounds(0, 0, map.width, map.height);

        //Nutria y movimiento de cámara
        let otter = new Otter(this, this.scale.width/2, this.scale.height/2, 20, 'otter');
        this.cameras.main.startFollow(otter);

        //Instanciar medios naturales de obtención de recursos
        new Source(this, 1200, 1200, 'paint', 0, 0, 1, otter, 5);

        //Instanciar construcciones
        new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3, otter)
    }

    update(){

    }
}