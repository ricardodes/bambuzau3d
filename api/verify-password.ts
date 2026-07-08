import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSettings, getIp, rateLimit } from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
  const ip = getIp(req);
  if (!rateLimit(ip, 20, 600000)) return res.status(429).json({ success: false, error: 'Muitas tentativas.' });
  const { password } = req.body;
  const settings = await getSettings();
  return res.json(password === (settings.adminPassword || 'admin123') ? { success: true } : { success: false, error: 'Senha incorreta.' });
}
