export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.setActive(false);
        this.setVisible(false);
        this.setScale(0.11);
        
    }
    preUpdate(t,dt){
        super.preUpdate(t,dt)        
    }

    appear(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    hide() {
        this.setActive(false); // Necesario para mostrar la animación
        this.setVisible(false);
    }

    destroyEnemy() {
        this.hide();
        // Aquí puedes agregar puntuación o efectos

        // Crear un sprite temporal para la explosión
        this.scene.sound.add('explosionSFX').play();
        const explosion = this.scene.add.sprite(this.x, this.y + 20, 'explosion');
        explosion.setScale(2); // Ajustar tamaño como tu enemigo
        explosion.play('explote');

        // Destruir el sprite de explosión después de 2 segundos
        this.scene.time.delayedCall(1000, () => {
            explosion.destroy();
        });
    }
}