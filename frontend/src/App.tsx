import { useState } from 'react';
import { AlchemistLogin } from './components/AlchemistLogin';
import { AlchemistProfile } from './components/AlchemistProfile';
import { PotionBoard } from './components/PotionBoard';
import './App.css';
import styles from './App.module.css';

function App() {
  const [loggedInAlchemist, setLoggedInAlchemist] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(0);

  const handleLogout = () => {
    setLoggedInAlchemist(null);
  };

  const handleProfileUpdate = () => {
    setProfileUpdateTrigger(prev => prev + 1);
  };

  if (!loggedInAlchemist) {
    return (
      <div className="app">
        <header className="app-header">
          <div>
            <h1>The Bubbling Cauldron</h1>
            <p>Potion Order Management</p>
          </div>
        </header>
        <main className="app-main">
          <AlchemistLogin onLogin={setLoggedInAlchemist} />
        </main>
        <footer className="app-footer">
          <p>REST for Profiles &bull; GraphQL for Potion Orders &bull; SQLite</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>The Bubbling Cauldron</h1>
          <p>Welcome, {loggedInAlchemist}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className="button button-secondary"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit Profile
          </button>
          <button
            className={`button button-secondary ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="unified-container">
          <AlchemistProfile
            alchemistName={loggedInAlchemist}
            isEditing={isEditingProfile}
            setIsEditing={setIsEditingProfile}
            onProfileUpdate={handleProfileUpdate}
          />
          <PotionBoard alchemistName={loggedInAlchemist} profileUpdateTrigger={profileUpdateTrigger} />
        </div>
      </main>

      <footer className="app-footer">
        <p>REST for Profiles &bull; GraphQL for Potion Orders &bull; SQLite</p>
      </footer>
    </div>
  )
}

export default App
