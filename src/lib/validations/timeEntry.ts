import {z} from "zod";

export const timeEntrySchema = z.object({
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  activity: z
    .string()
    .min(3, "Atividade deve ter no mínimo 3 caracteres")
    .max(200, "Atividade deve ter no máximo 200 caracteres"),
  type: z.enum(["extra", "compensation"], {
    required_error: "Tipo é obrigatório",
  }),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
}).refine(
  (data) => {
    // Validar que endTime > startTime
    const [startHour, startMin] = data.startTime.split(":").map(Number);
    const [endHour, endMin] = data.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes > startMinutes;
  },
  {
    message: "Horário de término deve ser maior que o de início",
    path: ["endTime"],
  }
);

export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

// Helper para calcular total de horas
export function calculateTotalHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Handle overnight shifts (end time is next day)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours
  }

  const totalMinutes = endMinutes - startMinutes;
  return totalMinutes / 60;
}
