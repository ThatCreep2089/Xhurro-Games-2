export default class Navi extends Phaser.GameObjects.Sprite{
    constructor(scene, target, offsetX, offsetY, texture, size,speed) {
        super(scene, target.x + offsetX, target.y + offsetY, texture);
        this.scene = scene;
        this.target = target;
        this.offset = new Phaser.Math.Vector2(offsetX, offsetY);
        this.speed = speed; // velocidad de seguimiento

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(size);
        this.body.setCollideWorldBounds(true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // posición objetivo (posición del otter + offset)
        const targetX = this.target.x + this.offset.x;
        const targetY = this.target.y + this.offset.y;

        // vector dirección
        const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y);
        const distance = direction.length();

        if (distance > 5) { // margen para evitar temblores
            direction.normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        } else {
            this.body.setVelocity(0, 0);
        }
    }
}