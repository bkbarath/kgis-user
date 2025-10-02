import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { FileUploadType } from "../lib/types/common.type";

type FileUploadContextType = {
  fileUploadProgress: FileUploadType | null;
  setFileUploadProgress: React.Dispatch<SetStateAction<FileUploadType | null>>;
};

const FileUploadContext = createContext<FileUploadContextType | undefined>(
  undefined
);

type FileUploadContextProviderType = {
  children: ReactNode;
};

const FileUploadContextProvider: FC<FileUploadContextProviderType> = ({
  children,
}) => {
  const [fileUploadProgress, setFileUploadProgress] =
    useState<FileUploadType | null>(null);

  return (
    <FileUploadContext.Provider
      value={{ fileUploadProgress, setFileUploadProgress }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error(
      "useFileUploadContext must be used within a FileuploadProvider"
    );
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { FileUploadContextProvider, useFileUploadContext };
