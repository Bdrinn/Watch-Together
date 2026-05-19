import './WatchLaterList.css'

export default function WatchLaterList({ playlist, currentVideoIndex, onPlayFromQueue, onRemoveFromQueue }) {
  const watchLater = playlist.slice(currentVideoIndex + 1)
  const currentVideo = currentVideoIndex >= 0 && currentVideoIndex < playlist.length ? playlist[currentVideoIndex] : null

  const extractVideoTitle = (url) => {
    // Try to extract video ID
    let videoId = ''
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0]
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]
    }
    return videoId || 'Video'
  }

  const handlePlayClick = (index) => {
    // Adjust index because watchLater is sliced
    const actualIndex = currentVideoIndex + 1 + index
    onPlayFromQueue(actualIndex)
  }

  const handleRemoveClick = (index) => {
    const actualIndex = currentVideoIndex + 1 + index
    onRemoveFromQueue(actualIndex)
  }

  return (
    <div className="watch-later-list">
      <h3>📺 Watch Later</h3>
      
      {playlist.length === 0 ? (
        <div className="empty-state">
          <p>Queue is empty</p>
          <p>Add videos to get started!</p>
        </div>
      ) : (
        <div className="list-content">
          {currentVideo && (
            <div className="current-item">
              <div className="item-label">Now Playing</div>
              <div className="item-title">
                🎬 {extractVideoTitle(currentVideo)}
              </div>
            </div>
          )}

          {watchLater.length > 0 ? (
            <div className="queue-items">
              <div className="queue-header">Up Next ({watchLater.length})</div>
              {watchLater.map((video, index) => (
                <div key={index} className="queue-item">
                  <div className="item-number">{index + 1}</div>
                  <div
                    className="item-content"
                    onClick={() => handlePlayClick(index)}
                  >
                    <div className="item-title">{extractVideoTitle(video)}</div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveClick(index)}
                    title="Remove from queue"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-queue">
              <p>No videos in queue</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
