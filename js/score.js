import { eventBus } from './EventBus.js';

export class ScoreManager {
    constructor(scene) {
        this.score = 0;
        this.scoreText = scene.add.text(
            800 - 16, 16,
            'Điểm: 0',
            { fontSize: '32px', fill: '#ffffff' }
        ).setOrigin(1, 0);
    }

    increment() {
        this.score += 1;
        this.scoreText.setText('Điểm: ' + this.score);
        eventBus.emit('SCORE_UPDATED', this.score);
    }

    getScore() {
        return this.score;
    }
}
