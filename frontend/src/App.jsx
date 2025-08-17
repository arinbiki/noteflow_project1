import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import Header from '/frontend/src/components/Header.jsx';
import Sidebar from '/frontend/src/components/Sidebar.jsx'; // Import Sidebar
import NoteList from '/frontend/src/components/NoteList.jsx';
import { AppContextProvider } from './contexts/AppContext';

import './App.css'; // Assuming you'll have some basic styling

function App() {
  return (
    <AppContextProvider>
      {/* You would typically fetch data here based on authentication status */}
      {/* For demonstration, fetching categories on component mount */}
      {/*
      useEffect(() => {
        fetchCategories();
      }, []);
      */}
      <div className="App">
        <header className="App-header">
          <Header />
        </header>\n\n
        <main className="container">\n
 <Sidebar /> {/* Sidebar is always visible */}\n
          <Routes>
              path="/"
              element={
                <>
                  {/* NoteList and NoteEditor are part of the default view */}
                  <NoteList />
                  {/* NoteEditor will be used on the /note/:noteId route */}
                </>
              }
            />
            <Route path="/category/:categoryId" element={<CategoryView />} />
            <Route path="/section/:sectionId" element={<SectionView />} />
            {/* We'll render NoteList and NoteEditor together for a specific note */}
            <Route path="/note/:noteId" element={<NoteDetailView />} />

          </Routes>
        </main>
      </div>
    </AppContextProvider>
  );
}

export default App;

// Placeholder components for demonstration
function CategoryView() {
  const { categoryId } = useParams();
  const { categories, sections, selectCategory } = useContext(AppContext);

  useEffect(() => {
    const foundCategory = categories.find(cat => cat.id.toString() === categoryId);
    if (foundCategory) {
      selectCategory(foundCategory);
    }
  }, [categoryId, categories, selectCategory]);

  const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
  const filteredSections = sections.filter(section => section.categoryId.toString() === categoryId);

  return (
    <div>
      <h2>{selectedCategory ? selectedCategory.name : 'Category not found'}</h2>
      <h3>Sections:</h3>
      <ul>
        {filteredSections.map(section => (
          <li key={section.id}>
            <Link to={`/section/${section.id}`}>{section.name}</Link>
          </li>
        ))}
        This is a placeholder view for a specific section.
        In a real app, you would filter notes based on this ID.
      </p>
      {/* In a real app, you would fetch and display notes for this section */}
    </div>
  );
}

function SectionView() {
  const { sectionId } = useParams();
  const { sections, notes, selectSection } = useContext(AppContext);

  useEffect(() => {
    const foundSection = sections.find(sec => sec.id.toString() === sectionId);
    if (foundSection) {
      selectSection(foundSection);
    }
  }, [sectionId, sections, selectSection]);

  const selectedSection = sections.find(sec => sec.id.toString() === sectionId);
  const filteredNotes = notes.filter(note => note.sectionId.toString() === sectionId);

  return (
    <div>
      <h2>{selectedSection ? selectedSection.name : 'Section not found'}</h2>
      <h3>Notes:</h3>
      <NoteList /> {/* NoteList already filters based on selectedSection in AppContext */}
    </div>
  );
}