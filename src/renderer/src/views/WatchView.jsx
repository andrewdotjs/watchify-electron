import React from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/views/WatchView.css'

export default function WatchView({ setAlert }) {
  const [settings, setSettings ] = React.useState(JSON.parse(window.localStorage.getItem("appSettings")));

  const [video, setVideo] = React.useState({})
  const [series, setSeries] = React.useState({})
  const { id } = useParams()

  React.useMemo(() => {
    fetch(`http://${settings["server-address"]}/api/v1/videos/${id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setVideo(responseJson.data)
      })
  }, [id])

  React.useMemo(() => {
    if (video.id !== id) return

    fetch(`http://${settings["server-address"]}/api/v1/series/${video.series_id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => setSeries(responseJson.data))
  }, [video])

  return (
    <div className="watchview-container">
      <video className="video-player" src={`http://${settings["server-address"]}/api/v1/stream/${id}`} controls />
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
