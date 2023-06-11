import Link from "next/link";
import { useRouter } from "next/router";
import type { RouterOutputs } from "../utils/api";
import { ResponseStage } from "@prisma/client";

type Event = RouterOutputs["events"]["invited"][number];

const getRsvpUrlFromResponseStage = (
  invitationId: string,
  stage: ResponseStage
) => {
  if (stage === "NORESPONSE" || stage === "HINDU_CEREMONY")
    return `/rsvp/${invitationId}/ceremony`;

  if (stage === "RECEPTION") return `/rsvp/${invitationId}/reception`;

  if (stage === "RECEPTION_TRANSPORT")
    return `/rsvp/${invitationId}/reception/transport`;

  return `/rsvp/${invitationId}/ceremony`;
};

export const Events = ({
  events,
  responseStage,
  invitationId,
}: {
  events: Event[];
  responseStage: ResponseStage;
  invitationId: string;
}) => {
  const firstEvent = events[0];
  const secondEvent = events[1];

  const router = useRouter();

  return (
    <div className="mb-16 flex w-full flex-col justify-between sm:justify-center ">
      {firstEvent && (
        <div className="mt-16 w-full border-l border-stone-100 pb-16 pl-5 text-white sm:w-1/2 sm:pl-10 lg:w-1/4">
          <div className="text-xl uppercase italic text-white sm:text-xl">
            {firstEvent.name}
          </div>
          <div className="mt-5 italic text-stone-100">
            {firstEvent.venue.name}
          </div>
          <div className="italic text-stone-100">
            {firstEvent.venue.address}
          </div>
          <div className="italic text-stone-100">
            <span>
              {firstEvent.date.toLocaleDateString("en-nz", {
                dateStyle: "long",
              })}
            </span>
            <span className="mx-2">-</span>
            <span>
              {firstEvent.date.toLocaleTimeString("en-nz", {
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      )}

      {secondEvent && (
        <div className="mt-8 flex items-end justify-end">
          <div className="mt-16 w-3/4 border-r border-stone-100 pt-16 pr-5 text-white sm:w-1/2 sm:pr-10 lg:w-1/4">
            <div className="text-right text-xl uppercase  italic text-white sm:text-xl">
              {secondEvent.name}
            </div>
            <div className="mt-5 text-right italic text-stone-100">
              {secondEvent.venue.name}
            </div>
            <div className="text-right italic text-stone-100">
              {secondEvent.venue.address}
            </div>
            <div className="text-right italic text-stone-100">
              <span>
                {secondEvent.date.toLocaleDateString("en-nz", {
                  dateStyle: "long",
                })}
              </span>
              <span className="mx-2">-</span>
              <span>
                {secondEvent.date.toLocaleTimeString("en-nz", {
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        className="mt-16 w-full rounded border border-stone-100 py-2 px-5 italic text-stone-100"
        onClick={() => void router.push(`rsvp/${invitationId}/ceremony`)}
      >
        RSVP
      </button>

      <Link href={getRsvpUrlFromResponseStage(invitationId, responseStage)}>
        RSVP
      </Link>
    </div>
  );
};
