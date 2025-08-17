import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '/frontend/src/contexts/AppContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { marked } from 'marked';

function NoteEditor() { // Updated to consume loading and error
  const { selectedNote, updateNote, addNote, deleteNote, selectedSection } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editMode, setEditMode] = useState(true); // true for Rich Text, false for Markdown Preview

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedNote]);

  const handleSave = () => {
    if (selectedNote) {
      updateNote({ ...selectedNote, title, content });
    }
  };

  const handleNewNote = () => {
      addNote({ title: 'New Note', content: '', sectionId: selectedSection?.id });
  };

  const handleDelete = () => {
    if (selectedNote) {
      deleteNote(selectedNote.id);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Access loading and error from context
  const { loading, error } = useContext(AppContext);

  return (
    <div className="note-editor">
      {/* Display error message if there is an error */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {selectedNote ? (
        <>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
 {editMode ? (
 <ReactQuill
 placeholder="Note content goes here..."
 value={content}
 onChange={setContent}
 />
          ) : (
 <div
 className="markdown-preview"
 dangerouslySetInnerHTML={{ __html: marked(content) }}
            ></div>
          )}
          <button onClick={handleSave} disabled={!selectedNote || loading}>Save</button> {/* Disable when loading */}
          <button onClick={handleDelete} disabled={!selectedNote || loading}>Delete</button> {/* Disable when loading */}
        </>
      ) : selectedSection ? (
          <p>Select a note or create a new one.</p>
      ) : (
        <p>Select a section to view or create notes.</p>
      )}
       {selectedSection && (
            <button onClick={handleNewNote} disabled={loading}>New Note</button> {/* Disable when loading */}
       )}

      </div>
    </div>
  );
}

export default NoteEditor;