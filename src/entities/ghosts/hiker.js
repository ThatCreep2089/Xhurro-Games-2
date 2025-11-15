export default class starer extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'topo');
        this.scene = scene;
        //score
        this.score = 10; //Premio por purificar
        this.punish = -5; //Castigo por dejar escapar

        //movimiento
        this.speed = 15; //cuanto se mueve
        this.onLight = false; //cuando se mueve o actualiza su dirección

        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setScale(0.4);

        // == Purificación  atributos ==
        this.disappearSpeed = 2;

        //Cada vez que se mueve el cursor se actualiza la info sobre su radio y distancia de él
        this.scene.event.on('movingLight', (position) => {
            this.light = position;
            this.maxDistance = position.radius/2;
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
        if (this.body) this.body.setVelocity(0,0);
        this.timeLeft = this.time;
    }

    hitting(dt) {
        //contra mas cerca esté de la luz, mas rápido desaparece
        if (this.lightDistance != 0) this.alpha -= (this.disappearSpeed - this.disappearSpeed*(this.lightDistance/this.maxDistance))*(dt/1000);
        else this.alpha -= this.disappearSpeed * (dt/1000);

        //Corrección para que no se salga de los bordes
        let x = this.scene.sys.game.config.width - this.width/2;
        let y = this.scene.sys.game.config.height - this.height/2;

        if ((this.x <= this.width/2 || this.x >= x) && (this.y <= this.height/2 || this.y >= y)){
            //En esquina huye en dirección contraria
            this.direction.x = -this.direction.x;
            this.direction.y = -this.direction.y;

            this.x = Phaser.Math.Clamp(this.x, this.width/2 + 1, x - 1);
            this.y = Phaser.Math.Clamp(this.y, this.height/2 + 1, y - 1);
            
            this.body.setVelocity(-this.direction.x * this.speed * dt, -this.direction.y * this.speed * dt);
        }
        else if (this.x <= this.width/2 || this.x >= x)
            //Choque con paredes X solo se mueve en eje Y
            this.body.setVelocity(0, (-this.direction.y/this.direction.y) * this.speed * dt);
        else if (this.y <= this.height/2 || this.y >= y)
            //Choque con paredes Y solo se mueve en eje X
            this.body.setVelocity((-this.direction.x/this.direction.x) * this.speed * dt, 0);
        else
            //Si no choca ningún borde se mueve en ambos ejes
            this.body.setVelocity(-this.direction.x * this.speed * dt, -this.direction.y * this.speed * dt);

        //Desactivar el objeto de la pool y reiniciamos tiempo de vida
        if (this.alpha <= 0.25){
            this.hide(false);
        }
    }

    preUpdate(t, dt){
        // == Purificación implementación ==
        if (this.light)
        this.lightDistance = Phaser.Math.Distance.Between(this.light.x, this.light.y, this.x, this.y);

        if (!this.onLight){ //Queremos que se mueva con la última dirección registrada al entrar en el circulo de luz
            this.direction = new Phaser.Math.Vector2(this.light.x - this.x, this.light.y - this.y).normalize();
        }

        if(this.lightDistance < this.maxDistance) {
            this.hitting(dt);
            this.onLight = true;
        }
        else if (this.body) {
            this.body.setVelocity(0,0);
            this.onLight = false;
            this.timeLeft -= dt/1000 //Solo corre el tiempo de vida si no le alcanza la luz
        }

        if (this.timeLeft <= 0) {
            this.hide(true)
        }
    }
}