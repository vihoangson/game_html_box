const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('points.db');

function Point(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.points = data.points;
    this.description = data.description;
    this.created_at = data.created_at;
}

Point.createTable = function() {
    const sql = `CREATE TABLE IF NOT EXISTS points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        points INTEGER NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

Point.findAll = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM points', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows.map(row => new Point(row)));
        });
    });
};

Point.findByUserId = function(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM points WHERE user_id = ?', [userId], (err, row) => {
            if (err) reject(err);
            resolve(row ? new Point(row) : null);
        });
    });
};

Point.prototype.save = function() {
    const self = this;
    return new Promise((resolve, reject) => {
        if (this.id) {
            // Update
            db.run(
                'UPDATE points SET points = ?, description = ? WHERE user_id = ?',
                [this.points, this.description, this.user_id],
                (err) => {
                    if (err) reject(err);
                    resolve(self);
                }
            );
        } else {
            // Insert
            db.run(
                'INSERT INTO points (user_id, points, description) VALUES (?, ?, ?)',
                [this.user_id, this.points, this.description],
                function(err) {
                    if (err) reject(err);
                    self.id = this.lastID;
                    resolve(self);
                }
            );
        }
    });
};

Point.delete = function(userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM points WHERE user_id = ?', userId, function(err) {
            if (err) reject(err);
            resolve(this.changes > 0);
        });
    });
};

module.exports = Point;
