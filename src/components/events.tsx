import { useInvitation } from "@/invitation-provider";
import { api } from "@/utils/api";

export const Events = () => {
  const invitation = useInvitation();
  const { data } = api.rsvp.transport.useQuery();

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
            You have indicated that you would like to take one of the available
            buses to Markovina Valley Estate. The timetable is below, please be
            on time as a courtesy to other guests. We look forward to
            celebrating with you!
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
            please drive safely and we look forward to celebrating with you!
          </span>
        </div>
      )}
    </div>
  );
};
