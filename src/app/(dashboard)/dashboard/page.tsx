"use client";
import "react-big-calendar/lib/sass/styles.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import Link from "next/link";
import useFetcher from "@/hooks/useFetcher";
import { toast } from "react-toastify";
import BookingService from "@/services/Booking";
import { Booking } from "@/types";
import Spinner from "@/components/Spinner";
import { Timestamp } from "firebase/firestore";
import { BookAppointment } from "@/components/Scheduler";
import Logout from "@/components/Logout";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { wrapper, loading, data, error } = useFetcher<Booking[]>([]);

  async function findAllHandler() {
    const bookingService = new BookingService();
    await wrapper(() => bookingService.findAll());
  }

  function bookHandler() {
    findAllHandler();
  }

  useEffect(() => {
    findAllHandler();
  }, []);

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <main className="py-10 px-6">
      {/* book doctors appointment */}

      {/* my appointments */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="">My appointments</h1>

        <div className="flex items-center gap-4">
          <BookAppointment
            onBook={bookHandler}
            bookings={data.map((e) => ({
              id: e.id,
              slot: e.doctorsAppointment,
              owner: e.owner,
            }))}
          />
          <Logout />
        </div>
      </div>

      {loading && <Spinner />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {bookings.map((booking) => {
          const now = new Date().getTime();
          const from = new Date(
            `${(booking.doctorsAppointment.date as Timestamp)
              .toDate()
              .getFullYear()}/${
              (booking.doctorsAppointment.date as Timestamp)
                .toDate()
                .getMonth() + 1
            }/${(booking.doctorsAppointment.date as Timestamp)
              .toDate()
              .getDate()} ${booking.doctorsAppointment.from}`
          );

          const to = new Date(
            `${(booking.doctorsAppointment.date as Timestamp)
              .toDate()
              .getFullYear()}/${
              (booking.doctorsAppointment.date as Timestamp)
                .toDate()
                .getMonth() + 1
            }/${(booking.doctorsAppointment.date as Timestamp)
              .toDate()
              .getDate()} ${booking.doctorsAppointment.to}`
          );
          const inProgress = from.getTime() >= now && to.getTime() < now;
          const isActive = now < from.getTime();

          return (
            <Link
              key={booking.timestamp.toString()}
              href={`/${booking.id}`}
              className="flex flex-col justify-center border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 px-6 py-4 rounded-md"
            >
              {(inProgress || isActive) && (
                <p className="bg-slate-700 text-white w-fit rounded-full px-2 py-[2px] text-xs mb-4">
                  {inProgress && "in progress"}
                  {isActive && "active"}
                </p>
              )}
              <p className="mb-1 text-2xl">
                {moment(
                  (booking.doctorsAppointment.date as Timestamp).toDate()
                ).format("Do MMM, YYYY")}
              </p>
              <p className="">
                {booking.doctorsAppointment.from} -{" "}
                {booking.doctorsAppointment.to}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
