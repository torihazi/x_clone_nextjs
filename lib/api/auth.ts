import { z } from "zod";
import { authApiClient } from "./auth-api-client";
import { AxiosResponse } from "axios";
import { User } from "@/type/user";
//
// 新規登録
//

export const SignUpSchema = z
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

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const signUp = async (data: SignUpSchemaType) => {
  const response: AxiosResponse<User> = await authApiClient.post(
    "/v1/users",
    data,
  );
  return response;
};

// export const useSignUp = ({data, config}: {data: SignUpSchemaType, config: SWRConfiguration}) => {
//   const key = ["signUp"];
//   const fetcher = () => signUpFetcher(data);
//   const swr = useSWRMutation(key, fetcher);
//   return swr;
// };
