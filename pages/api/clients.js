import { Client } from "@/models/Client";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.email) {
      const { name, email } = await Client.findOne({ email: req.query.email }, "name email");
      res.json({ name, email });
    } else {
      res.json(await Client.find());
    }
  }

}
