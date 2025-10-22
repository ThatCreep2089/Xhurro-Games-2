import HUDmessage from './HUDmessage.js'
export default class buildSourcesHUD extends HUDmessage {
    /**
     * @param {Scene} scene - escena en la que aparece
     * @param {sources} sources - recursos necesarios para construir
     * @param {boolean} enough - Suficientes recursos para reparar?
     */

    constructor(scene, texture, sources, enough, size = 1, frame) {

        super(scene, texture, size, frame);

        //HUD recursos necesarios para construir
        this.cont = this.scene.add.container(this.x - scene.textures.get(texture).getSourceImage().height/2*size, this.y - scene.textures.get(texture).getSourceImage().height/2 * size); //Contenedor para añadir imagenes junto a texto y tratarlos como un solo objeto

        //Declaramos todo el contenido del contenedor
        this.paintNumber = this.scene.add.text(0, 100*size, "Pintura: " + sources.paint,
             {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });
        this.paperNumber = this.scene.add.text(0, 250*size, "Papel: " + sources.paper,
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });
        this.clayNumber = this.scene.add.text(0, 400*size, "Arcilla: " + sources.clay,
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });

        if (enough)
        {
            this.key = this.scene.add.image(((scene.textures.get('spaceKey').getSourceImage().height/2) * 0.5* size) + 250 * size, 550*size,'spaceKey');
            this.key.setScale(size * 0.5);
            this.cont.add([this.paintNumber, this.paperNumber, this.clayNumber, this.key]);
        }
        else//Insertamos en el contenedor todo el contenido que queremos que aparezca, en orden
        this.cont.add([this.paintNumber, this.paperNumber, this.clayNumber]);

        this.cont.setScrollFactor(0);
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