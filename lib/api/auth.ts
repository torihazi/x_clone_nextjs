import { type AxiosResponse } from "axios";
import jsCookie from "js-cookie";
import { z } from "zod";

import { User } from "@/type/user";

import { authApiClient } from "./auth-api-client";
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
  try {
    const response: AxiosResponse<User> = await authApiClient.post(
      "/v1/users/sign_in",
      data,
    );

    // headerの設定
    const token = response.headers["access-token"];
    const client = response.headers["client"];
    const uid = response.headers["uid"];
    if (token && client && uid) {
      jsCookie.set("access-token", token);
      jsCookie.set("client", client);
      jsCookie.set("uid", uid);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
