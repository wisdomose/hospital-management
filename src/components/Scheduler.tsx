"use client";
import TimeBtn from "@/components/TimeBtn";
import { useUserStore } from "@/store/user";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { DatePicker } from "@/components/DatePicker";
import { Button, ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Booking, Patient, Slot, TimeSlot } from "@/types";
import timeSlots from "@/data/timeSlots";
import useFetcher from "@/hooks/useFetcher";
import BookingService from "@/services/Booking";
import { toast } from "react-toastify";

export function BookAppointment({
  onBook,
  id,
  rescheduling = false,
  bookings,
  label = "Book a new appointment",
  mode = "doctor",
}: {
  id?: string;
  rescheduling?: boolean;
  label?: string;
  mode?: "doctor" | "lab";
  onBook: () => void;
  bookings: { slot: Slot; owner: Patient; id: string }[];
}) {
  const user = useUserStore((store) => store.user);
  // selected slot
  const [timeSlot, setTimeSlot] = useState<TimeSlot>();

  const [date, setDate] = useState<Date>();
  const today = new Date();
  const newMonth = (today.getMonth() + 3) % 12;
  const nextMonth = new Date(new Date().setMonth(newMonth));

  // slots available in a certain day
  const taken = useMemo(() => {
    if (!date) return [];

    return bookings.filter(
      (entry) =>
        entry.slot.date.toDate().setHours(0, 0, 0) === date.setHours(0, 0, 0)
    );
  }, [date, bookings]);

  // find slot booked by logged in user
  const bookedSlot = useMemo(() => {
    if (!user) return;
    const match = taken.find((taken) => taken.owner.userId === user.userId);

    return match;
  }, [user, taken, date]);

  // check if a slot is taken
  function isTaken(slot: TimeSlot) {
    // console.log(taken, user);
    return !!taken.find(
      (taken) =>
        taken.slot.from === slot.from && taken.owner.userId !== user?.userId
    );
  }

  //   useEffect(() => {
  //     setTimeSlot(undefined);
  //   }, [date]);

  // check is any slot in taken belongs to loggedIn user
  useEffect(() => {
    !bookedSlot
      ? setTimeSlot(undefined)
      : setTimeSlot({ from: bookedSlot.slot.from, to: bookedSlot.slot.to });
  }, [bookedSlot, date]);

  function handleSlotChange(slot: TimeSlot) {
    setTimeSlot(slot);
  }

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setDate(undefined);
          setTimeSlot(undefined);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button>{label}</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-min p-6 max-md:max-h-[60vh] overflow-auto">
        <p className="mb-6">Pick a date and time best suitable for you</p>
        <div className="grid max-md:grid-rows-2 md:grid-cols-[1fr,174px] w-fit gap-6 mb-10">
          <div className="">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              fromDate={today}
              toDate={nextMonth}
            />
          </div>
          <div className="grid grid-rows-[max-content,1fr] md:border-l md:pl-6">
            <h1 className="py-4 text-sm">Pick a time slot</h1>
            <div className="overflow-auto relative">
              <div className="absolute left-0 right-0 top-0 bottom-4 flex flex-col gap-4 max-w-fit">
                {timeSlots.map((slot) => (
                  <TimeBtn
                    slot={slot}
                    key={slot.from + slot.to}
                    active={slot.from === timeSlot?.from}
                    isTaken={isTaken(slot)}
                    onClick={handleSlotChange}
                    date={date}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {/* <Button onClick={handleBook}>
              {!!bookedSlot ? "Reschedule" : "Book now"}
            </Button> */}

          {!bookedSlot && !rescheduling && timeSlot && date && (
            <ScheduleBtn
              mode={mode}
              onBook={onBook}
              id={id}
              update={{ date: Timestamp.fromDate(date), ...timeSlot }}
            />
          )}
          {(bookedSlot || rescheduling) && timeSlot && date && (
            <RescheduleBtn
              onBook={onBook}
              id={id ? id : bookedSlot!.id}
              update={
                mode === "doctor"
                  ? {
                      doctorsAppointment: {
                        date: Timestamp.fromDate(date),
                        ...timeSlot,
                      },
                    }
                  : {
                      labAppointment: {
                        date: Timestamp.fromDate(date),
                        ...timeSlot,
                      },
                    }
              }
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type BookingBtnProps = {
  onBook: () => void;
} & ButtonProps;

export function ScheduleBtn({
  onBook,
  update,
  mode,
  onClick,
  id,
  ...btnProps
}: BookingBtnProps & { mode: "doctor" | "lab"; id?: string; update: Slot }) {
  const { wrapper, loading, data, error } = useFetcher<boolean>();

  async function clickHandler() {
    // if (!timeSlot || !date) {
    //   toast.error("Pick a valid time");
    //   return;
    // }
    const bookingService = new BookingService();
    mode === "doctor"
      ? wrapper(() => bookingService.create(update))
      : wrapper(() => bookingService.lab(id!, update));
  }

  useEffect(() => {
    if (data) {
      onBook();
      toast.success("Appointment booked");
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Button {...btnProps} onClick={clickHandler} disabled={loading}>
      Book
    </Button>
  );
}
export function RescheduleBtn({
  onBook,
  id,
  update,
  onClick,
  ...btnProps
}: BookingBtnProps & {
  id: string;
  update: { doctorsAppointment: Slot } | { labAppointment: Slot };
}) {
  const { wrapper, loading, data, error } = useFetcher<boolean>();

  async function clickHandler() {
    const bookingService = new BookingService();
    wrapper(() => bookingService.reschedule(id, update));
  }

  useEffect(() => {
    if (data) {
      onBook();
      toast.success("Appointment rescheduled");
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Button {...btnProps} onClick={clickHandler} disabled={loading}>
      Reschedule
    </Button>
  );
}
