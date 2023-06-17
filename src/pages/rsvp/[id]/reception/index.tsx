import { EventType } from "@prisma/client";
import type { NextPage } from "next";
import { Loader } from "@/components/loader";
import type { RouterInputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";

import { useRouter } from "next/router";
import { RsvpForm } from "@/components/rsvp-form";

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

  return <RsvpForm rsvp={data} onSubmit={handleSubmit} pageType="RECEPTION" />;
};

export default ReceptionRsvp;
