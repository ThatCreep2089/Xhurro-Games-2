// Menu Scene
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'menuScene'});
    }

    preload() {
        this.load.image('map', 'assets/mainScene/map.png');
    }

    create() {
        this.add.image(0, 0, 'map').setOrigin(0, 0);

        //title text
        this.add.text(400, 180, 'The Otter Side', 
            { 
                fontFamily: 'Arial', 
                fontSize: '60px', 
                color: 'white',
            }).setOrigin(0.5);

        //start button
        const playButton = this.add.text(400, 300, 'PLAY', {
        fontFamily: 'Arial',
        fontSize: '40px',
        color: '#00ffcc'
        }).setOrigin(0.5).setInteractive();

        //exit button
        const exitButton = this.add.text(400, 400, 'EXIT', {
        fontFamily: 'Arial',
        fontSize: '40px',
        color: '#ff4444'
        }).setOrigin(0.5).setInteractive();

        //button interactivity
        playButton.on('pointerover', () => playButton.setStyle({ color: '#ffffff' }));
        playButton.on('pointerout', () => playButton.setStyle({ color: '#00ffcc' }));

        exitButton.on('pointerover', () => exitButton.setStyle({ color: '#ffffff' }));
        exitButton.on('pointerout', () => exitButton.setStyle({ color: '#ff4444' }));

        //actions on click
        playButton.on('pointerdown', () => this.scene.start('mainScene'));
        exitButton.on('pointerdown', () => alert('BYE BYE!'));
    }
}