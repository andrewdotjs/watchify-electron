import React from 'react'
import PropTypes from 'prop-types'

import { useParams, Link } from 'react-router-dom'
import { PlayArrow } from '@mui/icons-material'

import '../styles/views/MovieDetails.css'

function MovieDetailsView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [movie, setMovie] = React.useState({})
  const { id } = useParams()

  setActivePage('')

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  React.useMemo(() => {
    if (Object.keys(settings).length !== 0) {
      fetch(`http://${settings['server-address']}/api/v1/movies/${id}`)
        .then((response) => response.json())
        .then((data) => setMovie(data.data))
        .catch(() => setAlert({
            active: true,
            severity: 'error',
            message: 'Failed to retrieve movie data.'
          })
        )
    }
  }, [settings])

  return (
    <div className="movie-information-container">
      <div className="movie-information">
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
      </div>
      <div className="movie-cover-container">
        <img
          src={`http://${settings['server-address']}/api/v1/movies/${id}/cover`}
          className="movie-view-cover"
        />
        <Link
          className="watch-movie-redirect"
          to={`/watch/movie/${id}`}
        >
          PLAY MOVIE <PlayArrow />
        </Link>
      </div>
    </div>
  )
}

MovieDetailsView.propTypes = {
  setAlert: PropTypes.func,
  setActivePage: PropTypes.func
}

export default MovieDetailsView
