import React from 'react';
import Series from '../components/Series.jsx'
import '../styles/views/ShowView.css'
import HorizontalSeriesContainer from '../components/HorizontalSeriesContainer.jsx'

import PropTypes from 'prop-types'

import SearchBar from '../components/SearchBar.jsx'
import { Skeleton } from '@mui/material'

function ShowView({ settingsAPI, setAlert, setConnIssue }) {
  const [settings, setSettings] = React.useState({})
  const [allSeries, setAllSeries] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

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

      fetch(`http://${settings['server-address']}/api/v1/series`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status === 200) {
            setAllSeries(data.data)
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
      <div className="home-content">
        {isLoading ? (
          <>
            <HorizontalSeriesContainer
              title={
                <Skeleton variant="text" width={200} sx={{ borderRadius: 0, height: '50px' }} />
              }
            >
              {[...Array(15).keys()].map((number) => (
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={300}
                  key={number + '0'}
                  sx={{
                    flexGrow: 0,
                    flexShrink: 0
                  }}
                />
              ))}
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer
              title={
                <Skeleton variant="text" width={200} sx={{ borderRadius: 0, height: '50px' }} />
              }
            >
              {[...Array(15).keys()].map((number) => (
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={300}
                  key={number + 1}
                  sx={{
                    flexGrow: 0,
                    flexShrink: 0
                  }}
                />
              ))}
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer
              title={
                <Skeleton variant="text" width={200} sx={{ borderRadius: 0, height: '50px' }} />
              }
            >
              {[...Array(15).keys()].map((number) => (
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={300}
                  key={number + 2}
                  sx={{
                    flexGrow: 0,
                    flexShrink: 0
                  }}
                />
              ))}
            </HorizontalSeriesContainer>
          </>
        ) : (
          <>
            <HorizontalSeriesContainer
              title={isLoading ? <Skeleton variant="text" width={200} /> : 'Trending'}
            >
              {allSeries.length ? (
                allSeries.map((series) => (
                  <Series
                    key={series.id}
                    id={series.id}
                    title={series.title}
                    episode_count={series.episodes.count}
                    url={settings['server-address']}
                  />
                ))
              ) : (
                <p>There are no series to be displayed.</p>
              )}
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={'Recently Uploaded'}>
              {allSeries.length ? (
                allSeries.map((series) => (
                  <Series
                    key={series.id}
                    id={series.id}
                    title={series.title}
                    episode_count={series.episodes.count}
                    url={settings['server-address']}
                  />
                ))
              ) : (
                <p>There are no series to be displayed.</p>
              )}
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={'Recently Updated'}>
              {allSeries.length ? (
                allSeries.map((series) => (
                  <Series
                    key={series.id}
                    id={series.id}
                    title={series.title}
                    episode_count={series.episodes.count}
                    url={settings['server-address']}
                  />
                ))
              ) : (
                <p>There are no series to be displayed.</p>
              )}
            </HorizontalSeriesContainer>
          </>
        )}
      </div>
    </div>
  )
}

ShowView.propTypes = {
  settingsAPI: PropTypes.object,
  setAlert: PropTypes.func,
  setConnIssue: PropTypes.func
}

export default ShowView
