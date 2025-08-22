import { eventBus, GAME_EVENTS } from './EventBus.js';

export class ScoreManager {
    constructor(scene) {
        this.score = 0;
        this.scoreText = scene.add.text(
            800 - 16, 16,
            'Điểm: 0',
            { fontSize: '32px', fill: '#ffffff' }
        ).setOrigin(1, 0);

        // Listen to obstacle removed event to increment score
        eventBus.on(GAME_EVENTS.OBSTACLE_REMOVED, () => this.increment());

        // Listen to game over to save score
        eventBus.on(GAME_EVENTS.GAME_OVER, () => this.saveScore());
    }

    increment() {
        this.score += 1;
        this.scoreText.setText('Điểm: ' + this.score);
        eventBus.emit(GAME_EVENTS.SCORE_UPDATED, { score: this.score });
    }

    saveScore() {
        const playerName = localStorage.getItem('playerName') || 'Khách';
        fetch("https://son.vn?save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: playerName,
                score: this.score
            })
        }).catch(err => console.error("Lỗi gửi điểm:", err));
    }

    getScore() {
        return this.score;
    }
}
