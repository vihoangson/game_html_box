import { gameConfig } from './config.js';
import { Player } from './player.js';
import { ObstacleManager } from './obstacle.js';
import { ScoreManager } from './score.js';
import { eventBus } from './EventBus.js';

let playerName = "Guest";
let game;
let player, obstacleManager, scoreManager;
let ground, gameOver = false;

// When clicking start
export function initGame() {
    setupEventListeners();
    document.getElementById("startButton").addEventListener("click", () => {
        playerName = document.getElementById("playerNameInput").value.trim() || "Guest";
        document.getElementById("welcomeScreen").style.display = "none";
        startGame();
    });
}

function setupEventListeners() {
    eventBus.on('SCORE_UPDATED', (score) => {
        console.log(`Score updated: ${score}`);
        // Có thể thêm hiệu ứng khi điểm số tăng
    });

    eventBus.on('PLAYER_JUMP', (data) => {
        console.log(`Player jumped at position: ${data.x}, ${data.y}`);
        // Có thể thêm hiệu ứng khi nhảy
    });

    eventBus.on('PLAYER_DIE', (data) => {
        console.log(`Player died at position: ${data.x}, ${data.y}`);
        saveScore();
    });
}

function saveScore() {
    fetch("https://son.vn?save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: playerName,
            score: scoreManager.getScore()
        })
    }).catch(err => console.error("Lỗi gửi điểm:", err));
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
}

function create() {
    ground = this.add.rectangle(400, 580, 800, 40, 0x228B22);
    this.physics.add.existing(ground, true);

    player = new Player(this, 100, 500);
    obstacleManager = new ObstacleManager(this);
    scoreManager = new ScoreManager(this);

    this.physics.add.collider(player.sprite, ground);

    document.body.addEventListener('pointerdown', () => {
        if (player.sprite.body.touching.down && !gameOver) {
            player.sprite.body.setVelocityY(-300);
        }
    });

    obstacleManager.createObstacle();

    this.add.text(16, 580, 'v.0.1', { fontSize: '16px', fill: '#000000' });

    this.physics.add.collider(
        player.sprite,
        obstacleManager.getGroup(),
        hitObstacle,
        null,
        this
    );
}

function update() {
    if (gameOver) return;

    player.update(gameOver);

    obstacleManager.getGroup().getChildren().forEach(obstacle => {
        if (obstacle.x < -obstacle.width) {
            scoreManager.increment();
            obstacle.destroy();
        }
    });
}

function hitObstacle() {
    this.physics.pause();
    player.die();
    gameOver = true;
    document.getElementById('replayButton').style.display = 'block';
}

export function restartGame() {
    window.location.reload();
}
