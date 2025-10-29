import Otter from "../characters/otter.js"
import Source from "../gameObjects/source.js"
import Build from "../gameObjects/build.js"
import NPC from "../characters/npc.js"
import DialogText from "../dialog_plugin.js"
import UIManager from "../HUD/UIManager.js"

/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */
export default class mainScene extends Phaser.Scene {
    constructor(){
        super({key: 'mainScene'});
    }

    #inputs; //Variable privada para los inputs

    create(){
        this.createAnims();

        // Mapa
        let map = this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, map.width, map.height);
        this.cameras.main.setBounds(0, 0, map.width, map.height);

        // Controles
        this.#inputs = {
            spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            keyE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        };

        const inputStates = ()=> ({
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
            this.#inputs[key].on('down', ()=> {
                this[key].isDown = true;
                this[key].isUp = false;
                this[key].justDown = true;
            });
            this.#inputs[key].on('up', ()=> {
                this[key].isDown = false;
                this[key].isUp = true;
                this[key].justUp = true;
            });
        }

        //Nutria y movimiento de cámara
        this.otter = new Otter(this, this.scale.width/2, this.scale.height/2, 20, 'otter', 0.2);
        this.cameras.main.startFollow(this.otter);

        // Fuentes y construcciones
        this.createSources();
        this.createBuilds();

        // HUD
        this.createHUD();

        // NPCs
        this.createNPCs();

        // Variable para controlar si hay diálogo activo
        this.dialogActive = false;

        // Colisión con Toni
        this.physics.add.collider(this.otter, this.Toni, () => {
            if (this.keyE.isDown && !this.dialogActive) {
                this.selectDialog(this.Toni.val);
            }
        });

        // Listener único de tecla E
        this.input.keyboard.on('keydown-E', () => {
            if (!this.dialogActive) return;

            if (this.text.isAnimating) {
                this.text.completeText();
                return;
            }

            this.dialogIndex++;
            if (this.dialogIndex < this.dialogList.length) {
                const nextMsg = this.dialogList[this.dialogIndex].msgn;
                this.text.setText(nextMsg, true);
            } else {
                this.text.toggleWindow();
                this.dialogActive = false;
                this.otter.canMove = true;
            }
        });
        this.events.on('dialog:closed', () => {
            this.dialogActive = false;
            this.otter.canMove = true;
        });
    }

    update(){
        // Resetear just de los inputs
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
        new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3);
    }

    createHUD()
    {
        //HUD recursos en inventario
        this.UIManager = new UIManager(this);
    }

    createNPCs() {
        this.Toni = new NPC(this, 400, 500, 'toni', 0);
    }

    selectDialog(num) {
        switch(num){
            case 0:
                this.datos = this.cache.json.get('prueba');
                break;
        }
        this.dialog();
    }

    findDay(day) {
        var aux = this.datos.Dias;
        for(var i = 0; i < aux.length; ++i){        
            if(aux[i].val === day ){
                return aux[i];
            }
        }
    }

    dialog() {
        this.locator = this.findDay(1);

        // Crear el cuadro de diálogo
        this.text = new DialogText(this);

        // Guardamos array de mensajes
        this.dialogList = this.locator.Dialog;
        this.dialogIndex = 0;

        // Activamos diálogo y bloqueamos movimiento
        this.dialogActive = true;
        this.otter.canMove = false;

        // Mostrar primer mensaje
        this.showDialog();
    }

    showDialog() {
        if (!this.dialogList || this.dialogList.length === 0) return;

        const currentMsg = this.dialogList[this.dialogIndex].msgn;
        this.text.setText(currentMsg, true);
    }

    nextDialog() {
        this.dialogIndex++;

        if (this.dialogIndex < this.dialogList.length) {
            this.showDialog();
        } else {
            this.text.toggleWindow();
            this.dialogActive = false;
            this.otter.canMove = true;
        }
    }
}