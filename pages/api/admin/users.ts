import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Admin users API called');
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));

  if (req.method !== 'GET') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid token provided in headers');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token.substring(0, 10) + '...');

    // Verify token and get user data
    console.log('Attempting to verify token...');
    const decoded = verifyToken(token);
    console.log('Token verified successfully:', {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });

    // Check if user exists and is admin
    console.log('Looking up user in database...');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    console.log('Database lookup result:', user);

    if (!user) {
      console.log('User not found in database:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      console.log('Non-admin access attempt:', {
        userId: user.id,
        email: user.email,
        role: user.role
      });
      return res.status(401).json({ message: 'Unauthorized access - Not an admin' });
    }

    console.log('Admin access verified for user:', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Fetch all users
    console.log('Fetching all users...');
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Successfully fetched users:', {
      count: users.length,
      firstUser: users[0] ? {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role
      } : null
    });

    // Transform the data to exclude sensitive information
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    res.status(200).json({ users: sanitizedUsers });
  } catch (error: any) {
    console.error('Error in admin/users API:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        details: error.message
      });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      details: error.message
    });
  }
} 