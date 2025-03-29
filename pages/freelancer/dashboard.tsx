import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Dashboard.module.css';

interface Freelancer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: number;
  description: string;
  experience: string;
  rating: number;
  completedProjects: number;
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const freelancerData = localStorage.getItem('freelancer');

    if (!token || !freelancerData) {
      router.push('/freelancer/login');
      return;
    }

    try {
      const parsedFreelancer = JSON.parse(freelancerData);
      setFreelancer(parsedFreelancer);
    } catch (err) {
      setError('Error loading freelancer data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('freelancer');
    router.push('/freelancer/login');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => router.push('/freelancer/login')}>
          Return to Login
        </button>
      </div>
    );
  }

  if (!freelancer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Freelancer Dashboard - Gig Hub India</title>
        <meta name="description" content="Freelancer dashboard on Gig Hub India" />
      </Head>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1>Welcome, {freelancer.name}!</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Rating</h3>
            <p>{freelancer.rating.toFixed(1)} / 5.0</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed Projects</h3>
            <p>{freelancer.completedProjects}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Hourly Rate</h3>
            <p>${freelancer.hourlyRate}/hr</p>
          </div>
        </div>

        <div className={styles.profile}>
          <h2>Your Profile</h2>
          <div className={styles.profileContent}>
            <div className={styles.section}>
              <h3>Skills</h3>
              <div className={styles.skills}>
                {freelancer.skills.map((skill, index) => (
                  <span key={index} className={styles.skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>Experience</h3>
              <p>{freelancer.experience}</p>
            </div>

            <div className={styles.section}>
              <h3>Description</h3>
              <p>{freelancer.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton}>
            Edit Profile
          </button>
          <button className={styles.actionButton}>
            View Job Proposals
          </button>
          <button className={styles.actionButton}>
            Manage Availability
          </button>
        </div>
      </div>
    </>
  );
} 