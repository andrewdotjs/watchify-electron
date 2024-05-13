import React from 'react';
import Series from '../components/Series.jsx';
import '../styles/views/HomeView.css';
import HorizontalSeriesContainer from '../components/HorizontalSeriesContainer.jsx';

import SearchBar from '../components/SearchBar.jsx';
import { Skeleton } from '@mui/material';

export default function ShowView({ setAlert }) {
  const [allSeries, setAllSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetch('http://127.0.0.1/api/v1/series', {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => {
        if (data?.status === 200) {
          setAllSeries(data.data)
        } else {
          setAlert({
            active: true,
            severity: "error",
            message: data.title || "An unknown error has occurred."
          })
        }
      })
      .catch((error) => {
        console.error(error);
      })
  
      setIsLoading(false);

      clearTimeout(timeoutId);
    }, 5000);
  }, [])

  return (
    <div className="home-body">
      <SearchBar data={allSeries} searchFor="anything" />
      <div className="home-content">
        {
          isLoading
          ?
          <>
            <HorizontalSeriesContainer title={<Skeleton variant="text" width={200} />}>
              {
                [...Array(10).keys()].map(() => (
                  <Skeleton variant="rectangular"
                    width={200}
                    height={300}
                    sx={{
                      flexGrow: 0,
                      flexShrink: 0,
                      borderRadius: "10px"
                    }}
                  />
                ))
              }
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={<Skeleton variant="text" width={200} />}>
            {
              [...Array(10).keys()].map(() => (
                <Skeleton variant="rectangular"
                  width={200}
                  height={300}
                  sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    borderRadius: "10px"
                  }}
                />
              ))
            }
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={<Skeleton variant="text" width={200} />}>
              {
                [...Array(10).keys()].map(() => (
                  <Skeleton variant="rectangular"
                    width={200}
                    height={300}
                    sx={{
                      flexGrow: 0,
                      flexShrink: 0,
                      borderRadius: "10px"
                    }}
                  />
                ))
              }
            </HorizontalSeriesContainer>
          </>
          :
          <>
            <HorizontalSeriesContainer title={"Trending"}>
              {
                allSeries ? (
                  allSeries.map((series) => (
                    <Series
                      key={series.id}
                      id={series.id}
                      title={series.title}
                      episode_count={series.episodes.count}
                    />
                  ))
                ) : (
                  <p>There are no series to be displayed.</p>
                )
              }
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={"Recently Uploaded"}>
              {
                allSeries ? (
                  allSeries.map((series) => (
                    <Series
                      key={series.id}
                      id={series.id}
                      title={series.title}
                      episode_count={series.episodes.count}
                    />
                  ))
                ) : (
                  <p>There are no series to be displayed.</p>
                )
              }
            </HorizontalSeriesContainer>
            <HorizontalSeriesContainer title={"Recently Updated"}>
              {
                allSeries ? (
                  allSeries.map((series) => (
                    <Series
                      key={series.id}
                      id={series.id}
                      title={series.title}
                      episode_count={series.episodes.count}
                    />
                  ))
                ) : (
                  <p>There are no series to be displayed.</p>
                )
              }
            </HorizontalSeriesContainer>
          </>
        }
      </div>
    </div>
  );
}
