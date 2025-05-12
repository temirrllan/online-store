// File: frontend/src/components/SearchBar/SearchBar.jsx
import React, { useRef, useState } from 'react';
import styles from './SearchBar.module.scss';

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch = () => {} 
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(value);
  };

  const handleReset = () => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={() => inputRef.current?.focus()}
        aria-label="Focus search"
      >
        {/* search icon */}
        <svg
          width="17"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search"
          className={styles.icon}
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          onSearch(e.target.value);
        }}
      />

      {value && (
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleReset}
          aria-label="Clear search"
        >
          {/* clear icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
}
