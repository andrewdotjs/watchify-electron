import React from 'react'
import '../styles/components/SearchBar.css'

import { useAutocomplete } from '@mui/base'
import { Search } from '@mui/icons-material'
import { Box, List, ListItemButton } from '@mui/material'

import PropTypes from 'prop-types'

function SearchBar({ data }) {
  const [searchValue, setSearchValue] = React.useState('')

  const { getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
    id: 'search-mini-autocomplete',
    options: data,
    getOptionLabel: (option) => option.title,
    searchValue,
    onChange: (_, value) => setSearchValue(value)
  })

  return (
    <div className="search-bar">
      <div className="search-bar-container">
        <Search
          sx={{
            paddingLeft: '20px'
          }}
        />
        <input {...getInputProps()} className="search-input" placeholder='Search' />
      </div>
      <Box className={'search-results' + (!groupedOptions.length ? ' search-results-hidden' : '')}>
        {groupedOptions.length > 0 && (
          <List {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <ListItemButton
                key={option.id}
                {...getOptionProps({ option, index })}
                to={`#/series/${option.id}`}
              >
                <div className="search-results-text">
                  <h3 className="search-results-title">{option.title}</h3>
                  <p className="search-results-description">{option.description}</p>
                </div>
                <img
                  className="search-results-cover"
                  loading="lazy"
                  src={`http://127.0.0.1/api/v1/series/${option.id}/cover`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </div>
  )
}

SearchBar.propTypes = {
  data: PropTypes.object
}

export default SearchBar
