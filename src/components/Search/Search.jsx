import React, { useEffect, useState } from 'react'
import { SearchInput } from 'react-onsenui'

import './search.css'

export const Search = () => {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  function getDomainInfo(domain) {
    setLoading(true)
    console.log(`i'm looking for: ${domain}`)
  }

  return (
    <div className="search-container">
      <SearchInput
        className="search-bar"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
        }}
        placeholder="Search"
      />
    </div>
  )
}
