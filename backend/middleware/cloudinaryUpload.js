const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folderName = "event_uploads";
    const ext = path.extname(file.originalname); // e.g. .pdf, .jpg
    const baseName = path.basename(file.originalname, ext); // without extension
    return {
      folder: folderName,
      resource_type: file.mimetype.startsWith("application/") ? "raw" : "image",
      public_id: `${Date.now()}-${baseName}${ext}`,
      type: "upload",
    };
  },
});

const uploadToCloudinary = multer({ storage });

module.exports = uploadToCloudinary;
