import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const freelancers = [
    {
      email: "jane.doe@example.com",
      name: "Jane Doe",
      password: await hash("password123", 10),
      skills: JSON.stringify(["React", "TypeScript", "Node.js"]),
      hourlyRate: 75,
      rating: 4.8,
      description: "Full-stack developer with expertise in modern web technologies",
      experience: "5+ years of professional experience",
      availability: "available",
      completedProjects: 45
    },
    {
      email: "john.smith@example.com",
      name: "John Smith",
      password: await hash("password123", 10),
      skills: JSON.stringify(["Python", "Django", "AWS"]),
      hourlyRate: 85,
      rating: 4.9,
      description: "Backend specialist with strong cloud infrastructure experience",
      experience: "7+ years in software development",
      availability: "available",
      completedProjects: 63
    },
    {
      email: "priya.sharma@example.com",
      name: "Priya Sharma",
      password: await hash("password123", 10),
      skills: JSON.stringify(["UI/UX Design", "Figma", "Adobe XD", "React"]),
      hourlyRate: 65,
      rating: 4.7,
      description: "Creative UI/UX designer with a strong focus on user-centered design",
      experience: "4+ years in design and frontend development",
      availability: "available",
      completedProjects: 38
    },
    {
      email: "alex.chen@example.com",
      name: "Alex Chen",
      password: await hash("password123", 10),
      skills: JSON.stringify(["Angular", "Java", "Spring Boot", "MongoDB"]),
      hourlyRate: 90,
      rating: 4.9,
      description: "Enterprise software architect with full-stack expertise",
      experience: "8+ years building scalable applications",
      availability: "available",
      completedProjects: 72
    }
  ];

  for (const freelancer of freelancers) {
    await prisma.freelancer.create({
      data: freelancer
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });