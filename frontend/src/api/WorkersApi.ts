import { checkResponse } from "api/client";
import { Worker } from "types/worker";

const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = `${API_URL}/workers`;

export const WorkersApi = {
  getAll: async (): Promise<Worker[]> => {
    const res = await fetch(BASE_URL);
    await checkResponse(res);
    return res.json();
  },
};
