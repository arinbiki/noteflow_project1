import React, { useContext } from 'react';
import { AppContext } from '/frontend/src/contexts/AppContext'; // Use absolute path

const NoteList = () => {
  const { notes, selectNote, loading, error } = useContext(AppContext);

  return (
    <div className='note-list'>
      <h2>Notes</h2>
      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: 'red' }}>Error loading notes: {error.message}</p>}
      {!loading && !error && (
      <ul>
 {notes.map(note => (
          <li key={note.id} className='note-list-item'>{note.title}</li> {/* Render note titles */}
        ))}
      </ul>
      )}
    </div>
  );
};

export default NoteList;