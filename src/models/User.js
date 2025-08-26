const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('points.db');

function User(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
}

User.createTable = function() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

User.findAll = function() {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
            if (err) reject(err);
            resolve(rows.map(row => new User(row)));
        });
    });
};

User.findById = function(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            resolve(row ? new User(row) : null);
        });
    });
};

User.findByUsername = function(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            resolve(row ? new User(row) : null);
        });
    });
};

User.prototype.save = function() {
    const self = this;
    return new Promise((resolve, reject) => {
        if (this.id) {
            // Update
            db.run(
                'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                [this.username, this.email, this.password, this.id],
                (err) => {
                    if (err) reject(err);
                    resolve(self);
                }
            );
        } else {
            // Insert
            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [this.username, this.email, this.password],
                function(err) {
                    if (err) reject(err);
                    self.id = this.lastID;
                    resolve(self);
                }
            );
        }
    });
};

User.delete = function(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
            if (err) reject(err);
            resolve(this.changes > 0);
        });
    });
};

User.prototype.toJSON = function() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
};

module.exports = User;
