import React from 'react';
import styles from '../styles/Home.module.css';

interface Job {
  title: string;
  description: string;
  budget: string;
  skills: string[];
}

interface JobPostProps {
  job: Job;
}

const JobPost: React.FC<JobPostProps> = ({ job }) => {
  return (
    <div className={styles.card}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <div className={styles.budget}>Budget: {job.budget}</div>
      <div className={styles.skills}>
        {job.skills.map((skill, index) => (
          <span key={index} className={styles.skill}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobPost;