export default class Mole extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'topo');

        scene.add.existing(this);
        this.setInteractive();
        this.setScale(0.4);

        this.visible = false;
        this.isActive = false;

        this.on('pointerdown', () => {
            if (this.isActive) {
                this.hit();
            }
        });
    }


    showAt(x, y) {
        this.setPosition(x, y);
        this.setVisible(true);
        this.isActive = true;

        this.scene.time.delayedCall(1000, () => {
            this.hide();
        });
    }

    hide() {
        this.setVisible(false);
        this.isActive = false;
    }

    hit() {
        this.scene.updateScore(10);
        console.log('Mole hit!');
        this.hide();
    }
}