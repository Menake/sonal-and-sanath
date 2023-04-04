import { Status } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Loader } from "../../components/loader";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";

type Rsvp = RouterInputs["invitation"]["rsvp"];
type Event = RouterOutputs["invitation"]["getRsvp"][number];

const RsvpPage: NextPage = () => {
  const router = useRouter();

  const utils = api.useContext();
  const { data, isLoading } = api.invitation.getRsvp.useQuery();
  const { mutateAsync, isLoading: isSaving } =
    api.invitation.rsvp.useMutation();

  if (isLoading || isSaving)
    return (
      <div className="flex items-center justify-center">
        <Loader spinnerColour="bg-stone-100" />
      </div>
    );

  if (!data) return null;

  const handleSubmit = async (data: Rsvp) => {
    await mutateAsync(data);
    await utils.invitation.getRsvp.invalidate();

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
        <div className="w-full sm:w-3/4 lg:w-1/2">
          {props.data.events.map((event, eventIndex) => (
            <div
              className="mb-12 flex w-full flex-col text-stone-100"
              key={event.id}
            >
              <div className="px-5">
                <div className="border-bg-stone-100 mt-2 mb-8 w-full border-b text-stone-100" />
                <div className="my-8 text-center text-2xl uppercase italic sm:text-4xl">
                  {event.name}
                </div>
              </div>

              <div className="my-4">
                {event.guests.map((guest, guestIndex) => {
                  const eventGuest = fields.fields
                    .find((e) => e.id === event.id)
                    ?.guests.find((g) => g.id === guest.id);

                  return (
                    <div
                      key={guest.id}
                      className="mb-10 flex w-full flex-row items-center justify-between"
                    >
                      <div className="w-1/3 text-lg">{guest.name}</div>
                      <div className="flex w-3/5 flex-row items-center justify-end">
                        <label className="w-1/2 px-1">
                          <input
                            key={eventGuest?.id}
                            type="radio"
                            {...register(
                              `events.${eventIndex}.guests.${guestIndex}.status`
                            )}
                            value={Status.ATTENDING}
                            className="peer sr-only absolute h-0 w-0"
                          />
                          <div className="rounded-lg border border-stone-100 py-2 px-1 text-center text-sm uppercase peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                            Going
                          </div>
                        </label>
                        <label className="w-1/2 px-1">
                          <input
                            key={eventGuest?.id}
                            type="radio"
                            {...register(
                              `events.${eventIndex}.guests.${guestIndex}.status`
                            )}
                            value={Status.NOTATTENDING}
                            className="peer sr-only absolute h-0 w-0"
                          />
                          <div className="rounded-lg border border-stone-100 px-1 py-2 text-center text-sm uppercase peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                            Not Going
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              {event.transportAvailable && (
                <div>
                  <div className="text-justify italic">
                    There will be a bus available to and from {event.venue.name}
                    . The bus will depart from 277 Broadway to{" "}
                    {event.venue.name} at 4pm. It will leave {event.venue.name}{" "}
                    at 12pm and drop everyone off back at 277 Broadway. Please
                    indicate below those that would like to take the bus so we
                    can book a slot for you
                  </div>

                  <div className="mt-8 flex w-full flex-row flex-wrap">
                    {event.guests.map((guest, guestIndex) => {
                      const eventGuest = fields.fields
                        .find((e) => e.id === event.id)
                        ?.guests.find((g) => g.id === guest.id);

                      return (
                        <label className="w-1/2" key={guest.id}>
                          <input
                            key={eventGuest?.id}
                            {...register(
                              `events.${eventIndex}.guests.${guestIndex}.requiresTransport`
                            )}
                            type="checkbox"
                            className="peer hidden"
                          />
                          <div className="border-bg-stone-100 my-2 mx-2 w-[95%] rounded-lg border p-2 text-center text-sm peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                            {guest.name}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            className="mb-8 w-full rounded border p-2 uppercase text-stone-100"
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
