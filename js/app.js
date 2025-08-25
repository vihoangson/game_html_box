import { gameConfig } from './config.js';
import { Player } from './player.js';
import { ObstacleManager } from './obstacle.js';
import { BirdObstacleManager } from './BirdObstacleManager.js';
import { ScoreManager } from './score.js';
import { eventBus, GAME_EVENTS } from './EventBus.js';

let game;
let player, obstacleManager, birdManager, scoreManager;
let ground;
let currentLevel = 1;
let levelText;
let isChangingLevel = false;

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

    // Hiển thị level hiện tại
    levelText = this.add.text(16, 550, `Level ${currentLevel}`, { fontSize: '24px', fill: '#000000' });
    this.add.text(16, 580, 'v.0.2', { fontSize: '16px', fill: '#000000' });

    // Start spawning obstacles
    eventBus.emit(GAME_EVENTS.GAME_START);
}

function update() {
    player?.update();
    birdManager?.checkObstacles();

    // Kiểm tra vị trí player để chuyển màn (5/6 màn hình)
    if (player && player.sprite.x >= (gameConfig.width * 5/6) && !isChangingLevel) {
        isChangingLevel = true;
        // Reset vận tốc của player
        player.sprite.body.setVelocityX(0);
        // Tạm dừng physics
        this.physics.pause();

        // Emit event level complete
        eventBus.emit(GAME_EVENTS.LEVEL_COMPLETE, { level: currentLevel });

        // Tăng level và reset màn chơi
        currentLevel++;
        resetLevel.call(this);
    }
}

function resetLevel() {
    // Hiệu ứng fade out
    this.cameras.main.fadeOut(500);

    // Đợi hiệu ứng fade out hoàn thành
    this.cameras.main.once('camerafadeoutcomplete', () => {
        // Xóa các obstacles hiện tại
        obstacleManager.getGroup().clear(true, true);
        birdManager.getGroup().clear(true, true);

        // Reset vị trí player
        player.sprite.setPosition(100, 500);

        // Cập nhật text hiển thị level
        if (levelText) {
            levelText.setText(`Level ${currentLevel}`);
        }

        // Hiển thị thông báo level mới
        const levelAnnouncement = this.add.text(400, 300, `Level ${currentLevel}`, {
            fontSize: '48px',
            fill: '#000000'
        });
        levelAnnouncement.setOrigin(0.5);

        // Hiệu ứng cho text level mới
        this.tweens.add({
            targets: levelAnnouncement,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 0,
            onComplete: () => {
                levelAnnouncement.destroy();
                // Sau khi hoàn thành animation, reset trạng thái
                isChangingLevel = false;
            }
        });

        // Khởi động lại physics sau một khoảng thời gian ngắn
        this.time.delayedCall(1000, () => {
            this.physics.resume();
            // Tạo obstacles mới cho level mới
            obstacleManager.startSpawning();
            birdManager.startSpawning();
        });

        // Hiệu ứng fade in
        this.cameras.main.fadeIn(500);
    });
}

export function restartGame() {
    currentLevel = 1;
    eventBus.emit(GAME_EVENTS.GAME_RESTART);
}
