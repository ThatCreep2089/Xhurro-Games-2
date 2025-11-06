export default class Otter extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     */
    constructor(scene, x, y, speed,  texture, size = 1, frame) {
        super(scene, x, y, texture, frame = 0);

        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        scene.physics.add.existing(this);

        this.body.scale = this.scale;
        this.body.setSize(this.width, (this.height) * 0.2);
        this.body.setOffset(0, (this.height) - (this.body.height/2));
        

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

        this.canMove = true //Controla cuando el jugador puede o no puede moverse

        //Energía del jugador
        this.stamina = 100;
        this.howToDecrease = 4;
    }

    // === GESTIÓN DE INVENTARIO ===

    //Disminuye los recursos de la mochila
    buy(bag)
    {
        this.backpack.paint -= bag.paint;
        this.backpack.paper -= bag.paper;
        this.backpack.clay -= bag.clay
    }

    //Auenta los recursos de la mochila
    collect(bag)
    {
        this.backpack.paint += bag.paint;
        this.backpack.paper += bag.paper;
        this.backpack.clay += bag.clay
    }

    //Comprueba si se tienen suficientes materiales para comprar
    enough(bag)
    {
        return (bag.paint <= this.backpack.paint && bag.paper <= this.backpack.paper && bag.clay <= this.backpack.clay)
    }

    // === GESTIÓN DE ESTAMINA ===

    //Disminuye la estamina en función del argumento amount
    decreaseStaminaAmount(amount){
        this.stamina -= amount;
        console.log(this.stamina);
    }
    decreaseStamina(staminaPrice){
        if (this.howToDecrease <= 0){
            this.stamina -= staminaPrice;
            this.howToDecrease = 4;
        } else this.howToDecrease--;
        console.log(this.stamina);
    }
    getStamina(){
        return this.stamina;
    }
    setStamina(amount) {
        this.stamina = Phaser.Math.Clamp(amount, 0, 100);
    }
    //Reestablece la estamina
    restartStamina()
    {
        this.stamina = 100;
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