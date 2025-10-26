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

        //Guardo la última tecla pulsada cuando se pulsa
        this.lastKey = null;

        this.scene.input.keyboard.on('keydown', (key) => {
            //Si la tecla pulsada es una de las que me interesan, esta será la última pulsada
            if (['W', 'A', 'S', 'D'].includes(key.key.toUpperCase())) this.lastKey = key.key.toUpperCase();
        });
        this.scene.input.keyboard.on('keyup', ()=> {
            this.lastKey = null;
        });

        this.body.setCollideWorldBounds(true);

        //inventario interno de materiales del jugador
        this.backpack = {
            paint: 0,
            paper: 0,
            clay: 0
        }
        this.canMove = true
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        //Movemos el objeto en función de las teclas pulsadas por el usuario
        //Priorizando la última usada
        if (!this.canMove) return;
        
        if (this.scene.keyW.isDown && (this.lastKey == 'W' || this.lastKey == null))
        {
            this.body.setVelocity(0, -this.speed * dt);
        }
        else if (this.scene.keyS.isDown && (this.lastKey == 'S' || this.lastKey == null))
        {
            this.body.setVelocity(0, this.speed * dt);
        }
        else if (this.scene.keyA.isDown && (this.lastKey == 'A' || this.lastKey == null))
        {
            this.body.setVelocity(-this.speed * dt, 0);
        }
        else if (this.scene.keyD.isDown && (this.lastKey == 'D' || this.lastKey == null))
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