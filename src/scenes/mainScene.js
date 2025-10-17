import Otter from "../characters/otter.js"

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
        this.load.image('map', 'assets/mainScene/map.png')
        this.load.image('otter', 'assets/imagenesWeb/smallant.png')
    }

    create(){
        let map = this.add.image(0, 0, 'map').setOrigin(0, 0);

        //Límites del mapa
        this.physics.world.setBounds(0, 0, map.width, map.height);
        this.cameras.main.setBounds(0, 0, map.width, map.height);

        //Nutria y movimiento de cámara
        let otter = new Otter(this, this.scale.width/2, this.scale.height/2, 2, 'otter');
        this.cameras.main.startFollow(otter);
    }

    update(){

    }
}