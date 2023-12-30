import {mongooseConnect} from "@/lib/mongoose";
import { Client } from "../../models/Client";
import { Orders } from "../../models/Order";


export default async function handler(req,res) {
  await mongooseConnect();
  const { method } = req;
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Orders.findOne({ _id: req.query.id })
        .sort({ createdAt: -1 })
        .populate('clientID').exec());
    } else {
      res.json(await Orders.find()
        .sort({ createdAt: -1 })
        .populate('clientID').exec());
    }
  }


  if (method === 'PUT') {
    try {
      const { _id, status, paid } = req.body; // Assuming the request body contains _id and status fields
      // res.json(_id+"~"+status+"~"+paid)
      if (_id) {
        // Assuming you have a valid _id to identify the order you want to update
        if (typeof status !== 'undefined' && status !== null && typeof paid !== 'undefined' && paid !== null) {
          // Update both
          await Orders.updateOne({ _id }, { status });
          res.json({ message: 'Order status updated successfully.' });
        }else if (typeof status !== 'undefined' && status !== null) {
          // Update the status
          await Orders.updateOne({ _id }, { status });
          res.json({ message: 'Order status updated successfully.' });
        } else if (typeof paid !== 'undefined' && paid !== null) {
          // Update the paid status
          await Orders.updateOne({ _id }, { paid });
          res.json({ message: 'Order paid status updated successfully.' });
        }
      } else {
        // Handle the case when _id is missing
        res.status(400).json({ message: 'Invalid request. _id is required to update the order.' });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (method == 'DELETE') {
      const {_id} = req.query;
      await Orders.deleteOne({_id});
      res.json("ok");
  }
}


  // const aggregationPipeline = [
  //   {
  //     $match: {
  //       status: 1
  //     }
  //   },
  //   {
  //     $unwind: "$line_items",
  //   },
  //   {
  //     $group: {
  //       _id: "$line_items.price_data.product_data.productID",
  //       totalSales: { $sum: "$line_items.quantity" },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0, // Exclude the default _id field from the result
  //       productId: "$_id",
  //       totalQuantity: 1
  //     }
  //   }
  // ];

  // const result = await Orders.aggregate(aggregationPipeline);
  
  // res.json(result);
  