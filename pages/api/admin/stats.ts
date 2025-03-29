import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin(req);
    if (!isUserAdmin) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Get all stats in parallel
    const [
      totalUsers,
      totalFreelancers,
      totalJobs,
      totalHires
    ] = await Promise.all([
      prisma.user.count(),
      prisma.freelancer.count(),
      prisma.freelancer.count({ // Active jobs (available freelancers)
        where: {
          availability: 'available'
        }
      }),
      prisma.hiredFreelancer.count()
    ]);

    res.status(200).json({
      totalUsers,
      totalFreelancers,
      totalJobs,
      totalHires
    });
  } catch (error: any) {
    console.error('Error in admin stats API:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message
    });
  }
} 