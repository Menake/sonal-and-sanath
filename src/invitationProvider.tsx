/* eslint-disable @typescript-eslint/no-empty-function */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { RouterOutputs } from "./utils/api";
import { api } from "./utils/api";
import { Loader } from "./components/loader";
import { useSession } from "./SessionProvider";

type Invitation = RouterOutputs["invitation"]["get"];

export type InvitationContext = {
  invitation: Invitation & { id: string };
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
  const { data, isLoading } = api.invitation.get.useQuery();
  const { session } = useSession();

  if (isLoading) return <Loader />;

  if (!data)
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div>Something went wrong!</div>
        <div>Please log out and try again</div>
      </div>
    );

  return (
    <InvitationContext.Provider
      value={{
        invitation: {
          ...data,
          id: session.invitationId,
        },
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};
