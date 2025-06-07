import React, { use } from 'react'
import ProfileInfo from '../../components/Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar'
import { useState } from 'react';

const Navbar = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const Navigate = useNavigate();

  const onLogout = () => {
    Navigate("/login");
  };

  const handleSearch = () => {

  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between p-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>

        <SearchBar 
          value={searchQuery}
          onChange={({target}) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        <ProfileInfo onLogout={onLogout}/>
    </div>
  )
}

export default Navbar