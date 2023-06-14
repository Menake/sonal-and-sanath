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
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

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

  const [showLocations, setShowLocations] = useState(
    props.event.numberOfSeats > 0
  );

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-center">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(props.onSubmit)}
          className="w-full space-y-8 text-stone-100 md:w-4/5 lg:w-3/4"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-2 text-center text-xl uppercase">Transport</h1>
            <Separator className="my-5 w-3/4 sm:w-1/2" />
            <div className="text-center text-xl italic">
              <div>{props.event.venue}</div>
              <div className="space-y-0 text-center text-lg italic">
                <span>
                  {props.event.dateTime.toLocaleDateString("en-nz", {
                    dateStyle: "long",
                  })}
                </span>
                <span className="ml-2">
                  {props.event.dateTime.toLocaleTimeString("en-nz", {
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-center">
            There will be a bus provided to and from the venue. As seating on
            the bus is limited, we encourage you to RSVP as soon as possible to
            secure your spot.
          </div>
          <FormField
            control={form.control}
            name="numberOfSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Of Seats</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setShowLocations(parseInt(value) > 0);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
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
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {showLocations && (
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
          )}
          {showLocations && (
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
                      <SelectItem className="text-center" value="Newmarket">
                        Newmarket
                      </SelectItem>
                      <SelectItem className="text-center" value="Pakuranga">
                        Pakuranga
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
          <div className="my-10 flex flex-1" />
          <div className="my-10 flex flex-1" />

          <Button variant="outline" type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default TransportPage;
