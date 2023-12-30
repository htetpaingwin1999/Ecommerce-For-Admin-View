import { mongooseConnect } from "@/lib/mongoose";
import { Orders } from "@/models/Order";


export default async function handler(req, res) {
  await mongooseConnect();
  const { method, query, body } = req;

  if (method === "GET") {
    if (!query.clientID) {
      return res.status(400).json({ error: 'clientID query parameter is required' });
    }

    const clientID = query.clientID;
    const orderID = query.orderID; // Get the orderID query parameter

    try {
      // Build the query to find orders based on clientID
      const queryObj = { clientID };
      
      // If orderID is provided, exclude that specific order
      if (orderID) {
        queryObj._id = { $ne: orderID }; // Use $ne (not equal) to exclude the specified order
      }

      const orders = await Orders.find(queryObj).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
  }

  // Handle other HTTP methods if needed (PUT, POST, DELETE, etc.)
}
