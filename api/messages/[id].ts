import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, fsSet, fsDelete, isAdmin, getIp, rateLimit } from '../../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });

  const id = req.query.id as string;

  if (req.method === 'PATCH') {
    const existing = await fsGet('messages', id) || {};
    await fsSet('messages', id, { ...existing, ...req.body });
    return res.json({ success: true, message: 'Mensagem atualizada.' });
  }

  if (req.method === 'DELETE') {
    await fsDelete('messages', id);
    return res.json({ success: true, message: 'Mensagem excluída.' });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido.' });
}
