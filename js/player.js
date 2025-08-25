import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Listen to game over event
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.COLLISION_DETECTED, () => this.die());
    }

    update() {
        // Di chuyển trái phải
        if (this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-200);
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'left', x: this.sprite.x, y: this.sprite.y });
        } else if (this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(200);
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'right', x: this.sprite.x, y: this.sprite.y });
        } else {
            this.sprite.body.setVelocityX(0);
        }

        // Nhảy một lần khi nhấn phím lên
        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.jump();
        }
    }

    jump() {
        this.sprite.body.setVelocityY(-300);
        eventBus.emit(GAME_EVENTS.PLAYER_JUMP, { x: this.sprite.x, y: this.sprite.y });
    }

    die() {
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setVelocityY(0);
        eventBus.emit(GAME_EVENTS.GAME_OVER);
    }

    onGameOver() {
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setVelocityY(0);
    }
}
