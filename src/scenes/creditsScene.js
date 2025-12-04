export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'credits' });
    }
    create() {
        this.add.text(400, 300, 'Credits Scene\n\nGame developed by Xhurro Games\n\nThank you for playing!', {
            fontFamily: 'bobFont',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
    }
}