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

        // Create replay button (hidden initially)
        this.createReplayButton();
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
        this.gameOverText = this.scene.add.text(400, 300, 'GAME OVER', {
            fontSize: '48px',
            fill: '#000',
            align: 'center'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = false;
    }

    createReplayButton() {
        const replayButton = document.createElement('button');
        replayButton.id = 'replayButton';
        replayButton.textContent = 'Play Again';
        replayButton.style.display = 'none';
        document.getElementById('game-container').appendChild(replayButton);

        replayButton.addEventListener('click', () => {
            window.location.reload(); // Thay đổi từ restartGame() thành reload()
        });

        this.replayButton = replayButton;
    }

    setupEventListeners() {
        this.gameOverHandler = () => this.onGameOver();
        this.startScoringHandler = () => this.startScoring();

        eventBus.on(GAME_EVENTS.GAME_OVER, this.gameOverHandler);
        eventBus.on(GAME_EVENTS.GAME_START, this.startScoringHandler);

        // Add scene shutdown listener
        this.scene.events.on('shutdown', () => this.cleanup());
        this.scene.events.on('destroy', () => this.cleanup());

        // Add keyboard listener for restart
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            if (!store.getters['point/isGameActive']) {
                this.restartGame();
            }
        });
    }

    cleanup() {
        eventBus.off(GAME_EVENTS.GAME_OVER, this.gameOverHandler);
        eventBus.off(GAME_EVENTS.GAME_START, this.startScoringHandler);

        if (this.scoreText && this.scoreText.scene) this.scoreText.destroy();
        if (this.highScoreText && this.highScoreText.scene) this.highScoreText.destroy();
        if (this.gameOverText && this.gameOverText.scene) this.gameOverText.destroy();
        if (this.replayButton) {
            this.replayButton.remove();
            this.replayButton = null;
        }
    }

    startScoring() {
        if (!this.scene || !this.scene.scene.isActive()) return;

        store.dispatch('point/startGame');
        if (this.gameOverText && this.gameOverText.scene) {
            this.gameOverText.visible = false;
        }
        if (this.replayButton) {
            this.replayButton.style.display = 'none';
        }
        this.updateScoreDisplay();
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
        if (this.replayButton) {
            this.replayButton.style.display = 'block';
        }
    }

    restartGame() {
        if (this.replayButton) {
            this.replayButton.style.display = 'none';
        }
        window.location.reload(); // Thêm reload ở đây để đảm bảo mọi cách restart đều reload
    }

    updateScoreDisplay() {
        if (!this.scene || !this.scene.scene.isActive() || !this.scoreText || !this.scoreText.scene) return;

        this.scoreText.setText(`Score: ${Math.floor(store.getters['point/getCurrentPoints'])}`);
    }

    update() {
        if (!this.scene || !this.scene.scene.isActive()) return;

        if (store.getters['point/isGameActive']) {
            store.dispatch('point/incrementPoints', 0.1);
            this.updateScoreDisplay();
        }
    }
}
