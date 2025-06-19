"use client";
import styles from "./HomePage.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from "next-auth/react";

export default function HomePage() {
const { data: session, status } = useSession();

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
    <div className={styles.screen}>
      {/* ---------- Top Navbar ---------- */}
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <img src="public/images/tree.png" alt="Amenity logo" />
          <span>Amenity</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
        <div className={styles.searchWrapper}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search…"
          />
        </div>
        <button className={styles.darkModeBtn}>insertMoon</button>
      </header>

      {/* ---------- Side Navigation ---------- */}
      <aside className={styles.sidebar}>
        <nav>
          <div className={styles.navTop}>
            <a className={styles.sideLink} href="#">
              <span>InsertHomeButton</span> Home
            </a>
            <a className={styles.sideLink} href="#">
              <span>InsertFireButton</span> Popular
            </a>
            <a className={styles.sideLink} href="#">
              <span>InsertbibleButton</span> Bible
            </a>
            <hr />
          </div>

          <div className={styles.navBottom}>
            <a className={styles.sideLink} href="#">
              <span>InsertLogo</span> About
            </a>
            <a className={styles.sideLink} href="#">
              <span>?</span> Help
            </a>
            <a className={styles.sideLink} href="#">
              <span>InsertLogOutButton</span> Log Out
            </a>
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
              <div className={styles.card}>Archives</div>
              <div className={styles.card}>Saved Chapters</div>
              <div className={styles.card}>unsay ibutang diri????</div>
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
