import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET' && req.url === '/api/generate') {
    return res.json({ message: "AI calculator generated!" });
  }
  
  return res.status(404).json({ error: 'Not found' });
}
