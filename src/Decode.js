import Dialog from "./dialog_plugin.js"
export default class Decode{
    constructor(scene,datos,sound){
        this.datos = datos;
        this.scene = scene;
        this.sound = sound;
        this.node  = this._findId(this.datos.RootNodeID);
    }
    _findId(idToLookFor) {
        var array = this.datos.ListNodes;
        for (var i = 0; i < array.length; i++) {
            if (array[i].ID == idToLookFor) {
                return(array[i]);
            }
        }
    }
    decode(){
        this.node = this._findId(this.node.NextID);
        if(this.node.$type === "NodeSentence"){
            let color;
            if(this.node.SpeakerID == 0){
                this.scene.showSprite('gato');
                color = 0x1d7ba1;
            }
            else if(this.node.SpeakerID == 1){
                this.scene.showSprite('melchor');
                color = 0xba6e16;
            }
            else{
                this.scene.showSprite('');
                color = 0x808080;
            }
            this.dialog = new DialogText(this.scene, {
                borderThickness: 4,
                borderColor: color,
                borderAlpha: 1,
                windowAlpha: 0.6,
                windowColor: color,
                windowHeight: 100,
                padding: 16,
                closeBtnColor: 'white',
                dialogSpeed: 4,
                fontSize: 24,
                fontFamily: "pixel",
                fontColor: 'white'
            });
            this.dialog.setText(this.node.Sentence, true);
        } 
        else if(this.node.$type === "NodeEnd"){
            //this.scene.start("Minigame");
        }     
    }
}