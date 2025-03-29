import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../../../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const isUserAdmin = await isAdmin(req);
    if (!isUserAdmin) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const { id } = req.query;
    const { role } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user role:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message
    });
  }
} 