import { useEffect, useRef, useState } from 'react'
import YouTubePlayer from './YouTubePlayer'
import RoomInfo from './RoomInfo'
import WatchLaterList from './WatchLaterList'
import './WatchRoom.css'

export default function WatchRoom({ socket, roomId, onLeave }) {
  const [currentVideo, setCurrentVideo] = useState('')
  const [playlist, setPlaylist] = useState([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1)
  const [inputUrl, setInputUrl] = useState('')
  const [userCount, setUserCount] = useState(1)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!socket) return

    const handleRoomState = (state) => {
      if (state.currentVideo) {
        setCurrentVideo(state.currentVideo)
        setCurrentVideoIndex(state.currentVideoIndex)
        setPlaylist(state.playlist)
      }
    }

    const handleVideoChanged = (data) => {
      setCurrentVideo(data.currentVideo)
      setCurrentVideoIndex(data.currentVideoIndex)
      setPlaylist(data.playlist)
    }

    const handlePlaylistUpdated = (data) => {
      setPlaylist(data.playlist)
      setCurrentVideoIndex(data.currentVideoIndex)
    }

    const handleUserJoined = (data) => {
      setUserCount(data.userCount)
    }

    const handleUserLeft = (data) => {
      setUserCount(data.userCount)
    }

    socket.on('room-state', handleRoomState)
    socket.on('video-changed', handleVideoChanged)
    socket.on('playlist-updated', handlePlaylistUpdated)
    socket.on('user-joined', handleUserJoined)
    socket.on('user-left', handleUserLeft)

    return () => {
      socket.off('room-state', handleRoomState)
      socket.off('video-changed', handleVideoChanged)
      socket.off('playlist-updated', handlePlaylistUpdated)
      socket.off('user-joined', handleUserJoined)
      socket.off('user-left', handleUserLeft)
    }
  }, [socket])

  const handleSetVideo = (e) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      setInputUrl('')
      socket.emit('set-video', {
        roomId,
        videoUrl: inputUrl.trim()
      })
    }
  }

  const handlePlayFromQueue = (index) => {
    socket.emit('play-from-queue', {
      roomId,
      index
    })
  }

  const handleRemoveFromQueue = (index) => {
    socket.emit('remove-from-queue', {
      roomId,
      index
    })
  }

  const handleLeaveRoom = () => {
    onLeave()
  }

  return (
    <div className="watch-room">
      <div className="container">
        <div className="header">
          <h1>🎬 Watch Together</h1>
          <RoomInfo roomId={roomId} userCount={userCount} onLeave={handleLeaveRoom} />
        </div>

        <div className="main-content">
          <div className="video-section">
            {currentVideo ? (
              <YouTubePlayer 
                videoUrl={currentVideo} 
                roomId={roomId}
                socket={socket}
                playerRef={playerRef}
              />
            ) : (
              <div className="no-video">
                <p>📹 No video selected</p>
                <p>Enter a YouTube link to start watching!</p>
              </div>
            )}
          </div>

          <div className="sidebar">
            <div className="controls-section">
              <form onSubmit={handleSetVideo} className="video-form">
                <input
                  type="url"
                  placeholder="Paste YouTube URL..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="video-input"
                />
                <button type="submit" className="btn-set-video">
                  {currentVideo ? 'Add to Queue' : 'Play Now'}
                </button>
              </form>
              
              <div className="tips">
                <h3>💡 Tips:</h3>
                <ul>
                  <li>Paste any YouTube link</li>
                  <li>First video plays now</li>
                  <li>More videos go to queue</li>
                  <li>Click to play from queue</li>
                </ul>
              </div>
            </div>

            <WatchLaterList 
              playlist={playlist}
              currentVideoIndex={currentVideoIndex}
              onPlayFromQueue={handlePlayFromQueue}
              onRemoveFromQueue={handleRemoveFromQueue}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
