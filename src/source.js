export default class Source extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Enemigo
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     * @param {Otter} otter - jugador en escena
     * @param {number} uses - número de usos antes de desaparecer, si es 0 entonces será ilimitado
     */
    constructor(scene, x, y,  texture, paint, paper, clay, otter, uses, size = 1, frame = 0) {
        super(scene, x, y, texture, frame);

        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.

        //Físicas
        scene.physics.add.existing(this, true); //Añadimos el cuerpo al objeto y lo hacemos estático
        scene.physics.add.collider(otter, this);//Añadrimos la colisión de la nutria

        //Variables únicas
        this.uses = uses; //Número de usos antes de desaparecer, si es 0 el recurso será ilimitado
        this.otter = otter; //personaje controlado por usuario (tiene el inventario y se usa para calcular distancias con el objeto)
        this.source = { //Recursos proporcionados por cada recolección
            paint: paint,
            paper: paper,
            clay: clay
        };
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);

        //Si la nutria y el recurso están aproximadamente en contacto se comprueba que se recoga el input de interacción
        //para recoger el recurso
        if (Math.abs(this.otter.x - this.x) <= this.width/2 * this.scale + this.otter.width/2 * this.otter.scale + 0.1 &&
            Math.abs(this.otter.y - this.y) <= this.height/2 * this.scale + this.otter.height/2 * this.otter.scale + 0.1)
        {
            let keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            if (Phaser.Input.Keyboard.JustDown(keySpace))
            {
                this.uses--;

                this.otter.backpack.paint += this.source.paint;
                this.otter.backpack.paper += this.source.paper;
                this.otter.backpack.clay += this.source.clay;

                this.otter.updateInventory();

                if (this.uses == 0) this.destroy();

                console.log("Backpack:\n"+this.otter.backpack.paint + "\n" + this.otter.backpack.paper + "\n" + this.otter.backpack.clay);
            }
        }
    }
}