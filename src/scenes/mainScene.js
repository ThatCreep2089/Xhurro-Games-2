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
                name: "Wack A Mole",
                description: "Aplasta a los topos haciendo clic sobre ellos...",
                src: 'WAMVideo',
                price: 25,
                reward: { amountPerX:2, X: 10 }
            },
            LightUpGhosts: {
                name: "Ilumina a los fantasmas",
                description: "Arrastra la antorcha hacia los fantasmas hasta destruirlos antes de que se escapen.",
                src: 'WAMVideo',
                price: 25,
                reward:{ amountPerX:2, X: 10 }
            },
            Puzzle: {
                name: "",
                description: "",
                src: "",
                price: "",
                reward:{
                    amountPerX:"",
                    X: ""
                }
            }
        };

        // === JUGADOR (Nutria) ===
        this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 20, 'otter', 0.2);
        this.cameras.main.startFollow(this.otter);
        this.navi = new Navi(this, this.otter, 80, 'otter', 0.15, 17);

        // === FUENTES, CONSTRUCCIONES Y NPCs ===
        this.createSources();
        this.createBuilds();
        this.createNPCs();

        // === HUD ===
        this.createHUD();

        // === CARGAR DATOS ===
        import("../GameDataManager.js").then(module => {
            const GameDataManager = module.default;
            GameDataManager.applyTo(this);
            this.UIManager.event.emit('updateDay');
            this.UIManager.event.emit('updateInventory');
            this.UIManager.event.emit('updateStamina');
        });

    }

    update() {
        // Si la estamina llega a 0, pasar al siguiente día
        if (this.otter.getStamina() <= 0 && !this.dayChanging) {
            this.dayChanging = true;
            this.nextDay();
        }

        // Resetear justDown / justUp
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
        for (const key in inputs) {
            inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
    }

    createAnims() {}

    createSources() {
        new Source(this, 1200, 1200, 'paint', 0, 0, 1, 5);
    }

    createBuilds() {
        this.builds = [];
        const house = new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3, 1, 0, 'house_400_1000');
        this.builds.push(house);
    }

    createHUD() {
        this.UIManager = new UIManager(this);
    }

    createNPCs() {
        const npcData = this.cache.json.get('prueba');
        this.Toni = new NPC(this, 900, 700, 'toni', npcData, this.otter, this.minigamesInfo.WackAMole);
        this.Toni2 = new NPC(this, 800, 700, 'toni', npcData, this.otter, this.minigamesInfo.LightUpGhosts);
    }

    nextDay() {
        this.currentDay = (this.currentDay || 1) + 1;
        this.otter.setStamina(100);
        this.UIManager.event.emit('updateStamina');
        this.UIManager.event.emit('updateDay');

        import("../GameDataManager.js").then(module => {
            const GameDataManager = module.default;
            GameDataManager.saveFrom(this);

            const ending = GameDataManager.getEnding(6, 2);
            if (ending === "good") console.log("Good ending");
            else if (ending === "bad") console.log("Bad ending");
        });

        this.time.delayedCall(500, () => this.dayChanging = false);
    }
}
