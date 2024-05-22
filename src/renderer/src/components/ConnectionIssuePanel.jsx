import React from 'react'
import PropTypes from 'prop-types'
import '../styles/components/ConnectionIssuePanel.css'

import { TextField, Button } from '@mui/material'
import { SignalWifiConnectedNoInternet4 } from '@mui/icons-material';

function ConnectionIssuePanel({ setConnIssue, settingsAPI, setAlert }) {
  // Set values to empty.
  const [newServerAddress, setNewServerAddress] = React.useState('')
  const [simulateServerLag, setSimulateServerLag] = React.useState(false)
  const [serverLag, setServerLag] = React.useState(0)

  React.useMemo(async () => {
    const readResult = await settingsAPI.read()

    setNewServerAddress(readResult['server-address'])
    setSimulateServerLag(readResult['simulate-server-lag'])
    setServerLag(readResult['server-lag-simulation-time'])
  }, [])

  async function handleWriteSettings() {
    const newSettings = {
      'server-address': newServerAddress,
      'simulate-server-lag': simulateServerLag,
      'server-lag-simulation-time': serverLag
    }

    const writeResult = await settingsAPI.write(newSettings)
    return writeResult
  }

  return (
    <div className="connection-issue-panel">
      <SignalWifiConnectedNoInternet4 sx={{ width: '70px', height: '70px' }} />
      <h1 className="connection-issue-text">
        Looks like there was a connection problem. Please update the server address setting below.
      </h1>
      <TextField
        variant={'outlined'}
        label={'Server Address'}
        value={newServerAddress}
        onInput={(event) => {
          setNewServerAddress(event.target.value)
        }}
        sx={{
          width: '300px'
        }}
      />
      <Button
        variant={'outlined'}
        sx={{
          width: '300px'
        }}
        onClick={async () => {
          const writeResult = await handleWriteSettings()
          setAlert({
            active: true,
            severity: writeResult.ok ? 'success' : 'error',
            message: writeResult.detail
          })

          setConnIssue(writeResult.ok ? false : true)
          window.location.reload(false)
        }}
      >
        Update Server Address
      </Button>
    </div>
  )
}

ConnectionIssuePanel.propTypes = {
  setConnIssue: PropTypes.func,
  settingsAPI: PropTypes.object,
  setAlert: PropTypes.func
}

export default ConnectionIssuePanel
