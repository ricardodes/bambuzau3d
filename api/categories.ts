import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, getIp, rateLimit } from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  try {
    const cats = await fsGet('categories');
    const filtered = (cats as any[]).filter((c: any) => c.id !== 'articulados' && c.id !== 'organizacao');
    return res.json({ success: true, categories: filtered });
  } catch (err: any) {
    console.error('[categories]', err.message);
    return res.status(500).json({ success: false, error: 'Erro ao buscar categorias.' });
  }
}
