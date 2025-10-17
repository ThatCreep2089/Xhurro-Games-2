//menu de inicio con botones para crear el juego
//Vacio por el momento
export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'MainMenu'})
    }
    preload(){
        this.load.image('otter', 'assets/imagenesWeb/smallant.png')
        this.scene.start('boot')
    }
}