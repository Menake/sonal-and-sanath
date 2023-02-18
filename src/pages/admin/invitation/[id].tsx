/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { InvitationForm } from "../../../components/invitationForm";
import AdminLayout from "../../../components/layouts/admin";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";

type Invitation = RouterOutputs["invitation"]["get"];

export default function Invitation() {
  const router = useRouter();
  const { id } = router.query;

  if (id) return <InvitationFormWrapper invitationId={id as string} />;

  return null;
}

function InvitationFormWrapper({ invitationId }: { invitationId: string }) {
  const router = useRouter();

  const utils = api.useContext();

  const { data } = api.invitation.get.useQuery(invitationId);
  const { mutate, isLoading } = api.invitation.update.useMutation({
    async onSuccess(input) {
      await utils.invitation.get.invalidate(input.id);
      await router.push("/admin");
    },
  });

  if (data) {
    return (
      <InvitationForm
        data={data}
        onSubmit={(data) => {
          mutate({ ...data, id: invitationId });
        }}
        submitting={isLoading}
      />
    );
  }

  return null;
}

Invitation.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
