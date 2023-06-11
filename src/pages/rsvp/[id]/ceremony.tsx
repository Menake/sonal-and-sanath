import { EventType, Status } from "@prisma/client";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Loader } from "../../../components/loader";
import type { RouterInputs, RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

import { Button } from "@/components/ui/button";
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

type EventRsvp = RouterOutputs["rsvp"]["get"];
type RsvpResponse = RouterInputs["rsvp"]["update"];

const HinduCeremonyRsvp: NextPage = () => {
  const { data, isLoading } = api.rsvp.get.useQuery(EventType.HINDU_CEREMONY);

  const utils = api.useContext();
  const router = useRouter();

  const hasMultipleRsvps = data && data.hasMultipleRsvps;

  const invitationId = router.query.id as string;

  const { mutateAsync } = api.rsvp.update.useMutation();

  const handleSubmit = async (data: RsvpResponse) => {
    await mutateAsync({
      guests: data.guests,
      eventType: "HINDU_CEREMONY",
    });

    await utils.rsvp.get.invalidate();

    if (hasMultipleRsvps) {
      void router.push(`/rsvp/${invitationId}/reception`);
    }
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

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="w-full space-y-8 text-stone-100"
      >
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
                      className="flex w-full flex-col space-y-1"
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

        {props.rsvp?.hasMultipleRsvps ? (
          <div>
            <Button variant="outline" type="submit" className="w-full">
              Next
            </Button>
            <div className="mt-5 w-full text-center">Page 1 of 3</div>
          </div>
        ) : (
          <Button variant="outline" type="submit" className="w-full">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default HinduCeremonyRsvp;
