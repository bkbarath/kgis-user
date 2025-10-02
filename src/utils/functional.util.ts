import { useEffect, type SetStateAction } from "react";
import type { FileUploadType } from "../lib/types/common.type";
import type { MediaType } from "../pages/UserForm";
import fileUpload from "../services/fileupload.api";

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const getDateBasedOnYear = (yearsAgo: number): Date => {
  const today = new Date();
  const newDate = new Date(
    today.getFullYear() - yearsAgo,
    today.getMonth(),
    today.getDate()
  );
  return newDate;
};

// function to convert kb into MB or GB
export const convertKbToMB = (value: number): string => {
  const byte = value / 1024;
  const megaByte = byte / 1024;
  const gigaByte = megaByte / 1024;
  if (byte >= 1024) {
    return `${megaByte.toFixed(2)}mb`;
  }
  if (megaByte >= 1024) {
    return `${gigaByte.toFixed(2)}gb`;
  }
  return `${byte.toFixed(2)}kb`;
};

// function to return image to File
export const blobUrlToFile = async (
  blobUrl: string,
  filename: string
): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export const uploadFileWithPercentage = async (
  item: MediaType,
  file: File,
  path: string,
  setFileUploadProgress: React.Dispatch<SetStateAction<FileUploadType | null>>,
  isImage: boolean = false
) => {
  const uploadedLink = await fileUpload.uploadFile(
    file,
    path,
    isImage,
    (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      const currentUploadingFile = {
        currentlyUploaded: progressEvent.loaded,
        percentage: percentCompleted,
        file,
        media: item,
      };
      setFileUploadProgress((prev) => ({
        ...prev,
        [item.name]: currentUploadingFile,
      }));
    }
  );

  return uploadedLink;
};

export const getCurrentDateYYYYMMDD = () =>
  new Date().toISOString().split("T")[0];

export const getCurrentDateTime = (): string => {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const usePreventUnload = (shouldPrevent: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPrevent]);
};
