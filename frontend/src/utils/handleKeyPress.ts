import { KeyboardEvent } from 'react';
import { Socket } from 'socket.io-client';
import { sendMessage } from './sendMessage';
import { joinRoom } from './joinRoom';
import { MessageData } from './sendMessage';

export const handleKeyPress = (
  e: KeyboardEvent<HTMLInputElement>,
  action: 'next' | 'send' | 'join',
  username: string,
  setStage: React.Dispatch<React.SetStateAction<'username' | 'room' | 'chat'>>,
  socket: Socket | null,
  message: string,
  roomId: string,
  enteredRoomId: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (e.key === 'Enter') {
    switch (action) {
      case 'next':
        if (username.trim()) setStage('room');
        break;
      case 'send':
        sendMessage(socket, message, roomId, username, setMessages, setMessage);
        break;
      case 'join':
        joinRoom(socket, username, enteredRoomId);
        break;
    }
  }
};