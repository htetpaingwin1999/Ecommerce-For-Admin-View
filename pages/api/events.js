import {mongooseConnect} from "@/lib/mongoose";
import { Event } from "@/models/Event";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Event.findOne({_id:req.query.id}));
    } else {
      res.json(await Event.find());
    }
  }

  if (method === 'POST') {
    const {name} = req.body;
    const EventDoc = await Event.create({
      title, image_link, event_status
    })
    res.json(EventDoc);
  }

  if (method === 'PUT') {
    const {name,_id} = req.body;
    await Event.updateOne({_id}, {title, image_link, event_status});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Event.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}