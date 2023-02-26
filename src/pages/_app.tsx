import { api } from "../utils/api";

import "../styles/globals.css";
import { Navbar } from "../components/navbar";

import { Baskervville } from "@next/font/google";

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { SessionProvider } from "../SessionProvider";

const baskervville = Baskervville({
  subsets: ["latin"],
  variable: "--font-baskervville",
  weight: "400",
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ??
    ((page) => {
      return (
        <main
          className={`min-w-screen flex h-full min-h-screen flex-1 flex-col items-center justify-center bg-[#8A9587] px-5 ${baskervville.variable}`}
        >
          <Navbar />
          <div className="z-10 flex w-full flex-1 pt-3">{page}</div>
        </main>
      );
    });

  const layout = getLayout(<Component {...pageProps} />);

  return <SessionProvider>{layout}</SessionProvider>;
};

export default api.withTRPC(App);
