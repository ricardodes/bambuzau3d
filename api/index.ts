import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Firebase config (hardcoded do firebase-applet-config.json) ───────────────
const FB_PROJECT = 'just-fire-500919-b6';
const FB_DB      = 'ai-studio-ae37a1e8-36d0-4f3b-8392-7b44621485be';
const FB_API_KEY = 'AIzaSyDZKUagK0ifbxqOYd5unEuBRCwhz6AyTnA';
const BASE_URL   = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/${FB_DB}/documents`;

// ─── Firestore REST helpers ───────────────────────────────────────────────────
function fsVal(v: any): any {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean')        return { booleanValue: v };
  if (typeof v === 'number')         return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string')         return { stringValue: v };
  if (Array.isArray(v))             return { arrayValue: { values: v.map(fsVal) } };
  if (typeof v === 'object')        return { mapValue: { fields: objToFields(v) } };
  return { stringValue: String(v) };
}
function objToFields(obj: Record<string, any>) {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = fsVal(v);
  return fields;
}
function fromFsVal(v: any): any {
  if (!v) return null;
  if ('nullValue'    in v) return null;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue'  in v) return v.doubleValue;
  if ('stringValue'  in v) return v.stringValue;
  if ('arrayValue'   in v) return (v.arrayValue?.values || []).map(fromFsVal);
  if ('mapValue'     in v) return fieldsToObj(v.mapValue?.fields || {});
  return null;
}
function fieldsToObj(fields: Record<string, any>) {
  const obj: Record<string, any> = {};
  for (const [k, v] of Object.entries(fields)) obj[k] = fromFsVal(v);
  return obj;
}

async function fsGet(col: string, docId?: string): Promise<any> {
  const url = docId
    ? `${BASE_URL}/${col}/${docId}?key=${FB_API_KEY}`
    : `${BASE_URL}/${col}?key=${FB_API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Firestore GET ${col}/${docId||''} failed: ${r.status}`);
  const data = await r.json();
  if (docId) {
    if (!data.fields) return null;
    return { id: docId, ...fieldsToObj(data.fields) };
  }
  if (!data.documents) return [];
  return data.documents.map((d: any) => {
    const id = d.name.split('/').pop();
    return { id, ...fieldsToObj(d.fields || {}) };
  });
}

async function fsSet(col: string, docId: string, payload: Record<string, any>): Promise<void> {
  const fields = objToFields(payload);
  const url = `${BASE_URL}/${col}/${docId}?key=${FB_API_KEY}`;
  const r = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!r.ok) throw new Error(`Firestore SET ${col}/${docId} failed: ${r.status} ${await r.text()}`);
}

async function fsDelete(col: string, docId: string): Promise<void> {
  const url = `${BASE_URL}/${col}/${docId}?key=${FB_API_KEY}`;
  const r = await fetch(url, { method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`Firestore DELETE ${col}/${docId} failed: ${r.status}`);
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  storeName: 'Bambuzau 3D',
  storeDescription: 'Personalizados que conectam. O melhor do universo Geek, Marvel, decorações sofisticadas e impressões 3D sob medida.',
  shopeeStoreUrl: 'https://shopee.com.br/bambuzau3d',
  whatsAppPhone: '5515997788281',
  whatsAppMessage: 'Olá Bambuzau 3D! Gostaria de encomendar uma peça personalizada!',
  whatsAppEnabled: true,
  socialInstagram: 'bambuzau3d',
  socialFacebook: '',
  socialYoutube: '',
  socialTelegram: '',
  wholesaleWhatsApp: '5515997788281',
  wholesaleTelegram: '',
  logoUrl: '',
  adminPassword: 'admin123',
  isAdminOnline: true,
  contactEmail: 'bambuzau3d@gmail.com',
  useLocalDatabaseOnly: false,
};

// ─── Settings helpers ─────────────────────────────────────────────────────────
async function getSettings(): Promise<typeof DEFAULT_SETTINGS & Record<string,any>> {
  try {
    const doc = await fsGet('settings', 'main');
    if (doc) return { ...DEFAULT_SETTINGS, ...doc };
  } catch(e) { console.error('getSettings error:', e); }
  return { ...DEFAULT_SETTINGS };
}

// ─── Sanitize ─────────────────────────────────────────────────────────────────
const san = (v: any, max = 1000) =>
  typeof v === 'string'
    ? v.trim().substring(0, max)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;')
    : '';

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function isAdmin(req: VercelRequest): Promise<boolean> {
  const h = req.headers['x-admin-password'] || req.headers['authorization'];
  if (!h) return false;
  const provided = typeof h === 'string' ? h.replace(/^Bearer\s+/, '') : '';
  const settings = await getSettings();
  return provided === (settings.adminPassword || 'admin123');
}

// ─── Rate limiter simples ─────────────────────────────────────────────────────
const rl: Record<string, { n: number; t: number }> = {};
function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (!rl[ip] || now > rl[ip].t) { rl[ip] = { n: 1, t: now + windowMs }; return true; }
  rl[ip].n++;
  return rl[ip].n <= max;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const ip = ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || 'unknown';
  const { method, query } = req;
  const pathParam = Array.isArray(query.path) ? query.path.join('/') : (query.path || '');
  const route = `/api/${pathParam}`;

  // Rate limit geral
  if (!rateLimit(ip, 150, 60000)) {
    return res.status(429).json({ success: false, error: 'Muitas requisições. Tente em 1 minuto.' });
  }

  try {
    // ── GET /api/health
    if (route === '/api/health' && method === 'GET') {
      return res.json({ status: 'ok', service: 'Bambuzau 3D API' });
    }

    // ── GET /api/categories
    if (route === '/api/categories' && method === 'GET') {
      const cats = await fsGet('categories');
      const filtered = (cats as any[]).filter((c: any) => c.id !== 'articulados' && c.id !== 'organizacao');
      return res.json({ success: true, categories: filtered });
    }

    // ── GET /api/products
    if (route === '/api/products' && method === 'GET') {
      const prods = await fsGet('products');
      const mapped = (prods as any[]).map((p: any) => {
        if (p.categoryId === 'articulados') return { ...p, categoryId: 'decorativos', category: 'Decoração & Vasos' };
        if (p.categoryId === 'organizacao') return { ...p, categoryId: 'geek-marvel', category: 'Universo Geek' };
        return p;
      });
      return res.json({ success: true, products: mapped });
    }

    // ── GET /api/settings
    if (route === '/api/settings' && method === 'GET') {
      const settings = await getSettings();
      if (await isAdmin(req)) {
        return res.json({ success: true, settings });
      }
      const { adminPassword: _pw, ...pub } = settings as any;
      return res.json({ success: true, settings: pub });
    }

    // ── POST /api/verify-password
    if (route === '/api/verify-password' && method === 'POST') {
      if (!rateLimit(ip, 20, 600000)) {
        return res.status(429).json({ success: false, error: 'Muitas tentativas. Tente em 10 minutos.' });
      }
      const { password } = req.body;
      const settings = await getSettings();
      const ok = password === (settings.adminPassword || 'admin123');
      return res.json(ok ? { success: true } : { success: false, error: 'Senha incorreta' });
    }

    // ── POST /api/settings  (admin)
    if (route === '/api/settings' && method === 'POST') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      const s = req.body;
      if (!s?.storeName) return res.status(400).json({ success: false, error: 'Configurações inválidas' });
      const sanitized = {
        ...s,
        storeName:        san(s.storeName, 100),
        storeDescription: san(s.storeDescription, 500),
        shopeeStoreUrl:   san(s.shopeeStoreUrl, 300),
        whatsAppPhone:    san(s.whatsAppPhone, 30),
        whatsAppMessage:  san(s.whatsAppMessage, 500),
        socialInstagram:  san(s.socialInstagram, 100),
        contactEmail:     san(s.contactEmail, 150),
      };
      await fsSet('settings', 'main', sanitized);
      return res.json({ success: true, message: 'Configurações salvas com sucesso' });
    }

    // ── POST /api/products  (admin)
    if (route === '/api/products' && method === 'POST') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      const p = req.body;
      if (!p?.id || !p?.name) return res.status(400).json({ success: false, error: 'Dados do produto inválidos' });
      const sanitized = {
        ...p,
        name:          san(p.name, 150),
        description:   san(p.description, 1500),
        priceFormatted:san(p.priceFormatted, 50),
        image:         san(p.image, 500),
        badge:         san(p.badge, 50),
        shopeeUrl:     san(p.shopeeUrl, 500),
        categoryId:    san(p.categoryId, 80),
      };
      await fsSet('products', String(p.id), sanitized);
      return res.json({ success: true, message: 'Produto salvo com sucesso', product: sanitized });
    }

    // ── DELETE /api/products/:id  (admin)
    const delProd = route.match(/^\/api\/products\/(\d+)$/);
    if (delProd && method === 'DELETE') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      await fsDelete('products', delProd[1]);
      return res.json({ success: true, message: 'Produto removido com sucesso' });
    }

    // ── GET /api/messages  (admin)
    if (route === '/api/messages' && method === 'GET') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      const messages = await fsGet('messages');
      return res.json({ success: true, messages });
    }

    // ── POST /api/messages  (público)
    if (route === '/api/messages' && method === 'POST') {
      if (!rateLimit(ip, 5, 300000)) {
        return res.status(429).json({ success: false, error: 'Aguarde 5 minutos antes de enviar outra mensagem.' });
      }
      const { name, email, phone, messageText } = req.body;
      if (!name || !email || !messageText) {
        return res.status(400).json({ success: false, error: 'Nome, email e mensagem são obrigatórios' });
      }
      const id = Date.now().toString();
      await fsSet('messages', id, {
        id,
        name:        san(name, 100),
        email:       san(email, 150),
        phone:       san(phone, 30),
        messageText: san(messageText, 2000),
        createdAt:   new Date().toISOString(),
        read:        false,
        replied:     false,
      });
      return res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
    }

    // ── PATCH /api/messages/:id  (admin)
    const patchMsg = route.match(/^\/api\/messages\/([^/]+)$/);
    if (patchMsg && method === 'PATCH') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      const existing = await fsGet('messages', patchMsg[1]) || {};
      await fsSet('messages', patchMsg[1], { ...existing, ...req.body });
      return res.json({ success: true, message: 'Mensagem atualizada!' });
    }

    // ── DELETE /api/messages/:id  (admin)
    const delMsg = route.match(/^\/api\/messages\/([^/]+)$/);
    if (delMsg && method === 'DELETE') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      await fsDelete('messages', delMsg[1]);
      return res.json({ success: true, message: 'Mensagem excluída!' });
    }

    // ── GET /api/backup/download  (admin)
    if (route === '/api/backup/download' && method === 'GET') {
      if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
      const [settings, categories, products, messages] = await Promise.all([
        getSettings(), fsGet('categories'), fsGet('products'), fsGet('messages')
      ]);
      const snapshot = { settings, categories, products, messages, lastUpdated: new Date().toISOString() };
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=bambuzau-backup-${new Date().toISOString().split('T')[0]}.json`);
      return res.send(JSON.stringify(snapshot, null, 2));
    }

    // Rota não encontrada
    return res.status(404).json({ success: false, error: 'Rota não encontrada' });

  } catch (err: any) {
    console.error('[API Error]', route, err?.message || err);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
}
