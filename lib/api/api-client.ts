import axios, { AxiosError } from "axios";
import jsCookie from "js-cookie";
import { toast } from "react-toastify";

// Axiosインスタンス
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// リクエストインターセプター
apiClient.interceptors.request.use((config) => {
  const token = jsCookie.get("access-token");
  const client = jsCookie.get("client");
  const uid = jsCookie.get("uid");

  if (token && client && uid) {
    config.headers["access-token"] = token;
    config.headers["client"] = client;
    config.headers["uid"] = uid;
  }
  return config;
});

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    // devise-token-authはリクエストごとにトークンを更新するため、レスポンスヘッダーからトークンを取得
    const token = response.headers["access-token"];
    const client = response.headers["client"];
    const uid = response.headers["uid"];
    if (token && client && uid) {
      jsCookie.set("access-token", token);
      jsCookie.set("client", client);
      jsCookie.set("uid", uid);
    }

    return {
      ...response,
      data: response.data.data,
    };
  },
  (error: AxiosError<{ errors: { full_messages: string[] } }>) => {
    if (error.response) {
      toast.error(error.response?.data?.errors?.full_messages?.[0]);
    }

    return Promise.reject(error);
  },
);
