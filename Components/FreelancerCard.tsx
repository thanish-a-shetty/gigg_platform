import { FC, useState } from 'react';
import { FormattedFreelancer } from '../types/freelancer';
import styles from '../styles/Home.module.css';
import Chat from './Chat';

interface FreelancerCardProps {
  freelancer: FormattedFreelancer;
  onSelect?: () => void;
  isLoggedIn?: boolean;
}

const FreelancerCard: FC<FreelancerCardProps> = ({ freelancer, onSelect, isLoggedIn = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number>(4);
  const [customHours, setCustomHours] = useState<string>('');

  const hourOptions = [4, 8, 20, 40];
  const serviceFeePercentage = 10;

  const calculatePriceBreakdown = (hours: number) => {
    const basePrice = hours * freelancer.hourlyRate;
    const serviceFee = (basePrice * serviceFeePercentage) / 100;
    const total = basePrice + serviceFee;

    return {
      basePrice: basePrice.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleHourSelect = (hours: number) => {
    setSelectedHours(hours);
    setCustomHours('');
  };

  const handleCustomHours = (value: string) => {
    const hours = parseInt(value);
    if (!isNaN(hours) && hours > 0) {
      setSelectedHours(hours);
    }
    setCustomHours(value);
  };

  const priceBreakdown = calculatePriceBreakdown(selectedHours);

  return (
    <>
      <div className={styles.freelancerCard} onClick={() => setShowModal(true)}>
        <div className={styles.cardHeader}>
          <img 
            src={freelancer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`}
            alt={freelancer.name}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <h3>{freelancer.name}</h3>
            <div className={styles.rating}>
              {'★'.repeat(Math.floor(freelancer.rating))}
              {'☆'.repeat(5 - Math.floor(freelancer.rating))}
              <span>({freelancer.rating})</span>
            </div>
          </div>
          <div className={styles.hourlyRate}>
            ${freelancer.hourlyRate}/hr
          </div>
        </div>
        
        <p className={styles.description}>{freelancer.description}</p>
        
        <div className={styles.completedProjects}>
          <span className={styles.projectCount}>{freelancer.completedProjects}</span>
          <span>Projects Completed</span>
        </div>

        <div className={styles.location}>
          📍 {freelancer.location || 'Remote'}
        </div>
        
        <div className={styles.skills}>
          {freelancer.skills.map((skill) => (
            <span key={skill} className={styles.skill}>
              {skill}
            </span>
          ))}
        </div>
        
        <button 
          className={styles.hireButton}
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          disabled={!isLoggedIn}
        >
          {isLoggedIn ? 'View Profile' : 'Login to View'}
        </button>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            
            <div className={styles.modalHeader}>
              <img 
                src={freelancer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=random`}
                alt={freelancer.name}
                className={styles.modalAvatar}
              />
              <div className={styles.modalHeaderInfo}>
                <h2>{freelancer.name}</h2>
                <div className={styles.modalRating}>
                  {'★'.repeat(Math.floor(freelancer.rating))}
                  {'☆'.repeat(5 - Math.floor(freelancer.rating))}
                  <span>({freelancer.rating})</span>
                </div>
                <p>{freelancer.location || 'Remote'} • ${freelancer.hourlyRate}/hr</p>
              </div>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span>✅</span>
                <span>{freelancer.completedProjects} Projects Completed</span>
              </div>
              <div className={styles.feature}>
                <span>⭐</span>
                <span>{freelancer.rating} Average Rating</span>
              </div>
              <div className={styles.feature}>
                <span>⚡</span>
                <span>Quick Response Time</span>
              </div>
              <div className={styles.feature}>
                <span>🔒</span>
                <span>Payment Protection</span>
              </div>
            </div>

            <h3>Select Hours</h3>
            <div className={styles.hoursInput}>
              {hourOptions.map(hours => (
                <button
                  key={hours}
                  className={`${styles.hourOption} ${selectedHours === hours ? styles.selected : ''}`}
                  onClick={() => handleHourSelect(hours)}
                >
                  {hours} hours
                </button>
              ))}
              <div className={styles.customHours}>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom"
                  value={customHours}
                  onChange={(e) => handleCustomHours(e.target.value)}
                />
                <span>hours</span>
              </div>
            </div>

            <div className={styles.priceBreakdown}>
              <h3>Price Breakdown</h3>
              <div className={styles.breakdownItem}>
                <span>Base Rate ({selectedHours} hours × ${freelancer.hourlyRate})</span>
                <span>${priceBreakdown.basePrice}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Service Fee ({serviceFeePercentage}%)</span>
                <span>${priceBreakdown.serviceFee}</span>
              </div>
              <div className={`${styles.breakdownItem} ${styles.total}`}>
                <span>Total</span>
                <span>${priceBreakdown.total}</span>
              </div>
            </div>

            <div className={styles.hireActions}>
              <button 
                className={styles.messageButton}
                onClick={() => {
                  setShowChat(true);
                  setShowModal(false);
                }}
              >
                Message
              </button>
              <button className={styles.hireButton}>
                Hire Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <Chat 
          freelancer={freelancer}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default FreelancerCard;