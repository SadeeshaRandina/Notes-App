import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNoteImg from '../../assets/images/add-notes.jpg'
import NoDataImg from '../../assets/images/no-data.png'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      data: noteDetails,
      type: "edit"
    })
  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    })
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user')
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes')
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId)
      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully", "delete")
        getAllNotes()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error("Error deleting note:", error)
      }
    }
  }

  const OnSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query }
      })
      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.error("Error searching notes:", error)
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id
    const isCurrentlyPinned = noteData.isPinned

    try {
      const response = await axiosInstance.put("/update-is-pinned/" + noteId, {
        isPinned: !isCurrentlyPinned
      })

      if (response.data && response.data.note) {
        const message = isCurrentlyPinned
          ? "Note unpinned successfully"
          : "Note pinned successfully"

        showToastMessage(message, "edit")
        getAllNotes()
      }
    } catch (error) {
      console.log("Error updating note:", error)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  useEffect(() => {
    getAllNotes()
    getUserInfo()
  }, [])

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        OnSearchNote={OnSearchNote} 
        handleClearSearch={handleClearSearch} 
      />

      <div className="min-h-screen bg-gradient-to-br from-[#b6dec4] via-[#a2d1b5] to-[#8ec4a6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {allNotes.map((item) => (
                <NoteCard 
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard 
              imgSrc={isSearch ? NoDataImg : AddNoteImg}
              message={isSearch 
                ? `Oops! No notes found matching your search.` 
                : `Start creating your first note! Click the '+' button to jot down your thoughts, ideas, and reminders. Let's get started!`} 
            />
          )}
        </div>
      </div>

      <button 
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-700 to-emerald-800 hover:brightness-110 text-white text-[32px] fixed right-5 bottom-5 shadow-lg transition duration-300 z-50 sm:right-10 sm:bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <MdAdd />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }}
        contentLabel=""
        className="w-full max-w-2xl max-h-[85vh] bg-white rounded-xl mx-auto mt-14 p-6 overflow-y-auto shadow-2xl"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home
