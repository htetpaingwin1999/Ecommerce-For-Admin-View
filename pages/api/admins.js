import { Admin } from "@/models/Admin"; // Import the Admin model
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    try {
      const { email } = req.query;

      if (email) {
        const admin = await Admin.findOne({ email });
        if (admin) {
          res.json(admin);
        } else {
          res.status(404).json({ error: "Admin not found." });
        }
      } else {
        const admins = await Admin.find();
        res.json(admins);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch admins." });
    }
  }

  if (method === "POST") {
    try {
      const { email, isBlock } = req.body;

      const adminDoc = await Admin.create({
        email,
        isBlock,
      });

      res.json(adminDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create admin." });
    }
  }

  if (method === "PUT") {
    try {
      const { _id, email, isBlock } = req.body;

      await Admin.updateOne(
        { _id },
        {
          email,
          isBlock,
        }
      );

      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update admin." });
    }
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.body;

      await Admin.deleteOne({ _id });

      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete admin." });
    }
  }


  res.status(405).end(); // Method Not Allowed
}
