import type { RouterOutputs } from "../utils/api";

type Event = RouterOutputs["events"]["invited"][number];

export const Events = ({ events }: { events: Event[] }) => {
  const firstEvent = events[0];
  const secondEvent = events[1];

  return (
    <div className="mb-16 flex w-full flex-col justify-between sm:justify-center">
      {firstEvent && (
        <div className="mt-16 w-full border-l border-stone-100 pb-10 pl-5 text-white sm:pl-10">
          <div className="text-xl italic text-white sm:text-2xl">
            {firstEvent.name}
          </div>
          <div className="mt-5 italic text-stone-100 sm:text-lg">
            {firstEvent.venue.address}
          </div>
          <div className="italic text-stone-100 sm:text-lg">
            {firstEvent.date.toString()}
          </div>
        </div>
      )}

      {secondEvent && (
        <div className="flex items-end justify-end">
          <div className="mt-16 w-3/5 border-r border-stone-100 pt-10 pr-5 text-white sm:pr-10">
            <div className="text-right text-xl italic text-white sm:text-4xl">
              {secondEvent.name}
            </div>
            <div className="mt-5 text-right italic text-stone-100 sm:text-lg">
              {secondEvent.venue.address}
            </div>
            <div className="text-right italic text-stone-100 sm:text-lg">
              {secondEvent.date.toString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
