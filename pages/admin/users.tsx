import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../Components/Header';
import styles from '../../styles/Admin.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  hiredFreelancersCount: number;
  totalSpent: number;
}

const UsersPage: NextPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <title>User Management - Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for user management" />
      </Head>

      <Header />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>User Management</h1>

          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <h3>Total Users</h3>
                  <p>{users.length}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Revenue</h3>
                  <p>${users.reduce((sum, user) => sum + user.totalSpent, 0).toLocaleString()}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Hires</h3>
                  <p>{users.reduce((sum, user) => sum + user.hiredFreelancersCount, 0)}</p>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Freelancers Hired</th>
                      <th>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{user.hiredFreelancersCount}</td>
                        <td>${user.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default UsersPage; 