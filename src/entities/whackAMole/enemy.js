export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.setActive(false);
        this.setVisible(false);
        this.setScale(0.25);
    }

    appear(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    hide() {
        this.setActive(false);
        this.setVisible(false);
    }

    destroyEnemy() {
        this.hide();
        // Aquí puedes agregar puntuación o efectos
    }
}