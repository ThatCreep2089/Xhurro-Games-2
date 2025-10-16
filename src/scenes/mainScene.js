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
        this.add.image(0, 0, 'map').setOrigin(0, 0);

        new Otter(this, this.scale.width/2, this.scale.height/2, 2, 'otter');
    }

    update(){

    }
}