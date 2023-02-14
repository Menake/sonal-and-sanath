/* eslint-disable @typescript-eslint/no-misused-promises */
import type { FormEvent, ReactElement } from "react";
import { useEffect } from "react";
import { useState } from "react";
import AdminLayout from "../../../components/layouts/admin";
import { api } from "../../../utils/api";

export default function Create() {
  const [guests, setGuests] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [addressedTo, setAddressedTo] = useState("");

  const { data, isLoading } = api.events.all.useQuery();

  const { mutateAsync, error } = api.invitation.create.useMutation();

  if (isLoading)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  if (error) console.error(error);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      addressedTo,
      events,
      guests,
    };

    await mutateAsync(data);
  };

  return (
    <div className="mt-4 flex flex-col justify-center sm:w-1/2">
      <div className="pt-3 text-2xl text-[#8A9587]">Invite</div>
      <p className="text-italic font-thin text-gray-400">
        Invite your guests to events.
      </p>

      {error && <p>{error.message}</p>}

      <form onSubmit={submitForm} className="mt-8 flex w-full flex-1 flex-col">
        <label className="mt-3 text-[#8A9587] sm:flex sm:flex-col">
          Addressed To
          <input
            name="addressedTo"
            onChange={(e) => setAddressedTo(e.target.value)}
            defaultValue={addressedTo}
            className="mt-2 w-full rounded-md border bg-[#8A9587] bg-opacity-20 py-1.5 px-3 text-[#8A9587]"
          />
        </label>

        <div className="mt-8">
          <p className="text-[#8A9587]">Events</p>
          {data &&
            data.map((event) => (
              <div
                className="my-2 flex flex-row items-center justify-between rounded-md bg-[#8A9587] bg-opacity-10 px-2 py-3"
                key={event.id}
              >
                <label className="relative flex w-full flex-row items-center justify-between p-2 text-[#8A9587]">
                  {event.name}
                  <input
                    onChange={(e) => {
                      if (e.target.checked && !events.includes(event.id))
                        setEvents([...events, event.id]);

                      if (!e.target.checked)
                        setEvents(events.filter((evId) => evId !== event.id));
                    }}
                    name={``}
                    type="checkbox"
                    className="peer sr-only absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
                  />
                  <span className="flex h-6 w-11 items-center rounded-full bg-[#8A9587] opacity-40 duration-300 ease-in-out after:ml-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-md after:duration-300   peer-checked:opacity-100 peer-checked:after:translate-x-full sm:hover:cursor-pointer"></span>
                </label>
              </div>
            ))}
        </div>

        <div className="mt-8">
          <p className="text-[#8A9587]">Guests</p>
          {guests.map((guest, index) => (
            <GuestRow
              guest={guest}
              key={index}
              handleRemove={() => {
                const filtered = guests.filter((guest, i) => i !== index);
                console.log(filtered);
                setGuests(filtered);
              }}
              update={(updatedGuest) => {
                const newGuests = guests.map((guest, i) => {
                  if (i === index) return updatedGuest;
                  return guest;
                });

                setGuests(newGuests);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className="mt-4 flex flex-row items-center justify-center rounded bg-[#8A9587] bg-opacity-10 py-7 text-[#8A9587]"
          onClick={() => {
            setGuests([...guests, ""]);
          }}
        >
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
          Add Guest
        </button>

        <button
          className="mt-8 rounded bg-[#8A9587] py-2 text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const GuestRow = ({
  guest,
  handleRemove,
  update,
}: {
  guest: string;
  handleRemove: () => void;
  update: (name: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(!guest);
  const [name, setName] = useState(guest);

  useEffect(() => setName(guest), [guest]);

  if (isEditing)
    return (
      <div className="my-4 flex flex-row items-center">
        <input
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border bg-[#8A9587] bg-opacity-20 py-1.5 px-3 text-[#8A9587]"
          type="text"
          defaultValue={name}
        />
        <div className="ml-3 flex flex-row justify-end">
          <button
            onClick={() => {
              update(name);
              setIsEditing(false);
            }}
            type="button"
            className="mr-2 aspect-square w-6 text-[#8A9587] sm:w-8"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="aspect-square w-6 text-[#8A9587] sm:w-8"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              />
            </svg>
          </button>
        </div>
      </div>
    );

  return (
    <div className="my-4 flex flex-row items-center ">
      <div className="flex aspect-square w-11 flex-col justify-center rounded-full bg-[#8A9587] text-center text-xs text-white">
        {guest
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")}
      </div>
      <div className="ml-8 flex flex-1 text-center text-base text-[#8A9587]">
        {name}
      </div>
      <div className="flex flex-row justify-end">
        <button
          onClick={() => setIsEditing(true)}
          type="button"
          className="mr-4 aspect-square w-6 text-[#8A9587] sm:w-6"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="aspect-square w-6 text-[#8A9587] sm:w-6"
        >
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
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
