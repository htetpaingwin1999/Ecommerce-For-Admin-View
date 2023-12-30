import { Client } from "@/models/Client";
import { Product } from "@/models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import { Review } from "../../models/Review";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (req.query?.productId && req.query?.reviewId) {
    // Get a specific review for a specific product and populate related data
    res.json(await Review.findOne({ product: req.query.productId, _id: req.query.reviewId })
      .populate('client') // Populate the 'client' field from the Review schema
      .populate('product') // Populate the 'product' field from the Review schema
    );
  } else if (req.query?.productId) {
    // Get all reviews for a specific product and populate related data
    res.json(await Review.find({ product: req.query.productId })
      .populate('client') // Populate the 'client' field from the Review schema
      .populate('product') // Populate the 'product' field from the Review schema
    );
  } else if (req.query?.reviewId) {
    // Get a specific review by review ID and populate related data
    res.json(await Review.findOne({ _id: req.query.reviewId })
      .populate('client') // Populate the 'client' field from the Review schema
      .populate('product') // Populate the 'product' field from the Review schema
    );
  } else {
    // Get all reviews and populate related data
    res.json(await Review.find()
      .populate('client') // Populate the 'client' field from the Review schema
      .populate('product') // Populate the 'product' field from the Review schema
    );
  }


  if (method === 'DELETE') {
    if (req.query?.reviewId) {
      try {
        await Review.deleteOne({ _id: req.query.reviewId });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete review" });
      }
    } else {
      res.status(400).json({ error: "Review ID is required for deletion" });
    }
  }

  // Other code for POST method and others...
}
