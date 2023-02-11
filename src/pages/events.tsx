export default function Events() {
  const events = [
    {
      name: "Hindu Ceremony",
      time: "5pm",
      location: "Mahatma Ghandi Center",
      dressCode: "Please dress in your traditional Indian attire",
    },
    {
      name: "Poruwa Ceremony & Reception",
      time: "5pm",
      location: "Markovina Estate",
      dressCode: "Cocktail/Sarees are welcome",
    },
  ];

  const hinduEvent = events[0];
  const poruwaEvent = events[1];

  return (
    <div className="mb-16 flex w-full flex-col justify-between sm:justify-center">
      {hinduEvent && (
        <div className="mt-16 w-full border-l border-stone-100 pb-10 pl-5 text-white sm:pl-10">
          <div className="text-2xl italic text-white sm:text-4xl">
            {hinduEvent.name}
          </div>
          <div className="mt-5 italic text-stone-100 sm:text-lg">
            {hinduEvent.location}
          </div>
          <div className="italic text-stone-100 sm:text-lg">
            {hinduEvent.time}
          </div>
          <div className="italic text-stone-100 sm:text-lg">
            {hinduEvent.dressCode}
          </div>
        </div>
      )}

      {poruwaEvent && (
        <div className="flex items-end justify-end">
          <div className="mt-16 w-3/5 border-r border-stone-100 pt-10 pr-5 text-white sm:pr-10">
            <div className="text-right text-2xl italic text-white sm:text-4xl">
              {poruwaEvent.name}
            </div>
            <div className="mt-5 text-right italic text-stone-100 sm:text-lg">
              {poruwaEvent.location}
            </div>
            <div className="text-right italic text-stone-100 sm:text-lg">
              {poruwaEvent.time}
            </div>
            <div className="textbg-stone-100 text-right italic sm:text-lg">
              {poruwaEvent.dressCode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
