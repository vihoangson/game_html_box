import { eventBus, GAME_EVENTS } from './EventBus.js';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.group();
        this.gameSpeed = 300;
        this.spawnTimer = null;
        this.isGameRunning = false;

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.GAME_START, () => this.startSpawning());
    }

    startSpawning() {
        this.isGameRunning = true;
        this.spawnTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
    }

    onGameOver() {
        this.isGameRunning = false;
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }
        this.obstacles.clear(true, true);
    }

    spawnObstacle() {
        if (!this.isGameRunning) return;

        const obstacle = this.scene.add.image(800, 530, 'tree');
        this.obstacles.add(obstacle);
        this.scene.physics.add.existing(obstacle);
        obstacle.body.allowGravity = false;
        obstacle.body.immovable = true;
        obstacle.body.velocity.x = -this.gameSpeed;

        // Destroy obstacle when it goes off screen
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;

        eventBus.emit(GAME_EVENTS.OBSTACLE_CREATED, { x: obstacle.x, y: obstacle.y });
    }

    update() {
        // Increase game speed over time
        if (this.isGameRunning) {
            this.gameSpeed += 0.01;
            this.obstacles.children.iterate((obstacle) => {
                if (obstacle && obstacle.body) {
                    obstacle.body.velocity.x = -this.gameSpeed;
                }
            });
        }
    }

    getGroup() {
        return this.obstacles;
    }
}
