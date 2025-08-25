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
        // Tạo các obstacle cố định
        this.createFixedObstacles();
    }

    createFixedObstacles() {
        // Tạo các obstacle ở các vị trí cố định
        const positions = [
            {x: 300, y: 530},
            {x: 500, y: 530},
            {x: 700, y: 530}
        ];

        positions.forEach(pos => {
            const obstacle = this.scene.add.image(pos.x, pos.y, 'tree');
            this.obstacles.add(obstacle);
            this.scene.physics.add.existing(obstacle);
            obstacle.body.allowGravity = false;
            obstacle.body.immovable = true;
            eventBus.emit(GAME_EVENTS.OBSTACLE_CREATED, { x: pos.x, y: pos.y });
        });
    }

    getGroup() {
        return this.obstacles;
    }

    onGameOver() {
        this.isGameOver = true;
    }
}
