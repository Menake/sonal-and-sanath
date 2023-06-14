import { EventType, Status } from "@prisma/client";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Loader } from "../../../../components/loader";
import type { RouterInputs, RouterOutputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";
import { RsvpFooter } from "@/components/rsvp-footer";

type EventRsvp = RouterOutputs["rsvp"]["get"];
type RsvpResponse = RouterInputs["rsvp"]["update"];

const ReceptionRsvp: NextPage = () => {
  const { data, isLoading } = api.rsvp.get.useQuery(
    EventType.PORUWA_AND_RECEPTION
  );

  const utils = api.useContext();
  const router = useRouter();

  const invitationId = router.query.id as string;

  const { mutateAsync } = api.rsvp.update.useMutation();

  const handleSubmit = async (data: RsvpResponse) => {
    await mutateAsync({
      guests: data.guests,
      eventType: "PORUWA_AND_RECEPTION",
    });
    await utils.rsvp.get.invalidate();
    void router.push(`/rsvp/${invitationId}/reception/transport`);
  };

  if (isLoading) return <Loader />;

  return <RsvpForm rsvp={data} onSubmit={handleSubmit} />;
};

const RsvpForm = (props: {
  rsvp: EventRsvp;
  onSubmit: (data: RsvpResponse) => Promise<void>;
}) => {
  const form = useForm<RsvpResponse>({
    defaultValues: {
      guests: props.rsvp?.guests,
    },
  });

  if (!props.rsvp) return null;

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="flex w-full flex-1 flex-col justify-evenly text-stone-100"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="mt-2 text-center text-xl uppercase">
            {props.rsvp.event.name}
          </h1>
          <Separator className="my-5 w-3/4 sm:w-1/2" />
          <div className="text-center text-xl italic">
            <div>{props.rsvp.event.venue}</div>
            <div className="space-y-0 text-center text-lg italic">
              <span>
                {props.rsvp.event.date.toLocaleDateString("en-nz", {
                  dateStyle: "long",
                })}
              </span>
              <span className="ml-2">
                {props.rsvp.event.date.toLocaleTimeString("en-nz", {
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="my-16 space-y-8">
          <div className="text-center italic">
            Please select the attendance for each guest
          </div>

          {props.rsvp?.guests.map((guest, index) => (
            <div key={guest.id}>
              <FormField
                control={form.control}
                name={`guests.${index}.id`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" placeholder="shadcn" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`guests.${index}.status`}
                render={({ field }) => (
                  <FormItem className="mt-5 w-full text-stone-100">
                    <FormLabel className="my-5 text-lg">{guest.name}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex w-full flex-row space-y-1"
                      >
                        <FormItem className="flex w-full items-center space-x-3 space-y-0">
                          <FormLabel>Attending</FormLabel>
                          <FormControl>
                            <RadioGroupItem value={Status.ATTENDING} />
                          </FormControl>
                        </FormItem>
                        <FormItem className="flex w-full items-center space-x-3 space-y-0">
                          <FormLabel>Not Attending</FormLabel>
                          <FormControl>
                            <RadioGroupItem value={Status.NOTATTENDING} />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-1" />

        <div className="mb-10">
          <RsvpFooter pageType="RECEPTION" />
        </div>
      </form>
    </Form>
  );
};

export default ReceptionRsvp;
