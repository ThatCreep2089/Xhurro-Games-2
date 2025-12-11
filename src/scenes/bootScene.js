export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  init() {
    this.first = true;
  }

  preload() {

    //Fondo
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'cargaBg').setOrigin(0.5,0.5).setScale(0.37);

    // Texto "Cargando..."
    const loadingText = this.add.text(this.cameras.main.centerX, 100, 'Cargando...', {
      fontFamily: 'bobFont',
      fontSize: '32px',
      fill: '#e3c28b'
    }).setOrigin(0.5);

    const boxX = 150;
    const boxY = 250;
    const boxWidth = 500;
    const boxHeight = 40;

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    progressBox.lineStyle(4, 0x2127d8);
    progressBox.strokeRect(boxX, boxY, boxWidth, boxHeight);

    const progressBar = this.add.graphics();
    const percentText = this.add.text(this.cameras.main.centerX, boxY + 60, '0%', {
      fontFamily: 'bobFont',
      fontSize: '24px',
      fill: '#e3c28b'
    }).setOrigin(0.5);

    const img = this.add.image(boxX + 5, boxY + boxHeight / 2, 'navi');
    img.setOrigin(0.5);
    img.setScale(0.1);

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
      progressBar.fillStyle(0xe3c28b, 1);
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

    // === PERSONAJES ===
    this.load.image('otter', './assets/imagenes/Otter/OtterPortrait.png');
    this.load.spritesheet('otterFront', './assets/imagenes/Otter/OtterFront.png', {frameWidth: 800, frameHeight: 800});
    this.load.spritesheet('otterBack', './assets/imagenes/Otter/OtterBack.png', {frameWidth: 800, frameHeight: 800});
    this.load.spritesheet('otterSide', './assets/imagenes/Otter/OtterSide.png', {frameWidth: 800, frameHeight: 800});

    // == NPC ==

    this.load.image('toni', './assets/imagenes/NPC/Toni.png');
    this.load.image('pablo', './assets/imagenes/NPC/Pablo.png');
    this.load.image('ismael', './assets/imagenes/NPC/Ishmael.png');
    this.load.image('cleon&rome', './assets/imagenes/NPC/Cleon&Rome.png');

    this.load.image('toniPortrait', './assets/imagenes/NPC/ToniPortrait.png');
    this.load.image('pabloPortrait', './assets/imagenes/NPC/PabloPortrait.png');
    this.load.image('ismaelPortrait', './assets/imagenes/NPC/IshmaelPortrait.png');
    this.load.image('cleonPortrait', './assets/imagenes/NPC/CleonPortrait.png');
    this.load.image('romePortrait', './assets/imagenes/NPC/RomePortrait.png');
    
    // === BUILDS ===
    this.load.image('destroyedFountain', './assets/imagenes/builds/brokenfountain.png');
    this.load.image('fountain', './assets/imagenes/builds/fountain.png');
    
    this.load.image('destroyedWatermill', './assets/imagenes/builds/brokenwatermill.png');
    this.load.image('watermill', './assets/imagenes/builds/watermill.png');

    this.load.image('destroyedTreehouse', './assets/imagenes/builds/brokentreehouse.png');
    this.load.image('treehouse', './assets/imagenes/builds/treehouse.png');

    this.load.image('destroyedSwing', './assets/imagenes/builds/brokenswing.png');
    this.load.image('swing', './assets/imagenes/builds/swing.png');

    // === SOURCES ===
    this.load.image('paper0', './assets/imagenes/sources/paper0.png');
    this.load.image('paper1', './assets/imagenes/sources/paper1.png');
    this.load.image('clay0', './assets/imagenes/sources/clay0.png');
    this.load.image('clay1', './assets/imagenes/sources/clay1.png');
    this.load.image('clay2', './assets/imagenes/sources/clay2.png');
    this.load.image('paint0', './assets/imagenes/sources/paint.png');
    
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
    this.load.image('night', './assets/imagenes/HUD/sources/night.png');
    this.load.image('afternoon', './assets/imagenes/HUD/sources/afternoon.png');
    this.load.image('sourceWarning', './assets/imagenes/HUD/sources/warningBG.png');
    this.load.image('notEnoughStamina', './assets/imagenes/HUD/popups/notEnoughStamina.png');
    this.load.image('TitleBanner', './assets/imagenes/imagenesWeb/diseño/banner.png');
    this.load.image('exitGame', './assets/imagenes/HUD/buttons/exitGame.png');
    this.load.image('exitGameHover', './assets/imagenes/HUD/buttons/exitGameHover.png');
    this.load.image('playGame', './assets/imagenes/HUD/buttons/playGame.png');
    this.load.image('playGameHover', './assets/imagenes/HUD/buttons/playGameHover.png');
    this.load.image('titleBg', './assets/imagenes/HUD/titleBg.png');
    this.load.image('creditsBg', './assets/imagenes/HUD/cargaBg.png');
    this.load.image('whackAMoleBg', './assets/imagenes/HUD/minigamesBg2.png');
    this.load.image('lightUpGhostsBg', './assets/imagenes/HUD/ghostsBg.png');
    this.load.image('puzzleBg', './assets/imagenes/HUD/minigamesBg1.png');

    // === MINIGAMES ===
    this.load.image('MGInfoBG', './assets/imagenes/HUD/popups/MGInfoBG.png');

      // == WHACK A MOLE ==
      this.load.video('WAMVideo', './assets/imagenes/minigames/WhackAMole/WAMVideo.mp4');
      this.load.image('topo', './assets/imagenes/minigames/WhackAMole/objects/marcus.png');
      this.load.image('hoyo', './assets/imagenes/minigames/WhackAMole/objects/holeFront.png');
      this.load.image('hoyoBack', './assets/imagenes/minigames/WhackAMole/objects/holeBack.png');
      this.load.image('dinamita', './assets/imagenes/minigames/WhackAMole/objects/bomba.png');
      this.load.image('toposEnd', './assets/imagenes/minigames/WhackAMole/endImg.png');
      this.load.image('hammer', './assets/imagenes/minigames/WhackAMole/objects/hammer.png');
      this.load.spritesheet('explosion','./assets/imagenes/minigames/WhackAMole/objects/explosion.png', {frameWidth: 32,frameHeight:32})
       
      // == LIGHT UP GHOSTS ==
      this.load.video('LUGVideo', './assets/imagenes/minigames/LightUpGhosts/infoVideo.mp4');
      this.load.image('fantasmasEnd', './assets/imagenes/minigames/LightUpGhosts/endImg.png');
      this.load.image('blower', './assets/imagenes/minigames/LightUpGhosts/largeGhost.png');
      this.load.image('hiker', './assets/imagenes/minigames/LightUpGhosts/smallGhost.png');
      this.load.image('starer', './assets/imagenes/minigames/LightUpGhosts/bigGhost.png');

      // == PUZZLE ==
      this.load.video('PVideo', './assets/imagenes/minigames/Puzzle/infoVideo.mp4');
      this.load.image('puzleEnd', './assets/imagenes/minigames/Puzzle/endImg.png');
      this.load.image('puzzle0_0', './assets/imagenes/minigames/Puzzle/Puzzle0/puzzle0_0.png');
      this.load.image('puzzle0_1', './assets/imagenes/minigames/Puzzle/Puzzle0/puzzle0_1.png');
      this.load.image('puzzle0_2', './assets/imagenes/minigames/Puzzle/Puzzle0/puzzle0_2.png');
      this.load.image('puzzle0_3', './assets/imagenes/minigames/Puzzle/Puzzle0/puzzle0_3.png');
      this.load.image('puzzle1_0', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_0.png');
      this.load.image('puzzle1_1', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_1.png');
      this.load.image('puzzle1_2', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_2.png');
      this.load.image('puzzle1_3', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_3.png');
      this.load.image('puzzle1_4', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_4.png');
      this.load.image('puzzle1_5', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_5.png');
      this.load.image('puzzle1_6', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_6.png');
      this.load.image('puzzle1_7', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_7.png');
      this.load.image('puzzle1_8', './assets/imagenes/minigames/Puzzle/Puzzle1/puzzle_1_8.png');

    // === RECURSOS DIÁLOGOS ===
    this.load.json('prueba', './data/DialogoToniPablo.json');
    this.load.json('cleonRome', './data/Cleon&RomeDialogo.json');
    this.load.json('ishmael', './data/IshmaelDialogo.json');
    this.load.json('dialogos', './data/DialogScene.json');
    this.load.json('buildDialogs', './data/BuildDialogs.json');
     // === TILEMAP ===
     this.load.image("cardboard", "./assets/mainScene/cardboard.png");
     this.load.image("foresttiles", "./assets/mainScene/foresttiles.png");
     this.load.image("grass", "./assets/mainScene/grass.png");
     this.load.image("paintriver", "./assets/mainScene/paintriver.png");
     this.load.image("paperobstacles", "./assets/mainScene/paperobstacles.png");
     this.load.image("papertiles", "./assets/mainScene/paperfloor.png");
     this.load.image("tree", "./assets/mainScene/tree.png");
     this.load.tilemapTiledJSON("tilemap", "./assets/mainScene/map_final.json");
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
        // PUZZLE
        this.load.audio('rotatePieceSFX', './assets/audios/minigames/Puzzle/rotatePiece.mp3');
        // WHACK A MOLE
        this.load.audio('appearMoleSFX', './assets/audios/minigames/WhackAMole/appearMole.mp3');
        this.load.audio('explosionSFX', './assets/audios/minigames/WhackAMole/explosion.mp3');
        //LIGHT UP GHOSTS
        this.load.audio('appearBlowerSFX', './assets/audios/minigames/LightUpGhosts/blower/appearBlower.mp3');
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
        this.load.audio('cashSFX', './assets/audios/sources/cash.mp3');
        this.load.audio('changingDaySFX', './assets/audios/sources/changingDay.mp3');
  }
}
