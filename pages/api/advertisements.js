import { Advertisement } from "@/models/Advertisement";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Advertisement.findOne({ _id: req.query.id }));
    } else {
      res.json(await Advertisement.find());
    }
  }

  if (method === "POST") {
    // res.json("hello testing 8:50")
    const { image_paths, start_date, end_date } = req.body; // Use 'image_paths' as an array
    const advertisementDoc = await Advertisement.create({
      image_paths, // Save the array of image paths
      start_date,
      end_date,
    });
    res.json(advertisementDoc);
  }

  if (method === "PUT") {
    const { image_paths, start_date, end_date, _id } = req.body; // Use 'image_paths' as an array
    await Advertisement.updateOne(
      { _id },
      { image_paths, start_date, end_date } // Update the 'image_paths' field
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Advertisement.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
