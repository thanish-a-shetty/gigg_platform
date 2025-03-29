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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find freelancer
    const freelancer = await prisma.freelancer.findUnique({
      where: { email }
    });

    if (!freelancer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, freelancer.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      userId: freelancer.id,
      email: freelancer.email,
      role: 'freelancer'
    });

    // Return freelancer data (excluding password)
    res.status(200).json({
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
    console.error('Freelancer login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 