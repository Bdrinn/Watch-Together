import './RoomInfo.css'

export default function RoomInfo({ roomId, userCount, onLeave }) {
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId)
    alert('Room code copied: ' + roomId)
  }

  return (
    <div className="room-info">
      <div className="info-item">
        <span className="label">👥 Users:</span>
        <span className="value">{userCount}</span>
      </div>
      
      <div className="info-item">
        <span className="label">🏠 Room:</span>
        <span className="value code">{roomId}</span>
        <button onClick={copyRoomCode} className="copy-btn" title="Copy room code">
          📋
        </button>
      </div>

      <button onClick={onLeave} className="leave-btn">
        Leave Room
      </button>
    </div>
  )
}
