import React from 'react'
import PropTypes from 'prop-types'
import "../styles/components/AllContentContainer.css"

function AllContentContainer({ children, contentPerPage }) {
  const [currentPage, setCurrentPage] = React.useState(1)
  
  return (
    <>
      <div className="all-content-container">
        {children}
      </div>
    </>
  )
}

AllContentContainer.propTypes = {
  contentPerPage: PropTypes.number
}

export default AllContentContainer