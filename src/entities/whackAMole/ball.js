export default class Ball extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, speed, pool) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.pool = pool;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setScale(0.5);
        this.speed = speed;
        this.picked = false;
        this.jugador = null;
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (this.picked && this.jugador) {
            this.x = this.jugador.x;
            this.y = this.jugador.y - 20;
        }

        // Detectar si se sale de la pantalla por arriba
        if (this.active && this.y < -10) {
            // Desactivar pelota y notificar a la escena
            this.pool.release(this);
            this.scene.events.emit("ball-removed");
        }
    }

    pick(player) {
        if (!this.active || this.picked) return;
        this.picked = true;
        this.jugador = player;
        this.body.setVelocity(0,0);
        this.body.allowGravity = false;
    }

    throw() {
        if (!this.picked) return;
        this.picked = false;
        this.jugador = null;
        this.body.allowGravity = true;
        this.body.setVelocityY(-this.speed);
    }
}