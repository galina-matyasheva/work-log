import { TEXTS } from "constants/texts";
import { z } from "zod";

export const logSchema = z.object({
  date: z.string().min(1, TEXTS.validation.date.min),

  work_type: z
    .string()
    .min(1, TEXTS.validation.workType.min)
    .max(35, TEXTS.validation.workType.max),

  volume: z
    .string()
    .min(1, TEXTS.validation.volume.min)
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: TEXTS.validation.volume.decimal,
    })
    .refine((value) => Number(value) > 0, {
      message: TEXTS.validation.volume.positive,
    })
    .refine((value) => !isNaN(Number(value)), {
      message: TEXTS.validation.volume.message,
    })
    .refine((value) => Number(value) <= 9999999.99, {
      message: TEXTS.validation.volume.maxValue,
    }),

  unit: z.string().min(1, TEXTS.validation.unit.min),

  worker_name: z.string().min(1, TEXTS.validation.workerName.min),
});

export const editLogSchema = z.object({
  id: z.number(),

  work_type: z
    .string()
    .min(1, TEXTS.validation.workType.min)
    .max(35, TEXTS.validation.workType.max),

  volume: z
    .string()
    .min(1, TEXTS.validation.volume.min)
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: TEXTS.validation.volume.decimal,
    })
    .refine((value) => Number(value) > 0, {
      message: TEXTS.validation.volume.positive,
    })
    .refine((value) => !isNaN(Number(value)), {
      message: TEXTS.validation.volume.message,
    })
    .refine((value) => Number(value) <= 9999999.99, {
      message: TEXTS.validation.volume.maxValue,
    }),

  unit: z.string().min(1, TEXTS.validation.unit.min),

  worker_name: z.string().min(1, TEXTS.validation.workerName.min),
});

export type EditLogData = z.infer<typeof editLogSchema>;
