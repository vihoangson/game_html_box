import { eventBus, GAME_EVENTS } from './EventBus.js';
import store from '../src/store';

export class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.createTextObjects();

        // Listen to game events
        this.setupEventListeners();

        // Start game in store
        store.dispatch('point/startGame');
    }

    createTextObjects() {
        // Create score text
        this.scoreText = this.scene.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        // Create high score text
        this.highScoreText = this.scene.add.text(16, 56, `High Score: ${store.getters['point/getHighScore']}`, {
            fontSize: '24px',
            fill: '#666'
        });

        // Create game over text (hidden initially)
        this.gameOverText = this.scene.add.text(400, 300, 'GAME OVER\nPress SPACE or Click to restart', {
            fontSize: '48px',
            fill: '#000',
            align: 'center'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = false;
    }

    setupEventListeners() {
        // Store event listeners for cleanup
        this.gameOverHandler = () => this.onGameOver();
        this.startScoringHandler = () => this.startScoring();

        eventBus.on(GAME_EVENTS.GAME_OVER, this.gameOverHandler);
        eventBus.on(GAME_EVENTS.GAME_START, this.startScoringHandler);

        // Add scene shutdown listener
        this.scene.events.on('shutdown', () => this.cleanup());
        this.scene.events.on('destroy', () => this.cleanup());
    }

    cleanup() {
        // Remove event listeners
        eventBus.off(GAME_EVENTS.GAME_OVER, this.gameOverHandler);
        eventBus.off(GAME_EVENTS.GAME_START, this.startScoringHandler);

        // Destroy text objects if they exist
        if (this.scoreText && !this.scoreText.scene) this.scoreText.destroy();
        if (this.highScoreText && !this.highScoreText.scene) this.highScoreText.destroy();
        if (this.gameOverText && !this.gameOverText.scene) this.gameOverText.destroy();

        // Clear references
        this.scoreText = null;
        this.highScoreText = null;
        this.gameOverText = null;
    }

    startScoring() {
        if (!this.scene || !this.scene.scene.isActive()) return;

        store.dispatch('point/startGame');
        if (this.gameOverText && this.gameOverText.scene) {
            this.gameOverText.visible = false;
        }
        this.updateScoreDisplay();
    }

    update() {
        if (!this.scene || !this.scene.scene.isActive()) return;

        if (store.getters['point/isGameActive']) {
            store.dispatch('point/incrementPoints', 0.1);
            this.updateScoreDisplay();
        }
    }

    onGameOver() {
        if (!this.scene || !this.scene.scene.isActive()) return;

        store.dispatch('point/endGame');
        if (this.gameOverText && this.gameOverText.scene) {
            this.gameOverText.visible = true;
        }
        if (this.highScoreText && this.highScoreText.scene) {
            this.highScoreText.setText(`High Score: ${store.getters['point/getHighScore']}`);
        }
    }

    updateScoreDisplay() {
        if (!this.scene || !this.scene.scene.isActive() || !this.scoreText || !this.scoreText.scene) return;

        this.scoreText.setText(`Score: ${Math.floor(store.getters['point/getCurrentPoints'])}`);
    }
}
