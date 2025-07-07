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
    Sun,
    LOGO,
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';
import FAQItem from './FAQItem';
import { faqList } from './FAQdata';
import FilteredSearchBar from '@/app/components/FilteredSearchBar';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/NotificationItem';

// If Notification type is imported from notificationService, redefine locally for compatibility:
type Notification = {
  id: string;
  user_id?: string;
  message: string;
  type: string;
  is_read?: boolean;
  created_at?: string;
  title?: string;
  icon?: string;
  timestamp?: Date | string | number;
  isRead?: boolean;
  actionUrl?: string;
};

export default function HelpPage() {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showStreakModal, setShowStreakModal] = useState(false);

    // --- Burger menu state for mobile ---
    const [openSide, setOpenSide] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const handleOpenSide = () => setOpenSide(true);
    const handleCloseOverlay = () => setOpenSide(false);

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

    // Add navigation for Help/About if you want
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const toggleNotificationMenu = () => {
        setShowNotificationMenu(!showNotificationMenu);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                notificationDropdownRef.current &&
                !notificationDropdownRef.current.contains(event.target as Node)
            ) {
                setShowNotificationMenu(false);
            }
        }
        if (showNotificationMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotificationMenu]);
    
    return (
        <div className={styles.body}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    {/* Hamburger menu for mobile (only hamburger, no X here) */}
                    {isMobile && !openSide && (
                        <button
                            className={styles.hamburgerMenu}
                            aria-label="Open Menu"
                            onClick={handleOpenSide}
                            style={{ position: 'absolute', left: 10, top: 18, zIndex: 1001, background: 'none', border: 'none', display: isMobile ? 'block' : 'none' }}
                        >
                            <span>&#9776;</span>
                        </button>
                    )}
                    {/* X button inside sidebar when openSide is true (not in header) */}
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
                        <div className={styles.notificationContainer} ref={notificationDropdownRef}>
                            <span className={styles.headerIcon} onClick={toggleNotificationMenu}>
                                <Bell />
                                {unreadCount > 0 && (
                                    <div className={styles.notificationBadge}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </div>
                                )}
                            </span>
                            {showNotificationMenu && (
                                <div className={styles.notificationDropdown}>
                                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ color: '#f5f0e9', fontSize: '1rem', fontWeight: '600', margin: 0 }}>Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={e => { e.stopPropagation(); markAllAsRead(); }}
                                                style={{ background: 'none', border: 'none', color: '#ffe8a3', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: '#8b9cb3' }}>No notifications</div>
                                        ) : (
                                            notifications.map(notification => (
                                                <NotificationItem key={notification.id} notification={notification as Notification} onMarkAsRead={markAsRead} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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
                    {/* Left Navigation Panel (desktop) */}
                    <div className={styles.mainLeft} style={isMobile ? { display: 'none' } : {}}>
                        <div className={styles.mainLeftUp}>
                            <button className={styles.navItem} onClick={homePage}>
                                <div className={styles.navIcon}><Home /></div>
                                <span className={styles.navText}>Home</span>
                            </button>
                            <div className={styles.navItem} onClick={() => router.push('/PopularPage')}>
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
                    {/* Overlay for mobile popout */}
                    {isMobile && openSide && (
                        <>
                        {/* Overlay background */}
                        <div onClick={handleCloseOverlay} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 999 }} />
                        {/* Sidebar menu */}
                        <div
                          className={styles.mainLeft + ' ' + styles.mobileSidebar}
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100vh',
                            width: '80vw',
                            background: '#1e2b48',
                            zIndex: 1000,
                            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* Gold X button */}
                          <button
                            onClick={handleCloseOverlay}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#FFE8A3',
                              fontSize: '2rem',
                              position: 'absolute',
                              left: 16,
                              top: 16,
                              zIndex: 1001,
                              cursor: 'pointer',
                            }}
                            aria-label="Close Menu"
                          >
                            &#10005;
                          </button>
                          <div style={{ marginTop: '3.5rem' }}>
                            <button className={styles.navItem} onClick={() => { handleCloseOverlay(); homePage(); }}>
                              <div className={styles.navIcon}><Home /></div>
                              <span className={styles.navText}>Home</span>
                            </button>
                            <button className={styles.navItem} onClick={() => { handleCloseOverlay(); router.push('/PopularPage'); }}>
                              <div className={styles.navIcon}><Fire /></div>
                              <span className={styles.navText}>Popular</span>
                            </button>
                            <button className={styles.navItem} onClick={() => { handleCloseOverlay(); biblePage(); }}>
                              <div className={styles.navIcon}><Bible /></div>
                              <span className={styles.navText}>Bible</span>
                            </button>
                          </div>
                          <div style={{ marginBottom: '2rem' }}>
                            <button className={styles.navItem} onClick={() => { handleCloseOverlay(); router.push('/aboutPage'); }}>
                              <div className={styles.navIcon}><About /></div>
                              <span className={styles.navText}>About</span>
                            </button>
                            <button className={styles.navItem} onClick={handleCloseOverlay}>
                              <div className={styles.navIcon}><Help /></div>
                              <span className={styles.navText}>Help</span>
                            </button>
                          </div>
                        </div>
                        </>
                    )}
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
                    {!isMobile && (
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
                    )}
                </div>
                {/* Floating Streak Button for mobile */}
                {isMobile && (
                  <>
                    <button
                      className={FAQstyles.fabStreak}
                      aria-label="Open Streak Plant"
                      onClick={() => setShowStreakModal(true)}
                    >
                      <span role="img" aria-label="Streak Plant">🌱</span>
                    </button>
                    {showStreakModal && (
                      <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          background: '#1e2b48',
                          borderRadius: '18px',
                          padding: '2rem 1.5rem 1.5rem 1.5rem',
                          position: 'relative',
                          minWidth: '320px',
                          maxWidth: '90vw',
                          width: '100%',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                          <button
                            onClick={() => setShowStreakModal(false)}
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 16,
                              background: 'none',
                              border: 'none',
                              color: '#fff',
                              fontSize: 32,
                              cursor: 'pointer',
                              zIndex: 10,
                            }}
                            aria-label="Close"
                          >
                            ×
                          </button>
                          <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Streak Plant!</h2>
                          <div className={FAQstyles.glassBellContainer}>
                            <div className={FAQstyles.glassBell}></div>
                            <div className={FAQstyles.bellShadow}></div>
                            <div className={FAQstyles.bellBase}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
            </main>
        </div>
    );
}