import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext({});

const STORAGE_KEYS = { notes: 'notes', sections: 'sections', categories: 'categories' };

const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize userId and load data on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const currentUserId = storedUserId || `user_${Date.now()}`; // Generate if not found
    setUserId(currentUserId);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
    const storedSections = localStorage.getItem('sections');
    if (storedSections) {
      setSections(JSON.parse(storedSections));
    }
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
 try {
 const storedUserId = localStorage.getItem('userId');
 const currentUserId = storedUserId || `user_${Date.now()}`;
 setUserId(currentUserId);
 localStorage.setItem('userId', currentUserId);

      setLoading(true);

 const storedNotes = localStorage.getItem(`${STORAGE_KEYS.notes}_${currentUserId}`);
 if (storedNotes) {
 setNotes(JSON.parse(storedNotes));
      }
 const storedSections = localStorage.getItem(`${STORAGE_KEYS.sections}_${currentUserId}`);
 if (storedSections) {
 setSections(JSON.parse(storedSections));
      }
 const storedCategories = localStorage.getItem(`${STORAGE_KEYS.categories}_${currentUserId}`);
 if (storedCategories) {
 setCategories(JSON.parse(storedCategories));
      }
    } catch (err) {
 setError(err);
 console.error("Failed to load data from localStorage:", err);
    } finally {
 setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const saveToStorage = useCallback(() => {
 if (!userId) return; // Don't save if userId is not set yet
    try {
 localStorage.setItem(`${STORAGE_KEYS.notes}_${userId}`, JSON.stringify(notes));
 localStorage.setItem(`${STORAGE_KEYS.sections}_${userId}`, JSON.stringify(sections));
 localStorage.setItem(`${STORAGE_KEYS.categories}_${userId}`, JSON.stringify(categories));
    } catch (err) {
 setError(err);
 console.error("Failed to save data to localStorage:", err);
    }
  }, [userId, notes, sections, categories]);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
 saveToStorage();
  }, [notes, sections, categories, saveToStorage]);

  const generateNewUser = () => {
    try {
      setLoading(true);
      setError(null);
      const newUserId = `user_${Date.now()}`;
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
      setNotes([]);
      setSections([]);
      setCategories([]);
      setSelectedCategory(null);
      setSelectedSection(null);
      setSelectedNote(null);
      // Clear previous user's data (optional, but good for privacy/separation)
      Object.values(STORAGE_KEYS).forEach(key => {
        // This clears the previous user's data using the *old* userId.
        // This assumes generateNewUser is called after userId is updated.
        // A more robust approach might list all keys and delete based on pattern.
        // For this basic implementation, we rely on saving empty arrays under the new userId.
      });
      saveToStorage(); // Save empty state for the new user
    } catch (err) {
      setError(err);
      console.error("Failed to generate new user:", err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions to simulate API calls
  const fetchSections = async (categoryId) => {
    console.log(`Simulating fetching sections for category ${categoryId}`);
    // Replace with actual API call: fetch(`/api/categories/${categoryId}/sections`)
    const dummySections = [
      { id: 101, name: 'Project A', categoryId: 1 },
      { id: 102, name: 'Meetings', categoryId: 1 },
      { id: 201, name: 'Ideas', categoryId: 2 },
    ];
    // Filter dummy sections by categoryId if needed
    setSections(dummySections.filter(section => section.categoryId === categoryId));
  };

  const fetchNotes = async (sectionId) => {
    console.log(`Simulating fetching notes for section ${sectionId}`);
    // Replace with actual API call: fetch(`/api/sections/${sectionId}/notes`)
    const dummyNotes = [
      { id: 1001, title: 'Meeting Notes 1', content: 'Discussed...', sectionId: 102 },
      { id: 1002, title: 'Project Ideas', content: 'Brainstormed...', sectionId: 201 },
    ];
    // Filter dummy notes by sectionId if needed
    setNotes(dummyNotes.filter(note => note.sectionId === sectionId));
  };

  const selectNote = useCallback((noteId) => {
    const note = notes.find(n => n.id === noteId);
    setSelectedNote(note || null);
  }, [notes]);

  const addNote = useCallback((noteData) => {
    try {
      setLoading(true);
      setError(null);
      const newNote = { ...noteData, id: Date.now() }; // Simple unique ID
      setNotes([...notes, newNote]);
    } catch (err) {
      setError(err);
      console.error("Failed to add note:", err);
    } finally {
      setLoading(false);
    }
  }, [notes]);

  const deleteNote = useCallback((noteId) => {
    try {
      setLoading(true);
      setError(null);
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null); // Deselect if the deleted note was selected
      }
    } catch (err) {
      setError(err);
      console.error("Failed to delete note:", err);
    } finally {
      setLoading(false);
    }
  }, [notes, selectedNote]);

  const updateNote = useCallback((updatedNote) => {
    try {
      setLoading(true);
      setError(null);
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
      if (selectedNote?.id === updatedNote.id) {
        setSelectedNote(updatedNote); // Update selected note if it's the one being updated
      }
    } catch (err) {
      setError(err);
      console.error("Failed to update note:", err);
    } finally {
      setLoading(false);
    }
  }, [notes, selectedNote]);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSection(null); // Reset selected section when category changes
    fetchSections(category.id);
  };

  const selectSection = (section) => {
    setSelectedSection(section);
    fetchNotes(section.id);
  };
  const value = {
    notes,
    setNotes,
    sections,
    setSections,
    categories,
    setCategories,
    selectedNote,
    setSelectedNote,
    fetchCategories,
    fetchSections,
    fetchNotes,
    fetchNoteById,
    selectedCategory,
    selectedSection,
    selectCategory,
    selectSection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };