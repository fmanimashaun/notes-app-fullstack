const Note = ({ note, toggleNoteImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <li className="note">
      {note.content}
      <button type="button" onClick={() => toggleNoteImportance(note.id)}>
        {label}
      </button>
    </li>
  )
}

export default Note;
