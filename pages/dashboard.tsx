import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../Components/Header';
import styles from '../styles/Home.module.css';

interface Freelancer {
  id: string;
  name: string;
  skills: string;
  hourlyRate: number;
  rating: number;
  description: string;
  experience: string;
  availability: string;
  completedProjects: number;
}

interface HiredFreelancer {
  id: string;
  freelancer: Freelancer;
  hours: number;
  totalCost: number;
  status: string;
  startDate: string;
  endDate?: string;
}

const Dashboard: NextPage = () => {
  const router = useRouter();
  const [hiredFreelancers, setHiredFreelancers] = useState<HiredFreelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchHiredFreelancers();
  }, [router]);

  const fetchHiredFreelancers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/freelancers/hire', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hired freelancers');
      }

      const data = await response.json();
      setHiredFreelancers(data);
    } catch (error) {
      console.error('Error fetching hired freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Gig Hub India</title>
        <meta name="description" content="View your hired freelancers and projects" />
      </Head>

      <Header />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span>Your Dashboard</span>
          </h1>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              <section className={styles.section}>
                <h2>Your Hired Freelancers</h2>
                <div className={styles.grid}>
                  {hiredFreelancers.length === 0 ? (
                    <p className={styles.noResults}>
                      You haven't hired any freelancers yet.
                    </p>
                  ) : (
                    hiredFreelancers.map((hired) => (
                      <div key={hired.id} className={styles.hiredCard}>
                        <div className={styles.cardHeader}>
                          <h3>{hired.freelancer.name}</h3>
                          <span className={`${styles.status} ${styles[hired.status]}`}>
                            {hired.status}
                          </span>
                        </div>
                        <div className={styles.cardDetails}>
                          <p><strong>Hours:</strong> {hired.hours}</p>
                          <p><strong>Total Cost:</strong> ${hired.totalCost}</p>
                          <p><strong>Start Date:</strong> {new Date(hired.startDate).toLocaleDateString()}</p>
                          {hired.endDate && (
                            <p><strong>End Date:</strong> {new Date(hired.endDate).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className={styles.skills}>
                          {JSON.parse(hired.freelancer.skills).map((skill: string, index: number) => (
                            <span key={index} className={styles.skill}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard; 