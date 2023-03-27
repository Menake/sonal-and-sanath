import { Status } from "@prisma/client";
import { inferRouterInputs } from "@trpc/server";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Loader } from "../../components/loader";
import { api, RouterInputs, RouterOutputs } from "../../utils/api";

type Rsvp = RouterInputs["invitation"]["rsvp"];
type Guest = RouterOutputs["invitation"]["getForEvent"]["guests"][number];

const RsvpPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = api.invitation.getForEvent.useQuery(id as string);
  const { mutate } = api.invitation.rsvp.useMutation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );

  if (!data) return null;

  const defaultData: Rsvp = {
    guests: data.guests.map((guest) => ({
      guestId: guest.id,
      status: guest.status,
    })),
    eventId: id as string,
    transport: [],
  };

  return (
    <div className="flex w-full items-center justify-center text-stone-100">
      <div className="md-w1/2 sm:w-3/4">
        <div className="mt-12 mb-2 text-2xl sm:text-4xl">{data.name}</div>
        <div className="mb-4 text-sm italic">
          {data.venue?.name} {data.venue?.address}
        </div>
        <div className="italic">Date: {data.date?.toDateString()}</div>
        <div className="italic">Time: {data.date?.toTimeString()}</div>
        <div className="italic">Attire: {data.dressCode}</div>

        <div className="mt-8">
          <RsvpForm
            data={defaultData}
            guests={data.guests}
            onSubmit={(data) => {
              console.log(data);
              // mutate({ ...data });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const RsvpForm = (props: {
  data: Rsvp;
  guests: Guest[];
  onSubmit: (data: Rsvp) => void;
}) => {
  const methods = useForm({
    defaultValues: props.data,
  });

  const { control, handleSubmit, register } = methods;
  const { fields } = useFieldArray({
    control,
    name: "guests",
  });

  const { fields: transportFields } = useFieldArray({
    control,
    name: "transport",
  });

  return (
    <FormProvider {...methods}>
      <form
        className="flex h-full flex-1 flex-col"
        onSubmit={handleSubmit(props.onSubmit)}
      >
        <div className="mt-8 text-lg ">Attendance</div>
        <div className="mb-8 text-sm italic">
          Please indicate a response for each guest below
        </div>
        {props.guests.map((guest, index) => {
          const guestStatus = fields.find((g) => g.guestId === guest.id);

          return (
            <div
              key={guest.id}
              className="flex w-full flex-row items-center justify-between"
            >
              {guest.name}
              <div className="flex w-1/2 flex-row justify-end">
                <label className="relative mr-4 flex w-1/2 flex-row items-center justify-center rounded-lg border border-stone-100 peer-checked:bg-stone-100">
                  Yes
                  <input
                    key={guestStatus?.guestId}
                    value={Status.ATTENDING}
                    type="radio"
                    {...register(`guests.${index}.status`)}
                    className="peer sr-only absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
                  />
                </label>
                <label className="relative flex w-1/2 flex-row items-center justify-center rounded-lg border border-stone-100">
                  No
                  <input
                    key={guestStatus?.guestId}
                    value={Status.NOTATTENDING}
                    type="radio"
                    {...register(`guests.${index}.status`)}
                    className="peer sr-only absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
                  />
                </label>
              </div>
            </div>
          );
        })}

        <hr className="my-16" />
        <div className="text-lg ">Transport</div>
        <div className="mb-8 mt-6 text-sm italic">
          Sonal & Sanath with try to arrange transport to and from the venues.
          Please indicate below the guests who require transport. If you have
          your own transport please still provide a response below
        </div>
        {props.guests.map((guest, index) => {
          const guestTransport = transportFields.find(
            (g) => g.guestId === guest.id
          );

          return (
            <div
              key={guest.id}
              className="flex w-full flex-row items-center justify-between"
            >
              {guest.name}
              <div className="flex w-1/2 flex-row justify-end">
                <label className="relative mr-4 flex w-1/2 flex-row items-center justify-center rounded-lg border border-stone-100 peer-checked:bg-stone-100">
                  Yes
                  <input
                    key={guestTransport?.guestId}
                    value={JSON.stringify(true)}
                    type="radio"
                    {...register(`transport.${index}.requiresTransport`)}
                    className="peer sr-only absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
                  />
                </label>
                <label className="relative flex w-1/2 flex-row items-center justify-center rounded-lg border border-stone-100">
                  No
                  <input
                    key={guestTransport?.guestId}
                    value={JSON.stringify(false)}
                    type="radio"
                    {...register(`transport.${index}.requiresTransport`)}
                    className="peer sr-only absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
                  />
                </label>
              </div>
            </div>
          );
        })}

        <button className="mt-16 mb-8 w-full rounded border p-2" type="submit">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default RsvpPage;
