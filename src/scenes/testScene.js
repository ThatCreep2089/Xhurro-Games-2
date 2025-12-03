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
       this.createMap;
  
        // === CONTROLES ===
       // this.#inputs = {
       //     spaceKey: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
       //     keyW: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
       //     keyA: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
       //     keyS: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
       //     keyD: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
       // };
//
       // const inputStates = () => ({
       //     isDown: false,
       //     isUp: true,
       //     justDown: false,
       //     justUp: false
       // });
//
       // this.spaceKey = inputStates();
       // this.keyW = inputStates();
       // this.keyA = inputStates();
       // this.keyS = inputStates();
       // this.keyD = inputStates();
//
       // for (const key in this.#inputs) {
       //     this.#inputs[key].on('down', () => {
       //         this[key].isDown = true;
       //         this[key].isUp = false;
       //         this[key].justDown = true;
       //     });
       //     this.#inputs[key].on('up', () => {
       //         this[key].isDown = false;
       //         this[key].isUp = true;
       //         this[key].justUp = true;
       //     });
       // }

       // // === MINIJUEGOS_INFO ===
       // this.minigamesInfo = {
       //     WackAMole:{
       //         name: "Wack A Mole",
       //         description: "Aplasta a los topos haciendo clic sobre ellos...",
       //         src: 'WAMVideo',
       //         price: 25,
       //         reward: { amountPerX:2, X: 10 }
       //     }
       //     // ...otros minijuegos
       // };
//
       // // === JUGADOR (Nutria) ===
       // this.otter = new Otter(this, this.scale.width / 2, this.scale.height / 2, 20, 'otter', 0.2);
       // this.cameras.main.startFollow(this.otter);
       // this.navi = new Navi(this, this.otter, -30, 0, 'otter', 0.15, 300);

    
    }

    update() {
     //   // Si la estamina llega a 0, pasar al siguiente día
     //   if (this.otter.getStamina() <= 0 && !this.dayChanging) {
     //       this.dayChanging = true;
     //       this.nextDay();
     //   }
//
     //   // Resetear justDown / justUp
     //   let inputs = [this.spaceKey, this.keyW, this.keyA, this.keyS, this.keyD];
     //   for (const key in inputs) {
     //       inputs[key].justDown = false;
     //       inputs[key].justUp = false;
     //   }
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
        let npcGroup = this.add.group();
        npcGroup.addMultiple(npcs);
        
    }

}
