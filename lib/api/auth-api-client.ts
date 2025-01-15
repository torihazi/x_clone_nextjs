import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// 認証用Axiosインスタンス
export const authApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// レスポンスインターセプター
authApiClient.interceptors.response.use(
  (response) => {
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
