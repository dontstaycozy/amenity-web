'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from '../homePage/HomePage.module.css';
import { useSession } from 'next-auth/react';
import supabase from '../lib/supabaseclient';
import {
  About, Bell, Bible, Fire, Help, Home, Logout, Profile, Sun, LOGO,
} from '@/app/components/svgs';
import { useRouter } from 'next/navigation';
import FilteredSearchBar from '@/app/components/FilteredSearchBar';

interface reply {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}

interface comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  comment_replies: reply[];
}

interface Post {
  id: number;
  topic: string;
  content: string;
  image_url: string;
  created_at: string;
  user_id: string;
  post_comments: comment[];
  post_interactions: {
    likes: number;
  };
  totalEngagement?: number;
}

export default function PopularPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

  const fetchPopularPosts = async () => {
    setLoading(true);

    const { data: interactions, error } = await supabase
      .from('post_interactions')
      .select('post_id')
      .eq('likes', 1);

    if (error) {
      console.error('Error fetching interactions:', error);
      setPopularPosts([]);
      return;
    }

    const likeCountMap: Record<number, number> = {};
    interactions?.forEach(({ post_id }) => {
      likeCountMap[post_id] = (likeCountMap[post_id] || 0) + 1;
    });

    const topPostIds = Object.entries(likeCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([postId]) => Number(postId));

    if (topPostIds.length === 0) {
      setPopularPosts([]);
      setLoading(false);
      return;
    }

    const { data: postsData, error: postsError } = await supabase
      .from('Posts')
      .select(`
        id,
        topic,
        content,
        image_url,
        created_at,
        user_id,
        post_comments (
          id,
          content,
          created_at,
          user_id,
          comment_replies (
            id,
            content,
            created_at,
            user_id
          )
        )
      `)
      .in('id', topPostIds);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      setPopularPosts([]);
      return;
    }

    const postsWithLikes: Post[] = postsData.map(post => ({
      ...post,
      post_interactions: {
        likes: likeCountMap[post.id] || 0,
      },
    }));

    postsWithLikes.sort((a, b) => b.post_interactions.likes - a.post_interactions.likes);
    setPopularPosts(postsWithLikes);
    setLoading(false);
  };

  const fetchTrendingPosts = async () => {
    const { data: likesData, error: likesError } = await supabase
      .from('post_interactions')
      .select('post_id')
      .eq('likes', 1);

    const { data: commentsData, error: commentsError } = await supabase
      .from('post_comments')
      .select('post_id');

    const { data: repliesData, error: repliesError } = await supabase
      .from('comment_replies')
      .select('comment_id, post_comments (post_id)');

    if (likesError || commentsError || repliesError) {
      console.error('Error fetching trending data');
      return;
    }

    const engagementMap: Record<number, number> = {};

    likesData?.forEach(({ post_id }) => {
      engagementMap[post_id] = (engagementMap[post_id] || 0) + 1;
    });

    commentsData?.forEach(({ post_id }) => {
      engagementMap[post_id] = (engagementMap[post_id] || 0) + 1;
    });

    repliesData?.forEach(reply => {
      const pid = reply.post_comments?.[0]?.post_id;
      if (pid) {
        engagementMap[pid] = (engagementMap[pid] || 0) + 1;
      }
    });

    const topEngagedIds = Object.entries(engagementMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => Number(id));

    const { data: postsData, error: postsError } = await supabase
      .from('Posts')
      .select(`
        id,
        topic,
        content,
        image_url,
        created_at,
        user_id,
        post_comments (
          id,
          content,
          created_at,
          user_id,
          comment_replies (
            id,
            content,
            created_at,
            user_id
          )
        )
      `)
      .in('id', topEngagedIds);

    if (postsError) {
      console.error('Error fetching trending posts:', postsError);
      return;
    }

    const posts: Post[] = postsData.map(post => ({
      ...post,
      post_interactions: {
        likes: likesData?.filter(l => l.post_id === post.id).length || 0,
      },
      totalEngagement: engagementMap[post.id],
    }));

    posts.sort((a, b) => (b.totalEngagement || 0) - (a.totalEngagement || 0));
    setTrendingPosts(posts);
  };

  useEffect(() => {
    fetchPopularPosts();
    fetchTrendingPosts();
  }, []);

  const renderPosts = (posts: Post[], title: string, key: string) => (
    <div style={{ marginBottom: '3rem' }}>
      <h2 className="headingMedium" style={{ marginBottom: '1.5rem' }}>{title}</h2>
      <div style={{ backgroundColor: '#1E2B48', padding: '1.75rem', borderRadius: '12px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : posts.length === 0 ? (
          <div>No posts to display.</div>
        ) : (
          posts
            .filter(post => {
              const q = searchQuery.toLowerCase();
              return (
                post.topic.toLowerCase().includes(q) ||
                post.content.toLowerCase().includes(q)
              );
            })
            .map(post => (
              <div key={`${key}-${post.id}`} style={{ border: '1px solid #333', margin: '1rem 0', padding: '1rem', borderRadius: '12px', background: '#112244' }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  {post.topic}
                </div>
                <div style={{ marginBottom: 12 }}>
                  {post.content}
                </div>
                {post.image_url && (
                  <img src={post.image_url} alt="Post" style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: 8 }} />
                )}
                <div style={{ color: '#ffe8a3', fontSize: 14, marginTop: 10 }}>
                  Likes: {post.post_interactions.likes}
                </div>
                {post.totalEngagement !== undefined && (
                  <div style={{ color: '#7fffd4', fontSize: 14 }}>
                    Engagement Score: {post.totalEngagement}
                  </div>
                )}
                <div style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
                  Created at: {new Date(post.created_at).toLocaleString()}
                </div>

                {post.post_comments?.length > 0 && (
                  <div style={{ marginTop: '1rem', background: '#18213a', borderRadius: 8, padding: '1rem' }}>
                    <h4 style={{ marginBottom: 8 }}>Comments</h4>
                    {post.post_comments.map(comment => (
                      <div key={comment.id} style={{ marginBottom: 12, padding: 8, background: '#22305a', borderRadius: 6 }}>
                        <div style={{ fontSize: 14, color: '#ffe8a3' }}>
                          <span style={{ marginRight: 8 }}>[User]</span>
                          <span style={{ color: '#aaa', fontSize: 12 }}>
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ marginTop: 4 }}>{comment.content}</div>

                        <div style={{ marginTop: 8 }}>
                          {comment.comment_replies?.length === 0 ? (
                            <div style={{ fontSize: 13, color: '#ccc' }}>No replies yet.</div>
                          ) : (
                            comment.comment_replies.map(reply => (
                              <div key={reply.id} style={{ background: '#2d3a5a', borderRadius: 6, padding: 6, marginTop: 6 }}>
                                <div style={{ fontSize: 13, color: '#ffe8a3' }}>
                                  <span style={{ marginRight: 8 }}>[User]</span>
                                  <span style={{ color: '#aaa', fontSize: 11 }}>
                                    {new Date(reply.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <div style={{ marginTop: 2 }}>{reply.content}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <LOGO style={{ width: 100, height: 100 }} />
            <h3 className="headingMedium" style={{ fontFamily: "'Segoe Script', cursive" }}>Amenity</h3>
          </div>
          <div className={styles.headerMid}>
            <FilteredSearchBar
              filterLabel="Popular"
              placeholder="Search Posts..."
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onDelete={() => setSearchQuery('')}
            />
          </div>
          <div className={styles.headerRight}>
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
              <button className={styles.navItem} onClick={() => router.push('/aboutPage')}>
                <div className={styles.navIcon}><About /></div>
                <span className={styles.navText}>About</span>
              </button>
              <button className={styles.navItem} onClick={goToHelp}><div className={styles.navIcon}><Help /></div><span className={styles.navText}>Help</span></button>
            </div>
          </div>

          <div className={styles.mainMid}>
            {renderPosts(trendingPosts, 'Top 10 Trending Posts', 'trending')}
            {renderPosts(popularPosts, 'Top 10 Most Liked Posts', 'liked')}
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
