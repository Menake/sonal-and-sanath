import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Loader } from "../../../../components/loader";
import type { RouterInputs, RouterOutputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/router";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

type Event = RouterOutputs["rsvp"]["transport"];
type TransportResponse = RouterInputs["rsvp"]["updateTransport"];

const TransportPage: NextPage = () => {
  const { data, isLoading } = api.rsvp.transport.useQuery();

  const utils = api.useContext();
  const router = useRouter();

  const invitationId = router.query.id as string;

  const { mutateAsync } = api.rsvp.updateTransport.useMutation();

  const handleSubmit = async (data: TransportResponse) => {
    await mutateAsync(data);
    await utils.rsvp.transport.invalidate();
    void router.push(`/`);
  };

  if (isLoading) return <Loader />;

  if (!data) return null;

  return <TransportForm event={data} onSubmit={handleSubmit} />;
};

const TransportForm = (props: {
  event: Event;
  onSubmit: (data: TransportResponse) => Promise<void>;
}) => {
  const form = useForm<TransportResponse>({
    defaultValues: {
      numberOfSeats: props.event.numberOfSeats.toString(),
      pickupLocation: props.event.pickupLocation,
      dropOffLocation: props.event.dropOffLocation,
    },
  });

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="w-full space-y-8 text-stone-100"
      >
        <FormField
          control={form.control}
          name="numberOfSeats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number Of Seats</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the number of seats" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[...Array(props.event.numberOfGuests + 1).keys()].map(
                    (number) => (
                      <SelectItem key={number} value={number.toString()}>
                        {number}
                      </SelectItem>
                    )
                  )}
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pickupLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? "newmarket"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pickup location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Newmarket">
                    Newmarket - Pickup 15:30
                  </SelectItem>
                  <SelectItem value="Pakuranga">
                    Pakuranga - Pickup 16:00
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dropOffLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drop Off Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? "newmarket"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pickup location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Newmarket">
                    Newmarket - Pickup 15:30
                  </SelectItem>
                  <SelectItem value="Pakuranga">
                    Pakuranga - Pickup 16:00
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button variant="outline" type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default TransportPage;
