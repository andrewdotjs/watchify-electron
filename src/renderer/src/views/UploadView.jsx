import React from 'react'
import PropTypes from 'prop-types'
import '../styles/views/UploadView.css'

// Import components
import { TextField, Button, List, ListItem, Divider } from '@mui/material'
import CoverDropzone from '../components/CoverDropzone.jsx'
import VideoDropzone from '../components/VideoDropzone.jsx'

// Import utilities
import utilities from '../utilities/index.js'

function UploadView({ setAlert, setActivePage }) {
  const [settings, setSettings] = React.useState({})

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  // useStates
  const [videoFiles, setVideoFiles] = React.useState([])
  const [coverFile, setCoverFile] = React.useState([])
  const [showTitle, setShowTitle] = React.useState('')
  const [showDescription, setShowDescription] = React.useState('')

  setActivePage('upload')

  function handleShowUpload(title, description, cover, videos) {
    const data = new FormData()

    // Append static data.
    data.append('title', title)
    data.append('description', description)
    data.append('cover', cover[0])

    // Append dynamic video data.
    for (let i = 0; i < videos.length; i++) {
      data.append('videos', videos[i])
    }

    fetch(`http://${settings['server-address']}/api/v1/series`, {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    })
      .then((response) => response.json())
      .then((info) => {
        let alert = { active: true }

        // Check if there was an API error, handle if present.
        if (info.status !== 201) {
          alert.message = `Could not upload show. REASON: ${info.detail}`
          alert.severity = 'error'
        } else {
          alert.message = 'Show successfully uploaded!'
          alert.severity = 'success'
        }

        setAlert(alert)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="upload-view">
      <Divider
        sx={{
          marginBottom: '20px'
        }}
      >
        Details
      </Divider>
      <div className="upload-container">
        <div className="upload-details">
          <TextField label="Title" onInput={(e) => setShowTitle(e.target.value)} />
          <TextField
            label="Description"
            onInput={(e) => setShowDescription(e.target.value)}
            multiline={true}
            minRows={10}
            maxRows={10}
          />
        </div>
        <div className="upload-images">
          <CoverDropzone uploadFiles={coverFile} setUploadFiles={setCoverFile} />
        </div>
      </div>
      <Divider
        sx={{
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        Videos
      </Divider>
      <div className="upload-videos-container">
        <VideoDropzone setUploadVideos={setVideoFiles} />
        {videoFiles.length ? (
          <List
            sx={{
              backgroundColor: '#000000',
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '5px'
            }}
          >
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px'
              }}
            >
              <p className="upload-videos-title initial">Filename</p>
              <p className="upload-videos-title centered">Format</p>
              <p className="upload-videos-title end">Filesize</p>
            </ListItem>
            {videoFiles.map((videoFile) => (
              <ListItem
                key={videoFile.name}
                className="upload-videos-container"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px'
                }}
              >
                <p className="upload-videos-info initial">{videoFile.name}</p>
                <p className="upload-videos-info centered">{videoFile.type}</p>
                <p className="upload-videos-info end">{utilities.format.bytes(videoFile.size)}</p>
              </ListItem>
            ))}
          </List>
        ) : (
          <></>
        )}
      </div>
      <Button
        variant="contained"
        onClick={() => handleShowUpload(showTitle, showDescription, coverFile, videoFiles)}
        sx={{
          marginTop: '20px'
        }}
      >
        Upload
      </Button>
    </div>
  )
}

UploadView.propTypes = {
  setAlert: PropTypes.func,
  setActivePage: PropTypes.func
}

export default UploadView
