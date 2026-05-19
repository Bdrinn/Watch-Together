import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import WatchRoom from './components/WatchRoom'
import RoomSelector from './components/RoomSelector'
import './App.css'

function App() {
  const [roomId, setRoomId] = useState(null)
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const newSocket = io()
    
    newSocket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const handleJoinRoom = (id) => {
    setRoomId(id)
    if (socket) {
      socket.emit('join-room', id)
    }
  }

  const handleLeaveRoom = () => {
    setRoomId(null)
  }

  return (
    <div className="app">
      {!connected ? (
        <div className="connection-status">
          <p>Connecting to server...</p>
        </div>
      ) : !roomId ? (
        <RoomSelector onJoinRoom={handleJoinRoom} />
      ) : (
        <WatchRoom 
          socket={socket} 
          roomId={roomId} 
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  )
}

export default App
