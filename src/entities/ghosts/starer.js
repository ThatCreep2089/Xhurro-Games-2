export default class starer extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'topo');
        this.scene = scene;
        this.score = 10; //Premio por purificar
        this.punish = -5; //Castigo por dejar escapar
        scene.add.existing(this);
        this.setScale(0.4);

        // == Purificación  atributos ==
        this.disappearSpeed = 2;

        //Cada vez que se mueve el cursor se actualiza la info sobre su radio y distancia de él
        this.scene.event.on('movingLight', (position) => {
            this.maxDistance = position.radius/2 || 0;
            this.lightDistance = Phaser.Math.Distance.Between(position.x, position.y, this.x, this.y) || 0;
        });

        // == Timer ==
        //No se usa el timer de Phaser debido a que se trata de un objeto en pool y es mejor tratar el timer en el update
        //de esta forma cuando el objeto se desactive el objeto se reiniciará y no seguirá contando hasta volverse a activar

        this.time = 6; //tiempo inicial en segundos
        this.timeLeft = this.time;
    }

    hide(scaped) { //desativar objeto de pool y reiniciar tiempo de vida
        let reward = scaped? this.punish : this.score;
        this.scene.event.emit('hideGhost', this, reward);
        this.timeLeft = this.time;

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
                this.setScale(0.4);
                this.setAngle(0);
            }
        });
    }

    hitting(dt) {
        //contra mas cerca esté de la luz, mas rápido desaparece
        if (this.lightDistance != 0) this.alpha -= (this.disappearSpeed - this.disappearSpeed*(this.lightDistance/this.maxDistance))*(dt/1000);
        else this.alpha -= this.disappearSpeed * (dt/1000);

        //Desactivar el objeto de la pool y reiniciamos tiempo de vida
        if (this.alpha <= 0.25){
            this.hide(false);
        }
    }

    preUpdate(t, dt){
        // == Purificación implementación ==
        if(this.lightDistance < this.maxDistance) {
            this.hitting(dt);
        }

        this.timeLeft -= dt/1000;

        if (this.timeLeft <= 0) {
            this.hide(true)
        }
    }
}