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
    }

    create(){
        this.add.image(0, 0, 'map').setOrigin(0, 0);
    }

    update(){

    }
}