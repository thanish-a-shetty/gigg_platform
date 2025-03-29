import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Freelancer, FormattedFreelancer } from '../../../types/freelancer';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const freelancers = await prisma.freelancer.findMany({
      orderBy: {
        rating: 'desc'
      }
    });

    console.log('Raw freelancers data:', freelancers); // Debug log

    // Parse the skills JSON string for each freelancer
    const formattedFreelancers = freelancers.map((freelancer: Freelancer): FormattedFreelancer => {
      try {
        const parsedSkills = JSON.parse(freelancer.skills);
        return {
          ...freelancer,
          skills: Array.isArray(parsedSkills) ? parsedSkills : []
        };
      } catch (parseError) {
        console.error('Error parsing skills for freelancer:', freelancer.id, parseError);
        return {
          ...freelancer,
          skills: []
        };
      }
    });

    console.log('Formatted freelancers:', formattedFreelancers); // Debug log
    res.status(200).json(formattedFreelancers);
  } catch (error) {
    console.error('Detailed error:', error); // More detailed error logging
    res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) });
  }
}