'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './BiblePage.module.css';
import {
  About,
  Bell,
  Bible,
  Fire,
  Help,
  Home,
  Logout,
  Profile,
  Search,
  Sun,
  Create,
  LOGO
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import BibleDisplay from '../bibleAPI/BibleDisplay';
import supadata from '../lib/supabaseclient';

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



// Helper: Deterministic random number generator (seeded)
function mulberry32(a: number): () => number {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper: Get daily chapters
function getDailyChapters(
  chapterCounts: Record<string, number>,
  numChapters = 3
): { book: string; chapter: number }[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = mulberry32(seed);
  const books = Object.keys(chapterCounts);
  const selected: { book: string; chapter: number }[] = [];
  const usedBooks = new Set<string>();
  while (selected.length < numChapters && usedBooks.size < books.length) {
    const bookIdx = Math.floor(rand() * books.length);
    const book = books[bookIdx];
    if (usedBooks.has(book)) continue;
    usedBooks.add(book);
    const maxChapter = chapterCounts[book];
    const chapter = Math.floor(rand() * maxChapter) + 1;
    selected.push({ book, chapter });
  }
  return selected;
}

// Component to fetch and display a single chapter
interface DailyChapterProps {
  book: string;
  chapter: number;
}
interface Verse {
  chapter: number;
  verse: number;
  text: string;
}
function DailyChapter({ book, chapter }: DailyChapterProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}`)
      .then(res => res.json())
      .then(data => setVerses(data.verses || []))
      .finally(() => setLoading(false));
  }, [book, chapter]);
  if (loading) return <p className="paragraph">Loading {book} {chapter}...</p>;
  if (!verses.length) return <p className="paragraph">No data available for {book} {chapter}.</p>;
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>{book} Chapter {chapter}</h3>
      <p className="paragraph">
        {verses.map(v => (
          <span key={v.verse}><sup>{v.verse}</sup> {v.text} </span>
        ))}
      </p>
    </div>
  );
}
async function addbookmark(book: string, Chapter: number, userid: string): Promise<boolean> {

  const updatedAt = new Date().toISOString();



  const { data, error } = await supadata
    .from('bookmarking')
    .insert([
      {
        Book_name: book,
        chapter_number: Chapter,
        user_id: userid,
        saved_at: updatedAt
      }

    ])


  if (error) {
    console.log("Sending insert:", {
      Book_name: book,
      chapter_number: Chapter,
      user_id: userid,
      saved_at: updatedAt
    });
    console.log("Insert failed (full error):");
    console.dir(error, { depth: null });
    return false;
  }
  console.log('Insert success:', data);
  return true;

}




export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [activeView, setActiveView] = useState<'bible' | 'daily' | 'book'>('bible');
  const dailyChapters = getDailyChapters(bibleBooks, 3);

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleBibleClick = () => {
    setActiveView('bible');
  };

  const handleBookClick = (book: string, chapter?: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter || 1);
    setActiveView('bible');
  };

  const handleDailyClick = () => {
    setActiveView('daily');
  };

  const homePage = () => {
    router.push('/homePage');
  }

  const handleLogOut = () => {
    signOut({ callbackUrl: '/loginPage' });
  };

  const goToHelp = () => {
    router.push('/helpPage');
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
  const handleBookmark = async (book: string, chapter: number, username: string) => {
    const success = await addbookmark(book, chapter, username)
    if (success) {
      console.log("Successful!");
      alert("Bookmarked: " + book + chapter)
    } else {

      alert("Failed!")

    }
  };

  return (
    <div className={styles.body}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <LOGO style={{ width: 100, height: 100 }} /><h3 className="headingMedium" style={{ fontFamily: "'Segoe Script', cursive" }}>Amenity</h3>
          </div>

          <div className={styles.headerMid}>
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>  <button className={styles.searchIcon}>
                <Search style={{ cursor: "pointer" }} />
              </button></span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
              />
            </div>
          </div>

          <div className={styles.headerRight}>
            {/* Notification Icon */}
            <span className={styles.headerIcon}><Bell /> </span>

            {/* Profile Icon with Dropdown */}
            <div className={styles.profileContainer} ref={profileDropdownRef}>
              <span
                className={styles.headerIcon}
                onClick={toggleProfileMenu}
              >
                <Profile />
              </span>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownItem}>
                    <span><Profile /></span>
                    <span>View Profile</span>
                  </div>
                  <div className={styles.dropdownItem}
                    onClick={() => signOut({ callbackUrl: "/loginPage" })}>
                    <span><Logout /></span>

                    <span>Log Out</span>
                  </div>
                  <div className={styles.dropdownItem}>
                    <span><Sun /></span>
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

              <button className={styles.navItem} onClick={homePage}>
                <div className={styles.navIcon}><Home /></div>
                <span className={styles.navText}>Home</span>
              </button>

              <div className={styles.navItem}>
                <div className={styles.navIcon}><Fire /></div>
                <span className={styles.navText}>Popular</span>
              </div>

              <div className={styles.navItem}>
                <div className={styles.navIcon}><Bible /></div>
                <span className={styles.navText}>Bible</span>
              </div>
            </div>

            <div className={styles.mainLeftBottom}>
              <div className={styles.navItem}>
                <div className={styles.navIcon}><About /></div>
                <span className={styles.navText}>About</span>
              </div>

              <button className={styles.navItem} onClick={goToHelp}>
                <div className={styles.navIcon}><Help /></div>
                <span className={styles.navText}>Help</span>
              </button>
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
                <div className={styles.dropdown}>
                  <button className={styles.navBibleOp}>
                    <span className={styles.navText}>Book ▾</span>
                  </button>
                  <button
                    className={styles.bookmarkbutton}
                    onClick={() => handleBookmark(selectedBook, selectedChapter, session!.user!.id)}
                  >

                    Bookmark

                  </button>
                  <div className={styles.dropdownMenu}>
                    {Object.keys(bibleBooks).map((book) => (
                      <div
                        key={book}
                        className={styles.dropdownItem}
                        onMouseEnter={() => setHoveredBook(book)}
                        onMouseLeave={() => setHoveredBook(null)}
                        style={{ position: 'relative', display: 'block' }}
                      >
                        <div style={{ fontWeight: hoveredBook === book ? 'bold' : 'normal' }}>{book}</div>
                        {hoveredBook === book && (
                          <div className={styles.chapterGrid} style={{ marginTop: '0.5rem' }}>
                            {Array.from({ length: bibleBooks[book] }, (_, i) => i + 1).map((chapter) => (
                              <div
                                key={chapter}
                                className={`${styles.chapterItem} ${selectedBook === book && selectedChapter === chapter ? styles.selectedChapter : ''}`}
                                onClick={() => {
                                  handleBookClick(book, chapter);
                                  setHoveredBook(null);
                                }}
                              >
                                {chapter}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Verse of the Day */}
            <div className={styles.verseContainer}>
              {activeView === 'bible' && (
                <>
                  <h2 className="headingLarge">BIBLE</h2>

                  <BibleDisplay selectedBook={selectedBook} selectedChapter={selectedChapter} />

                </>

              )}
              {activeView === 'daily' && (
                <>
                  <h2 className="headingLarge">Daily Reading</h2>
                  {dailyChapters.map(({ book, chapter }) => (
                    <DailyChapter key={book + chapter} book={book} chapter={chapter} />
                  ))}
                  <button className={styles.finishReadingBtn} onClick={() => alert("Congratulations! You finished today's reading!")}>
                    Finish Reading
                  </button>
                </>
              )}
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
