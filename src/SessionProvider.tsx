/* eslint-disable @typescript-eslint/no-empty-function */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

export type SessionContext = {
  session: {
    invitationId: string;
    addressedTo: string;
  };
  setSession: (session: Session) => Promise<void>;
  clearSession: () => Promise<void>;
};

export type Session = {
  invitationId: string;
  addressedTo: string;
};

const defaultSession = {
  invitationId: "",
  addressedTo: "",
};

const SessionContext = createContext<SessionContext>({
  session: defaultSession,
  setSession: async () => {},
  clearSession: async () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isFetched } = useQuery(["session"], () => {
    const sessionString = localStorage.getItem("session");

    if (!sessionString) return null;

    const session = JSON.parse(sessionString || "{}") as Session;
    return {
      session,
    };
  });

  const setSession = async (session: Session) => {
    localStorage.setItem("session", JSON.stringify(session));
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
        session: data?.session || defaultSession,
        setSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
