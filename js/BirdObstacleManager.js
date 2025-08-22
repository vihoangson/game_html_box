import { ObstacleManager } from './obstacle.js';
import { eventBus, GAME_EVENTS } from './EventBus.js';

export class BirdObstacleManager extends ObstacleManager {
    constructor(scene) {
        super(scene);
        this.minHeight = 400;  // Độ cao tối thiểu
        this.maxHeight = 450;  // Độ cao tối đa
        this.birdSpeed = -200; // Tốc độ chim bay
    }

    createObstacle() {
        const x = 800 + Math.random() * 200;
        // Random độ cao cho chim
        const y = this.minHeight + Math.random() * (this.maxHeight - this.minHeight);

        // Tạo chim
        const bird = this.scene.add.sprite(x, y, 'bird');
        this.obstacles.add(bird);
        this.scene.physics.add.existing(bird);

        // Cấu hình physics cho chim
        bird.body.setVelocityX(this.birdSpeed);
        bird.body.allowGravity = false;  // Chim không bị ảnh hưởng bởi trọng lực
        bird.body.immovable = true;

        // Animation đơn giản cho chim (nếu sprite sheet có nhiều frame)
        this.scene.tweens.add({
            targets: bird,
            y: y + 30,  // Di chuyển lên xuống 30px
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        eventBus.emit(GAME_EVENTS.OBSTACLE_CREATED, { type: 'bird', x, y });

        // Lên lịch tạo chim tiếp theo
        this.scene.time.delayedCall(
            Phaser.Math.Between(3000, 6000),  // Thời gian spawn lâu hơn cây
            () => {
                if (!this.isGameOver) {
                    this.createObstacle();
                }
            },
            [],
            this
        );
    }

    onGameOver() {
        super.onGameOver();
        // Dừng animation của tất cả các chim
        this.obstacles.getChildren().forEach(bird => {
            this.scene.tweens.killTweensOf(bird);
        });
    }
}
