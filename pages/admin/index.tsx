import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalFreelancers: number;
  totalJobs: number;
  totalHires: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFreelancers: 0,
    totalJobs: 0,
    totalHires: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          console.log('No authentication data found');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userStr);
        if (userData.role !== 'admin') {
          console.log('User is not an admin');
          router.push('/');
          return;
        }

        // Fetch users and stats
        const [usersRes, statsRes] = await Promise.all([
          fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!usersRes.ok || !statsRes.ok) {
          if (usersRes.status === 401 || statsRes.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch data');
        }

        const [usersData, statsData] = await Promise.all([
          usersRes.json(),
          statsRes.json()
        ]);

        setUsers(usersData.users);
        setStats(statsData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error in admin dashboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) throw new Error('Failed to update role');

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Gig Hub India</title>
        <meta name="description" content="Admin dashboard for Gig Hub India" />
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Freelancers</h3>
              <p>{stats.totalFreelancers}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Active Jobs</h3>
              <p>{stats.totalJobs}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Hires</h3>
              <p>{stats.totalHires}</p>
            </div>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.roleFilter}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={styles.roleSelect}
                        autoFocus
                        onBlur={() => setEditingUser(null)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span 
                        className={`${styles.badge} ${styles[user.role]}`}
                        onClick={() => setEditingUser(user.id)}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
} 