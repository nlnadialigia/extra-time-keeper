"use server";

import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {calculateTotalHours, timeEntrySchema} from "@/lib/validations/timeEntry";
import {getServerSession} from "next-auth";
import {revalidatePath} from "next/cache";

export type TimeEntryType = "extra" | "compensation";

export async function createTimeEntry(data: {
  date: Date;
  activity: string;
  type: TimeEntryType;
  startTime: string;
  endTime: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Validar dados
  const validated = timeEntrySchema.parse({
    ...data,
    date: new Date(data.date),
  });

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Calcular total de horas
  const totalHours = calculateTotalHours(validated.startTime, validated.endTime);

  const newEntry = await prisma.timeEntry.create({
    data: {
      date: validated.date,
      activity: validated.activity,
      type: validated.type,
      startTime: validated.startTime,
      endTime: validated.endTime,
      totalHours,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");

  return {success: true, message: "Registro criado com sucesso!", entry: newEntry};
}

export async function updateTimeEntry(
  id: string,
  data: {
    date: Date;
    activity: string;
    type: TimeEntryType;
    startTime: string;
    endTime: string;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Validar dados
  const validated = timeEntrySchema.parse({
    ...data,
    date: new Date(data.date),
  });

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Verificar se o registro pertence ao usuário
  const existingEntry = await prisma.timeEntry.findUnique({
    where: {id},
  });

  if (!existingEntry || existingEntry.userId !== user.id) {
    throw new Error("Registro não encontrado ou não autorizado");
  }

  // Calcular total de horas
  const totalHours = calculateTotalHours(validated.startTime, validated.endTime);

  const updatedEntry = await prisma.timeEntry.update({
    where: {id},
    data: {
      date: validated.date,
      activity: validated.activity,
      type: validated.type,
      startTime: validated.startTime,
      endTime: validated.endTime,
      totalHours,
    },
  });

  revalidatePath("/dashboard");

  return {success: true, message: "Registro atualizado com sucesso!", entry: updatedEntry};
}

export async function deleteTimeEntry(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Verificar se o registro pertence ao usuário
  const existingEntry = await prisma.timeEntry.findUnique({
    where: {id},
  });

  if (!existingEntry || existingEntry.userId !== user.id) {
    throw new Error("Registro não encontrado ou não autorizado");
  }

  await prisma.timeEntry.delete({
    where: {id},
  });

  revalidatePath("/dashboard");

  return {success: true, message: "Registro excluído com sucesso!"};
}

export async function getTimeEntries() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user) return [];

  return await prisma.timeEntry.findMany({
    where: {userId: user.id},
    orderBy: {date: "desc"},
  });
}
