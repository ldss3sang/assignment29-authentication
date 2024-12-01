"use server";

import db from "@/utils/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

const USERNAME_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 10;

const PASSWORD_REGEX = /^(?=.*\d).{10,}$/;

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}): boolean => password === confirm_password;

const createAccountSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Please enter a valid email address.")
      .refine(
        (email) => email.includes("@zod.com"),
        "Only @zod.com email addresses are allowed."
      ),

    username: z
      .string({
        invalid_type_error: "Username must be a string.",
        required_error: "Username is required.",
      })
      .trim()
      .min(
        USERNAME_MIN_LENGTH,
        `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`
      ),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .trim()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`
      )
      .regex(
        PASSWORD_REGEX,
        "Password should contain at least one number (0-9)."
      ),
    confirm_password: z
      .string({
        required_error: "Confirm password is required.",
      })
      .trim()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`
      ),
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });

interface FormState {
  isSuccess: boolean;
  error: typeToFlattenedError<
    {
      email: string;
      username: string;
      password: string;
      confirm_password: string;
    },
    string
  > | null;
}

export async function createAccount(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await createAccountSchema.spa(data);
  if (!result.success) {
    return {
      error: result.error?.flatten(),
      isSuccess: false,
    };
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      email: result.data.email,
      username: result.data.username,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  redirect("/log-in");
}
