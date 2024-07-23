import { FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "./ui/button";
import useFetcher from "@/hooks/useFetcher";
import { Booking, Test } from "@/types";
import BookingService from "@/services/Booking";
import { useCallback, useMemo, useState } from "react";
import Spinner from "./Spinner";

export default function RecommendTest({
  id,
  tests,
}: {
  id: string;
  tests: NonNullable<Booking["tests"]>;
}) {
  return (
    <div className="grid gap-y-2 gap-x-10 py-4 px-2 border-t border-t-slate-200">
      <p className="font-medium text-xl">Recommend test</p>

      <TestComp id={id} test={Test.PCV} tests={tests} />
    </div>
  );
}

function TestComp({
  test,
  id,
  tests: t,
}: {
  test: Test;
  id: string;
  tests: NonNullable<Booking["tests"]>;
}) {
  const [tests, setTests] = useState(t);
  const { wrapper, data, loading, error } = useFetcher(null);

  const recommended = useCallback(() => {
    return Object.keys(tests).includes(test);
  }, [tests, test]);

  async function handleToggle() {
    let update = tests;
    if (recommended()) delete tests[test];
    else update = { ...tests, [test]: "" };

    const bookingService = new BookingService();
    await wrapper(() => bookingService.tests(id, update));
    setTests(update);
  }

  return (
    <div className="grid grid-cols-[max-content,1fr] items-center gap-3">
      {loading ? (
        <Spinner className="w-6 h-6" />
      ) : (
        <Button
          variant={"outline"}
          className="h-fit px-2"
          onClick={handleToggle}
        >
          {!recommended() ? (
            <FiPlus className="text-main-red-dark group-hover:text-white group-focus:text-white dark:text-main-red-light" />
          ) : (
            <FiMinus className="text-main-red-dark group-hover:text-white group-focus:text-white dark:text-main-red-light" />
          )}
        </Button>
      )}
      <p>{test}</p>
    </div>
  );
}
