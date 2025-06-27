"use client";
import React from 'react';
import styles from '../homePage/HomePage.module.css'; // Reuse HomePage styles!
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
    LOGO,
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';
import FAQItem from './FAQItem';
import { faqList } from './FAQdata';

export default function HelpPage() {
    const router = useRouter();

    const homePage = () => {
        router.push('/homePage');
    }

    const biblePage = () => {
        router.push('/biblePage');
    };
    // Add navigation for Help/About if you want

    return (
        <div className={styles.body}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <LOGO style={{ width: 100, height: 100 }} />
                        <h3 className="headingMedium" style={{ fontFamily: "'Segoe Script', cursive" }}>Amenity</h3>
                    </div>
                    <div className={styles.headerMid}>
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>
                                <button className={styles.searchIcon}>
                                    <Search style={{ cursor: "pointer" }} />
                                </button>
                            </span>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.headerIcon}><Bell /></span>
                        <span className={styles.headerIcon}><Profile /></span>
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
                            <button className={styles.navItem} onClick={biblePage}>
                                <div className={styles.navIcon}><Bible /></div>
                                <span className={styles.navText}>Bible</span>
                            </button>
                        </div>
                        <div className={styles.mainLeftBottom}>
                            <div className={styles.navItem}>
                                <div className={styles.navIcon}><About /></div>
                                <span className={styles.navText}>About</span>
                            </div>
                            <div className={styles.navItem}>
                                <div className={styles.navIcon}><Help /></div>
                                <span className={styles.navText}>Help</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Content Area - FAQ */}
                    <div className={styles.mainMid}>
                        <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, background: '#18213a', borderRadius: 12 }}>
                            <h2 style={{ color: '#ffe8a3', marginBottom: 24 }}>Amenity – Frequently Asked Questions (FAQ)</h2>
                            {faqList.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className={styles.mainRight}>
                        <div className={styles.rightContainer}>
                            <h3 className="headingMedium">Streak Plant!</h3>
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