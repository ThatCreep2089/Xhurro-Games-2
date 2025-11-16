export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  init() {
    this.first = true;
  }

  preload() {
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Texto "Cargando..."
    const loadingText = this.add.text(this.cameras.main.centerX, 100, 'Cargando...', {
      fontFamily: 'bobFont',
      fontSize: '32px',
      fill: '#4bc711ff'
    }).setOrigin(0.5);

    const boxX = 150;
    const boxY = 250;
    const boxWidth = 500;
    const boxHeight = 40;

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    progressBox.lineStyle(4, 0x459617);
    progressBox.strokeRect(boxX, boxY, boxWidth, boxHeight);

    const progressBar = this.add.graphics();
    const percentText = this.add.text(this.cameras.main.centerX, boxY + 60, '0%', {
      fontFamily: 'bobFont',
      fontSize: '24px',
      fill: '#d4bf1aff'
    }).setOrigin(0.5);

    const img = this.add.image(boxX + 5, boxY + boxHeight / 2, 'otter');
    img.setOrigin(0.5);
    img.setScale(0.3);

    // Vincular progreso real del cargador
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xBD1A3E, 1);
      progressBar.fillRect(boxX + 5, boxY + 5, (boxWidth - 10) * value, boxHeight - 10);

      percentText.setText(Math.floor(value * 100) + '%');
      img.x = boxX + 5 + (boxWidth - 10) * value;
    });

    //Cuando todos los recursos se hayan cargado
    this.load.on('complete', () => {
      this.time.delayedCall(300, () => {
        this.scene.start('menuScene');
      });
    });

    // Cargar recursos reales
    if (this.first) {
      this.loadResources();
    }
  }

  loadResources() {
    this.load.image('toni', './assets/imagenes/Toni.png');
    this.load.image('map', './assets/mainScene/map.png');
    this.load.image('paint', './assets/mainScene/paint.jpg');
    this.load.image('destroyedHouse', './assets/mainScene/destroyedHouse.jpg');
    this.load.image('house', './assets/mainScene/house.png');
    this.load.image('buildSources', './assets/mainScene/buildSources.jpg');
    this.load.image('spaceKey', './assets/mainScene/keyboard_space.png');
    this.load.image('topo', './assets/imagenes/boa.jpg');
    this.load.image('hoyo', './assets/imagenes/hole.png');
    this.load.image('dinamita', './assets/imagenes/bomba.png');

    // === RECURSOS DESCRIPCIÓN MINIJUEGOS ===
    this.load.video('WAMVideo', './assets/WackAMole/WAMVideo.mp4');
    this.load.image('MGInfoBG', './assets/mainScene/MGInfoBG.jpg');
    this.load.image('acceptButton', './assets/mainScene/acceptButton.jpg');
    this.load.image('refuseButton', './assets/mainScene/refuseButton.jpg');

    // === RECURSOS DIÁLOGOS ===
    this.load.json('prueba', './data/DialogoPrueba.json');
    this.load.json('cleonRome', './data/Cleon&RomeDialogo.json');
    this.first = false;
  }
}
