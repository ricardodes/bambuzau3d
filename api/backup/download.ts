import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, getSettings, isAdmin, getIp, rateLimit } from '../../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });

  try {
    const [settings, categories, products, messages] = await Promise.all([
      getSettings(), fsGet('categories'), fsGet('products'), fsGet('messages')
    ]);
    const snapshot = { settings, categories, products, messages, lastUpdated: new Date().toISOString() };
    const filename = `bambuzau-backup-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(JSON.stringify(snapshot, null, 2));
  } catch (err: any) {
    console.error('[backup/download]', err.message);
    return res.status(500).json({ success: false, error: 'Erro ao gerar backup.' });
  }
}
