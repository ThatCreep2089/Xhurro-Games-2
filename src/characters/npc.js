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
        this.scene.input.keyboard.on('keydown-SPACE', () => {
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

        // Registrar este NPC como el que abrió el diálogo para que la X pueda referenciarlo
        this.scene.currentNPC = this;

        this.dialogList = this.locator.Dialog;
        this.dialogIndex = 0;
        this.dialogActive = true;
        this.otter.canMove = false;
        this.showDialog();
    }

    // Buscar el día correspondiente
    findDay(day) {
        const aux = this.datos.Dias;
        return aux.find(d => d.val === day);
    }

    showDialog() {
        if (!this.dialogList || this.dialogList.length === 0) return;

        const current = this.dialogList[this.dialogIndex];

        const isOtter = current.speaker?.toLowerCase().includes('otter');

        // Destruye el cuadro anterior si existe
        if (this.text) {
            this.text.toggleWindow();
        }

        // Crea un nuevo cuadro de diálogo con colores distintos
        // Modificar estos parámaetros si se queire cambiar el texto
        const opts = isOtter
            ? { 
                windowColor: 0x1a3ca8, // azul Otter
                borderColor: 0x3a6ff7,
                fontFamily: 'bobFont',
                fontSize: 24,
                windowAlpha: 0.85
            }
            : { 
                windowColor: 0x4d2a0c, // marrón NPC
                borderColor: 0x8b4513,
                fontFamily: 'bobFont',
                fontSize: 24,
                windowAlpha: 0.85
            };

        this.text = new DialogText(this.scene, opts);

        
        this.text.setText(current.msgn, true);

        // Mostrar retrato del hablante encima del cuadro de diálogo
        this.showSpeakerImage(current.portrait, current.speaker);
    }

    showSpeakerImage(portraitKey, speaker) {
        const cam = this.scene.cameras.main;

        // Distancia desde los bordes
        const marginX = 32;   // separación lateral
        const marginY = 200;  // altura sobre el borde inferior (ajusta según tu cuadro de diálogo)

        // Eliminar retrato anterior
        if (this.speakerImage) {
            this.speakerImage.destroy();
            this.speakerImage = null;
        }
        this.scene.events.off('postupdate', this._updatePortraitPos, this);

        if (!portraitKey) return;

        const isOtter = speaker?.toLowerCase().includes('otter');

        // Posiciones base
        const y = cam.scrollY + cam.height - marginY;
        const x = isOtter ? cam.scrollX + marginX : cam.scrollX + cam.width - marginX;

        // Crear retrato
        this.speakerImage = this.scene.add.image(x, y, portraitKey)
            .setOrigin(isOtter ? 0 : 1, 1)  // izquierda o derecha, anclado abajo
            .setScale(0.9)                  // 🔸 tamaño del retrato (más pequeño)
            .setFlipX(!isOtter)             // NPC mira hacia el centro
            .setDepth(2000)
            .setAlpha(0);

        // Animación de aparición
        this.scene.tweens.add({
            targets: this.speakerImage,
            alpha: 1,
            duration: 300
        });

        // Guardar datos para el seguimiento
        this.speakerSide = isOtter ? 'left' : 'right';
        this._portraitMarginX = marginX;
        this._portraitMarginY = marginY;

        // Mantener posición con la cámara
        this.scene.events.on('postupdate', this._updatePortraitPos, this);
    }

    _updatePortraitPos() {
        if (!this.dialogActive || !this.speakerImage) return;

        const cam = this.scene.cameras.main;
        const mX = this._portraitMarginX;
        const mY = this._portraitMarginY;
        const isLeft = this.speakerSide === 'left';

        const y = cam.scrollY + cam.height - mY;
        const x = isLeft ? cam.scrollX + mX : cam.scrollX + cam.width - mX;

        this.speakerImage.setPosition(x, y);
    }

   closeDialog() {
        // Evitar dobles llamadas
        if (this.closing) return;
        this.closing = true;

        // Destruir solo los visuales (mantener dialogIndex conforme a finalización)
        this.destroyDialogVisuals();

        this.dialogActive = false;

        // Abrir menú del minijuego (si existe)
        if (this.scene && this.scene.UIManager && this.minigameInfo) {
            const ui = this.scene.UIManager;

            // Limpiamos listeners previos y añadimos uno para limpieza final
            ui.event.removeAllListeners('minigame:closed');

            // Cuando se cierre (rechazar o cerrar), garantizamos limpieza extra por si algo quedara
            ui.event.once('minigame:closed', () => {
                // Aquí nos aseguramos de que no quede nada visible
                this.destroyDialogVisuals();
                // Restaurar movimiento por si acaso (rechazo)
                if (this.otter) this.otter.canMove = true;
            });

            // Llamamos al UI para que aparezca
            ui.appearMinigameInfo(this.minigameInfo);
        } else {
            // Si no hay UIManager, al menos permitir moverse de nuevo
            if (this.otter) this.otter.canMove = true;
        }

        this.closing = false;
    }

   forceCloseDialog() {
        // Limpieza visual (garantizada)
        this.destroyDialogVisuals();

        // Reiniciar lógica de diálogo
        this.dialogActive = false;
        this.dialogIndex = 0;
        this.closing = false;

        // Restaurar movimiento
        if (this.otter) this.otter.canMove = true;

        // Limpiar referencia global si existe
        if (this.scene) {
            if (this.scene.currentNPC === this) this.scene.currentNPC = null;
        }
    }


    destroyDialogVisuals() {
        const scene = this.scene;

        if (this.text) {
            // Tween para desvanecer el cuadro y texto
            const targets = [];
            if (this.text.graphics) targets.push(this.text.graphics);
            if (this.text.text) targets.push(this.text.text);

            if (targets.length > 0) {
                scene.tweens.add({
                    targets: targets,
                    alpha: 0,
                    duration: 250, // duración del desvanecido en ms
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        try {
                            if (this.text.text) this.text.text.destroy();
                            if (this.text.graphics) this.text.graphics.destroy();
                            if (this.text.closeBtn) this.text.closeBtn.destroy();
                        } catch (e) { /* ignore */ }

                        this.text = null;
                    }
                });
            } else {
                // fallback si no hay tween posible
                try {
                    if (this.text.text) this.text.text.destroy();
                    if (this.text.graphics) this.text.graphics.destroy();
                    if (this.text.closeBtn) this.text.closeBtn.destroy();
                } catch (e) { /* ignore */ }
                this.text = null;
            }

            // Detener evento de escritura si existía
            if (this.text.timedEvent) {
                try { this.text.timedEvent.remove(); } catch (e) { /* ignore */ }
            }
        }

        // Desvanecer retrato también
        if (this.speakerImage) {
            scene.tweens.add({
                targets: this.speakerImage,
                alpha: 0,
                duration: 250,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    try { this.speakerImage.destroy(); } catch (e) {}
                    this.speakerImage = null;
                }
            });
        }

        // Eliminar listeners de actualización
        try { scene.events.off('postupdate', this._updatePortraitPos, this); } catch (e) {}
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
}
