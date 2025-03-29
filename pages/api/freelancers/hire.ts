import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await authenticateUser(req);

    if (req.method === 'POST') {
      const { freelancerId, hours } = req.body;

      // Get freelancer details
      const freelancer = await prisma.freelancer.findUnique({
        where: { id: freelancerId }
      });

      if (!freelancer) {
        return res.status(404).json({ message: 'Freelancer not found' });
      }

      // Calculate total cost
      const totalCost = freelancer.hourlyRate * hours;

      // Create hired freelancer record
      const hiredFreelancer = await prisma.hiredFreelancer.create({
        data: {
          userId: user.id,
          freelancerId,
          hours,
          totalCost,
          status: 'active'
        },
        include: {
          freelancer: true
        }
      });

      return res.status(201).json(hiredFreelancer);
    }

    if (req.method === 'GET') {
      // Get user's hired freelancers
      const hiredFreelancers = await prisma.hiredFreelancer.findMany({
        where: {
          userId: user.id
        },
        include: {
          freelancer: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json(hiredFreelancers);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Hire freelancer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 