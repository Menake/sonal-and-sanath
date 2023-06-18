/* eslint-disable @typescript-eslint/no-empty-function */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { RouterOutputs } from "./utils/api";
import { api } from "./utils/api";
import { Loader } from "./components/loader";
import { useSession } from "./session-provider";

export type Invitation = RouterOutputs["invitation"]["get"] & { id: string };
export type InvitationEvent = Invitation["events"][number];

export type InvitationContext = {
  invitation: Invitation;
};

const InvitationContext = createContext<InvitationContext>({
  invitation: {
    id: "",
    events: [],
    responseStage: "NORESPONSE",
  },
});

export const useInvitation = () => useContext(InvitationContext).invitation;

export const InvitationProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();

  if (!session.invitationId)
    return (
      <InvitationContext.Provider
        value={{
          invitation: { id: "", events: [], responseStage: "NORESPONSE" },
        }}
      >
        <div className="z-10 flex w-full flex-1 pt-3">{children}</div>
      </InvitationContext.Provider>
    );

  return (
    <AuthenticatedSessionProvider invitationId={session.invitationId}>
      <div className="z-10 flex w-full flex-1 pt-3">{children}</div>
    </AuthenticatedSessionProvider>
  );
};

const AuthenticatedSessionProvider = ({
  children,
  invitationId,
}: {
  children: ReactNode;
  invitationId: string;
}) => {
  const { data, isLoading } = api.invitation.get.useQuery();

  if (isLoading)
    return (
      <div className="z-10 flex w-full flex-1 pt-3">
        <Loader spinnerColour="bg-stone-100" />
      </div>
    );

  if (!data) return null;

  return (
    <InvitationContext.Provider
      value={{
        invitation: {
          ...data,
          id: invitationId,
        },
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};
