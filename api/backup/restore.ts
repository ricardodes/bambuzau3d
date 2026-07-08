import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsSet, isAdmin, getIp, rateLimit } from '../../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });

  try {
    const data = req.body?.backupData || req.body;
    if (!data) return res.status(400).json({ success: false, error: 'Dados não fornecidos.' });
    const promises: Promise<void>[] = [];
    if (data.settings) promises.push(fsSet('settings', 'main', data.settings));
    if (Array.isArray(data.products))    data.products.forEach((p: any)    => { if (p.id) promises.push(fsSet('products',    String(p.id), p)); });
    if (Array.isArray(data.categories))  data.categories.forEach((c: any)  => { if (c.id) promises.push(fsSet('categories',  String(c.id), c)); });
    if (Array.isArray(data.messages))    data.messages.forEach((m: any)    => { if (m.id) promises.push(fsSet('messages',    String(m.id), m)); });
    await Promise.all(promises);
    return res.json({ success: true, message: 'Backup restaurado com sucesso!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Erro ao restaurar: ${err.message}` });
  }
}
