import { EventType } from "@prisma/client";
import type { NextPage } from "next";
import { Loader } from "../../../components/loader";
import type { RouterInputs } from "../../../utils/api";
import { api } from "../../../utils/api";

import { useRouter } from "next/router";
import { RsvpForm } from "@/components/rsvp-form";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type RsvpResponse = RouterInputs["rsvp"]["update"];

const HinduCeremonyRsvp: NextPage = () => {
  const { data, isLoading } = api.rsvp.get.useQuery(EventType.HINDU_CEREMONY);

  const utils = api.useContext();
  const router = useRouter();

  const invitationId = router.query.id as string;

  const { mutateAsync } = api.rsvp.update.useMutation();

  const handleSubmit = async (data: RsvpResponse) => {
    await mutateAsync({
      guests: data.guests,
      eventType: "HINDU_CEREMONY",
    });

    await utils.rsvp.get.invalidate();
    void router.push(`/rsvp/${invitationId}/reception`);
  };

  if (isLoading) return <Loader />;

  return (
    <RsvpForm rsvp={data} onSubmit={handleSubmit} pageType="HINDU_CEREMONY" />
  );
};

export default HinduCeremonyRsvp;
