import { checkResponse } from "api/client";
import { LogFormData, LogItem, UpdateLogData } from "types/log";

const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = `${API_URL}/log`;

export const LogApi = {
  getAll: async (): Promise<LogItem[]> => {
    const res = await fetch(BASE_URL);
    await checkResponse(res);
    return res.json();
  },

  create: async (data: LogFormData): Promise<void> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await checkResponse(res);
  },

  remove: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    await checkResponse(res);
  },

  update: async (id: number, data: UpdateLogData): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await checkResponse(res);
  },
};
