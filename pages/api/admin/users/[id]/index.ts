import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../../../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin(req);
    if (!isUserAdmin) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Delete user's hired freelancers first
    await prisma.hiredFreelancer.deleteMany({
      where: { userId: id }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message
    });
  }
} 