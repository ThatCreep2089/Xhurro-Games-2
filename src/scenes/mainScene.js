import Otter from "../characters/otter.js";
import Source from "../gameObjects/source.js";
import Build from "../gameObjects/build.js";
import NPC from "../characters/npc.js";
import UIManager from "../HUD/UIManager.js";
import GameDataManager from "../GameDataManager.js";
import Navi from "../characters/navi.js";

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    #inputs;

    create() {
        this.createAnims();

        // === MAPA ===
        let map = this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, map.width, map.height);
        this.cameras.main.setBounds(0, 0, map.width, map.height);

        // === CONTROLES ===
        this.#inputs = {
            spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        const inputStates = () => ({
            isDown: false,
            isUp: true,
            justDown: false,
            justUp: false
        });

        this.spaceKey = inputStates();
        this.keyW = inputStates();
        this.keyA = inputStates();
        this.keyS = inputStates();
        this.keyD = inputStates();

        for (const key in this.#inputs) {
            this.#inputs[key].on('down', () => {
                this[key].isDown = true;
                this[key].isUp = false;
                this[key].justDown = true;
            });
            this.#inputs[key].on('up', () => {
                this[key].isDown = false;
                this[key].isUp = true;
                this[key].justUp = true;
            });
        }

        // === MINIJUEGOS_INFO ===
        this.minigamesInfo = {
            WackAMole:{
                name: "Whack A Mole",
                description: "Aplasta a los topos haciendo clic sobre ellos...",
                src: 'WAMVideo',
                price: 24,
                reward:{ amountPerX: {paint: 2, paper: 0, clay: 0}, X: 10 }
            },
            LightUpGhosts: {
                name: "Ilumina a \n los fantasmas",
                description: "Arrastra la antorcha hacia los fantasmas hasta destruirlos antes de que se escapen.",
                src: 'LUGVideo',
                price: 24,
                reward:{ amountPerX:{paint: 0, paper: 2, clay: 0}, X: 10 }
            },
            Puzzle: {
                name: "Puzle",
                description: "Haz clic sobre las piezas para rotarlas y consigue que el puzzle encaje",
                src: 'PVideo',
                price: 24,
                reward:{ amountPerX:{paint: 0, paper: 0, clay: 10}, X: 1 }
            }
        };

        // === JUGADOR (Nutria) ===
        this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 20, 'otterFront', 0.15, 0.25, 0);
        this.cameras.main.startFollow(this.otter);
        this.navi = new Navi(this, this.otter, 40, 'navi',0.1, 17);

        // === FUENTES, CONSTRUCCIONES Y NPCs ===
        this.createSources();
        this.createBuilds();
        this.createNPCs();

        // === HUD ===
        this.createHUD();

        // === MUSICA ===
        this.music = this.sound.add('mainSceneMusic', {
            loop: true,
        }); this.music.play();

        // === CARGAR DATOS ===
        this.fade = false;
        GameDataManager.applyTo(this);

        //Una vez se ha preparado toda la escena, si tiene que hacer Fade, lo hace
        if(this.fade){ this.fade = false; this.UIManager.FadeOut();}
    }

    update() {
        // Resetear justDown / justUp
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
        for (const key in inputs) {
            inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
        this.builds.forEach(build => build.update && build.update());
    }

    createAnims() {
        // === HUD ===
        // THE GAME 😃

        if (!this.anims.exists("otterIdleBack")){
            this.anims.create({
                key: "otterIdleBack",
                frames: this.anims.generateFrameNumbers("otterBack", {start:1, end: 1}),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterIdleFront")){
            this.anims.create({
                key: "otterIdleFront",
                frames: this.anims.generateFrameNumbers("otterFront", {start:0, end: 0}),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterIdleSide")){
            this.anims.create({
                key: "otterIdleSide",
                frames: this.anims.generateFrameNumbers("otterSide", {start:1, end: 1}),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingBack")){
            this.anims.create({
                key: "otterWalkingBack",
                frames: this.anims.generateFrameNumbers("otterBack", {start:0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingFront")){
            this.anims.create({
                key: "otterWalkingFront",
                frames: this.anims.generateFrameNumbers("otterFront", {start:0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingSide")){
            this.anims.create({
                key: "otterWalkingSide",
                frames: this.anims.generateFrameNumbers("otterSide", {start:0, end: 3}),
                frameRate: 20,
                repeat: -1
            });
        }
    }

    createSources() {
        this.sources = [];
        this.sources.push(new Source(this, 1200, 1200, 'clay1', 0, 0, 1, 5));
    }

    createBuilds() {
        this.builds = [];
        const house = new Build(this, 400, 1000, 'destroyedWatermill', 'watermill', 0, 0, 3, 1, 0, 'house_400_1000');
        this.builds.push(house);
    }

    createHUD() {
        this.UIManager = new UIManager(this);
    }

    createNPCs() {
        const npcData = this.cache.json.get('prueba');
        this.Toni = new NPC(this, 900, 700, 'toni', npcData, this.otter, this.minigamesInfo.WackAMole, 0.15, 0.25);

        const cleonRomeData = this.cache.json.get('cleonRome');
        this.Cleon = new NPC(this, 1050, 700, 'cleon&rome', cleonRomeData, this.otter, this.minigamesInfo.LightUpGhosts, 0.25, 0.25);

        const ishmaelData = this.cache.json.get('ishmael');
        this.Ishmael = new NPC(this, 1250, 700, 'ismael', ishmaelData, this.otter, this.minigamesInfo.Puzzle, 0.15, 1);
    }

    nextDay() {
        this.currentDay = (this.currentDay || 1) + 1;
        this.fade = true;
        if(this.currentDay > 6){
            console.log("final")
            GameDataManager.saveFrom(this);
        }
    }
    
}
