import { Socket } from 'socket.io-client';

export const joinRoom = (
  socket: Socket | null,
  username: string,
  enteredRoomId: string
) => {
  if (socket && username.trim() && enteredRoomId.trim()) {
    socket.emit('join-room', enteredRoomId, username, false);
  }
};