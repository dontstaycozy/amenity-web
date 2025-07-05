"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '../homePage/HomePage.module.css';
import FAQstyles from './HelpPage.module.css';
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
    Delete,
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';
import FAQItem from './FAQItem';
import { faqList } from './FAQdata';
import { signOut } from 'next-auth/react';
import FilteredSearchBar from '@/app/components/FilteredSearchBar';

export default function HelpPage() {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Reference to the dropdown container
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    // Toggle profile dropdown
    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

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

    // Filter FAQ list based on search query
    const filteredFaqList = faqList.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const homePage = () => {
        router.push('/homePage');
    }

    const biblePage = () => {
        router.push('/biblePage');
    };

    const logOut = () => {
        signOut({ callbackUrl: "/loginPage" });
    }
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
                        <FilteredSearchBar
                            filterLabel="FAQ"
                            placeholder="Search in Help..."
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onDelete={() => router.push('/homePage')}
                        />
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.headerIcon}><Bell /></span>

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
                            <button className={styles.navItem} onClick={biblePage}>
                                <div className={styles.navIcon}><Bible /></div>
                                <span className={styles.navText}>Bible</span>
                            </button>
                        </div>
                        <div className={styles.mainLeftBottom}>
                            <button className={styles.navItem} onClick={() => router.push('/aboutPage')}>
                                <div className={styles.navIcon}><About /></div>
                                <span className={styles.navText}>About</span>
                            </button>
                            <div className={styles.navItem}>
                                <div className={styles.navIcon}><Help /></div>
                                <span className={styles.navText}>Help</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Content Area - FAQ */}
                    <div className={styles.mainMid}>
                        <div>
                            <h2 className={FAQstyles.faqTitle}>FAQ</h2>
                            {filteredFaqList.map((faq, idx) => (
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