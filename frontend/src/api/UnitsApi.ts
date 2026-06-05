import { checkResponse } from "api/client";
import { Unit } from "types/unit";

const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = `${API_URL}/units`;

export const UnitsApi = {
  getAll: async (): Promise<Unit[]> => {
    const res = await fetch(BASE_URL);
    await checkResponse(res);
    return res.json();
  },
};
