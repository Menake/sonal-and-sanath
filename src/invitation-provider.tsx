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

type Invitation = RouterOutputs["invitation"]["get"];

export type InvitationContext = {
  invitation: Invitation & { id: string };
};

const defaultInvitation = {
  invitation: {
    id: "",
    events: [],
    responseStage: "NORESPONSE",
  },
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
        {children}
      </InvitationContext.Provider>
    );

  return (
    <AuthenticatedSessionProvider invitationId={session.invitationId}>
      {children}
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

  if (isLoading) return <Loader />;

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
