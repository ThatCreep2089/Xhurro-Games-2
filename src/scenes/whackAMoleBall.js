import Character from "../entities/whackAMole/character.js"
import Ball from "../entities/whackAMole/ball.js"
import Pool from "../entities/whackAMole/Pool.js"
import Enemy from "../entities/whackAMole/enemy.js"
import UIManager from "../HUD/UIManager.js";
import GameDataManager from "../GameDataManager.js";
export default class WhachAMoleBall extends Phaser.Scene{
    constructor(){
        super({key:'whackAMoleBall'})
    }
    create(){

        if (!this.anims.exists('explote')){
            this.anims.create({
                key: 'explote',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
                frameRate: 7, // Velocidad de la animación
                repeat: -1    // Animación en bucle
            })
        }

        this.input.keyboard.enabled = true;
        this.player = new Character(this,200,500,'otter',400)
        
        this.UIManager = new UIManager(this, 1, '#FFFFFF');
        this.UIManager.ScoreBar();
        this.UIManager.Timer();

        this.music = this.sound.add('whackAMoleMusic', {
            loop: true,
            volume: 3,
        });
        this.input.setDefaultCursor('none');
        this.music.play();

        this.score = 0;
        if(this.UIManager) {
            this.UIManager.event.emit('changeScore', this.score);
        }

        // Temporizador
        this.timeLeft = 30; // segundos
        if(this.UIManager) {
            this.UIManager.event.emit('changeTimer', this.timeLeft);
        }
        this.timerSFX = this.sound.add('timer', {loop: true});
        this.timerSFX.play();
        // Timer decrece cada segundo
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.gameEnded = false;

        const ballList = [];
        for (let i = 0; i < 5; i++) {
            const ball = new Ball(this, 0, 0, 'house', 400, null);
            ballList.push(ball);
        }

        this.ballPool = new Pool(this, ballList);
        ballList.forEach(ball => ball.pool = this.ballPool);

        // Spawnear inicialmente
        for (let i = 0; i < 5; i++) this.spawnBall();

        // Crear grupo de pelotas para overlap
        this.ballGroup = this.ballPool._group;

        // Input
        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Overlap entre jugador y pelotas
        this.physics.add.overlap(this.player, this.ballGroup, (player, ball) => {
            // Guardamos la pelota que se puede recoger
            this.player.overlappingBall = ball;
        });
        this.events.on("ball-removed", () => {
            this.spawnBall();
        });

        const cols = 3;
        const rows = 3;
        const spacingX = 150; // separación horizontal
        const spacingY = 150; // separación vertical
        const width = this.scale.width;
        const height = this.scale.height;

        // tamaño total de la cuadrícula
        const gridWidth = (cols - 1) * spacingX;
        const gridHeight = (rows - 1) * spacingY;

        // posición inicial (esquina superior izquierda de la cuadrícula centrada)
        const startX = (width / 2) - (gridWidth / 2);
        const startY = (height / 2) - (gridHeight / 2) - 100;

        // generar posiciones fijas
        this.enemyPositions = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;
                this.enemyPositions.push({x, y});
            }
        }

        const enemyList = [];
        for (let i = 0; i < 9; i++) {
            const enemy = new Enemy(this, 0, 0, 'topo');
            enemyList.push(enemy);
        }

        // Pool de enemigos
        this.enemyPool = new Pool(this, enemyList);

        // Spawn aleatorio de enemigos
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnRandomEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.ballPool._group, this.enemyPool._group, (ball, enemy) => {
            if(ball.active && enemy.active) {
                enemy.destroyEnemy();

                // Desactivar pelota
                ball.pool.release(ball);
                ball.setActive(false);
                ball.setVisible(false);
                ball.picked = false;
                ball.jugador = null;

                this.events.emit("ball-removed");

                // Sumar puntuación correctamente
                this.addScore(2);
            }
        });
    }
    spawnBall() {
        if(this.gameEnded) return;

        const x = Phaser.Math.Between(100, 700);
        const y = 500; // altura deseada relativa al jugador
        const ball = this.ballPool.spawn(x, y);

        if (ball) {
            ball.picked = false;
            ball.jugador = null;

            // Reset completo del cuerpo físico
            ball.body.reset(x, y);        // reposiciona el body
            ball.body.stop();             // detiene cualquier velocidad residual
            ball.body.allowGravity = false;

            // Reset de estado visual
            ball.setActive(true);
            ball.setVisible(true);
        }
    }
    spawnRandomEnemy() {
        if(this.gameEnded) return;

        // Filtrar enemigos inactivos
        const inactiveEnemies = this.enemyPool._group.getChildren().filter(e => !e.active);
        if (inactiveEnemies.length === 0) return;

        // Elegir un enemigo y una posición aleatoria de la cuadrícula
        const enemy = Phaser.Utils.Array.GetRandom(inactiveEnemies);
        const position = Phaser.Utils.Array.GetRandom(this.enemyPositions);

        this.sound.add('appearMoleSFX').play();
        enemy.appear(position.x, position.y);

        // Ocultar después de 1-2 segundos
        const hideTime = Phaser.Math.Between(1000, 2000);
        this.time.delayedCall(hideTime, () => {
            if (enemy.active) enemy.hide();
        });
    }
    addScore(amount) {
        this.score += amount;

        if(this.UIManager) {
            this.UIManager.event.emit('changeScore', this.score);
        }
    }
    updateTimer() {
        if(this.gameEnded) return;

        this.timeLeft--;
        if(this.UIManager) {
            this.UIManager.event.emit('changeTimer', this.timeLeft);
        }

        if(this.timeLeft <= 0 && !this.gameEnded) {
            this.timerSFX.stop();
            this.input.setDefaultCursor('default');
            this.input.keyboard.enabled = false;
            this.gameEnded = true;

            this.UIManager.appearMinigameEndInfo(this,
            ({
                paint: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.WackAMole.reward.X) * this.scene.get('mainScene').minigamesInfo.WackAMole.reward.amountPerX.paint),
                paper: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.WackAMole.reward.X) * this.scene.get('mainScene').minigamesInfo.WackAMole.reward.amountPerX.paper),
                clay: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.WackAMole.reward.X) * this.scene.get('mainScene').minigamesInfo.WackAMole.reward.amountPerX.clay),
            }), this.scene.get('mainScene').minigamesInfo.WackAMole.name, 'toposEnd');
        }
    }
    finishGame(){
        // Recuperar los datos de recompensa desde mainScene
        const mainScene = this.scene.get('mainScene');
        
        const rewardInfo = mainScene.minigamesInfo.WackAMole.reward;

        // Calcular la recompensa según la puntuación
        const times = Math.floor(this.score / rewardInfo.X);
        const rewardAmount = rewardInfo.amountPerX;
        
        // Aplicar la recompensa
        GameDataManager.updateReward({paint: rewardAmount.paint * times, paper: rewardAmount.paper * times, clay: rewardAmount.clay * times});
        GameDataManager.saveFrom(this.scene.get('mainScene') || this);

        this.input.setDefaultCursor('auto');

        if (mainScene.fade) this.UIManager.FadeIn();
        else{
            this.scene.start('mainScene');
        }
    }
    update() {
        if(this.gameEnded) return;

        if (Phaser.Input.Keyboard.JustDown(this.spacekey)) {

            if (this.player.holdingBall) {
                this.player.holdingBall.throw();
                this.player.holdingBall = null;
            } 
            else if (this.player.overlappingBall && !this.player.overlappingBall.picked) {
                this.player.overlappingBall.pick(this.player);
                this.player.holdingBall = this.player.overlappingBall;
            }

            // Limpiar la referencia para la próxima comprobación
            this.player.overlappingBall = null;
        }
    }

}
