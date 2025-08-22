let playerName = "Guest";
let game;
let player, cursors, obstacles, ground, score = 0, scoreText, gameOver = false;

// When clicking start
export function initGame() {
    document.getElementById("startButton").addEventListener("click", () => {
        playerName = document.getElementById("playerNameInput").value.trim() || "Guest";
        document.getElementById("welcomeScreen").style.display = "none";
        startGame();
    });
}

function startGame() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: "game-container",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    game = new Phaser.Game(config);
}

function preload() {
    this.load.image('tree', './imgs/tree.png');
}

function create() {
    ground = this.add.rectangle(400, 580, 800, 40, 0x228B22);
    this.physics.add.existing(ground, true);

    player = this.add.rectangle(100, 500, 50, 50, 0x0000ff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);

    this.physics.add.collider(player, ground);

    obstacles = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();

    document.body.addEventListener('pointerdown', () => {
        if (player.body.touching.down && !gameOver) {
            player.body.setVelocityY(-300);
        }
    });

    createObstacle.call(this);

    scoreText = this.add.text(800 - 16, 16, 'Điểm: 0', { fontSize: '32px', fill: '#ffffff' }).setOrigin(1, 0);
    this.add.text(16, 580, 'v.0.1', { fontSize: '16px', fill: '#000000' });
}

function update() {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
    } else {
        player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-300);
    }

    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    obstacles.getChildren().forEach(obstacle => {
        if (obstacle.x < -obstacle.width) {
            score += 1;
            scoreText.setText('Điểm: ' + score);
            obstacle.destroy();
        }
    });
}

function createObstacle() {
    if (gameOver) return;
    const x = 800 + Math.random() * 200;
    const obstacle = this.add.image(x, 530, 'tree');
    obstacles.add(obstacle);
    this.physics.add.existing(obstacle);
    obstacle.body.setVelocityX(-150);
    obstacle.body.allowGravity = false;
    obstacle.body.immovable = true;

    this.time.delayedCall(Phaser.Math.Between(2000, 4000), createObstacle, [], this);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.fillColor = 0xff0000;
    gameOver = true;
    document.getElementById('replayButton').style.display = 'block';

    fetch("https://son.vn?save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName, score })
    }).catch(err => console.error("Lỗi gửi điểm:", err));
}

export function restartGame() {
    window.location.reload();
}
