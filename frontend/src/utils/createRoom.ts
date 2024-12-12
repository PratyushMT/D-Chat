import { Socket } from 'socket.io-client';

export const createRoom = (
  socket: Socket | null,
  username: string,
  setEnteredRoomId: React.Dispatch<React.SetStateAction<string>>
) => {
  if (socket && username.trim()) {
    fetch('http://localhost:3001/generate-room')
      .then(res => res.json())
      .then((data: { roomId: string }) => {
        socket.emit('join-room', data.roomId, username, true);
        setEnteredRoomId(data.roomId);
      });
  }
};