import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export const config = {
  api: { bodyParser: false },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'product-images'));
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    cb(null, newFilename);
  },
});

const upload = multer({ storage }).single('file'); // Use `single` instead of `array'

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload file.' });
    }

    const previousImageFilename = req.body.previousImageFilename; // Assuming you pass the previous image filename in the request body

    const link = `${req.headers.origin}/product-images/${req.file.filename}`;

    if (previousImageFilename) {
      const previousImagePath = path.join(
        process.cwd(),
        'public',
        'product-images',
        previousImageFilename
      );
      fs.unlink(previousImagePath, (err) => {
        console.log(previousImagePath);
        if (err) {
          console.error(err);
        } else {
          console.log(`Deleted previous image: ${previousImagePath}`);
        }
      });
    }

    return res.json({ link });
  });
}
