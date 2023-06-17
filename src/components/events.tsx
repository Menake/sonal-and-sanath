import Link from "next/link";
import type { ResponseStage } from "@prisma/client";
import { useInvitation } from "@/invitation-provider";

const getRsvpUrlFromResponseStage = (
  invitationId: string,
  stage: ResponseStage
) => {
  if (stage === "HINDU_CEREMONY") return `/rsvp/${invitationId}/ceremony`;

  if (stage === "RECEPTION") return `/rsvp/${invitationId}/reception`;

  if (stage === "RECEPTION_TRANSPORT")
    return `/rsvp/${invitationId}/reception/transport`;

  return `/rsvp/${invitationId}/ceremony`;
};

export const Events = () => {
  const invitation = useInvitation();

  const hinduCeremony = invitation.events.find(
    (e) => e.eventType === "HINDU_CEREMONY"
  );

  const reception = invitation.events.find(
    (e) => e.eventType === "PORUWA_AND_RECEPTION"
  );

  return (
    <div className="mb-16 flex w-full flex-col justify-between sm:justify-center ">
      {hinduCeremony && (
        <div className="mt-16 w-full border-l border-stone-100 pb-16 pl-5 text-white sm:w-1/2 sm:pl-10 lg:w-1/4">
          <div className="text-xl uppercase italic text-white sm:text-xl">
            {hinduCeremony.name}
          </div>
          <div className="mt-5 italic text-stone-100">
            {hinduCeremony.venue.name}
          </div>
          <div className="italic text-stone-100">
            {hinduCeremony.venue.address}
          </div>
          <div className="italic text-stone-100">
            <span>
              {hinduCeremony.date.toLocaleDateString("en-nz", {
                dateStyle: "long",
              })}
            </span>
            <span className="mx-2">-</span>
            <span>
              {hinduCeremony.date.toLocaleTimeString("en-nz", {
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      )}

      {reception && (
        <div className="mt-8 flex items-end justify-end">
          <div className="mt-16 w-3/4 border-r border-stone-100 pt-16 pr-5 text-white sm:w-1/2 sm:pr-10 lg:w-1/4">
            <div className="text-right text-xl uppercase  italic text-white sm:text-xl">
              {reception.name}
            </div>
            <div className="mt-5 text-right italic text-stone-100">
              {reception.venue.name}
            </div>
            <div className="text-right italic text-stone-100">
              {reception.venue.address}
            </div>
            <div className="text-right italic text-stone-100">
              <span>
                {reception.date.toLocaleDateString("en-nz", {
                  dateStyle: "long",
                })}
              </span>
              <span className="mx-2">-</span>
              <span>
                {reception.date.toLocaleTimeString("en-nz", {
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        className="ml-5 mt-16 text-xl"
        href={getRsvpUrlFromResponseStage(
          invitation.id,
          invitation.responseStage
        )}
      >
        RSVP
        <span className="ml-3">{`->  `}</span>
      </Link>
    </div>
  );
};
