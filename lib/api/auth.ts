import { z } from "zod";
import { authApiClient } from "./auth-api-client";
import { AxiosResponse } from "axios";
import { User } from "@/type/user";
//
// 新規登録
//

export const SignUpFormSchema = z
  .object({
    email: z.string().email("不適なメールアドレスです"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    password_confirmation: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードと確認用パスワードが一致しません",
    path: ["password_confirmation"],
  });

export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export const signUp = async (data: SignUpForm) => {
  const response: AxiosResponse<User> = await authApiClient.post(
    "/v1/users",
    data,
  );
  return response;
};

//
// ログイン
//

export const SignInSchema = z.object({
  email: z.string().email("不適なメールアドレスです"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const signIn = async (data: SignInSchemaType) => {
  const response: AxiosResponse<User> = await authApiClient.post(
    "/v1/users/sign_in",
    data,
  );
  return response;
};
