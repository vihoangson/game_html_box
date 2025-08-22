export class LogEventBox {
    constructor() {
        this.createLogBox();
        this.maxEntries = 100;
        this.isMinimized = false;
    }

    createLogBox() {
        const box = document.createElement('div');
        box.id = 'logEventBox';

        // Tạo controls
        const controls = document.createElement('div');
        controls.className = 'log-controls';

        const title = document.createElement('span');
        title.textContent = 'Event Log';
        title.style.color = '#fff';

        const buttonGroup = document.createElement('div');

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.onclick = () => this.clearLogs();

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '▼';
        toggleBtn.onclick = () => this.toggleMinimize();

        buttonGroup.appendChild(clearBtn);
        buttonGroup.appendChild(toggleBtn);

        controls.appendChild(title);
        controls.appendChild(buttonGroup);

        box.appendChild(controls);
        document.body.appendChild(box);
    }

    clearLogs() {
        const logBox = document.getElementById('logEventBox');
        const controls = logBox.querySelector('.log-controls');
        while (logBox.lastChild) {
            logBox.removeChild(logBox.lastChild);
        }
        logBox.appendChild(controls);
    }

    toggleMinimize() {
        const logBox = document.getElementById('logEventBox');
        this.isMinimized = !this.isMinimized;
        logBox.classList.toggle('minimized');
        const toggleBtn = logBox.querySelector('.log-controls button:last-child');
        toggleBtn.textContent = this.isMinimized ? '▲' : '▼';
    }

    addLogEntry(eventName, data) {
        const logBox = document.getElementById('logEventBox');
        const entry = document.createElement('div');
        entry.className = 'log-entry';

        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="event-name">${eventName}</span>
            <span class="event-data">${JSON.stringify(data)}</span>
        `;

        // Insert after controls
        const controls = logBox.querySelector('.log-controls');
        logBox.insertBefore(entry, controls.nextSibling);

        // Limit entries
        const entries = logBox.querySelectorAll('.log-entry');
        while (entries.length > this.maxEntries) {
            logBox.removeChild(entries[entries.length - 1]);
        }
    }
}
