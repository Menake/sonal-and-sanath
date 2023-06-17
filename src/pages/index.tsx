import { type NextPage } from "next";
import { Events } from "../components/events";
import { Separator } from "@/components/ui/separator";

const Home: NextPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-screen w-full flex-col justify-between sm:items-center">
        <div className="flex h-1/4 flex-col items-center justify-center px-5">
          <div className="w-full text-center text-lg italic text-stone-100">
            You are invited to celebrate the wedding of
          </div>
          <Separator />
        </div>
        <div className="z-10 flex w-full flex-row justify-center text-4xl font-light text-stone-200 sm:flex-row">
          <div>SONAL</div>
          <div className="relative z-0 mt-5 -ml-1.5 text-5xl font-light opacity-40 sm:mx-2 sm:mt-0">
            &
          </div>
          <div className="-ml-1.5 mt-10 sm:m-0">SANATH</div>
        </div>
        {/* <div className="mb-24 flex h-1/4 w-full flex-col items-end justify-end border-r bsorder-stone-100"> */}
        <blockquote className="mt-6 justify-end border-r pt-16 pr-6 text-right text-sm italic sm:float-right">
          Thank you for being part of of our journey thus far. We would love to
          have you join us as we start this new chapter of our lives together.
        </blockquote>
        {/* </div> */}
      </div>
      <Events />
    </div>
  );
};

export default Home;
