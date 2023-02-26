/* eslint-disable @typescript-eslint/no-empty-function */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

export type Session = {
  sessionId?: string;
  setSession: (session: string) => Promise<void>;
  clearSession: () => Promise<void>;
};

const SessionContext = createContext<Session>({
  setSession: async () => {},
  clearSession: async () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isFetched } = useQuery(["session"], () => {
    const session = localStorage.getItem("session");
    return {
      session,
    };
  });

  const setSession = async (session: string) => {
    localStorage.setItem("session", session);
    await queryClient.invalidateQueries({ queryKey: ["session"] });
  };

  const clearSession = async () => {
    localStorage.removeItem("session");
    await queryClient.invalidateQueries({ queryKey: ["sesion"] });
  };

  if (isFetched) {
    if (data?.session && router.pathname === "/login") void router.push("/");

    if (!data?.session && router.pathname !== "/login")
      void router.push("/login");
  }

  return (
    <SessionContext.Provider
      value={{
        setSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
