import MainScene from './scenes/mainScene.js';
import TitleScene from './scenes/menuScene.js';
import WhackAMole from './scenes/whackAMole.js';


/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
	type: Phaser.CANVAS,
	parent: 'play',
	width:  800,
	height: 600,
	pixelArt: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [WhackAMole,TitleScene, MainScene],	// Decimos a Phaser cual es nuestra escena, en este caso la escena es un 											//objeto formado por el método preload y create definidos más abajo en 										//este mismo archivo
	physics: { 
		default: 'arcade', 
		arcade: { 
			gravity: { y: 0 }, 
			debug: false 
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