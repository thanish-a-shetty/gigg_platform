import { NextPage } from 'next';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';
import FreelancerCard from '../Components/FreelancerCard';
import JobPost from '../Components/JobPost';
import Header from '../Components/Header';
import Head from 'next/head';
import { FormattedFreelancer } from '../types/freelancer';
import AIRecommendations from '../Components/AIRecommendations';
import { analyzeTopSkills } from '../utils/ai';

const Home: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freelancers, setFreelancers] = useState<FormattedFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState<FormattedFreelancer | undefined>();
  const [topSkills, setTopSkills] = useState<Array<{
    skill: string;
    score: number;
    trend: 'rising' | 'stable' | 'declining';
    demandLevel: 'high' | 'medium' | 'low';
  }>>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const response = await fetch('/api/freelancers');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFreelancers(data);
      
      // Analyze top skills after fetching freelancers
      const analyzedSkills = await analyzeTopSkills(data);
      setTopSkills(analyzedSkills);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      setLoading(false);
    }
  };

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = freelancer.hourlyRate >= priceRange[0] && freelancer.hourlyRate <= priceRange[1];
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every(skill => freelancer.skills.includes(skill));
    return matchesSearch && matchesPrice && matchesSkills;
  });

  useEffect(() => {
    if (freelancers.length > 0) {
      const analyzedSkills = analyzeTopSkills(freelancers);
      setTopSkills(analyzedSkills);
    }
  }, [freelancers]);

  useEffect(() => {
    // Set up Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            // Add random delay for staggered animation
            const delay = Math.random() * 0.3;
            entry.target.style.transitionDelay = `${delay}s`;
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    // Wait for next tick to ensure DOM elements are ready
    setTimeout(() => {
      document.querySelectorAll(`.${styles.card}`).forEach((card) => {
        observer.observe(card);
      });
    }, 0);

    return () => observer.disconnect();
  }, [filteredFreelancers]);

  const renderSkillWithTrend = (skill: string, trend: 'rising' | 'stable' | 'declining', demandLevel: 'high' | 'medium' | 'low') => {
    const trendIcons = {
      rising: '⚡',
      stable: '✨',
      declining: '📉'
    };

    const demandColors = {
      high: '#22c55e',
      medium: '#f59e0b',
      low: '#ef4444'
    };

    return (
      <span
        key={skill}
        className={styles.skillTag}
        onClick={() => {
          if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
          } else {
            setSelectedSkills([...selectedSkills, skill]);
          }
        }}
        style={{
          borderColor: demandColors[demandLevel],
          boxShadow: `0 2px 8px ${demandColors[demandLevel]}33`
        }}
      >
        <span className={styles.skillName}>{skill}</span>
        <span className={styles.trendIndicator} role="img" aria-label={`${trend} trend`}>
          {trendIcons[trend]}
        </span>
        <span 
          className={styles.demandBadge}
          style={{ background: `${demandColors[demandLevel]}22` }}
        >
          {demandLevel}
        </span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gig Hub India - Find Top Freelancers</title>
        <meta name="description" content="Find and hire top freelancers in India" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span>Gig Hub India</span>
          </h1>
          
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search freelancers by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterSection}>
                <div>
                  <h3>Price Range ($/hr)</h3>
                  <div className={styles.rangeInputs}>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className={styles.priceDisplay}>
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>

                <div>
                  <h3>Top In-Demand Skills</h3>
                  <div className={styles.skillsContainer}>
                    {topSkills.map(({ skill, trend, demandLevel }) => (
                      renderSkillWithTrend(skill, trend, demandLevel)
                    ))}
                  </div>
                </div>
              </div>

              <AIRecommendations 
                currentSkills={selectedSkills}
                allFreelancers={freelancers}
                selectedFreelancer={selectedFreelancer}
              />

              <div className={styles.grid}>
                {filteredFreelancers.map((freelancer, index) => (
                  <div
                    key={freelancer.id}
                    className={styles.card}
                    style={{
                      // Add cascading delay based on index
                      transitionDelay: `${index * 0.1}s`,
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                      
                      // Add 3D tilt effect
                      const rotateX = (y - 50) * 0.1;
                      const rotateY = (x - 50) * 0.1;
                      e.currentTarget.style.transform = 
                        `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                    }}
                  >
                    <FreelancerCard
                      freelancer={freelancer}
                      onSelect={() => setSelectedFreelancer(freelancer)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;