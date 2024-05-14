import React from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import '../styles/views/SeriesView.css'

export default function SeriesView({ setAlert }) {
  const [settings, setSettings ] = React.useState(JSON.parse(window.localStorage.getItem("appSettings")));
  
  const [allEpisodes, setAllEpisodes] = React.useState([]);
  const [series, setSeries] = React.useState({});
  const { id } = useParams();

  React.useMemo(() => {
    fetch(`http://${settings["server-address"]}/api/v1/series/${id}/episodes`, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => setAllEpisodes(data.data))

    fetch(`http://${settings["server-address"]}/api/v1/series/${id}`, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => setSeries(data.data))
  }, [])

  return (
    <div className="series-information-container">
      <div className="series-information">
        <h2>{series.title}</h2>
        <p>{series.description}</p>
      </div>
      <div className="series-episodes">
        {
          allEpisodes
          ?
          allEpisodes.map((episode) => (
            <Link className="series-episode" key={episode.id} to={`/watch/${episode.id}`}>
              {episode.episode_number}
            </Link>
          ))
          : 
          <p>No episodes</p>
        }
      </div>
    </div>
  )
}
