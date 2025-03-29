import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const prisma = new PrismaClient();

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  console.log('Generating token with payload:', payload);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verified:', decoded);
    
    if (!decoded || !decoded.userId || !decoded.role) {
      console.error('Invalid token payload:', decoded);
      throw new Error('Invalid token payload');
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

export const authenticateUser = async (req: NextApiRequest) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token in authorization header');
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log('Authenticating token:', token);
    
    const decoded = verifyToken(token);
    console.log('Token decoded:', decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      console.log('User not found:', decoded.userId);
      throw new Error('User not found');
    }

    console.log('User authenticated:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
};

export const isAdmin = async (req: NextApiRequest): Promise<boolean> => {
  try {
    const user = await authenticateUser(req);
    console.log('Admin check for user:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    return user.role === 'admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}; 