import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);

        // Cài đặt physics cho player
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setDragX(1000);
        this.moveSpeed = 300;
        this.jumpForce = -400;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.isMoving = false;
        this.canJump = true;

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

        // Thêm double tap detection cho mobile
        this.lastTapTime = 0;
        scene.input.on('pointerdown', (pointer) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTapTime;
            if (tapLength < 300 && tapLength > 0) {
                if (this.sprite.body.touching.down) {
                    this.jump();
                }
            }
            this.lastTapTime = currentTime;
        });
    }

    update(joystickDirection) {
        // Xử lý input từ bàn phím
        if (this.cursors.left.isDown || (joystickDirection && joystickDirection.left)) {
            this.moveLeft();
        } else if (this.cursors.right.isDown || (joystickDirection && joystickDirection.right)) {
            this.moveRight();
        } else {
            this.stopMoving();
        }

        // Xử lý nhảy
        if ((this.cursors.up.isDown || (joystickDirection && joystickDirection.up)) &&
            this.sprite.body.touching.down && this.canJump) {
            this.jump();
        }

        // Reset canJump khi chạm đất
        if (this.sprite.body.touching.down) {
            this.canJump = true;
        }
    }

    moveLeft() {
        this.sprite.body.setVelocityX(-this.moveSpeed);
        if (!this.isMoving) {
            this.bounceAnimation.resume();
            this.isMoving = true;
        }
        eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'left', x: this.sprite.x, y: this.sprite.y });
    }

    moveRight() {
        this.sprite.body.setVelocityX(this.moveSpeed);
        if (!this.isMoving) {
            this.bounceAnimation.resume();
            this.isMoving = true;
        }
        eventBus.emit(GAME_EVENTS.PLAYER_MOVE, { direction: 'right', x: this.sprite.x, y: this.sprite.y });
    }

    stopMoving() {
        if (this.isMoving) {
            this.bounceAnimation.pause();
            this.sprite.setScale(1);
            this.isMoving = false;
        }
    }

    jump() {
        this.sprite.body.setVelocityY(this.jumpForce);
        this.canJump = false;
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
