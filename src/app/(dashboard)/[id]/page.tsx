"use client";
import Link from "next/link";
import { GiHospital } from "react-icons/gi";
import { FiChevronLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { Booking, ROLES, Test } from "@/types";
import useFetcher from "@/hooks/useFetcher";
import BookingService from "@/services/Booking";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { Timestamp } from "firebase/firestore";
import { useUserStore } from "@/store/user";
import { BookAppointment } from "@/components/Scheduler";

import TestResults from "@/components/TestResults";
import { displayResult } from "@/lib";
import RecommendTest from "@/components/RecommendTests";
import LabResults from "@/components/LabResults";

export default function BookingDetails() {
  const [booking, setBooking] = useState<Booking>();
  const { wrapper, loading, data, error } = useFetcher<Booking>();
  const params = useParams();
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (!params?.id) return;
    const bookingService = new BookingService();
    wrapper(() => bookingService.findOne(params.id as string));
  }, [params?.id]);

  useEffect(() => {
    if (data) {
      setBooking(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const results = booking ? (Object.keys(booking.tests ?? {}) as Test[]) : [];
  return (
    <main className="p-6 max-w-xl mx-auto">
      <Button asChild variant={"ghost"}>
        <Link
          href={
            !user
              ? "/"
              : user.role === ROLES.PATIENT
              ? "/dashboard"
              : user.role === ROLES.DOCTOR ||
                user.role === ROLES.NURSE ||
                user.role === ROLES.SCIENTIST
              ? "/appointments"
              : "/"
          }
          className="flex items-center gap-2"
        >
          <FiChevronLeft /> <span className="text-sm">Back</span>
        </Link>
      </Button>
      <GiHospital className="size-16 text-primary mx-auto mb-10" />

      {loading && <Spinner />}
      {booking && (
        <>
          <div className="grid grid-cols-2 gap-y-2 gap-x-10 py-4 px-2">
            <p className="font-medium text-xl">Patient</p>
            <p className="text-end"></p>

            {/* name */}
            <p className="font-medium capitalize">name</p>
            <p className="text-end capitalize">{booking.owner.displayName}</p>
            {/* gender */}
            <p className="font-medium capitalize">gender</p>
            <p className="text-end capitalize">{booking.owner.gender}</p>
            {/* phone no */}
            <p className="font-medium capitalize">phone number</p>
            <p className="text-end">{booking.owner.phoneNo}</p>
            {/* email */}
            <p className="font-medium capitalize">email</p>
            <p className="text-end">{booking.owner.email}</p>
          </div>
          <Doctor
            hide={user?.userId !== booking.owner.userId || results.length > 0}
            id={booking.id}
            appointment={booking.doctorsAppointment}
          />
          {(booking.labAppointment || user?.role === ROLES["PATIENT"]) && (
            <Lab
              hide={
                user?.userId !== booking.owner.userId || !!booking?.tests?.pcv
              }
              id={booking.id}
              appointment={booking.labAppointment}
            />
          )}

          {(results.length > 0 || user?.role === ROLES["NURSE"]) && user && (
            <div className="grid grid-cols-2 gap-y-2 gap-x-10 py-4 px-2 border-t border-t-slate-200">
              <p className="font-medium text-xl">Results</p>
              <div className="place-self-end">
                {user?.role === ROLES["NURSE"] ? (
                  <TestResults id={booking.id} tests={booking.tests} />
                ) : user?.role === ROLES["SCIENTIST"] ? (
                  <LabResults id={booking.id} tests={booking.tests} />
                ) : null}
              </div>
              {results.length === 0 && (
                <p className="col-span-2 text-center mt-6">No results found</p>
              )}
              {results.map((result) => (
                <Fragment key={result}>
                  <p className="font-medium capitalize">
                    {result.replaceAll("_", " ").toLowerCase()}
                  </p>
                  <p className="text-end">
                    {displayResult(result, booking.tests![result], user)}
                  </p>
                </Fragment>
              ))}
            </div>
          )}

          {user?.role === ROLES["DOCTOR"] && (
            <RecommendTest id={booking.id} tests={booking.tests ?? {}} />
          )}
        </>
      )}
    </main>
  );
}

type DDProps = {
  hide: boolean;
  id: string;
  appointment: Booking["doctorsAppointment"];
};

function Doctor({ appointment, id, hide }: DDProps) {
  const { wrapper, loading, data, error } = useFetcher<Booking[]>([]);

  useEffect(() => {
    findAllHandler();
  }, []);

  async function findAllHandler() {
    const bookingService = new BookingService();
    await wrapper(() => bookingService.findAll());
  }

  function bookHandler() {
    window.location.reload();
  }

  const expired =
    Date.now() >
    new Date(
      `${appointment.date.toDate().getFullYear()}/${
        appointment.date.toDate().getMonth() + 1
      }/${appointment.date.toDate().getDate()} ${appointment.from}`
    ).getTime();

  return (
    <div className="grid grid-cols-2 gap-y-2 gap-x-10 py-4 px-2 border-t border-t-slate-200">
      {/* <div className="grid grid-cols-2 gap-10"> */}
      <p className="font-medium text-xl">Appointment with doctor</p>
      <div className="text-end">
        {expired || hide ? null : (
          <BookAppointment
            onBook={bookHandler}
            label="Reschedule"
            id={id}
            rescheduling={true}
            bookings={data.map((e) => ({
              id: e.id,
              slot: e.doctorsAppointment,
              owner: e.owner,
            }))}
          />
        )}
      </div>

      {/* DATE */}
      {appointment && (
        <>
          <p className="font-medium">Date</p>
          <p className="text-end">
            {moment((appointment.date as Timestamp).toDate()).format(
              "Do MMM, YYYY"
            )}
          </p>

          {/* TIME */}
          <p className="font-medium">Time</p>
          <p className="text-end">
            {appointment.from} - {appointment.to}
          </p>
        </>
      )}
    </div>
  );
}

function Lab({
  appointment,
  id,
  hide,
}: Omit<DDProps, "appointment"> & Partial<Pick<DDProps, "appointment">>) {
  const { wrapper, loading, data, error } = useFetcher<Booking[]>([]);

  useEffect(() => {
    findAllHandler();
  }, []);

  async function findAllHandler() {
    const bookingService = new BookingService();
    await wrapper(() => bookingService.findAll());
  }

  function bookHandler() {
    window.location.reload();
  }

  const expired = !appointment
    ? false
    : Date.now() >
      new Date(
        `${appointment.date.toDate().getFullYear()}/${
          appointment.date.toDate().getMonth() + 1
        }/${appointment.date.toDate().getDate()} ${appointment.from}`
      ).getTime();

  return (
    <div className="grid grid-cols-2 gap-y-2 gap-x-10 py-4 px-2 border-t border-t-slate-200">
      {/* <div className="grid grid-cols-2 gap-10"> */}
      <p className="font-medium text-xl">Appointment with lab</p>
      <div className="text-end">
        {expired || hide ? null : (
          <BookAppointment
            onBook={bookHandler}
            label={appointment ? "Reschedule" : "Book"}
            mode="lab"
            id={id}
            rescheduling={!!appointment}
            bookings={data
              .filter((e) => !!e.labAppointment)
              .map((e) => ({
                id: e.id,
                slot: e.labAppointment!,
                owner: e.owner,
              }))}
          />
        )}
      </div>

      {/* DATE */}
      {appointment && (
        <>
          <p className="font-medium">Date</p>
          <p className="text-end">
            {moment((appointment.date as Timestamp).toDate()).format(
              "Do MMM, YYYY"
            )}
          </p>

          {/* TIME */}
          <p className="font-medium">Time</p>
          <p className="text-end">
            {appointment.from} - {appointment.to}
          </p>
        </>
      )}
    </div>
  );
}
