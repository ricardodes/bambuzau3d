import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  fsGet, fsSet, fsDelete, getSettings, DEFAULT_SETTINGS,
  isAdmin, san, getIp, rateLimit,
} from '../_shared';

// Consolidates every /api/* route into a single Serverless Function so the
// project stays well under Vercel Hobby's 12-function limit.
// Routing is done internally based on the path segments after /api/.

function getSegments(req: VercelRequest): string[] {
  const raw = req.query.path;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return [raw];
  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = getSegments(req);
  const [root, sub] = segments;
  const ip = getIp(req);

  try {
    // ---- /api/health ----
    if (root === 'health') {
      return res.json({ status: 'ok', service: 'Bambuzau 3D API' });
    }

    // Shared rate limit for everything below
    if (!rateLimit(ip, 150, 60000)) {
      return res.status(429).json({ success: false, error: 'Muitas requisições.' });
    }

    // ---- /api/verify-password ----
    if (root === 'verify-password') {
      if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
      if (!rateLimit(ip, 20, 600000)) return res.status(429).json({ success: false, error: 'Muitas tentativas.' });
      const { password } = req.body;
      const settings = await getSettings();
      return res.json(password === (settings.adminPassword || 'admin123')
        ? { success: true }
        : { success: false, error: 'Senha incorreta.' });
    }

    // ---- /api/settings ----
    if (root === 'settings') {
      if (req.method === 'GET') {
        const settings = await getSettings();
        if (await isAdmin(req)) return res.json({ success: true, settings });
        const { adminPassword: _pw, ...pub } = settings as any;
        return res.json({ success: true, settings: pub });
      }
      if (req.method === 'POST') {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const s = req.body;
        if (!s?.storeName) return res.status(400).json({ success: false, error: 'Dados inválidos.' });
        const sanitized = {
          ...s,
          storeName: san(s.storeName, 100),
          storeDescription: san(s.storeDescription, 500),
          shopeeStoreUrl: san(s.shopeeStoreUrl, 300),
          whatsAppPhone: san(s.whatsAppPhone, 30),
          whatsAppMessage: san(s.whatsAppMessage, 500),
          socialInstagram: san(s.socialInstagram, 100),
          contactEmail: san(s.contactEmail, 150),
        };
        await fsSet('settings', 'main', sanitized);
        return res.json({ success: true, message: 'Configurações salvas.' });
      }
      return res.status(405).json({ success: false, error: 'Método não permitido.' });
    }

    // ---- /api/categories ----
    if (root === 'categories') {
      try {
        const cats = await fsGet('categories');
        const filtered = (cats as any[]).filter((c: any) => c.id !== 'articulados' && c.id !== 'organizacao');
        return res.json({ success: true, categories: filtered });
      } catch (err: any) {
        console.error('[categories]', err.message);
        return res.status(500).json({ success: false, error: 'Erro ao buscar categorias.' });
      }
    }

    // ---- /api/products  and  /api/products/:id ----
    if (root === 'products') {
      const id = sub;

      if (req.method === 'GET' && !id) {
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

      if (req.method === 'POST' && !id) {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const p = req.body;
        if (!p?.id || !p?.name) return res.status(400).json({ success: false, error: 'Dados inválidos.' });
        const sanitized = {
          ...p,
          name: san(p.name, 150),
          description: san(p.description, 1500),
          priceFormatted: san(p.priceFormatted, 50),
          image: san(p.image, 500),
          badge: san(p.badge, 50),
          shopeeUrl: san(p.shopeeUrl, 500),
          categoryId: san(p.categoryId, 80),
        };
        await fsSet('products', String(p.id), sanitized);
        return res.json({ success: true, message: 'Produto salvo.', product: sanitized });
      }

      if (req.method === 'DELETE') {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const delId = id || (req.query.id as string);
        if (!delId) return res.status(400).json({ success: false, error: 'ID não informado.' });
        await fsDelete('products', delId);
        return res.json({ success: true, message: 'Produto removido.' });
      }

      return res.status(405).json({ success: false, error: 'Método não permitido.' });
    }

    // ---- /api/messages  and  /api/messages/:id ----
    if (root === 'messages') {
      const id = sub;

      if (req.method === 'GET' && !id) {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const messages = await fsGet('messages');
        return res.json({ success: true, messages });
      }

      if (req.method === 'POST' && !id) {
        if (!rateLimit(ip, 5, 300000)) return res.status(429).json({ success: false, error: 'Aguarde 5 minutos.' });
        const { name, email, phone, messageText } = req.body;
        if (!name || !email || !messageText) return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando.' });
        const newId = Date.now().toString();
        await fsSet('messages', newId, {
          id: newId, name: san(name, 100), email: san(email, 150), phone: san(phone, 30),
          messageText: san(messageText, 2000), createdAt: new Date().toISOString(), read: false, replied: false,
        });
        return res.json({ success: true, message: 'Mensagem enviada!' });
      }

      if (req.method === 'PATCH') {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const patchId = id || (req.query.id as string);
        if (!patchId) return res.status(400).json({ success: false, error: 'ID não informado.' });
        const existing = await fsGet('messages', patchId) || {};
        await fsSet('messages', patchId, { ...existing, ...req.body });
        return res.json({ success: true, message: 'Mensagem atualizada.' });
      }

      if (req.method === 'DELETE') {
        if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
        const delId = id || (req.query.id as string);
        if (!delId) return res.status(400).json({ success: false, error: 'ID não informado.' });
        await fsDelete('messages', delId);
        return res.json({ success: true, message: 'Mensagem excluída.' });
      }

      return res.status(405).json({ success: false, error: 'Método não permitido.' });
    }

    // ---- /api/backup/list ----
    if (root === 'backup' && sub === 'list') {
      if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      return res.json({ success: true, backups: [] });
    }

    // ---- /api/backup/restore ----
    if (root === 'backup' && sub === 'restore') {
      if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
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

    // ---- /api/backup/recreate-db ----
    if (root === 'backup' && sub === 'recreate-db') {
      if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método não permitido.' });
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      try {
        await fsSet('settings', 'main', DEFAULT_SETTINGS);
        return res.json({ success: true, message: 'Banco recriado com configurações padrão.' });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: `Erro: ${err.message}` });
      }
    }

    // ---- /api/backup/download ----
    if (root === 'backup' && sub === 'download') {
      if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Método não permitido.' });
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      try {
        const [settings, categories, products, messages] = await Promise.all([
          getSettings(), fsGet('categories'), fsGet('products'), fsGet('messages'),
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

    return res.status(404).json({ success: false, error: 'Rota não encontrada.' });
  } catch (err: any) {
    console.error('[api handler]', err);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
}
