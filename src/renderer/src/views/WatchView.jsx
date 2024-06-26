import React from 'react'
import PropTypes from 'prop-types'

import { Link, useParams } from 'react-router-dom'
import '../styles/views/WatchView.css'

function WatchView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  const [video, setVideo] = React.useState({})
  const [series, setSeries] = React.useState({})
  const { id } = useParams()

  setActivePage('')

  React.useMemo(() => {
    fetch(`http://${settings['server-address']}/api/v1/videos/${id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        setVideo(responseJson.data)
      })
  }, [id])

  React.useMemo(() => {
    if (video.id !== id) return

    fetch(`http://${settings['server-address']}/api/v1/series/${video.series_id}`)
      .then((response) => response.json())
      .then((responseJson) => setSeries(responseJson.data))
  }, [video])

  return (
    <div className="watchview-container">
      <video
        className="video-player"
        src={`http://${settings['server-address']}/api/v1/stream/${id}`}
        controls
      />
      <div className="video-info">
        <div className="video-quick-info">
          <h1 className="video-title">{series.title}</h1>
          <div className="video-navigation">
            <Link
              className={
                'video-navigation-buttons' +
                (!video.previous_episode?.id ? ' navigation-disabled' : '')
              }
              to={!video.previous_episode?.id ? '' : `/watch/${video.previous_episode.id}`}
            >
              Prev
            </Link>
            <Link
              className={
                'video-navigation-buttons' + (!video.next_episode?.id ? ' navigation-disabled' : '')
              }
              to={!video.next_episode?.id ? '' : `/watch/${video.next_episode.id}`}
            >
              Next
            </Link>
          </div>
        </div>
        <p className="video-description">{series.description}</p>
      </div>
    </div>
  )
}

WatchView.propTypes = {
  setAlert: PropTypes.func,
  setActivePage: PropTypes.func
}

export default WatchView
