/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Loader } from "../components/loader";
import type { RouterInputs } from "../utils/api";
import { api } from "../utils/api";

type LoginCredentials = RouterInputs["auth"]["login"];

const TokenLogin = ({ token }: { token: string }) => {
  const router = useRouter();
  const { mutate, isLoading, isSuccess, isError } =
    api.auth.token.useMutation();

  useEffect(() => mutate({ token: token }), [mutate, token]);

  if (isSuccess) void router.push("/");

  return (
    <div className="mt-32 mb-8 flex w-full flex-col justify-between sm:items-center">
      {isLoading && (
        <div className="text-center text-stone-200">
          Authenticating, please wait
        </div>
      )}
      {isError && (
        <div className="text-justify text-stone-200">
          Oops! Something went wrong. Please refresh the page and get in touch
          with Sonal or Sanath if the problem persists
        </div>
      )}
    </div>
  );
};

const Login: NextPage = () => {
  const router = useRouter();

  const { token } = router.query;

  const methods = useForm<LoginCredentials>({
    defaultValues: {},
  });

  const { mutate, error, isSuccess, isLoading } = api.auth.login.useMutation();

  const { handleSubmit, register } = methods;

  useEffect(() => {
    if (!isSuccess) return;

    void router.push("/");
  }, [isSuccess, router]);

  if (token) return <TokenLogin token={token as string} />;

  if (isLoading) return <Loader />;

  return (
    <div className="mt-32 mb-8 flex w-full flex-col justify-between sm:items-center">
      <FormProvider {...methods}>
        <form
          className="w-full font-openSans sm:w-1/2"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div className="flex w-full flex-col items-start">
            <label className="text-stone-100">Name</label>
            <input
              className="mt-2 w-full rounded-md bg-[#F1F3F1] py-1.5 px-3 text-[#8A9587] focus:outline-[#8A9587]"
              {...register("name")}
              type="text"
            />
          </div>
          <button
            className="mt-8 w-full rounded bg-[#686e64] py-2 text-white"
            type="submit"
          >
            Login
          </button>
          {error && (
            <div className="mt-32 flex flex-col">
              <p className="text-stone-100">We had a problem logging you in</p>
              <p className="text-stone-100">
                Please get in touch with Sonal or Sanath or use the QR code on
                your invitation.
              </p>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default Login;
