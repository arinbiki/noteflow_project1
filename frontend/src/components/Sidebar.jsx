import React, { useContext } from 'react';
import { AppContext } from '/frontend/src/contexts/AppContext'; // Use absolute path
import { Link } from 'react-router-dom';

function Sidebar() {
  const {
    categories,
    sections,
    selectedCategory,
    selectedSection, // Keep selectedSection to highlight the active section
    loading, // Consume loading state
    error, // Consume error state
    selectCategory,
    selectSection,
 addCategory, // Consume addCategory
 addSection, // Consume addSection
  } = useContext(AppContext);


  // Filter sections based on selected category (Note: This filtering might be redundant now with routing and dedicated views)
  const filteredSections = selectedCategory
    ? sections.filter(
        (section) => section.categoryId === selectedCategory.id
      )
    : [];

  return (
    <div className="sidebar"> {/* Added sidebar class */}
      <div className="sidebar-header">
        <h2>Categories</h2>
        <button className="add-button" onClick={() => { {/* Added add-button class */}
          const categoryName = prompt('Enter category name:');
          if (categoryName && categoryName.trim()) {
 addCategory({ id: Date.now(), name: categoryName }); // Use timestamp as a simple unique ID
          }
        }} disabled={loading}>Add Category</button>
      </div>
      {loading && !categories.length && <p>Loading categories...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {!loading && !error && (
        <ul>
          <li><h2>Categories</h2></li>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={'/category/' + category.id}
              className={selectedCategory?.id === category.id ? 'selected' : ''}
            >
              {category.name}
          ))}


          <h2>Sections</h2>
 {selectedCategory && (
 <button onClick={() => {
 const sectionName = prompt('Enter section name:');
            if (sectionName) {
 addSection({ id: Date.now(), name: sectionName, categoryId: selectedCategory.id }); // Use timestamp as a simple unique ID
            }
          }} disabled={loading}>Add Section</button>
 )}
 {selectedCategory && loading && <p>Loading sections...</p>}
 {selectedCategory && !loading && !error && filteredSections.length > 0 && (
 <ul>
 {filteredSections.map((section) => ( // Removed extra closing parenthesis here
 <Link
                  key={section.id}
                  to={'/section/' + section.id}
                  className={selectedSection?.id === section.id ? 'selected' : ''}
                >
                  {section.name}
 </Link>
              ))}
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
            {section.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;