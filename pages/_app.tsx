import "@/styles/globals.css";
import { Provider } from "jotai";
import { ToastContainer } from "react-toastify";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider>
        <ToastContainer />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
