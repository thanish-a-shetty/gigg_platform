import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Auth.module.css';

export default function FreelancerRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    skills: '',
    hourlyRate: '',
    description: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Convert skills string to array
      const skillsArray = formData.skills.split(',').map(skill => skill.trim());

      const response = await fetch('/api/freelancer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray,
          hourlyRate: parseFloat(formData.hourlyRate)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
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
        <title>Register as Freelancer - Gig Hub India</title>
        <meta name="description" content="Register as a freelancer on Gig Hub India" />
      </Head>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1>Register as Freelancer</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className={styles.formGroup}>
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Web Development, UI/UX Design, Mobile Development"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hourlyRate">Hourly Rate ($)</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Experience</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years of web development"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Freelancer'}
            </button>
          </form>

          <div className={styles.switchAuth}>
            <p>
              Already have an account?{' '}
              <a href="/freelancer/login">Login as Freelancer</a>
            </p>
            <p>
              Want to hire freelancers?{' '}
              <a href="/register">Register as Client</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 