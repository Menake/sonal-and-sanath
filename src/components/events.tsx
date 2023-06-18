import Link from "next/link";
import type { Invitation } from "@/invitation-provider";
import { useInvitation } from "@/invitation-provider";
import { ArrowRight } from "lucide-react";

const getRsvpUrlFromResponseStage = (invitation: Invitation) => {
  if (!invitation.id) return "";

  const firstEvent = invitation.events[0];

  if (invitation.responseStage === "NORESPONSE")
    return firstEvent?.eventType === "HINDU_CEREMONY"
      ? `/rsvp/${invitation.id}/ceremony`
      : `/rsvp/${invitation.id}/reception`;

  if (invitation.responseStage === "HINDU_CEREMONY")
    return invitation.events.length > 1
      ? `/rsvp/${invitation.id}/reception`
      : `/rsvp/${invitation.id}/ceremony`;

  if (invitation.responseStage === "RECEPTION")
    return `/rsvp/${invitation.id}/reception/transport`;

  return `/rsvp/${invitation.id}/reception/transport`;
};

export const Events = () => {
  const invitation = useInvitation();

  const firstEvent = invitation.events[0];
  const secondEvent = invitation.events[1];

  return (
    <div className="flex w-full flex-col justify-between italic sm:justify-center">
      {firstEvent && (
        <div className="my-20 w-full border-l border-stone-100 pb-16 pl-5 text-white sm:w-1/2 sm:pl-10">
          <div className="text-xl uppercase text-white sm:text-2xl">
            {firstEvent.name}
          </div>
          <div className="mt-5 ">{firstEvent.venue.name}</div>
          <div>
            {firstEvent.date.toLocaleDateString("en-nz", {
              day: "numeric",
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div>
            {firstEvent.date.toLocaleTimeString("en-nz", {
              timeStyle: "short",
            })}
          </div>

          <div>{firstEvent.dressCode}</div>
        </div>
      )}

      {secondEvent && (
        <div className="my-20 flex items-end justify-end text-right">
          <div className="mt-16 w-3/4 border-r border-stone-100 pt-16 pr-5 sm:w-1/2 sm:pr-10">
            <div className="text-xl uppercase sm:text-2xl">
              {secondEvent.name}
            </div>
            <div className="mt-5">{secondEvent.venue.name}</div>
            <div>
              {secondEvent.date.toLocaleDateString("en-nz", {
                day: "numeric",
                weekday: "long",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div>
              {secondEvent.date.toLocaleTimeString("en-nz", {
                timeStyle: "short",
              })}
            </div>

            <div>{secondEvent.dressCode}</div>
          </div>
        </div>
      )}

      <div
        className={`my-8 ml-5 flex flex-row  ${
          invitation.events.length > 1 ? "justify-start" : "justify-end"
        }`}
      >
        <Link
          className="flex flex-row text-xl sm:text-2xl"
          href={getRsvpUrlFromResponseStage(invitation)}
        >
          RSVP
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};
