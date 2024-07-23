import { Slot, TimeSlot } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function TimeBtn({
  slot,
  isTaken,
  active,
  date,
  onClick,
}: {
  active: boolean;
  slot: TimeSlot;
  isTaken: boolean;
  date?: Date;
  onClick: (slot: TimeSlot) => void;
}) {
  const [isPast, setIsPast] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!date) return;

      const future = date.getTime();
      const today = new Date();
      const now = today.getTime();
      const to = new Date(
        `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} ${
          slot.from
        }`
      );

      setIsPast(future > now ? isTaken : now > to.getTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  function handleClick() {
    onClick(slot);
  }

  return (
    <Button
      className={`${isPast || isTaken ? "cursor-not-allowed!" : ""}`}
      variant={isPast || isTaken ? "disabled" : active ? "default" : "outline"}
      onClick={isTaken || isPast ? undefined : handleClick}
      disabled={isPast}
    >
      {slot.from} - {slot.to}
    </Button>
  );
}
