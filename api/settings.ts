import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsSet, getSettings, isAdmin, san, getIp, rateLimit } from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });

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
    const sanitized = { ...s, storeName: san(s.storeName, 100), storeDescription: san(s.storeDescription, 500), shopeeStoreUrl: san(s.shopeeStoreUrl, 300), whatsAppPhone: san(s.whatsAppPhone, 30), whatsAppMessage: san(s.whatsAppMessage, 500), socialInstagram: san(s.socialInstagram, 100), contactEmail: san(s.contactEmail, 150) };
    await fsSet('settings', 'main', sanitized);
    return res.json({ success: true, message: 'Configurações salvas.' });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido.' });
}
