import { type NextPage } from "next";
import { Events } from "../components/events";
import { Separator } from "@/components/ui/separator";

const Home: NextPage = () => {
  return (
    <div className="flex w-full flex-1 flex-col justify-between">
      <div className="flex h-1/4 flex-col items-center justify-center px-5">
        <div>
          <div className="justify mt-8 w-full text-lg italic text-stone-100">
            You are invited to celebrate the wedding of
          </div>
          <Separator />
        </div>
      </div>
      <div className="my-52 flex h-3/4 items-center justify-center text-5xl sm:text-6xl md:text-7xl">
        <div className="z-10 flex w-full flex-col px-2 font-light text-stone-200 sm:w-1/2 lg:w-1/4">
          <div>SONAL</div>
          <div className="relative z-0 -ml-1.5 -mt-6 text-center font-light opacity-40 sm:mx-2 sm:mt-0">
            &
          </div>
          <div className="-ml-26 -mt-3 text-right sm:m-0">SANATH</div>
        </div>
      </div>
      <blockquote className="mt-6 w-2/3 justify-end self-end border-r pr-6 pt-16 text-right text-sm md:w-1/4 md:text-base">
        Thank you for being part of of our journey thus far. We would love to
        have you join us as we start this new chapter of our lives together.
      </blockquote>
      <Events />
    </div>
  );
};

export default Home;
