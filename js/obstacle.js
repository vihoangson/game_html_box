export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = scene.physics.add.group();
    }

    createObstacle() {
        const x = 800 + Math.random() * 200;
        const obstacle = this.scene.add.image(x, 530, 'tree');
        this.obstacles.add(obstacle);
        this.scene.physics.add.existing(obstacle);
        obstacle.body.setVelocityX(-150);
        obstacle.body.allowGravity = false;
        obstacle.body.immovable = true;

        this.scene.time.delayedCall(
            Phaser.Math.Between(2000, 4000),
            () => this.createObstacle(),
            [],
            this
        );
    }

    getGroup() {
        return this.obstacles;
    }
}
