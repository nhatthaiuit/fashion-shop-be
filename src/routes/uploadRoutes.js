import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // req.file.path contains the URL to the image on Cloudinary
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

export default router;
