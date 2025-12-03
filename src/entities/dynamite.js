import Mole from './mole.js';
export default class Dynamite extends Mole {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setTexture('dinamita');
    }

    hit() {
        this.scene.updateScore(-15);
        //console.log('Dynamite hit! Score decreased.');
        this.hide();
    }
}
