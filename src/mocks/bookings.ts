import { Booking, Test } from "@/types";
import { patients } from "./patients";
import { Timestamp } from "firebase/firestore";

export const bookings: Booking[] = [
  {
    id: "booking-1",
    owner: patients[0],
    doctorsAppointment: {
      date: new Date("2024-07-19"),
      from: "09:00",
      to: "09:30",
    },
    labAppointment: {
      date: new Date("2024-07-21"),
      from: "10:00",
      to: "10:30",
    },
    tests: { pcv: 45, Blood_Test: 75 },
    timestamp: Timestamp.fromDate(new Date("2024-07-10T08:00:00")),
  },
  {
    id: "booking-2",
    owner: patients[1],
    doctorsAppointment: {
      date: new Date("2024-07-22"),
      from: "10:00",
      to: "10:30",
    },
    labAppointment: {
      date: new Date("2024-07-22"),
      from: "11:00",
      to: "11:30",
    },
    tests: { pcv: 40, Urine_Test: 80 },
    timestamp: Timestamp.fromDate(new Date("2024-07-11T09:00:00")),
  },
  {
    id: "booking-3",
    owner: patients[2],
    doctorsAppointment: {
      date: new Date("2024-07-23"),
      from: "11:00",
      to: "11:30",
    },
    tests: { pcv: 50, X_Ray: 90 },
    timestamp: Timestamp.fromDate(new Date("2024-07-12T10:00:00")),
  },
  {
    id: "booking-4",
    owner: patients[3],
    doctorsAppointment: {
      date: new Date("2024-07-24"),
      from: "12:00",
      to: "12:30",
    },
    timestamp: Timestamp.fromDate(new Date("2024-07-13T11:00:00")),
  },
  {
    id: "booking-5",
    owner: patients[4],
    doctorsAppointment: {
      date: new Date("2024-07-25"),
      from: "13:00",
      to: "13:30",
    },
    labAppointment: {
      date: new Date("2024-07-25"),
      from: "14:00",
      to: "14:30",
    },
    tests: { pcv: 55, Blood_Test: 85, Urine_Test: 70 },
    timestamp: Timestamp.fromDate(new Date("2024-07-14T12:00:00")),
  },
  {
    id: "booking-6",
    owner: patients[0],
    doctorsAppointment: {
      date: new Date("2024-07-26"),
      from: "14:00",
      to: "14:30",
    },
    tests: { pcv: 60, X_Ray: 65 },
    timestamp: Timestamp.fromDate(new Date("2024-07-15T13:00:00")),
  },
  {
    id: "booking-7",
    owner: patients[1],
    doctorsAppointment: {
      date: new Date("2024-07-27"),
      from: "15:00",
      to: "15:30",
    },
    labAppointment: {
      date: new Date("2024-07-27"),
      from: "16:00",
      to: "16:30",
    },
    tests: { pcv: 65, Blood_Test: 70, Urine_Test: 75, X_Ray: 80 },
    timestamp: Timestamp.fromDate(new Date("2024-07-16T14:00:00")),
  },
  {
    id: "booking-8",
    owner: patients[2],
    doctorsAppointment: {
      date: new Date("2024-07-28"),
      from: "16:00",
      to: "16:30",
    },
    timestamp: Timestamp.fromDate(new Date("2024-07-17T15:00:00")),
  },
  {
    id: "booking-9",
    owner: patients[3],
    doctorsAppointment: {
      date: new Date("2024-07-29"),
      from: "17:00",
      to: "17:30",
    },
    labAppointment: {
      date: new Date("2024-07-29"),
      from: "18:00",
      to: "18:30",
    },
    tests: { pcv: 70, Blood_Test: 65 },
    timestamp: Timestamp.fromDate(new Date("2024-07-18T16:00:00")),
  },
  {
    id: "booking-10",
    owner: patients[4],
    doctorsAppointment: {
      date: new Date("2024-07-30"),
      from: "18:00",
      to: "18:30",
    },
    labAppointment: {
      date: new Date("2024-07-30"),
      from: "19:00",
      to: "19:30",
    },
    tests: { pcv: 75, Urine_Test: 60 },
    timestamp: Timestamp.fromDate(new Date("2024-07-19T17:00:00")),
  },
];
