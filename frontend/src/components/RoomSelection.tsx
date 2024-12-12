import { PlusCircle, ArrowLeft } from 'lucide-react'
import { handleKeyPress } from '../utils/handleKeyPress'

export const RoomSelection = ({
    setPage,
    createRoom, 
    enteredRoomId, 
    setEnteredRoomId, 
    socket, 
    username, 
    joinRoom, 
    message, 
    roomId, 
    setMessage, 
    setMessages}) => {
    return (
        <div className="p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setPage('username')}
              className="mr-2 text-white transform active:scale-95 transition-transform"
            >
              <ArrowLeft />
            </button>
            <div className="flex-grow">
              <button 
                onClick={() => createRoom(socket, username, setEnteredRoomId)}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mb-3 transition-all transform active:scale-95 flex items-center justify-center"
              >
                <PlusCircle className="mr-2" /> Create New Room
              </button>
              <div className="text-center my-3 text-white">OR</div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Enter Room ID" 
                  value={enteredRoomId}
                  onChange={(e) => setEnteredRoomId(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'join', username, setPage, socket, message, roomId, enteredRoomId, setMessages, setMessage)}
                  className="flex-grow p-3 bg-gray-700 text-white rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
                />
                <button 
                  onClick={() => joinRoom(socket, username, enteredRoomId)}
                  disabled={!enteredRoomId.trim()}
                  className={`text-white p-3 rounded-lg transition-all transform active:scale-95 ${
                    enteredRoomId.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
    )
}