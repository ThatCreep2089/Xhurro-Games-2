export default class HUDmessage extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     */

    constructor(scene, texture, size = 1, frame) {

        super(scene, scene.cameras.main.width/2,
        scene.cameras.main.height - scene.textures.get(texture).getSourceImage().height/2 * size,
        texture, frame = 0);

        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.


        //Hacemos que tanto el fondo como el contenedor no se muevan de la posición
        this.setScrollFactor(0);
    }

    /**
     * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
     * @param {number} t - Tiempo total
     * @param {number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        // Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
        super.preUpdate(t, dt);
    }
}