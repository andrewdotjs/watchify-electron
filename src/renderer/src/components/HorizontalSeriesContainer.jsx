import React from 'react'
import PropTypes from 'prop-types'

import '../styles/components/HorizontalSeriesContainer.css'

// Import elements
import AddShow from './AddShow'
import { Skeleton } from '@mui/material'

// Import icons
import { ArrowForward } from '@mui/icons-material'

function HorizontalSeriesContainer({ children, title, loading }) {
  return (
    <div className="horizontal-series-container">
      <div className="horizontal-content-slider-title-container">
        <h2 className="horizontal-series-slider-title">
          {!loading ? title : (
            <Skeleton
              variant="text"
                sx={{
                width: 120,
                borderRadius: 0
              }}
            />
        )}
        </h2>
        {
          !loading ? (
            <a className="horizontal-content-slider-redirect">
              See More <ArrowForward sx={{
                'height': 18,
                'width': 18
              }} />
           </a>
          ) : (
            <Skeleton variant="text" sx={{
              width: 100,
              marginLeft: 'auto',
              marginRight: '7px'
            }}/>
          )
        }
      </div>
      <div className={"horizontal-series-slider " + (loading ? 'horizontal-series-slider-loading' : '')}>
        {
          loading ? (
            [...Array(15).keys()].map((number) => (
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
            ))
          ) : children?.props?.children?.length !== undefined ? (
            <>
              {children}
            </>
          ) : (
            <></>
          )
        }
        {
          !loading && children?.props?.children?.length < 15 ? (
            <AddShow />
          ) : (
            <></>
          )
        }
      </div>
    </div>
  );
}

HorizontalSeriesContainer.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool
}

export default HorizontalSeriesContainer