import { EventType } from "@prisma/client";
import type { NextPage } from "next";
import { Loader } from "@/components/loader";
import type { RouterInputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

import { RsvpForm } from "@/components/rsvp-form";
import { useRsvpNavigation } from "@/hooks/use-rsvp-navigation";

type RsvpResponse = RouterInputs["rsvp"]["update"];

const ReceptionRsvp: NextPage = () => {
  const { data, isLoading } = api.rsvp.get.useQuery(
    EventType.PORUWA_AND_RECEPTION
  );

  const utils = api.useContext();
  const pageType = "RECEPTION";

  const { next } = useRsvpNavigation(pageType);

  const { mutateAsync } = api.rsvp.update.useMutation();

  const handleSubmit = async (data: RsvpResponse) => {
    await mutateAsync({
      guests: data.guests,
      eventType: "PORUWA_AND_RECEPTION",
    });
    await utils.rsvp.get.invalidate();

    await utils.invitation.get.invalidate();

    next();
  };

  if (isLoading) return <Loader spinnerColour="bg-stone-100" />;

  return <RsvpForm rsvp={data} onSubmit={handleSubmit} pageType={pageType} />;
};

export default ReceptionRsvp;
