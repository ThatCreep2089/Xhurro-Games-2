// GameDataManager.js
export default class GameDataManager {
    static player = {
        backpack: { paint: 0, paper: 0, clay: 0 },
        stamina: 100,
        position: {
            x: 400,
            y: 300
        }
    };

    static navi = {
        position: {
            x: 450,
            y: 250
        }
    };

    static buildsConstructed = [];
    static collectedSources = [];

    static day = 1; //Nuevo contador de días

    static reward = {
        paint: 0,
        paper: 0,
        clay: 0
    };

    static updateReward(reward){
        this.reward.paint = reward.paint;
        this.reward.paper = reward.paper;
        this.reward.clay = reward.clay;
    }

    static fade = true;

    static saveFrom(scene) {
        if (!scene) return;
        
        if (scene.otter) {
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

        if (this.fade != undefined) this.fade = scene.fade;
        if (this.fade){
            this.player.position.x = 400;
            this.player.position.y = 300;
            this.navi.position.x = 450;
            this.navi.position.y = 250;
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

                //Restablecemos la mochila
                scene.otter.backpack.paint = this.player.backpack.paint;
                scene.otter.backpack.paper = this.player.backpack.paper;
                scene.otter.backpack.clay = this.player.backpack.clay;

                //Aplicamos recompensa
                if (this.reward.paint > 0 || this.reward.paper > 0 || this.reward.clay > 0){
                    scene.otter.collect(this.reward, this.fade);
                }
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
        
        scene.fade = this.fade;

        if (scene.otter && scene.fade) scene.otter.restartStamina();

        // Restaurar día
        scene.currentDay = this.day;

        if (scene.builds && this.buildsConstructed.length) {
            scene.builds.forEach(b => {
                if (this.buildsConstructed.includes(b.id) && !b.built) {
                    b.finishConstruction();
                }
            });
        }

        if (!scene.fade && scene.sources && this.collectedSources.length){
            scene.sources.forEach(s => {
                let emitter = this.collectedSources.find(source => source.id === s.id);

                if (emitter){
                    s.uses = emitter.uses;
                    s.comproveUses();
                }
            });
        }
        
        if (scene.UIManager && scene.UIManager.event) {
            scene.UIManager.event.emit('updateInventory', scene.otter.backpack, false, false);
            scene.UIManager.event.emit('updateInventory', this.reward, this.fade);
            scene.UIManager.event.emit('updateStamina');
            scene.UIManager.event.emit('updateDay'); // 🔹 nuevo evento
        } else {
            scene.time.delayedCall(200, () => {
                if (scene.UIManager && scene.UIManager.event) {
                    scene.UIManager.event.emit('updateInventory', scene.otter.backpack, false, false);
                    scene.UIManager.event.emit('updateInventory', this.reward, this.fade);
                    scene.UIManager.event.emit('updateStamina');
                    scene.UIManager.event.emit('updateDay');
                }
            });
        }

        this.reward.paint = 0;
        this.reward.paper = 0;
        this.reward.clay = 0;
    }

    static getEnding(requiredDays, totalBuilds) {
        if (this.day < requiredDays) return null; //no final

        const builtCount = this.buildsConstructed.length;
        if (this.day > requiredDays) {
            if (builtCount >= totalBuilds) return "good";//todas construidas
            return "bad"; //no alcanza el mínimo
        }
    }

    static resetGame() {
        this.player = { backpack: { paint: 0, paper: 0, clay: 0 },
            stamina: 100,
            position: { x: 400, y: 300 } };

        this.navi = { position: { x: 450, y: 250 } };
        this.buildsConstructed = [];
        this.collectedSources = [];
        this.day = 6;
        this.reward = { paint: 0, paper: 0, clay: 0 };
        this.fade = true;
    }
}