class EventBus {
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        EventBus.instance = this;
        this.listeners = new Map();
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
        if (!this.listeners.has(event)) return;

        this.listeners.get(event).forEach(callback => {
            callback(data);
        });
    }
}

// Singleton instance
export const eventBus = new EventBus();
