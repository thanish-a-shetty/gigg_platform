import { NextApiRequest, NextApiResponse } from 'next';
import { freelancers } from '../../data/freelancers';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(freelancers);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
