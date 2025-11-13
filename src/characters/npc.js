import DialogText from "../dialog_plugin.js";

export default class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, data, player, minigameInfo, scale = 0.1) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.datos = data;
        this.otter = player;
        this.minigameInfo = minigameInfo;

        // Estados internos
        this.dialogActive = false;
        this.dialogList = [];
        this.dialogIndex = 0;
        this.closing = false;
        this.resetDialogNextTime = false;
        this.closingByRejection = false;
        this.rejectionDialogActive = false;
        this.interactionCooldown = false;
        this.touching = false;
        this.wasTouching = false;
        this.waitForSpaceRelease = false;
        this.dialogFlowLocked = false;

        // Escala y físicas
        this.setScale(scale);
        this.setOrigin(0.5, 1);
        const dw = this.displayWidth;
        const dh = this.displayHeight;
        this.body.setSize(dw, dh);
        this.body.x = this.x - (dw / 2);
        this.body.y = this.y - dh;

        // Zona de interacción
        this.zone = scene.add.zone(x, y).setSize(dw + 10, dh + 10);
        scene.physics.add.existing(this.zone, true);
        this.zone.body.x = this.x - (this.zone.body.width / 2);
        this.zone.body.y = this.y - (dh / 2) - (this.zone.body.height / 2);
        scene.physics.add.collider(this.otter, this);
        scene.physics.add.overlap(this.otter, this.zone, () => { this.touching = true; });

        // Actualización por frame
        scene.physics.world.on("worldstep", () => this.physicsUpdate());

        // Tecla espacio para avanzar diálogo
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            if (this.scene.currentNPC === this && this.dialogActive && !this.closing) {
                this.nextDialog();
            }
        });
    }

   physicsUpdate() {
        if (this.touching && !this.wasTouching) this.scene.UIManager.appearInteractMessage();
        if (!this.touching && this.wasTouching) this.scene.UIManager.disappearInteractMessage();

        // Bloquear interacción si venimos de un rechazo o estamos esperando liberación de tecla
        if (this.waitForSpaceRelease || this.rejectionDialogActive || this.closingByRejection) {
            this.wasTouching = this.touching;
            this.touching = false;
            return;
        }
        if (this.dialogFlowLocked) {
            this.wasTouching = this.touching;
            this.touching = false;
            return;
        }

        // Iniciar diálogo si pulsa espacio
        if (this.scene.spaceKey.justDown && this.touching && !this.dialogActive && !this.closing && !this.interactionCooldown) {
            this.startDialog();
        }

        this.wasTouching = this.touching;
        this.touching = false;
    }


    findDay(day) {
        return this.datos.Dias.find(d => d.val === day);
    }

    startDialog() {
        const locator = this.findDay(this.scene.currentDay);
        if (!locator) return;

        if (this.resetDialogNextTime) {
            this.dialogIndex = 0;
            this.resetDialogNextTime = false;
        }

        this.scene.currentNPC = this;
        this.dialogList = [...locator.Dialog];
        this.dialogIndex = 0;
        this.dialogActive = true;
        this.closing = false;
        this.otter.canMove = false;
        this.scene.UIManager.disappearInteractMessage();
        this.showDialog();
    }

    showDialog() {
        if (!this.dialogList || this.dialogList.length === 0) return;
        const current = this.dialogList[this.dialogIndex];
        const isOtter = current.speaker?.toLowerCase().includes("otter");

        const opts = isOtter
            ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 }
            : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 };

        if (this.text) this.destroyDialogVisuals();
        this.text = new DialogText(this.scene, opts);
        this.text.setText(current.msgn, true);
        this.showSpeakerImage(current.portrait, current.speaker);
    }

    showSpeakerImage(portraitKey, speaker) {
        const cam = this.scene.cameras.main;
        const marginX = 32, marginY = 200;
        const y = cam.scrollY + cam.height - marginY;
        const x = speaker.toLowerCase().includes("otter")
            ? cam.scrollX + marginX
            : cam.scrollX + cam.width - marginX;

        if (this.speakerImage) this.speakerImage.destroy();
        this.speakerImage = this.scene.add.image(x, y, portraitKey)
            .setOrigin(speaker.toLowerCase().includes("otter") ? 0 : 1, 1)
            .setScale(0.9)
            .setFlipX(!speaker.toLowerCase().includes("otter"))
            .setDepth(2000);
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

    closeDialog() {
        if (this.closing) return;
        this.closing = true;

        this.destroyDialogVisuals();
        this.dialogActive = false;

        // Evita abrir minigameInfo si venimos de un rechazo
        if (this.closingByRejection) {
            this.closing = false;
            this.closingByRejection = false;
            if (this.otter) this.otter.canMove = true;
            this.scene.time.delayedCall(100, () => {
                this.interactionCooldown = false;
            });
            return; // Se sale antes, sin abrir minijuego
        }

        if (this.scene && this.scene.UIManager && this.minigameInfo) {
            const ui = this.scene.UIManager;

            // Limpia listeners antiguos
            ui.event.removeAllListeners("minigame:accepted");
            ui.event.removeAllListeners("minigame:rejected");
            ui.event.removeAllListeners("minigame:closed");

            // --- Aceptar misión ---
            ui.event.once("minigame:accepted", () => {
                ui.event.once("minigame:closed", () => {
                    this.destroyDialogVisuals();
                    if (this.otter) this.otter.canMove = true;
                });
                // Evita que el jugador pulse espacio durante la transición al minigame
                this.dialogFlowLocked = true;

                ui.appearMinigameInfo(this.minigameInfo);

                // 🔓 Liberar flujo después de que el UIManager cierre el panel
                ui.event.once("minigame:closed", () => {
                    this.dialogFlowLocked = false;
                });

            });

            // --- Rechazar misión ---
            ui.event.once("minigame:rejected", () => {
                // Forzar cierre completo del panel del minijuego
                if (this.scene.UIManager && this.scene.UIManager.disappearMinigameInfo) {
                    this.scene.UIManager.disappearMinigameInfo();
                }

                this.closingByRejection = true;

                // Limpiar todos los listeners para que no reaparezca
                this.scene.UIManager.event.removeAllListeners("minigame:accepted");
                this.scene.UIManager.event.removeAllListeners("minigame:rejected");
                this.scene.UIManager.event.removeAllListeners("minigame:closed");

                // Mostrar mensaje de rechazo después de limpiar UI
                this.scene.time.delayedCall(300, () => {
                    this.showRejectionDialog();
                    this.resetDialogNextTime = true;
                });
            });

            // --- Mostrar menú de misión ---
            ui.appearMinigameInfo(this.minigameInfo);
        } else {
            if (this.otter) this.otter.canMove = true;
        }

        this.interactionCooldown = true;
        this.scene.time.delayedCall(500, () => {
            this.interactionCooldown = false;
        });
        this.closing = false;
    }


    destroyDialogVisuals() {
        if (!this.text) return;
        try {
            if (this.text.timedEvent) this.text.timedEvent.remove();
            if (this.text.text) this.text.text.destroy();
            if (this.text.graphics) this.text.graphics.destroy();
            if (this.text.closeBtn) this.text.closeBtn.destroy();
        } catch {}
        this.text = null;

        if (this.speakerImage) {
            try { this.speakerImage.destroy(); } catch {}
            this.speakerImage = null;
        }
    }

    // =====================================================
    // === MENSAJE DE RECHAZO DEL NPC (tras rechazar misión)
    // =====================================================
    showRejectionDialog() {
        const locator = this.findDay(this.scene.currentDay);
        const rejection = locator.Rechazo;

        const msgn = rejection.msgn;
        const speaker = rejection.speake;
        const portraitKey = rejection.portrait;
        const isOtter = (speaker ?? "").toLowerCase().includes("otter");

        const opts = isOtter
            ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 }
            : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 };

        const text = new DialogText(this.scene, opts);
        text.setText(msgn, true);

        // Conectar el cierre por X
        if (text.closeBtn) {
            text.closeBtn.on('pointerdown', () => {
                this.forceCloseDialog();
            });
        }

        const cam = this.scene.cameras.main;
        const marginX = 32, marginY = 200;
        const y = cam.scrollY + cam.height - marginY;
        const x = isOtter ? cam.scrollX + marginX : cam.scrollX + cam.width - marginX;

        // Guardar retrato global
        if (this.rejectionPortrait) {
            try { this.rejectionPortrait.destroy(); } catch {}
            this.rejectionPortrait = null;
        }

        this.rejectionPortrait = this.scene.add.image(x, y, portraitKey)
            .setOrigin(isOtter ? 0 : 1, 1)
            .setScale(0.9)
            .setFlipX(!isOtter)
            .setDepth(2000)
            .setAlpha(0);

        this.scene.tweens.add({ targets: this.rejectionPortrait, alpha: 1, duration: 300 });

        this.dialogActive = true;
        this.rejectionDialogActive = true;
        if (this.otter) this.otter.canMove = false;
        this.interactionCooldown = true;

        // Activamos listener de teclado solo para este diálogo
        this.scene.input.keyboard.once('keydown-SPACE', () => {
            if (this.rejectionDialogActive) {
                this.rejectionDialogActive = false;
                this.dialogActive = false;

                if (text.timedEvent) text.timedEvent.remove();
                if (text.text) text.text.destroy();
                if (text.graphics) text.graphics.destroy();
                if (text.closeBtn) text.closeBtn.destroy();

                if (this.rejectionPortrait) {
                    try { this.rejectionPortrait.destroy(); } catch {}
                    this.rejectionPortrait = null;
                }

                if (this.otter) this.otter.canMove = true;

                // Reiniciar correctamente los flags de bloqueo
                this.closingByRejection = false;
                this.dialogFlowLocked = false;
                this.waitForSpaceRelease = true;

                // Liberar interacción después de que el jugador suelte la barra
                this.scene.time.delayedCall(300, () => {
                    this.interactionCooldown = false;
                });

                // Escuchar cuando el jugador suelte espacio para volver a permitir hablar
                const checkRelease = this.scene.time.addEvent({
                    delay: 100,
                    loop: true,
                    callback: () => {
                        if (!this.scene.spaceKey.isDown) {
                            this.waitForSpaceRelease = false;
                            checkRelease.remove();
                        }
                    }
                });
            }
        });

    }

    // =====================================================
    // === Cierre forzado (se usa en X o cierre manual)
    // =====================================================
    forceCloseDialog() {

        // Destruir todo el contenido visual del diálogo
        this.destroyDialogVisuals();

        if (this.speakerImage) {
            try { this.speakerImage.destroy(); } catch {}
            this.speakerImage = null;
        }
        // Destruir retrato del diálogo de rechazo si existe
        if (this.rejectionPortrait) {
            try { this.rejectionPortrait.destroy(); } catch {}
            this.rejectionPortrait = null;
        }


        // Resetear estados
        this.dialogActive = false;
        this.closing = false;
        this.rejectionDialogActive = false;

        // Desactivar UI residual del minijuego
        if (this.scene.UIManager) {
            if (this.scene.UIManager.disappearMinigameInfo)
                this.scene.UIManager.disappearMinigameInfo();
            this.scene.UIManager.event.removeAllListeners("minigame:accepted");
            this.scene.UIManager.event.removeAllListeners("minigame:rejected");
            this.scene.UIManager.event.removeAllListeners("minigame:closed");
        }

        // Devolver control al jugador
        if (this.otter) this.otter.canMove = true;

        // Pequeño cooldown para evitar interacción inmediata
        this.interactionCooldown = true;
        this.scene.time.delayedCall(400, () => {
            this.interactionCooldown = false;
        });
    }

}
