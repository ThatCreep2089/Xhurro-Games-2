import GameDataManager from '../GameDataManager.js'
export default class UIManager {

    constructor(scene, size = 1, color = '#FFFFFF'){

        this.event = new Phaser.Events.EventEmitter();
        this.size = size;
        this.scene = scene;
        this.color = color;
        this.interactMessage = null;
        this.buildData = null;
        this.minigameData = {
            container: null,
            accept: null,
            refuse: null
        };
        
        this.HUDDepth = 5000;//profundidaz que no tendrá nunca ningún objeto dentro del mapa

        if (this.scene.scene.key === "mainScene") this.MainScene();
        else if (this.scene.scene.key === "whackAMole") {this.ScoreBar(); this.Timer();}
        else if (this.scene.scene.key === "lightUpGhosts") {this.ScoreBar(); this.Timer();}
        else if (this.scene.scene.key === "puzzle") {this.Timer();}
        
        //No aplicar, implicaría recolocar y ampliar objetos
        // === MAXIMIZE SCREEN ===
        
        //this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', () => {
        //    this.scene.scale.toggleFullscreen();
        //});

        //this.scene.scale.on('enterfullscreen', () => {
        //    // Calcula el factor mínimo de escala respecto a la resolución base
        //    const scaleFactor = Math.min(screen.width / 800, screen.height / 600);

        //    this.scene.scale.resize(800 * scaleFactor, 600 * scaleFactor);
        //    this.scene.cameras.main.setZoom(scaleFactor);
        //    this.scene.cameras.main.centerOn(800 / 2, 600 / 2);
        //});
        //this.scene.scale.on('leavefullscreen', () => {
        //    this.scene.scale.resize(800, 600);
        //    this.scene.cameras.main.setZoom(1);
        //    this.scene.cameras.main.centerOn(400, 300);
        //});

        //if (this.scene.scale.isFullscreen){
        //    const scaleFactor = Math.min(screen.width / 800, screen.height / 600);
        //    this.scene.cameras.main.setZoom(scaleFactor);
        //    this.scene.cameras.main.centerOn(800 / 2, 600 / 2);
        //}
    }

    MainScene(){
        //inventario interno de materiales del jugador
        let backpack = this.scene.otter.backpack
        let cont = this.scene.add.container(0, 0);

        //Declaramos todo el contenido del contenedor
        let background = this.scene.add.image(0, 0, 'backpack');
        background.setScale(this.size * 0.5)
        background.setDepth(this.HUDDepth);

        let paintImg = this.scene.add.image(20*this.size, 15, 'paintIcon').setScale(this.size*0.5).setDisplayOrigin(0.5,0.5);
        let paintNumber = this.scene.add.text(60*this.size, 20, "x" + backpack.paint,
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000'
        });

        let paperImg = this.scene.add.image(145*this.size, 11, 'paperIcon').setScale(this.size*0.5).setDisplayOrigin(0.5,0.5);
        let paperNumber = this.scene.add.text(185*this.size, 20, "x" + backpack.paper,
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000'
        });

        let clayImg = this.scene.add.image(260*this.size, 15, 'clayIcon').setScale(this.size*0.5).setDisplayOrigin(0.5,0.5);
        let clayNumber = this.scene.add.text(310*this.size, 20, "x" + backpack.clay,
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000'
        });

        //Estamina
        let staminaImg = this.scene.add.image(642*this.size, 20, 'stamina').setScale(this.size*0.5).setDisplayOrigin(0.5,0.5);
        let staminaNumber = this.scene.add.text(670*this.size, 20, "x" + this.scene.otter.getStamina(),
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000'
        });

        //Dia
        let dayImg = this.scene.add.image(718*this.size, 17, 'day').setScale(this.size*0.5).setDisplayOrigin(0.5,0.5);
        let dayNumber = this.scene.add.text(763*this.size, 20, (this.scene.currentDay || 1),
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
            color: '#000000'
        });

        //Evento que cambia imagen de icono de dia
        this.event.on('changeDayIcon', (icon) => {
            dayImg.setTexture(icon);
        });

        //HUD recursos en inventario
        cont.add([background,
            paintNumber, paintImg,
            paperNumber, paperImg,
            clayNumber, clayImg,
            staminaNumber, staminaImg,
            dayNumber, dayImg]);

        cont.setDepth(this.HUDDepth);
        

        //Reposicionamos
        cont.setScrollFactor(0);
        background.setDisplayOrigin(0, 0.5);
        paintNumber.setDisplayOrigin(0, 0.5);
        paperNumber.setDisplayOrigin(0, 0.5);
        clayNumber.setDisplayOrigin(0, 0.5);
        staminaNumber.setDisplayOrigin(0, 0.5);
        dayNumber.setDisplayOrigin(0, 0.5);

        //Warnings Recursos
        let paintReward = this.scene.add.text(paintNumber.x, paintNumber.y, "0",
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
        });

        let paperReward = this.scene.add.text(paperNumber.x, paperNumber.y, "0",
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
        });

        let clayReward = this.scene.add.text(clayNumber.x, clayNumber.y, "0",
        {
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
        });

        let staminaReward = this.scene.add.text(staminaNumber.x, staminaNumber.y, "0",
        {
            color: '#ff0000',
            fontFamily: 'bobFont',
            fontSize: 25 * this.size + 'px',
        });

        cont.add([paintReward, paperReward, clayReward, staminaReward]);
        cont.sendToBack(paintReward); cont.sendToBack(paperReward); cont.sendToBack(clayReward); cont.sendToBack(staminaReward);

        let bgPaint = this.scene.add.image(paintNumber.x + 20, paintNumber.y + 20, 'sourceWarning').setScale(0.5);
        let bgPaper = this.scene.add.image(paperNumber.x + 20, paperNumber.y + 20, 'sourceWarning').setScale(0.5);
        let bgClay = this.scene.add.image(clayNumber.x + 15, clayNumber.y + 20, 'sourceWarning').setScale(0.5);
        let bgStamina = this.scene.add.image(staminaNumber.x + 20, staminaNumber.y + 20, 'sourceWarning').setScale(0.5);

        cont.add([bgPaint, bgPaper, bgClay, bgStamina]);
        cont.sendToBack(bgPaint); cont.sendToBack(bgPaper); cont.sendToBack(bgClay); cont.sendToBack(bgStamina);

        let warningPaint = []; let warningPaper = []; let warningClay = []; let warningStamina = [];
        let accumulatedPaint = 0; let accumulatedPaper = 0; let accumulatedClay = 0; let accumulatedStamina = 0;

       //suscripción para actualizar inventario
       this.event.on('updateInventory', (sources, afterFade = false, appearWarning = true) => {

        let duration = 0;
        if (afterFade) duration = 4000;

        const cSources = {paint: sources.paint, paper: sources.paper, clay: sources.clay};
        const cAppearWarning = appearWarning;

        setTimeout(() => {
            if (paintNumber?.setText && paperNumber?.setText && clayNumber?.setText){

                paintNumber.setText("x" + backpack.paint);
                paperNumber.setText("x" + backpack.paper);
                clayNumber.setText("x" + backpack.clay);
    
                if (cAppearWarning){
                    //Activamos mensaje de recompensa por unos segundos
                    if (cSources.paint && cSources.paint != 0){
    
                        if (warningPaint.every(e => e.finished === true)){
                            accumulatedPaint = 0;
                            warningPaint = this.warningDown(bgPaint, 45, true);
                            this.warningDown(paintReward, 45, true);
                        }
                        else accumulatedPaint += cSources.paint;

                        let number = cSources.paint + accumulatedPaint;
                        if(number > 0){
                            paintReward.setColor('#008000');
                            paintReward.setText("+" + number);
                        }
                        else{
                            paintReward.setColor('#ff0000');
                            paintReward.setText(number);
                        }
                    }
    
                    if (cSources.paper && cSources.paper != 0){
                        if (warningPaper.every(e => e.finished === true)){
                            accumulatedPaper = 0;
                            warningPaper = this.warningDown(bgPaper, 45, true);
                            this.warningDown(paperReward, 45, true);
                        } else accumulatedPaper += cSources.paper;

                        let number = cSources.paper + accumulatedPaper;
                        if(number > 0){
                            paperReward.setColor("#008000");
                            paperReward.setText("+" + number);
                        }
                        else{
                            paperReward.setColor("#ff0000");
                            paperReward.setText(number);
                        }
                    }
    
                    if (cSources.clay && cSources.clay != 0){
                        if (warningClay.every(e => e.finished === true)){
                            accumulatedClay = 0;
                            warningClay = this.warningDown(bgClay, 45, true);
                            this.warningDown(clayReward, 45, true);
                        } else accumulatedClay += cSources.clay;

                        let number = cSources.clay + accumulatedClay;
                        if (number > 0){
                            clayReward.setColor('#008000');
                            clayReward.setText("+" + number);
                        }
                        else{
                            clayReward.setColor('#ff0000');
                            clayReward.setText(number);
                        }
                    }
                }
            }
        }, duration);
       });

       this.event.on('updateStamina', (amount)=>{

            if (amount != undefined){
                if (warningStamina.every(e => e.finished === true)){
                    accumulatedStamina = 0;
                    warningStamina = this.warningDown(bgStamina, 45, true);
                    this.warningDown(staminaReward, 45, true);
                } else accumulatedStamina += amount;

                let number = amount + accumulatedStamina;
                staminaReward.setText(number);
            }

            staminaNumber.setText("x" + this.scene.otter.getStamina());

            if (this.scene.otter.getStamina() > 75) this.event.emit('changeDayIcon', 'day');
            else if (this.scene.otter.getStamina() > 25) this.event.emit('changeDayIcon', 'afternoon');
            else this.event.emit('changeDayIcon', 'night')
        });

       this.event.on('updateDay', () => {
            dayNumber.setText((this.scene.currentDay || 1));
        });

        //popUp interaction
        this.interactMessage = this.scene.add.image(this.scene.scale.width/2, this.scene.scale.height + 100, 'spaceKey');
        this.interactMessage.setScale(this.size*0.5);
        this.interactMessage.setOrigin(0.5, 1);

        this.interactMessage.setScrollFactor(0);
        this.interactMessage.setDepth(this.HUDDepth);

        //PopUp builds
        this.buildData = this.scene.add.container(this.scene.scale.width/2, this.scene.scale.height + 500); //Contenedor para añadir imagenes junto a texto y tratarlos como un solo objeto

        //Declaramos todo el contenido del contenedor
        let backgroundB = this.scene.add.image(0, 0, 'buildSources');
        let size = this.size*0.3;
        backgroundB.setScale(this.size * 0.5);
        backgroundB.setDepth(this.HUDDepth);

        
        let paintNumberB = this.scene.add.text(-15, -600*size, "Pintura: ",
             {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            }).setOrigin(0, 0.5);
        paintNumberB.name = "paintNumberB"
        let paintImgB = this.scene.add.image(paintNumberB.x - 20, paintNumberB.y, 'paintIcon').setScale(0.5);

        let paperNumberB = this.scene.add.text(-15, -450*size, "Papel: ",
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            }).setOrigin(0, 0.5);
        paperNumberB.name = "paperNumberB"
        let paperImgB = this.scene.add.image(paperNumberB.x - 20, paperNumberB.y, 'paperIcon').setScale(0.5);

        let clayNumberB = this.scene.add.text(-15, -300*size, "Arcilla: ",
            {
                fontFamily: 'bobFont',
                fontSize: 100 * size + 'px',
                color: '#000000'
            }).setOrigin(0, 0.5);
        clayNumberB.name = "clayNumberB"
        let clayImgB = this.scene.add.image(clayNumberB.x - 22, clayNumberB.y, 'clayIcon').setScale(0.5);

        let key = this.scene.add.image(0 * size, -165*size,'spaceKey').setScale(size);
        key.name = "key"
        this.buildData.add([backgroundB, paintNumberB, paperNumberB, clayNumberB, key, paintImgB, paperImgB, clayImgB]);

        this.buildData.setScrollFactor(0);
        this.buildData.setDepth(this.HUDDepth);

        //Reposicionamos
        backgroundB.setOrigin(0.5, 1);

        //notEnoughStamina
        this.warning = this.scene.add.image(this.scene.scale.width/2, this.scene.scale.height+500, 'notEnoughStamina')
        .setScale(this.size*0.5)
        .setOrigin(0.5, 1)
        .setScrollFactor(0)
        .setDepth(this.HUDDepth + 1);
        this.warningT = [];
    }

    warningDown(msg, amount, exitAtEnd = false, duration = 500, exitAtEndSFX = false){
        let t = this.scene.tweens.add({
            targets: msg,
            y: msg.y + amount,
            ease: 'Back.easeOut',
            duration: duration,
            onComplete: () => t.finished = true
        });
        t.finished = false;

        let t2;
        if (exitAtEnd) {
            t2 = this.warningUp(msg, 0, duration);
            t.once('complete', () => {if(exitAtEndSFX)this.scene.sound.add('disappearWarningSFX', {volume: 5}).play(); t2.play()});
        }

        t.play();

        //Solo Dios y yo sabemos por qué he hecho esto
        //Y a mi se me está empezando a olvidar...
        if (exitAtEnd) {
            return [t, t2];
        }
        else return [t];
    }

    warningUp (msg, amount, duration = 500){
        let t = this.scene.tweens.add({
            targets: msg,
            y: msg.y + amount,
            ease: 'Quint.easeIn',
            duration: duration,
            paused: true,
            onComplete: () => t.finished = true
        });
        t.finished = false
        return t;
    }

    ScoreBar(){
        let scoreText = this.scene.add.text(16, 16, 'Puntos: 0', { fontFamily: 'bobFont', fontSize: '32px', fill: this.color });

        this.event.on('changeScore', (score)=> {
            scoreText.setText('Puntos: ' + score);
        })

        scoreText.setDepth(this.HUDDepth);
    }

    Timer(){
        let timerText = this.scene.add.text(600, 16, 'Tiempo: 10', { fontFamily: 'bobFont', fontSize: '32px', fill: this.color });

        this.event.on('changeTimer', (time) =>{
            timerText.setText('Tiempo: ' + time);
        })

        timerText.setDepth(this.HUDDepth);
    }

    //Hace aparecer el mensaje de interacción
    appearInteractMessage(){
        this.scene.sound.add('appearWarningSFX', {volume: 8}).play();
        this.warningDown(this.interactMessage, this.scene.scale.height - this.interactMessage.y);
    }

    //Hace desaparecer el mensaje de interacción
    disappearInteractMessage(){
        this.scene.sound.add('disappearWarningSFX', {volume: 5}).play();
        this.warningUp(this.interactMessage, (this.scene.scale.height + 100) - this.interactMessage.y).play();
    }

    appearBuildData(sources){
        this.scene.sound.add('appearWarningSFX', {volume: 8}).play();
        //HUD recursos necesarios para construir
        let enough = this.scene.otter.backpack.paint >= sources.paint &&
        this.scene.otter.backpack.paper >= sources.paper &&
        this.scene.otter.backpack.clay >= sources.clay

        if (enough) this.buildData.getByName("key").setVisible(true);
        else this.buildData.getByName("key").setVisible(false);

        this.buildData.getByName("paintNumberB").setText("x" + sources.paint + " (" + this.scene.otter.backpack.paint + ")");
        this.buildData.getByName("paperNumberB").setText("x" + sources.paper + " (" + this.scene.otter.backpack.paper + ")");
        this.buildData.getByName("clayNumberB").setText("x" + sources.clay + " (" + this.scene.otter.backpack.clay + ")");

        this.warningDown(this.buildData, this.scene.scale.height - this.buildData.y);
    }

    disappearBuildData(){
        this.scene.sound.add('disappearWarningSFX', {volume: 5}).play();
        this.warningUp(this.buildData, (this.scene.scale.height + 500) - this.buildData.y).play();
    }

    appearMinigameInfo(minigameInfo)
    {
        this.minigameData.container = this.scene.add.container(this.scene.scale.width/2, 0);

        //Creamos toda la información de la pantalla
        let background = this.scene.add.image(0, (this.scene.scale.height/2) - 600, 'MGInfoBG').setOrigin(0.5, 0);
        background.setScale(this.size * 0.5);
        background.setDepth(this.HUDDepth);

        //Nombre de minijuego
        let name = this.scene.add.text(-200, -252, minigameInfo.name, {
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000',
            wordWrap: { width: 400 }
        }).setOrigin(0.5,0.5);

        //Video
        let source = this.scene.add.video(200, -145, minigameInfo.src);
        source.setMute(true);
        source.play(true);
        source.setOrigin(0.5, 0.5);
        source.setScale(this.size * 0.4);

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
        let priceImg = this.scene.add.image(price.x + 160, price.y, 'stamina').setOrigin(0,0).setScale(0.5);
        let stamina = this.scene.add.text(priceImg.x + 30, priceImg.y, "(" + this.scene.otter.getStamina() + ")", {
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);

        //Recompensa de minijuego
        let icon;
        let reward_;
        if (minigameInfo.reward.amountPerX.paint != 0){ icon = 'paintIcon'; reward_= minigameInfo.reward.amountPerX.paint;}
        else if (minigameInfo.reward.amountPerX.paper != 0) {icon = 'paperIcon'; reward_= minigameInfo.reward.amountPerX.paper;}
        else {icon = 'clayIcon'; reward_= minigameInfo.reward.amountPerX.clay;}

        let recompensa = this.scene.add.text(-395, 125, "Recompensa: ",{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);

        let reward = this.scene.add.text(recompensa.x + 250, recompensa.y, "x" + reward_,{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);

        let puntos = this.scene.add.text(recompensa.x + 300, recompensa.y, " cada " + minigameInfo.reward.X + " puntos",{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0);
        
        let rewardImg = this.scene.add.image(recompensa.x + 200, recompensa.y, icon).setScale(0.5).setOrigin(0, 0);

        //Botones
        this.minigameData.accept = this.scene.add.image(450, -50, 'acceptButton').setInteractive().setOrigin(0, 1).setScale(this.size * 0.5);
        const acceptDataOriginalScaleX = this.minigameData.accept.scaleX;
        const acceptOriginalScaleY = this.minigameData.accept.scaleY;

        this.minigameData.refuse = this.scene.add.image(250, -50, 'refuseButton').setInteractive().setOrigin(0, 1).setScale(this.size * 0.5);
        const refuseDataOriginalScaleX = this.minigameData.refuse.scaleX;
        const refuseDataOriginalScaleY = this.minigameData.refuse.scaleY;


        this.minigameData.accept.on('pointerover', () => {
            this.minigameData.accept.setTexture('acceptButtonHover');

            this.acceptTween = this.scene.tweens.add({
                targets: this.minigameData.accept,
                scaleX: this.minigameData.accept.scaleX * 1.05, // expansión horizontal ligera
                scaleY: this.minigameData.accept.scaleY * 1.05, // expansión vertical ligera
                duration: 400,            // tiempo de expansión
                yoyo: true,                // vuelve al tamaño original
                repeat: -1,                // repetir infinitamente
                ease: 'Sine.easeInOut'     // movimiento suave
            });
        });
        this.minigameData.accept.on('pointerout', () => {
            
            this.minigameData.accept.setTexture('acceptButton');
            this.acceptTween.stop()
            this.minigameData.accept.setScale(acceptDataOriginalScaleX,acceptOriginalScaleY)
        });

        this.minigameData.refuse.on('pointerover', () => {
            this.minigameData.refuse.setTexture('refuseButtonHover');

            this.refuseTween = this.scene.tweens.add({
                targets: this.minigameData.refuse,
                scaleX: this.minigameData.refuse.scaleX * 1.05, // expansión horizontal ligera
                scaleY: this.minigameData.refuse.scaleY * 1.05, // expansión vertical ligera
                duration: 400,            // tiempo de expansión
                yoyo: true,                // vuelve al tamaño original
                repeat: -1,                // repetir infinitamente
                ease: 'Sine.easeInOut'     // movimiento suave
            });
        });
        this.minigameData.refuse.on('pointerout', () => {
            this.minigameData.refuse.setTexture('refuseButton');
            this.refuseTween.stop()
            this.minigameData.refuse.setScale(refuseDataOriginalScaleX,refuseDataOriginalScaleY)
        });


        this.minigameData.container.add([background, name, source, description, price, priceImg, reward, recompensa, puntos, rewardImg, stamina]);
        this.minigameData.container.setScrollFactor(0);
        this.minigameData.accept.setScrollFactor(0);
        this.minigameData.refuse.setScrollFactor(0);

        this.minigameData.container.setDepth(this.HUDDepth);
        this.minigameData.accept.setDepth(this.HUDDepth);
        this.minigameData.refuse.setDepth(this.HUDDepth);

        this.minigameData.accept.on('pointerdown', ()=>{
            this.scene.sound.add('acceptSFX').play();
            const otter = this.scene.otter;
            const price = minigameInfo.price;

            if (price <= otter.getStamina()) {
                this.event.emit("minigame:accepted");
                
                // Restar estamina
                otter.decreaseStaminaAmount(price);
                this.event.emit("updateStamina", price);

                // Guardar datos antes de cambiar de escena
                import("../GameDataManager.js").then(module => {
                    const GameDataManager = module.default;
                    GameDataManager.saveFrom(this.scene);

                    // Cambiar a la escena del minijuego
                    if (minigameInfo.name === 'Whack A Mole') {
                        this.scene.scene.start('whackAMoleBall');
                    }else
                    if (minigameInfo.name === 'Ilumina a \n los fantasmas'){
                        this.scene.scene.start('lightUpGhosts');
                    }else
                    if(minigameInfo.name === 'Puzle'){
                        this.scene.scene.start('puzzle')
                    }
                });
            } else {
                this.appearNotEnoughStamina();
            }
        });
        this.pressed = false;
        this.minigameData.refuse.on('pointerdown', ()=>{
            this.scene.sound.add('refuseSFX').play();
            if (!this.pressed){
                this.pressed = true;
                this.disappearMinigameInfo();
                this.event.emit("minigame:rejected");
            }
            
        })

        this.warningDown(this.minigameData.container, (this.scene.scale.height/2) - this.minigameData.container.y, false, 1000);
        this.warningDown(this.minigameData.accept, (600) - this.minigameData.accept.y, false, 1000);
        this.warningDown(this.minigameData.refuse, (600) - this.minigameData.refuse.y, false, 1000);
    }

    disappearMinigameInfo()
    {
        if (this.minigameData.container != null){
            let t = this.warningUp(this.minigameData.container, ((this.scene.scale.height/2) - 600) - this.minigameData.container.y, 1000).play();
            t.once('complete', () => {
                if (this.minigameData.container != null){
                    this.minigameData.container.destroy();
                    this.minigameData.container = null;
                }
            });
        }

        if (this.minigameData.accept != null){
            let t = this.warningUp(this.minigameData.accept, -50 - this.minigameData.accept.y, 1000).play();
            t.once('complete', () => {
                if (this.minigameData.accept != null){
                    this.minigameData.accept.destroy();
                    this.minigameData.accept = null;
                }
            });
        }
        
        if (this.minigameData.refuse != null){
            let t = this.warningUp(this.minigameData.refuse, -50 - this.minigameData.refuse.y, 1000).play();
            t.once('complete', () => {
                if (this.minigameData.refuse != null){
                    this.minigameData.refuse.destroy();
                    this.minigameData.refuse = null;
                }
            });
        }

        if (this.scene.otter){
            this.scene.otter.canMove = true;
        }

        if (this.event) {
            this.event.emit('minigame:closed');
        }
    }

    appearNotEnoughStamina()
    {
        this.scene.sound.add('appearWarningSFX', {volume: 8}).play();
        if (this.warningT.every(e => e.finished === true)){
            this.warningT = this.warningDown(this.warning, this.scene.scale.height - this.warning.y, true, 750, true);
        }
    }

    appearMinigameEndInfo(scene, reward, mgName, mgImage)
    {
        let reward_;
        let icon;

        if (mgName === "Whack A Mole"){
            reward_ = reward.paint;
            icon = 'paintIcon';
        } else if (mgName === "Ilumina a \n los fantasmas") {
            reward_ = reward.clay;
            icon = 'clayIcon';
        } else {
            reward_ = reward.paper;
            icon = 'paperIcon';
        }

        //Creamos toda la información de la pantalla
        let background = this.scene.add.image(this.scene.scale.width/2, this.scene.scale.height/2, 'MGInfoBG').setOrigin(0.5, 0.5);
        background.setScale(this.size * 0.5);
        background.setDepth(this.HUDDepth);

        //Nombre del minijuego
        let name = this.scene.add.text(this.scene.scale.width/2 - 200, this.scene.scale.height/2 - 255, mgName, {
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000',
            wordWrap: { width: 400 }
        }).setOrigin(0.5,0.5);

        //ImagenPizarra
        let image = this.scene.add.image(this.scene.scale.width/2 + 200, this.scene.scale.height/4 + 10, mgImage).setOrigin(0.5, 0.5).setScale(0.5);
        //Recompensa de minijuego
        let rewardImg = this.scene.add.image(this.scene.scale.width/2 - 170 , this.scene.scale.height/2 - 75, icon);

        let recompensa = this.scene.add.text(rewardImg.x - 20, rewardImg.y, "Recompensa: ",{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(1, 0.5)

        let rewardText = this.scene.add.text(rewardImg.x + 25, rewardImg.y, "x" + reward_,{
            fontFamily: 'bobFont',
            fontSize: 35 * this.size + 'px',
            color: '#000000'
        }).setOrigin(0, 0.5);

        //Botones
        this.continu3 = this.scene.add.image(this.scene.scale.width/2, this.scene.scale.height, 'acceptButton').setInteractive().setOrigin(0.5, 1).setScale(this.size * 0.5);
        const continue3OriginalScaleX = this.continu3.scaleX;
        const continue3OriginalScaleY = this.continu3.scaleY;
        this.continu3.on('pointerover', () => {
            this.continu3.setTexture('acceptButtonHover');
            this.continue = this.scene.tweens.add({
                targets: this.continu3,
                scaleX: this.continu3.scaleX * 1.05, // expansión horizontal ligera
                scaleY: this.continu3.scaleY * 1.05, // expansión vertical ligera
                duration: 400,            // tiempo de expansión
                yoyo: true,                // vuelve al tamaño original
                repeat: -1,                // repetir infinitamente
                ease: 'Sine.easeInOut'     // movimiento suave
            });
        });
        this.continu3.on('pointerout', () => {
            this.continu3.setTexture('acceptButton');
            this.continue.stop()
            this.continu3.setScale( continue3OriginalScaleX,continue3OriginalScaleY)
        });

        background.setScrollFactor(0);
        recompensa.setScrollFactor(0);
        rewardText.setScrollFactor(0);
        rewardImg.setScrollFactor(0).setScale(0.5*this.size);
        this.continu3.setScrollFactor(0);
        name.setScrollFactor(0);
        image.setScrollFactor(0);

        background.setDepth(this.HUDDepth);
        recompensa.setDepth(this.HUDDepth);
        rewardText.setDepth(this.HUDDepth);
        rewardImg.setDepth(this.HUDDepth);
        this.continu3.setDepth(this.HUDDepth);
        name.setDepth(this.HUDDepth);
        image.setDepth(this.HUDDepth);

        this.continu3.on('pointerdown', ()=>{
            this.scene.sound.add('acceptSFX').play();
            this.scene.music.stop();
            scene.finishGame();
        });
    }

    FadeIn(){
        const cam = this.scene.cameras.main;
        const mainScene = this.scene.scene.get('mainScene');

        this.scene.sound.add('changingDaySFX', {volume: 5,}).play();

        let rect = this.scene.add.rectangle(cam.width/2, cam.height/2, cam.width, cam.height, 0x000000); rect.alpha = 0;
        let text = this.scene.add.text(cam.width/2, cam.height/2, "DÍA " + mainScene.currentDay,{
            fontFamily: 'bobFont',
            fontSize: 200 * this.size + 'px',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5); text.alpha = 0;

        rect.setScrollFactor(0);
        text.setScrollFactor(0);
        rect.setDepth(this.HUDDepth);
        text.setDepth(this.HUDDepth);

        //Animación de Fade
        let t = this.scene.tweens.add({
            targets: [rect, text],
            alpha: 1,
            ease: 'Expo.easeOut',
            duration: 4000,
        });
        
        t.once('complete', () => {
            const ending = GameDataManager.getEnding(6, 4); //6 dias y 4 construcciones
            if (ending === "good") this.scene.scene.start('ending', { good: true });
            else if (ending === "bad") this.scene.scene.start('ending', { good: false });
            else this.scene.scene.start('mainScene');
        });
        t.play();
    }

    FadeOut(){
        const cam = this.scene.cameras.main;
        const mainScene = this.scene.scene.get('mainScene');
        mainScene.otter.canMove = false;

        let rect = this.scene.add.rectangle(cam.width/2, cam.height/2, cam.width, cam.height, 0x000000); rect.alpha = 1;
        let text = this.scene.add.text(cam.width/2, cam.height/2, "DÍA " + mainScene.currentDay,{
            fontFamily: 'bobFont',
            fontSize: 200 * this.size + 'px',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5); text.alpha = 1;

        rect.setScrollFactor(0);
        text.setScrollFactor(0);
        rect.setDepth(this.HUDDepth);
        text.setDepth(this.HUDDepth);

        //Animación de Fade
        let t = this.scene.tweens.add({
            targets: [rect, text],
            alpha: 0,
            ease: 'Expo.easeIn',
            duration: 4000,
        });
        t.play();
        t.once('complete', ()=>{
            mainScene.otter.canMove = true;
        });
    }
}