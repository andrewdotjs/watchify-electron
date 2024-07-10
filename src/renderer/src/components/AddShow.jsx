import '../styles/components/AddShow.css'
import React from 'react'

import { AddCircle } from '@mui/icons-material'

function AddShow() {
  return (
    <a href={'#/upload'} className="add-show-container">
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

export default AddShow
