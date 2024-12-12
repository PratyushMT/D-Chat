import { User } from 'lucide-react'
import { handleKeyPress } from '../utils/handleKeyPress'

// @ts-ignore
export const UsernameInput = ({
    username,
    setUsername,
    setPage,
    socket,
    message,
    roomId,
    enteredRoomId,
    setMessages,
    setMessage
}) => {
    return (
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <User className="mr-2 text-white" />
            <input 
              type="text" 
              placeholder="Enter Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'next', username, setPage, socket, message, roomId, enteredRoomId, setMessages, setMessage)}
              maxLength={8}
              className="w-full p-3 bg-gray-700 text-white rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
              required
            />
          </div>
          <button 
            onClick={() => setPage('room')}
            disabled={!username.trim()}
            className={`w-full text-white p-3 rounded-lg transition-all transform active:scale-95 ${
              username.trim() 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
    )
}