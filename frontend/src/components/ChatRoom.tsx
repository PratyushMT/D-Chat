import { MessageCircle, Copy, SendHorizontal, LogOut } from 'lucide-react'
import { sendMessage } from '../utils/sendMessage'
import { copyRoomId } from '../utils/copyRoomId'
import { handleKeyPress } from '../utils/handleKeyPress'

export const ChatRoom = ({
  socket,
  username,
  roomId,
  messages,
  setMessages,
  participants,
  message,
  setMessage,
  handleExit,
  copied,
  setCopied,
  setPage,
  enteredRoomId
}) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <div className="text-xl font-bold text-white mb-2 flex items-center">
            <MessageCircle className="mr-2" /> Room: {roomId}
          </div>
          <button 
            onClick={() => copyRoomId(roomId, setCopied)}
            className="text-blue-300 text-sm flex items-center transform active:scale-95 transition-transform"
          >
            <Copy className="mr-1" size={16} /> 
            {copied ? 'Copied!' : 'Copy Room ID'}
          </button>
        </div>
        <button 
          onClick={handleExit}
          className="text-red-500 text-sm flex items-center"
        >
          <LogOut className="mr-1" size={16} /> Exit
        </button>
      </div>
      <div className="flex space-x-2 mb-4 sm:mb-0">
        {participants.map((p: string) => (
          <span 
            key={p} 
            className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm max-w-[100px] truncate mb-2"
            title={p}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="h-96 overflow-y-auto bg-gray-700 rounded-lg mb-4 p-3 space-y-2 break-words">
        {messages.map((msg, index: number) => (
          <div 
            key={index} 
            className={`p-2 rounded-lg ${
              msg.username === username 
                ? 'bg-blue-600 text-right' 
                : 'bg-gray-600 text-left'
            }`}
          >
            <div className="font-semibold text-sm opacity-75 text-white">{msg.username}</div>
            <div className="text-white">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, 'send', username, setPage, socket, message, roomId, enteredRoomId, setMessages, setMessage)}
          placeholder="Type a message"
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
          required
        />
        <button 
          onClick={() => sendMessage(socket, message, roomId, username, setMessages, setMessage)}
          disabled={!message.trim()}
          className={`text-white p-3 rounded-lg transition-all transform active:scale-95 flex items-center ${
            message.trim() 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          <SendHorizontal className="mr-2" /> Send
        </button>
      </div>
    </div>
  );
};