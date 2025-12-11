export default class Source extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     * @param {Otter} otter - jugador en escena
     * @param {number} uses - número de usos antes de desaparecer, si es 0 entonces será ilimitado
     */
    constructor(scene, x, y,  texture, paint, paper, clay, uses, size = 1, frame = 0) {
        super(scene, x, y, texture, frame);

        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        this.setDepth(this.y);
        //Variables únicas
        this.uses = uses; //Número de usos antes de desaparecer, si es 0 el recurso será ilimitado
        this.otter = this.scene.otter; //personaje controlado por usuario (tiene el inventario y se usa para calcular distancias con el objeto)
        this.sources = { //Recursos proporcionados por cada recolección
            paint: paint,
            paper: paper,
            clay: clay
        };

        //Físicas
           //Creamos zona de contacto con jugador
         this.zone = scene.add.zone(x, y).setSize((this.width) + 10, (this.height * 0.2) + 10);
           //Añadimos cuerpos a la escena
         scene.physics.add.existing(this.zone, true);
         scene.physics.add.existing(this, true);
          //Reescalamos y reposicionamos
         this.body.setSize(this.width, (this.height) * 0.2);
         this.body.y = this.body.y + ((this.height / 2) - (this.body.height/2));
         this.zone.body.y = this.zone.body.y + ((this.height / 2) - (this.body.height/2));
          //Añadimos colisiones y overlaps
         scene.physics.add.collider(this.otter, this); //Contacto con recurso
         scene.physics.add.overlap(this.otter, this.zone, ()=>{this.touching = true;}); //Contacto con zona
          //Variables para controlar si la nutria está o no en contacto con la zona
         this.touching = false;
         this.wasTouching = false;
        
        //Suscripciones entrada/salida de colisiones
         this.on("overlapstart", ()=>{this.onCollisionEnter()});
         this.on("overlapend", ()=>{this.onCollisionExit()});

        //Suscripción para cada actualización de físicas
         this.scene.physics.world.on('worldstep', ()=>{this.physicsUpdate()});
        
        //Estamina a reducir
        this.staminaPrice = 2;
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
        if (this.otter.getStamina() >= this.staminaPrice)
        this.scene.UIManager.appearInteractMessage();
    }

    onCollisionExit()
    {
        this.scene.UIManager.disappearInteractMessage();
    }

    physicsUpdate()
    {
        //lanzamos los respectivos eventos en función de la colisión con el objeto (estático)
          if (this.touching && !this.wasTouching) this.emit("overlapstart");
          if (!this.touching && this.wasTouching) this.emit("overlapend");

          if (this.scene != null && this.scene.spaceKey.justDown && this.touching){
               if(this.otter.getStamina() >= this.staminaPrice)
               {
                   this.uses--; //Reducimos un uso del recurso

                   //Actualizamos la mochila con los recursos obtenidos
                   this.otter.collect(this.sources);
                   //Reducimos estamina
                   this.otter.decreaseStamina(this.staminaPrice);
                   //Actualizamos el HUD
                   this.scene.UIManager.event.emit("updateInventory");
                   this.scene.UIManager.event.emit("updateStamina");
                   
                   //En caso de quedarse sin usos destruimos el objeto y sus atributos creados en escena
                   if (this.uses == 0)
                   {
                       this.scene.UIManager.disappearInteractMessage();
                       this.zone.destroy();
                       this.destroy();
                   }
               }
               else this.scene.UIManager.appearNotEnoughStamina();
            }

          //Reiniciamos valores de touching para el siguiente bucle de físicas
          this.wasTouching = this.touching;
          this.touching = false;
    }
}