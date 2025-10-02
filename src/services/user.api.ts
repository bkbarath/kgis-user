import axios from "axios";
import type { UserModel } from "../lib/models/user.model";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

const userService = {
  getUsers: async () => {
    const { data } = await axios.get(`${API_URL}/all`);
    return data;
  },
  createUser: async (user: UserModel) => {
    const res = await axios.post(`${API_URL}/add`, user);
    return res.data;
  },
  deleteUser: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
  },
  getUserById: async (id: string) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  updateUserById: async (id: string, user: UserModel) => {
    const res = await axios.put(`${API_URL}/${id}`, user);
    return res.data;
  },
};

export default userService;
