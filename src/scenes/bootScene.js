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

    this.tweens.add({
      targets: img,
      y: img.y - 10,       // Mueve hacia arriba 20 píxeles
      duration: 1000,       // Duración del movimiento hacia arriba
      yoyo: true,          // Reproduce en reversa (sube y baja)
      repeat: -1,          // Repite infinitamente
      ease: 'Sine.easeInOut' // Movimiento suave
  });

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
    // === MAPA ===
    this.load.image('map', './assets/imagenes/HUD/map.png');

    // === NPC ===
    this.load.image('toni', './assets/imagenes/NPC/Toni.png');
    this.load.image('pablo', './assets/imagenes/NPC/Pablo.png');
    this.load.image('ismael', './assets/imagenes/NPC/Ishmael.png');
    
    // === BUILDS ===
    this.load.image('destroyedHouse', './assets/imagenes/builds/destroyedHouse.jpg');
    this.load.image('house', './assets/imagenes/builds/house.png');

    // === SOURCES ===
    this.load.image('paint', './assets/imagenes/sources/paint.jpg');
    
    // === HUD ===
    this.load.image('buildSources', './assets/imagenes/HUD/buttons/buildSources.png');
    this.load.image('spaceKey', './assets/imagenes/HUD/popups/keyboard_space.png');
    this.load.image('acceptButtonHover', './assets/imagenes/HUD/buttons/acceptButtonHover.png');
    this.load.image('acceptButton', './assets/imagenes/HUD/buttons/acceptButton.png');
    this.load.image('refuseButtonHover', './assets/imagenes/HUD/buttons/refuseButtonHover.png');
    this.load.image('refuseButton', './assets/imagenes/HUD/buttons/refuseButton.png');
    this.load.image('backpack', './assets/imagenes/HUD/sources/backpack.png');
    this.load.image('paintIcon', './assets/imagenes/HUD/sources/paintIcon.png');
    this.load.image('paperIcon', './assets/imagenes/HUD/sources/paperIcon.png');
    this.load.image('clayIcon', './assets/imagenes/HUD/sources/clayIcon.png');
    this.load.image('stamina', './assets/imagenes/HUD/sources/stamina.png');
    this.load.image('day', './assets/imagenes/HUD/sources/dia.png');
    this.load.image('sourceWarning', './assets/imagenes/HUD/sources/warningBG.png');
    this.load.image('notEnoughStamina', './assets/imagenes/HUD/popups/notEnoughStamina.png');
    this.load.image('TitleBanner', './assets/imagenes/imagenesWeb/diseño/banner.png');
    this.load.image('exitGame', './assets/imagenes/HUD/buttons/exitGame.png');
    this.load.image('exitGameHover', './assets/imagenes/HUD/buttons/exitGameHover.png');
    this.load.image('playGame', './assets/imagenes/HUD/buttons/playGame.png');
    this.load.image('playGameHover', './assets/imagenes/HUD/buttons/playGameHover.png');
    this.load.image('titleBg', './assets/imagenes/HUD/titleBg.png');

    // === MINIGAMES ===
    this.load.image('MGInfoBG', './assets/imagenes/HUD/popups/MGInfoBG.png');

      // == WHACK A MOLE ==
       this.load.image('topo', './assets/imagenes/minigames/WhackAMole/objects/boa.jpg');
       this.load.image('hoyo', './assets/imagenes/minigames/WhackAMole/objects/hole.png');
       this.load.image('dinamita', './assets/imagenes/minigames/WhackAMole/objects/bomba.png');
       this.load.video('WAMVideo', './assets/imagenes/minigames/WhackAMole/background/WAMVideo.mp4');
       this.load.image('toposEnd', './assets/imagenes/minigames/WhackAMole/endImg.png');
       this.load.spritesheet('explosion','./assets/imagenes/minigames/WhackAMole/objects/explosion.png', {frameWidth: 32,frameHeight:32})
       
      // == LIGHT UP GHOSTS ==
      this.load.image('fantasmasEnd', './assets/imagenes/minigames/LightUpGhosts/endImg.png');

      // == PUZZLE ==
      this.load.image('puzleEnd', './assets/imagenes/minigames/Puzzle/endImg.png');
    
    //

    // === RECURSOS DIÁLOGOS ===
    this.load.json('prueba', './data/DialogoToniPablo.json');
    this.load.json('cleonRome', './data/Cleon&RomeDialogo.json');
    this.load.json('ishmael', './data/IshmaelDialogo.json');
    this.load.json('dialogos', './data/DialogScene.json');
    this.load.json('buildDialogs', './data/BuildDialogs.json');
    this.first = false;

    // === AUDIO ===

      // == MÚSICA ==
       this.load.audio('titleMusic', './assets/audios/Title.mp3');
       this.load.audio('mainSceneMusic', './assets/audios/mainScene.mp3');
       this.load.audio('minigameInfoMusic', './assets/audios/minigames/MinigameInfo.mp3');
       // = MINIGAMES =
         this.load.audio('lightUpGhostsMusic', './assets/audios/minigames/LightUpGhosts/LightUpGhosts.mp3');
         this.load.audio('puzzleMusic', './assets/audios/minigames/Puzzle/Puzzle.mp3');
         this.load.audio('whackAMoleMusic', './assets/audios/minigames/WhackAMole/Topos.mp3');

      // == SFX ==
       this.load.audio('walkingSFX', './assets/audios/walking.mp3');
        // = HUD =
         this.load.audio('appearWarningSFX', './assets/audios/HUD/appearWarning.mp3');
         this.load.audio('disappearWarningSFX', './assets/audios/HUD/disappearWarning.mp3');
         this.load.audio('acceptSFX', './assets/audios/HUD/accept.mp3');
         this.load.audio('refuseSFX', './assets/audios/HUD/refuse.mp3');
        // = MINIGAMES =
         this.load.audio('timer', './assets/audios/minigames/timerSFX.mp3');
         this.load.audio('rotatePieceSFX', './assets/audios/minigames/Puzzle/rotatePiece.mp3');
         this.load.audio('appearMoleSFX', './assets/audios/minigames/WhackAMole/appearMole.mp3');
         this.load.audio('explosionSFX', './assets/audios/minigames/WhackAMole/explosion.mp3');
         this.load.audio('appearBlowerSFX', './assets/audios/minigames/LightUpGhosts/blower/appearBlower.mp3');
         this.load.audio('disappearBlowerSFX', './assets/audios/minigames/LightUpGhosts/blower/disappearBlower.mp3');
         this.load.audio('lightedUpBlowerSFX', './assets/audios/minigames/LightUpGhosts/blower/blowerBlowing.mp3');
         this.load.audio('appearHikerSFX', './assets/audios/minigames/LightUpGhosts/hiker/appearHiker.mp3');
         this.load.audio('disappearHikerSFX', './assets/audios/minigames/LightUpGhosts/hiker/disappearHiker.mp3');
         this.load.audio('lightedUpHikerSFX', './assets/audios/minigames/LightUpGhosts/hiker/lightedUpHiker.mp3');
         this.load.audio('purgedHikerSFX', './assets/audios/minigames/LightUpGhosts/hiker/purgedHiker.mp3');
         this.load.audio('appearStarerSFX', './assets/audios/minigames/LightUpGhosts/starer/appearStarer.mp3');
         this.load.audio('disappearStarerSFX', './assets/audios/minigames/LightUpGhosts/starer/disappearStarer.mp3');
         this.load.audio('lightedUpStarerSFX', './assets/audios/minigames/LightUpGhosts/starer/lightedUpStarer.mp3');
         this.load.audio('purgedStarerSFX', './assets/audios/minigames/LightUpGhosts/starer/purgedStarer.mp3');

        // = SOURCES =
         this.load.audio('grabSFX', './assets/audios/sources/grab.mp3');
         this.load.audio('changingDaySFX', './assets/audios/sources/changingDay.mp3');
  }
}
