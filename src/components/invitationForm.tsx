/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import { FormProvider, useFormContext } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { Loader } from "./loader";

type Invitation = RouterInputs["invitation"]["create"];

export function InvitationForm({
  data,
  onSubmit,
  submitting,
}: {
  data: Invitation;
  onSubmit: (data: Invitation) => void;
  submitting: boolean;
}) {
  const router = useRouter();

  const { data: events, isLoading } = api.events.all.useQuery();

  const methods = useForm({
    defaultValues: data,
  });

  const { control, handleSubmit, register } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
    keyName: "name",
  });

  if (isLoading || submitting)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="mt-4 flex flex-col justify-center sm:w-1/2">
      <div className="pt-3 text-2xl text-[#8A9587]">Invite</div>
      <p className="text-italic font-thin text-gray-400">
        Invite your guests to events.
      </p>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex w-full flex-1 flex-col pb-8"
        >
          <label className="mt-3 text-[#8A9587]  sm:flex sm:flex-col">
            Addressed To
            <input
              defaultValue={data.addressedTo}
              {...register("addressedTo")}
              className="mt-2 w-full rounded-md border bg-[#8A9587] bg-opacity-20 py-1.5 px-3 text-[#8A9587] focus:outline-[#8A9587]"
            />
          </label>

          <div className="mt-8">
            <p className="text-[#8A9587]">Events</p>
            {events &&
              events.map((event) => (
                <div
                  className="my-2 flex flex-row items-center justify-between rounded-md bg-[#8A9587] bg-opacity-10 px-2 py-3"
                  key={event.id}
                >
                  <label className="relative flex w-full flex-row items-center justify-between p-2 text-[#8A9587]">
                    {event.name}
                    <input
                      value={event.id}
                      {...register("events")}
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
            {fields.map((guest, index) => (
              <GuestRow
                guest={guest}
                key={index}
                handleRemove={() => remove(index)}
                index={index}
              />
            ))}
          </div>

          <button
            type="button"
            className="mt-4 flex flex-row items-center justify-center rounded bg-[#8A9587] bg-opacity-10 py-7 text-[#8A9587]"
            onClick={() => {
              append({ name: "" });
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

          <button
            className="mt-2 rounded bg-[#8A9587] bg-opacity-10 py-2 text-[#8A9587]"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

const GuestRow = ({
  guest,
  handleRemove,
  index,
}: // update,
{
  guest: { name: string };
  handleRemove: () => void;
  index: number;
}) => {
  const { register } = useFormContext();

  return (
    <div className="my-4 flex flex-row items-center">
      <input
        className="mt-2 w-full rounded-md border bg-[#8A9587] bg-opacity-20 py-1.5 px-3 text-[#8A9587] focus:outline-[#8A9587]"
        type="text"
        defaultValue={guest.name}
        {...register(`guests.${index}.name`)}
      />
      <div className="ml-3 flex flex-row justify-end">
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
