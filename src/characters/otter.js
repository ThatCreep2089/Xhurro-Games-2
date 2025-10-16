export default class Otter extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Enemigo
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     */
    constructor(scene, x, y, speed,  texture, frame) {
        super(scene, x, y, texture, frame = 0);

        this.setScale(0.2);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        this.speed = speed;

        //CONTROLES
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);

        if (this.keyW.isDown)
        {
            this.y -= this.speed;
        }
        else if (this.keyA.isDown)
        {
            this.x -= this.speed;
        }
        else if (this.keyS.isDown)
        {
            this.y += this.speed;
        }
        else if (this.keyD.isDown)
        {
            this.x += this.speed;
        }
    }
}