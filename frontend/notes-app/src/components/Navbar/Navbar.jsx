import React, { use } from 'react'
import ProfileInfo from '../../components/Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const Navigate = useNavigate();

  const onLogout = () => {
    Navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between p-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>

        <ProfileInfo onLogout={onLogout}/>
    </div>
  )
}

export default Navbar