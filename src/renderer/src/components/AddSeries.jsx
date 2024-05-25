import '../styles/components/AddSeries.css'
import React from 'react'

import { AddCircle } from '@mui/icons-material'

function AddSeries() {
  return (
    <a href={'#/upload'} className="add-series-container">
      <AddCircle
        sx={{
          width: '100px',
          height: '100px',
          color: '#ffffff',
          opacity: 0.5
        }}
      />
    </a>
  )
}

export default AddSeries
