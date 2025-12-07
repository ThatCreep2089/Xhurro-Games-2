export default class starer extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'blower');
        this.scene = scene;

        this.punish = -5; //Castigo por iluminar

        scene.add.existing(this);
        this.setScale(0.2);
        //factor de reducción de radio e intensidad
        this.factor = 0.3;
        this.effectDuration = 5; //Seg

        this.hitedBool = false;
        //Cada vez que se mueve el cursor se actualiza la info sobre su radio y distancia de él
        this.scene.event.on('movingLight', (position) => {
            this.light = position;

            if (this.light?.radius)
            {
                let maxDistance = position.radius/2;
                let lightDistance = Phaser.Math.Distance.Between(position.x, position.y, this.x, this.y);
    
                if(!this.hitedBool && lightDistance < maxDistance && this.active) {
                    this.hited(true);
                }
            }
        });

        this.time = 6; //tiempo inicial en segundos
        this.timeLeft = this.time;
    }

    hited(trap) {
         this.hitedBool = true;
         //Este fantasma desaparece en el primer hit y reduce el radio e intensidad de la antorcha durante unos segundos
         if (this.light?.radius && trap){
                this.light.radius -= this.scene.radius * this.factor;
                this.scene.time.delayedCall(this.effectDuration*1000, ()=>{
                    if (this.light?.radius && this.scene?.radius)this.light.radius += this.scene.radius * this.factor;
                });
            }
        
        if (trap){
            this.scene.sound.add('lightedUpBlowerSFX').play();
        }
        else{
            this.scene.sound.add('disappearBlowerSFX', {volume: 15}).play();
        }

        if (this.scene?.tweens){
            const rotationTween = this.scene.tweens.add({
                targets: this,
                angle: 15,       // gira 15° a un lado
                duration: 200,   // velocidad de giro
                yoyo: true,      // regresa al ángulo original
                repeat: -1,      // repite indefinidamente hasta terminar la escala
                ease: 'Sine.easeInOut'
            });
            // Tween de desaparición (escala y alpha)
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                scale: 0,
                duration: 600,  // duración total del "desvanecimiento"
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    // Detener rotación y reiniciar propiedades
                    rotationTween.stop();
                    this.setAlpha(1);
                    this.setScale(0.2);
                    this.setAngle(0);
                    this.hitedBool = false;
                    this.timeLeft = this.time;
                    this.scene?.event?.emit('hideGhost', this, this.punish);
                }
            });
        }
    }

    preUpdate(t, dt){
        this.timeLeft -= dt/1000;
        if (this.timeLeft <= 0 && !this.hitedBool){
            this.hited(false);
        }
    }
}