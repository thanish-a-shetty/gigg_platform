import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { useState, useEffect } from 'react';

interface User {
  name: string;
  role: string;
}

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Gig Hub India
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/jobs" className={styles.navLink}>
            Jobs
          </Link>
          <Link href="/freelancers" className={styles.navLink}>
            Freelancers
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className={styles.navLink}>
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        <div className={styles.auth}>
          {isLoggedIn ? (
            <>
              <span className={styles.userName}>
                Welcome, {user?.name}
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              </span>
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.authButton}>
                Login
              </Link>
              <Link href="/register" className={styles.authButton}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 