import { useState, useEffect } from 'react';
import Note from './components/Note';
import Notification from './components/Notification';
import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, [])

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((newNote) => {
      setNotes([...notes, newNote]);
      setNewNote('');
    })
  }

  const handleNotechange = (event) => {
    setNewNote(event.target.value);
  }

  const toggleNoteImportance = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note };
    changedNote.important = !note.important;

    noteService
      .update(id, changedNote)
      .then((updateNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : updateNote)));
      })
      .catch(() => {
        setErrorMessage(`the note '${note.content}' was already deleted from server`);

        // clear the error message after 5 seconds
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);

        // remove the note from the state
        setNotes(notes.filter((note) => note.id !== id));
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage && <Notification message={errorMessage} /> }
      <div>
        <button type="button" onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleNoteImportance={toggleNoteImportance}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNotechange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App;
