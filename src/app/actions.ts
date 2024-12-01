"use server";

import { typeToFlattenedError, z } from "zod";

const USERNAME_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 10;

const PASSWORD_REGEX = /^(?=.*\d).{10,}$/;

const logInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email("Please enter a valid email address.")
    .refine((email) => email.includes("@zod.com"), "Only @zod.com email addresses are allowed."),

  username: z
    .string({
      invalid_type_error: "Username must be a string.",
      required_error: "Username is required.",
    })
    .trim()
    .min(USERNAME_MIN_LENGTH, `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .trim()
    .min(PASSWORD_MIN_LENGTH, `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`)
    .regex(PASSWORD_REGEX, "Password should contain at least one number (0-9)."),
});

interface FormState {
  isSuccess: boolean;
  error: typeToFlattenedError<{ email: string; username: string; password: string }, string> | null;
}

export async function handleForm(_: unknown, formData: FormData): Promise<FormState> {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = logInSchema.safeParse(data);
  if (result.success) {
    return {
      error: null,
      isSuccess: true,
    };
  }
  return {
    error: result.error?.flatten(),
    isSuccess: false,
  };
}
