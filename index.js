const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Point = require('./src/models/Point');
const User = require('./src/models/User');
const pointRoutes = require('./src/routes/pointRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database tables
Promise.all([
    Point.createTable(),
    User.createTable()
])
.then(() => console.log('Database tables initialized'))
.catch(err => console.error('Database initialization error:', err));

// Routes
app.use('/api/points', pointRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
