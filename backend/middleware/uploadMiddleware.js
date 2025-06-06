import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';
import multer from 'multer';

// Configure Cloudinary (make sure this is in your config/cloudinary.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Stream-based upload processor
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'eestate_properties',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
        chunk_size: 6 * 1024 * 1024,
        timeout: 120000
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream
    const bufferStream = new PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

// File validation
const fileFilter = (req, file, cb) => {
  const validMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ];
  
  if (!validMimes.includes(file.mimetype)) {
    return cb(new Error(`Unsupported file type. Allowed: ${validMimes.join(', ')}`), false);
  }
  cb(null, true);
};

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
    files: 5 // Max 5 files
  },
  fileFilter
});

// Cloudinary service check
const checkCloudinaryHealth = async () => {
  try {
    await cloudinary.api.ping();
    return true;
  } catch (error) {
    console.error('Cloudinary health check failed:', error);
    return false;
  }
};

export { upload, uploadToCloudinary, checkCloudinaryHealth };