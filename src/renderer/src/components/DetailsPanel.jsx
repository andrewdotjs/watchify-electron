import React from 'react'
import PropTypes from 'prop-types'
import '../styles/components/DetailsPanel.css'

import { Close, Edit, Delete } from '@mui/icons-material'

function DetailsPanel({ id, mode, serverAddress, setContentId }) {
  const [endpoint, setEndpoint] = React.useState('')
  const [content, setContent] = React.useState({})
  const [contentTitle, setContentTitle] = React.useState('')
  const [contentDescription, setContentDescription] = React.useState('')

  React.useEffect(() => {
    let tempEndpoint

    switch (mode) {
      case 'show':
        tempEndpoint = '/api/v1/series'
        break
      case 'movie':
        tempEndpoint = '/api/v1/movies'
        break
    }

    setEndpoint(tempEndpoint)
  }, [])

  React.useEffect(() => {
    if (endpoint !== '') {
      fetch(`http://${serverAddress}${endpoint}/${id}`)
        .then((response) => response.json())
        .then((contentData) => setContent(contentData.data))
    }
  }, [endpoint])

  return (
    <div className="details-panel">
      <div className="content-details">
        <a
          className="close-details"
          onClick={() => setContentId('')}
        >
          <Close />
        </a>
        <div className="detail-thumbnail-container">
          <div className="detail-thumbnail-overlay" />
          <img src={`http://${serverAddress}${endpoint}/${id}/cover`} className="detail-thumbnail" />
        </div>
        <div className="detail-main-body">
          <h3 className="detail-title">{content?.title}</h3>
          <div className="detail-controls-container">
            <a className="detail-control">
              <Edit sx={{ width: '15px', height: '15px'}} />
              Edit
            </a>
            <a className="detail-control">
              <Delete sx={{ width: '15px', height: '15px'}} />
              Delete
            </a>
          </div>
          <p className="detail-description">{content?.description}</p>
        </div>
      </div>
    </div>
  )
}

DetailsPanel.propTypes = {
  id: PropTypes.string,
  mode: PropTypes.string,
  serverAddress: PropTypes.string,
  setContentId: PropTypes.func
}

export default DetailsPanel