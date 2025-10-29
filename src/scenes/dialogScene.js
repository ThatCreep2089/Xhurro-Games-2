import Decode from "../Decode.js";
export default class DialogScene extends Phaser.Scene{
    constructor(){
        super({key: "Dialog"});
    }
    init(character){
        this.IDCharacter = character;
        this.first = true;
    }
    preload(){
        if(this.first){
            this.first = false;
        }
        //this.decoder = new Decode(this,)
        this.events.on('next',() => {this.decoder.decode()});
    }
    showSprite(sprite){
        if(sprite == 'otter') {

        }
        else if(sprite == 'toni'){

        }
        else{

        }
    }
}