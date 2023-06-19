/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";
import AdminLayout from "../../components/layouts/admin";
import { Loader } from "../../components/loader";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Invitation = RouterOutputs["invitation"]["all"]["invitations"][number];

const InvitationList = ({ invitations }: { invitations: Invitation[] }) => {
  const router = useRouter();

  if (!invitations.length)
    return (
      <p className="text-center font-thin text-[#8A9587]">No Invitations</p>
    );

  return (
    <>
      {invitations.map((invitation) => (
        <div
          onClick={() => router.push(`/admin/invitation/${invitation.id}`)}
          key={invitation.id}
          className="mt-4 flex flex-col justify-center rounded bg-[#8A9587] bg-opacity-20 p-3"
        >
          <div className="flex flex-row justify-between text-sm font-thin text-[#8A9587]">
            <p>Addressed To</p>
            <p className="opacity-80">{invitation.addressedTo}</p>
          </div>
          <div className="mt-4 flex flex-row items-center justify-between text-sm font-thin text-[#8A9587] ">
            <p className="flex-1">Events</p>
            <p className="w-3/4 text-right opacity-80">
              {invitation.events.map((event) => event.name).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [eventFilters, setEventFilters] = useState<Set<string>>(new Set());

  const router = useRouter();

  const { data, isLoading } = api.invitation.all.useQuery(undefined, {
    select: (data) => {
      let invitations =
        eventFilters.size === 0
          ? data.invitations
          : data.invitations.filter((invitation) =>
              invitation.events.some((event) => eventFilters.has(event.id))
            );

      if (search) {
        invitations = invitations.filter(
          (invitation) =>
            invitation.addressedTo
              .toUpperCase()
              .includes(search.toUpperCase()) ||
            invitation.guests.some((guest) =>
              guest.name.toUpperCase().includes(search.toUpperCase())
            )
        );
      }

      return {
        ...data,
        invitations,
      };
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row items-center justify-between">
        <input
          className="w-4/5 rounded bg-[#8A9587] bg-opacity-20 px-3 py-2 font-thin text-[#8A9587] text-opacity-80 placeholder-[#8A9587] placeholder-opacity-80 focus:outline-[#8A9587]"
          type="text"
          placeholder="Search for invites"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="aspect-square h-9 rounded bg-[#8A9587] text-center text-white"
          onClick={() => router.push("/admin/invitation/create")}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </button>
      </div>

      <label className="mt-4 text-[#8A9587]">Filter by Event</label>
      <div className="mt-2 mb-8 flex w-full flex-row sm:w-auto">
        {data?.events.map((event, index) => (
          <button
            className={`rounded bg-[#8A9587] p-4 text-center text-sm font-light ${
              index === 0 ? "" : "ml-3"
            } ${
              eventFilters.has(event.id)
                ? "text-white"
                : "bg-opacity-20 text-[#8A9587] text-opacity-80"
            }`}
            key={event.id}
            onClick={() => {
              const newFilterSet = new Set(eventFilters);

              if (newFilterSet.has(event.id)) {
                newFilterSet.delete(event.id);
              } else {
                newFilterSet.add(event.id);
              }

              setEventFilters(newFilterSet);
            }}
          >
            {event.name}
          </button>
        ))}
      </div>
      {data && <InvitationList invitations={data.invitations} />}
    </div>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <div className="sm:w-1/2">
        <div className="mt-4 pt-3 text-2xl text-[#8A9587]">Invitations</div>
        <p className="text-italic mb-6 font-thin text-gray-400">
          View all your invitations
        </p>
        {page}
      </div>
    </AdminLayout>
  );
};
