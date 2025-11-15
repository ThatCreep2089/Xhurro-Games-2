import MainScene from './scenes/mainScene.js';
import Boot from './scenes/bootScene.js'
import TitleScene from './scenes/menuScene.js';
import Aux from './scenes/auxScene.js'

// === Minigames ===
import WhackAMole from './scenes/whackAMole.js';
import LightUpGhosts from './scenes/lightUpGhosts.js';
import IntroScene from './scenes/introductionScene.js';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
	type: Phaser.WEBGL,
	parent: 'play',
	width:  800,
	height: 600,
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.NONE,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},

	scene: [Aux,Boot,TitleScene,IntroScene,MainScene, WhackAMole, LightUpGhosts],	// Decimos a Phaser cual es nuestra escena
	
	physics: { 
		default: 'arcade', 
		arcade: { 
			gravity: { y: 0 }, 
			debug: true 
		},
		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}
	}
};
const game = new Phaser.Game(config);