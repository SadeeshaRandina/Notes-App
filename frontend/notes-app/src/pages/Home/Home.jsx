import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import { set } from 'mongoose';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: "add", // or "edit"
    data: null // Note object for editing
  });

  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Navbar/>

      <div className='container mx-auto'> 
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard 
            title="Sample Note"
            date="2023-10-01"
            content="This is a sample note content that is used to demonstrate the NoteCard component."
            tags="#sample #note"
            isPinned={false}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>

      <button 
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10" 
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}>
        <MdAdd className="text-[32px] text-white"/>
      </button>

      

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >

      <AddEditNotes
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
      />

      </Modal>
    </>
  );
}

export default Home