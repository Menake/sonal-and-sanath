/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useRef } from "react";
import { InvitationForm } from "../../../components/invitationForm";
import AdminLayout from "../../../components/layouts/admin";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";
import { env } from "../../../env.mjs";

import { useQRCode } from "next-qrcode";

type Invitation = RouterOutputs["invitation"]["getForAdmin"];

export default function Invitation() {
  const router = useRouter();
  const { id } = router.query;

  if (id) return <InvitationFormWrapper invitationId={id as string} />;

  return null;
}

function InvitationFormWrapper({ invitationId }: { invitationId: string }) {
  const router = useRouter();

  const utils = api.useContext();

  const { data } = api.invitation.getForAdmin.useQuery(invitationId);
  const { mutate, isLoading } = api.invitation.update.useMutation({
    onSuccess: async (input, { id }) => {
      await utils.invitation.getForAdmin.invalidate(id);
      await utils.invitation.get.invalidate();
      await router.push("/admin");
    },
  });

  const { Canvas } = useQRCode();

  const qRef = useRef<HTMLDivElement>(null);

  const downloadQrCode = (name: string) => {
    const canvas = qRef.current?.querySelector("canvas");
    const image = canvas?.toDataURL("image/png");

    if (!image) return;

    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `${name}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (data) {
    const authUrl = `${env.NEXT_PUBLIC_AUTH_DOMAIN}/login?token=${data.id}`;

    return (
      <>
        <InvitationForm
          data={data}
          onSubmit={(data) => {
            mutate({ ...data, id: invitationId });
          }}
          submitting={isLoading}
        />
        <div className="mb-10 w-full sm:w-1/2">
          <label className="mt-3 text-[#8A9587]">QR Code</label>

          <div
            className="width-full flex items-center justify-center"
            ref={qRef}
          >
            <Canvas
              text={authUrl}
              options={{
                color: {
                  dark: "#8A9587",
                },
                scale: 6,
              }}
            />
          </div>

          <button
            className="w-full rounded bg-[#8A9587] py-2 text-white"
            onClick={() => downloadQrCode(data.addressedTo)}
          >
            Download QR Code
          </button>
        </div>
      </>
    );
  }

  return null;
}

Invitation.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
