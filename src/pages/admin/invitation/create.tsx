import type { ReactElement } from "react";
import { InvitationForm } from "../../../components/invitationForm";
import AdminLayout from "../../../components/layouts/admin";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

type Invitation = RouterOutputs["invitation"]["get"];

export default function CreateInvitation() {
  const { mutate } = api.invitation.create.useMutation();

  const defaultData: Invitation = {
    addressedTo: "",
    guests: [],
    events: [],
  };

  return (
    <InvitationForm data={defaultData} onSubmit={(data) => mutate(data)} />
  );
}

CreateInvitation.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
