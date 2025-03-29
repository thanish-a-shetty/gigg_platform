import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name, skills, hourlyRate, description, experience } = req.body;

    // Validate input
    if (!email || !password || !name || !skills || !hourlyRate || !description || !experience) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if freelancer already exists
    const existingFreelancer = await prisma.freelancer.findUnique({
      where: { email }
    });

    if (existingFreelancer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create freelancer
    const freelancer = await prisma.freelancer.create({
      data: {
        email,
        password: hashedPassword,
        name,
        skills: JSON.stringify(skills),
        hourlyRate: parseFloat(hourlyRate),
        description,
        experience
      }
    });

    // Generate token
    const token = generateToken({
      userId: freelancer.id,
      email: freelancer.email,
      role: 'freelancer'
    });

    // Return freelancer data (excluding password)
    res.status(201).json({
      token,
      freelancer: {
        id: freelancer.id,
        email: freelancer.email,
        name: freelancer.name,
        skills: JSON.parse(freelancer.skills),
        hourlyRate: freelancer.hourlyRate,
        rating: freelancer.rating,
        description: freelancer.description,
        experience: freelancer.experience,
        availability: freelancer.availability,
        completedProjects: freelancer.completedProjects
      }
    });
  } catch (error: any) {
    console.error('Freelancer registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 