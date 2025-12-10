import GameDataManager from "../GameDataManager.js";
import UIManager from "../HUD/UIManager.js";

export default class puzzle extends Phaser.Scene {
    constructor() {
        super({ key: 'puzzle' });
    }

    preload() {

    }

    create() {
        this.event = new Phaser.Events.EventEmitter();

        // = MÚSICA =
        this.music = this.sound.add('puzzleMusic', {
                volume: 3,
                loop: true,
        });
        this.music.play();
        
        // === PINTADO INICIAL DE ESCENA ===
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'puzzleBg').setOrigin(0.5, 0.5).setScale(0.37);
        this.UIManager = new UIManager (this, 1, '#000000');
        
        // === PUNTUACIÓN ===
        this.score = 0;

        // === TIMER ===
        this.timeleft = 15; //tiempo inicial en seg
        this.UIManager.event.emit('changeTimer', this.timeleft);

        this.timerSFX = this.sound.add('timer', {loop: true, volume: 0.5});
        this.timerSFX.play();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // === PUZLES === // AÑADIR PUZZLES AQUÍ
        let puzzle0 = {
            height: 2,
            width: 2,
            piezas:['puzzle0_0', 'puzzle0_1', 'puzzle0_2', 'puzzle0_3'],
            scale: 0.2
        }

        let puzzle1 = {
            height: 3,
            width: 3,
            piezas:['puzzle1_0', 'puzzle1_1', 'puzzle1_2', 'puzzle1_3', 'puzzle1_4', 'puzzle1_5', 'puzzle1_6', 'puzzle1_7', 'puzzle1_8'],
            scale: 0.15
        }

        this.Puzzles = [puzzle0, puzzle1]
        
        // === APARICIÓN DE PUZLES ===
        // Elegimos el puzle
        let choosenPuzzle = this.Puzzles[Math.floor(Math.random() * this.Puzzles.length)];

        // Colocamos las piezas en pantalla
        let betweenSpace = 5; //espacio entre piezas
        //posición X e Y inicial (mitad de camara - tamaño de puzzle con espacio entre piezas + la mitad del tamaño de una imagen (porque el origen de la imagen es 0.5,0.5 y no 0,0))
        let iniPosX = this.cameras.main.centerX - (((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().width * choosenPuzzle.width * choosenPuzzle.scale) + (betweenSpace * (choosenPuzzle.width -1)))/2) + (this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().width/2 * choosenPuzzle.scale);
        let iniPosY = this.cameras.main.centerY - (((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().height * choosenPuzzle.height * choosenPuzzle.scale) + (betweenSpace * (choosenPuzzle.height -1)))/2 - (this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().height/2 * choosenPuzzle.scale));
        //array con las piezas del puzle
        let pieces = [];

        if(choosenPuzzle.piezas.length === (choosenPuzzle.width * choosenPuzzle.height)){
            for(let y = 0; y < choosenPuzzle.height; y++){
            for(let x = 0; x < choosenPuzzle.width; x++){
                let angle = Math.floor(Math.random() * 4);
                if(angle === 0) this.score++;
                let increaseX = x * ((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().width * choosenPuzzle.scale) + betweenSpace);
                let increaseY = y * ((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().height * choosenPuzzle.scale) + betweenSpace);
                pieces.push({pieza: 
                    this.add.image(
                        iniPosX + increaseX,
                        iniPosY + increaseY,
                        choosenPuzzle.piezas[(x) + ((y) * (choosenPuzzle.width))]
                    ).setAngle(angle*90), angulo: angle*90}
                );
            }
            }
        }

        pieces.forEach((piece) => {
            piece.pieza.setScale(choosenPuzzle.scale);
        });

        //Hacemos las piezas interactuables y suscribimos a su interacción
        this.win = false;

        pieces.forEach(piece => {
            piece.pieza.setInteractive();

            piece.pieza.on('pointerdown', () => {
                if (!this.win)
                {
                    this.sound.add('rotatePieceSFX').play();

                    //Se rota 90 grados
                    piece.angulo = (piece.angulo + 90)%360;
                    piece.pieza.angle += 90;
                    
    
                    //Comprobación de victoria
                    this.score = 0;
                    //sumamos un punto por cada pieza bien colocada
                    pieces.forEach(piece => {
                        if (piece.angulo%360 === 0 || piece.angulo%360 === 360) this.score++;
                    })
    
                    //si todas están bien colocadas entonces ha ganado
                    if (this.score >= (choosenPuzzle.width * choosenPuzzle.height)){
                        this.win = true;
                        this.timeleft = 1;
                    }
                }
            });
        })

        this.end = false;
    }

    updateTimer() {
        this.timeleft--;
        this.UIManager.event.emit('changeTimer', this.timeleft);
    
        if (this.timeleft <= 0 && !this.end) {
            this.win = true;
            this.end = true;
            this.timerSFX.stop();
            this.UIManager.appearMinigameEndInfo(this,
                ({
                    paint: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.Puzzle.reward.X) * this.scene.get('mainScene').minigamesInfo.Puzzle.reward.amountPerX.paint),
                    paper: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.Puzzle.reward.X) * this.scene.get('mainScene').minigamesInfo.Puzzle.reward.amountPerX.paper),
                    clay: (Math.floor(this.score / this.scene.get('mainScene').minigamesInfo.Puzzle.reward.X) * this.scene.get('mainScene').minigamesInfo.Puzzle.reward.amountPerX.clay)
                }),
                this.scene.get('mainScene').minigamesInfo.Puzzle.name, 'puzleEnd'
            );
        }
    }

    finishGame(){
        // Recuperar los datos de recompensa desde mainScene
            const mainScene = this.scene.get('mainScene');
            const rewardInfo = mainScene.minigamesInfo.Puzzle.reward;

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
}
