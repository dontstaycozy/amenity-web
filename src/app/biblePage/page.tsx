'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './BiblePage.module.css';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import BibleDisplay from '../bibleAPI/BibleDisplay';

type BookChapters = {
  [book: string]: number;
};

const bibleBooks: Record<string, number> = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
  "1 Chronicles": 29,
  "2 Chronicles": 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalms: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  "Song of Solomon": 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  "1 Corinthians": 16,
  "2 Corinthians": 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  "1 Thessalonians": 5,
  "2 Thessalonians": 3,
  "1 Timothy": 6,
  "2 Timothy": 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  "1 Peter": 5,
  "2 Peter": 3,
  "1 John": 5,
  "2 John": 1,
  "3 John": 1,
  Jude: 1,
  Revelation: 22,
};

// Custom icon components
const ArchiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2 4.9 2 6V8C2 8.55 2.45 9 3 9H21C21.55 9 22 8.55 22 8V6C22 4.9 21.1 4 20 4Z" fill="#f5f0e9" />
    <path d="M20 10H4C3.45 10 3 10.45 3 11V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V11C21 10.45 20.55 10 20 10ZM15 16H9C8.45 16 8 15.55 8 15C8 14.45 8.45 14 9 14H15C15.55 14 16 14.45 16 15C16 15.55 15.55 16 15 16Z" fill="#f5f0e9" />
  </svg>
);

const SavedIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="#f5f0e9" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#f5f0e9" />
    <path d="M12 13H17V18H12V13Z" fill="#f5f0e9" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedBook, setSelectedBook] = useState("Genesis");
  
  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [activeView, setActiveView] = useState<'bible' | 'daily' | 'book'>('bible');

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleBibleClick = () => {
  setActiveView('bible');
  };

  const handleBookClick = (book: string) => {
    setSelectedBook(book);
  };

  const handleDailyClick = () => {
    setActiveView('daily');
    // Load Daily Reading logic
  };

  const bibleBook = () => {
    <BibleDisplay selectedBook="Genesis"/>;
  }

  const homePage = () => {
    router.push('/homePage');
  }

  const handleLogOut = () => {
  signOut({ callbackUrl: '/loginPage' });
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef]);

  // Sample verses for demonstration
  const additionalVerses = [
    { id: 1, text: '"Trust in the LORD with all your heart and lean not on your own understanding." - Proverbs 3:5' },
    { id: 2, text: '"I can do all things through Christ who strengthens me." - Philippians 4:13' },
    { id: 3, text: '"The LORD is my shepherd; I shall not want." - Psalm 23:1' },
    { id: 4, text: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." - Joshua 1:9' }
  ];

  return (
    <div className={styles.body}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <h3 className="headingMedium">Amenity</h3>
          </div>
          
          <div className={styles.headerMid}>
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search..." 
              />
            </div>
          </div>
          
          <div className={styles.headerRight}>
            {/* Notification Icon */}
            <span className={styles.headerIcon}>🔔</span>
            
            {/* Profile Icon with Dropdown */}
            <div className={styles.profileContainer} ref={profileDropdownRef}>
              <span 
                className={styles.headerIcon} 
                onClick={toggleProfileMenu}
              >
                👤
              </span>
              
              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                    <button className={styles.dropdownItem}>
                    <span>👤</span>
                    <span>View Profile</span>
                    </button>
                    <button className={styles.dropdownItem} onClick={handleLogOut}>
                    <span>🚪</span>
                    <span>Log Out</span>
                    </button>
                    <button className={styles.dropdownItem}>
                    <span>💡</span>
                    <span>Light Mode</span>
                    </button>
                </div>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          {/* Left Navigation Panel */}
          <div className={styles.mainLeft}>
            <div className={styles.mainLeftUp}>

              <button className={styles.navItem} onClick={homePage}>
                <div className={styles.navIcon}>🏠</div>
                <span className={styles.navText}>Home</span>
              </button>
              
              <div className={styles.navItem}>
                <div className={styles.navIcon}>🔥</div>
                <span className={styles.navText}>Popular</span>
              </div>
              
              <div className={styles.navItem}>
                <div className={styles.navIcon}>📖</div>
                <span className={styles.navText}>Bible</span>
              </div>
            </div>
            
            <div className={styles.mainLeftBottom}>
              <div className={styles.navItem}>
                <div className={styles.navIcon}>ℹ️</div>
                <span className={styles.navText}>About</span>
              </div>
              
              <div className={styles.navItem}>
                <div className={styles.navIcon}>❓</div>
                <span className={styles.navText}>Help</span>
              </div>
            </div>
          </div>
          
          {/* Middle Content Area - Now Scrollable */}
          <div className={styles.mainMid}>
            <div className={styles.navContainer}>
              <div className={styles.navLeft}>
                <button className={`${styles.navBibleOp} ${activeView === 'bible' || activeView === 'book' ? styles.active : ''}`} onClick={handleBibleClick}>
                    <span className={styles.navText}>Bible</span>
                </button>
                <button className={`${styles.navBibleOp} ${activeView === 'daily' ? styles.active : ''}`} onClick={handleDailyClick}>
                  <span className={styles.navText}>Daily Reading</span>
                </button>
              </div>
              <div className={styles.navRight}>
                <div className={styles.dropdown}>
                  <button className={styles.navBibleOp}>
                    <span className={styles.navText}>Book ▾</span>
                  </button>
                  <div className={styles.dropdownMenu}>
                    {Object.keys(bibleBooks).map((book) => (
                      <div
                        key={book}
                        className={styles.dropdownItem}
                        onClick={() => handleBookClick(book)}
                      >
                        {book}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ✅ Now pass selectedBook to BibleDisplay */}
              <BibleDisplay selectedBook="Genesis" />
            </div>
            {/* Verse of the Day */}
            <div className={styles.verseContainer}>
              <h2 className="headingLarge">GENESIS</h2>
              <BibleDisplay selectedBook={selectedBook} />
            </div>
          </div>
          
          {/* Right Section */}
          <div className={styles.mainRight}>
            <div className={styles.rightContainer}>
              <h3 className="headingMedium">Streak Plant!</h3>
              
              {/* Glass Bell Component */}
              <div className={styles.glassBellContainer}>
                <div className={styles.glassBell}></div>
                <div className={styles.bellShadow}></div>
                <div className={styles.bellBase}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
