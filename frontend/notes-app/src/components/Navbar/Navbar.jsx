import React from 'react'
import ProfileInfo from '../../components/Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useState } from 'react'

const Navbar = ({ userInfo, OnSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const Navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    Navigate("/login")
  }

  const handleSearch = () => {
    if (searchQuery) {
      OnSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <div className="bg-gradient-to-r from-[#eaf7ef] to-[#d6eee0] flex items-center justify-between px-6 py-3 shadow-md">
      <h2 className="text-2xl font-semibold text-[#1a3e2d] tracking-wide">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar
