import type { RsvpPage } from "@/components/rsvp-footer";
import { useInvitation } from "@/invitation-provider";
import { useRouter } from "next/router";

export const useRsvpNavigation = (page: RsvpPage) => {
  const invitation = useInvitation();
  const router = useRouter();

  const next = () => {
    if (page === "HINDU_CEREMONY" && invitation.events.length > 1)
      void router.push(`/rsvp/${invitation.id}/reception`);

    if (page === "RECEPTION")
      void router.push(`/rsvp/${invitation.id}/reception/transport`);

    void router.push("/");
  };

  const previous = () => {
    if (page === "RECEPTION" && invitation.events.length > 1)
      void router.push(`/rsvp/${invitation.id}/ceremony`);

    if (page === "TRANSPORT")
      void router.push(`/rsvp/${invitation.id}/reception`);
  };

  return { previous, next };
};
