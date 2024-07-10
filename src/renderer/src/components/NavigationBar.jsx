// Import Essentials
import React from 'react'
import PropTypes from 'prop-types'
import '../styles/components/NavigationBar.css'

// Import elements
import { Link } from 'react-router-dom'
import { useAutocomplete } from '@mui/base'
import { Box, List, ListItemButton } from '@mui/material'
import {
  Home,
  Movie,
  Tv,
  Upload,
  Settings,
  BugReport,
  TrackChanges,
  Close,
  Menu,
  Search
} from '@mui/icons-material'

function NavigationBar({ openMenu, setOpenMenu, activePage }) {
  const [settings, setSettings] = React.useState({})
  const [series, setSeries] = React.useState([])
  const [value, setValue] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const [searchMode, setSearchMode] = React.useState(false)
  const { getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
    id: 'search-mini-autocomplete',
    options: series,
    getOptionLabel: (option) => (option ? option.title : ""),
    isOptionEqualToValue: (option, value) => (value === option.title || value === ""),
    inputValue,
    value,
    onChange: (_, value) => setValue(value),
    onInputChange: (_, value) => setInputValue(value)
  })

  // Retrieve settings
  React.useMemo(async () => {
    const { data: fetchedSettings } = await window.electron.ipcRenderer.invoke('api-read-settings')
    setSettings(fetchedSettings)
  }, [])

  React.useMemo(() => {
    if (settings['server-address'] !== undefined) {
      fetch(`http://${settings['server-address']}/api/v1/series`)
      .then((response) => response.json())
      .then((seriesData) => {
        setSeries(seriesData.data)
      })
    }
  }, [settings])

  return (
    <div className={'navigation-view' + (openMenu ? '' : ' navigation-view-inactive')}>
      <div className="navigation-bar">
        <div className="navigation-group">
          <div className="navigation-bar-logo">
            <h3 className="navigation-bar-logo-placeholder">WATCHIFY_LOGO</h3>
          </div>
          <div className="search-container">
            <Search
              sx={{
                marginRight: 'auto',
                position: 'absolute',
                left: 10,
                zIndex: 19
              }}
            />
            <input className="search-input" {...getInputProps()} />
          </div>
          <h3 className="navigation-header">Navigate</h3>
          <Link
            className={
              'navigation-button' + (activePage === 'home' ? ' navigation-button-active' : '')
            }
            to={'/'}
          >
            <Home sx={{ width: '20px', height: '20px' }} />
            Home
          </Link>
          <Link
            className={
              'navigation-button' + (activePage === 'shows' ? ' navigation-button-active' : '')
            }
            to={'/shows'}
          >
            <Tv sx={{ width: '20px' }} />
            Shows
          </Link>
          <Link
            className={
              'navigation-button' + (activePage === 'movies' ? ' navigation-button-active' : '')
            }
            to={'/movies'}
          >
            <Movie sx={{ width: '20px' }} />
            Movies
          </Link>
          <Link
            className={
              'navigation-button' + (activePage === 'upload' ? ' navigation-button-active' : '')
            }
            to={'/upload'}
          >
            <Upload sx={{ width: '20px' }} />
            Upload
          </Link>
          <Link
            className={
              'navigation-button' + (activePage === 'settings' ? ' navigation-button-active' : '')
            }
            to={'/settings'}
          >
            <Settings sx={{ width: '20px' }} />
            Settings
          </Link>
          <h3 className="navigation-header">Misc</h3>
          <Link
            className={
              'navigation-button' + (activePage === 'changelogs' ? ' navigation-button-active' : '')
            }
            to={'/upload'}
          >
            <TrackChanges sx={{ width: '20px' }} />
            Changelogs
          </Link>
          <Link
            className={
              'navigation-button' + (activePage === 'bugreport' ? ' navigation-button-active' : '')
            }
          >
            <BugReport sx={{ width: '20px' }} />
            Report Bug
          </Link>
          <h3 className="navigation-app-version">Watchify v1.0</h3>
        </div>
      </div>
      <a className="navigation-toggle-button" onClick={() => setOpenMenu(!openMenu)}>
        {openMenu ? <Close /> : <Menu />}
      </a>
      <div
        className={`navigation-dead-space ${!openMenu ? 'dead-space-disabled' : ''}`}
        onClick={() => {
          if (!groupedOptions.length) setOpenMenu(false)
        }}
      >
        <Box
          className={'search-results' + (!groupedOptions.length ? ' search-results-hidden' : '')}
        >
          {groupedOptions.length > 0 ? (
            <List
              {...getListboxProps()}
              className="results-container"
              sx={{ margin: 0, padding: 0 }}
            >
              {groupedOptions.map((option, index) => (
                <ListItemButton
                  {...getOptionProps({ option, index })}
                  key={option.id}
                  className="search-result"
                  to={`#/details/show/${option.id}`}
                >
                  <div className="search-results-text">
                    <h3 className="search-results-title">{option.title}</h3>
                    <p className="search-results-description">{option.description}</p>
                  </div>
                  <img
                    className="search-results-cover"
                    loading="lazy"
                    src={`http://${settings['server-address']}/api/v1/series/${option.id}/cover`}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <></>
          )}
        </Box>
      </div>
    </div>
  )
}

NavigationBar.propTypes = {
  openMenu: PropTypes.bool,
  setOpenMenu: PropTypes.func,
  activePage: PropTypes.string
}

export default NavigationBar
