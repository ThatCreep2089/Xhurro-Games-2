export default class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ending' });
    }
    
    init(data) {
        this.goodEnding = data.good;
    }

    create() {
        //this.add.image(0, 0, 'ending').setOrigin(0, 0);
        this.add.text(400, 300, this.goodEnding ? 'Good Ending' : 'Bad Ending', {
            fontFamily: 'bobFont',
            fontSize: '48px',
            color: this.goodEnding ? '#00c52bff' : '#c70f0fff'
        }).setOrigin(0.5);

        //boton de continuar
        let continueButton = this.add.text(400, 550, 'continue', {
            fontFamily: 'bobFont',
            fontSize: '30px',
            color: '#00ffcc'
        }).setOrigin(0.5).setInteractive();

        //interactividad del botón
        continueButton.on('pointerover', () => continueButton.setStyle({ color: '#ffffff' }));
        continueButton.on('pointerout', () => continueButton.setStyle({ color: '#00ffcc' }));
        continueButton.on('pointerdown', () => {
            this.sound.stopAll();
            //this.scene.audio.play('titleMusic');
            this.scene.start('credits');
        });
    }
}