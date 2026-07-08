import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, fsSet, getSettings, DEFAULT_SETTINGS, isAdmin, getIp, rateLimit } from '../../_shared';

// Handles /api/backup/list, /api/backup/restore, /api/backup/recreate-db, /api/backup/download
// via a single dynamic-segment function (same pattern as products/[id].ts and messages/[id].ts).

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });
  if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });

  const action = req.query.action as string;

  if (action === 'list') {
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
    return res.json({ success: true, backups: [] });
  }

  if (action === 'restore') {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
    try {
      const data = req.body?.backupData || req.body;
      if (!data) return res.status(400).json({ success: false, error: 'Dados não fornecidos.' });
      const promises: Promise<void>[] = [];
      if (data.settings) promises.push(fsSet('settings', 'main', data.settings));
      if (Array.isArray(data.products)) data.products.forEach((p: any) => { if (p.id) promises.push(fsSet('products', String(p.id), p)); });
      if (Array.isArray(data.categories)) data.categories.forEach((c: any) => { if (c.id) promises.push(fsSet('categories', String(c.id), c)); });
      if (Array.isArray(data.messages)) data.messages.forEach((m: any) => { if (m.id) promises.push(fsSet('messages', String(m.id), m)); });
      await Promise.all(promises);
      return res.json({ success: true, message: 'Backup restaurado com sucesso!' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: `Erro ao restaurar: ${err.message}` });
    }
  }

  if (action === 'recreate-db') {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
    try {
      await fsSet('settings', 'main', DEFAULT_SETTINGS);
      return res.json({ success: true, message: 'Banco recriado com configurações padrão.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: `Erro: ${err.message}` });
    }
  }

  if (action === 'download') {
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
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

  return res.status(404).json({ success: false, error: 'Ação de backup desconhecida.' });
}
