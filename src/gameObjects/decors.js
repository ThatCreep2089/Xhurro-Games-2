export default class Decor extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     * @param {Otter} otter - jugador en escena
        */
    constructor(scene, x, y, ) {
        super(scene, x, y, undefined);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
    }
    innit( texture, size = 1){
        this.setTexture(texture);
        
        this.setScale(size);
        this.setDepth(this.y);
        this.otter = this.scene.otter; //personaje controlado por usuario (tiene el inventario y se usa para calcular distancias con el objeto)
      

        //Físicas
           //Añadimos cuerpos a la escena
         this.scene.physics.add.existing(this, true);
          //Reescalamos y reposicionamos
         this.body.setSize(this.displayWidth, (this.displayHeight) * 0.2);
         this.body.y = this.body.y + ((this.displayHeight / 2) - (this.body.height/2));
          this.setDepth(this.body.y);
          //Añadimos colisiones y overlaps
         this.scene.physics.add.collider(this.otter, this); //Contacto con recurso
      
       
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

    

    physicsUpdate()
    {
    }

  
}