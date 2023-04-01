import { Status } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Loader } from "../../components/loader";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";

type Rsvp = RouterInputs["invitation"]["rsvp"];
type Event = RouterOutputs["invitation"]["getRsvp"][number];

const RsvpPage: NextPage = () => {
  const router = useRouter();

  const { data, isLoading } = api.invitation.getRsvp.useQuery();
  const { mutateAsync } = api.invitation.rsvp.useMutation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );

  if (!data) return null;

  const handleSubmit = async (data: Rsvp) => {
    await mutateAsync(data);
    void router.push("/");
  };

  return <RsvpForm data={{ events: data }} onSubmit={handleSubmit} />;
};

const RsvpForm = (props: {
  data: {
    events: Event[];
  };
  onSubmit: (data: Rsvp) => Promise<void>;
}) => {
  const rsvp = props.data.events.map((event) => {
    return {
      id: event.id,
      guests: event.guests.map((guest) => ({
        id: guest.id,
        status: guest.status,
        requiresTransport: guest.requiresTransport,
      })),
    };
  });

  const methods = useForm({
    defaultValues: {
      events: rsvp,
    },
  });

  const { control, handleSubmit, register } = methods;

  const fields = useFieldArray({ control, name: "events" });

  return (
    <FormProvider {...methods}>
      <form
        className="mt-4 flex h-full w-full flex-1 flex-col items-center justify-center"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <div className="sm:w-3/4 lg:w-1/2">
          {props.data.events.map((event, eventIndex) => (
            <div key={event.id}>
              <div className="mb-8 mt-3 flex w-full  flex-col text-stone-100">
                <div className="mb-2 text-2xl sm:text-4xl">{event.name}</div>
                <div className="text-sm italic">
                  {event.venue?.name} {event.venue?.address}
                </div>
                <div className="my-2 text-sm italic">
                  {event.date?.toLocaleDateString("en-NZ", {
                    dateStyle: "long",
                  })}
                  <span className="ml-2">
                    {event.date?.toLocaleTimeString("en-NZ", {
                      timeStyle: "long",
                    })}
                  </span>
                </div>
                <div className="text-sm italic">Attire: {event.dressCode}</div>

                <div className="my-4">
                  <div className="mt-8 text-sm italic">
                    Please indicate an attendance response for each guest below.
                    If you required transport please select the toggle
                  </div>
                  <div className="divider mt-2" />
                  {event.guests.map((guest, guestIndex) => {
                    const eventGuest = fields.fields
                      .find((e) => e.id === event.id)
                      ?.guests.find((g) => g.id === guest.id);

                    return (
                      <div
                        key={guest.id}
                        className="mb-10 flex w-full flex-col"
                      >
                        <div className="mb-3 text-lg">{guest.name}</div>
                        <div className="flex flex-row justify-between">
                          <div className="h-100 flex flex-col justify-between">
                            <label className="mb-4 text-sm">Attendance</label>
                            <div>
                              <label>
                                <input
                                  key={eventGuest?.id}
                                  type="radio"
                                  {...register(
                                    `events.${eventIndex}.guests.${guestIndex}.status`
                                  )}
                                  value={Status.ATTENDING}
                                  className="peer sr-only absolute h-0 w-0"
                                />
                                <span className="rounded rounded-r-none border border-stone-100 p-3 text-sm peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                                  Attending
                                </span>
                              </label>
                              <label>
                                <input
                                  key={eventGuest?.id}
                                  type="radio"
                                  {...register(
                                    `events.${eventIndex}.guests.${guestIndex}.status`
                                  )}
                                  value={Status.NOTATTENDING}
                                  className="peer sr-only absolute h-0 w-0"
                                />
                                <span className="rounded rounded-l-none border border-l-0 border-stone-100 p-3 text-sm peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                                  Not Attending
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="h-100 flex flex-col items-center justify-between">
                            <label className="mb-2 text-sm">Transport</label>

                            <label>
                              <input
                                type="checkbox"
                                {...register(
                                  `events.${eventIndex}.guests.${guestIndex}.requiresTransport`
                                )}
                                className="peer toggle toggle-lg sr-only absolute h-0 w-0 bg-opacity-20"
                              />
                              <span className="flex h-6 w-11 items-center rounded-full bg-stone-100 opacity-40 duration-300 ease-in-out after:ml-0.5 after:h-5 after:w-5 after:rounded-full after:bg-[#8A9587] after:shadow-md after:duration-300   peer-checked:opacity-100 peer-checked:after:translate-x-full sm:hover:cursor-pointer"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <button
            className="mt-8 mb-8 w-full rounded border p-2 text-stone-100"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RsvpPage;
