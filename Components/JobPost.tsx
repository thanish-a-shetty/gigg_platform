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
  isLoggedIn: boolean;
}

const JobPost: React.FC<JobPostProps> = ({ job, isLoggedIn }) => {
  const handleApply = () => {
    if (!isLoggedIn) {
      alert('Please log in to apply for jobs');
      return;
    }
    // Add your apply logic here
    alert('Application submitted successfully!');
  };

  return (
    <div className={styles.jobPost}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <div className={styles.budget}>Budget: {job.budget}</div>
      <div className={styles.skills}>
        {job.skills.map((skill, index) => (
          <span key={index} className={styles.skill}>{skill}</span>
        ))}
      </div>
      <button className={styles.applyButton} onClick={handleApply}>
        Apply Now
      </button>
    </div>
  );
};

export default JobPost; 