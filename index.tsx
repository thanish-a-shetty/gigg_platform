import { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import FreelancerCard from '../components/FreelancerCard';
import JobPost from '../components/JobPost';

const Home: NextPage = () => {
  // Sample data
  const sampleFreelancer = {
    id: 1,
    name: "Jane Doe",
    skills: ["React", "TypeScript", "Node.js"],
    hourlyRate: 75,
    rating: 4.8
  };

  const sampleJob = {
    id: 1,
    title: "Full Stack Developer Needed",
    description: "Looking for an experienced developer for a 3-month project",
    budget: "$5000-$8000",
    skills: ["React", "Node.js", "MongoDB"],
    category: "development"
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Gig Platform</h1>
        
        <section className={styles.section}>
          <h2>Featured Freelancer</h2>
          <FreelancerCard freelancer={sampleFreelancer} />
        </section>

        <section className={styles.section}>
          <h2>Latest Job</h2>
          <JobPost job={sampleJob} />
        </section>
      </main>
    </div>
  );
};

export default Home;