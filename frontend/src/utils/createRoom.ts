import { Socket } from 'socket.io-client';

export const createRoom = (
  socket: Socket | null,
  username: string,
  setEnteredRoomId: React.Dispatch<React.SetStateAction<string>>
) => {
  if (socket && username.trim()) {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-room`)
      .then(res => res.json())
      .then((data: { roomId: string }) => {
        socket.emit('join-room', data.roomId, username, true);
        setEnteredRoomId(data.roomId);
      });
  }
};