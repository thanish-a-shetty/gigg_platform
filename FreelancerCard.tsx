import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

interface Freelancer {
  id: number;
  name: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
}

interface FreelancerCardProps {
  freelancer: Freelancer;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{freelancer.name}</h3>
        <button 
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          ❤
        </button>
      </div>
      
      <div className={styles.rating}>
        {'★'.repeat(Math.floor(freelancer.rating))}
        {'☆'.repeat(5 - Math.floor(freelancer.rating))}
        <span>({freelancer.rating})</span>
      </div>
      
      <div className={styles.rate}>${freelancer.hourlyRate}/hour</div>
      
      <div className={styles.skills}>
        {freelancer.skills.map((skill, index) => (
          <span key={index} className={styles.skill}>
            {skill}
          </span>
        ))}
      </div>

      <button 
        className={styles.contactButton}
        onClick={() => setShowContact(!showContact)}
      >
        {showContact ? 'Hide Contact' : 'Contact Freelancer'}
      </button>

      {showContact && (
        <div className={styles.contactInfo}>
          <p>Email: {freelancer.name.toLowerCase().replace(' ', '.')}@example.com</p>
          <p>Available for work</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerCard;