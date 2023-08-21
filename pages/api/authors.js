import {mongooseConnect} from "@/lib/mongoose";
import { Author } from "@/models/Author";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Author.findOne({_id:req.query.id}));
    } else {
      res.json(await Author.find());
    }
  }

  if (method === 'POST') {
    const {name} = req.body;
    const authorDoc = await Author.create({
      name
    })
    res.json(authorDoc);
  }

  if (method === 'PUT') {
    const {name,_id} = req.body;
    await Author.updateOne({_id}, {name});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Author.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}