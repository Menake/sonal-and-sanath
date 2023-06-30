import { useState, type ReactElement } from "react";
import AdminLayout from "../../../components/layouts/admin";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

type InvitationRsvp = RouterOutputs["admin"]["rsvps"][number];

const RsvpList = ({
  invitationRsvps,
}: {
  invitationRsvps: InvitationRsvp[];
}) => {
  if (!invitationRsvps.length)
    return <p className="text-center font-thin text-[#8A9587]">No Rsvps</p>;

  return (
    <div className="space-y-10">
      {invitationRsvps.map((invitation) => (
        <div
          className="w-full rounded border bg-[#8A9587] bg-opacity-10 py-4 px-2 text-[#8A9587] sm:px-10"
          key={invitation.id}
        >
          <p className="text-md">{invitation.addressedTo}</p>
          <div className="flex flex-col justify-between text-sm">
            {invitation.rsvps.map((rsvp) => (
              <div className="w-full" key={rsvp.id}>
                <p className="mt-3 mb-1 italic">{rsvp.event.name}</p>
                {rsvp.guests.map((guest) => (
                  <div
                    className="flex flex-row items-center justify-between sm:space-x-10"
                    key={guest.guest.name}
                  >
                    <div>{guest.guest.name}</div>
                    <div className="text-xs">{guest.status}</div>
                  </div>
                ))}
                {rsvp.event.eventType === "PORUWA_AND_RECEPTION" &&
                  rsvp.transportSeats > 0 && (
                    <div className="my-3 w-full">
                      <div className="mb-1 italic">Bus</div>
                      <div className="flex w-full flex-row justify-between">
                        <label>Number of Seats</label>
                        <p>{rsvp.transportSeats}</p>
                      </div>
                      <div className="flex w-full flex-row justify-between">
                        <label>Bus Pick Up Location</label>
                        <p>{rsvp.transportPickupLocation}</p>
                      </div>
                      <div className="flex w-full flex-row justify-between">
                        <label>Bus Drop Off Location</label>
                        <p>{rsvp.transportDropOffLocation}</p>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Rsvps() {
  const [search, setSearch] = useState("");
  const [responseFilters, setResponseFilters] = useState<Set<string>>(
    new Set()
  );
  const { data, isLoading } = api.admin.rsvps.useQuery(undefined, {
    select: (data) => {
      let invitations =
        responseFilters.size === 0
          ? data
          : data.filter((invitation) =>
              invitation.rsvps.some((rsvp) =>
                rsvp.guests.some((guest) => responseFilters.has(guest.status))
              )
            );

      if (search) {
        invitations = invitations.filter(
          (invitation) =>
            invitation.addressedTo
              .toUpperCase()
              .includes(search.toUpperCase()) ||
            invitation.rsvps
              .flatMap((rsvp) => rsvp.guests)
              .some((guestRsvp) =>
                guestRsvp.guest.name
                  .toUpperCase()
                  .includes(search.toUpperCase())
              )
        );
      }

      return invitations;
    },
  });

  return (
    <div className="w-full flex-col">
      <div className="mb-5 flex w-full flex-row items-center justify-between">
        <input
          className="w-4/5 rounded bg-[#8A9587] bg-opacity-20 px-3 py-2 font-thin text-[#8A9587] text-opacity-80 placeholder-[#8A9587] placeholder-opacity-80 focus:outline-[#8A9587]"
          type="text"
          placeholder="Search for invites"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <label className="text-[#8A9587]">Filter by Response</label>
      <div className="mt-2 mb-8 flex w-full flex-row sm:w-auto">
        {["ATTENDING", "NOTATTENDING", "NORESPONSE"].map((response, index) => (
          <button
            className={`rounded bg-[#8A9587] p-4 text-center text-sm font-light ${
              index === 0 ? "" : "ml-3"
            } ${
              responseFilters.has(response)
                ? "text-white"
                : "bg-opacity-20 text-[#8A9587] text-opacity-80"
            }`}
            key={response}
            onClick={() => {
              const newFilterSet = new Set(responseFilters);

              if (newFilterSet.has(response)) {
                newFilterSet.delete(response);
              } else {
                newFilterSet.add(response);
              }

              setResponseFilters(newFilterSet);
            }}
          >
            {response}
          </button>
        ))}
      </div>
      {data && <RsvpList invitationRsvps={data} />}
    </div>
  );
}

Rsvps.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <div className="mb-8 sm:w-1/2">
        <div className="mt-4 pt-3 text-2xl text-[#8A9587]">Rsvps</div>
        <p className="text-italic mb-6 font-thin text-gray-400">
          View all the rsvps
        </p>
        {page}
      </div>
    </AdminLayout>
  );
};
