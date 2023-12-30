import { mongooseConnect } from '@/lib/mongoose';
import { Payment } from '@/models/Payment';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (method === 'GET') {
    if (req.query?.id) {
        const payment = await Payment.findById(req.query.id)
        .populate('clientID').exec();
        res.json(payment);
    } else {
      res.json(await Payment.find()
      .populate('clientID','fullName')
      .populate('orderID',)
      .exec());

    }
  }

  if (method === 'POST') {
    const {
      userId,
      amount,
      orderIds,
      paymentMethod,
      status,
      screenshot,
      note,
    } = req.body;
    try {
      const paymentDoc = await Payment.create({
        userId,
        amount,
        orderIds,
        paymentMethod,
        status,
        screenshot,
        note,
      });
      res.json(paymentDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create payment.' });
    }
  }

  if (method === 'PUT') {
    try {
      const { _id, status } = req.body; // Assuming the request body contains _id and status fields

      if (!_id || !status) {
        return res.status(400).json({ error: 'Both _id and status are required.' });
      }

      // Update the status of the order
      await Payment.updateOne({ _id }, { status });

      res.json({ message: 'Order status updated successfully.' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (method == 'DELETE') {
      const {_id} = req.query;
      await Payment.deleteOne({_id});
      res.json("ok");
  }

  // Add PUT and DELETE methods as needed
}
