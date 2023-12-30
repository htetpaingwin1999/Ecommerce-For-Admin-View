// yearly-sales.js
import { mongooseConnect } from "@/lib/mongoose";
import { Orders } from "@/models/Order";
import { format } from 'date-fns-tz';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      const { year } = req.query;

      // Validate the year input (e.g., check for valid values)
      // You can add your validation logic here

      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

      const pipeline = [
        {
          $match: {
            status: 3,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $unwind: "$line_items",
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }, // Group by month as well
            },
            totalOrders: { $sum: "$line_items.quantity" },
            totalSales: { $sum: "$line_items.price_data.pay_amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ];

      const yearlySales = await Orders.aggregate(pipeline);

      res.json(yearlySales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching yearly sales' });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" }); // Handle other HTTP methods
  }
}
