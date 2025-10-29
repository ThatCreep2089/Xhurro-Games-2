export default class WhackAMole extends Phaser.Scene {
    constructor() {
        super({ key: 'whackAMole' });
    }

    preload() {
        this.load.image('topo', 'imagenes/boa.jpg');
        this.load.image('hoyo', 'imagenes/hole.png');
        //this.load.image('map', 'assets/mainScene/map.png')
    }

    create() {

        this.score = 0; //puntuación inicial
        this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '32px', fill: '#FFF' });

        this.holes = []; // array de agujeros
        let iniX = 250;
        let iniY = 150;
        let gap = 150;

        //cuadrícula de agujeros
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let x = iniX + j * gap;
                let y = iniY + i * gap;

                this.add.image(x, y, 'hoyo').setScale(0.2);
                this.holes.push({x,y}); //guardar la posición de cada agujero
            }
        }

        //topo
        this.mole = this.add.image(100, 100, 'topo').setScale(0.4).setVisible(false).setInteractive();
        this.mole.on('pointerdown', () => {this.hitMole(); });

        const rndTime = Phaser.Math.Between(2100, 5000);

        this.time.addEvent({
            delay: rndTime,
            callback: this.showMole,
            callbackScope: this,
            loop: true
        });

        
        this.timeleft = 30; //tiempo inicial en seg
        this.timerText = this.add.text(600, 16, 'Tiempo: 30', { fontSize: '32px', fill: '#FFF' });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

    }

    showMole() {
        const rndHole = Phaser.Utils.Array.GetRandom(this.holes);
        this.mole.setPosition(rndHole.x, rndHole.y);
        this.mole.setVisible(true);
        
        setTimeout(() => {
            this.mole.setVisible(false);
        }, 2000);
    }

    hitMole() {
        this.score += 10;
        this.scoreText.setText('Puntos: ' + this.score);
        this.mole.setVisible(false);
    }

    updateTimer() {
        this.timeleft--;
        this.timerText.setText('Tiempo: ' + this.timeleft);

        if (this.timeleft <= 0) {
            this.scene.restart();
        }
    }

}
