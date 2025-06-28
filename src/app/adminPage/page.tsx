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
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<string | null>(null);

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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Email API error:', errorData);
        // Fallback: show password even if email fails
        const errorMessage = errorData.details || errorData.error || 'Unknown error';
        setResetMessage(`Password updated successfully! New password: ${newPassword} (Email sending failed: ${errorMessage})`);
      } else {
        setResetMessage(`New password sent to ${user.email}. Password: ${newPassword}`);
      }
      
      // Update the local state to reflect the new password
      setUsers((prev) => prev.map(u => u.username === user.username ? { ...u, password: newPassword } : u));
      
    } catch (error) {
      console.error('Password reset error:', error);
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

              <div className={styles.navItem}>
                <div className={styles.navIcon}><Fire /></div>
                <span className={styles.navText}>Popular</span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
