import { LogEventBox } from './LogEventBox.js';

// Game Events
export const GAME_EVENTS = {
    GAME_START: 'GAME_START',
    GAME_OVER: 'GAME_OVER',
    GAME_RESTART: 'GAME_RESTART',
    PLAYER_JUMP: 'PLAYER_JUMP',
    PLAYER_DIE: 'PLAYER_DIE',
    PLAYER_MOVE: 'PLAYER_MOVE',
    SCORE_UPDATED: 'SCORE_UPDATED',
    OBSTACLE_CREATED: 'OBSTACLE_CREATED',
    OBSTACLE_REMOVED: 'OBSTACLE_REMOVED',
    COLLISION_DETECTED: 'COLLISION_DETECTED',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE'
};

class EventBus {
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        EventBus.instance = this;
        this.listeners = new Map();
        this.logger = new LogEventBox();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;

        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        // Log the event
        this.logger.addLogEntry(event, data);

        if (!this.listeners.has(event)) return;

        this.listeners.get(event).forEach(callback => {
            callback(data);
        });
    }
}

// Singleton instance
export const eventBus = new EventBus();
