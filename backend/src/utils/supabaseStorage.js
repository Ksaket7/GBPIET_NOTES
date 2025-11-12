import supabase from "./supabase.js";
import fs from "fs";
import mime from "mime-types";

const uploadOnSupabase = async (
  localFilePath,
  bucketName = "uploads",
  folder = "files"
) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File not found:", localFilePath);
      return null;
    }

    const fileName = localFilePath.split("\\").pop().split("/").pop();
    const fileBuffer = fs.readFileSync(localFilePath); // ✅ full binary buffer
    const contentType = mime.lookup(fileName) || "application/octet-stream";

    // ✅ upload with overwrite allowed (avoid conflict corruption)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folder}/${fileName}`, fileBuffer, {
        cacheControl: "3600",
        contentType,
        upsert: true, // 👈 allow overwrite safely
      });

    fs.unlinkSync(localFilePath);

    if (error) {
      console.error("Supabase upload error:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${folder}/${fileName}`);

    return `${publicUrlData.publicUrl}`;
  } catch (error) {
    console.error("Upload failed:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

// utils/supabase.utils.js
const deleteFromSupabase = async (filePath, bucketName = "uploads") => {
  try {
    // Ensure path is valid
    if (!filePath) {
      console.error("❌ No file path provided for deletion");
      return null;
    }

    // Remove any leading slashes to match Supabase storage keys
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

    console.log("🗑️ Deleting from Supabase:", `${bucketName}/${cleanPath}`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([cleanPath]);

    if (error) {
      console.error("Error deleting from Supabase:", error.message);
      return null;
    }

    console.log("✅ File deleted successfully from Supabase");
    return true;
  } catch (error) {
    console.error("Deletion failed:", error.message);
    return null;
  }
};


export { uploadOnSupabase, deleteFromSupabase };
