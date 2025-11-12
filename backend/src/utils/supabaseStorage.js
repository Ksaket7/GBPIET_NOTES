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

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - Full path of file in Supabase (e.g. 'files/filename.png')
 * @param {string} bucketName - Supabase bucket name (default: 'uploads')
 */
const deleteFromSupabase = async (filePath, bucketName = "uploads") => {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      console.error("Error deleting from Supabase:", error.message);
      return null;
    }
    return true;
  } catch (error) {
    console.error("Deletion failed:", error.message);
    return null;
  }
};

export { uploadOnSupabase, deleteFromSupabase };
