import Link from "next/link";
import type { Invitation } from "@/invitation-provider";
import { useInvitation } from "@/invitation-provider";
import { ArrowRight } from "lucide-react";
import { api } from "@/utils/api";

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
  const { data, isLoading } = api.rsvp.transport.useQuery();

  const poruwaEvent = invitation.events.find(
    (event) => event.eventType === "PORUWA_AND_RECEPTION"
  );
  console.log(data);

  return (
    <div className="flex w-full flex-col justify-between italic sm:justify-center">
      {poruwaEvent && (
        <div className="my-8 w-full border-l border-stone-100 pt-3 pb-8 pl-5 text-white sm:pl-10">
          <div className="text-xl uppercase text-white sm:text-2xl">
            {poruwaEvent.name}
          </div>
          <div className="mt-5 ">{poruwaEvent.venue.name}</div>
          <div>
            {poruwaEvent.date.toLocaleDateString("en-nz", {
              day: "numeric",
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div>{poruwaEvent.time}</div>

          <div>{poruwaEvent.dressCode}</div>
        </div>
      )}
      {data && data.numberOfSeats > 0 ? (
        <div className="mx-5 mb-10 mt-2 italic">
          <span>
            You have indicated that you want to take one of the available buses
            to Markovina Valley Estate. The timetable is below, please be on
            time as a courtesy to other guests.
          </span>
          <div className="mt-8 text-lg">To Markovina (arriving at 4pm)</div>
          <ul className="mt-1 px-5">
            <li>Leaving Pakuranga at 3:00pm</li>
            <li>Leaving Newmarket at 3:30pm</li>
          </ul>
          <div className="mt-6 text-lg">From Markovina (leaving at 12pm)</div>
          <ul className="mt-1 px-5">
            <li>Arriving at Newmarket</li>
            <li>Arriving at Pakuranga</li>
          </ul>
        </div>
      ) : (
        <div className="mx-5 mt-2 italic">
          <span>
            You have indicated that you will not be needing the provided bus
            service. Parking is available on site at Markovina Valley Estate,
            please drive safely and we can't wait to celebrate with you
          </span>
        </div>
      )}
    </div>
  );
};
