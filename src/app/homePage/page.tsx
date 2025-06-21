"use client";
import styles from "./HomePage.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from "next-auth/react";
import { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Home,
  Flame,
  Book,
  Mountain,
  HelpCircle,
  LogOut,
  Archive,
  Bookmark,
  Calendar,
} from "lucide-react";

export default function HomePage() {
const { data: session, status } = useSession();
const [isDarkMode, setIsDarkMode] = useState(true)
const [searchQuery, setSearchQuery] = useState("")

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Searching for: ${searchQuery}`)
  }

  const handleNavClick = (section: string) => {
    console.log(`Navigating to: ${section}`)
    if (section === "logout") {
    console.log("Logging out...");
    signOut({ callbackUrl: '/loginPage' }); // Redirects to /login after sign out
  }
  }

  const handleCardClick = (card: string) => {
    console.log(`${card} clicked`)
    // cards to click
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    console.log(`Dark mode: ${!isDarkMode}`)
  }

const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginPage");
    }
  }, [status, router]);


  if (status === "loading") {
    return null; 
  }

  if (!session) {
    return <p>Access denied</p>;
  }

  return (
    <div className={`${styles.screen} ${isDarkMode ? styles.dark : styles.light}`}>
      {/* ---------- Top Navbar ---------- */}
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <img src="/images/tree.png" alt="Amenity logo" />
          <span>Amenity</span>
        </div>
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearch}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="search"
                className={styles.search}
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <button className={styles.darkModeBtn} onClick={toggleDarkMode}>
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </header>

      {/* ---------- Side Navigation ---------- */}
      <aside className={styles.sidebar}>
        <nav>
          <div className={styles.navTop}>
            <button className={styles.sideLink} onClick={() => handleNavClick("home")}>
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button className={styles.sideLink} onClick={() => handleNavClick("popular")}>
              <Flame className="w-5 h-5" />
              <span>Popular</span>
            </button>
            <button className={styles.sideLink} onClick={() => handleNavClick("bible")}>
              <Book className="w-5 h-5" />
              <span>Bible</span>
            </button>
            <hr className={styles.divider} />
          </div>

          <div className={styles.navBottom}>
            <button className={styles.sideLink} onClick={() => handleNavClick("about")}>
              <Mountain className="w-5 h-5" />
              <span>About</span>
            </button>
            <button className={styles.sideLink} onClick={() => handleNavClick("help")}>
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
            <button className={styles.sideLink} onClick={() => handleNavClick("logout")}>
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* ---------- Main Content ---------- */}
      <aside className={styles.MenuCard}>
        <main className={styles.content}>
          {/* Verse of the Day card */}
          <div className={styles.verseOfTheDay}>
            <section className={`${styles.card} ${styles.verseCard}`}>
              <h2>
                VERSE OF
                <br />
                THE DAY
              </h2>
            </section>
          </div>

          {/* Mini cards */}
          <div className={styles.miniCardsContainer}>
            <section className={styles.miniCards}>
              <button className={`${styles.card} ${styles.miniCard}`} onClick={() => handleCardClick("Archives")}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Archive className={styles.cardIcon} />
                    <span className={styles.cardTitle}>Archives</span>
                  </div>
                  <p className={styles.cardSubtitle}>Post Archive</p>
                  <div className={styles.cardBadge}>248 entries</div>
                </div>
              </button>

              <button className={`${styles.card} ${styles.miniCard}`} onClick={() => handleCardClick("Saved")}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Bookmark className={styles.cardIcon} />
                    <span className={styles.cardTitle}>Saved</span>
                  </div>
                  <p className={styles.cardSubtitle}>Saved Chapters</p>
                  <div className={styles.cardBadge}>12 Chapters</div>
                </div>
              </button>

              <button className={`${styles.card} ${styles.miniCard}`} onClick={() => handleCardClick("Daily Readings")}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Calendar className={styles.cardIcon} />
                    <span className={styles.cardTitle}>Daily Readings</span>
                  </div>
                  <p className={styles.cardSubtitle}>{"Today's Quest"}</p>
                  <div className={styles.cardBadge}>15 min left</div>
                </div>
              </button>
            </section>
          </div>
        </main>
      </aside>

      {/* ---------- Streak Panel ---------- */}
      <aside className={styles.streakPanel}>
        <h3>Holy Sprout!</h3>
        <div className={styles.glassBellContainer}>
          <div className={styles.glassBell}></div>
          <div className={styles.bellShadow}></div>
          <div className={styles.bellBase}></div>
        </div>
      </aside>
    </div>
  );
}
