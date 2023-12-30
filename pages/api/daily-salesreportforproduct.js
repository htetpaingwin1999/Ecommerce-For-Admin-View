import { mongooseConnect } from "@/lib/mongoose";
import { Orders } from "@/models/Order";
import { format } from 'date-fns-tz';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      // Your local timezone (e.g., "Asia/Yangon")
      const localTimezone = "Asia/Yangon";
      
      // Current date and time in your local timezone
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd', { timeZone: localTimezone });

      const pipeline = [
        {
          $match: {
            status: 3,
            createdAt: {
              $gte: new Date(`${formattedDate}T00:00:00.000Z`), // Start of the day
              $lte: new Date(`${formattedDate}T23:59:59.999Z`), // End of the day
            },
          },
        },
        {
          $unwind: "$line_items",
        },
        {
          $group: {
            _id: "$line_items.price_data.product_data.productID",
            productTitle: { $first: "$line_items.price_data.product_data.productTitle" }, // Get the productTitle
            totalQuantity: { $sum: "$line_items.quantity" },
            totalSale: { $sum: "$line_items.price_data.pay_amount" },
          },
        },
      ];

      const productSales = await Orders.aggregate(pipeline);

      res.json(productSales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching product sales' });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" }); // Handle other HTTP methods
  }
}
