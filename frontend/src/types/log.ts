export type LogItem = {
  id: number;
  date: string;
  work_type: string;
  volume: number;
  unit: string;
  worker_name: string;
};

export type LogFormData = {
  date: string;
  work_type: string;
  volume: string;
  unit: string;
  worker_name: string;
};

export type UpdateLogData = Omit<LogItem, "id" | "date">;
