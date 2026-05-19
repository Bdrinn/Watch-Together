import { useEffect, useRef, useState } from 'react'
import './YouTubePlayer.css'

export default function YouTubePlayer({ videoUrl, roomId, socket, playerRef }) {
  const iframeRef = useRef(null)
  const [videoId, setVideoId] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const remoteSeekRef = useRef(false)
  const playStateRef = useRef(false)

  // Extract YouTube video ID from URL
  useEffect(() => {
    const id = extractVideoId(videoUrl)
    setVideoId(id)
  }, [videoUrl])

  useEffect(() => {
    if (!socket) return

    const handleVideoPlay = () => {
      setIsPlaying(true)
      playStateRef.current = true
    }

    const handleVideoPause = () => {
      setIsPlaying(false)
      playStateRef.current = false
    }

    const handleVideoSeek = (data) => {
      setCurrentTime(data.currentTime)
      remoteSeekRef.current = true
    }

    const handleVideoChanged = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    socket.on('video-play', handleVideoPlay)
    socket.on('video-pause', handleVideoPause)
    socket.on('video-seek', handleVideoSeek)
    socket.on('video-changed', handleVideoChanged)

    return () => {
      socket.off('video-play', handleVideoPlay)
      socket.off('video-pause', handleVideoPause)
      socket.off('video-seek', handleVideoSeek)
      socket.off('video-changed', handleVideoChanged)
    }
  }, [socket])

  const extractVideoId = (url) => {
    if (!url) return ''
    
    let videoId = ''
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0]
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]
    } else {
      videoId = url
    }
    
    return videoId
  }

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      socket?.emit('play', roomId)
    }
  }

  const handlePause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      socket?.emit('pause', roomId)
    }
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    socket?.emit('seek', { roomId, currentTime: newTime })
  }

  return (
    <div className="youtube-player">
      <div className="video-container">
        {videoId ? (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="no-video-placeholder">
            No video selected
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="button-group">
          {isPlaying ? (
            <button onClick={handlePause} className="control-btn pause-btn" title="Pause">
              ⏸️
            </button>
          ) : (
            <button onClick={handlePlay} className="control-btn play-btn" title="Play">
              ▶️
            </button>
          )}
        </div>

        <div className="sync-status">
          {isPlaying ? '🎬 Playing' : '⏸️ Paused'}
        </div>

        <div className="info-text">
          📹 All controls sync automatically
        </div>
      </div>
    </div>
  )
}
