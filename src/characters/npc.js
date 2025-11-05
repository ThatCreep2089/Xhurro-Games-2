import DialogText from "../dialog_plugin.js";

export default class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, value, data, player, minigameInfo) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.val = value;
        this.datos = data;
        this.otter = player;
        this.minigameInfo = minigameInfo;

        this.dialogActive = false;
        this.dialogList = [];
        this.dialogIndex = 0;
        this.body.setSize(this.width/2,this.height/2);
        this.setScale(this.width/1500,this.height/1500);
        // Crear listener para tecla E (para avanzar diálogo)
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.dialogActive) this.nextDialog();
        });
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }

    // Método principal: iniciar diálogo
    startDialog() {
        this.locator = this.findDay(this.scene.currentDay);

        if (!this.locator) return;

        // Crear cuadro de diálogo
        this.text = new DialogText(this.scene);

        // Guardamos lista de mensajes
        this.dialogList = this.locator.Dialog;
        this.dialogIndex = 0;

        // Activamos diálogo y bloqueamos movimiento
        this.dialogActive = true;
        this.otter.canMove = false;

        // Mostrar primer mensaje
        this.showDialog();
    }

    // Buscar el día correspondiente
    findDay(day) {
        const aux = this.datos.Dias;
        return aux.find(d => d.val === day);
    }

    // Mostrar mensaje actual
    showDialog() {
        if (!this.dialogList || this.dialogList.length === 0) return;

        const currentMsg = this.dialogList[this.dialogIndex].msgn;
        this.text.setText(currentMsg, true);
    }

    // Avanzar al siguiente mensaje
    nextDialog() {
        if (!this.dialogActive) return;

        if (this.text.isAnimating) {
            this.text.completeText();
            return;
        }

        this.dialogIndex++;

        if (this.dialogIndex < this.dialogList.length) {
            this.showDialog();
        } else {
            this.closeDialog();
        }
    }

    // Cerrar diálogo
    closeDialog() {
        this.text.toggleWindow();
        this.dialogActive = false;

        if (this.scene.UIManager != null)
        this.scene.UIManager.appearMinigameInfo(this.minigameInfo);
    }
}
