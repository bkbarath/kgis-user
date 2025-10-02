import { getDateBasedOnYear } from "../../utils/functional.util";
import type { FieldType, TableHeader } from "../types/common.type";

export const UserFormFields: FieldType[] = [
  {
    field: "personalDetail",
    title: "Personal Detail",
    fields: [
      {
        name: "username",
        placeholder: "Enter User Name",
        label: "Username",
        component: "input",
        required: true,
      },
      {
        name: "dob",
        type: "date",
        label: "Date of Birth",
        component: "input",
        max: getDateBasedOnYear(18).toISOString().split("T")[0],
        min: getDateBasedOnYear(50).toISOString().split("T")[0],
        required: true,
      },
      {
        name: "age",
        type: "number",
        placeholder: "Your Age",
        disabled: true,
        label: "Age",
        component: "input",
      },
      {
        name: "gender",
        label: "Gender",
        component: "select",
        options: [
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
        ],
        required: true,
      },
    ],
  },
  {
    field: "officialDetail",
    title: "Official Detail",
    fields: [
      {
        name: "languages",
        label: "Known Languages",
        component: "select",
        multiple: true,
        options: [
          // --- Official Indian Languages (22) ---
          { label: "Assamese", value: "Assamese" },
          { label: "Bengali", value: "Bengali" },
          { label: "Bodo", value: "Bodo" },
          { label: "Dogri", value: "Dogri" },
          { label: "Gujarati", value: "Gujarati" },
          { label: "Hindi", value: "Hindi" },
          { label: "Kannada", value: "Kannada" },
          { label: "Kashmiri", value: "Kashmiri" },
          { label: "Konkani", value: "Konkani" },
          { label: "Maithili", value: "Maithili" },
          { label: "Malayalam", value: "Malayalam" },
          { label: "Manipuri", value: "Manipuri" },
          { label: "Marathi", value: "Marathi" },
          { label: "Nepali", value: "Nepali" },
          { label: "Odia", value: "Odia" },
          { label: "Punjabi", value: "Punjabi" },
          { label: "Sanskrit", value: "Sanskrit" },
          { label: "Santali", value: "Santali" },
          { label: "Sindhi", value: "Sindhi" },
          { label: "Tamil", value: "Tamil" },
          { label: "Telugu", value: "Telugu" },
          { label: "Urdu", value: "Urdu" },

          // --- Popular International Languages ---
          { label: "English", value: "English" },
          { label: "Spanish", value: "Spanish" },
          { label: "French", value: "French" },
          { label: "German", value: "German" },
          { label: "Portuguese", value: "Portuguese" },
          { label: "Italian", value: "Italian" },
          { label: "Russian", value: "Russian" },
          { label: "Chinese (Mandarin)", value: "Chinese" },
          { label: "Japanese", value: "Japanese" },
          { label: "Korean", value: "Korean" },
          { label: "Arabic", value: "Arabic" },
          { label: "Turkish", value: "Turkish" },
          { label: "Persian (Farsi)", value: "Persian" },
          { label: "Swahili", value: "Swahili" },
          { label: "Dutch", value: "Dutch" },
        ],
      },
      {
        name: "document",
        type: "file",
        label: "Official Document",
        component: "file",
        multiple: true,
        accept: ".pdf,.doc,.docx",
      },
      {
        name: "photo",
        type: "file",
        label: "Profile Picture",
        component: "file",
        accept: "image/*",
      },
    ],
  },
  {
    field: "addresses",
    title: "Address Detail",
    multiple: true,
    fields: [
      {
        name: "addressType",
        label: "Address Type",
        component: "select",
        options: [
          { label: "Permanent Address", value: "PERMANENT" },
          { label: "Current Address", value: "CURRENT" },
        ],
      },
      {
        name: "addressLine1",
        label: "Address Line 1",
        component: "textarea",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        component: "textarea",
      },
      {
        name: "country",
        label: "Country",
        component: "input",
      },
      {
        name: "state",
        label: "State",
        component: "input",
      },
      {
        name: "city",
        label: "City",
        component: "input",
      },
      {
        name: "pincode",
        label: "Pincode",
        component: "input",
        type: "number",
        maxLength: 6,
      },
    ],
  },
];

export const UserTableColumn: TableHeader[] = [
  {
    field: "id",
    headerName: "S No.",
  },
  {
    field: "userId",
    headerName: "User ID",
  },
  {
    field: "username",
    headerName: "Username",
  },
  {
    field: "age",
    headerName: "Age",
  },
  {
    field: "gender",
    headerName: "Gender",
  },
  {
    field: "languages",
    headerName: "Languages Known",
  },
  {
    field: "moreInfo",
    headerName: "More Info",
    isComponent: true,
  },
];
