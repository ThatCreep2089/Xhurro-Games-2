export default class UIManager {

    constructor(scene, size = 1){
        this.event = new Phaser.Events.EventEmitter();
        this.size = size;
        this.scene = scene;
        this.interactMessage = null;
        this.buildData = null;
        this.minigameData = null;
        if (this.scene.scene.key == "mainScene") this.MainScene();
    }

    MainScene(){
        this.scene.add.existing(this); //Nos añadimos a la escena para ser mostrados.
        //inventario interno de materiales del jugador
        let backpack = this.scene.otter.backpack
        let cont = this.scene.add.container(0, 0);

        //Declaramos todo el contenido del contenedor
         let background = this.scene.add.image(0, 0, 'house');
         background.setScale(this.size)
         let paintNumber = this.scene.add.text(0, 70, "Pintura: " + backpack.paint,
            {
               fontFamily: 'bobFont',
               fontSize: 25 * this.size + 'px',
           });
         let paperNumber = this.scene.add.text(200*this.size, 70, "Papel: " + backpack.paper,
           {
               fontFamily: 'bobFont',
               fontSize: 25 * this.size + 'px',
           });
         let clayNumber = this.scene.add.text(350*this.size, 70, "Arcilla: " + backpack.clay,
           {
               fontFamily: 'bobFont',
               fontSize: 25 * this.size + 'px',
           })

        //HUD recursos en inventario
        cont.add([background, paintNumber, paperNumber, clayNumber])

        //Reposicionamos
        cont.setScrollFactor(0);
        background.setOrigin(0, 0.5); background.setDisplayOrigin(0, 0.5);
        paintNumber.setOrigin(0, 0.5); paintNumber.setDisplayOrigin(0, 0.5);
        paperNumber.setOrigin(0.5, 0.5); paperNumber.setDisplayOrigin(0.5, 0.5);
        clayNumber.setOrigin(1, 0.5); clayNumber.setDisplayOrigin(1, 0.5);

       //suscripción para actualizar inventario
       this.event.on('updateInventory', ()=>{
        paintNumber.setText("Pintura: " + backpack.paint);
        paperNumber.setText("Papel: " + backpack.paper);
        clayNumber.setText("Arcilla: " + backpack.clay);
       });
    }

    //Hace aparecer el mensaje de interacción
    appearInteractMessage(){
        this.interactMessage = this.scene.add.image(0, 0, 'spaceKey');
        this.interactMessage.setScale(this.size*0.3);
        this.interactMessage.setOrigin(0.5, 1); this.interactMessage.setPosition(this.scene.scale.width/2, this.scene.scale.height);

        this.interactMessage.setScrollFactor(0);
    }
    //Hace desaparecer el mensaje de interacción
    disappearInteractMessage(){
        if (this.interactMessage != null){
            this.interactMessage.destroy();
            this.interactMessage = null;
        }
    }

    appearBuildData(sources){
        //HUD recursos necesarios para construir
        let enough = this.scene.otter.backpack.paint >= sources.paint &&
        this.scene.otter.backpack.paper >= sources.paper &&
        this.scene.otter.backpack.clay >= sources.clay

        this.buildData = this.scene.add.container(this.scene.scale.width/2, this.scene.scale.height); //Contenedor para añadir imagenes junto a texto y tratarlos como un solo objeto

        //Declaramos todo el contenido del contenedor
        let background = this.scene.add.image(0, 0, 'buildSources');
        let size = this.size*0.3
        background.setScale(size);

        let paintNumber = this.scene.add.text(-100, -700*size, "Pintura: " + sources.paint,
             {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });
        let paperNumber = this.scene.add.text(-100, -550*size, "Papel: " + sources.paper,
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });
        let clayNumber = this.scene.add.text(-100, -400*size, "Arcilla: " + sources.clay,
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            });

        if (enough)
        {
            let key = this.scene.add.image(0 * size, -200*size,'spaceKey');
                key.setScale(size * 0.6);
            this.buildData.add([background, paintNumber, paperNumber, clayNumber, key]);
        }
        else//Insertamos en el contenedor todo el contenido que queremos que aparezca, en orden
        this.buildData.add([background, paintNumber, paperNumber, clayNumber]);

        this.buildData.setScrollFactor(0);

        //Reposicionamos
        background.setOrigin(0.5, 1);
    }

    disappearBuildData(){
        if (this.buildData != null){
            this.buildData.destroy();
            this.buildData = null;
        }
    }

    appearMinigameInfo(minigameInfo)
    {
        this.minigameData = this.scene.add.container(this.scene.scale.width/2, this.scene.scale.height/2);

        //Creamos toda la información de la pantalla
        let background = this.scene.add.image(0, 0, 'MGInfoBG').setOrigin(0.5, 0.5);
        background.setScale(this.size * 1.5)

        //Nombre de minijuego
        let name = this.scene.add.text(-395, -300, minigameInfo.name, {
            fontFamily: 'bobFont',
            fontSize: 50 * this.size + 'px',
            color: '#000000',
            wordWrap: { width: 400 }
        }).setOrigin(0,0);

        //Video
        let source = this.scene.add.video(0, 0, minigameInfo.src).play(true);
        source.setOrigin(0, 1);
        source.setScale(this.size * 0.8);

        //Descripción de minijuego
        let description = this.scene.add.text(-395, -200, minigameInfo.description, {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000',
            wordWrap: { width: 400 }
        }).setOrigin(0, 0);

        //Precio (costo de energías por jugar)
        let price = this.scene.add.text(-395, 90, "Precio: " + minigameInfo.price, {
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);

        //Recompensa de minijuego
        let reward = this.scene.add.text(-395, 125, "Recompensa: " + minigameInfo.reward.amountPerX + " cada " + minigameInfo.reward.X + " puntos",{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);

        //Botones
        let accept = this.scene.add.image(5, 200, 'acceptButton').setInteractive().setOrigin(0, 0).setScale(this.size * 0.25);
        let refuse = this.scene.add.image(-5, 200, 'refuseButton').setInteractive().setOrigin(1, 0).setScale(this.size * 0.2);

        this.minigameData.add([background, name, source, description, price, reward, accept, refuse]);
        this.minigameData.setScrollFactor(0);

        accept.on('pointerdown', ()=>{
            if (minigameInfo.name == 'Wack A Mole')
            {
                this.scene.scene.start('whackAMole');
            }
        });
        refuse.on('pointerdown', ()=>{
            this.disappearMinigameInfo();
        })
    }

    disappearMinigameInfo()
    {
        if (this.minigameData != null)
        {
            this.minigameData.destroy();
            this.minigameData = null;
        }
        this.scene.otter.canMove = true;
    }
}