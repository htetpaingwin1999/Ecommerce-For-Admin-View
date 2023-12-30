import {mongooseConnect} from "@/lib/mongoose";
import { Orders } from "../../models/Order";

export default async function handler(req,res) {
  await mongooseConnect();
  const { method } = req;
  if (method === 'GET') {
   
      res.json(await Orders.find()
        .sort({ createdAt: -1 }));
    
  }
}
  