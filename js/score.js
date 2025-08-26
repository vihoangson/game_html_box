import { eventBus, GAME_EVENTS } from './EventBus.js';
import store from '../src/store';

export class ScoreManager {
    constructor(scene) {
        this.scene = scene;

        // Create score text
        this.scoreText = scene.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        // Create high score text
        this.highScoreText = scene.add.text(16, 56, `High Score: ${store.getters['point/getHighScore']}`, {
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

        // Start game in store
        store.dispatch('point/startGame');
    }

    startScoring() {
        store.dispatch('point/startGame');
        this.gameOverText.visible = false;
        this.updateScoreDisplay();
    }

    update() {
        if (store.getters['point/isGameActive']) {
            store.dispatch('point/incrementPoints', 0.1);
            this.updateScoreDisplay();
        }
    }

    onGameOver() {
        store.dispatch('point/endGame');
        this.gameOverText.visible = true;
        this.highScoreText.setText(`High Score: ${store.getters['point/getHighScore']}`);
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Score: ${Math.floor(store.getters['point/getCurrentPoints'])}`);
    }
}
