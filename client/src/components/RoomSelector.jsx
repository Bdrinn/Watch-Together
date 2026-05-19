import { useState } from 'react'
import './RoomSelector.css'

export default function RoomSelector({ onJoinRoom }) {
  const [roomId, setRoomId] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()
    if (roomId.trim()) {
      onJoinRoom(roomId.trim())
    }
  }

  const handleCreateNew = () => {
    const newRoomId = 'room-' + Math.random().toString(36).substr(2, 9)
    onJoinRoom(newRoomId)
  }

  return (
    <div className="room-selector">
      <div className="room-card">
        <h1>🎬 Watch Together</h1>
        <p>Watch YouTube videos in sync with your friends</p>
        
        <form onSubmit={handleJoin} className="form">
          <input
            type="text"
            placeholder="Enter room code..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="room-input"
          />
          <button type="submit" className="btn btn-primary">
            Join Room
          </button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleCreateNew} className="btn btn-secondary">
          Create New Room
        </button>

        <p className="info">
          💡 Create a new room and share the code with friends to watch together!
        </p>
      </div>
    </div>
  )
}
