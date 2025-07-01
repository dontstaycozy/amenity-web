'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './HomePage.module.css';
import { useSession } from 'next-auth/react';
import supadata from '../lib/supabaseclient';
import {
  Archive,
  About,
  Bell,
  Bible,
  Bookmark,
  Calendar,
  Fire,
  Help,
  Home,
  Logout,
  Profile,
  Search,
  Sun,
  Create,
  LOGO,
  Delete,
  UnArchive
} from '@/app/components/svgs'; // Adjust the import path as necessary
import { signOut } from 'next-auth/react';
import CreatePostModal from './CreatePostModal';
import EditProfileModal from './EditProfileModal';
import { useRouter } from 'next/navigation';
import CommentSection from './CommentSection';
import PostInteractions from './PostInteractions';
import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


dayjs.extend(utc);
dayjs.extend(timezone);

const localTZ = 'Asia/Manila';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}
export default function HomePage() {
  const router = useRouter();
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const biblePage = () => {
    router.push('/biblePage');
  }

  const goToHelp = () => {
    router.push('/helpPage');
  };

  const archivedPage = () => {
    router.push('/archivedPage');
  };
  const [verseOfTheDay, setVerseOfTheDay] = useState({ text: '', reference: '' });

  useEffect(() => {
    async function fetchRandomVerse() {
      try {
        const res = await fetch('https://labs.bible.org/api/?passage=random&type=json');
        const data = await res.json();
        if (data && data.length > 0) {
          setVerseOfTheDay({
            text: data[0].text,
            reference: `${data[0].bookname} ${data[0].chapter}:${data[0].verse}`,
          });
        }
      } catch (err) {
        setVerseOfTheDay({
          text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
          reference: "John 3:16"
        });
      }
    }
    fetchRandomVerse();
  }, []);
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Array<{
    id: number;
    topic: string;
    content: string;
    image_url?: string;
    created_at: string;
    user_id: string;
  }>>([]);

  // Add state to track archived posts for the current user
  const [archivedPostIds, setArchivedPostIds] = useState<Set<number>>(new Set());

  // Fetch archived posts for the current user
  useEffect(() => {
    const fetchArchivedPosts = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supadata
        .from('archived_posts')
        .select('id, post_id')
        .eq('user_id', session.user.id);
      if (!error && data) {
        setArchivedPostIds(new Set(data.map((row: any) => row.post_id)));
      }
    };
    fetchArchivedPosts();
  }, [session?.user?.id]);

  const [savedCount, setSavedCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [streakDone, setStreakDone] = useState(false);


  // Calculate time left until end of day
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setTimeLeft('0m left');
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSavedCount = async () => {
      if (session?.user?.id) {
        const { count, error } = await supadata
          .from('bookmarking')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
        if (!error && typeof count === 'number') {
          setSavedCount(count);
        }
      }
    };
    fetchSavedCount();
  }, [session]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supadata
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
  checkstreaks();
}, [session?.user?.id]);


  // Add handleDelete function
  const handleDelete = async (postId: number) => {
    const { error } = await supadata
      .from('Posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.log("Error: ", error);
      alert('Failed to delete post!');
    } else {
      setPosts(posts => posts.filter(post => post.id !== postId));
    }
  };

  // Archive/unarchive logic
  const handleArchive = async (postId: number) => {
    if (!session?.user?.id) return;

    const postToArchive = posts.find(p => p.id === postId);
    if (!postToArchive) return;

    if (archivedPostIds.has(postId)) {
      // Unarchive
      const { error } = await supadata
        .from('archived_posts')
        .delete()
        .eq('user_id', session.user.id)
        .eq('post_id', postId);
      if (!error) {
        setArchivedPostIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } else {
      // Archive
      console.log("user: ", session.user.id);
      const { error } = await supadata
        .from('archived_posts')
        .insert([{
          user_id: session.user.id,
          post_id: postId,
          title: postToArchive.topic,  
          created_at: new Date().toISOString()
        }]);

      if (!error) {
        setArchivedPostIds(prev => new Set(prev).add(postId));
      }
    }
  };

  const checkstreaks = async () => {
  if (!session?.user?.id) return;

  const today = dayjs().tz(localTZ).format('YYYY-MM-DD');

  const { data: streak, error } = await supadata
    .from('streaks_input')
    .select('date')
    .eq('user_id', session.user.id)
    .single();

  if (error || !streak) {
    setStreakDone(false);
    return;
  }

  const lastActiveDate = dayjs(streak.date).tz(localTZ).format('YYYY-MM-DD');
  setStreakDone(lastActiveDate === today);
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
                  <div className={styles.dropdownItem} onClick={() => { setShowEditProfileModal(true); setShowProfileMenu(false); }}>
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
              <div className={styles.navItem}>
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
            {/* Verse of the Day */}
            <div className={styles.verseContainer}>
              <h2 className={styles.headingLargeVerse}>VERSE OF THE DAY</h2>
              <p className="paragraph">&ldquo;{verseOfTheDay.text}&rdquo; - {verseOfTheDay.reference}</p>
            </div>

            {/* Card Container */}
            <div className={styles.cardContainer}>
              <div className={styles.card} tabIndex={0} role="button" onClick={archivedPage}>
                <div className={styles.cardIcon}>
                  <Archive />
                </div>
                <h3 className={styles.cardTitle}>Archives</h3>
                <p className={styles.cardInfo}>Post Archive</p>
                <p className={styles.cardInfo}>248 entries</p>
              </div>

              <div className={styles.card} tabIndex={0} role="button"
                onClick={() => {
                  localStorage.setItem('biblePageActiveView', 'saveChapter');
                  router.push('/biblePage');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardIcon}>
                  <Bookmark />
                </div>
                <h3 className={styles.cardTitle}>Saved</h3>
                <p className={styles.cardInfo}>Saved Chapters</p>
                <p className={styles.cardInfo}>{savedCount} Chapters</p>
              </div>

              <div className={styles.card} tabIndex={0} role="button"
                onClick={() => {
                  localStorage.setItem('biblePageActiveView', 'daily');
                  router.push('/biblePage');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardIcon}>
                  <Calendar />
                </div>
                <h3 className={styles.cardTitle}>Daily Readings</h3>
                <p className={styles.cardInfo}>Today&apos;s Quest</p>
                <p className={styles.cardInfo}>
    {streakDone ? '✅ Done' : timeLeft}
  </p>
              </div>
            </div>

            <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
              <h2 className="headingMedium" style={{ marginBottom: '1.5rem' }}>See what&apos;s going on...</h2>
              <div style={{
                backgroundColor: '#1E2B48',
                padding: '1.75rem',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}>

                <div>
                  {posts.map(post => (
                    <div key={post.id} style={{ border: '1px solid #333', margin: '1rem 0', padding: '1rem', borderRadius: '12px', background: '#112244', position: 'relative' }}>
                      {/* Archive button, always at top right, left of delete if owner */}
                      <button
                        onClick={() => handleArchive(post.id)}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: post.user_id === session?.user?.id ? 50 : 10,
                          cursor: 'pointer',
                          color: archivedPostIds.has(post.id) ? '#ffe8a3' : '#aaa',
                          fontSize: '1.5rem',
                          zIndex: 1
                        }}
                        title={archivedPostIds.has(post.id) ? 'Unarchive post' : 'Archive post'}
                      >
                        {archivedPostIds.has(post.id) ? <Archive /> : <UnArchive />}
                      </button>


                      {/* Delete button, only for post owner */}
                      {post.user_id === session?.user?.id && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'red',
                            fontSize: '1.5rem',
                            zIndex: 2
                          }}
                          title="Delete post"
                        >
                          <Delete />
                        </button>
                      )}
                      <div>
                        <strong>{post.topic}</strong> | {formatDate(post.created_at)}
                      </div>
                      <div>{post.content}</div>
                      {post.image_url && (
                        <Image
                          src={post.image_url}
                          alt="Post image"
                          width={500}
                          height={300}
                          style={{ maxWidth: '100%', marginTop: '1rem' }}
                        />
                      )}
                      <PostInteractions postId={post.id} currentUserId={session?.user?.id || ''} />
                      <CommentSection postId={post.id} currentUserId={session?.user?.id || ''} />
                    </div>
                  ))}
                </div>

              </div>
              <button
                className={styles.CreateButton}
                aria-label="Create Post"
                style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}
                onClick={() => setShowCreateModal(true)}
              >
                <Create />
              </button>
            </div>
            {/* Modal for creating a post */}
            <CreatePostModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              username={session?.user?.name || ""}
            />
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
      <EditProfileModal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} />
      {/* Modal for creating a post */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        username={session?.user?.name || ""}
      />
    </div>
  );
}
