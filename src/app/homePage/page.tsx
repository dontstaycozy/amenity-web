'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './HomePage.module.css';
import { signOut } from 'next-auth/react';

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
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
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
                  <div className={styles.dropdownItem}>
                    <span>👤</span>
                    <span>View Profile</span>
                  </div>
                  <div className={styles.dropdownItem}
                  onClick = {() => signOut({callbackUrl: "/loginPage"})}>
                    <span>🚪</span>
                    <span>Log Out</span>
                  </div>
                  <div className={styles.dropdownItem}>
                    <span>💡</span>
                    <span>Light Mode</span>
                  </div>
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
              <div className={styles.navItem}>
                <div className={styles.navIcon}>🏠</div>
                <span className={styles.navText}>Home</span>
              </div>
              
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
            {/* Verse of the Day */}
            <div className={styles.verseContainer}>
              <h2 className="headingLarge">VERSE OF THE DAY</h2>
              <p className="paragraph">"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." - John 3:16</p>
            </div>
            
            {/* Card Container */}
            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <ArchiveIcon />
                </div>
                <h3 className={styles.cardTitle}>Archives</h3>
                <p className={styles.cardInfo}>Post Archive</p>
                <p className={styles.cardInfo}>248 entries</p>
              </div>
              
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <SavedIcon />
                </div>
                <h3 className={styles.cardTitle}>Saved</h3>
                <p className={styles.cardInfo}>Saved Chapters</p>
                <p className={styles.cardInfo}>12 Chapters</p>
              </div>
              
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <CalendarIcon />
                </div>
                <h3 className={styles.cardTitle}>Daily Readings</h3>
                <p className={styles.cardInfo}>Today's Quest</p>
                <p className={styles.cardInfo}>15 min left</p>
              </div>
            </div>
            
            {/* Additional Content */}
            <div style={{ marginTop: '3rem' }}>
              <h2 className="headingMedium" style={{ marginBottom: '1.5rem' }}>More Inspirational Verses</h2>
              {additionalVerses.map(verse => (
                <div 
                  key={verse.id}
                  style={{ 
                    backgroundColor: '#1E2B48', 
                    padding: '1.75rem', 
                    borderRadius: '12px',
                    marginBottom: '1.25rem',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p className="paragraph">{verse.text}</p>
                </div>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
              <h2 className="headingMedium" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
              <div style={{ 
                backgroundColor: '#1E2B48', 
                padding: '1.75rem', 
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}>
                <p className="paragraph">Your reading activity and progress will appear here. Continue your spiritual journey by exploring the Bible and daily readings.</p>
              </div>
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
