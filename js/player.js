import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);

        // Cài đặt physics cho player
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setDragX(1000); // Thêm ma sát khi dừng lại
        this.moveSpeed = 300; // Tốc độ di chuyển
        this.jumpForce = -400; // Lực nhảy

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isMoving = false;

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.COLLISION_DETECTED, () => this.die());

        // Animation khi di chuyển
        this.bounceAnimation = scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 100,
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-this.moveSpeed);
            if (!this.isMoving) {
                this.bounceAnimation.resume();
                this.isMoving = true;
            }
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'left', x: this.sprite.x, y: this.sprite.y });
        } else if (this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(this.moveSpeed);
            if (!this.isMoving) {
                this.bounceAnimation.resume();
                this.isMoving = true;
            }
            eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'right', x: this.sprite.x, y: this.sprite.y });
        } else {
            if (this.isMoving) {
                this.bounceAnimation.pause();
                this.sprite.setScale(1);
                this.isMoving = false;
            }
        }

        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.jump();
        }
    }

    jump() {
        this.sprite.body.setVelocityY(this.jumpForce);
        // Animation khi nhảy
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 0.8,
            scaleY: 1.2,
            duration: 200,
            yoyo: true
        });
        eventBus.emit(GAME_EVENTS.PLAYER_JUMP, { x: this.sprite.x, y: this.sprite.y });
    }

    die() {
        this.bounceAnimation.stop();
        this.sprite.setScale(1);
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setVelocityY(0);
        // Animation khi chết
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 200
        });
        eventBus.emit(GAME_EVENTS.GAME_OVER);
    }

    onGameOver() {
        this.bounceAnimation.stop();
        this.sprite.setScale(1);
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setVelocityY(0);
    }
}
