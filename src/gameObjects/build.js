import buildSourcesHUD from '../HUD/buildSourcesHUD.js'
export default class Source extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     * @param {Otter} otter - jugador en escena
     */
    constructor(scene, x, y,  texture, builtTexture, paint, paper, clay, size = 1, frame = 0) {
        super(scene, x, y, texture, frame);

        
        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.

        //variables únicas del objeto
        this.builtTexture = builtTexture; //Sprite de la estructura reconstruida
        this.built = false; //Booleano encargado de saber si la estructura sigue destruida o está reconstruida
        this.otter = this.scene.otter; //jugador (tiene el inventario y sirve para calcular distancias)
        this.sources = { //Recursos necesarios para reparación
            paint: paint,
            paper: paper,
            clay: clay
        };
        this.message = null;

        //Físicas
          //Creamos zona de contacto con jugador
         this.zone = scene.add.zone(x, y).setSize((this.width * size) + 10, (this.height * size) + 10);
           //Añadimos cuerpos a la escena
         scene.physics.add.existing(this.zone, true);
         scene.physics.add.existing(this, true);
          //Añadimos colisiones y overlaps
         scene.physics.add.collider(this.otter, this);//Añadrimos la colisión de la nutria
         scene.physics.add.overlap(this.otter, this.zone, ()=>{this.touching = true;}); //Contacto con zona
          //Variables para controlar si la nutria está o no en contacto con la zona
         this.touching = false;
         this.wasTouching = false;
        
        //Suscripciones entrada/salida de colisiones
         this.on("overlapstart", ()=>{this.onCollisionEnter()});
         this.on("overlapend", ()=>{this.onCollisionExit()});

        //Suscripción para cada actualización de físicas
         this.scene.physics.world.on('worldstep', ()=>{this.physicsUpdate()});
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);
    }

    onCollisionEnter()
    {
        this.message = new buildSourcesHUD(this.scene, 'buildSources', this.sources,
                                this.otter.backpack.paint >= this.sources.paint &&
                                this.otter.backpack.paper >= this.sources.paper &&
                                this.otter.backpack.clay >= this.sources.clay,
                                0.4);
    }
    
    onCollisionExit()
    {
        if (this.message != null)
        {
            this.message.cont.destroy();
            this.message.destroy();
        }
    }
    
    physicsUpdate()
    {
        //lanzamos los respectivos eventos en función de la colisión con el objeto (estático)
        if (this.touching && !this.wasTouching) this.emit("overlapstart");
        if (!this.touching && this.wasTouching) this.emit("overlapend");

        if (this.scene.spaceKey.justDown &&
            this.touching &&
            this.otter.backpack.paint >= this.sources.paint &&
            this.otter.backpack.paper >= this.sources.paper &&
            this.otter.backpack.clay >= this.sources.clay){
                //Reducimos los recursos gastados por construir
            this.otter.backpack.paint -= this.sources.paint;
            this.otter.backpack.paper -= this.sources.paper;
            this.otter.backpack.clay -= this.sources.clay;

            this.setTexture(this.builtTexture); //Cambiamos sprite de estructura
            this.zone.destroy() //Destruimos zona (no nos hace falta para nada ahora);
            this.scene.backPackHUD.emit("updateInventory");//Actualiza HUD
            this.built = true;
            }
        //Reiniciamos valores de touching para el siguiente bucle de físicas
        this.wasTouching = this.touching;
        this.touching = false;
    }
}