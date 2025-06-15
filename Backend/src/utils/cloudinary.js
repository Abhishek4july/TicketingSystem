import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import path from 'path'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath){
            return null
        }
        const ext = path.extname(localFilePath).toLowerCase();

    // Decide resource_type based on file extension
    let resourceType = "auto";
    if ([".pdf", ".doc", ".docx", ".zip", ".txt"].includes(ext)) {
      resourceType = "raw";
    } else if ([".mp4", ".webm", ".mov"].includes(ext)) {
      resourceType = "video";
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
      type: "upload", 
      folder: "attachments", 
      access_mode: "public",
    });
    console.log("Cloudinary upload response:", response);

        console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error(" Cloudinary Upload Error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    }
    return null
}

export {uploadOnCloudinary}