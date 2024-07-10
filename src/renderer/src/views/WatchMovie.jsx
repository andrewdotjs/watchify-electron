import React from 'react'
import PropTypes from 'prop-types'

import { Link, useParams } from 'react-router-dom'
import '../styles/views/WatchView.css'

import { NavigateBefore, NavigateNext } from '@mui/icons-material'

function WatchView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [movie, setMovie] = React.useState({})
  const { id } = useParams()

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
    setActivePage('')
  }, [])

  React.useMemo(() => {
    if (settings['server-address'] !== undefined) {
      fetch(`http://${settings['server-address']}/api/v1/movies/${id}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setMovie(responseJson.data)
        })
    }
  }, [settings, id])

  return (
    <div className="watchview-container">
      <video
        className="video-player"
        src={`http://${settings['server-address']}/api/v1/stream/${id}?type=movie`}
        controls
      />
      <div className="video-info">
        <div className="video-quick-info">
          <div className="video-title-episode-container">
            <h1 className="video-title">{movie.title}</h1>
          </div>
        </div>
        <p className="video-description">{movie.description}</p>
      </div>
    </div>
  )
}

WatchView.propTypes = {
  setAlert: PropTypes.func,
  setActivePage: PropTypes.func
}

export default WatchView
