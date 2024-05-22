import React from 'react'
import '../styles/components/Series.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Series({ id, title, description, episode_count, url }) {
  // Expecting seriesData to contain {
  //   id: string,
  //   title: string,
  //   description: string,
  //   episodes: int
  // }

  return (
    <Link to={`/series/${id}`} className="series-redirect" state={{ title, description }}>
      <div className="series-cover">
        <div className="episode-blip">{episode_count}</div>
        <img className="series-image" src={`http://${url}/api/v1/series/${id}/cover`} />
        <div className="series-details">
          <p className="series-title">{title}</p>
        </div>
      </div>
    </Link>
  )
}

Series.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  episode_count: PropTypes.number,
  url: PropTypes.string
}

export default Series
