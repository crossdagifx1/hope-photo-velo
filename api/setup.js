// api/setup.js - One-Click Bot Webhook & Menu Button Configurator
import { BOT_TOKEN } from './_store.js';

export default async function handler(req, res) {
  const host = req.headers.host || 'hope-photo-velo-jade.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const webhookUrl = `${baseUrl}/api/telegram`;
  const miniAppUrl = `${baseUrl}/?tma=1`;

  const results = {};

  try {
    // 1. Set Webhook
    const whRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query']
      })
    });
    results.setWebhook = await whRes.json();

    // 2. Set Chat Menu Button to launch Mini App
    const menuRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: '🚀 Open App',
          web_app: {
            url: miniAppUrl
          }
        }
      })
    });
    results.setChatMenuButton = await menuRes.json();

    // 3. Set Bot Commands list
    const cmdRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commands: [
          { command: 'start', description: 'Open HOPE Studio Mini App' },
          { command: 'orders', description: 'View current orders & quotes (Admin)' },
          { command: 'discount', description: 'Grant custom discount: /discount <id> <amount>' },
          { command: 'reply', description: 'Send chat message to client: /reply <id> <text>' }
        ]
      })
    });
    results.setMyCommands = await cmdRes.json();

    return res.status(200).json({
      success: true,
      baseUrl,
      webhookUrl,
      miniAppUrl,
      results
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, results });
  }
}
