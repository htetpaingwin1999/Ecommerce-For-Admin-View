import { mongooseConnect } from "@/lib/mongoose";
import { Client } from "@/models/Client";

export default async function handler(req, res) {
    await mongooseConnect();
  
    if (req.method === 'GET') {
      try {
        // Find all clients with __v set to -1 (banned users)
        const bannedClients = await Client.find({ __v: -1 });
  
        res.json(bannedClients);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching banned users' });
      }
    }

    if (req.method === "PUT") {
      try {
        const { clientId, __v } = req.body; // Assuming you send the clientId in the request body
        // Find the client by ID and update the __v property to -1
        const updatedClient = await Client.findByIdAndUpdate(
          clientId,
          { __v: __v },
          { new: true } // To return the updated client after the update
        );
  
        if (!updatedClient) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        res.json(updatedClient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while blocking the client" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" }); // Handle other HTTP methods
    }
  }

  
  