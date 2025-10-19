import buildSourcesHUD from './HUD/buildSourcesHUD.js'
export default class Source extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     * @param {Otter} otter - jugador en escena
     */
    constructor(scene, x, y,  texture, builtTexture, paint, paper, clay, otter, size = 1, frame = 0) {
        super(scene, x, y, texture, frame);

        
        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.

        //Físicas
        scene.physics.add.existing(this, true); //Añadimos el cuerpo al objeto y lo hacemos estático
        scene.physics.add.collider(otter, this);//Añadrimos la colisión de la nutria

        //variables únicas del objeto
        this.builtTexture = builtTexture; //Sprite de la estructura reconstruida
        this.built = false; //Booleano encargado de saber si la estructura sigue destruida o está reconstruida
        this.otter = otter; //jugador (tiene el inventario y sirve para calcular distancias)
        this.sources = { //Recursos necesarios para reparación
            paint: paint,
            paper: paper,
            clay: clay
        };

        this.thereIsMessage = false; //Para saber si el mensaje de materiales está o no en pantalla
        this.message = null;
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
        if (!this.built && Math.abs(this.otter.x - this.x) <= this.width/2 * this.scale + this.otter.width/2 * this.otter.scale + 0.1 &&
            Math.abs(this.otter.y - this.y) <= this.height/2 * this.scale + this.otter.height/2 * this.otter.scale + 0.1)
        {
            //Mensaje para informar de los materiales que se necesitan para reparar la estructura
            if (!this.thereIsMessage)
            {
                this.message = new buildSourcesHUD(this.scene, 'buildSources', this.sources,
                                 this.otter.backpack.paint >= this.sources.paint &&
                                 this.otter.backpack.paper >= this.sources.paper &&
                                 this.otter.backpack.clay >= this.sources.clay,
                                  0.4);
                this.thereIsMessage = true;
            }
            

            //Si se interactua con la estructura y se tienen suficientes materiales
            //la estructura se reconstruye
            let keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            if (Phaser.Input.Keyboard.JustDown(keySpace) &&
                this.otter.backpack.paint >= this.sources.paint &&
                this.otter.backpack.paper >= this.sources.paper &&
                this.otter.backpack.clay >= this.sources.clay)
            {
                this.otter.backpack.paint -= this.sources.paint;
                this.otter.backpack.paper -= this.sources.paper;
                this.otter.backpack.clay -= this.sources.clay;

                this.setTexture(this.builtTexture);
                this.otter.sourcesHUD.updateInventory();
                this.built = true;
            }
        }
        //Si no está cerca pero antes lo estaba porque hay mensaje, elimina el mensaje
        else if (this.thereIsMessage)
        {
            this.message.cont.destroy();
            this.message.destroy();
            this.thereIsMessage = false;
        }
    }
}