import type { MediaType } from "../../pages/UserForm";

export type FieldListType = React.InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
> & {
  label?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  component?: "input" | "select" | "textarea" | "file";
};

export type FieldType = {
  title?: string;
  field?: string;
  multiple?: boolean;
  fields: FieldListType[];
};

export type OptionItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type TableHeader = {
  field: string;
  headerName: string;
  flex?: number;
  headerAlign?: string;
  valueAlign?: string;
  isComponent?: boolean;
};

// file upload type
export type FileUploadType = {
  [key: string]: {
    currentlyUploaded: number;
    percentage: number;
    file: File;
    media: MediaType;
  };
};

// type for handle alert message
export type AlertType = {
  open: boolean;
  message: string;
  status: "success" | "danger" | "info" | "warning";
  formClose?: boolean;
};