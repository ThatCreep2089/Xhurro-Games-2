export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }
    create() {

        this.add.image(this.game.config.width/2, 100, "topo").setOrigin(0.5,0.5).setScale(0.6);

        const creditsText = '---CREDITS---'; //añadir mas

        let text = this.add.text(this.game.config.width/2,this.game.config.height/50 + creditsText,
            {fontFamily: 'bobFont',
            fontSize: '26px',
            color: '#ffffff',
            align: 'center'}).setOrigin(0.5,0);


        this.scrollSpeed = 1.2;
        this.text = text;
    }

    update(){
        this.text.y -= this.scrollSpeed;

        if (this.text.y < -this.text.height){
            this.scene.start('mainScene'); //volver al menu principal
        }
    }
}