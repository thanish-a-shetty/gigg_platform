import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import JobPost from '../Components/JobPost';
import Header from '../Components/Header';
import Head from 'next/head';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  skills: string[];
}

const Jobs: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  // Sample jobs data (replace with actual API call in production)
  const jobs = [
    {
      id: '1',
      title: "Full Stack Developer Needed",
      description: "Looking for an experienced developer for a 3-month project",
      budget: "$5000-$8000",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      id: '2',
      title: "UI/UX Designer for Mobile App",
      description: "Need a creative designer for our upcoming mobile application",
      budget: "$3000-$5000",
      skills: ["Figma", "Adobe XD", "Mobile Design"]
    },
    {
      id: '3',
      title: "Backend Developer - Python",
      description: "Seeking a Python expert for API development",
      budget: "$4000-$6000",
      skills: ["Python", "Django", "PostgreSQL"]
    }
  ];

  return (
    <>
      <Head>
        <title>Jobs - Gig Hub India</title>
        <meta name="description" content="Find the latest jobs on Gig Hub India" />
      </Head>

      <Header />
      
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Available Jobs</h1>
          
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <section className={styles.section}>
              <div className={styles.jobsGrid}>
                {jobs.map((job) => (
                  <JobPost 
                    key={job.id}
                    job={job}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default Jobs;
