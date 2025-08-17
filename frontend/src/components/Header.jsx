import React, { useContext } from 'react';
import { AppContext } from '/frontend/src/contexts/AppContext';

function Header() {
  const { userId, generateNewUser } = useContext(AppContext);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h1>Note Taking App</h1>
      <div>
        <input type="text" placeholder="Search notes..." />
      </div>
      <div>
        <span>User ID: {userId ? userId.substring(0, 8) + '...' : 'Loading...'}</span> {/* Display truncated user ID */}
        <button onClick={generateNewUser} style={{ marginLeft: '10px' }}>New User</button>
      </div>
    </header>
  );
}

export default Header;