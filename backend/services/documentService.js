// backend/services/documentService.js
// Handles file uploads to Cloudinary and returns stored URL & public_id

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary configuration – expects env vars CLD_CLOUD_NAME, CLD_API_KEY, CLD_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLD_CLOUD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
  secure: true
});

/**
 * uploadFile(filePath, folder)
 *   filePath: local temporary file path (from multer)
 *   folder: Cloudinary folder name, e.g., "adoption_documents"
 * Returns: { url, public_id }
 */
async function uploadFile(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    // Clean up local temporary file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
}

module.exports = { uploadFile };
