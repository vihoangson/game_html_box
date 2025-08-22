export class Player {
    constructor(scene, x, y) {
        this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0000ff);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(0.2);
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update(gameOver) {
        if (gameOver) return;

        if (this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(200);
        } else {
            this.sprite.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(-300);
        }
    }

    die() {
        this.sprite.fillColor = 0xff0000;
    }
}
