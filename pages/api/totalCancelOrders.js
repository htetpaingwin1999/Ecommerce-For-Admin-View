
import {mongooseConnect} from "@/lib/mongoose";
import { Orders } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;
    
    if (method === 'GET') {
      try {
        const orders = await Orders.find({ status: -1 }).sort({ createdAt: -1 });
        res.json(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching orders' });
      }
    }
  }
  