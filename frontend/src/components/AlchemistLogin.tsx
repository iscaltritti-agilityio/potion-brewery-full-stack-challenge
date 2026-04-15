import { useState, useEffect, useRef } from 'react';
import { getLocalDateString } from '../utils/helpers';
import styles from './AlchemistLogin.module.css';

interface AlchemistLoginProps {
  onLogin: (alchemistName: string) => void;
}

interface AlchemistName {
  name: string;
  profile_image?: string | null;
}

export function AlchemistLogin({ onLogin }: AlchemistLoginProps) {
  const [alchemistNames, setAlchemistNames] = useState<AlchemistName[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAlchemistNames();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAlchemistNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/alchemists');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load alchemist names');
      }

      setAlchemistNames(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load alchemist names');
    } finally {
      setLoading(false);
    }
  };

  const createNewAlchemist = async (name: string) => {
    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/alchemist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          service_start_date: getLocalDateString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create alchemist');
      }

      await fetchAlchemistNames();
      onLogin(name);
    } catch (err: any) {
      setError(err.message || 'Failed to create alchemist');
    } finally {
      setCreating(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const existingAlchemist = alchemistNames.find(
      a => a.name.toLowerCase() === inputValue.trim().toLowerCase()
    );

    if (existingAlchemist) {
      onLogin(existingAlchemist.name);
    } else {
      await createNewAlchemist(inputValue.trim());
    }
  };

  const filteredAlchemists = alchemistNames.filter(a =>
    a.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isNewAlchemist = inputValue.trim() && !alchemistNames.some(
    a => a.name.toLowerCase() === inputValue.trim().toLowerCase()
  );

  const handleAlchemistSelect = (alchemistName: string) => {
    setInputValue(alchemistName);
    setShowDropdown(false);
  };

  const displayedAlchemists = inputValue ? filteredAlchemists : alchemistNames;

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Who are you?</h2>
        <p className={styles.subtitle}>Tell us your name to enter the brewery...</p>

        {error && <div className="error">Error: {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="combobox-container">
              <input
                ref={inputRef}
                type="text"
                className="combobox-input"
                placeholder="Type or select your name..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                disabled={loading || creating}
                autoComplete="off"
              />

              {showDropdown && !loading && (
                <div ref={dropdownRef} className="combobox-dropdown">
                  {displayedAlchemists.length > 0 && displayedAlchemists.map(a => (
                    <div
                      key={a.name}
                      className="combobox-option"
                      onClick={() => handleAlchemistSelect(a.name)}
                    >
                      {a.profile_image && (
                        <img
                          src={a.profile_image}
                          alt={a.name}
                          className={styles.alchemistAvatar}
                        />
                      )}
                      <span>{a.name}</span>
                    </div>
                  ))}

                  {inputValue && isNewAlchemist && (
                    <div
                      className="combobox-option create-new"
                      onClick={() => {
                        setShowDropdown(false);
                        createNewAlchemist(inputValue.trim());
                      }}
                    >
                      + Create new alchemist: "{inputValue.trim()}"
                    </div>
                  )}

                  {inputValue && displayedAlchemists.length === 0 && !isNewAlchemist && (
                    <div className={styles.emptyState}>
                      No matching alchemists found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`button button-primary ${styles.submitButton}`}
            disabled={!inputValue.trim() || loading || creating}
          >
            {creating ? 'Creating...' : loading ? 'Loading...' : 'Enter Brewery'}
          </button>
        </form>

        {!inputValue && !loading && (
          <div className={styles.tipBox}>
            Start typing to find yourself, or enter a new name to join the team.
          </div>
        )}
      </div>
    </div>
  );
}
