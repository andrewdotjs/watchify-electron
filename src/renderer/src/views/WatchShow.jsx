import React from 'react'
import PropTypes from 'prop-types'

import { Link, useParams } from 'react-router-dom'
import '../styles/views/WatchView.css'

import { NavigateBefore, NavigateNext } from '@mui/icons-material'

function WatchView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [video, setVideo] = React.useState({})
  const [series, setSeries] = React.useState({})
  const { id } = useParams()

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
    setActivePage('')
  }, [])

  React.useMemo(() => {
    if (settings['server-address'] !== undefined && id !== undefined) {
      fetch(`http://${settings['server-address']}/api/v1/videos/${id}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setVideo(responseJson.data)
        })
    }
  }, [settings, id])

  React.useMemo(() => {
    if (settings['server-address'] !== undefined && id !== undefined) {
      fetch(`http://${settings['server-address']}/api/v1/series/${video.series_id}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setSeries(responseJson.data)
        })
    }
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
          <div className="video-title-episode-container">
            <h1 className="video-title">{series.title}</h1>
            <h1 className="video-episode">Episode {video['episode_number']}</h1>
          </div>
          <div className="video-navigation">
            <a
              href={
                video['previous_episode']?.id !== undefined
                  ? `#/watch/show/${video['previous_episode']?.id}`
                  : ''
              }
              onClick={
                video['previous_episode']?.id === undefined
                  ? (event) => event.preventDefault()
                  : () => {}
              }
              className={
                'video-navigation-buttons' +
                (video['previous_episode']?.id === undefined ? ' navigation-disabled' : '')
              }
            >
              <NavigateBefore />
            </a>
            <a
              href={
                video['next_episode']?.id !== undefined
                  ? `#/watch/show/${video['next_episode']?.id}`
                  : ''
              }
              onClick={
                video['next_episode']?.id === undefined
                  ? (event) => event.preventDefault()
                  : () => {}
              }
              className={
                'video-navigation-buttons' +
                (video['next_episode']?.id === undefined ? ' navigation-disabled' : '')
              }
            >
              <NavigateNext />
            </a>
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
