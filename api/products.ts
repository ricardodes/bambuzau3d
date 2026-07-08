import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, fsSet, fsDelete, isAdmin, san, getIp, rateLimit } from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });

  if (req.method === 'GET') {
    try {
      const prods = await fsGet('products');
      const mapped = (prods as any[]).map((p: any) => {
        if (p.categoryId === 'articulados') return { ...p, categoryId: 'decorativos', category: 'Decoração & Vasos' };
        if (p.categoryId === 'organizacao') return { ...p, categoryId: 'geek-marvel', category: 'Universo Geek' };
        return p;
      });
      return res.json({ success: true, products: mapped });
    } catch (err: any) {
      console.error('[products GET]', err.message);
      return res.status(500).json({ success: false, error: 'Erro ao buscar produtos.' });
    }
  }

  if (req.method === 'POST') {
    if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
    const p = req.body;
    if (!p?.id || !p?.name) return res.status(400).json({ success: false, error: 'Dados inválidos.' });
    const sanitized = { ...p, name: san(p.name, 150), description: san(p.description, 1500), priceFormatted: san(p.priceFormatted, 50), image: san(p.image, 500), badge: san(p.badge, 50), shopeeUrl: san(p.shopeeUrl, 500), categoryId: san(p.categoryId, 80) };
    await fsSet('products', String(p.id), sanitized);
    return res.json({ success: true, message: 'Produto salvo.', product: sanitized });
  }

  if (req.method === 'DELETE') {
    if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ success: false, error: 'ID não informado.' });
    await fsDelete('products', id);
    return res.json({ success: true, message: 'Produto removido.' });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido.' });
}
