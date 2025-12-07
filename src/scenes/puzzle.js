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

        let background = this.add.image(0, 0, 'MGInfoBG').setOrigin(0.5, 0.5);
        
        // === PINTADO INICIAL DE ESCENA ===
        background.setScale(4);
        this.UIManager = new UIManager (this, 1, '#000000');
        
        // === PUNTUACIÓN ===
        this.score = 0;

        // === TIMER ===
        this.timeleft = 15; //tiempo inicial en seg
        this.UIManager.event.emit('changeTimer', this.timeleft);

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
            piezas:['topo', 'topo', 'topo', 'topo']
        }

        let puzzle1 = {
            height: 3,
            width: 3,
            piezas:['house', 'house', 'house', 'house', 'house', 'house', 'house', 'house', 'house']
        }

        this.Puzzles = [puzzle0, puzzle1]
        
        // === APARICIÓN DE PUZLES ===
        // Elegimos el puzle
        let choosenPuzzle = this.Puzzles[Math.floor(Math.random() * this.Puzzles.length)];

        // Colocamos las piezas en pantalla
        let betweenSpace = 10; //espacio entre piezas
        //posición X e Y inicial (mitad de camara - tamaño de puzzle con espacio entre piezas + la mitad del tamaño de una imagen (porque el origen de la imagen es 0.5,0.5 y no 0,0))
        let iniPosX = this.cameras.main.centerX - (((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().width * choosenPuzzle.width) + (betweenSpace * (choosenPuzzle.width -1)))/2) + (this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().width/2);
        let iniPosY = this.cameras.main.centerY - (((this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().height * choosenPuzzle.height) + (betweenSpace * (choosenPuzzle.height -1)))/2 - (this.textures.get(choosenPuzzle.piezas[0]).getSourceImage().height/2));
        //array con las piezas del puzle
        let pieces = [];

        if(choosenPuzzle.piezas.length === (choosenPuzzle.width * choosenPuzzle.height)){
            for(let y = 0; y < choosenPuzzle.height; y++){
            for(let x = 0; x < choosenPuzzle.width; x++){
                let angle = Math.floor(Math.random() * 4);
                if(angle === 0) this.score++;
                let increaseX = x* (this.textures.get(choosenPuzzle.piezas[(x) + ((y) * (choosenPuzzle.width))]).getSourceImage().width + betweenSpace);
                let increaseY = y* (this.textures.get(choosenPuzzle.piezas[(x) + ((y) * (choosenPuzzle.width))]).getSourceImage().height + betweenSpace);
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
