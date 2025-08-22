import { eventBus, GAME_EVENTS } from './EventBus.js';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.group();

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.GAME_START, () => this.startSpawning());
    }

    startSpawning() {
        this.createObstacle();
    }

    createObstacle() {
        const x = 800 + Math.random() * 200;
        const obstacle = this.scene.add.image(x, 530, 'tree');
        this.obstacles.add(obstacle);
        this.scene.physics.add.existing(obstacle);
        obstacle.body.setVelocityX(-150);
        obstacle.body.allowGravity = false;
        obstacle.body.immovable = true;

        eventBus.emit(GAME_EVENTS.OBSTACLE_CREATED, { x, y: 530 });

        // Schedule next obstacle if game is still running
        this.scene.time.delayedCall(
            Phaser.Math.Between(2000, 4000),
            () => {
                if (!this.isGameOver) {
                    this.createObstacle();
                }
            },
            [],
            this
        );
    }

    checkObstacles() {
        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle.x < -obstacle.width) {
                eventBus.emit(GAME_EVENTS.OBSTACLE_REMOVED, { obstacle });
                obstacle.destroy();
            }
        });
    }

    onGameOver() {
        this.isGameOver = true;
        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.body.setVelocityX(0);
        });
    }

    getGroup() {
        return this.obstacles;
    }
}
