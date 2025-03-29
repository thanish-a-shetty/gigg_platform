import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import FreelancerCard from '../Components/FreelancerCard';
import Header from '../Components/Header';
import Head from 'next/head';
import { FormattedFreelancer } from '../types/freelancer';

const Freelancers: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freelancers, setFreelancers] = useState<FormattedFreelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const response = await fetch('/api/freelancers');
      if (!response.ok) {
        throw new Error('Failed to fetch freelancers');
      }
      const data = await response.json();
      setFreelancers(data);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique skills from freelancers
  const allSkills = Array.from(
    new Set(freelancers.flatMap(freelancer => freelancer.skills))
  ).sort();

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(event.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = freelancer.hourlyRate >= priceRange[0] && 
      freelancer.hourlyRate <= priceRange[1];
    
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.every(skill => freelancer.skills.includes(skill));

    return matchesSearch && matchesPrice && matchesSkills;
  });

  return (
    <>
      <Head>
        <title>Freelancers - Gig Hub India</title>
        <meta name="description" content="Find skilled freelancers on Gig Hub India" />
      </Head>

      <Header />
      
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Browse Freelancers</h1>
          
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              <div className={styles.filterSection}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.filterControls}>
                  <div className={styles.priceFilter}>
                    <h3>Price Range ($/hour)</h3>
                    <div className={styles.rangeInputs}>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(e, 0)}
                        min={0}
                        max={priceRange[1]}
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(e, 1)}
                        min={priceRange[0]}
                        max={200}
                      />
                    </div>
                  </div>

                  <div className={styles.skillsFilter}>
                    <h3>Skills</h3>
                    <div className={styles.skillTags}>
                      {allSkills.map(skill => (
                        <button
                          key={skill}
                          className={`${styles.skillTag} ${selectedSkills.includes(skill) ? styles.active : ''}`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <section className={styles.section}>
                <div className={styles.grid}>
                  {filteredFreelancers.map((freelancer) => (
                    <FreelancerCard 
                      key={freelancer.id} 
                      freelancer={freelancer}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Freelancers;
