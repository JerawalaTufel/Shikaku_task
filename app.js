const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));   

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.render('index');
});
// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});