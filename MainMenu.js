const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a1a',
    parent: 'game-container',
    scene: {MenuScene, GameScene}
};

// Menu Scene
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        //title text
        this.add.text(400, 180, 'The Otter Side', 
            { 
                fontFamily: 'Arial', 
                fontSize: '60px', 
                color: '#000000ff' 
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
        playButton.on('pointerdown', () => this.scene.start('GameScene'));
        exitButton.on('pointerdown', () => alert('BYE BYE!'));
    }
}

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(400, 300, 'Here begins the game...', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}

// Initialize the game
const game = new Phaser.Game(config);