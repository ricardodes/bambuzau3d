import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fsGet, fsSet, fsDelete, isAdmin, san, getIp, rateLimit } from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = getIp(req);
  if (!rateLimit(ip, 150, 60000)) return res.status(429).json({ success: false, error: 'Muitas requisições.' });

  if (req.method === 'GET') {
    if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
    const messages = await fsGet('messages');
    return res.json({ success: true, messages });
  }

  if (req.method === 'POST') {
    if (!rateLimit(ip, 5, 300000)) return res.status(429).json({ success: false, error: 'Aguarde 5 minutos.' });
    const { name, email, phone, messageText } = req.body;
    if (!name || !email || !messageText) return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando.' });
    const id = Date.now().toString();
    await fsSet('messages', id, { id, name: san(name, 100), email: san(email, 150), phone: san(phone, 30), messageText: san(messageText, 2000), createdAt: new Date().toISOString(), read: false, replied: false });
    return res.json({ success: true, message: 'Mensagem enviada!' });
  }

  if (req.method === 'PATCH') {
    if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ success: false, error: 'ID não informado.' });
    const existing = await fsGet('messages', id) || {};
    await fsSet('messages', id, { ...existing, ...req.body });
    return res.json({ success: true, message: 'Mensagem atualizada.' });
  }

  if (req.method === 'DELETE') {
    if (!(await isAdmin(req))) return res.status(403).json({ success: false, error: 'Não autorizado.' });
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ success: false, error: 'ID não informado.' });
    await fsDelete('messages', id);
    return res.json({ success: true, message: 'Mensagem excluída.' });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido.' });
}
