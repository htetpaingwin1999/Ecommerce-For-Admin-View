import { DiscountByProduct } from "@/models/DiscountByProduct";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await DiscountByProduct.findOne({ _id: req.query.id }).populate("productId"));
    } else {
      res.json(await DiscountByProduct.find().populate("productId"));
    }
  }

  if (method === "POST") {
    const { productId, discount_percentage, start_date, end_date } = req.body;
    const discountByProductDoc = await DiscountByProduct.create({
      productId,
      discount_percentage,
      start_date,
      end_date,
    });
    res.json(discountByProductDoc);
  }

  if (method === "PUT") {
    const { productId, discount_percentage, start_date, end_date, _id } = req.body;
    await DiscountByProduct.updateOne(
      { _id },
      { productId, discount_percentage, start_date, end_date }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await DiscountByProduct.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
