// Menu Scene
import UIManager from "../HUD/UIManager.js";
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'menuScene'});
    }

    preload() {
    }

    create() {
        this.add.image(0, 0, 'titleBg').setOrigin(0, 0).setScale(0.5);

        //title text
        this.add.image(400, 150, 'TitleBanner').setScale(0.45);

        //start button
        let playButton = this.add.image(400, 300, 'playGame').setOrigin(0.5).setInteractive().setScale(0.3);

        //exit button
        let exitButton = this.add.image(400, 450, 'exitGame').setOrigin(0.5).setInteractive().setScale(0.5);

        //button interactivity
        playButton.on('pointerover', () => playButton.setTexture('playGameHover'));
        playButton.on('pointerout', () => playButton.setTexture('playGame'));

        exitButton.on('pointerover', () => exitButton.setTexture('exitGameHover'));
        exitButton.on('pointerout', () => exitButton.setTexture('exitGame'));

        //actions on click
        playButton.on('pointerdown', () => this.scene.start('introScene'));
        exitButton.on('pointerdown', () => alert('BYE BYE!'));

        this.UIManager = new UIManager(this);
    }
}