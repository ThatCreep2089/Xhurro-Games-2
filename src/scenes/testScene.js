import Otter from "../characters/otter.js";
import Source from "../gameObjects/source.js";
import Build from "../gameObjects/build.js";
import NPC from "../characters/npc.js";
import UIManager from "../HUD/UIManager.js";
import GameDataManager from "../GameDataManager.js";
import Navi from "../characters/navi.js";

export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'testScene' });
    }

    #inputs;

    create() {
       
        // === MAPA ===
      // this.createMap();
         	this.map = this.make.tilemap({ 
			key: 'tilemap', 
			tileWidth: 10, 
			tileHeight: 10 
		});
        
         const tiles = this.map.addTilesetImage( "afshtsj-export", 'tiles');
		 this.groundLayer = this.map.createLayer ('floor', tiles);
         this.wallLayer= this.map.createLayer ('wall',tiles);
         this.wallLayer.setCollision(145); 
         //this.map = this.add.tilemap("tilemap")
        this.setPositionsMap();

        this.physics.world.setBounds(0, 0, 1000, 1000);
        this.cameras.main.setBounds(0, 0, 1000, 1000);
        // === CONTROLES ===
        this.#inputs = {
            spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
           keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
           keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
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
           WackAMole:{
               name: "Wack A Mole",
               description: "Aplasta a los topos haciendo clic sobre ellos...",
               src: 'WAMVideo',
               price: 25,
               reward: { amountPerX:2, X: 10 }
           }
           // ...otros minijuegos
       };
//
       // // === JUGADOR (Nutria) ===
        this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 20, 'otter', 0.2);
        this.cameras.main.startFollow(this.otter);
        this.navi = new Navi(this, this.otter, -30, 0, 'otter', 0.15, 300);

     this.physics.add.collider(this.otter, this.wallLayer);
    }

    update() {
     //   // Si la estamina llega a 0, pasar al siguiente día
     //   if (this.otter.getStamina() <= 0 && !this.dayChanging) {
     //       this.dayChanging = true;
     //       this.nextDay();
     //   }
        // Resetear justDown / justUp
        let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
        for (const key in inputs) {
           inputs[key].justDown = false;
            inputs[key].justUp = false;
        }
    }


    createMap(){
       const map = this.add.tilemap("tilemap")
      
        const tiles = this.map.addTilesetImage( "afshtsj", 'tiles');
		this.groundLayer= this.map.createLayer ('Capa de patrones 1',tiles);
      this.wallLayer= this.map.createLayer ('Capa de patrones 2',tiles);
      this.wallLayer.setCollision(14); 
        this.physics.add.collider(this.otter, this.wallLayer);
    }

    setPositionsMap(){
        
        
        const objLayer = this.map.getObjectLayer("Capa de Objetos 1");

        objLayer.objects.forEach(obj => {
        if (obj.type === "npc") {
           const npcData = this.cache.json.get('prueba');
                   this.Toni = new NPC(this, 900, 700, 'toni', npcData, this.otter, this.minigamesInfo.WackAMole);
           
        }

        if (obj.type === "source") {
             new Source(this, 1200, 1200, 'paint', 0, 0, 1, 5);
        }

        if (obj.type === "build") {
                    this.builds = [];
                   const house = new Build(this, 400, 1000, 'destroyedHouse', 'house', 0, 0, 3, 1, 0, 'house_400_1000');
                   this.builds.push(house);
        }
    });
    }

}
