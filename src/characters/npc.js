export default class NPC extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,value){
        super(scene,x,y,texture);
        this.scene.add.existing(this);
        scene.physics.add.existing(this,true);
        scene.physics.add.collider(this);
        this.val = value;
    }
    preUpdate(t,dt){
        super.preUpdate(t,dt);
    }
}