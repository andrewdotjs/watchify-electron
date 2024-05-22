import React from 'react'
import './styles/main.css'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { HashRouter, Route, Routes } from 'react-router-dom'

import HomeView from './views/HomeView.jsx'
import SeriesView from './views/SeriesView.jsx'
import SettingsView from './views/SettingsView.jsx'
import ShowView from './views/ShowView.jsx'
import UploadView from './views/UploadView.jsx'
import WatchView from './views/WatchView.jsx'

import { Menu } from '@mui/icons-material'
import { Alert, IconButton, Slide, Snackbar } from '@mui/material'
import ConnectionIssuePanel from './components/ConnectionIssuePanel.jsx'
import NavigationBar from './components/NavigationBar.jsx'

import settingsAPI from './utilities/settings.js'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

export default function App() {
  const [settings, setSettings] = React.useState({})
  const [connIssue, setConnIssue] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState(false)
  const [alert, setAlert] = React.useState({
    active: false
  })

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      {connIssue ? (
        <ConnectionIssuePanel
          setAlert={setAlert}
          settingsAPI={settingsAPI}
          setConnIssue={setConnIssue}
        />
      ) : (
        <></>
      )}
      <HashRouter>
        <NavigationBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className={'main-content' + (!openMenu ? ' main-content-extend' : '')}>
          {!openMenu ? (
            <IconButton
              sx={{ width: '40px', height: '40px', margin: '10px' }}
              onClick={() => {
                setOpenMenu(!openMenu)
              }}
            >
              <Menu />
            </IconButton>
          ) : (
            <></>
          )}
          <Routes>
            <Route path="/watch/:id" element={<WatchView setAlert={setAlert} />} lazy={true} />
            <Route path="/series/:id" element={<SeriesView setAlert={setAlert} />} lazy={true} />
            <Route
              path="/settings"
              element={<SettingsView setAlert={setAlert} settingsAPI={settingsAPI} />}
              lazy={true}
            />
            <Route path="/upload" element={<UploadView setAlert={setAlert} />} lazy={true} />
            <Route
              path="/shows"
              lazy={true}
              element={
                <ShowView
                  setAlert={setAlert}
                  settingsAPI={settingsAPI}
                  setConnIssue={setConnIssue}
                />
              }
            />
            <Route path="/" element={<HomeView setAlert={setAlert} />} lazy={true} />
          </Routes>
        </div>
        <Snackbar
          autoHideDuration={3000}
          open={alert?.active ?? false}
          TransitionComponent={Slide}
          onClose={() =>
            setAlert({
              active: false,
              severity: alert?.severity ?? 'error',
              message: alert?.message ?? '?'
            })
          }
        >
          <Alert variant="filled" severity={alert?.severity ?? 'error'}>
            {alert?.message ?? 'error'}
          </Alert>
        </Snackbar>
      </HashRouter>
    </ThemeProvider>
  );
}
