export default class Character extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,speed){
        super(scene, x, y, texture)

        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.speed = speed;
        this.Akey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.Dkey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.setScale(0.5);

        const bodyWidth = this.width * 0.5;;
        const bodyHeight = 20; // altura del collider en la parte inferior
        const offsetX = (this.width - bodyWidth) / 2;  // centrar horizontalmente
        const offsetY = this.height - bodyHeight;      // poner en la parte inferior

        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset(offsetX, offsetY);
    }
    preUpdate(t,dt){
        super.preUpdate(t,dt)
        // Movimiento
        if(this.scene.gameEnded) return
        if (this.Akey.isDown) {
            this.body.setVelocityX(-this.speed);
        }
        else if (this.Dkey.isDown) {
            this.body.setVelocityX(this.speed);
        }
        else {
            this.body.setVelocityX(0);
        }
    }
}