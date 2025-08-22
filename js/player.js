import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(0.2);
        this.cursors = scene.input.keyboard.createCursorKeys();

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

        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.jump();
        }
    }

    jump() {
        if (this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(-300);
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
