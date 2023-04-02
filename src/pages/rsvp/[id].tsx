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
            <div key={event.id}>
              <div className="mb-16 mt-3 flex w-full  flex-col text-stone-100">
                <div className="mb-2 text-2xl sm:text-4xl">{event.name}</div>
                <div className="italic">{event.venue?.name}</div>

                <div className="my-4">
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
                            <label className="mb-2 text-right text-sm">
                              Requires Transport?
                            </label>
                            <div>
                              <Controller
                                control={control}
                                name={`events.${eventIndex}.guests.${guestIndex}.requiresTransport`}
                                render={(props) => {
                                  return (
                                    <label>
                                      <input
                                        name={props.field.name}
                                        value="true"
                                        type="radio"
                                        checked={props.field.value === true}
                                        onChange={(e) =>
                                          props.field.onChange(
                                            JSON.parse(e.target.value)
                                          )
                                        }
                                        className="peer sr-only absolute h-0 w-0"
                                      />
                                      <span className="rounded rounded-r-none border border-stone-100 py-3 px-4 text-sm peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                                        Yes
                                      </span>
                                    </label>
                                  );
                                }}
                              />
                              <Controller
                                control={control}
                                name={`events.${eventIndex}.guests.${guestIndex}.requiresTransport`}
                                render={(props) => {
                                  return (
                                    <label>
                                      <input
                                        name={props.field.name}
                                        value="false"
                                        type="radio"
                                        checked={props.field.value === false}
                                        onChange={(e) =>
                                          props.field.onChange(
                                            JSON.parse(e.target.value)
                                          )
                                        }
                                        className="peer sr-only absolute h-0 w-0"
                                      />
                                      <span className="rounded rounded-l-none border border-l-0 border-stone-100 py-3 px-4 text-sm peer-checked:bg-stone-100 peer-checked:text-[#8A9587]">
                                        No
                                      </span>
                                    </label>
                                  );
                                }}
                              />
                            </div>
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
            className="mb-8 w-full rounded border p-2 text-stone-100"
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
