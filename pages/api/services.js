import {mongooseConnect} from "@/lib/mongoose";
import { Service } from "@/models/Service";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Service.findOne({_id:req.query.id}));
    } else {
      res.json(await Service.find());
    }
  }

  if (method === 'POST') {
    const {title, image, description} = req.body;
    const serviceDoc = await Service.create({
      title, image, description
    })
    res.json(serviceDoc);
  }

  if (method === 'PUT') {
    const {title, image, description, _id} = req.body;
    await Service.updateOne({_id}, {title, image, description});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?._id) {
      await Service.deleteOne({_id:req.query?._id});
      res.json(true);
    }
  }
}