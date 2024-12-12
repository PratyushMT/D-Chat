import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const rooms = new Map<string, { id: string, participants: string[] }>()

app.use(cors());
app.use(express.json());

app.get('/generate-room', (_req, res) => {
    const roomId = generateRoomId();
    res.json({ roomId });
});

io.on('connection', (socket: Socket) => {
    socket.on('join-room', (roomId: string, username: string, isNewRoom: boolean) => {
        const room = rooms.get(roomId);

        if (!room && !isNewRoom) {
            socket.emit('room-not-found');
            return;
        }

        const newRoom = room ?? { id: roomId, participants: [] };

        if (newRoom.participants.includes(username)) {
            socket.emit('user-exists');
            return;
        }

        if (newRoom.participants.length < 3) {
            socket.join(roomId);
            socket.data.username = username;
            socket.data.roomId = roomId;
        
            newRoom.participants.push(username);
            rooms.set(roomId, newRoom);

            socket.to(roomId).emit('user-joined', username);
            socket.emit('room-joined', { roomId, participants: newRoom.participants });
        } 
        else {
            socket.emit('room-full');
        }
  });

  socket.on('send-message', (data: { roomId: string, username: string, message: string }) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('leave-room', (data: { roomId: string, username: string }) => {
    const room = rooms.get(data.roomId);
    if (room) {
      room.participants = room.participants.filter((p: string) => p !== data.username);
      if (room.participants.length === 0) {
        rooms.delete(data.roomId);
      } else {
        rooms.set(data.roomId, room);
      }
      socket.to(data.roomId).emit('user-left', data.username);
    }
  });
});


function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
