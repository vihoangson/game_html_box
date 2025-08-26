const Point = require('../models/Point');

class PointController {
    async getAllPoints(req, res) {
        try {
            const points = await Point.findAll();
            res.json(points);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getPointByUserId(req, res) {
        try {
            const point = await Point.findByUserId(req.params.user_id);
            if (!point) {
                return res.status(404).json({ error: 'Point record not found' });
            }
            res.json(point);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createPoint(req, res) {
        try {
            const { user_id, points, description } = req.body;
            if (!user_id || !points) {
                return res.status(400).json({ error: 'user_id and points are required' });
            }

            const point = new Point({ user_id, points, description });
            const savedPoint = await point.save();
            res.status(201).json(savedPoint);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updatePoint(req, res) {
        try {
            const { points, description } = req.body;
            const { user_id } = req.params;

            if (!points) {
                return res.status(400).json({ error: 'points is required' });
            }

            const existingPoint = await Point.findByUserId(user_id);
            if (!existingPoint) {
                return res.status(404).json({ error: 'Point record not found' });
            }

            existingPoint.points = points;
            existingPoint.description = description;
            const updatedPoint = await existingPoint.save();
            res.json(updatedPoint);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deletePoint(req, res) {
        try {
            const deleted = await Point.delete(req.params.user_id);
            if (!deleted) {
                return res.status(404).json({ error: 'Point record not found' });
            }
            res.json({ message: 'Point record deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new PointController();
