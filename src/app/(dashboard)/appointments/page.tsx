"use client";
import "@progress/kendo-theme-default/dist/all.css";
import { Scheduler, AgendaView } from "@progress/kendo-react-scheduler";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useFetcher from "@/hooks/useFetcher";
import { Booking, ROLES } from "@/types";
import { useEffect } from "react";
import BookingService from "@/services/Booking";
import Logout from "@/components/Logout";
import { GiHospital } from "react-icons/gi";
import { useUserStore } from "@/store/user";

export default function NurseDashboardPage() {
  const { wrapper, loading, data, error } = useFetcher<Booking[]>([]);
  const user = useUserStore((store) => store.user);

  async function findAllHandler() {
    const bookingService = new BookingService();
    await wrapper(() => bookingService.findAll());
  }

  useEffect(() => {
    findAllHandler();
  }, []);

  return (
    <main className="py-10">
      <nav className="flex items-center justify-between mb-6">
        <GiHospital className="size-8 text-primary" />
        <Logout />
      </nav>
      {user && (
        <div>
          <Scheduler
            data={data
              .filter((event) =>
                user.role === ROLES["SCIENTIST"] ? !!event.labAppointment : true
              )
              .map((event) => ({
                event_id: event.id,
                title: `${event.owner.displayName}`,
                start: new Date(
                  user.role === ROLES["SCIENTIST"]
                    ? `${event.labAppointment!.date.toDate().getFullYear()}/${
                        event.labAppointment!.date.toDate().getMonth() + 1
                      }/${event.labAppointment!.date.toDate().getDate()} ${
                        event.labAppointment!.from
                      }`
                    : `${event.doctorsAppointment.date
                        .toDate()
                        .getFullYear()}/${
                        event.doctorsAppointment.date.toDate().getMonth() + 1
                      }/${event.doctorsAppointment.date.toDate().getDate()} ${
                        event.doctorsAppointment.from
                      }`
                ),
                end: new Date(
                  user.role === ROLES["SCIENTIST"]
                    ? `${event.labAppointment!.date.toDate().getFullYear()}/${
                        event.labAppointment!.date.toDate().getMonth() + 1
                      }/${event.labAppointment!.date.toDate().getDate()} ${
                        event.labAppointment!.to
                      }`
                    : `${event.doctorsAppointment.date
                        .toDate()
                        .getFullYear()}/${
                        event.doctorsAppointment.date.toDate().getMonth() + 1
                      }/${event.doctorsAppointment.date.toDate().getDate()} ${
                        event.doctorsAppointment.to
                      }`
                ),
              }))}
          >
            <AgendaView
              viewTask={(p) => {
                return (
                  <div className="flex items-center gap-10">
                    {p.dataItem.title}
                    <Button asChild variant={"secondary"}>
                      <Link href={`/${p.dataItem.event_id}`}>view</Link>
                    </Button>
                  </div>
                );
              }}
            />
          </Scheduler>
        </div>
      )}
    </main>
  );
}
