import React from 'react'
import PropTypes from 'prop-types'

function HomeView({ setActivePage }) {
  setActivePage('home')

  return <p>This is the home page...</p>
}

HomeView.propTypes = {
  setActivePage: PropTypes.func
}

export default HomeView
