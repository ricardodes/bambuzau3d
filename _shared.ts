import type { VercelRequest } from '@vercel/node';

const FB_PROJECT = 'just-fire-500919-b6';
const FB_DB      = 'ai-studio-ae37a1e8-36d0-4f3b-8392-7b44621485be';
const FB_API_KEY = 'AIzaSyDZKUagK0ifbxqOYd5unEuBRCwhz6AyTnA';
export const BASE_URL = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/${FB_DB}/documents`;

function fsVal(v: any): any {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean')        return { booleanValue: v };
  if (typeof v === 'number')         return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string')         return { stringValue: v };
  if (Array.isArray(v))             return { arrayValue: { values: v.map(fsVal) } };
  if (typeof v === 'object')        return { mapValue: { fields: objToFields(v) } };
  return { stringValue: String(v) };
}
export function objToFields(obj: Record<string, any>) {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = fsVal(v);
  return fields;
}
export function fromFsVal(v: any): any {
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
export function fieldsToObj(fields: Record<string, any>) {
  const obj: Record<string, any> = {};
  for (const [k, v] of Object.entries(fields)) obj[k] = fromFsVal(v);
  return obj;
}

export async function fsGet(col: string, docId?: string): Promise<any> {
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
  return data.documents.map((d: any) => ({ id: d.name.split('/').pop(), ...fieldsToObj(d.fields || {}) }));
}

export async function fsSet(col: string, docId: string, payload: Record<string, any>): Promise<void> {
  const r = await fetch(`${BASE_URL}/${col}/${docId}?key=${FB_API_KEY}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: objToFields(payload) }),
  });
  if (!r.ok) throw new Error(`Firestore SET ${col}/${docId} failed: ${r.status} ${await r.text()}`);
}

export async function fsDelete(col: string, docId: string): Promise<void> {
  const r = await fetch(`${BASE_URL}/${col}/${docId}?key=${FB_API_KEY}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`Firestore DELETE ${col}/${docId} failed: ${r.status}`);
}

export const DEFAULT_SETTINGS = {
  storeName: 'Bambuzau 3D',
  storeDescription: 'Personalizados que conectam. O melhor do universo Geek, Marvel, decorações sofisticadas e impressões 3D sob medida.',
  shopeeStoreUrl: 'https://shopee.com.br/bambuzau3d',
  whatsAppPhone: '5515997788281',
  whatsAppMessage: 'Olá Bambuzau 3D! Gostaria de encomendar uma peça personalizada!',
  whatsAppEnabled: true,
  socialInstagram: 'bambuzau3d',
  socialFacebook: '', socialYoutube: '', socialTelegram: '',
  wholesaleWhatsApp: '5515997788281', wholesaleTelegram: '',
  logoUrl: '', adminPassword: 'admin123', isAdminOnline: true,
  contactEmail: 'bambuzau3d@gmail.com', useLocalDatabaseOnly: false,
};

export async function getSettings() {
  try {
    const doc = await fsGet('settings', 'main');
    if (doc) return { ...DEFAULT_SETTINGS, ...doc };
  } catch(e) { console.error('getSettings error:', e); }
  return { ...DEFAULT_SETTINGS };
}

export const san = (v: any, max = 1000) =>
  typeof v === 'string'
    ? v.trim().substring(0, max)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;')
    : '';

export async function isAdmin(req: VercelRequest): Promise<boolean> {
  const h = req.headers['x-admin-password'] || req.headers['authorization'];
  if (!h) return false;
  const provided = typeof h === 'string' ? h.replace(/^Bearer\s+/, '') : '';
  const s = await getSettings();
  return provided === (s.adminPassword || 'admin123');
}

const rl: Record<string, { n: number; t: number }> = {};
export function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (!rl[ip] || now > rl[ip].t) { rl[ip] = { n: 1, t: now + windowMs }; return true; }
  return ++rl[ip].n <= max;
}

export function getIp(req: VercelRequest): string {
  return ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() || 'unknown';
}
