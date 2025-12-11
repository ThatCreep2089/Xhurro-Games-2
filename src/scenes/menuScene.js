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

        let music = this.sound.add('titleMusic', {
            loop: true,
        });
        
        if (this.sound.context.state != 'suspended') music.play();
        else{
            this.input.once('pointerdown', () => {
              if (this.sound.context.state === 'suspended') this.sound.context.resume();
              music.play();
            });
        }
        

        //title text
        this.add.image(400, 150, 'TitleBanner').setScale(0.45);

        //start button
        let playButton = this.add.image(400, 300, 'playGame').setOrigin(0.5).setInteractive().setScale(0.3);

        //exit button
        let exitButton = this.add.image(400, 450, 'exitGame').setOrigin(0.5).setInteractive().setScale(0.5);
        
        //button interactivity
        playButton.on('pointerover', () => {            
            playButton.setTexture('playGameHover')

            this.playTween = this.tweens.add({
                targets: playButton,
                angle: { from: -15, to: 15 },
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        playButton.on('pointerout', () => {
            playButton.setTexture('playGame')

            if (this.playTween) this.playTween.stop();
            playButton.setAngle(0)
        });

        exitButton.on('pointerover', () => {
            
            exitButton.setTexture('exitGameHover')
            this.exitTween= this.tweens.add({
                targets: exitButton,
                angle: { from: -15, to: 15 },
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        exitButton.on('pointerout', () => {
            exitButton.setTexture('exitGame')
            if (this.exitTween) this.exitTween.stop();
            exitButton.setAngle(0)
        });

        //actions on click
        playButton.on('pointerup', () => {this.sound.add('acceptSFX').play(); music.stop(); this.scene.start('introScene');});
        exitButton.on('pointerdown', () => {this.sound.add('refuseSFX').play(); alert('BYE BYE!');});

        this.UIManager = new UIManager(this);

    }
}