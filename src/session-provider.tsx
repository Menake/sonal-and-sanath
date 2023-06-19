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

  const { data: session, isFetched } = useQuery(["session"], () => {
    const sessionString = localStorage.getItem("session");

    if (!sessionString) return undefined;

    return JSON.parse(sessionString) as Session;
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
    if (session?.invitationId && router.pathname === "/login")
      void router.push("/");

    if (!session?.invitationId && router.pathname !== "/login")
      void router.push("/login");
  }

  return (
    <SessionContext.Provider
      value={{
        session: session || defaultSession,
        setSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
