import Otter from "../characters/otter.js";
import Source from "../gameObjects/source.js";
import Build from "../gameObjects/build.js";
import NPC from "../characters/npc.js";
import UIManager from "../HUD/UIManager.js";

/**
 * Escena principal del juego.
 * @extends Phaser.Scene
 */
export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    #inputs; // Variable privada para los inputs

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
            keyE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
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
        this.keyE = inputStates();

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
                description: "Aplasta a los topos haciendo clic sobre ellos para ganar puntos antes de que se escondan. \n"+
                             "Pero cuidado con la dinamita, si la aplastas explotará restandote puntos. \n"+
                             "¡¡¡Consigue todos los puntos que puedas!!!",
                src: 'WAMVideo',
                price: 25,
                reward:{
                    amountPerX:2,
                    X: 10
                }
            },
            LightUpGhosts: {
                name: "",
                description: "",
                src: "",
                price: "",
                reward:{
                    amountPerX:"",
                    X: ""
                }
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
         }

        // === JUGADOR (Nutria) ===
        this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 20, 'otter', 0.2);
        this.cameras.main.startFollow(this.otter);

        // === FUENTES Y CONSTRUCCIONES ===
        this.createSources();
        this.createBuilds();

        // === NPCs ===
        this.createNPCs();

        // === HUD ===
        this.createHUD();

        // === COLISIONES ===
        this.physics.add.collider(this.otter, this.Toni, () => {
            if (this.keyE.isDown && !this.Toni.dialogActive) {
                this.Toni.startDialog();
            }
        });
    }

    update() {
        // Resetear justDown / justUp
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
        for (const key in inputs) {
            inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
    }

    // === MÉTODOS AUXILIARES ===

    createAnims() {
        // Aquí podrías definir animaciones globales
    }

    createSources() {
        new Source(this, 1200, 1200, 'paint', 0, 0, 1, 5);
    }

    createBuilds() {
        new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3);
    }

    createHUD() {
        this.UIManager = new UIManager(this);
    }

    createNPCs() {
        // Carga el JSON del diálogo (ejemplo: "prueba.json" en cache)
        const npcData = this.cache.json.get('prueba');

        // Creamos a Toni
        this.Toni = new NPC(this, 400, 500, 'toni', 0, npcData, this.otter, this.minigamesInfo.WackAMole);
    }
}
