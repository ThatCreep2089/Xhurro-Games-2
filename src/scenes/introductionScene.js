import DialogText from "../dialog_plugin.js";

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'introScene' });
    }

    create() {
        // === DATOS DE DIÁLOGO ===
        const data = this.cache.json.get('dialogos');
        const dialogos = data.escena_inicial;

        // === INICIAR DIÁLOGO ===
        this.iniciarDialogoDesdeJSON(dialogos);
    }

    iniciarDialogoDesdeJSON(dialogos) {
        // Métodos con contexto correcto
        const cambiarFondoDialogo = this.cambiarFondoDialogo.bind(this);
        const cambiarFondoDeEscena = this.cambiarFondoDeEscena.bind(this);
        const mostrarNombrePersonaje = this.mostrarNombrePersonaje.bind(this);
        const cerrarDialogo = this.cerrarDialogo.bind(this);

        this.dialogNameText = null;
        this.dialogBackground = null;
        this.fondoActual = null;

        let index = 0;

       const mostrarSiguiente = () => {
            if (index >= dialogos.length) {
                cerrarDialogo();
                this.time.delayedCall(10, () => {
                    this.scene.start('mainScene');
                });
                return;
            }

            const mensaje = dialogos[index];

            // --- fondo y estilo (tu código previo) ---
            if (mensaje.fondo && mensaje.fondo !== this.fondoActual) {
                cambiarFondoDeEscena(mensaje.fondo);
                this.fondoActual = mensaje.fondo;
            }

            const isOtter = mensaje.nombre?.toLowerCase().includes("otter");
            const opts = isOtter
                ? { windowColor: 0x1a3ca8, borderColor: 0x3a6ff7, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 140 }
                : { windowColor: 0x4d2a0c, borderColor: 0x8b4513, fontFamily: "bobFont", fontSize: 24, windowAlpha: 0.85, windowHeight: 140 };

            // Destruye el cuadro anterior para que no se acumulen
            if (this.dialogPlugin) {
                try {
                    if (this.dialogPlugin.timedEvent) this.dialogPlugin.timedEvent.remove();
                } catch {}
                if (this.dialogPlugin.text) this.dialogPlugin.text.destroy();
                if (this.dialogPlugin.graphics) this.dialogPlugin.graphics.destroy();
                if (this.dialogPlugin.closeBtn) {
                    // quitamos listeners previos por si acaso
                    try { this.dialogPlugin.closeBtn.off('pointerdown'); } catch {}
                    try { this.dialogPlugin.closeBtn.destroy(); } catch {}
                }
            }

            // Crear el nuevo cuadro de diálogo con el estilo del NPC
            this.dialogPlugin = new DialogText(this, opts);

            // Mostrar nombre del personaje
            mostrarNombrePersonaje(mensaje);

            // --- HANDLERS personalizados para X (closeBtn) y SPACE ---
            // Definimos handlers locales para poder removerlos al avanzar
            const pointerHandler = () => {
                // Si está escribiendo, completamos el texto en vez de destruirlo
                if (this.dialogPlugin && this.dialogPlugin.timedEvent) {
                    this.dialogPlugin.completeText();
                    return;
                }
                // Si ya terminó, avanzamos
                cleanupAndAdvance();
            };

            const keyHandler = (e) => {
                if (e.code !== 'Space') return;
                // Si está escribiendo, completamos el texto en vez de avanzar
                if (this.dialogPlugin && this.dialogPlugin.timedEvent) {
                    this.dialogPlugin.completeText();
                    return;
                }
                cleanupAndAdvance();
            };

            const cleanupAndAdvance = () => {
                // remover listeners para evitar duplicados
                try {
                    this.input.keyboard.off('keydown', keyHandler);
                } catch {}
                try {
                    if (this.dialogPlugin && this.dialogPlugin.closeBtn) {
                        this.dialogPlugin.closeBtn.off('pointerdown', pointerHandler);
                    }
                } catch {}
                index++;
                mostrarSiguiente();
            };

            // Asignamos el listener del teclado (Space)
            // Usamos on para poder capturar tanto durante la escritura como después
            this.input.keyboard.on('keydown', keyHandler);

            // Quitamos el listener por defecto del closeBtn (el que borra el dialog)
            if (this.dialogPlugin && this.dialogPlugin.closeBtn) {
                try {
                    this.dialogPlugin.closeBtn.off('pointerdown'); // elimina el listener del plugin
                } catch {}

                // Hacemos interactiva la X y le ponemos nuestro handler
                this.dialogPlugin.closeBtn.setInteractive({ useHandCursor: true });
                this.dialogPlugin.closeBtn.on('pointerdown', pointerHandler);
            }

            // Finalmente mostramos el texto (esto inicia el timedEvent si animate = true)
            this.dialogPlugin.setText(mensaje.texto, true);
        };

        mostrarSiguiente();
    }
    mostrarSiguiente(){
        
    }
    cambiarFondoDialogo(tipo) {
        const colores = {
            narracion: 0x303030,
            personaje: 0x204060,
            pensamiento: 0x505050
        };

        const color = colores[tipo] || 0x303030;

        if (this.dialogPlugin) {
            this.dialogPlugin.windowColor = color;
            this.dialogPlugin._createWindow();
        }
    }

    cambiarFondoDeEscena(nombreFondo) {
        const scene = this;

        // Si ya tenemos el mismo fondo, no hacemos nada
        if (scene.dialogBackground && scene.fondoActual === nombreFondo) return;

        const oldBackground = scene.dialogBackground;

        // Creamos nuevo fondo con alpha 0
        const newBackground = scene.add.image(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            nombreFondo
        )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(-100) // por debajo del cuadro
            .setAlpha(0);

        // Hacemos fade-in
        scene.tweens.add({
            targets: newBackground,
            alpha: 1,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                if (oldBackground) oldBackground.destroy();
            }
        });

        // 🔧 NUEVO: aseguramos que el fondo se “repinte” tras el primer frame del plugin
        scene.time.delayedCall(50, () => {
            if (!newBackground.scene) return;
            // Lo traemos al fondo de nuevo para evitar que el plugin lo tape
            newBackground.setDepth(-100);
        });

        // Guardamos referencia
        scene.dialogBackground = newBackground;
        scene.fondoActual = nombreFondo;
    }



    mostrarNombrePersonaje(mensaje) {
        // Elimina texto anterior con fade out si existe
        if (this.dialogNameText) {
            this.dialogNameText.destroy();
            this.dialogNameText = null;
        }

        // Solo mostrar si el tipo es personaje y hay nombre
        if (mensaje.tipo !== 'personaje' || !mensaje.nombre) return;

        const cam = this.cameras.main;
        const x = cam.scrollX + 40;
        const y = cam.scrollY + cam.height - this.dialogPlugin.windowHeight - this.dialogPlugin.padding - 25;

        this.dialogNameText = this.add.text(x, y, mensaje.nombre, {
            fontFamily: 'bobFont',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#ffd700', // Dorado brillante
            stroke: '#000000',
            strokeThickness: 3
        })
        .setScrollFactor(0)
        .setDepth(80)
        .setAlpha(1);
    }

    cerrarDialogo() {
        // Destruye el cuadro de diálogo completamente
        if (this.dialogPlugin) {
            if (this.dialogPlugin.text) this.dialogPlugin.text.destroy();
            if (this.dialogPlugin.graphics) this.dialogPlugin.graphics.destroy();
            if (this.dialogPlugin.closeBtn) this.dialogPlugin.closeBtn.destroy();
            this.dialogPlugin = null;
        }

        // Elimina el nombre del personaje si existe
        if (this.dialogNameText) {
            this.dialogNameText.destroy();
            this.dialogNameText = null;
        }

        // Mantenemos el fondo hasta cambiar de escena (no lo destruimos aquí)
    }
}
