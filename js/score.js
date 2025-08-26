import { eventBus, GAME_EVENTS } from './EventBus.js';

export class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.isGameRunning = false;

        // Create score text
        this.scoreText = scene.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        // Create high score text
        this.highScoreText = scene.add.text(16, 56, `High Score: ${this.highScore}`, {
            fontSize: '24px',
            fill: '#666'
        });

        // Create game over text (hidden initially)
        this.gameOverText = scene.add.text(400, 300, 'GAME OVER\nPress SPACE or Click to restart', {
            fontSize: '48px',
            fill: '#000',
            align: 'center'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = false;

        // Listen to game events
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.onGameOver());
        eventBus.on(GAME_EVENTS.GAME_START, () => this.startScoring());
    }

    startScoring() {
        this.score = 0;
        this.isGameRunning = true;
        this.gameOverText.visible = false;
        this.updateScoreDisplay();
    }

    update() {
        if (this.isGameRunning) {
            this.score += 0.1;
            this.updateScoreDisplay();
        }
    }

    onGameOver() {
        this.isGameRunning = false;
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('highScore', this.highScore);
            this.highScoreText.setText(`High Score: ${this.highScore}`);
        }
        this.gameOverText.visible = true;
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
    }
}
