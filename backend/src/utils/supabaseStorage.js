import supabase from "./supabase.js";
import mime from "mime-types";

const uploadOnSupabase = async (
  fileBuffer,
  fileName,
  folder = "files",
  bucketName = "uploads"
) => {
  try {
    if (!fileBuffer || !fileName) {
      console.error("Invalid file data");
      return null;
    }

    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const contentType = mime.lookup(fileName) || "application/octet-stream";

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        contentType,
        upsert: false, // safer in production
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error.message);
    return null;
  }
};
const deleteFromSupabase = async (filePath, bucketName = "uploads") => {
  try {
    if (!filePath) {
      console.error("No file path provided for deletion");
      return null;
    }

    // Extract only path after bucket URL if full URL is passed
    const urlParts = filePath.split(`${bucketName}/`);
    const cleanPath = urlParts[1];

    if (!cleanPath) {
      console.error("Invalid file path format");
      return null;
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([cleanPath]);

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
