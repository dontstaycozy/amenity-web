"use client";
import React, { useEffect, useState, useRef } from 'react';
import styles from '../homePage/HomePage.module.css';
import { useSession } from 'next-auth/react';
import supabase from '../lib/supabaseclient';
import {
  Archive,
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
  Close,
  UnArchive
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';

export default function ArchivedPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [archivedPosts, setArchivedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const biblePage = () => router.push('/biblePage');
  const goToHelp = () => router.push('/helpPage');
  const logOut = () => router.push('/loginPage');
  const homePage = () => router.push('/homePage');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownRef]);

  useEffect(() => {
    const fetchArchivedPosts = async () => {
      if (!session?.user?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('archived_posts')
        .select(`
          id,
          post_id,
          created_at,
          Posts (
            id,
            topic,
            content,
            image_url,
            created_at,
            user_id
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching archived posts:", error);
        setArchivedPosts([]);
      } else {
        setArchivedPosts(data || []);
      }

      setLoading(false);
    };

    fetchArchivedPosts();
  }, [session?.user?.id]);

  const handleRemove = async (id: number) => {
    const { error } = await supabase
      .from('archived_posts')
      .delete()
      .eq('id', id);
    if (!error) {
      setArchivedPosts(posts => posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className={styles.body}>
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
                placeholder="Search in Archives..."
              />
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.headerIcon}><Bell /></span>
            <div className={styles.profileContainer} ref={profileDropdownRef}>
              <span className={styles.headerIcon} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <Profile />
              </span>
              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownItem}><span><Profile /></span><span>View Profile</span></div>
                  <div className={styles.dropdownItem} onClick={logOut}><span><Logout /></span><span>Log Out</span></div>
                  <div className={styles.dropdownItem}><span><Sun /></span><span>Light Mode</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <div className={styles.mainLeft}>
            <div className={styles.mainLeftUp}>
              <div className={styles.navItem} onClick={homePage}><div className={styles.navIcon}><Home /></div><span className={styles.navText}>Home</span></div>
              <div className={styles.navItem}><div className={styles.navIcon}><Fire /></div><span className={styles.navText}>Popular</span></div>
              <button className={styles.navItem} onClick={biblePage}><div className={styles.navIcon}><Bible /></div><span className={styles.navText}>Bible</span></button>
            </div>
            <div className={styles.mainLeftBottom}>
              <div className={styles.navItem}><div className={styles.navIcon}><About /></div><span className={styles.navText}>About</span></div>
              <button className={styles.navItem} onClick={goToHelp}><div className={styles.navIcon}><Help /></div><span className={styles.navText}>Help</span></button>
            </div>
          </div>

          <div className={styles.mainMid}>
            <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
              <h2 className="headingMedium" style={{ marginBottom: '1.5rem' }}>Your Archived Posts</h2>
              <div style={{ backgroundColor: '#1E2B48', padding: '1.75rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                {loading ? (
                  <div>Loading...</div>
                ) : archivedPosts.length === 0 ? (
                  <div>No archived posts yet.</div>
                ) : (
                  archivedPosts.map(post => (
                    <div key={post.id} style={{ border: '1px solid #333', margin: '1rem 0', padding: '1rem', borderRadius: '12px', background: '#112244', position: 'relative' }}>
                      <button
                        onClick={() => handleRemove(post.id)}
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ffe8a3',
                          fontSize: '1.5rem',
                          zIndex: 2
                        }}
                        title="Remove from archive"
                      >
                        <Close />
                      </button>

                      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                        {post.Posts?.topic || 'Untitled'}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        {post.Posts?.content || 'No content available.'}
                      </div>
                      {post.Posts?.image_url && (
                        <img
                          src={post.Posts.image_url}
                          alt="Post image"
                          style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: 8 }}
                        />
                      )}
                      <div style={{ color: '#aaa', fontSize: 13, marginTop: 10 }}>
                        Archived at: {new Date(post.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

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
