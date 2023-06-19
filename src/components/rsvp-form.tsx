import { Status } from "@prisma/client";
import { useForm } from "react-hook-form";
import type { RouterInputs, RouterOutputs } from "../utils/api";

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
import { Separator } from "@/components/ui/separator";
import type { RsvpPage } from "@/components/rsvp-footer";
import { RsvpFooter } from "@/components/rsvp-footer";
import { useRsvpNavigation } from "@/hooks/use-rsvp-navigation";

type EventRsvp = RouterOutputs["rsvp"]["get"];
type RsvpResponse = RouterInputs["rsvp"]["update"];

export const RsvpForm = (props: {
  rsvp: EventRsvp;
  pageType: RsvpPage;
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
      <div className="flex flex-1 justify-center">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(props.onSubmit)}
          className="flex min-h-full w-full flex-col justify-evenly sm:w-3/4 md:w-1/2"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-2 text-center text-xl uppercase">
              {props.rsvp.event.name}
            </h1>
            <Separator className="my-5 w-3/4 sm:w-1/2" />
            <div className="text-center text-xl italic">
              <div>{props.rsvp.event.venue}</div>
              <div className="text-center text-lg italic">
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

          <div className="mt-16">
            <div className="text-center italic">
              Please select the attendance for each guest
            </div>

            {props.rsvp?.guests.map((guest, index) => (
              <div key={guest.id} className="my-10">
                <FormField
                  control={form.control}
                  name={`guests.${index}.id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`guests.${index}.status`}
                  render={({ field }) => (
                    <FormItem className="mt-3 w-full ">
                      <FormLabel className="my-5 text-lg">
                        {guest.name}
                      </FormLabel>
                      <FormControl className="my-10">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex w-full"
                        >
                          <FormItem className="flex w-full items-center space-x-3 space-y-0 rounded border p-2 peer-checked:bg-stone-100">
                            <FormControl>
                              <RadioGroupItem
                                className="peer mx-2"
                                value={Status.ATTENDING}
                              />
                            </FormControl>
                            <FormLabel className="flex-row items-center">
                              <div className="ml-4 flex flex-col">
                                <span className="text-sm">Attending</span>
                                <span className="mt-1 text-xs italic">
                                  See you there
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex w-full items-center space-x-3 space-y-0 rounded border p-2 peer-checked:bg-stone-100">
                            <FormControl>
                              <RadioGroupItem
                                className="peer mx-2"
                                value={Status.NOTATTENDING}
                              />
                            </FormControl>
                            <FormLabel className="flex-row items-center">
                              <div className="ml-4 flex flex-col">
                                <span className="text-sm">Not Attending</span>
                                <span className="mt-1 text-xs italic">
                                  {`I can't make it`}
                                </span>
                              </div>
                            </FormLabel>
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
            <RsvpFooter
              pageType={props.pageType}
              isSubmitting={form.formState.isSubmitting}
            />
          </div>
        </form>
      </div>
    </Form>
  );
};
