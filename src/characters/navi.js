export default class Navi extends Phaser.GameObjects.Sprite{
    constructor(scene, target, offset, texture, size,speed) {
        super(scene, target.x, target.y, texture);
        this.scene = scene;
        this.target = target;
        this.offset = offset;
        this.speed = speed; // velocidad de seguimiento

        scene.add.existing(this);  
        scene.physics.add.existing(this);  
        this.setScale(size);  
        this.body.setAllowGravity(false);  
        this.body.setCollideWorldBounds(true);  

        // Oscilación vertical
        this.oscillationAmplitude = 30;  
        this.oscillationSpeed = 0.003;  
        this.oscillationTime = 0;
    }
    preUpdate(t, dt) {  
        super.preUpdate(t, dt);  

        // === Movimiento hacia Otter ===  
        const dx = this.target.x - this.x;  
        const dy = this.target.y - this.y;  
        const distance = Math.sqrt(dx*dx + dy*dy);  

        let followVelX = 0;  
        let followVelY = 0;  

        if (distance > this.offset) {  
            const dirX = dx / distance;  
            const dirY = dy / distance;  
            followVelX = dirX * this.speed * dt;  
            followVelY = dirY * this.speed * dt;  
        }  

        // === Oscilación vertical ===  
        this.oscillationTime += dt;  
        const oscVelY = this.oscillationAmplitude * Math.sin(this.oscillationSpeed * this.oscillationTime);  

        // Combinamos seguimiento y oscilación vertical  
        this.body.setVelocityX(followVelX);  
        this.body.setVelocityY(followVelY + oscVelY);  

        // Ajustar profundidad  
        this.setDepth(this.y + 100);  
    }    
}