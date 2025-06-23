import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// File validation
const fileFilter = (req, file, cb) => {
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!validMimes.includes(file.mimetype)) {
    return cb(new Error(`Unsupported file type. Allowed: ${validMimes.join(', ')}`), false);
  }
  cb(null, true);
};

// Configure Multer for memory storage
const storage = multer.memoryStorage();

// Create chat-specific upload middleware
const chatUpload = (req, res, next) => {
  // Log incoming request headers and content-type
  console.log('chatUpload middleware - Incoming request:', {
    headers: req.headers,
    contentType: req.headers['content-type'],
  });

  // Check if request is multipart/form-data
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    console.log('No multipart/form-data, skipping multer');
    return next();
  }

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter,
  }).single('image');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      console.error('File validation error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    console.log('chatUpload middleware - Processed:', {
      body: req.body,
      file: req.file,
    });
    next();
  });
};

// Cloudinary upload function for chat images
export const uploadChatImage = (file) => {
  if (!file || !file.buffer) {
    console.log('uploadChatImage: No file provided');
    return Promise.resolve(null);
  }

  console.log('uploadChatImage: Uploading file', {
    originalname: file.originalname,
    size: file.size,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'eestate_chat',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
        timeout: 30000,
      },
      (error, result) => {
        if (error) {
          console.error('Chat image upload error:', error);
          reject(new Error('Failed to upload chat image'));
        } else {
          console.log('Chat image uploaded:', result.secure_url);
          resolve(result);
        }
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

export default chatUpload;