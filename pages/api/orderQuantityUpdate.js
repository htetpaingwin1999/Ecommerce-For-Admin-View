import { mongooseConnect } from "@/lib/mongoose";
import { Orders } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === 'PUT') {
    try {
      const { _id, line_items, city, phone, streetAddress, status } = req.body;

      if (!_id) {
        return res.status(400).json({ error: 'Both _id and line_items are required.' });
      }

      if (line_items.length === 0) {
        // If line item length is zero, delete the order
        await Orders.deleteOne({ _id });
        return res.json({ message: 'Order deleted successfully.' });
      }

      // Update the status of the order
      await Orders.updateOne({ _id }, { line_items, city, phone, streetAddress, status });

      res.json({ message: 'Order line_item updated successfully.' });
    } catch (error) {
      console.error('Error updating order line_item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
