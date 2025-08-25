import { eventBus, GAME_EVENTS } from './EventBus.js';

export class BirdObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.group();
        this.minHeight = 100;  // Độ cao tối thiểu
        this.maxHeight = 450;  // Độ cao tối đa
        this.birdSpeed = -200; // Tốc độ chim bay

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.GAME_START, () => this.startSpawning());
    }

    startSpawning() {
        this.isGameOver = false;
        this.createObstacle();
    }

    createObstacle() {
        const x = 800 + Math.random() * 200;
        const y = this.minHeight + Math.random() * (this.maxHeight - this.minHeight);

        const bird = this.scene.add.sprite(x, y, 'bird');
        this.obstacles.add(bird);
        this.scene.physics.add.existing(bird);

        bird.body.setVelocityX(this.birdSpeed);
        bird.body.allowGravity = false;
        bird.body.immovable = true;

        this.scene.tweens.add({
            targets: bird,
            y: y + 30,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        eventBus.emit(GAME_EVENTS.OBSTACLE_CREATED, { type: 'bird', x, y });

        if (!this.isGameOver) {
            this.scene.time.delayedCall(
                Phaser.Math.Between(3000, 6000),
                () => this.createObstacle(),
                [],
                this
            );
        }
    }

    checkObstacles() {
        this.obstacles.getChildren().forEach(bird => {
            if (bird.x < -bird.width) {
                eventBus.emit(GAME_EVENTS.OBSTACLE_REMOVED, { obstacle: bird });
                bird.destroy();
            }
        });
    }

    getGroup() {
        return this.obstacles;
    }

    onGameOver() {
        this.isGameOver = true;
        this.obstacles.getChildren().forEach(bird => {
            bird.body.setVelocityX(0);
            bird.body.setVelocityY(0);
        });
    }
}
