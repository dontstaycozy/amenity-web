'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './AboutPage.module.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Comments
} from '@/app/components/svgs';
import { signOut } from 'next-auth/react';

export default function AboutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  const goToHome = () => {
    router.push('/homePage');
  };
  
  const biblePage = () => {
    router.push('/biblePage');
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
  
  // Fade-in and fade-out on scroll logic
  useEffect(() => {
    const elements = document.querySelectorAll('.' + styles.fadeInOnScroll);
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            entry.target.classList.remove(styles.fadeOut);
          } else {
            entry.target.classList.remove(styles.visible);
            entry.target.classList.add(styles.fadeOut);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <div className={styles.body}>
      {/* Header Section - Reused from HomePage */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <LOGO style={{ width: 100, height: 100 }} />
            <h3 className="headingMedium" style={{ fontFamily: "'Segoe Script', cursive" }}>Amenity</h3>
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
          {/* Left Navigation Panel - Reused from HomePage */}
          <div className={styles.mainLeft}>
            <div className={styles.mainLeftUp}>
              <div className={styles.navItem} onClick={goToHome}>
                <div className={styles.navIcon}><Home /></div>
                <span className={styles.navText}>Home</span>
              </div>
              
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
              <button className={styles.navItem} style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <div className={styles.navIcon}><About /></div>
                <span className={styles.navText}>About</span>
              </button>
              
              <button className={styles.navItem} onClick={goToHelp}>
                <div className={styles.navIcon}><Help /></div>
                <span className={styles.navText}>Help</span>
              </button>
            </div>
          </div>
          
          {/* Right Box - Main About Content with Splash Background */}
          <div className={styles.rightBox}>
            {/* Gradient overlay for smooth scrolling effect */}
            <div className={styles.scrollGradient}></div>
            
            {/* Content wrapper to keep content above background layers */}
            <div className={styles.contentWrapper}>
              {/* Splash Section */}
              <section className={styles.splashSection}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <Image 
                    src="/images/tree.png" 
                    alt="Amenity Logo" 
                    width={400} 
                    height={0} 
                    className={styles.logoImage}
                    style={{ height: 'auto' }}
                    priority
                  />
                  <h1 className={styles.brandName}>Amenity</h1>
                </div>
              </section>
              
              {/* About Us Section */}
              <section className={`${styles.contentSection} ${styles.fadeInOnScroll}`}>
                <div className={styles.sectionLeft}>
                  <h2 className={styles.sectionTitle}>About us!</h2>
                  <p className={styles.sectionText}>
                    Welcome to JZML! We're a team of aspiring developers, and this website is our hands-on project to learn and grow. We're putting our best effort into making it a polished and presentable experience as we expand our skills.


                  </p>
                </div>
                <div className={styles.sectionRight}>
                  <Image 
                    src="/images/AboutUs.jpg" 
                    alt="Team working together" 
                    width={350} 
                    height={250} 
                    className={styles.sectionImage}
                  />
                </div>
              </section>
              
              {/* Why Amenity Section */}
              <section className={`${styles.contentSection} ${styles.fadeInOnScroll}`}>
                <div className={styles.sectionRight}>
                  <Image 
                    src="/images/WhyAmenity.jpg" 
                    alt="People in community" 
                    width={350} 
                    height={250} 
                    className={styles.sectionImage}
                  />
                </div>
                <div className={styles.sectionLeft}>
                  <h2 className={styles.sectionTitle}>Why Amenity?</h2>
                  <p className={styles.sectionText}>
                    Amenity is a peaceful online space where people can reconnect with God and share their thoughts—whether it's a confession, a burden, or simply a good day—while receiving support, prayers, or advice from a kind and understanding community. As students, we wanted to build something meaningful that helps others feel heard and spiritually supported. We believe that faith and connection shouldn't be limited by distance, so Amenity bridges that gap by creating a safe space for people to grow, heal, and connect with both God and others.



                  </p>
                </div>
              </section>
              
              {/* Our Story Section */}
              <section className={`${styles.contentSection} ${styles.fadeInOnScroll}`}>
                <div className={styles.sectionLeft}>
                  <h2 className={styles.sectionTitle}>Our Story!</h2>
                  <p className={styles.sectionText}>
                    Building Amenity was our first big project—and it wasn’t easy. With just a month to finish it, we learned while coding, faced many bugs, and grew through the process.<br/>
                    Wilfred Justin Peteros led as project manager and full-stack developer. Louielyn Abella handled UI/UX and frontend, Mary Claire worked full-stack, and Joram Zhient Entice managed the backend and database. Despite the challenges, we’re proud of what we built together.
                  </p>
                </div>
                <div className={styles.sectionRight}>
                  <Image 
                    src="/images/JZML.jpg" 
                    alt="Team photo" 
                    width={350} 
                    height={250} 
                    className={styles.sectionImage}
                  />
                </div>
              </section>
              
              {/* Contact Section */}
              <section className={`${styles.contactSection} ${styles.fadeInOnScroll}`}>
                <div className={styles.footerRow}>
                  <div className={styles.footerColLeft}>
                    <div className={styles.footerLeftStack}>
                      <span className={styles.footerContactLabel}>Contact Us:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={styles.emailIcon} style={{ color: '#FFE8A3' }}><Comments /></span>
                        <a href="mailto:amenity.web11@gmail.com">amenity.web11@gmail.com</a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.footerColCenter}>
                    <div className={styles.footerSeparator}></div>
                  </div>
                  <div className={styles.footerColRight}>
                    <div className={styles.footerRightStack}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Image 
                          src="/images/tree.png" 
                          alt="Amenity Logo" 
                          width={45} 
                          height={45} 
                          className={styles.footerLogoImg}
                        />
                        <span className={styles.footerBrandName}>Amenity</span>
                      </div>
                      <span className={styles.footerBy}>By: J2ML</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
