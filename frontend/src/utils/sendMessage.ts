import { Socket } from 'socket.io-client';

export interface MessageData {
  roomId: string;
  username: string;
  message: string;
}

export const sendMessage = (
  socket: Socket | null,
  message: string,
  roomId: string,
  username: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (socket && message.trim() && roomId) {
    const messageData: MessageData = {
      roomId,
      username,
      message: message.trim()
    };
    
    socket.emit('send-message', messageData);
    setMessages(prev => [...prev, messageData]);
    setMessage('');
  }
};