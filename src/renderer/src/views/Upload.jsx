import React from 'react'
import PropTypes from 'prop-types'
import '../styles/views/UploadView.css'

// Import components
import { TextField, Button, List, ListItem, Divider, ToggleButtonGroup, ToggleButton, Checkbox, FormControlLabel } from '@mui/material'
import { DoDisturb } from '@mui/icons-material'
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

  const [contentTitle, setContentTitle] = React.useState('')
  const [contentDescription, setContentDescription] = React.useState('')
  const [contentType, setContentType] = React.useState('show')
  const [contentHidden, setContentHidden] = React.useState(false)

  const [showUploadContainer, setShowUploadContainer] = React.useState(false)

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

    fetch(`http://${settings['server-address']}/api/v1/${contentType === 'show' ? 'series' : 'movies'}`, {
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

  function handleMovieUpload(title, description, cover, hidden, video) {
    const data = new FormData()

    console.log(cover)

    // Append static data.
    data.append('title', title)
    data.append('description', description)
    data.append('hidden', hidden)
    data.append('cover', cover[0])
    data.append('video', video[0])

    fetch(`http://${settings['server-address']}/api/v1/movies`, {
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
          alert.message = `Could not upload movie. REASON: ${info.detail}`
          alert.severity = 'error'
        } else {
          alert.message = 'Movie successfully uploaded!'
          alert.severity = 'success'
        }

        setAlert(alert)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="upload-view">
      <VideoDropzone
        setUploadVideos={setVideoFiles}
        mode={contentType}
      />
      <div className="content-container">
        <div className="upload-details">
          <TextField label="Title" onInput={(e) => setContentTitle(e.target.value)} />
          <TextField
            label="Description"
            onInput={(e) => setContentDescription(e.target.value)}
            multiline={true}
            minRows={8}
            maxRows={8}
          />
        </div>
        <div className="upload-images">
          <CoverDropzone
            uploadFiles={coverFile}
            setUploadFiles={setCoverFile}
          />
        </div>
      </div>
      <FormControlLabel
        label='Upload as a :'
        labelPlacement="start"
        sx={{ userSelect: 'none' }}
        control={
          <ToggleButtonGroup
            color="primary"
            value={contentType}
            size="small"
            exclusive
            onChange={(event) => {
              setContentType(event.target.value)
              setVideoFiles([])
            }}
            aria-label="Platform"
            sx={{
              marginLeft: '10px',
              userSelect: 'none'
            }}
          >
            <ToggleButton value="show">Show</ToggleButton>
            <ToggleButton value="movie">Movie</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <FormControlLabel
        control={<Checkbox value={contentHidden} onChange={() => setContentHidden(!contentHidden)} />}
        label='Hidden?'
        labelPlacement='start'
        sx={{ userSelect: 'none', marginLeft: '30px' }}
      />
      <div
        className={`upload-videos-container ${showUploadContainer ? 'upload-videos-container-show' : ''}`}
        onClick={() => setShowUploadContainer(!showUploadContainer)}
      >
        <ListItem
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            userSelect: 'none'
          }}
        >
          <p className="upload-videos-title initial">Filename</p>
          <p className="upload-videos-title centered">Format</p>
          <p className="upload-videos-title end">Filesize</p>
        </ListItem>
        {videoFiles.length ? (
          <>
            {videoFiles.map((videoFile) => (
              <ListItem
                key={videoFile.name}
                className="upload-video-container"
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
          </>
        ) : (
          <div className='upload-videos-placeholder'>
            <DoDisturb className='upload-videos-placeholder-info' sx={{ width: '50px', height: '50px'}} />
            <h4 className='upload-videos-placeholder-info'>No videos in queue.</h4>
          </div>
        )}
      </div>
      <Button
        variant="contained"
        onClick={() => {
          if (contentType === 'show') {
            handleShowUpload(contentTitle, contentDescription, coverFile, videoFiles)
          } else if (contentType === 'movie') {
            handleMovieUpload(contentTitle, contentDescription, coverFile, contentHidden, videoFiles)
          } else {
            setAlert({
              active: true,
              message: 'Could not upload movie because mode was set to an invalid value.',
              severity: 'error'
            })
          }

          setContentTitle('')
          setContentDescription('')
          setContentHidden(false)
          setContentType('show')
        }}
        sx={{
          marginBottom: '20px'
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
