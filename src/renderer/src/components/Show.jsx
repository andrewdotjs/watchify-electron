import React from 'react'
import '../styles/components/Show.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Show({ id, url, setContentId, setDetailMode }) {
  // Expecting seriesData to contain {
  //   id: string,
  //   title: string,
  //   description: string,
  //   episodes: int
  // }

  return (
    <a
      className="show-redirect"
      onClick={() => {
        setContentId(id)
        setDetailMode('show')
      }}
    >
      <div
        className="show-cover"
        style={{backgroundImage: `url(http://${url}/api/v1/series/${id}/cover`}}
      />
    </a>
  )
}

Show.propTypes = {
  id: PropTypes.string,
  episode_count: PropTypes.number,
  url: PropTypes.string,
  setContentId: PropTypes.func,
  setDetailMode: PropTypes.func
}

export default Show
