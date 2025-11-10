import DialogText from "../dialog_plugin.js";

export default class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, value, data, player, minigameInfo, scale = 0.1) {
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
        this.closing = false;

        // === ESCALA Y FÍSICAS REDUCIDAS ===
        this.setScale(scale);        
        this.scene.add.existing(this);        
        this.setOrigin(0.5,1);

        // --- Calcular tamaños reales ---
        const dw = this.displayWidth;   // ancho real del sprite (con escala)
        const dh = this.displayHeight;  // alto real del sprite

        // --- COLLIDER FÍSICO  ---
        scene.physics.add.existing(this, true);

        // collider con las mismas dimensiones que la textura, pero ajustable
        this.body.setSize(dw, dh);

        this.body.x = this.x - (this.body.width / 2);
        this.body.y = this.y - (dh / 2) - (this.body.height / 2);
        console.log(this.body.x,this.body.y);

        // centramos el collider (como el sprite tiene origin 0.5,1)

        // --- ZONA DE INTERACCIÓN (🟦 un poco más grande que la textura) ---
        this.zone = scene.add.zone(x, y).setSize(dw + 10, dh + 10); // 20% más ancha y un poco más alta
        scene.physics.add.existing(this.zone, true);

        // centramos la zona respecto al sprite
        this.zone.body.x = this.x - (this.zone.body.width / 2);
        this.zone.body.y = this.y - (dh / 2) - (this.zone.body.height / 2);

        // --- COLISIONES Y OVERLAPS ---
        scene.physics.add.collider(this.otter, this);
        scene.physics.add.overlap(this.otter, this.zone, () => { this.touching = true; });

        // Variables para controlar colisión
        this.touching = false;
        this.wasTouching = false;
        this.interactionCooldown = false;

        this.on("overlapstart", () => this.onCollisionEnter());
        this.on("overlapend", () => this.onCollisionExit());
        this.scene.physics.world.on("worldstep", () => this.physicsUpdate());

        // === LISTENER DE TECLA (avanzar diálogo) ===
        this._spaceHandler = () => {
            if (this.scene.currentNPC === this && this.dialogActive && !this.closing) {
                this.nextDialog();
            }
        };
        this.scene.input.keyboard.on('keydown-SPACE', this._spaceHandler);
    }

    // =============================
    // === FÍSICAS Y COLISIONES ===
    // =============================

    onCollisionEnter() {
        if (!this.dialogActive && !this.closing)
            this.scene.UIManager.appearInteractMessage();
    }

    onCollisionExit() {
        this.scene.UIManager.disappearInteractMessage();
    }

    physicsUpdate() {
        if (this.touching && !this.wasTouching) this.emit("overlapstart");
        if (!this.touching && this.wasTouching) this.emit("overlapend");

        if (this.scene.spaceKey.justDown && this.touching && !this.dialogActive && !this.closing && !this.interactionCooldown){
            this.startDialog();
        }

        this.wasTouching = this.touching;
        this.touching = false;
    }

    // =============================
    // === DIÁLOGOS ===
    // =============================

    startDialog() {
        this.locator = this.findDay(this.scene.currentDay);
        if (!this.locator) return;

        this.scene.currentNPC = this;
        this.dialogList = this.locator.Dialog;
        this.dialogIndex = 0;
        this.dialogActive = true;
        this.closing = false;
        this.otter.canMove = false;
        this.scene.UIManager.disappearInteractMessage();
        this.showDialog();
    }

    findDay(day) {
        const aux = this.datos.Dias;
        return aux.find(d => d.val === day);
    }

    showDialog() {
        if (!this.dialogList || this.dialogList.length === 0) return;

        const current = this.dialogList[this.dialogIndex];
        const isOtter = current.speaker?.toLowerCase().includes("otter");

        if (this.text) this.text.toggleWindow();

        const opts = isOtter
            ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 }
            : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 };

        this.text = new DialogText(this.scene, opts);
        this.text.setText(current.msgn, true);
        this.showSpeakerImage(current.portrait, current.speaker);
    }

    showSpeakerImage(portraitKey, speaker) {
        const cam = this.scene.cameras.main;
        const marginX = 32;
        const marginY = 200;

        if (this.speakerImage) {
            this.speakerImage.destroy();
            this.speakerImage = null;
        }
        this.scene.events.off("postupdate", this._updatePortraitPos, this);
        if (!portraitKey) return;

        const isOtter = speaker?.toLowerCase().includes("otter");
        const y = cam.scrollY + cam.height - marginY;
        const x = isOtter ? cam.scrollX + marginX : cam.scrollX + cam.width - marginX;

        this.speakerImage = this.scene.add.image(x, y, portraitKey)
            .setOrigin(isOtter ? 0 : 1, 1)
            .setScale(0.9)
            .setFlipX(!isOtter)
            .setDepth(2000)
            .setAlpha(0);

        this.scene.tweens.add({ targets: this.speakerImage, alpha: 1, duration: 300 });
        this.speakerSide = isOtter ? "left" : "right";
        this._portraitMarginX = marginX;
        this._portraitMarginY = marginY;
        this.scene.events.on("postupdate", this._updatePortraitPos, this);
    }

    _updatePortraitPos() {
        if (!this.dialogActive || !this.speakerImage) return;
        const cam = this.scene.cameras.main;
        const y = cam.scrollY + cam.height - this._portraitMarginY;
        const x = this.speakerSide === "left"
            ? cam.scrollX + this._portraitMarginX
            : cam.scrollX + cam.width - this._portraitMarginX;
        this.speakerImage.setPosition(x, y);
    }

    nextDialog() {
        if (!this.dialogActive || this.closing) return;

        if (this.text?.isAnimating) {
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

    // =============================
    // === CIERRE Y LIMPIEZA ===
    // =============================

    closeDialog() {
        if (this.closing) return;
        this.closing = true;

        this.destroyDialogVisuals();
        this.dialogActive = false;

        // Aparece panel de minijuego si existe
        if (this.scene && this.scene.UIManager && this.minigameInfo) {
            const ui = this.scene.UIManager;
            ui.event.removeAllListeners("minigame:closed");
            ui.event.once("minigame:closed", () => {
                this.destroyDialogVisuals();
                if (this.otter) this.otter.canMove = true;
            });
            ui.appearMinigameInfo(this.minigameInfo);
        } else {
            if (this.otter) this.otter.canMove = true;
        }
        this.interactionCooldown = true;
        this.scene.time.delayedCall(500, () => { // 0.5 segundos
            this.interactionCooldown = false;
        });
        // Desactivar tecla SPACE para este NPC
        this.scene.input.keyboard.off('keydown-SPACE', this._spaceHandler);
        this.closing = false;
    }

    destroyDialogVisuals() {
        const scene = this.scene;

        // Detener cualquier evento de texto activo
        if (this.text?.timedEvent) {
            try { this.text.timedEvent.remove(); } catch (e) {}
            this.text.timedEvent = null;
        }

        // Eliminar tweens
        if (scene?.tweens) {
            scene.tweens.killTweensOf(this.text?.text);
            scene.tweens.killTweensOf(this.text?.graphics);
            scene.tweens.killTweensOf(this.speakerImage);
        }

        // Destruir gráficos si existen
        try {
            if (this.text?.text) this.text.text.destroy();
            if (this.text?.graphics) this.text.graphics.destroy();
            if (this.text?.closeBtn) this.text.closeBtn.destroy();
        } catch (e) {}
        this.text = null;

        // Destruir retrato
        if (this.speakerImage) {
            try { this.speakerImage.destroy(); } catch (e) {}
            this.speakerImage = null;
        }

        // Eliminar listener de cámara
        try { scene.events.off("postupdate", this._updatePortraitPos, this); } catch (e) {}

        this.dialogActive = false;
    }

    forceCloseDialog() {
        this.destroyDialogVisuals();
        this.dialogActive = false;
        this.dialogIndex = 0;
        this.closing = false;
        if (this.otter) this.otter.canMove = true;
        if (this.scene && this.scene.currentNPC === this) this.scene.currentNPC = null;
    }
}
