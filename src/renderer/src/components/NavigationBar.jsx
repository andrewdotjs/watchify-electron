// Import Essentials
import React from "react"
import PropTypes from 'prop-types'
import '../styles/components/NavigationBar.css'

// Import elements
import { Link } from "react-router-dom"
import { IconButton } from '@mui/material'
import {
  Home,
  Movie,
  Tv,
  Upload,
  Settings,
  BugReport,
  TrackChanges,
  Close
} from '@mui/icons-material'

function NavigationBar({ openMenu, setOpenMenu, activePage }) {
  // const [series, setSeries] = React.useState([])

  // React.useMemo(() => {
  //   fetch('http://127.0.0.1/api/v1/series')
  //     .then((response) => response.json())
  //     .then((seriesData) => setSeries(seriesData.data))
  // }, [])

  return (
    <div className={'navigation-bar' + (openMenu ? '' : ' navigation-bar-hide')}>
      <div className="navigation-group">
        <div className="navigation-bar-logo">
          <h3 className="navigation-icon" to={'/'}>
            WATCHIFY_LOGO
          </h3>
          <IconButton
            sx={{ width: '40px', height: '40px', margin: '10px' }}
            onClick={() => {
              setOpenMenu(!openMenu)
            }}
          >
            <Close />
          </IconButton>
        </div>
        <h3 className="navigation-header">Menu</h3>
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
  )
}

NavigationBar.propTypes = {
  openMenu: PropTypes.bool,
  setOpenMenu: PropTypes.func
}

export default NavigationBar
