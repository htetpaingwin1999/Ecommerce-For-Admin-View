import multer from 'multer';
import path from 'path';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'event-background-images')); // Change the destination folder
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    cb(null, newFilename);
  },
});

const upload = multer({ storage }).single('file'); // Change to single upload

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload file.' });
      }

      const link = `${req.headers.origin}/event-background-images/${req.file.filename}`;
      return res.json({ links: [{ link }] });

      resolve();
    });
  });
}
