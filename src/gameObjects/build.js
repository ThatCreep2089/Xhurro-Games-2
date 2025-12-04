// build.js
import GameDataManager from "../GameDataManager.js";
import DialogText from "../dialog_plugin.js";
export default class Build extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, builtTexture, paint = 0, paper = 0, clay = 0, size = 1, frame = 0, id = null) {
        super(scene, x, y, texture, frame);

        this.setScale(size);
        this.scene.add.existing(this);

        // Identificador único (por defecto posición)
        this.id = id || `${Math.round(x)}_${Math.round(y)}`;

        this.builtTexture = builtTexture || texture;
        this.built = false;

        this.otter = this.scene.otter;
        this.sources = { paint, paper, clay };

        // Física / zona
        this.zone = scene.add.zone(x, y).setSize(this.width + 10, (this.height * 0.2) + 10);
        scene.physics.add.existing(this.zone, true);
        scene.physics.add.existing(this, true);

        this.body.setSize(this.width, (this.height) * 0.2);
        this.body.y = this.body.y + ((this.height / 2) - (this.body.height / 2));
        this.zone.body.y = this.zone.body.y + ((this.height / 2) - (this.body.height / 2));

        this.setDepth(this.body.y);

        scene.physics.add.collider(this.otter, this);
        scene.physics.add.overlap(this.otter, this.zone, () => { this.touching = true; });

        this.touching = false;
        this.wasTouching = false;

        this.on("overlapstart", () => { this.onCollisionEnter(); });
        this.on("overlapend", () => { this.onCollisionExit(); });

        this.scene.physics.world.on('worldstep', () => { this.physicsUpdate(); });

        this.dialogShown = false;
        this.dialogIndex = 0;
        this.dialogList = [];
        this.dialog = new DialogText(scene, {
            windowHeight: 150,
            padding: 32,
            dialogSpeed: 2,
            portraitSize: 120
        });
        this.dialog.toggleWindow(); // oculto inicialmente
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if (!this.dialogShown) return;

        // Actualizar posición del nombre
        if (this.dialogNameText) {
            const cam = this.scene.cameras.main;
            this.dialogNameText.x = cam.width * 0.05;
            this.dialogNameText.y = cam.height - this.dialog.windowHeight - this.dialog.padding - 25;
        }

        // Manejo del SPACE
        if (this.keySpace.isDown && !this.spacePressed) {
            this.spacePressed = true;
            this.nextDialog();
        }

        if (!this.keySpace.isDown) this.spacePressed = false;
    }
    onCollisionEnter() {
        if (!this.built) this.scene.UIManager.appearBuildData(this.sources);
    }

    onCollisionExit() {
        if (!this.built) this.scene.UIManager.disappearBuildData();
    }

    physicsUpdate() {
        if (this.touching && !this.wasTouching) this.emit("overlapstart");
        if (!this.touching && this.wasTouching) this.emit("overlapend");

        if (this.scene.spaceKey.justDown && this.touching && !this.built && this.otter.enough(this.sources)) {
            // gastar recursos
            this.otter.buy(this.sources);

            // marcar construido y actualizar visual
            this.finishConstruction();

            // actualizar HUD
            if (this.scene.UIManager && this.scene.UIManager.event) {
                this.scene.UIManager.event.emit("updateInventory", {paint: -this.sources.paint, paper: -this.sources.paper, clay: -this.sources.clay});
            }

            // guardar inmediatamente el estado global
            import("../GameDataManager.js").then(module => {
                const GameDataManager = module.default;
                // asegúrate de que scene.builds contiene esta instancia (ver mainScene)
                GameDataManager.saveFrom(this.scene);
            });
        }

        this.wasTouching = this.touching;
        this.touching = false;
    }

    finishConstruction() {
        this.built = true;

        if (this.builtTexture) this.setTexture(this.builtTexture);
        if (this.zone) { this.zone.destroy(); this.zone = null; }
        // ocultar UI de build si está visible
        if (this.scene.UIManager) this.scene.UIManager.disappearBuildData();

        const dialogData = this.scene.cache.json.get('buildDialogs');

        if (!dialogData || !dialogData[this.id]) return;

        this.dialogList = dialogData[this.id];     
        this.dialogIndex = 0;

        this.dialogShown = true;
        this.scene.otter.canMove = false;

        // Mostrar ventana
        this.dialog.toggleWindow();

        this.scene.events.once('dialog:closed', () => {
            // Ocultar nombre
            if (this.dialogNameText) {
                this.dialogNameText.destroy();
                this.dialogNameText = null;
            }

            // Ocultar retrato
            if (this.speakerImage) {
                this.speakerImage.destroy();
                this.speakerImage = null;
            }

            // Permitir mover a Otter
            this.scene.otter.canMove = true;

            // También marcamos que el diálogo ya no se muestra
            this.dialogShown = false;
        });
        
        // Llamar a showCurrentDialog() en el siguiente tick
        this.scene.time.delayedCall(0, () => {
            this.showCurrentDialog();
        });

        //this.scene.input.keyboard.once("keydown-SPACE", () => this.nextDialog());
    }
    showCurrentDialog() {
        const data = this.dialogList[this.dialogIndex];
        if (!data) return;

        const isOtter = data.speaker?.toLowerCase().includes("otter");
        const opts = isOtter
            ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 150 }
            : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 150 };

        // Destruye el diálogo anterior
        if (this.dialog) {
            if (this.dialog.timedEvent) this.dialog.timedEvent.remove();
            if (this.dialog.text) this.dialog.text.destroy();
            if (this.dialog.graphics) this.dialog.graphics.destroy();
            if (this.dialog.closeBtn) this.dialog.closeBtn.destroy();
        }

        // Crear nueva instancia de DialogText
        this.dialog = new DialogText(this.scene, opts);

        // Mostrar nombre del personaje
        this.mostrarNombrePersonaje(data);

        // Texto animado
        this.dialog.setText(data.msgn, true);

        // Retrato
        const cam = this.scene.cameras.main;
        const y = cam.scrollY + cam.height - 200;
        const x = isOtter ? cam.scrollX + 32 : cam.scrollX + cam.width - 32;

        if (this.speakerImage) this.speakerImage.destroy();

        this.speakerImage = this.scene.add.image(x, y, data.portrait)
            .setOrigin(isOtter ? 0 : 1, 1)
            .setScale(0.9)
            .setFlipX(!isOtter)
            .setDepth(5000);
    }

    nextDialog() {
        if (!this.dialogShown) return;

        // Si aún se está escribiendo, completa el texto
        if (this.dialog.timedEvent !== null) {
            this.dialog.completeText();
            return; // la próxima pulsación SPACE avanzará
        }

        this.dialogIndex++;

        if (this.dialogIndex >= this.dialogList.length) {
            if (this.dialog.timedEvent !== null) {
                this.dialog.completeText(); // completa último mensaje
            } else {
                this.closeDialog(); // cierra después de presionar SPACE nuevamente
            }
            return;
        }

        // Mostrar siguiente mensaje
        this.showCurrentDialog();
    }

    closeDialog() {
        this.dialogShown = false;

        // Destruir dialogo y retrato
        if (this.dialog) {
            if (this.dialog.timedEvent) this.dialog.timedEvent.remove();
            if (this.dialog.text) this.dialog.text.destroy();
            if (this.dialog.graphics) this.dialog.graphics.destroy();
            if (this.dialog.closeBtn) this.dialog.closeBtn.destroy();
            this.dialog = null;
        }

        if (this.speakerImage) {
            this.speakerImage.destroy();
            this.speakerImage = null;
        }

        // Destruir nombre del personaje
        if (this.dialogNameText) {
            this.dialogNameText.destroy();
            this.dialogNameText = null;
        }

        // Permitir que el jugador se mueva
        this.scene.otter.canMove = true;

        // Emitir evento opcional si alguien lo escucha
        this.scene.events.emit("dialog:closed");
    }

    mostrarNombrePersonaje(data) {
        if (this.dialogNameText) {
            this.dialogNameText.destroy();
            this.dialogNameText = null;
        }

        if (!data.speaker) return;

        const cam = this.scene.cameras.main;
        const x = cam.width * 0.05; // 5% desde la izquierda
        const y = cam.height - this.dialog.windowHeight - this.dialog.padding - 25;

        this.dialogNameText = this.scene.add.text(x, y, data.speaker, {
            fontFamily: 'bobFont',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        })
        .setScrollFactor(0) // se queda fijo en la cámara
        .setDepth(5000)
        .setAlpha(1);
    }

}
