// GameDataManager.js
export default class GameDataManager {
    static player = {
        backpack: { paint: 0, paper: 0, clay: 0 },
        stamina: 52,
        position: {
            x: 0,
            y: 0
        }
    };

    static navi = {
        position: {
            x: 5,
            y: 5
        }
    }

    static buildsConstructed = [];
    static collectedSources = [];

    static day = 1; //Nuevo contador de días
    static lastDay = 1;

    static reward = {
        paint: 0,
        paper: 0,
        clay: 0
    };
    static saveFrom(scene) {
        if (!scene) return;
        
        if (scene.otter) {

            this.reward.paint = scene.otter.backpack.paint - this.player.backpack.paint;
            this.reward.paper = scene.otter.backpack.paper - this.player.backpack.paper;
            this.reward.clay = scene.otter.backpack.clay - this.player.backpack.clay;
            
            this.player.backpack.paint = scene.otter.backpack.paint;
            this.player.backpack.paper = scene.otter.backpack.paper;
            this.player.backpack.clay = scene.otter.backpack.clay;

            this.player.position.x = scene.otter.x;
            this.player.position.y = scene.otter.y;

            if (typeof scene.otter.getStamina === 'function')
                this.player.stamina = scene.otter.getStamina();
        }

        if (scene.navi){
            this.navi.position.x = scene.navi.x;
            this.navi.position.y = scene.navi.y;
        }

        if (scene.builds && Array.isArray(scene.builds)) {
            this.buildsConstructed = scene.builds
                .filter(b => b && b.built)
                .map(b => b.id);
        }

        if (scene.sources){
            this.collectedSources = scene.sources
        }

        //Guardamos el día actual
        if (scene.currentDay) this.day = scene.currentDay;
    }

    static applyTo(scene) {
        if (!scene) return;

        if (scene.otter) {

            if (scene.otter.backpack){
                scene.otter.backpack.paint = this.player.backpack.paint;
                scene.otter.backpack.paper = this.player.backpack.paper;
                scene.otter.backpack.clay = this.player.backpack.clay;
            }

            scene.otter.x = this.player.position.x;
            scene.otter.y = this.player.position.y;

            if (typeof scene.otter.setStamina === 'function') {
                scene.otter.setStamina(this.player.stamina);
            } else if (scene.otter.stamina !== undefined) {
                scene.otter.stamina = this.player.stamina;
            }
        }

        if (scene.navi){
            scene.navi.x = this.navi.position.x;
            scene.navi.y = this.navi.position.y;
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

        if (this.day === this.lastDay && scene.sources && this.collectedSources.length){
            scene.sources.forEach(s => {
                let emitter = this.collectedSources.find(source => source.id === s.id);

                if (emitter){
                    s.uses = emitter.uses;
                    s.comproveUses();
                }
            });
        }
        
        if (scene.UIManager && scene.UIManager.event) {
            scene.UIManager.event.emit('updateInventory', this.reward);
            scene.UIManager.event.emit('updateStamina');
            scene.UIManager.event.emit('updateDay'); // 🔹 nuevo evento
        } else {
            scene.time.delayedCall(200, () => {
                if (scene.UIManager && scene.UIManager.event) {
                    scene.UIManager.event.emit('updateInventory', this.reward);
                    scene.UIManager.event.emit('updateStamina');
                    scene.UIManager.event.emit('updateDay');
                }
            });
        }

        this.lastDay = this.day;
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