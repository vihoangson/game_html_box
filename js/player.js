import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(0.2);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpCount = 0; // Số lần nhảy hiện tại

        // Listen to game over event
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());

        // Listen to collision event
        eventBus.on(GAME_EVENTS.COLLISION_DETECTED, () => this.die());
    }

    update() {
        if (this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-200);
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'left', x: this.sprite.x, y: this.sprite.y });
        } else if (this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(200);
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'right', x: this.sprite.x, y: this.sprite.y });
        } else {
            this.sprite.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.canJump()) {
            this.jump();
        }
        // Reset jumpCount nếu chạm đất
        if (this.sprite.body.touching.down) {
            this.jumpCount = 0;
        }
    }

    canJump() {
        // Cho phép nhảy nếu đang chạm đất hoặc đã nhảy < 2 lần
        return this.sprite.body.touching.down || this.jumpCount < 2;
    }

    jump() {
        if (this.canJump()) {
            if (this.sprite.body.touching.down) {
                // Nhảy lần đầu
                this.sprite.body.setVelocityY(-300);
            } else if (this.jumpCount === 1) {
                // Nhảy lần hai, cao hơn
                this.sprite.body.setVelocityY(-400);
            }
            this.jumpCount++;
            eventBus.emit(GAME_EVENTS.PLAYER_JUMP, { x: this.sprite.x, y: this.sprite.y });
        }
    }

    die() {
        this.sprite.fillColor = 0xff0000;
        eventBus.emit(GAME_EVENTS.PLAYER_DIE, { x: this.sprite.x, y: this.sprite.y });
    }

    onGameOver() {
        this.sprite.body.moves = false;
    }
}
