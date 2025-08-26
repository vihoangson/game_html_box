export class LogEventBox {
    constructor() {
        this.createLogBox();
        this.maxEntries = 100;
        this.isMinimized = false;
    }

    createLogBox() {
        const box = document.createElement('div');
        box.id = 'logEventBox';
        box.style.position = 'fixed';
        box.style.bottom = '0';
        box.style.left = '0';
        box.style.right = '0';
        box.style.zIndex = '1000';

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

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '-';
        minimizeBtn.onclick = () => this.toggleMinimize();

        buttonGroup.appendChild(clearBtn);
        buttonGroup.appendChild(minimizeBtn);

        controls.appendChild(title);
        controls.appendChild(buttonGroup);

        // Create log content container
        const logContent = document.createElement('div');
        logContent.id = 'logContent';

        box.appendChild(controls);
        box.appendChild(logContent);

        document.body.appendChild(box);

        this.logBox = box;
        this.logContent = logContent;
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
        this.isMinimized = !this.isMinimized;
        this.logContent.style.display = this.isMinimized ? 'none' : 'block';
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
        let entries = logBox.querySelectorAll('.log-entry');
        while (entries.length > this.maxEntries) {
            const lastEntry = logBox.querySelector('.log-entry:last-child');
            if (lastEntry && logBox.contains(lastEntry)) {
                logBox.removeChild(lastEntry);
            } else {
                break;
            }
            entries = logBox.querySelectorAll('.log-entry');
        }
    }
}
