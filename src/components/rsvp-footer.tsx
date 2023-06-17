import { useInvitation } from "@/invitationProvider";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

export type RsvpPage = "HINDU_CEREMONY" | "RECEPTION" | "TRANSPORT";

export const RsvpFooter = ({ pageType }: { pageType: RsvpPage }) => {
  const { id, events } = useInvitation();
  const router = useRouter();

  const proceedButtonText =
    events.length > 1 && pageType !== "TRANSPORT" ? "Continue" : "Submit";

  let currentPage = 1;

  const totalNumberOfPages =
    events.length > 1 ? 3 : pageType === "HINDU_CEREMONY" ? 1 : 2;

  if (pageType === "RECEPTION" && events.length > 1) {
    currentPage = 2;
  }

  if (pageType === "TRANSPORT" && events.length > 1) currentPage = 3;

  const goToPreviousPage = () => {
    if (pageType === "RECEPTION") void router.push(`/rsvp/${id}/ceremony`);

    if (pageType === "TRANSPORT") void router.push(`/rsvp/${id}/reception`);
  };

  return (
    <div className="mt-5 flex flex-row">
      {pageType !== "HINDU_CEREMONY" ? (
        <Button
          variant="outline"
          type="button"
          className="w-1/4"
          onClick={goToPreviousPage}
        >
          Previous
        </Button>
      ) : (
        <div className="w-1/4" />
      )}
      {events.length > 1 && (
        <div className="flex flex-1 flex-col items-center justify-center align-middle">
          <div>
            <div className="text-center">
              {`Page ${currentPage} of ${totalNumberOfPages}`}
            </div>
            <div className="mt-2 flex flex-row justify-between">
              {[...Array(totalNumberOfPages).keys()].map((number) => (
                <div
                  key={number}
                  className={`aspect-square h-2 rounded-full border ${
                    currentPage === number + 1 ? "bg-current" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Button variant="outline" type="submit" className="w-1/4">
        {proceedButtonText}
      </Button>
    </div>
  );
};
