const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { nodeEnv } = require('./secret');

// Import routes
const authRoutes = require('./routes/auth.routes');
const folderRoutes = require("./routes/folder.routes");
const noteRoutes =  require("./routes/note.routes");
const fileRoutes = require('./routes/file.routes');
const favoriteRoutes = require('./routes/favorite.routes');

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

if (nodeEnv !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(cors());

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'greetings' });
});

// All routes
app.use('/api/auth', authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/favorites', favoriteRoutes);

// Default error handler
app.use((err, _req, res, _next) => {
  const message = err.message || 'Server Error Occurred';
  const status = err.status || 500; // default 500
  res.status(status).json({
    message,
    status,
  });
});

module.exports = app;
