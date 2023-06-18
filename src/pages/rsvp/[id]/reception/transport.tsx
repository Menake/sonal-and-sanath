import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Loader } from "../../../../components/loader";
import type { RouterOutputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { RsvpPage } from "@/components/rsvp-footer";
import { RsvpFooter } from "@/components/rsvp-footer";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRsvpNavigation } from "@/hooks/use-rsvp-navigation";

type Event = RouterOutputs["rsvp"]["transport"];

const transportFormSchema = z.object({
  numberOfSeats: z.string(),
  pickupLocation: z.string().nullable(),
  dropOffLocation: z.string().nullable(),
});

type FormSchema = z.infer<typeof transportFormSchema>;

const TransportPage: NextPage = () => {
  const { data, isLoading } = api.rsvp.transport.useQuery();

  const utils = api.useContext();
  const pageType = "TRANSPORT" as RsvpPage;

  const { next } = useRsvpNavigation(pageType);

  const { mutateAsync } = api.rsvp.updateTransport.useMutation();

  const handleSubmit = async (data: FormSchema) => {
    await mutateAsync({
      ...data,
      numberOfSeats: parseInt(data.numberOfSeats),
    });
    await utils.rsvp.transport.invalidate();
    next();
  };

  if (isLoading) return <Loader />;

  if (!data) return null;

  return <TransportForm event={data} onSubmit={handleSubmit} />;
};

const TransportForm = (props: {
  event: Event;
  onSubmit: (data: FormSchema) => Promise<void>;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(transportFormSchema),
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
      <div className="flex flex-1 justify-center">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(props.onSubmit)}
          className="flex min-h-full w-full flex-col justify-evenly sm:w-3/4 md:w-1/2"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-2 text-center text-xl uppercase">Transport</h1>
            <Separator className="my-5 w-3/4 sm:w-1/2" />
            <div className="text-center text-xl italic">
              <div>{props.event.venue}</div>
              <div className="text-center text-lg italic">
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

          <div className="my-8 sm:text-center">
            There will be a bus provided to and from the venue. As seating on
            the bus is limited, we encourage you to RSVP as soon as possible to
            secure your spot.
          </div>

          <div className="space-y-6">
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
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the number of seats" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(props.event.numberOfGuests + 1).keys()].map(
                        (number) => (
                          <SelectItem
                            key={number + 1}
                            value={number.toString()}
                          >
                            {number.toString()}
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
          </div>

          <div className="flex flex-1" />

          <div className="mb-10">
            <RsvpFooter
              pageType="TRANSPORT"
              isSubmitting={form.formState.isSubmitting}
            />
          </div>
        </form>
      </div>
    </Form>
  );
};

export default TransportPage;
