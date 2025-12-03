export default class Navi extends Phaser.GameObjects.Sprite{
    constructor(scene, target, offset, texture, size,speed) {
        super(scene, target.x, target.y, texture);
        this.scene = scene;
        this.target = target;
        this.offset = offset;
        this.speed = speed; // velocidad de seguimiento

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(size);
        
        this.body.setCollideWorldBounds(true);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // vector dirección
        const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        const distance = direction.length();

        if (distance > this.offset) { // margen para evitar temblores
            direction.normalize();
            this.body.setVelocity(direction.x * this.speed * dt, direction.y * this.speed * dt);
        } else {
            this.body.setVelocity(0, 0);
        }

        this.setDepth(this.y);
    }
}