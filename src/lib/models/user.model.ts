export interface Document {
  name?: string;
  url: string;
  uploadedAt: string;
}

type Address = {
  type?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode: number;
};

/**
 * User model @model of user how the data stored in DB
 */
export interface UserModel {
  id?: string;
  userId: string;
  username: string;
  dob: string;
  age?: number;
  gender: string;
  languages?: string[];
  document?: Document[];
  photo?: Document;
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}
