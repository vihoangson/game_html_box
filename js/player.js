import { eventBus, GAME_EVENTS } from './EventBus.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        // Position the player at the left side of the screen
        this.sprite = scene.add.sprite(150, 530, 'player');
        scene.physics.add.existing(this.sprite);

        // Configure physics for dinosaur-like jumping
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setGravityY(1500);
        this.jumpForce = -700;
        this.isJumping = false;

        // Setup keyboard controls
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.COLLISION_DETECTED, () => this.die());

        // Add spacebar and touch/click controls for jumping
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        scene.input.on('pointerdown', () => this.jump());
    }

    update() {
        // Only allow jumping when touching the ground
        if (this.sprite.body.touching.down) {
            this.isJumping = false;
        }

        // Jump controls
        if ((this.jumpKey.isDown || this.cursors.up.isDown) && !this.isJumping && this.sprite.body.touching.down) {
            this.jump();
        }
    }

    jump() {
        if (!this.isJumping && this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(this.jumpForce);
            this.isJumping = true;
        }
    }

    die() {
        this.sprite.setTint(0xff0000);
        eventBus.emit(GAME_EVENTS.GAME_OVER);
    }

    onGameOver() {
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setVelocityY(0);
    }

    getSprite() {
        return this.sprite;
    }
}
