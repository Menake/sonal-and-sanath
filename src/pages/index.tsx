import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="mb-8 flex w-full flex-col justify-between sm:items-center">
      <div className="flex h-1/4 flex-col items-center justify-center px-5">
        <div className="w-full text-center text-lg italic text-stone-100">
          You are invited to celebrate the wedding of
        </div>
        <div className="border-bg-white mt-2 w-full border"></div>
      </div>
      <div className="flex flex-col justify-center sm:flex-row">
        <div className="text-5xl uppercase text-stone-100 sm:text-center">
          Sonal
        </div>
        <div className="flex flex-row justify-end text-right sm:flex-none">
          <div className="text-right text-5xl uppercase text-stone-100 sm:text-center">
            & Sanath
          </div>
        </div>
      </div>
      <div className="flex h-1/4 w-full flex-col items-end justify-end border-r border-stone-100">
        <p className="sm:text-md w-3/4 pr-5 text-right text-sm italic text-stone-100 sm:w-1/2">
          Thank you for being part of of our journey thus far. We would love to
          have you join us as we start this new chapter of our lives together.
        </p>
      </div>
    </div>
  );
};

export default Home;
