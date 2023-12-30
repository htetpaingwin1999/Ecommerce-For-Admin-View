import { mongooseConnect } from "@/lib/mongoose";
import { Orders } from "@/models/Order";
import { format } from 'date-fns-tz';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    try {
      const { month, year } = req.query;

      // Validate the month and year input (e.g., check for valid values)
      // You can add your validation logic here

      // Create a date range for the selected month and year
      const startDate = new Date(year, month - 1, 1); // Subtract 1 from the month to make it zero-based

      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;

      // Create a date for the first day of the next month
      const firstDayOfNextMonth = new Date(nextYear, nextMonth - 1, 1);

      // Subtract 1 millisecond to get the last day of the current month
      const endDate = new Date(firstDayOfNextMonth.getTime() - 1);

      const pipeline = [
        {
          $match: {
            status: 3,
            createdAt: {
              $gte: startDate,
              $lt: endDate,
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
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalOrders: { $sum: "$line_items.quantity" },
            totalSales: { $sum: "$line_items.price_data.pay_amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
      ];

      const monthlySales = await Orders.aggregate(pipeline);

      res.json(monthlySales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching monthly sales' });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" }); // Handle other HTTP methods
  }
}
