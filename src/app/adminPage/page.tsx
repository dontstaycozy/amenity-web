'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './AdminPage.module.css';
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
import supadata from '../lib/supabaseclient';
import CreatePostModalStyles from '../homePage/CreatePostModal.module.css';

// Helper to generate a random password
function generatePassword(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  // State for profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);
  const [showPostsTable, setShowPostsTable] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<string | null>(null);
  const [flaggingPostId, setFlaggingPostId] = useState<number | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Reference to the dropdown container
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const userAccounts = async() => {
    setShowUserTable(true);
    setLoadingUsers(true);
    const {data, error } = await supadata
        .from('Users_Accounts')
        .select('username, email, password, last_login, status');
    if (!error && data) {
        setUsers(data);
    }
    setLoadingUsers(false);
  }

  const handleLogOut = () => {
    signOut({ callbackUrl: '/loginPage' });
  };

  // Function to reset password and email the user
  const handleResetPassword = async (user: any) => {
    setResettingUser(user.username);
    setResetMessage(null);
    
    try {
      // Generate a new password
      const newPassword = generatePassword(12);
      
      // Update the password in the Users_Accounts table
      const { error: updateError } = await supadata
        .from('Users_Accounts')
        .update({ password: newPassword })
        .eq('username', user.username);
      
      if (updateError) {
        setResetMessage('Failed to update password in database.');
        return;
      }
      
      console.log('🔐 Attempting to send email to:', user.email);
      
      // Send email with the new password using the custom API
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: newPassword,
          username: user.username,
        }),
      });
      
      console.log('📧 Response status:', response.status);
      console.log('📧 Response ok:', response.ok);
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
          console.error('📧 Email API error data:', errorData);
        } catch (parseError) {
          console.error('📧 Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        // Fallback: show password even if email fails
        const errorMessage = (errorData as any)?.details || (errorData as any)?.error || `HTTP ${response.status}`;
        setResetMessage(`Password updated successfully! New password: ${newPassword} (Email sending failed: ${errorMessage})`);
      } else {
        const responseData = await response.json().catch(() => ({}));
        console.log('✅ Email sent successfully:', responseData);
        setResetMessage(`New password sent to ${user.email}. Password: ${newPassword}`);
      }
      
      // Update the local state to reflect the new password
      setUsers((prev) => prev.map(u => u.username === user.username ? { ...u, password: newPassword } : u));
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      setResetMessage('An error occurred while resetting the password.');
    }
    
    setResettingUser(null);
  };

  // Function to suspend or unsuspend a user
  const handleToggleSuspend = async (user: any) => {
    setSuspendingUser(user.username);
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const { error } = await supadata
      .from('Users_Accounts')
      .update({ status: newStatus })
      .eq('username', user.username);
    if (!error) {
      setUsers((prev) => prev.map(u => u.username === user.username ? { ...u, status: newStatus } : u));
    }
    setSuspendingUser(null);
  };

  // Handler to show posts
  const handleShowPosts = async () => {
    setShowUserTable(false);
    setShowPostsTable(true);
    setLoadingPosts(true);
    const { data, error } = await supadata
      .from('Posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data);
    }
    setLoadingPosts(false);
  };

  // Handler to delete a post
  const handleDeletePost = async (postId: number) => {
    setDeletingPostId(postId);
    const { error } = await supadata
      .from('Posts')
      .delete()
      .eq('id', postId);
    if (!error) {
      setPosts(posts => posts.filter(post => post.id !== postId));
    } else {
      alert('Failed to delete post!');
    }
    setDeletingPostId(null);
  };

  // Handler to flag or unflag a post as violation (toggle flagged field)
  const handleToggleFlagPost = async (postId: number, currentFlagged: boolean) => {
    setFlaggingPostId(postId);
    const { error } = await supadata
      .from('Posts')
      .update({ flagged: !currentFlagged })
      .eq('id', postId);
    if (!error) {
      setPosts(posts => posts.map(post => post.id === postId ? { ...post, flagged: !currentFlagged } : post));
    } else {
      alert('Failed to update flag status!');
    }
    setFlaggingPostId(null);
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

  // Edit Post Modal component
  function EditPostModal({ isOpen, onClose, post, onSave }: { isOpen: boolean, onClose: () => void, post: any, onSave: (updated: any) => void }) {
    const [topic, setTopic] = useState(post?.topic || '');
    const [content, setContent] = useState(post?.content || '');
    const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    useEffect(() => {
      setTopic(post?.topic || '');
      setContent(post?.content || '');
      setImagePreview(post?.image_url || null);
      setImageFile(null);
    }, [post]);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let imageUrl = post?.image_url || null;
      if (imageFile) {
        // Reuse uploadImage from CreatePostModal
        const filePath = `public/${Date.now()}_${imageFile.name}`;
        const { data, error } = await supadata.storage.from('post-images').upload(filePath, imageFile);
        if (!error && data) {
          const { data: publicUrlData } = supadata.storage.from('post-images').getPublicUrl(data.path);
          imageUrl = publicUrlData?.publicUrl || null;
        } else {
          alert('Image upload failed!');
          return;
        }
      }
      const { error } = await supadata.from('Posts').update({ topic, content, image_url: imageUrl, updated_at: new Date().toISOString() }).eq('id', post.id);
      if (!error) {
        onSave({ ...post, topic, content, image_url: imageUrl });
        onClose();
      } else {
        console.error('Failed to update post!', error);
        alert('Failed to update post!');
      }
    };
    if (!isOpen) return null;
    return (
      <div className={CreatePostModalStyles.overlay} onClick={onClose}>
        <div className={CreatePostModalStyles.modal} onClick={e => e.stopPropagation()}>
          <div className={CreatePostModalStyles.header}>
            <div className={CreatePostModalStyles.avatar}></div>
            <span className={CreatePostModalStyles.username}>{post?.user_id}</span>
          </div>
          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className={CreatePostModalStyles.topicInput}
          />
          <textarea
            className={CreatePostModalStyles.textarea}
            placeholder="Write something..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          {imagePreview && (
            <div style={{ margin: '1rem', textAlign: 'center' }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12 }} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="edit-image-upload"
            onChange={handleImageChange}
          />
          <div className={CreatePostModalStyles.footer}>
            <button className={CreatePostModalStyles.postBtn} onClick={handleSubmit}>Save</button>
            <button
              className={CreatePostModalStyles.imageBtn}
              onClick={() => {
                const input = document.getElementById('edit-image-upload') as HTMLInputElement | null;
                if (input) input.click();
              }}
            >
              Change Image
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick = {() => signOut({callbackUrl: "/loginPage"})}>
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

              <button className={styles.navItem} onClick={userAccounts}>
                <div className={styles.navIcon}><Home /></div>
                <span className={styles.navText}>Manage User Accounts</span>
              </button>

              <div className={styles.navItem} onClick={handleShowPosts} style={{ cursor: 'pointer' }}>
                <div className={styles.navIcon}><Fire /></div>
                <span className={styles.navText}>Posts</span>
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

              <div className={styles.navItem}>
                <div className={styles.navIcon}><Help /></div>
                <span className={styles.navText}>Help</span>
              </div>
            </div>
          </div>

          {/* Middle Content Area - Now Scrollable */}
          <div className={styles.mainMid}>
            <div className={styles.navContainer}>
              {showUserTable && (
                <div className={styles.userTableWrapper}>
                {loadingUsers ? (
                  <div className={styles.userTableLoading}>Loading...</div>
                ) : (
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Last Login</th>
                        <th>Status</th>
                        <th>Reset Password</th>
                        <th>Suspend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <tr key={idx}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.password}</td>
                          <td>{user.last_login ? new Date(user.last_login).toLocaleString() : ''}</td>
                          <td>{user.status}</td>
                          <td>
                            <button
                              onClick={() => handleResetPassword(user)}
                              disabled={resettingUser === user.username}
                              style={{ padding: '4px 10px', borderRadius: '6px', background: '#4f658c', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                              {resettingUser === user.username ? 'Resetting...' : 'Reset Password'}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleSuspend(user)}
                              disabled={suspendingUser === user.username}
                              style={{ padding: '4px 10px', borderRadius: '6px', background: user.status === 'suspended' ? '#e57373' : '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                              {suspendingUser === user.username ? (user.status === 'suspended' ? 'Unsuspending...' : 'Suspending...') : (user.status === 'suspended' ? 'Unsuspend' : 'Suspend')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {resetMessage && <div style={{ color: 'white', marginTop: '1rem' }}>{resetMessage}</div>}
              </div>
              )}
              {showPostsTable && (
                <div className={styles.userTableWrapper} style={{ overflowX: 'auto' }}>
                  {loadingPosts ? (
                    <div className={styles.userTableLoading}>Loading posts...</div>
                  ) : (
                    <table className={styles.userTable}>
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Topic</th>
                          <th>Content</th>
                          <th>Created At</th>
                          <th>Flagged</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post.id} style={post.flagged ? { background: '#ffeaea' } : {}}>
                            <td style={{ wordBreak: 'break-all' }}>{post.user_id}</td>
                            <td style={{ wordBreak: 'break-all' }}>{post.topic}</td>
                            <td style={{ wordBreak: 'break-word' }}>{post.content}</td>
                            <td style={{ wordBreak: 'break-all' }}>{post.created_at ? new Date(post.created_at).toLocaleString() : ''}</td>
                            <td>{post.flagged ? 'Yes' : 'No'}</td>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {/* Edit button */}
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setEditModalOpen(true);
                                  }}
                                  style={{ minWidth: 60 }}
                                >
                                  Edit
                                </button>
                                {/* Delete button */}
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  disabled={deletingPostId === post.id}
                                  style={{ color: 'white', background: '#e57373', border: 'none', borderRadius: 4, padding: '2px 8px', minWidth: 60, cursor: 'pointer' }}
                                >
                                  {deletingPostId === post.id ? 'Deleting...' : 'Delete'}
                                </button>
                                {/* Flag as violation button */}
                                <button
                                  onClick={() => handleToggleFlagPost(post.id, post.flagged)}
                                  disabled={flaggingPostId === post.id}
                                  style={{
                                    color: 'white',
                                    background: post.flagged ? '#4caf50' : '#ff9800',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '2px 8px',
                                    minWidth: 90,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {flaggingPostId === post.id
                                    ? (post.flagged ? 'Unflagging...' : 'Flagging...')
                                    : (post.flagged ? 'Unflag' : 'Flag as Violation')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={editingPost}
        onSave={updated => setPosts(posts => posts.map(p => p.id === updated.id ? updated : p))}
      />
    </div>
  );
}
