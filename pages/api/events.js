import { mongooseConnect } from "@/lib/mongoose";
import { Event } from "@/models/Event";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      try {
        const event = await Event.findOne({ _id: req.query.id });
        res.json(event);
      } catch (error) {
        res.status(404).json({ error: "Event not found" });
      }
    } else {
      const events = await Event.find();
      res.json(events);
    }
  }

  if (method === 'POST') {
    const { name, image_path, background_image_path, onStatus, besideOrUp } = req.body;
    try {
      const eventDoc = await Event.create({
        name,
        image_path,
        background_image_path,
        onStatus,
        besideOrUp
      });
      res.json(eventDoc);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  }

  if (method === 'PUT') {
    const { name, image_path,background_image_path, onStatus, besideOrUp, _id } = req.body;
    try {
      const updatedFields = {};
      
      if (name !== undefined) {
        updatedFields.name = name;
      }
      
      if (image_path !== undefined) {
        updatedFields.image_path = image_path;
      }

      if (background_image_path !== undefined) {
        updatedFields.background_image_path = background_image_path;
      }
      
      if (onStatus !== undefined) {
        updatedFields.onStatus = onStatus;
      }
      
      if (besideOrUp !== undefined) {
        updatedFields.besideOrUp = besideOrUp;
      }
      
      res.json(updatedFields.onStatus+"-----------"+_id)
      
      await Event.updateOne({ _id }, updatedFields);
      
      res.json(true);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  }


  if (method === 'DELETE') {
    if (req.query?.id) {
      try {
        await Event.deleteOne({ _id: req.query.id });
        res.json(true);
      } catch (error) {
        res.status(500).json({ error: "Failed to delete event" });
      }
    }
  }
}
