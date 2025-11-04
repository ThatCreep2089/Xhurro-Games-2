// build.js
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

        scene.physics.add.collider(this.otter, this);
        scene.physics.add.overlap(this.otter, this.zone, () => { this.touching = true; });

        this.touching = false;
        this.wasTouching = false;

        this.on("overlapstart", () => { this.onCollisionEnter(); });
        this.on("overlapend", () => { this.onCollisionExit(); });

        this.scene.physics.world.on('worldstep', () => { this.physicsUpdate(); });
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
                this.scene.UIManager.event.emit("updateInventory");
                this.scene.UIManager.event.emit("updateStamina");
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
        console.log(`[Build] constructed id=${this.id}`);
    }
}
