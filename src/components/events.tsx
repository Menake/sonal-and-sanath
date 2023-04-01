import Link from "next/link";
import { useRouter } from "next/router";
import type { RouterOutputs } from "../utils/api";

type Event = RouterOutputs["events"]["invited"][number];

export const Events = ({
  events,
  invitationId,
}: {
  events: Event[];
  invitationId: string;
}) => {
  const firstEvent = events[0];
  const secondEvent = events[1];

  const router = useRouter();

  return (
    <div className="mb-16 flex w-full flex-col justify-between sm:justify-center ">
      {firstEvent && (
        <div className="mt-16 w-full border-l border-stone-100 pl-5 text-white sm:w-1/2 sm:pl-10 lg:w-1/4">
          <div className="text-lg italic text-white sm:text-xl">
            {firstEvent.name}
          </div>
          <div className="mt-5 italic text-stone-100 opacity-75">
            {firstEvent.venue.address}
          </div>
          <div className="italic text-stone-100 opacity-75">
            {firstEvent.date.toString()}
          </div>
        </div>
      )}

      {secondEvent && (
        <div className="mt-8 flex items-end justify-end">
          <div className="mt-16 w-full border-r border-stone-100 pr-5 text-white sm:w-1/2 sm:pr-10 lg:w-1/4">
            <div className="text-right text-lg italic text-white sm:text-xl">
              {secondEvent.name}
            </div>
            <div className="mt-5 text-right italic text-stone-100 opacity-75">
              {secondEvent.venue.address}
            </div>
            <div className="text-right italic text-stone-100 opacity-75">
              {secondEvent.date.toString()}
            </div>
          </div>
        </div>
      )}

      <button
        className="mt-16 w-full rounded border border-stone-100 py-2 px-5 italic text-stone-100"
        onClick={() => void router.push(`rsvp/${invitationId}`)}
      >
        RSVP
      </button>
    </div>
  );
};
