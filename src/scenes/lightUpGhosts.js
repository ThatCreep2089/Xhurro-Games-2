import GameDataManager from "../GameDataManager.js";
import UIManager from "../HUD/UIManager.js";
import Starer from "../entities/ghosts/starer.js";
import Hiker from "../entities/ghosts/hiker.js"
import Blower from "../entities/ghosts/blower.js"

export default class lightUpGhosts extends Phaser.Scene {
    constructor() {
        super({ key: 'lightUpGhosts' });
    }

    preload() {

    }

    create() {
        this.event = new Phaser.Events.EventEmitter();

        let background = this.add.image(0, 0, 'MGInfoBG').setOrigin(0.5, 0.5);
        this.input.setDefaultCursor('none');
        
        // === PINTADO INICIAL DE ESCENA ===
        this.lights.enable().setAmbientColor(0x000000);
        
        background.setScale(4);
        background.setPipeline('Light2D');
        this.UIManager = new UIManager (this, 1, '#A52019');
        
        // === PUNTUACIÓN ===
        this.score = 0;
        this.UIManager.event.emit('changeScore', this.score);

        // === TIMER ===
        this.timeleft = 40; //tiempo inicial en seg
        this.UIManager.event.emit('changeTimer', this.timeleft);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // === ANTORCHA ===
        this.radius = 80;
        this.intensity = 0.7;
        this.antorchaLight = this.lights.addLight(10, 10, this.radius).setColor(0xe25822).setIntensity(this.intensity);

        this.input.on('pointermove', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.antorchaLight.x = worldPoint.x;
            this.antorchaLight.y = worldPoint.y;

            this.event.emit('movingLight', this.antorchaLight);
        });

        // === FANTASMAS ===
        this.CreateGhosts();

        //Deshabilitar fantasmas
        this.event.on('hideGhost', (ghost, score) => {
            if (this.fantasmas.contains(ghost)){
                this.score += score;
                if(this.score < 0) this.score = 0;

                this.UIManager.event.emit('changeScore', this.score);
                ghost.setActive(false).setVisible(false);
            }
        });

        //Habilitar fantasmas
        //No se usa timer de Phaser porque no queremos que pueda spawnear en cada x ms
        //queremos que una vez pueda spawnear, spawnee en cualquier momento y al spawnear se espere un tiempo hasta poder volver a spawnear
        this.spawnTime = 1; //espera mínima entre la aparición de un fantasma y otro en segundos
        this.spawnTimeLeft = this.spawnTime;
        this.canSpawn = true;
        this.spawnProb = 0.01 //probabilidad de aparición de fantasma por frame sobre 1
    }

    updateTimer() {
        this.timeleft--;
        this.UIManager.event.emit('changeTimer', this.timeleft);
    
        if (this.timeleft <= 0) {
    
            // Recuperar los datos de recompensa desde mainScene
            const mainScene = this.scene.get('mainScene');
            const rewardInfo = mainScene.minigamesInfo.LightUpGhosts.reward;
            const staminaDecrease = mainScene.minigamesInfo.LightUpGhosts.price;
    
            // Calcular la recompensa según la puntuación
            const times = Math.floor(this.score / rewardInfo.X);
            const rewardAmount = times * rewardInfo.amountPerX;
    
            // Aplicar la recompensa
            if (mainScene.otter && mainScene.otter.backpack) {
                mainScene.otter.backpack.paper += rewardAmount; // o el recurso que prefieras
            }
    
            GameDataManager.player.stamina = GameDataManager.player.stamina - staminaDecrease;
            GameDataManager.saveFrom(this.scene.get('mainScene') || this);
            this.input.setDefaultCursor('auto');
            this.scene.start('mainScene');
        }
    }

    spawnGhost(){
        if (Math.random() < this.spawnProb){

            let inactiveGhosts = this.fantasmas.getChildren().filter(ghost => !ghost.active);

            //Si hay fantasmas inactivos
            if(inactiveGhosts.length > 0){
                //elige fantasma y posición
                let ghost = inactiveGhosts[Math.floor(Math.random() * inactiveGhosts.length)];
                let x = Math.random() * (this.sys.game.config.width - ghost.width);
                let y = Math.random() * (this.sys.game.config.height - ghost.height);
                x += ghost.width/2; //Offset para que aparezca dentro de pantalla
                y += ghost.height/2; // Offset para que aparezca dentro de pantalla

                //Spawnea fantasma
                ghost.setPosition(x, y).setActive(true).setVisible(true).alpha = 1;
                ghost.setDepth(ghost.y);
                this.antorchaLight.setColor(0xaaaaaa);
                this.time.delayedCall(200, ()=>{
                    this.antorchaLight.setColor(0xe25822);
                });

                this.canSpawn = false;
            } 
        }
    }

    CreateGhosts(){
        let starerNum = 3; //máximo de starers en pantalla a la vez
        let hikerNum = 3; //máximo de hikers en pantalla a la vez
        let blowerNum = 3; //máximo de blowers en pantalla a la vez

        this.fantasmas = this.add.group({
            runChildUpdate: true,
            maxSize: starerNum + hikerNum + blowerNum
        });

        for (let i = 0; i < starerNum; i++){
            this.fantasmas.add(new Starer(this, 0, 0)
            .setPipeline('Light2D')
            .setActive(false)
            .setVisible(false));
        }

        for (let i = 0; i < hikerNum; i++) {
            this.fantasmas.add(new Hiker(this, 0, 0).
            setPipeline('Light2D')
            .setActive(false)
            .setVisible(false));
        }

        for (let i = 0; i < blowerNum; i++) {
            this.fantasmas.add(new Blower(this, 0, 0)
            .setPipeline('Light2D')
            .setActive(false)
            .setVisible(false));
        }
    }

    update(t, dt){
        if (!this.canSpawn){
            this.spawnTimeLeft -= dt/1000;

            if (this.spawnTimeLeft <= 0){
                this.canSpawn = true;
                this.spawnTimeLeft = this.spawnTime;
            }
        }
        else this.spawnGhost();
    }
}
