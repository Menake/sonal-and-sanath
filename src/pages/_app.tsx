import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Navbar } from "../components/navbar";

import { Baskervville } from "@next/font/google";

const baskervville = Baskervville({
  subsets: ["latin"],
  variable: "--font-baskervville",
  weight: "400",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <main
        className={`min-w-screen flex min-h-screen flex-col items-center justify-center bg-[#8A9587] px-5 ${baskervville.variable}`}
      >
        <Navbar />
        <div className="flex w-full flex-1 pt-3">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
