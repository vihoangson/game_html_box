const User = require('../models/User');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Username, email and password are required' });
            }

            // Check if username already exists
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ error: 'Username already exists' });
            }

            const user = new User({ username, email, password });
            const savedUser = await user.save();

            // Remove password from response
            const { password: _, ...userWithoutPassword } = savedUser;
            res.status(201).json(userWithoutPassword);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { username, email, password } = req.body;
            const { id } = req.params;

            const existingUser = await User.findById(id);
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // If username is changing, check if new username is available
            if (username && username !== existingUser.username) {
                const userWithUsername = await User.findByUsername(username);
                if (userWithUsername) {
                    return res.status(409).json({ error: 'Username already exists' });
                }
            }

            existingUser.username = username || existingUser.username;
            existingUser.email = email || existingUser.email;
            existingUser.password = password || existingUser.password;

            const updatedUser = await existingUser.save();
            // Remove password from response
            const { password: _, ...userWithoutPassword } = updatedUser;
            res.json(userWithoutPassword);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const deleted = await User.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new UserController();
