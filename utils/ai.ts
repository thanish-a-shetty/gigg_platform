import { FormattedFreelancer } from '../types/freelancer';

// Convert skills to numerical features
export function skillsToFeatures(skills: string[], allSkills: string[]): number[] {
  return allSkills.map(skill => skills.includes(skill) ? 1 : 0);
}

// Calculate similarity between two skill sets using Jaccard similarity
export function calculateSkillSimilarity(skills1: string[], skills2: string[]): number {
  const intersection = skills1.filter(skill => skills2.includes(skill));
  const union = Array.from(new Set([...skills1, ...skills2]));
  return intersection.length / union.length;
}

// Recommend similar freelancers based on skills
export function recommendSimilarFreelancers(
  targetSkills: string[],
  freelancers: FormattedFreelancer[],
  limit: number = 5
): FormattedFreelancer[] {
  const similarities = freelancers.map(freelancer => ({
    freelancer,
    similarity: calculateSkillSimilarity(targetSkills, freelancer.skills)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.freelancer);
}

// Predict price range based on skills and experience
export function predictPriceRange(
  skills: string[],
  existingFreelancers: FormattedFreelancer[]
): { min: number; max: number } {
  // Get similar freelancers
  const similarFreelancers = recommendSimilarFreelancers(skills, existingFreelancers, 10);
  
  if (similarFreelancers.length === 0) {
    return { min: 20, max: 50 }; // Default range
  }

  const rates = similarFreelancers.map(f => f.hourlyRate);
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const stdDev = Math.sqrt(
    rates.reduce((a, b) => a + Math.pow(b - avgRate, 2), 0) / rates.length
  );

  return {
    min: Math.max(10, Math.round(avgRate - stdDev)),
    max: Math.round(avgRate + stdDev)
  };
}

// Recommend additional skills based on co-occurrence
export function recommendSkills(
  currentSkills: string[],
  allFreelancers: FormattedFreelancer[],
  limit: number = 3
): string[] {
  // Create a map to store skill co-occurrences
  const coOccurrences = new Map<string, number>();
  const skillFrequency = new Map<string, number>();

  // Calculate co-occurrences and frequencies
  allFreelancers.forEach(freelancer => {
    freelancer.skills.forEach(skill => {
      if (!currentSkills.includes(skill)) {
        skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
        
        // Count how often this skill appears with current skills
        if (freelancer.skills.some(s => currentSkills.includes(s))) {
          coOccurrences.set(skill, (coOccurrences.get(skill) || 0) + 1);
        }
      }
    });
  });

  // Calculate scores based on co-occurrence and frequency
  const scores = Array.from(coOccurrences.entries())
    .map(([skill, coOccurrence]) => ({
      skill,
      score: coOccurrence / (skillFrequency.get(skill) || 1)
    }));

  // Sort by score and return top skills
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.skill);
}

// Calculate job match score
export function calculateJobMatch(
  freelancerSkills: string[],
  jobSkills: string[],
  freelancerRate: number,
  budgetRange: { min: number; max: number }
): number {
  const skillMatch = calculateSkillSimilarity(freelancerSkills, jobSkills);
  const rateMatch = freelancerRate >= budgetRange.min && freelancerRate <= budgetRange.max ? 1 : 0;
  
  // Weight skill match more heavily than rate match
  return (skillMatch * 0.7 + rateMatch * 0.3) * 100;
}

// Smart search with keyword analysis
export function smartSearch(
  query: string,
  freelancers: FormattedFreelancer[],
  weights = { name: 0.3, skills: 0.5, description: 0.2 }
): FormattedFreelancer[] {
  const terms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  if (terms.length === 0) return freelancers;

  return freelancers
    .map(freelancer => {
      let score = 0;
      
      // Name matching
      const nameScore = terms.reduce((acc, term) => 
        acc + (freelancer.name.toLowerCase().includes(term) ? weights.name : 0), 0);
      
      // Skills matching
      const skillScore = terms.reduce((acc, term) => 
        acc + (freelancer.skills.some(skill => 
          skill.toLowerCase().includes(term)) ? weights.skills : 0), 0);
      
      // Description matching
      const descScore = terms.reduce((acc, term) => 
        acc + (freelancer.description?.toLowerCase().includes(term) ? weights.description : 0), 0);
      
      score = nameScore + skillScore + descScore;
      
      return { freelancer, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.freelancer);
}

// Calculate skill gap analysis
export function analyzeSkillGap(
  requiredSkills: string[],
  freelancer: FormattedFreelancer
): { 
  missingSkills: string[],
  matchingSkills: string[],
  matchPercentage: number,
  recommendations: string[]
} {
  const matchingSkills = requiredSkills.filter(skill => 
    freelancer.skills.includes(skill)
  );
  
  const missingSkills = requiredSkills.filter(skill => 
    !freelancer.skills.includes(skill)
  );
  
  const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;

  // Generate learning recommendations
  const recommendations = missingSkills.map(skill => {
    const relatedSkills = freelancer.skills.filter(s => 
      s.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(s.toLowerCase())
    );
    
    if (relatedSkills.length > 0) {
      return `You have experience in ${relatedSkills.join(', ')}, which could help you learn ${skill}`;
    }
    return `Consider learning ${skill} to improve your job matches`;
  });

  return {
    missingSkills,
    matchingSkills,
    matchPercentage,
    recommendations
  };
}

// Predict project success probability
export function predictProjectSuccess(
  freelancer: FormattedFreelancer,
  projectRequirements: {
    requiredSkills: string[],
    duration: number, // in weeks
    complexity: number, // 1-5
    budget: number
  }
): {
  successProbability: number,
  riskFactors: string[],
  suggestions: string[]
} {
  const skillMatch = calculateSkillSimilarity(projectRequirements.requiredSkills, freelancer.skills);
  const hourlyRate = freelancer.hourlyRate;
  const completedProjects = freelancer.completedProjects || 0;
  
  // Calculate base success probability
  let successProbability = skillMatch * 0.4; // 40% weight to skill match
  
  // Add experience factor (20% weight)
  const experienceFactor = Math.min(completedProjects / 50, 1) * 0.2;
  successProbability += experienceFactor;
  
  // Add budget factor (20% weight)
  const estimatedCost = hourlyRate * projectRequirements.duration * 40; // 40 hours per week
  const budgetFactor = estimatedCost <= projectRequirements.budget ? 0.2 : 0.1;
  successProbability += budgetFactor;
  
  // Add complexity factor (20% weight)
  const complexityFactor = (6 - projectRequirements.complexity) / 5 * 0.2;
  successProbability += complexityFactor;

  // Identify risk factors
  const riskFactors: string[] = [];
  if (skillMatch < 0.7) riskFactors.push('Skill gap in required technologies');
  if (estimatedCost > projectRequirements.budget) riskFactors.push('Project might exceed budget');
  if (projectRequirements.complexity > 3 && skillMatch < 0.8) riskFactors.push('High project complexity relative to skill match');
  
  // Generate suggestions
  const suggestions: string[] = [];
  if (skillMatch < 0.7) suggestions.push('Consider upskilling in required technologies');
  if (estimatedCost > projectRequirements.budget) suggestions.push('Consider negotiating project scope or timeline');
  if (projectRequirements.complexity > 3) suggestions.push('Break down the project into smaller milestones');

  return {
    successProbability: Math.min(successProbability, 1),
    riskFactors,
    suggestions
  };
}

// Calculate optimal workload distribution
export function calculateOptimalWorkload(
  freelancer: FormattedFreelancer,
  activeProjects: Array<{
    hoursPerWeek: number,
    remainingWeeks: number,
    complexity: number // 1-5
  }>
): {
  canTakeNewProject: boolean,
  recommendedHours: number,
  workloadStatus: string,
  efficiency: number
} {
  const MAX_WEEKLY_HOURS = 40;
  const OPTIMAL_PROJECT_COUNT = 2;
  
  // Calculate current workload
  const totalCurrentHours = activeProjects.reduce((acc, project) => 
    acc + project.hoursPerWeek, 0);
  
  // Calculate average project complexity
  const avgComplexity = activeProjects.reduce((acc, project) => 
    acc + project.complexity, 0) / (activeProjects.length || 1);
  
  // Calculate cognitive load factor (higher complexity = lower efficiency)
  const complexityFactor = 1 - (avgComplexity - 1) * 0.1;
  
  // Calculate efficiency based on number of projects and complexity
  const efficiency = Math.max(0.6, 
    1 - (Math.abs(OPTIMAL_PROJECT_COUNT - activeProjects.length) * 0.1) * complexityFactor
  );
  
  // Calculate recommended hours for new projects
  const availableHours = MAX_WEEKLY_HOURS - totalCurrentHours;
  const recommendedHours = Math.floor(availableHours * efficiency);
  
  // Determine workload status
  let workloadStatus = 'Optimal';
  if (totalCurrentHours > MAX_WEEKLY_HOURS) workloadStatus = 'Overloaded';
  else if (totalCurrentHours < MAX_WEEKLY_HOURS * 0.5) workloadStatus = 'Available for more work';
  else if (totalCurrentHours > MAX_WEEKLY_HOURS * 0.8) workloadStatus = 'Near capacity';

  return {
    canTakeNewProject: recommendedHours >= 10,
    recommendedHours,
    workloadStatus,
    efficiency
  };
}

// Analyze and rank top in-demand skills
export function analyzeTopSkills(
  freelancers: FormattedFreelancer[],
  limit: number = 15
): { 
  skill: string;
  score: number;
  trend: 'rising' | 'stable' | 'declining';
  demandLevel: 'high' | 'medium' | 'low';
}[] {
  const skillStats = new Map<string, {
    totalFreelancers: number;
    avgRate: number;
    avgRating: number;
    completedProjects: number;
  }>();

  // Collect statistics for each skill
  freelancers.forEach(freelancer => {
    freelancer.skills.forEach(skill => {
      const stats = skillStats.get(skill) || {
        totalFreelancers: 0,
        avgRate: 0,
        avgRating: 0,
        completedProjects: 0
      };

      stats.totalFreelancers++;
      stats.avgRate += freelancer.hourlyRate;
      stats.avgRating += freelancer.rating;
      stats.completedProjects += freelancer.completedProjects;

      skillStats.set(skill, stats);
    });
  });

  // Calculate final scores
  const skillScores = Array.from(skillStats.entries()).map(([skill, stats]) => {
    // Normalize the statistics
    const avgRate = stats.avgRate / stats.totalFreelancers;
    const avgRating = stats.avgRating / stats.totalFreelancers;
    const projectsPerFreelancer = stats.completedProjects / stats.totalFreelancers;
    
    // Calculate demand score (0-1)
    const demandScore = (
      (stats.totalFreelancers / freelancers.length) * 0.3 + // Popularity
      (avgRating / 5) * 0.3 + // Quality
      (Math.min(avgRate, 100) / 100) * 0.2 + // Market value
      (Math.min(projectsPerFreelancer, 50) / 50) * 0.2 // Project demand
    );

    // Determine trend and demand level
    let trend: 'rising' | 'stable' | 'declining';
    if (avgRate > 50 && avgRating > 4.5) {
      trend = 'rising';
    } else if (avgRate > 30 && avgRating > 4.0) {
      trend = 'stable';
    } else {
      trend = 'declining';
    }

    let demandLevel: 'high' | 'medium' | 'low';
    if (demandScore > 0.7) {
      demandLevel = 'high';
    } else if (demandScore > 0.4) {
      demandLevel = 'medium';
    } else {
      demandLevel = 'low';
    }

    return {
      skill,
      score: demandScore,
      trend,
      demandLevel
    };
  });

  // Sort by score and return top skills
  return skillScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
