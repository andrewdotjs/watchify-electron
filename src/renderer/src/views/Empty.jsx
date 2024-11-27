import React from 'react'
import '../styles/views/EmptyView.css'
import {
  Category
} from '@mui/icons-material'

function EmptyView({ setNoContent }) {
  return (
    <div className='empty-view'>
      <Category className='empty-icon' />
    </div>
  )
}

export default EmptyView