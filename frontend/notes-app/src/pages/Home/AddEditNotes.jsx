import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || '')
  const [content, setContent] = useState(noteData?.content || '')
  const [tags, setTags] = useState(noteData?.tags || [])

  const [error, setError] = useState(null)

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags
      })

      if (response.data && response.data.note) {
        showToastMessage('Note added successfully')
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      }
    }
  }

  const editNote = async () => {
    const noteId = noteData._id

    try {
      const response = await axiosInstance.put('/edit-note/' + noteId, {
        title,
        content,
        tags
      })

      if (response.data && response.data.note) {
        showToastMessage('Note updated successfully')
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      }
    }
  }

  const handleAddNote = () => {
    if (!title) {
      setError('Title is required')
      return
    }
    if (!content) {
      setError('Content is required')
      return
    }

    setError('')

    if (type === 'edit') {
      editNote()
    } else {
      addNewNote()
    }
  }

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6">
      {/* Close Button */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full absolute -top-3 -right-3 bg-gray-200 hover:bg-gray-300 transition"
        onClick={onClose}
      >
        <MdClose className="text-gray-600 text-lg" />
      </button>

      {/* Title */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-sm font-semibold text-gray-700 tracking-wide">TITLE</label>
        <input
          type="text"
          placeholder="Enter note title"
          className="w-full px-4 py-2 text-base rounded-lg bg-[#f1f9f5] border border-[#bddfc6] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-sm font-semibold text-gray-700 tracking-wide">CONTENT</label>
        <textarea
          rows={8}
          placeholder="Enter note content"
          className="w-full px-4 py-3 text-sm rounded-lg bg-[#f1f9f5] border border-[#bddfc6] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      {/* Tags */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-700 tracking-wide">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Button */}
      <button
        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-green-700 to-emerald-800 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
        onClick={handleAddNote}
      >
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  )
}

export default AddEditNotes
