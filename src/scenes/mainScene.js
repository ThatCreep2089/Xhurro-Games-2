import Otter from "../characters/otter.js";
import Source from "../gameObjects/source.js";
import Build from "../gameObjects/build.js";
import NPC from "../characters/npc.js";
import UIManager from "../HUD/UIManager.js";
import GameDataManager from "../GameDataManager.js";
import Navi from "../characters/navi.js";

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    #inputs;

    create() {
        this.createAnims();
        // === MAPA ===
        this.physics.world.setBounds(0, 0, 2560, 1840);
        this.cameras.main.setBounds(0, 0, 2560, 1840);
        this.createMap()

        // === CONTROLES ===
        this.#inputs = {
            spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            keyB: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)          
        };

        const inputStates = () => ({
            isDown: false,
            isUp: true,
            justDown: false,
            justUp: false
        });

        this.spaceKey = inputStates();
        this.keyW = inputStates();
        this.keyA = inputStates();
        this.keyS = inputStates();
        this.keyD = inputStates();
        this.keyB = inputStates();
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.Lkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)

        for (const key in this.#inputs) {
            this.#inputs[key].on('down', () => {
                this[key].isDown = true;
                this[key].isUp = false;
                this[key].justDown = true;
            });
            this.#inputs[key].on('up', () => {
                this[key].isDown = false;
                this[key].isUp = true;
                this[key].justUp = true;
            });
        }

        // === MINIJUEGOS_INFO ===
        this.minigamesInfo = {
            WackAMole: {
                name: "Whack A Mole",
                description: "Aplasta a los topos cogiendo mazas con la tecla espacio y lanzandoselas cuando aparezcan con la misma tecla.",
                src: 'WAMVideo',
                price: 20,
                reward: { amountPerX: { paint: 3, paper: 0, clay: 0 }, X: 10 }
            },
            LightUpGhosts: {
                name: "Ilumina a \n los fantasmas",
                description: "Mueve la antorcha moviendo el ratón hacia los fantasmas hasta destruirlos antes de que se escapen. \n" +
                    "\n Pero cuidado con el larguilucho con cara de pocos amigos, si le alumbras te soplará la vela y perderás puntos y campo de visión.",
                src: 'LUGVideo',
                price: 50,
                reward: { amountPerX: { paint: 0, paper: 0, clay: 2 }, X: 10 }
            },
            Puzzle: {
                name: "Puzle",
                description: "Haz clic sobre las piezas para rotarlas y consigue que el puzzle encaje.",
                src: 'PVideo',
                price: 20,
                reward: { amountPerX: { paint: 0, paper: 5, clay: 0 }, X: 4 }
            }
        };

        // === JUGADOR (Nutria) ===
        this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 350, 'otterFront', 0.15, 0.25, 0);
        this.cameras.main.startFollow(this.otter);
        this.navi = new Navi(this, this.otter, 40, 'navi', 0.1, 30);

        // === FUENTES, CONSTRUCCIONES Y NPCs ===
        this.setPositionsMap();
        /*this.createSources();
        this.createNPCs();*/
        //this.createBuilds();
        this.createMapCollisions()

        // === HUD ===
        this.createHUD();

        // === MUSICA ===
        this.music = this.sound.add('mainSceneMusic', {
            loop: true,
        }); this.music.play();

        // === CARGAR DATOS ===
        this.fade = false;
        GameDataManager.applyTo(this);

        //Una vez se ha preparado toda la escena, si tiene que hacer Fade, lo hace
        if (this.fade) { this.fade = false; this.UIManager.FadeOut(); }
    }

    update() {
        // Resetear justDown / justUp
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD,this.keyB];
        for (const key in inputs) {
            inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
        this.builds.forEach(build => build.update && build.update());
        if(this.keyB.isDown){
            this.otter.backpack.clay += 100;
            this.otter.backpack.paint += 100;
            this.otter.backpack.paper += 100;
        }
        if(Phaser.Input.Keyboard.JustDown(this.Lkey)){
            this.otter.decreaseStamina(90);
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyC)){
            this.currentDay = 6;
            this.UIManager.FadeIn();
            GameDataManager.saveFrom(this);
            this.UIManager.FadeOut();
            
        }
    }

    createMap() {
        this.map = this.make.tilemap({
            key: 'tilemap',
            tileWidth: 40,
            tileHeight: 40
        });
        const cardboard = this.map.addTilesetImage('cardboard', "cardboard");
        const foresttiles = this.map.addTilesetImage('foresttiles', "foresttiles");
        const papertiles = this.map.addTilesetImage('paperfloor', "papertiles");
        const paintriver = this.map.addTilesetImage('paintriver', "paintriver");
        const paperobstacles = this.map.addTilesetImage('paperobstacles', "paperobstacles");
        const tilesetGroup = [cardboard, foresttiles, papertiles, paintriver, paintriver, paperobstacles]
        this.background = this.map.createLayer('mapbackground', tilesetGroup);
        this.forestFloor = this.map.createLayer('forestFloor', tilesetGroup);
        this.paperFloor = this.map.createLayer('paperFloor', tilesetGroup);
        this.decors = this.map.createLayer('decors', tilesetGroup);
        this.paintRiver = this.map.createLayer('paintRiver', tilesetGroup);
        this.obstaclesbottom = this.map.createLayer('obstaclesbottom', tilesetGroup);
        this.obstaclestop = this.map.createLayer('obstaclestop', tilesetGroup);
    }


    setPositionsMap() {


        this.ObjLayer = this.map.getObjectLayer("objectLayer");
        if (!this.ObjLayer) {
            console.error("No se encontró la capa de objetos");
            return;
        }
        /*  this.npcsG = this.add.group();
          this.resources = this.add.group();
           this.builds = this.add.group();*/

        //NPCS//
        //TONI-PRUEBA
        const npcData = this.cache.json.get('prueba');
        this.toni = this.map.createFromObjects('objectLayer', { name: 'toni', classType: NPC, key: "npc1" });//create from objects siempre devuelve array
        this.toni[0].innit('toni', npcData, this.otter, this.minigamesInfo.WackAMole, 0.15, 0.25);
        //CLEON Y ROME
        const cleonRomeData = this.cache.json.get('cleonRome');
        this.Cleon = this.map.createFromObjects('objectLayer', { name: 'cleon', classType: NPC, key: "npc2" });//create from objects siempre devuelve array
        this.Cleon[0].innit('cleon&rome', cleonRomeData, this.otter, this.minigamesInfo.LightUpGhosts, 0.25, 0.25);
        //ISHMAEL
        const ishmaelData = this.cache.json.get('ishmael');
        this.Ishmael = this.map.createFromObjects('objectLayer', { name: 'ishmael', classType: NPC, key: "npc3" });
        this.Ishmael[0].innit('ismael', ishmaelData, this.otter, this.minigamesInfo.Puzzle, 0.15, 1);

        //RESOURCES//

        this.resources = this.map.createFromObjects('objectLayer', { name: 'resources', classType: Source, key: "resourcesGroup" })

        for (let i = 0; i < this.resources.length; i++) {
            let rnd = Phaser.Math.Between(1, 3)
            if (rnd === 1) {
                this.resources[i].innit('paint0', 1, 0, 0, 1, 1, 0, true);
            }
            else if (rnd === 2) {
                let rndTex = Phaser.Math.Between(0, 1);
                this.resources[i].innit('paper' + rndTex, 0, 2, 0, 1, 1);
            }
            else if (rnd === 3) {
                let rndTex = Phaser.Math.Between(0, 2);
                this.resources[i].innit('clay' + rndTex, 0, 0, 3, 1, 1);
            }

        }

        //BUILDS//
        /*
         this.builds = this.map.createFromObjects('objectLayer', { class: 'build', classType: Build, key: 'buildsGroup' })
         for (let i = 0; i < this.builds.length; i++) {
 
             if (this.builds[i].name === 'watermill') {
                 this.builds[i].innit('destroyedWatermill', 'watermill', 15, 20, 10, 1, 0, 'house_400_1000');
                console.log(this.builds + 'watermill');
             }
             else if (this.builds[i].name === 'fountain') {
                 this.builds[i].innit('destroyedFountain', 'fountain', 15, 20, 10, 1, 0, 'house_400_1000');
                   console.log(this.builds + 'fountain');
             }
             else if (this.builds[i].name === 'swings') {
                 this.builds[i].innit('destroyedSwings', 'swings', 15, 20, 10, 1, 0, 'house_400_1000');
                   console.log(this.builds + 'swings');
             }
              else if (this.builds[i].name === 'treehouse') {
                 this.builds[i].innit('destroyedTreehouse', 'treehouse', 15, 20, 10, 1, 0, 'house_400_1000');
                   console.log(this.builds + 'treehouse');
             }
             else{}
         }*/

        this.builds = [];

        this.watermill = this.map.createFromObjects('objectLayer', { name: 'watermill', classType: Build, key: 'build1' });
        this.watermill[0].innit('destroyedWatermill', 'watermill', 1, 1, 1, 1, 0, 'house_400_1000');
        this.builds.push(this.watermill[0]);

        this.fountain = this.map.createFromObjects('objectLayer', { name: 'fountain', classType: Build, key: 'build2' });
        this.fountain[0].innit('destroyedFountain', 'fountain', 1, 1, 1, 1, 0, 'house_400_1001');
        this.builds.push(this.fountain[0]);

        this.swings = this.map.createFromObjects('objectLayer', { name: 'swings', classType: Build, key: 'build3' });
        this.swings[0].innit('destroyedSwing', 'swing', 15, 20, 10, 1, 0, 'house_400_1002');
        this.builds.push(this.swings[0]);

        this.treehouse = this.map.createFromObjects('objectLayer', { name: 'treehouse', classType: Build, key: 'build4' });
        this.treehouse[0].innit('destroyedTreehouse', 'treehouse', 15, 20, 10, 1, 0, 'house_400_1003');
        this.builds.push(this.treehouse[0]);

        this.tent = this.map.createFromObjects('objectLayer', { name: 'camp', classType: Build, key: 'build4' });
        this.tent[0].innit('destroyedTent', 'tent', 5, 5, 5, 1, 0, 'house_400_1004');
        this.builds.push(this.tent[0]);
        
    }

    createMapCollisions() {


        this.paintRiver.setCollisionByExclusion([-1]);//colision con todo menos lo nulo
        this.obstaclesbottom.setCollisionByExclusion([-1]);
        this.obstaclestop.setCollisionByExclusion([-1])
        this.physics.add.collider(this.otter, this.paintRiver);
        this.physics.add.collider(this.otter, this.obstaclesbottom);
        this.physics.add.collider(this.otter, this.obstaclestop);
    }

    createAnims() {
        // === HUD ===
        // THE GAME 😃

        if (!this.anims.exists("otterIdleBack")) {
            this.anims.create({
                key: "otterIdleBack",
                frames: this.anims.generateFrameNumbers("otterBack", { start: 1, end: 1 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterIdleFront")) {
            this.anims.create({
                key: "otterIdleFront",
                frames: this.anims.generateFrameNumbers("otterFront", { start: 0, end: 0 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterIdleSide")) {
            this.anims.create({
                key: "otterIdleSide",
                frames: this.anims.generateFrameNumbers("otterSide", { start: 1, end: 1 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingBack")) {
            this.anims.create({
                key: "otterWalkingBack",
                frames: this.anims.generateFrameNumbers("otterBack", { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingFront")) {
            this.anims.create({
                key: "otterWalkingFront",
                frames: this.anims.generateFrameNumbers("otterFront", { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists("otterWalkingSide")) {
            this.anims.create({
                key: "otterWalkingSide",
                frames: this.anims.generateFrameNumbers("otterSide", { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    /* createSources() {
         this.sources = [];
         this.sources.push(new Source(this, 1200, 1200, 'paint', 0, 0, 1, 5));
     } 
     
     createBuilds() {
        this.builds = [];
        const house = new Build(this, 400, 1000, 'destroyedWatermill', 'watermill', 15, 20, 10, 1, 0, 'house_400_1000');
        this.builds.push(house);
    }
    */

    createHUD() {
        this.UIManager = new UIManager(this);
    }

    createNPCs() {
        const npcData = this.cache.json.get('prueba');
        this.Toni = new NPC(this, 900, 700, 'toni', npcData, this.otter, this.minigamesInfo.WackAMole, 0.15, 0.25);

        const cleonRomeData = this.cache.json.get('cleonRome');
        this.Cleon = new NPC(this, 1050, 700, 'cleon&rome', cleonRomeData, this.otter, this.minigamesInfo.LightUpGhosts, 0.25, 0.25);

        const ishmaelData = this.cache.json.get('ishmael');
        this.Ishmael = new NPC(this, 1250, 700, 'ismael', ishmaelData, this.otter, this.minigamesInfo.Puzzle, 0.15, 1);
    }

    nextDay() {
        this.currentDay = (this.currentDay || 1) + 1;
        this.fade = true;
        if (this.currentDay > 6) {
            console.log("final")
            GameDataManager.saveFrom(this);
        }
    }


}
