import { Button } from '@mui/material'
import React from 'react'
import '../styles/views/SettingsView.css'

import PropTypes from 'prop-types'

function SettingsView({ settingsAPI, setAlert }) {
  // Set values to empty.
  const [serverAddress, setServerAddress] = React.useState('')
  const [simulateServerLag, setSimulateServerLag] = React.useState(false)
  const [serverLag, setServerLag] = React.useState(0)

  React.useMemo(async () => {
    const readResult = await settingsAPI.read()

    setServerAddress(readResult['server-address'])
    setSimulateServerLag(readResult['simulate-server-lag'])
    setServerLag(readResult['server-lag-simulation-time'])
  }, [])

  async function handleWriteSettings() {
    const newSettings = {
      'server-address': serverAddress,
      'simulate-server-lag': simulateServerLag,
      'server-lag-simulation-time': serverLag
    }

    const writeResult = await settingsAPI.write(newSettings)
    setAlert({
      active: true,
      severity: writeResult.ok ? 'success' : 'error',
      message: writeResult.detail
    })
  }

  return (
    <>
      <div className="settings-container">
        <div className="setting-container">
          <h3 className="setting-section">
            App: <span className="setting-name">Server Address</span>
          </h3>
          <p className="setting-description">
            The IP address, with port (if applicable), of the watchify server that the app will
            communicate to.
          </p>
          <input
            className="setting-input"
            value={serverAddress}
            onInput={(event) => setServerAddress(event.target.value)}
          />
        </div>
        <div className="setting-container">
          <h3 className="setting-section">
            Dev Tools: <span className="setting-name">Server Lag Emulation</span>
          </h3>
          <p className="setting-description">
            Simulates server lag within the app, which is nice for ensuring that loading animations
            are functioning correctly.
          </p>
          <select
            value={simulateServerLag}
            onChange={(event) => {
              setSimulateServerLag(event.target.value)
            }}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>
        <div className="setting-container">
          <h3 className="setting-section">
            Dev Tools: <span className="setting-name">Server Lag Emulation Time</span>
          </h3>
          <p className="setting-description">
            Sets the time, in milliseconds, for server lag simulation.
          </p>
          <input
            className="setting-input"
            type="number"
            min={0}
            value={serverLag}
            onInput={(event) => setServerLag(event.target.value)}
          />
        </div>
      </div>
      <Button
        sx={{
          marginTop: '20px',
          marginLeft: '20px'
        }}
        variant="contained"
        onClick={handleWriteSettings}
      >
        Save Settings
      </Button>
    </>
  )
}

SettingsView.propTypes = {
  settingsAPI: PropTypes.object,
  setAlert: PropTypes.func
}

export default SettingsView
