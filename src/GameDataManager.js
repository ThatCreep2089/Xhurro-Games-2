// GameDataManager.js
export default class GameDataManager {
    static player = {
        backpack: { paint: 0, paper: 0, clay: 0 },
        stamina: 27
    };

    static buildsConstructed = [];
    static day = 1; //Nuevo contador de días

    static saveFrom(scene) {
        if (!scene) return;

        if (scene.otter) {
            this.player.backpack.paint = scene.otter.backpack.paint;
            this.player.backpack.paper = scene.otter.backpack.paper;
            this.player.backpack.clay = scene.otter.backpack.clay;
            if (typeof scene.otter.getStamina === 'function')
                this.player.stamina = scene.otter.getStamina();
        }

        if (scene.builds && Array.isArray(scene.builds)) {
            this.buildsConstructed = scene.builds
                .filter(b => b && b.built)
                .map(b => b.id);
        }

        //Guardamos el día actual
        if (scene.currentDay) this.day = scene.currentDay;
    }

    static applyTo(scene) {
        if (!scene) return;

        if (scene.otter && scene.otter.backpack) {
            scene.otter.backpack.paint = this.player.backpack.paint;
            scene.otter.backpack.paper = this.player.backpack.paper;
            scene.otter.backpack.clay = this.player.backpack.clay;
        }
        if (scene.otter) {
            if (typeof scene.otter.setStamina === 'function') {
                scene.otter.setStamina(this.player.stamina);
            } else if (scene.otter.stamina !== undefined) {
                scene.otter.stamina = this.player.stamina;
            }
        }

        // Restaurar día
        scene.currentDay = this.day;

        if (scene.builds && this.buildsConstructed.length) {
            scene.builds.forEach(b => {
                if (this.buildsConstructed.includes(b.id) && !b.built) {
                    b.finishConstruction();
                }
            });
        }

        if (scene.UIManager && scene.UIManager.event) {
            scene.UIManager.event.emit('updateInventory');
            scene.UIManager.event.emit('updateStamina');
            scene.UIManager.event.emit('updateDay'); // 🔹 nuevo evento
        } else {
            scene.time.delayedCall(200, () => {
                if (scene.UIManager && scene.UIManager.event) {
                    scene.UIManager.event.emit('updateInventory');
                    scene.UIManager.event.emit('updateStamina');
                    scene.UIManager.event.emit('updateDay');
                }
            });
        }
    }

    static getEnding(requiredDays, totalBuilds) {
        if (this.day < requiredDays) return null; //no final

        const builtCount = this.buildsConstructed.length;
        if (this.day >= requiredDays) {
            if (builtCount >= totalBuilds) return "good";//todas construidas
            return "bad"; //no alcanza el mínimo
        }
    }
}