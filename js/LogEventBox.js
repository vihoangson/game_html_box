export class LogEventBox {
    constructor() {
        // Kiểm tra mobile trước khi tạo box
        if (this.isMobileDevice()) {
            return; // Không tạo event box trên mobile
        }
        this.createLogBox();
        this.maxEntries = 100;
        this.isMinimized = false;
    }

    isMobileDevice() {
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth <= 768
            || ('ontouchstart' in window)
            || (navigator.maxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0);
        return mobile;
    }

    createLogBox() {
        // Kiểm tra nếu đã tồn tại thì xóa
        const existingBox = document.getElementById('logEventBox');
        if (existingBox) {
            existingBox.remove();
        }

        const box = document.createElement('div');
        box.id = 'logEventBox';
        box.style.position = 'fixed';
        box.style.right = '20px';
        box.style.bottom = '20px';
        box.style.width = '300px';
        box.style.maxHeight = '300px';
        box.style.zIndex = '9999';
        box.style.display = this.isMobileDevice() ? 'none' : 'block';

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

        // Thêm listener cho resize window
        window.addEventListener('resize', () => {
            if (this.logBox) {
                this.logBox.style.display = this.isMobileDevice() ? 'none' : 'block';
            }
        });
    }

    clearLogs() {
        if (!this.logBox) return;
        const controls = this.logBox.querySelector('.log-controls');
        while (this.logBox.lastChild) {
            this.logBox.removeChild(this.logBox.lastChild);
        }
        this.logBox.appendChild(controls);
    }

    toggleMinimize() {
        if (!this.logBox) return;
        this.isMinimized = !this.isMinimized;
        this.logContent.style.display = this.isMinimized ? 'none' : 'block';
    }

    addLogEntry(eventName, data) {
        if (!this.logBox || this.isMobileDevice()) return;

        const logBox = document.getElementById('logEventBox');
        if (!logBox) return;

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
