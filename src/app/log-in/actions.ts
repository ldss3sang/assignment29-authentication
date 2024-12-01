"use server";

import bcrypt from "bcrypt";
import db from "@/utils/db";
import { typeToFlattenedError, z } from "zod";
import getSession from "@/utils/session";
import { redirect } from "next/navigation";

const PASSWORD_REGEX = /^(?=.*\d).{10,}$/;

const checkEmailExists = async (email: string): Promise<boolean> => {
  const user =await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return Boolean(user);
}

const logInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email("Please enter a valid email address.")
    .refine(checkEmailExists, "An account with this email doesn't not exist."),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .trim(),
});

interface FormState {
  isSuccess: boolean;
  error: typeToFlattenedError<{ email: string; password: string }, string> | null;
}

export async function logIn(_: unknown, formData: FormData): Promise<FormState> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await logInSchema.spa(data);
  if (!result.success) {
    return {
      error: result.error?.flatten(),
      isSuccess: false,
    };
  }
  
  const user = await db.user.findUnique({
    where: { email: result.data.email },
    select: { id: true, password: true }
  });

  if (!user || !(await bcrypt.compare(result.data.password, user.password))) {
    return {
      error: {
        formErrors: [],
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      },
      isSuccess: false,
    }
  }

  const session = await getSession();
  session.id = user.id;
  await session.save();
  redirect("/profile");
}
