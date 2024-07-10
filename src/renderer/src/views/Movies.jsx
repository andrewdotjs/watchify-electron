import React from 'react'
import PropTypes from 'prop-types'
import { Skeleton } from '@mui/material'

import AddShow from '../components/AddShow.jsx'
import Movie from '../components/Movie.jsx'
import HorizontalSeriesContainer from '../components/HorizontalSeriesContainer.jsx'

function MoviesView({ setAlert, settingsAPI, setConnIssue, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [allMovies, setAllMovies] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  setActivePage('movies')

  // Retrieve settings
  React.useMemo(async () => {
    const settings = await settingsAPI.read()
    setSettings(settings)
  }, [])

  React.useMemo(async () => {
    if (Object.keys(settings).length !== 0) {
      if (settings['simulate-server-lag']) {
        await new Promise((r) => setTimeout(r, settings['server-lag-simulation-time']))
      }

      fetch(`http://${settings['server-address']}/api/v1/movies`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status === 200) {
            setAllMovies(data.data)
          } else {
            setAlert({
              active: true,
              severity: 'error',
              message: data.title || 'An unknown error has occurred.'
            })
          }

          setIsLoading(false)
        })
        .catch((error) => {
          setConnIssue(true)
          setAlert({
            active: true,
            severity: 'error',
            message: error.toString()
          })
        })
    }
  }, [settings])

  return (
    <div className="home-body">
      <div className={"home-content " + (isLoading ? 'home-content-loading' : '' )}>
      <HorizontalSeriesContainer
          title={'Trending'}
          loading={isLoading}
        >
          {
            allMovies?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  allMovies.map(
                    (movie) => (
                      <Movie
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        description={movie.description}
                        url={settings['server-address']}
                      />
                    )
                  )
                }
              </>
            ) : (
              // No movies present? Render nothing.
              <></>
            )
          }
        </HorizontalSeriesContainer>
        <HorizontalSeriesContainer
          title={'All Movies'}
          loading={isLoading}
        >
          {
            allMovies?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  allMovies.map(
                    (movie) => (
                      <Movie
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        description={movie.description}
                        url={settings['server-address']}
                      />
                    )
                  )
                }
              </>
            ) : (
              // No movies present? Render nothing.
              <></>
            )
          }
        </HorizontalSeriesContainer>
      </div>
    </div>
  )
}

MoviesView.propTypes = {
  settingsAPI: PropTypes.object,
  setAlert: PropTypes.func,
  setConnIssue: PropTypes.func,
  setActivePage: PropTypes.func
}

export default MoviesView
