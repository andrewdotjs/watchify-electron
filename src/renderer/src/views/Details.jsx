import React from 'react'
import PropTypes from 'prop-types'

import { useParams, Link } from 'react-router-dom'
import '../styles/views/SeriesView.css'

function DetailsView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [allEpisodes, setAllEpisodes] = React.useState([])
  const [series, setSeries] = React.useState({})
  const { id } = useParams()

  setActivePage('')

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  React.useMemo(() => {
    if (Object.keys(settings).length !== 0) {
      fetch(`http://${settings['server-address']}/api/v1/series/${id}/episodes`)
        .then((response) => response.json())
        .then((data) => setAllEpisodes(data.data))
        .catch(() =>
          setAlert({
            active: true,
            severity: 'error',
            message: 'Failed to retrieve series episode data.'
          })
        )

      fetch(`http://${settings['server-address']}/api/v1/series/${id}`)
        .then((response) => response.json())
        .then((data) => setSeries(data.data))
        .catch(() =>
          setAlert({
            active: true,
            severity: 'error',
            message: 'Failed to retrieve series data.'
          })
        )
    }
  }, [settings])

  return (
    <div className="series-information-container">
      <div className="series-information">
        <h2>{series.title}</h2>
        <p>{series.description}</p>
      </div>
      <div className="series-episodes-container">
        {allEpisodes?.length > 0 ? (
          allEpisodes.map((episode) => (
            <Link className="series-episode" key={episode?.id} to={`/watch/show/${episode?.id}`}>
              Episode {episode['episode_number']}
            </Link>
          ))
        ) : (
          <p>No episodes</p>
        )}
      </div>
    </div>
  )
}

DetailsView.propTypes = {
  setAlert: PropTypes.func,
  setActivePage: PropTypes.func
}

export default DetailsView
