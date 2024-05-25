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
  const [activePage, setActivePage] = React.useState('home')
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
        <NavigationBar openMenu={openMenu} setOpenMenu={setOpenMenu} activePage={activePage} />
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
            <Route // Video watching page
              path="/watch/:id"
              element={<WatchView setAlert={setAlert} setActivePage={setActivePage} />}
              lazy={true}
            />
            <Route // Series information page
              path="/series/:id"
              element={<SeriesView setAlert={setAlert} setActivePage={setActivePage} />}
              lazy={true}
            />
            <Route // Settings page
              path="/settings"
              lazy={true}
              element={
                <SettingsView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                  settingsAPI={settingsAPI}
                />
              }
            />
            <Route // Upload page TODO: Create different pages for series and movie uploads
              path="/upload"
              lazy={true}
              element={<UploadView setAlert={setAlert} setActivePage={setActivePage} />}
            />
            <Route // Shows page
              path="/shows"
              lazy={true}
              element={
                <ShowView
                  setAlert={setAlert}
                  settingsAPI={settingsAPI}
                  setConnIssue={setConnIssue}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Home page
              path="/"
              lazy={true}
              element={<HomeView setAlert={setAlert} setActivePage={setActivePage} />}
            />
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
