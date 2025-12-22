const http = require('http');
const app = require('./backend/src/app');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*', // open for local frontend dev
        methods: ['GET', 'POST']
    }
});

app.set('io', io); // store io in app for controllers

io.on('connection', socket => {
    console.log('Socket.io client connected:', socket.id);
    // bisa tambahkan listener event di sini
});

server.listen(3000, () => console.log('NOKOSKU backend running on http://localhost:3000'));
