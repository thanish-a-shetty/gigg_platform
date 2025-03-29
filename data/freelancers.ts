import { FormattedFreelancer } from '../types/freelancer';

export const skillsList = [
  // Development
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Django', 'Node.js', 'Express.js',
  'Vue.js', 'Angular', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Java', 'Spring Boot',
  'C#', '.NET', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'GraphQL',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase',
  
  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Swift', 'Android Development', 'Kotlin',
  'Xamarin', 'Ionic', 'Mobile UI/UX',
  
  // Design
  'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
  'Motion Design', 'Brand Design', 'Web Design', 'Mobile Design', 'Design Systems',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis',
  'Data Visualization', 'Natural Language Processing', 'Computer Vision', 'R Programming',
  'Statistical Analysis', 'Big Data', 'Apache Spark',
  
  // Digital Marketing
  'SEO', 'Content Marketing', 'Social Media Marketing', 'Email Marketing', 'Google Ads',
  'Facebook Ads', 'Marketing Analytics', 'Growth Hacking', 'Copywriting',
  
  // Project Management
  'Agile', 'Scrum', 'Jira', 'Project Planning', 'Team Leadership', 'Risk Management',
  'Stakeholder Management', 'Budgeting', 'Resource Management'
];

export const freelancers: FormattedFreelancer[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    description: 'Full-stack developer specializing in React and Node.js with 5 years of experience',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'GraphQL'],
    hourlyRate: 45,
    rating: 4.8,
    completedProjects: 32,
    location: 'Bangalore',
    imageUrl: '/avatars/priya.jpg'
  },
  {
    id: '2',
    name: 'Rahul Verma',
    description: 'UI/UX designer with expertise in design systems and mobile interfaces',
    skills: ['UI Design', 'UX Design', 'Figma', 'Design Systems', 'Mobile Design', 'Web Design'],
    hourlyRate: 55,
    rating: 4.9,
    completedProjects: 45,
    location: 'Mumbai',
    imageUrl: '/avatars/rahul.jpg'
  },
  {
    id: '3',
    name: 'Aisha Khan',
    description: 'Data scientist specializing in machine learning and predictive analytics',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'Statistical Analysis', 'Deep Learning'],
    hourlyRate: 65,
    rating: 4.7,
    completedProjects: 28,
    location: 'Hyderabad',
    imageUrl: '/avatars/aisha.jpg'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    description: 'DevOps engineer with extensive cloud infrastructure experience',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Python', 'Infrastructure as Code'],
    hourlyRate: 60,
    rating: 4.8,
    completedProjects: 37,
    location: 'Delhi',
    imageUrl: '/avatars/vikram.jpg'
  },
  {
    id: '5',
    name: 'Neha Patel',
    description: 'Mobile app developer specializing in cross-platform development',
    skills: ['React Native', 'Flutter', 'TypeScript', 'Firebase', 'Mobile UI/UX', 'iOS Development'],
    hourlyRate: 50,
    rating: 4.6,
    completedProjects: 25,
    location: 'Pune',
    imageUrl: '/avatars/neha.jpg'
  },
  {
    id: '6',
    name: 'Arjun Reddy',
    description: 'Digital marketing specialist with focus on growth and analytics',
    skills: ['SEO', 'Content Marketing', 'Google Ads', 'Marketing Analytics', 'Growth Hacking', 'Social Media Marketing'],
    hourlyRate: 40,
    rating: 4.7,
    completedProjects: 41,
    location: 'Chennai',
    imageUrl: '/avatars/arjun.jpg'
  },
  {
    id: '7',
    name: 'Zara Ahmed',
    description: 'Backend developer with expertise in scalable architectures',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Redis', 'System Design'],
    hourlyRate: 55,
    rating: 4.9,
    completedProjects: 33,
    location: 'Kolkata',
    imageUrl: '/avatars/zara.jpg'
  },
  {
    id: '8',
    name: 'Karthik Menon',
    description: 'Project manager with agile methodology expertise',
    skills: ['Agile', 'Scrum', 'Project Planning', 'Team Leadership', 'Risk Management', 'Stakeholder Management'],
    hourlyRate: 70,
    rating: 4.8,
    completedProjects: 52,
    location: 'Bangalore',
    imageUrl: '/avatars/karthik.jpg'
  },
  {
    id: '9',
    name: 'Ananya Desai',
    description: 'AI researcher and computer vision specialist',
    skills: ['Computer Vision', 'Deep Learning', 'PyTorch', 'Python', 'Machine Learning', 'Natural Language Processing'],
    hourlyRate: 75,
    rating: 4.9,
    completedProjects: 23,
    location: 'Mumbai',
    imageUrl: '/avatars/ananya.jpg'
  },
  {
    id: '10',
    name: 'Rohan Kapoor',
    description: 'Full-stack developer focusing on .NET and Azure cloud solutions',
    skills: ['C#', '.NET', 'Azure', 'SQL Server', 'Angular', 'DevOps'],
    hourlyRate: 58,
    rating: 4.7,
    completedProjects: 39,
    location: 'Pune',
    imageUrl: '/avatars/rohan.jpg'
  },
  {
    id: '11',
    name: 'Maya Iyer',
    description: 'Creative designer specializing in brand identity and motion design',
    skills: ['Brand Design', 'Motion Design', 'Adobe XD', 'Illustrator', 'After Effects', 'Design Systems'],
    hourlyRate: 52,
    rating: 4.8,
    completedProjects: 47,
    location: 'Delhi',
    imageUrl: '/avatars/maya.jpg'
  },
  {
    id: '12',
    name: 'Sameer Malik',
    description: 'Frontend developer with expertise in modern JavaScript frameworks',
    skills: ['Vue.js', 'React', 'TypeScript', 'Web Design', 'GraphQL', 'Webpack'],
    hourlyRate: 48,
    rating: 4.6,
    completedProjects: 31,
    location: 'Hyderabad',
    imageUrl: '/avatars/sameer.jpg'
  }
];
