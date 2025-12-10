import GameDataManager from '../GameDataManager.js'
export default class Otter extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y 
     */
    constructor(scene, x, y, speed,  texture, size = 1, colliderWidthFactor = 1, frame) {
        super(scene, x, y, texture, frame = 0);

        this.scene = scene;

        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        this.setScale(size);

        scene.physics.add.existing(this);

        this.body.setSize(this.width * colliderWidthFactor, (this.height) * 0.2);
        this.body.setOffset((this.width - (this.width*colliderWidthFactor))/2, this.height-100);

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
        this.howToDecrease = 1; //Controla cada cuántos movimientos se disminuye la estamina

        //SFX
        this.walkingSFX = this.scene.sound.add('walkingSFX', {
            loop: true,
            volume: 10
        });
        this.isWalkingSFXPlaying = false;
    }

    // === GESTIÓN DE INVENTARIO ===

    //Disminuye los recursos de la mochila
    buy(bag){
        this.backpack.paint -= bag.paint;
        this.backpack.paper -= bag.paper;
        this.backpack.clay -= bag.clay

        this.scene.sound.add('cashSFX', {volume: 10}).play();
    }

    //Auenta los recursos de la mochila
    collect(bag, fade = false)
    {
        let duration = 0;
        if (fade) duration = 4000;

        const {paint, paper, clay} = bag;

        setTimeout(() => {
            if (paint > 0 || paper > 0 || clay > 0) this.scene.sound.add('grabSFX', { volume: 2,}).play();

            this.backpack.paint += paint;
            this.backpack.paper += paper;
            this.backpack.clay += clay;

        }, duration);
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
        this.scene.UIManager.event.emit("updateStamina", -amount);
        this.scene.sound.add('cashSFX', {volume: 10}).play();

        // Si la estamina llega a 0, pasar al siguiente día
        if (this.stamina <= 0) {
            this.scene.nextDay();
        }
    }

    decreaseStamina(staminaPrice){
        if (this.howToDecrease <= 0){
            this.stamina -= staminaPrice;
            this.scene.sound.add('cashSFX', {volume: 10}).play();
            this.scene.UIManager.event.emit("updateStamina", -staminaPrice);
            this.howToDecrease = 4;
        } else this.howToDecrease--;

        // Si la estamina llega a 0, pasar al siguiente día
        if (this.stamina <= 0) {
            this.scene.nextDay();
            GameDataManager.saveFrom(this.scene.scene.get('mainScene') || this);
            this.canMove = false;
            this.scene.music.stop();
            this.scene.UIManager.FadeIn();
        }
    }
    getStamina(){
        return this.stamina;
    }
    
    //Reestablece la estamina
    restartStamina()
    {
        this.stamina = 100;
        this.scene.UIManager.event.emit("updateStamina");
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);

        //Movemos el objeto en función de las teclas pulsadas por el usuario
        //Priorizando la última usada
        if (this.scene.keyW.isDown && (this.lastKey == 'W' || this.lastKey == null) && this.canMove)
        {
            if (!this.isWalkingSFXPlaying) {this.walkingSFX.play(); this.isWalkingSFXPlaying = true;}
            this.body.setVelocity(0, -this.speed * dt);
        }
        else if (this.scene.keyS.isDown && (this.lastKey == 'S' || this.lastKey == null) && this.canMove)
        {
            if (!this.isWalkingSFXPlaying) {this.walkingSFX.play(); this.isWalkingSFXPlaying = true;}
            this.body.setVelocity(0, this.speed * dt);
        }
        else if (this.scene.keyA.isDown && (this.lastKey == 'A' || this.lastKey == null) && this.canMove)
        {
            if (!this.isWalkingSFXPlaying) {this.walkingSFX.play(); this.isWalkingSFXPlaying = true;}
            this.body.setVelocity(-this.speed * dt, 0);
        }
        else if (this.scene.keyD.isDown && (this.lastKey == 'D' || this.lastKey == null) && this.canMove)
        {
            if (!this.isWalkingSFXPlaying) {this.walkingSFX.play(); this.isWalkingSFXPlaying = true;}
            this.body.setVelocity(this.speed * dt, 0);
        }
        else
        {
            if (this.isWalkingSFXPlaying) {this.walkingSFX.stop(); this.isWalkingSFXPlaying = false;}
            this.body.setVelocity(0,0);
        }
        
        this.setDepth(this.body.y);
    }
}