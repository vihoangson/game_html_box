export class VirtualJoystick {
    constructor(scene) {
        this.scene = scene;

        // Tạo base và thumb cho joystick
        this.base = scene.add.circle(100, 500, 50, 0x888888, 0.5);
        this.thumb = scene.add.circle(100, 500, 25, 0x000000, 0.8);

        // Đặt vị trí mặc định
        this.baseX = 100;
        this.baseY = 500;

        // Cấu hình để thumb có thể kéo
        this.thumb.setInteractive();
        scene.input.setDraggable(this.thumb);

        // Đặt độ giới hạn di chuyển của thumb
        this.radius = 50;

        // Biến để lưu trạng thái
        this.isMoving = false;
        this.direction = {
            left: false,
            right: false,
            up: false
        };

        // Xử lý các sự kiện touch/drag
        scene.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject === this.thumb) {
                this.isMoving = true;
            }
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.thumb) {
                const distance = Phaser.Math.Distance.Between(this.baseX, this.baseY, dragX, dragY);
                const angle = Phaser.Math.Angle.Between(this.baseX, this.baseY, dragX, dragY);

                if (distance <= this.radius) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                } else {
                    gameObject.x = this.baseX + Math.cos(angle) * this.radius;
                    gameObject.y = this.baseY + Math.sin(angle) * this.radius;
                }

                // Tính toán hướng di chuyển
                const deadZone = 10;
                const dx = gameObject.x - this.baseX;
                const dy = gameObject.y - this.baseY;

                this.direction = {
                    left: dx < -deadZone,
                    right: dx > deadZone,
                    up: dy < -deadZone
                };
            }
        });

        scene.input.on('dragend', (pointer, gameObject) => {
            if (gameObject === this.thumb) {
                this.isMoving = false;
                this.direction = { left: false, right: false, up: false };

                // Reset vị trí thumb
                gameObject.x = this.baseX;
                gameObject.y = this.baseY;
            }
        });

        // Ẩn trên desktop
        if (!scene.sys.game.device.input.touch) {
            this.base.setVisible(false);
            this.thumb.setVisible(false);
        }
    }

    getDirection() {
        return this.direction;
    }

    destroy() {
        this.base.destroy();
        this.thumb.destroy();
    }
}

