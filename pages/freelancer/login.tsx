import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Auth.module.css';

export default function FreelancerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/freelancer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and freelancer data
      localStorage.setItem('token', data.token);
      localStorage.setItem('freelancer', JSON.stringify(data.freelancer));

      // Redirect to freelancer dashboard
      router.push('/freelancer/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login as Freelancer - Gig Hub India</title>
        <meta name="description" content="Login as a freelancer on Gig Hub India" />
      </Head>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1>Login as Freelancer</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Freelancer'}
            </button>
          </form>

          <div className={styles.switchAuth}>
            <p>
              Don't have an account?{' '}
              <a href="/freelancer/register">Register as Freelancer</a>
            </p>
            <p>
              Want to hire freelancers?{' '}
              <a href="/login">Login as Client</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 