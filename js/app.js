import { gameConfig } from './config.js';
import { Player } from './player.js';
import { ObstacleManager } from './obstacle.js';
import { BirdObstacleManager } from './BirdObstacleManager.js';
import { ScoreManager } from './score.js';
import { eventBus, GAME_EVENTS } from './EventBus.js';

let game;
let player, obstacleManager, birdManager, scoreManager;
let ground;

export function initGame() {
    setupEventListeners();
    document.getElementById("startButton").addEventListener("click", () => {
        const playerName = document.getElementById("playerNameInput").value.trim() || "Khách";
        localStorage.setItem('playerName', playerName);
        document.getElementById("welcomeScreen").style.display = "none";
        startGame();
    });

    // Handle restart game
    eventBus.on(GAME_EVENTS.GAME_RESTART, () => {
        window.location.reload();
    });
}

function setupEventListeners() {
    // Handle touch/click for jump
    document.body.addEventListener('pointerdown', () => {
        if (player?.sprite.body.touching.down) {
            player.jump();
        }
    });

    // Setup debug logging
    eventBus.on(GAME_EVENTS.SCORE_UPDATED, (data) => {
        console.log(`Score updated: ${data.score}`);
    });

    eventBus.on(GAME_EVENTS.PLAYER_JUMP, (data) => {
        console.log(`Player jumped at position: ${data.x}, ${data.y}`);
    });

    eventBus.on(GAME_EVENTS.PLAYER_DIE, (data) => {
        console.log(`Player died at position: ${data.x}, ${data.y}`);
        document.getElementById('replayButton').style.display = 'block';
    });

    eventBus.on(GAME_EVENTS.COLLISION_DETECTED, () => {
        game.scene.scenes[0].physics.pause();
        eventBus.emit(GAME_EVENTS.GAME_OVER);
    });
}

function startGame() {
    const config = {
        ...gameConfig,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    game = new Phaser.Game(config);
}

function preload() {
    this.load.image('tree', './imgs/tree.png');
    this.load.image('bird', './imgs/bird.png');
}

function create() {
    ground = this.add.rectangle(400, 580, 800, 40, 0x228B22);
    this.physics.add.existing(ground, true);

    player = new Player(this, 100, 500);
    obstacleManager = new ObstacleManager(this);
    birdManager = new BirdObstacleManager(this);
    scoreManager = new ScoreManager(this);

    this.physics.add.collider(player.sprite, ground);

    // Collision với cây
    this.physics.add.collider(
        player.sprite,
        obstacleManager.getGroup(),
        () => eventBus.emit(GAME_EVENTS.COLLISION_DETECTED),
        null,
        this
    );

    // Collision với chim
    this.physics.add.collider(
        player.sprite,
        birdManager.getGroup(),
        () => eventBus.emit(GAME_EVENTS.COLLISION_DETECTED),
        null,
        this
    );

    this.add.text(16, 580, 'v.0.2', { fontSize: '16px', fill: '#000000' });

    // Start spawning obstacles
    eventBus.emit(GAME_EVENTS.GAME_START);
}

function update() {
    player?.update();
    birdManager?.checkObstacles();
}

export function restartGame() {
    eventBus.emit(GAME_EVENTS.GAME_RESTART);
}
