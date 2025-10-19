import sourcesHUD from '../HUD/sourcesHUD.js'
export default class Otter extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     */
    constructor(scene, x, y, speed,  texture, frame) {
        super(scene, x, y, texture, frame = 0);

        this.setScale(0.2);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        scene.physics.add.existing(this);

        this.speed = speed;

        //CONTROLES
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.body.setCollideWorldBounds(true);

        //inventario interno de materiales del jugador
        this.backpack = {
            paint: 0,
            paper: 0,
            clay: 0
        }
        
        //HUD recursos en inventario
        this.sourcesHUD = new sourcesHUD(this.scene, this.backpack);
    }

    updateInventory()
    {
        this.paintNumber.setText("Pintura: " + this.backpack.paint);
        this.paperNumber.setText("Papel: " + this.backpack.paper);
        this.clayNumber.setText("Arcilla: " + this.backpack.clay);
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {

        //Movemos el objeto en función de las teclas pulsadas por el usuario
        if (this.keyW.isDown)
        {
            this.body.setVelocity(0, -this.speed * dt);
        }
        else if (this.keyS.isDown)
        {
            this.body.setVelocity(0, this.speed * dt);
        }
        else if (this.keyA.isDown)
        {
            this.body.setVelocity(-this.speed * dt, 0);
        }
        else if (this.keyD.isDown)
        {
            this.body.setVelocity(this.speed * dt, 0);
        }
        else
        {
            this.body.setVelocity(0,0);
        }
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);
    }
}