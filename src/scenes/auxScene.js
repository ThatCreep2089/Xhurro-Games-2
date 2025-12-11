export default class Aux extends Phaser.Scene{
    constructor(){
        super({key: 'aux'})
    }
    preload(){
        this.load.image('navi', './assets/imagenes/NPC/navi.png');
        this.load.once('complete', () => {
            this.scene.start('boot');
        });
    }
}