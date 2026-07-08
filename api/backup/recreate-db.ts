import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsSet, DEFAULT_SETTINGS, isAdmin, getIp, rateLimit } from '../../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });

  try {
    await fsSet('settings', 'main', DEFAULT_SETTINGS);
    return res.json({ success: true, message: 'Banco recriado com configurações padrão.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Erro: ${err.message}` });
  }
}
