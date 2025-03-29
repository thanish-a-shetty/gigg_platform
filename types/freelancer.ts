export interface Freelancer {
  id: string;
  name: string;
  skills: string;
  hourlyRate: number;
  rating: number;
  description: string;
  experience?: string;
  availability?: string;
  completedProjects: number;
  location: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormattedFreelancer extends Omit<Freelancer, 'skills'> {
  skills: string[];
}