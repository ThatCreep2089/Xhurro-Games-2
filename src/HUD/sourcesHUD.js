export default class sourcesHUD extends Phaser.GameObjects.Sprite {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {backpack} backpack - se trata del inventario que va a mostrar
     */
    constructor(scene, backpack, size = 1, frame) {
        super(scene, scene.textures.get('house').getSourceImage().width/2,
        scene.textures.get('house').getSourceImage().height/2,
        'house', frame = 0);

        this.setScale(size);
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.

        //inventario interno de materiales del jugador
        this.backpack = backpack;

        //HUD recursos en inventario
        this.cont = this.scene.add.container(this.x, this.y); //Contenedor para añadir imagenes junto a texto y tratarlos como un solo objeto

        //Declaramos todo el contenido del contenedor
        this.paintNumber = this.scene.add.text(0, 0, "Pintura: " + this.backpack.paint,
             {
                fontFamily: 'bobFont',
                fontSize: 25 * size + 'px',
            });
        this.paperNumber = this.scene.add.text(170*size, 0, "Papel: " + this.backpack.paper,
            {
                fontFamily: 'bobFont',
                fontSize: 25 * size + 'px',
            });
        this.clayNumber = this.scene.add.text(300*size, 0, "Arcilla: " + this.backpack.clay,
            {
                fontFamily: 'bobFont',
                fontSize: 25 * size + 'px',
            });

        //Insertamos en el contenedor todo el contenido que queremos que aparezca, en orden
        this.cont.add([this.paintNumber, this.paperNumber, this.clayNumber]);

        //Hacemos que tanto el fondo como el contenedor no se muevan de la posición
        this.setScrollFactor(0);
        this.cont.setScrollFactor(0);
    }

    updateInventory()
    {
        this.paintNumber.setText("Pintura: " + this.backpack.paint);
        this.paperNumber.setText("Papel: " + this.backpack.paper);
        this.clayNumber.setText("Arcilla: " + this.backpack.clay);
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