        this.created_at = data.created_at;

    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
                if (err) reject(err);
                resolve(rows.map(row => new User(row)));
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            if (this.id) {
                // Update
                db.run(
                    'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                    [this.username, this.email, this.password, this.id],
                    (err) => {
                        if (err) reject(err);
                        resolve(this);
                    }
                );
            } else {
                // Insert
                db.run(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [this.username, this.email, this.password],
                    function(err) {
                        if (err) reject(err);
                        this.id = this.lastID;
                        resolve(this);
                    }
                );
            }
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    // Remove password when converting to JSON
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}

module.exports = User;
