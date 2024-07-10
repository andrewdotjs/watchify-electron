import React from 'react'
import '../styles/components/Movie.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Movie({ id, title, description, url }) {
  // Expecting seriesData to contain {
  //   id: string,
  //   title: string,
  //   description: string,
  //   episodes: int
  // }

  return (
    <Link to={`/details/movie/${id}`} className="movie-redirect" state={{ title, description }}>
      <div className="movie-cover" style={{backgroundImage: `url(http://${url}/api/v1/movies/${id}/cover`}} />
    </Link>
  )
}

Movie.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  episode_count: PropTypes.number,
  url: PropTypes.string
}

export default Movie
