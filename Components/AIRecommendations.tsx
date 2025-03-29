import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { FormattedFreelancer } from '../types/freelancer';
import { 
  recommendSkills, 
  recommendSimilarFreelancers, 
  predictPriceRange,
  analyzeSkillGap,
  predictProjectSuccess,
  calculateOptimalWorkload
} from '../utils/ai';

interface AIRecommendationsProps {
  currentSkills: string[];
  allFreelancers: FormattedFreelancer[];
  selectedFreelancer?: FormattedFreelancer;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  currentSkills,
  allFreelancers,
  selectedFreelancer
}) => {
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [similarFreelancers, setSimilarFreelancers] = useState<FormattedFreelancer[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [projectSuccess, setProjectSuccess] = useState<any>(null);
  const [workload, setWorkload] = useState<any>(null);

  useEffect(() => {
    if (currentSkills.length > 0) {
      // Get skill recommendations
      const skills = recommendSkills(currentSkills, allFreelancers);
      setRecommendedSkills(skills);

      // Get similar freelancers
      const similar = recommendSimilarFreelancers(currentSkills, allFreelancers, 3);
      setSimilarFreelancers(similar);

      // Predict price range
      const range = predictPriceRange(currentSkills, allFreelancers);
      setPriceRange(range);

      // If a freelancer is selected, perform additional analysis
      if (selectedFreelancer) {
        // Analyze skill gap
        const gap = analyzeSkillGap(currentSkills, selectedFreelancer);
        setSkillGap(gap);

        // Predict project success
        const success = predictProjectSuccess(selectedFreelancer, {
          requiredSkills: currentSkills,
          duration: 12, // Default 12 weeks
          complexity: 3, // Medium complexity
          budget: 20000 // Default budget
        });
        setProjectSuccess(success);

        // Calculate workload optimization
        const workloadAnalysis = calculateOptimalWorkload(selectedFreelancer, [
          { hoursPerWeek: 20, remainingWeeks: 8, complexity: 3 } // Example active project
        ]);
        setWorkload(workloadAnalysis);
      }
    }
  }, [currentSkills, allFreelancers, selectedFreelancer]);

  if (currentSkills.length === 0) {
    return null;
  }

  return (
    <div className={styles.aiRecommendations}>
      <h3>AI-Powered Insights</h3>
      
      {recommendedSkills.length > 0 && (
        <div className={styles.recommendationSection}>
          <h4>Recommended Skills</h4>
          <div className={styles.skillsList}>
            {recommendedSkills.map((skill, index) => (
              <span key={index} className={styles.recommendedSkill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {priceRange && (
        <div className={styles.recommendationSection}>
          <h4>Market Rate</h4>
          <p className={styles.priceRecommendation}>
            ${priceRange.min} - ${priceRange.max} /hr
          </p>
        </div>
      )}

      {skillGap && (
        <div className={styles.recommendationSection}>
          <h4>Skill Analysis</h4>
          <div className={styles.skillGap}>
            <p>Match: {Math.round(skillGap.matchPercentage)}%</p>
            {skillGap.recommendations.map((rec: string, index: number) => (
              <p key={index} className={styles.recommendation}>{rec}</p>
            ))}
          </div>
        </div>
      )}

      {projectSuccess && (
        <div className={styles.recommendationSection}>
          <h4>Project Success Prediction</h4>
          <div className={styles.projectSuccess}>
            <p>Success Probability: {Math.round(projectSuccess.successProbability * 100)}%</p>
            {projectSuccess.riskFactors.length > 0 && (
              <div className={styles.riskFactors}>
                <h5>Risk Factors:</h5>
                <ul>
                  {projectSuccess.riskFactors.map((factor: string, index: number) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {workload && (
        <div className={styles.recommendationSection}>
          <h4>Workload Analysis</h4>
          <div className={styles.workload}>
            <p>Status: {workload.workloadStatus}</p>
            <p>Efficiency: {Math.round(workload.efficiency * 100)}%</p>
            {workload.canTakeNewProject && (
              <p>Available for {workload.recommendedHours} hours/week</p>
            )}
          </div>
        </div>
      )}

      {similarFreelancers.length > 0 && (
        <div className={styles.recommendationSection}>
          <h4>Similar Profiles</h4>
          <div className={styles.similarFreelancers}>
            {similarFreelancers.map((freelancer, index) => (
              <div key={index} className={styles.similarFreelancer}>
                <span className={styles.similarFreelancerName}>
                  {freelancer.name}
                </span>
                <span className={styles.similarFreelancerRate}>
                  ${freelancer.hourlyRate}/hr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
