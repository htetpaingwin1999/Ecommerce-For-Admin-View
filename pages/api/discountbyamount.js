import { DiscountByAmount } from "@/models/DiscountByAmount";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await DiscountByAmount.findOne({ _id: req.query.id }));
    } else {
      res.json(await DiscountByAmount.find());
    }
  }

  if (method === "POST") {
    const { amount, discount_percentage, description, start_date, end_date } = req.body;
    const discountByAmountDoc = await DiscountByAmount.create({
      amount,
      discount_percentage,
      description,
      start_date,
      end_date,
    });
    res.json(discountByAmountDoc);
  }

  if (method === "PUT") {
    const { amount, discount_percentage, description, start_date, end_date, _id } = req.body;
    await DiscountByAmount.updateOne(
      { _id },
      { amount, discount_percentage, description, start_date, end_date }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await DiscountByAmount.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
