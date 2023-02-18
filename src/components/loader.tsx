export const Loader = () => {
  const circleCommonClasses = "h-2.5 w-2.5 bg-[#8A9587] rounded-full";

  return (
    <div className="absolute top-0 left-0 flex h-screen w-screen flex-row items-center justify-center">
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce200 `}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
};
