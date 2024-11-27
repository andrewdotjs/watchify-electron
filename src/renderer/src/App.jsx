import React from 'react'
import './styles/main.css'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { HashRouter, Route, Routes } from 'react-router-dom'

import HomeView from './views/Home.jsx'
import DetailsView from './views/Details.jsx'
import MovieDetailsView from './views/MovieDetails.jsx'
import SettingsView from './views/Settings.jsx'
import ShowView from './views/Show.jsx'
import MoviesView from './views/Movies.jsx'
import UploadView from './views/Upload.jsx'
import WatchShowView from './views/WatchShow.jsx'
import WatchMovieView from './views/WatchMovie.jsx'
import EmptyView from './views/Empty.jsx'

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
  const [noContent, setNoContent] = React.useState(false)
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
        <div className={'main-content'}>
          <Routes>
            <Route // Video watching page
              path="/watch/show/:id"
              lazy={true}
              element={
                <WatchShowView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Video watching page
              path="/watch/movie/:id"
              lazy={true}
              element={
                <WatchMovieView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Show information page
              path="/details/show/:id"
              lazy={true}
              element={
                <DetailsView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Show information page
              path="/details/movie/:id"
              lazy={true}
              element={
                <MovieDetailsView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Settings page
              exact
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
              exact
              path="/upload"
              lazy={true}
              element={
                <UploadView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
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
                  setNoContent={setNoContent}
                />
              }
            />
            <Route // Shows page
              path="/search"
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
            <Route
              exact
              path="/movies"
              lazy={true}
              element={
                <MoviesView
                  setAlert={setAlert}
                  settingsAPI={settingsAPI}
                  setConnIssue={setConnIssue}
                  setActivePage={setActivePage}
                />
              }
            />
            <Route // Home page
              exact
              path="/"
              lazy={true}
              element={
                <HomeView
                  setAlert={setAlert}
                  setActivePage={setActivePage}
                />
              }
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
