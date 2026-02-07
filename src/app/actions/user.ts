"use server";

import {prisma} from "@/lib/db";
import {registerSchema} from "@/lib/validations/user";
import bcrypt from "bcryptjs";
import {z} from "zod";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    // Validar dados
    const validated = registerSchema.parse(data);

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: {email: validated.email},
    });

    if (existingUser) {
      return {
        success: false,
        error: "Este email já está cadastrado",
      };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Criar usuário
    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Cadastro realizado com sucesso! Você já pode fazer login.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    console.error("Erro ao registrar usuário:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao criar sua conta. Tente novamente.",
    };
  }
}
