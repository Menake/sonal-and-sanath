import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { InvitationForm } from "../../../components/invitationForm";
import AdminLayout from "../../../components/layouts/admin";
import type { RouterInputs, RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

type Invitation = RouterInputs["invitation"]["create"];

export default function CreateInvitation() {
  const router = useRouter();

  const { mutate, isLoading } = api.invitation.create.useMutation({
    async onSuccess() {
      await router.push("/admin");
    },
  });

  const defaultData: Invitation = {
    addressedTo: "",
    guests: [],
    events: [],
  };

  return (
    <InvitationForm
      data={defaultData}
      onSubmit={(data) => mutate(data)}
      submitting={isLoading}
    />
  );
}

CreateInvitation.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
