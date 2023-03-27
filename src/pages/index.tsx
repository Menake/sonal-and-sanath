import { type NextPage } from "next";
import { Events } from "../components/events";
import { useSession } from "../SessionProvider";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data } = api.events.invited.useQuery();

  const { session } = useSession();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-screen w-full flex-col justify-between sm:items-center">
        <div className="flex h-1/4 flex-col items-center justify-center px-5">
          <span className="w-full text-center text-lg italic text-stone-100">
            Dear {session.addressedTo}{" "}
          </span>
          <div className="w-full text-center text-lg italic text-stone-100">
            You are invited to celebrate the wedding of
          </div>
          <div className="border-bg-white mt-2 w-full border"></div>
        </div>
        <div className="z-10 flex w-full flex-row justify-center text-4xl font-light text-stone-200 sm:flex-row">
          <div>SONAL</div>
          <div className="relative z-0 mt-5 -ml-1.5 text-4xl font-light opacity-40 sm:mx-2 sm:mt-0">
            &
          </div>
          <div className="-ml-1.5 mt-10 sm:m-0">SANATH</div>
        </div>
        <div className="mb-24 flex h-1/4 w-full flex-col items-end justify-end border-r border-stone-100">
          <p className="sm:text-md w-3/4 pr-5 text-right text-sm italic text-stone-100 sm:w-1/2 md:w-1/3">
            Thank you for being part of of our journey thus far. We would love
            to have you join us as we start this new chapter of our lives
            together.
          </p>
        </div>
      </div>
      {data && <Events events={data} />}
    </div>
  );
};

export default Home;
