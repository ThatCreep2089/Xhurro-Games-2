export default class Aux extends Phaser.Scene{
    constructor(){
        super({key: 'aux'})
    }
    preload(){
        this.load.image('otter', 'assets/imagenesWeb/smallant.png');
        this.scene.start('boot');
    }
}