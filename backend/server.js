require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db.js');
const Message = require('./MessageSchema');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']  
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/workers',  require('./routes/worker'));
app.use('/api/requests', require('./routes/request'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/messages', require('./routes/message'));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (requestId) => {
        socket.join(requestId);
        console.log(`Joined room: ${requestId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            const newMsg = new Message({
                requestId:  data.requestId,
                senderId:   data.senderId,
                senderName: data.senderName,
                message:    data.message,
            });
            await newMsg.save();

            io.to(data.requestId).emit('receive_message', {
                _id:       newMsg._id,
                requestId: data.requestId,
                senderId:  data.senderId,
                senderName:data.senderName,
                message:   data.message,
                createdAt: newMsg.createdAt,
                time: new Date(newMsg.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                })
            });

        } catch (err) {
            console.error('Socket error:', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/', (req, res) => res.send("Server running..."));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});