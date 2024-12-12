import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { joinRoom } from './utils/joinRoom'
import { createRoom } from './utils/createRoom'
import { RoomSelection } from './components/RoomSelection'
import { UsernameInput } from './components/UsernameInput'
import { ChatRoom } from './components/ChatRoom'

interface MessageData {
  roomId: string;
  username: string;
  message: string;
}

interface RoomJoinData {
  roomId: string;
  participants: string[];
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [enteredRoomId, setEnteredRoomId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [page, setPage] = useState<'username' | 'room' | 'chat'>('username');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL as string);
    setSocket(newSocket);

    newSocket.on('room-joined', (data: RoomJoinData) => {
      setRoomId(data.roomId);
      setParticipants(data.participants);
      setPage('chat');
    });

    newSocket.on('user-exists', () => {
      alert('Username already taken. Please choose a different username.');
      setUsername('')
    })

    newSocket.on('receive-message', (messageData: MessageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    newSocket.on('user-joined', (joinedUsername: string) => {
      setMessages(prev => [...prev, { 
        roomId: roomId, 
        username: 'System', 
        message: `${joinedUsername} joined the room` 
      }]);
      setParticipants(prev => [...prev, joinedUsername]);
    })

    newSocket.on('user-left', (leftUsername: string) => {
      setMessages(prev => [...prev, { 
        roomId: roomId, 
        username: 'System', 
        message: `${leftUsername} left the room` 
      }])
      setParticipants(prev => prev.filter(p => p !== leftUsername));
    })

    newSocket.on('connect', () => {
      if (roomId && username) {
        newSocket.emit('join-room', roomId, username, false);
      }
    })

    newSocket.on('room-not-found', () => {
      alert('Room not found. Please check the Room ID.');
      setEnteredRoomId('');  
    })
    
    newSocket.on('room-full', () => {
      alert('Room is full. Maximum 3 participants allowed.');
      setEnteredRoomId(''); 
    })

    return () => {
      if (newSocket) {
        newSocket.emit('leave-room', { roomId, username });
        newSocket.disconnect();
      }
    };
  }, []);

  const handleExit = () => {
    if (socket) {
      socket.emit('leave-room', { roomId, username });
      setPage('room');
      setRoomId('');
      setMessages([]);
      setParticipants([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-move-up">
        {page === 'username' && (
          <div>
            <h1 className="select-none text-4xl font-bold text-center font-mono text-white pt-4">D-CHAT</h1>
            <h3 className="select-none text-center text-slate-400 pb-2">Ephemeral Chat Rooms</h3>
            <UsernameInput 
              username={username}
              setUsername={setUsername}
              setPage={setPage}
              socket={socket}
              message={message}
              roomId={roomId}
              enteredRoomId={enteredRoomId}
              setMessages={setMessages}
              setMessage={setMessage} />
          </div>
        )}
        {page === 'room' && (
          <div>
            <RoomSelection 
              setPage={setPage}
              createRoom={createRoom}
              enteredRoomId={enteredRoomId}
              setEnteredRoomId={setEnteredRoomId}
              socket={socket}
              username={username}
              joinRoom={joinRoom}
              message={message}
              roomId={roomId}
              setMessages={setMessages}
              setMessage={setMessage} />
          </div>
        )}
        {page === 'chat' && (
          <div>
            <ChatRoom 
              roomId={roomId}
              copied={copied}
              setCopied={setCopied}
              participants={participants}
              messages={messages}
              username={username}
              message={message}
              setMessage={setMessage}
              handleExit={handleExit}
              socket={socket}
              setMessages={setMessages}
              setPage={setPage}
              enteredRoomId={enteredRoomId} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App;