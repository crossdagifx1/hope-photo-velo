// api/booking.js — Backward-compatible alias for /api/orders
import ordersHandler from './orders.js';

export default async function handler(req, res) {
  return ordersHandler(req, res);
}
