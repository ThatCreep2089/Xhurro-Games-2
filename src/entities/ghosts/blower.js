export default class starer extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'topo');
        this.scene = scene;

        this.punish = -5; //Castigo por iluminar

        scene.add.existing(this);
        this.setScale(0.4);
        //factor de reducción de radio e intensidad
        this.factor = 0.3;
        this.effectDuration = 5; //Seg

        //Cada vez que se mueve el cursor se actualiza la info sobre su radio y distancia de él
        this.scene.event.on('movingLight', (position) => {
            this.light = position;
            let maxDistance = position.radius/2;
            let lightDistance = Phaser.Math.Distance.Between(position.x, position.y, this.x, this.y);

            if(lightDistance < maxDistance && this.active) {
                this.hited();
            }
        });
    }

    hited() {
         //Este fantasma desaparece en el primer hit y reduce el radio e intensidad de la antorcha durante unos segundos
         this.light.radius -= this.scene.radius * this.factor;
         this.light.intensity -= this.scene.intensity * this.factor;

         this.scene.time.delayedCall(this.effectDuration*1000, ()=>{
            this.light.radius += this.scene.radius * this.factor;
            this.light.intensity += this.scene.intensity * this.factor;
         });

         //desativar objeto de pool
         this.scene.event.emit('hideGhost', this, this.punish);
    }
}