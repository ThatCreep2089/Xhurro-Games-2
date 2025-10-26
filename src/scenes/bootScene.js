export default class Boot extends Phaser.Scene{
    constructor(){
        super({key: 'boot'});
    }
    init(){
      this.first = true;
    }
    preload(){

      this.cameras.main.setBackgroundColor('#1a1a1a');
      // Texto "Cargando..."
        const loadingText = this.add.text(this.cameras.main.centerX, 100, 'Cargando...', {
          fontFamily: 'bobFont',
          fontSize: '32px',
          fill: '#4bc711ff'
        }).setOrigin(0.6);

        const boxX = 150;
        const boxY = 250;
        const boxWidth = 500;
        const boxHeight = 40;

        //Creaión de las cajas
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x000000, 0.8);
        progressBox.fillRect(boxX, boxY, boxWidth, boxHeight);
        progressBox.lineStyle(4, 0x459617);
        progressBox.strokeRect(boxX, boxY, boxWidth, boxHeight);

        const progressBar = this.add.graphics();
        //Texto de porcentaje de la caja
        const percentText = this.add.text(this.cameras.main.centerX, boxY + 60, '0%', {
          fontFamily: 'bobFont',
          fontSize: '24px',
          fill: '#d4bf1aff'
        }).setOrigin(0.5);
        //Imagen que está en el tope de la barra
        const img = this.add.image(boxX + 5, boxY + boxHeight / 2, 'otter');
        img.setOrigin(0.5);
        img.setScale(0.3)
        
        // Simulamos un progreso falso
        let fakeProgress = 0;
        this.time.addEvent({
          delay: 50, // cada 50ms
          repeat: 100, // 100 pasos = 5 segundos
          callback: () => {
            fakeProgress += 0.01;
            progressBar.clear();
            progressBar.fillStyle(0xBD1A3E, 1);
            progressBar.fillRect(boxX + 5, boxY + 5, (boxWidth - 10) * fakeProgress, boxHeight - 10);

            percentText.setText(Math.min(Math.floor(fakeProgress * 100), 100) + '%');
            img.x = boxX + 5 + (boxWidth - 10) * fakeProgress;
            //Cuando haya llegado el tope
            if (fakeProgress >= 1) {
              this.scene.start('menuScene');
            }
          }
        });
        if(this.first){
          this.loadResources();        
        }
    }
    //Metodo para meter todos los recursos que necesitemos
    loadResources(){
      this.load.image('map', '../assets/mainScene/map.png')
      this.load.image('toni','../assets/imagenesWeb/Ismael.png')
      this.load.image('map', '../assets/mainScene/map.png');
      this.load.image('paint', '../assets/mainScene/paint.jpeg');
      this.load.image('destroyedHouse', '../assets/mainScene/destroyedHouse.jpg');
      this.load.image('house', '../assets/mainScene/house.png');
      this.load.image('buildSources', '../assets/mainScene/buildSources.jpg')
      this.load.image('spaceKey', '../assets/mainScene/keyboard_space.png')

      this.load.json('prueba','../data/DialogoPrueba.json')
      
      this.first = false;
    }
}