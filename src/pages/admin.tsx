import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { api } from "../utils/api";

import { Arimo } from "@next/font/google";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
});

type Guest = {
  id: number;
  name?: string;
};

export default function Admin() {
  const { data, isLoading } = api.events.all.useQuery();
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: 1,
      name: "John Smith",
    },
    {
      id: 2,
      name: "Jane Doe",
    },
  ]);

  if (isLoading)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    console.log(form);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="pt-3 text-2xl text-[#8A9587]">Invite</div>
      <p className="text-italic font-thin text-gray-400">
        Invite your guests to events.
      </p>

      <form onSubmit={submitForm} className="mt-8 flex w-full flex-1 flex-col">
        <div className="mt-3 text-[#8A9587]">Addressed To</div>
        <input
          name="addressedTo"
          className="mt-2 w-full rounded-md border bg-[#8A9587] bg-opacity-20 py-1.5 px-3 text-[#8A9587] sm:w-64"
        />

        <div className="mt-8">
          <p className="text-[#8A9587]">Events</p>
          {data &&
            data.map((event) => (
              <div
                className="my-2 flex flex-row justify-between rounded-md bg-[#8A9587] bg-opacity-10 px-2 py-3"
                key={event.id}
              >
                <span className="ml-2 text-base text-[#8A9587]">
                  {event.name}
                </span>
                <label className="relative flex cursor-pointer items-center">
                  <input type="checkbox" id="toggle" className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-[#8A9587] opacity-40 before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5 before:rounded-full before:border before:border-gray-300 before:bg-white before:shadow-sm before:transition-all before:duration-300  peer-checked:opacity-100 peer-checked:before:translate-x-full peer-checked:before:border-white" />
                </label>
              </div>
            ))}
        </div>

        <div className="mt-8">
          <p className="text-[#8A9587]">Guests</p>
          {guests.map((guest) => (
            <div className="my-4 flex flex-row items-center" key={guest.id}>
              <div className="flex aspect-square w-11 flex-col justify-center rounded-full bg-[#8A9587] text-center text-xs text-white">
                {guest.name
                  ?.split(" ")
                  .map((word) => word.charAt(0))
                  .join("")}
              </div>
              <div className="ml-8 flex flex-1 text-center text-base text-[#8A9587]">
                {guest.name}
              </div>
              <div className="flex flex-row justify-end">
                <button className="mr-4 aspect-square w-4 text-[#8A9587]">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                  </svg>
                </button>
                <button className="aspect-square w-4 text-[#8A9587]">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-4 flex flex-row items-center justify-center rounded bg-[#8A9587] bg-opacity-10 py-7 text-[#8A9587] sm:w-64"
          onClick={() => {
            const latestId = guests.reduce(
              (a, b) => Math.max(a, b.id),
              -Infinity
            );

            setGuests([...guests, { id: latestId + 1 }]);
          }}
        >
          <div className="mr-2">
            <svg
              width={32}
              height={32}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              />
            </svg>
          </div>
          Add Guest
        </button>

        <button
          className="mt-8 rounded bg-[#8A9587] py-2 text-white sm:w-64"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

Admin.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="flex h-screen w-screen flex-col px-5 pt-3">
      <div className="z-2 flex flex-row text-2xl font-light text-[#646B61]">
        <span>Sonal</span>
        <div className="relative z-0 mt-2 -ml-0.5 text-3xl font-light opacity-40">
          &
        </div>
        <div className="-ml-0.5 mt-5">Sanath</div>
      </div>
      <div className={` ${arimo.variable} font-arimo`}>{page}</div>
    </div>
  );
};
