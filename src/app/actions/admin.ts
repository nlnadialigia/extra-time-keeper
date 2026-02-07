"use server";

import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {getServerSession} from "next-auth";
import {revalidatePath} from "next/cache";

export async function approveTimeEntry(entryId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Acesso negado - apenas administradores");
  }

  await prisma.timeEntry.update({
    where: {id: entryId},
    data: {status: "APPROVED"}
  });

  revalidatePath("/admin");
  return {success: true, message: "Registro aprovado com sucesso!"};
}

export async function rejectTimeEntry(entryId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Acesso negado - apenas administradores");
  }

  await prisma.timeEntry.update({
    where: {id: entryId},
    data: {status: "REJECTED"}
  });

  revalidatePath("/admin");
  return {success: true, message: "Registro rejeitado!"};
}

export async function promoteUserToAdmin(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Acesso negado - apenas administradores");
  }

  await prisma.user.update({
    where: {id: userId},
    data: {role: "ADMIN"}
  });

  revalidatePath("/admin");
  return {success: true, message: "Usuário promovido a administrador!"};
}
