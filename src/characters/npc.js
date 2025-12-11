import DialogText from "../dialog_plugin.js";

export default class NPC extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, undefined);//de momento sin sprite
        this.scene.add.existing(this);
        this.setDepth(this.y);
    }
    innit(texture, data, player, minigameInfo, scale = 0.1, colliderWidthFactor=1) {
        this.setTexture(texture);
        this.datos = data;
        this.otter = player;
        this.minigameInfo = minigameInfo;

        this.isDialogOpen = false;   // Cualquier diálogo activo
        this.isRejection = false;    // Si el diálogo actual es de rechazo
        this.canInteract = true;     // Si el NPC puede iniciar diálogo
        this.waitSpaceRelease = false;
        this.dialogList = [];
        this.dialogIndex = 0;

        // ============================
        // FÍSICAS Y ÁREA DE INTERACCIÓN
        // ============================

        this.setScale(scale);
        this.scene.physics.add.existing(this, true);
       
        this.zone = this.scene.add.zone(this.x, this.y).setSize(this.width*scale*colliderWidthFactor + 10, (this.height*scale * 0.2) + 10);
        this.scene.physics.add.existing(this.zone, true);
        

        this.body.setSize(this.width*scale*colliderWidthFactor, (this.height*scale) * 0.2);
        //this.body.x = this.x - (dw / 2);
        this.body.y = this.body.y + ((this.height*scale / 2) - (this.body.height / 2));
        // this.zone.body.x = this.x - (this.zone.body.width / 2);
        this.zone.body.y = this.zone.body.y + ((this.height*scale / 2) - (this.body.height / 2));

        this.setDepth(this.body.y);

        this.touching = false;
        this.wasTouching = false;

        this.scene.physics.add.collider(this.otter, this);
        this.scene.physics.add.overlap(this.otter, this.zone, () => { this.touching = true; });

        this.scene.physics.world.on("worldstep", () => this.physicsUpdate());

        // Avanzar diálogo con espacio
        this.scene.input.keyboard.on("keydown-SPACE", () => {
            if (this.scene.currentNPC !== this) return;
            if (!this.isDialogOpen) return;

            if (this.isRejection) {
                this.forceCloseDialog();
                return;
            }

            this.nextDialog();
        });
        
        if (this.breathTween) this.breathTween.stop();
        
        const baseScaleX = this.scaleX;
        const baseScaleY = this.scaleY;
        
        this.breathTween = this.scene.tweens.add({
            targets: this,
            scaleX: baseScaleX * 1.05, // expansión horizontal ligera
            scaleY: baseScaleY * 1.05, // expansión vertical ligera
            duration: 700,            // tiempo de expansión
            yoyo: true,                // vuelve al tamaño original
            repeat: -1,                // repetir infinitamente
            ease: 'Sine.easeInOut'     // movimiento suave
        });
    }

    // ==============================
    // DETECCIÓN DE INTERACCIÓN
    // ==============================
    physicsUpdate() {

       if (this.touching && !this.wasTouching){
           this.scene.UIManager.appearInteractMessage();
       }

       if (!this.touching && this.wasTouching){
           this.scene.UIManager.disappearInteractMessage();
       }

       // Si hay diálogo abierto, no permitir interacción
       if (this.isDialogOpen) {
           this.wasTouching = this.touching;
           this.touching = false;
           return;
       }

       // Esperar a que el jugador suelte SPACE antes de permitir volver a hablar
       if (this.waitSpaceRelease) {
           this.wasTouching = this.touching;
           this.touching = false;
           return;
       }

       // Intento de iniciar diálogo
       if (this.scene.spaceKey.justDown && this.touching && this.canInteract && !this.isDialogOpen) {
           this.startDialog();
       }

        this.wasTouching = this.touching;
        this.touching = false;
    }
    // ==============================
    // DIÁLOGO NORMAL
    // ==============================
    findDay(day) {
        console.log(this.datos)
        return this.datos.Dias.find(d => d.val === day);
        
    }
    // ===============================================
    // LOCALIZADOR DEL JSON Y DE INFO DEL JSON
    // ===============================================
    startDialog() {
        const locator = this.findDay(this.scene.currentDay);
        if (!locator) return;

        this.dialogList = [...locator.Dialog];
        this.dialogIndex = 0;

        const first = this.dialogList[0];
        if(first != undefined){
                this.openDialog({
                text: first.msgn,
                portrait: first.portrait,
                speaker: first.speaker,
                type: "normal"
            });
        }

        this.scene.currentNPC = this;
    }
    // ===============================================
    // DIÁLOGO
    // ===============================================
    showDialog() {
        const current = this.dialogList[this.dialogIndex];
        const isOtter = current.speaker?.toLowerCase().includes("otter");

        const opts = isOtter
            ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 }
            : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85 };

        if (this.text) this.destroyDialogVisuals();

        this.text = new DialogText(this.scene, opts);
        this.text.setText(current.msgn, true);

        this.showSpeakerImage(current.portrait, current.speaker);
        this.showDialogName(current);
    }
    // ===============================================
    // ENSEÑAR IMAGEN DEL HABALNTE
    // ===============================================
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
        this.scene.tweens.add({
            targets: this.speakerImage,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 180,
            ease: "Back.Out", // Da el efecto de rebote suave
            from: { scaleX: 0.75, scaleY: 0.75 }
        });
    }
    // ===============================================
    // PASAR DE DIALOGO
    // ===============================================
    nextDialog() {
        if (this.isRejection) return; // Rechazo se cierra solo

        this.dialogIndex++;
        if (this.dialogIndex >= this.dialogList.length) {
            this.closeDialog();
            return;
        }

        const line = this.dialogList[this.dialogIndex];

        this.openDialog({
            text: line.msgn,
            portrait: line.portrait,
            speaker: line.speaker,
            type: "normal"
        });
    }
    // ===============================================
    // CERRAR DIALOGO CUANDO SE TERMINA O CUANDO SE PULSA 'X'
    // ===============================================
    closeDialog() {
        this.destroyDialogVisuals();
        this.isDialogOpen = false;

        // Menú de minijuego
        const ui = this.scene.UIManager;

        ui.event.removeAllListeners("minigame:accepted");
        ui.event.removeAllListeners("minigame:rejected");

        ui.event.once("minigame:accepted", () => {
            this.scene.music.stop();

            ui.event.once("minigame:closed", () => {
                this.otter.canMove = true;
                this.canInteract = true;
            });
        });

        ui.event.once("minigame:rejected", () => {
            this.scene.music.stop();
            this.scene.music = this.scene.sound.add('mainSceneMusic', {
                loop: true,
            }); this.scene.music.play();

            this.showRejectionDialog();
        });

        this.scene.music.stop();
        this.scene.music = this.scene.sound.add('minigameInfoMusic', {
            loop: true,
        }); this.scene.music.play();

        ui.appearMinigameInfo(this.minigameInfo);
    }
    // ===============================================
    // ELIMINAR ELEMNTOS VISUALES
    // ===============================================
    destroyDialogVisuals() {
        if (this.text) {
            try {
                if (this.text.timedEvent) this.text.timedEvent.remove();
                if (this.text.text) this.text.text.destroy();
                if (this.text.graphics) this.text.graphics.destroy();
                if (this.text.closeBtn) this.text.closeBtn.destroy();
            } catch { }
            this.text = null;
        }

        if (this.dialogNameText) {
            try { this.dialogNameText.destroy(); } catch {}
            this.dialogNameText = null;
        }

        if (this.speakerImage) {
            try { this.speakerImage.destroy(); } catch { }
            this.speakerImage = null;
        }

        if (this.rejectionPortrait) {
            try { this.rejectionPortrait.destroy(); } catch { }
            this.rejectionPortrait = null;
        }

        if (this._updateNamePosition) {
            this.scene.events.off('postupdate', this._updateNamePosition);
            this._updateNamePosition = null;
        }
    }

    // ===============================================
    // DIÁLOGO DE RECHAZO
    // ===============================================
    showRejectionDialog() {
        const locator = this.findDay(this.scene.currentDay);
        if (!locator || !locator.Rechazo) return;

        const r = locator.Rechazo;
        if(r != undefined){
            this.openDialog({
                text: r.msgn,
                portrait: r.portrait,
                speaker: r.speaker,
                type: "rejection"
            });
        }
    }


    // ===============================================
    // CIERRE GLOBAL DE CUALQUIER DIÁLOGO
    // ===============================================
    forceCloseDialog() {
        this.scene.UIManager.appearInteractMessage();
        this.destroyDialogVisuals();

        if (this.rejectionPortrait) {
            try { this.rejectionPortrait.destroy(); } catch { }
            this.rejectionPortrait = null;
        }

        this.isDialogOpen = false;
        this.isRejection = false;

        this.otter.canMove = true;
        this.canInteract = true;

        // Asegurar que el jugador queda quieto
        this.otter.body.setVelocity(0, 0);

        if (this.scene.UIManager) {
            this.scene.UIManager.disappearMinigameInfo();
            this.scene.UIManager.event.removeAllListeners("minigame:accepted");
            this.scene.UIManager.event.removeAllListeners("minigame:rejected");
            this.scene.UIManager.event.removeAllListeners("minigame:closed");
        }
        // Esperar a que el jugador suelte SPACE antes de permitir interacción
        // Evitar reabrir el diálogo si SPACE sigue pulsado
        this.canInteract = false;
        this.waitSpaceRelease = true;

        const check = this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {

                // Cuando el jugador suelte SPACE:
                if (!this.scene.spaceKey.isDown) {
                    this.waitSpaceRelease = false;
                    this.canInteract = true;
                    check.remove();
                }
            }
        });

    }
    openDialog(config) {
        if (!config || !config.text) {
            console.warn("Dialog text is null or undefined!", config);
            config.text = ""; // default
        }
        // ==========================
        // Destrucción previa
        // ==========================
        this.destroyDialogVisuals();

        this.isDialogOpen = true;
        this.isRejection = (config.type === "rejection");
        this.canInteract = false;

        // ==========================
        // Bloquear movimiento
        // ==========================
        this.otter.canMove = false;
        this.otter.body.setVelocity(0, 0);

        // ==========================
        // Opciones estéticas
        // ==========================
        const isOtter = config.speaker?.toLowerCase().includes("otter");

        const opts = isOtter
        ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 150, padding: 32 }
        : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 150, padding: 32 };


        // ==========================
        // Crear cuadro de diálogo
        // ==========================
        this.text = new DialogText(this.scene, opts);
        this.text.setText(config.text, true);
        this.text.graphics.setDepth(this.scene.UIManager.HUDDepth);
        this.text.text.setDepth(this.scene.UIManager.HUDDepth);
        this.text.closeBtn.setDepth(this.scene.UIManager.HUDDepth);
                
        // Cerrar por X
        if (this.text.closeBtn) {
            this.text.closeBtn.on("pointerdown", () => {
                this.forceCloseDialog();
            });
        }

        // Cerrar por SPACE si es rechazo
        if (this.isRejection) {
            this.scene.input.keyboard.once("keydown-SPACE", () => {
                this.forceCloseDialog();
            });
        }


        // ==========================
        // Retrato del personaje
        // ==========================
        // Crear retrato del personaje
        const cam = this.scene.cameras.main;
        const y = cam.scrollY + cam.height - 200;
        const x = isOtter ? cam.scrollX + 32 : cam.scrollX + cam.width - 32;

        if (this.rejectionPortrait) {
            try { this.rejectionPortrait.destroy(); } catch { }
        }

        this.rejectionPortrait = this.scene.add.image(x, y, config.portrait)
            .setOrigin(isOtter ? 0 : 1, 1)
            .setScale(0.9)
            .setFlipX(!isOtter)
            .setDepth(2000);

        this.scene.tweens.add({
            targets: this.rejectionPortrait,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 180,
            ease: "Back.Out", // Da el efecto de rebote suave
            from: { scaleX: 0.75, scaleY: 0.75 }
        });
        this.speakerImage = !this.isRejection ? this.rejectionPortrait : null;
        
        // **Después de crear la imagen, llamar a showDialogName**
        this.showDialogName(config);
        // ==========================
        // Guardar datos del cuadro
        // ==========================
        this.currentDialogConfig = config;
    }
    showDialogName(data) {
        if (!data || !data.speaker || !this.text) return;

        // Destruir nombre previo
        if (this.dialogNameText) {
            this.dialogNameText.destroy();
            this.dialogNameText = null;
        }

        const isOtter = data.speaker.toLowerCase().includes("otter");

        this.dialogNameText = this.scene.add.text(0, 0, data.speaker, {
            fontFamily: 'bobFont',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        })
        .setDepth(2001)
        .setScrollFactor(0);

        const updatePosition = () => {
            if (!this.text) return;

            const padding = 10;
            const x = isOtter 
                ? this.text.windowX + padding
                : this.text.windowX + this.text.windowWidth - padding;
            const y = this.text.windowY - 5;

            this.dialogNameText.setOrigin(isOtter ? 0 : 1, 1);
            this.dialogNameText.setPosition(x, y);
        };

        // Esperar un tick para asegurarnos de que this.text esté listo
        this.scene.time.addEvent({
            delay: 10,
            callback: () => {
                updatePosition();

                // Actualizar cada frame
                if (this._updateNamePosition) this.scene.events.off('postupdate', this._updateNamePosition);
                this._updateNamePosition = updatePosition;
                this.scene.events.on('postupdate', this._updateNamePosition);
            }
        });
    }



}
