import multer from 'multer';
import path from 'path';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export const config = {
  api: { bodyParser: false },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'paymentscreenshot-images'));
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    cb(null, newFilename);
  },
});

const upload = multer({ storage }).array('file');

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload files.' });
    }

    const links = req.files.map((file) => ({
      link: `${req.headers.origin}/paymentscreenshot-images/${file.filename}`,
    }));
    return res.json({ links });
  });
}
