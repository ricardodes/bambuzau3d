import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdmin, getIp, rateLimit } from '../../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
  return res.json({ success: true, backups: [] });
}
