import React from 'react';
import Show from '../components/Show.jsx'
import '../styles/views/ShowView.css'

import PropTypes from 'prop-types'

// import SearchBar from '../components/SearchBar.jsx'
import HorizontalSeriesContainer from '../components/HorizontalSeriesContainer.jsx'
import DetailsPanel from '../components/DetailsPanel.jsx';

function ShowView({ settingsAPI, setAlert, setConnIssue, setActivePage }) {
  const [settings, setSettings] = React.useState({})
  const [allShows, setAllShows] = React.useState([])
  const [recentlyUploadedShows, setRecentlyUploadedShows] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  // Detail states
  const [openDetails, setOpenDetails] = React.useState(false)
  const [detailMode, setDetailMode] = React.useState('')
  const [contentId, setContentId] = React.useState('')

  setActivePage('shows')

  React.useEffect(() => {
    console.log(contentId)

    if (contentId === '') {
      setOpenDetails(false)
    } else {
      setOpenDetails(true)
    }
  }, [contentId])

  // Retrieve settings
  React.useMemo(async () => {
    const settings = await settingsAPI.read()
    setSettings(settings)
  }, [])

  React.useMemo(async () => {
    if (Object.keys(settings).length !== 0) {
      let errorOcurred = false;

      if (settings['simulate-server-lag']) {
        await new Promise((r) => setTimeout(r, settings['server-lag-simulation-time']))
      }

      fetch(`http://${settings['server-address']}/api/v1/series`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status === 200) {
            setAllShows(data.data)
          } else {
            setAlert({
              active: true,
              severity: 'error',
              message: data.title || 'An unknown error has occurred.'
            })
          }
        })
        .catch((error) => {
          setConnIssue(true)
          setAlert({
            active: true,
            severity: 'error',
            message: error.toString()
          })
        })

      fetch(`http://${settings['server-address']}/api/v1/series?orderedBy=upload_date`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status === 200) {
            setRecentlyUploadedShows(data.data)
          } else {
            setAlert({
              active: true,
              severity: 'error',
              message: data.title || 'An unknown error has occurred.'
            })
          }
        })
        .catch((error) => {
          setConnIssue(true)
          setAlert({
            active: true,
            severity: 'error',
            message: error.toString()
          })
        })

      setIsLoading(false)
    }
  }, [settings])

  return (
    <div className="home-body">
      <div className={"home-content " + (isLoading ? 'home-content-loading' : '' )}>
        {
          openDetails ? (
            <DetailsPanel
              key={contentId}
              id={contentId}
              serverAddress={settings['server-address']}
              setContentId={setContentId}
              mode={detailMode}
            />
          ) : (
            <></>
          )
        }

        <HorizontalSeriesContainer
          title={'Trending'}
          loading={isLoading}
        >
          {
            allShows?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  allShows.map(
                    (show) => (
                      <Show
                        key={show.id}
                        id={show.id}
                        url={settings['server-address']}
                        setContentId={setContentId}
                        setDetailMode={setDetailMode}
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
          title={'New Episodes'}
          loading={isLoading}
        >
          {
            allShows?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  recentlyUploadedShows.map(
                    (show) => (
                      <Show
                        key={show.id}
                        id={show.id}
                        url={settings['server-address']}
                        setContentId={setContentId}
                        setDetailMode={setDetailMode}
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
          title={'Recently Added'}
          loading={isLoading}
        >
          {
            allShows?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  recentlyUploadedShows.map(
                    (show) => (
                      <Show
                        key={show.id}
                        id={show.id}
                        url={settings['server-address']}
                        setContentId={setContentId}
                        setDetailMode={setDetailMode}
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
          title={'All Shows'}
          loading={isLoading}
        >
          {
            allShows?.length > 0 ? (
              // If movies present, render movie cards.
              <>
                {
                  allShows.map(
                    (show) => (
                      <Show
                        key={show.id}
                        id={show.id}
                        url={settings['server-address']}
                        setContentId={setContentId}
                        setDetailMode={setDetailMode}
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

ShowView.propTypes = {
  settingsAPI: PropTypes.object,
  setAlert: PropTypes.func,
  setConnIssue: PropTypes.func,
  setActivePage: PropTypes.func
}

export default ShowView
