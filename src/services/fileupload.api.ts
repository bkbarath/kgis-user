import axios, { type AxiosProgressEvent } from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/file-upload`;

const fileUpload = {
  uploadFile: async (
    file: File,
    folderPath: string,
    isImage: boolean,
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", file); // file object from input
    formData.append("folderName", folderPath); // other form fields

    try {
      const { data } = await axios.post(
        `${API_URL}/upload/${isImage}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress, // progress callback
        }
      );

      return data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  },
};

export default fileUpload;
