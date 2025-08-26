import { Player } from './player.js';
import { ObstacleManager } from './obstacle.js';
import { ScoreManager } from './score.js';
import { eventBus, GAME_EVENTS } from './EventBus.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('player', 'imgs/player.png');
        this.load.image('tree', 'imgs/tree.png');
    }

    create() {
        // Create ground
        this.ground = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
        this.physics.add.existing(this.ground, true);

        // Create player
        this.player = new Player(this);

        // Create obstacle manager
        this.obstacleManager = new ObstacleManager(this);

        // Create score manager
        this.scoreManager = new ScoreManager(this);

        // Add collision between player and ground
        this.physics.add.collider(this.player.getSprite(), this.ground);

        // Add collision between player and obstacles
        this.physics.add.collider(
            this.player.getSprite(),
            this.obstacleManager.getGroup(),
            () => eventBus.emit(GAME_EVENTS.COLLISION_DETECTED)
        );

        // Start game
        eventBus.emit(GAME_EVENTS.GAME_START);

        // Add restart game on spacebar
        this.input.keyboard.on('keydown-SPACE', () => {
            if (!this.obstacleManager.isGameRunning) {
                this.scene.restart();
            }
        });

        // Add touch/click to restart
        this.input.on('pointerdown', () => {
            if (!this.obstacleManager.isGameRunning) {
                this.scene.restart();
            }
        });
    }

    update() {
        if (this.player) this.player.update();
        if (this.obstacleManager) this.obstacleManager.update();
        if (this.scoreManager) this.scoreManager.update();
    }
}

export const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MainScene
};
