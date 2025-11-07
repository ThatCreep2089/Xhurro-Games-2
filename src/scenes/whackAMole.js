import Mole from '../entities/mole.js';
import Dynamite from '../entities/dynamite.js';
import GameDataManager from "../GameDataManager.js";
export default class WhackAMole extends Phaser.Scene {
    constructor() {
        super({ key: 'whackAMole' });
    }

    preload() {
        
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

        //topos y dinamitas
        this.entities = [];

        const rndTime = Phaser.Math.Between(2100, 5000);

        this.time.addEvent({
            delay: rndTime,
            callback: this.showRandomEntities,
            callbackScope: this,
            loop: true
        });

        
        this.timeleft = 10; //tiempo inicial en seg
        this.timerText = this.add.text(600, 16, 'Tiempo: 30', { fontSize: '32px', fill: '#FFF' });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

    }

    showRandomEntities() {
        const availableHoles = Phaser.Utils.Array.Shuffle([...this.holes]);
        let num;
        const isMax = Math.random() < 0.1;
        const isMin = Math.random() < 0.01;
        const isMid = Math.random() < 0.2;

        if (isMax) {
            num = 3;
        } else if (isMin) {
            num = 5;
        } else if (isMid) {
            num = 2;
        }
        else {
            num = 1;
        }

        for (let i = 0; i < num; i++) {
            const hole = availableHoles[i];
            
            const isDynamite = Math.random() < 0.1;

            let entity;
            if (isDynamite) {
                entity = new Dynamite(this, hole.x, hole.y);
            } else {
                entity = new Mole(this, hole.x, hole.y);
            }

            this.entities.push(entity);
            entity.showAt(hole.x, hole.y);
        }
        
        /*setTimeout(() => {
            this.mole.setVisible(false);
        }, 2000);*/
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreText.setText('Puntos: ' + this.score);
        //this.mole.setVisible(false);
    }

    updateTimer() {
        this.timeleft--;
        this.timerText.setText('Tiempo: ' + this.timeleft);

        if (this.timeleft <= 0) {

            // Recuperar los datos de recompensa desde mainScene
            const mainScene = this.scene.get('mainScene');
            const rewardInfo = mainScene.minigamesInfo.WackAMole.reward;
            const staminaDecrease = mainScene.minigamesInfo.WackAMole.price;

            // Calcular la recompensa según la puntuación
            const times = Math.floor(this.score / rewardInfo.X);
            const rewardAmount = times * rewardInfo.amountPerX;

            // Aplicar la recompensa
            if (mainScene.otter && mainScene.otter.backpack) {
                mainScene.otter.backpack.paint += rewardAmount; // o el recurso que prefieras
            }

            GameDataManager.player.stamina = GameDataManager.player.stamina - staminaDecrease;
            GameDataManager.saveFrom(this.scene.get('mainScene') || this);
            this.scene.start('mainScene');
        }
    }

}
