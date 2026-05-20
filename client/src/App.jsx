import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import WatchRoom from './components/WatchRoom'
import RoomSelector from './components/RoomSelector'
import './App.css'

function App() {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      return storedTheme
    }

    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'light'
  }

  const [roomId, setRoomId] = useState(() => localStorage.getItem('roomId'))
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const pendingJoinRef = useRef(false)

  useEffect(() => {
    const newSocket = io()

    newSocket.on('connect', () => {
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    if (roomId) {
      localStorage.setItem('roomId', roomId)
      pendingJoinRef.current = true
    } else {
      localStorage.removeItem('roomId')
      pendingJoinRef.current = false
    }
  }, [roomId])

  useEffect(() => {
    if (!connected || !socket || !roomId || !pendingJoinRef.current) return

    socket.emit('join-room', roomId)
    pendingJoinRef.current = false
  }, [connected, roomId, socket])

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark')
    } else {
      document.body.classList.remove('theme-dark')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

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
      <div className="theme-toggle">
        <button onClick={handleToggleTheme} className="theme-toggle-btn">
          {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>
      {!connected ? (
        <div className="connection-status">
          <p>Connecting to server...</p>
        </div>
      ) : !roomId ? (
        <RoomSelector onJoinRoom={handleJoinRoom} />
      ) : (
        <WatchRoom socket={socket} roomId={roomId} onLeave={handleLeaveRoom} />
      )}
    </div>
  )
}

export default App
