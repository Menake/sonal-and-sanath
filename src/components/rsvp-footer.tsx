import type { InvitationEvent } from "@/invitation-provider";
import { useInvitation } from "@/invitation-provider";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { useRsvpNavigation } from "@/hooks/use-rsvp-navigation";

export type RsvpPage = "HINDU_CEREMONY" | "RECEPTION" | "TRANSPORT";

const getTotalNumberOfPages = (events: InvitationEvent[]) => {
  if (events.length > 1) return 3;

  if (events[0]?.eventType === "PORUWA_AND_RECEPTION") return 2;

  return 1;
};

export const RsvpFooter = ({
  pageType,
  isSubmitting,
}: {
  pageType: RsvpPage;
  isSubmitting: boolean;
}) => {
  const { events } = useInvitation();
  const { previous } = useRsvpNavigation(pageType);

  const totalNumberOfPages = getTotalNumberOfPages(events);

  const currentPageNumber =
    pageType === "HINDU_CEREMONY"
      ? 1
      : pageType === "RECEPTION"
      ? totalNumberOfPages - 1
      : totalNumberOfPages;

  const proceedButtonText =
    events.length > 1 && pageType !== "TRANSPORT" ? "Continue" : "Submit";

  return (
    <div className="mt-5 flex flex-row">
      <div className={totalNumberOfPages > 1 ? "w-1/4" : ""}>
        {currentPageNumber > 1 && (
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={previous}
          >
            Previous
          </Button>
        )}
      </div>
      {totalNumberOfPages > 1 && (
        <div className="flex flex-1 flex-col items-center justify-center align-middle">
          <div>
            <div className="text-center">
              {`Page ${currentPageNumber} of ${totalNumberOfPages}`}
            </div>
            <div className="mt-2 flex flex-row justify-around">
              {[...Array(totalNumberOfPages).keys()].map((number) => (
                <div
                  key={number}
                  className={`aspect-square h-2 rounded-full border ${
                    currentPageNumber === number + 1 ? "bg-current" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={totalNumberOfPages === 1 ? "w-full" : "w-1/4"}>
        {isSubmitting ? (
          <Button variant="outline" type="submit" className="w-full">
            <div className="animate-spin border-solid border-current">
              <Loader2 />
            </div>
          </Button>
        ) : (
          <Button
            variant="outline"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {proceedButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
