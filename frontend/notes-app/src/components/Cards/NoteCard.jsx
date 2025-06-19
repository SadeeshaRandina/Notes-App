import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h6 className="text-base font-semibold text-gray-800">{title}</h6>
          <span className="text-xs text-gray-400">{moment(date).format('Do MMM YYYY, h:mm:ss a')}</span>
        </div>

        <MdOutlinePushPin
          onClick={onPinNote}
          className={`text-2xl cursor-pointer transition-colors duration-300 ${
            isPinned ? 'text-green-600' : 'text-gray-300 hover:text-green-500'
          }`}
          title={isPinned ? "Unpin note" : "Pin note"}
        />
      </div>

      <p className="text-sm text-gray-600 mt-3 line-clamp-3">{content}</p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 select-none"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <MdCreate
            onClick={onEdit}
            className="text-lg cursor-pointer hover:text-green-600 transition-colors duration-300"
            title="Edit note"
          />
          <MdDelete
            onClick={onDelete}
            className="text-lg cursor-pointer hover:text-red-500 transition-colors duration-300"
            title="Delete note"
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
