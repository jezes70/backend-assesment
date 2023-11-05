const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary");
const CloudName = String(process.env.cloudinary_cloud_name);
const APIKey = String(process.env.cloudinary_api_key);
const APISecret = String(process.env.cloudinary_api_secret);

cloudinary.config({
  cloud_name: CloudName,
  api_key: APIKey,
  api_secret: APISecret,
});

const uploadFile = async (fileUrl, publicId, fileType) => {
  try {
    let uploadOptions = { public_id: publicId };

    if (fileType === "image") {
      uploadOptions = { ...uploadOptions, resource_type: "image" };
    } else if (fileType === "video") {
      uploadOptions = { ...uploadOptions, resource_type: "video" };
    } else if (fileType === "file") {
      uploadOptions = { ...uploadOptions, resource_type: "raw" };
    }

    const result = await cloudinary.uploader.upload(fileUrl, uploadOptions);
    return result;
  } catch (err) {
    throw err;
  }
};
