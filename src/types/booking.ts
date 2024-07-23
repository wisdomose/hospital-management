import { Timestamp } from "firebase/firestore";
import { Patient } from "./user";

export type Slot = {
  date: Timestamp;
  from: string; // 30 mins interval 07:00
  to: string; // 07:30
};

export type TimeSlot = Pick<Slot, "from" | "to">;

export enum Test {
  Temprature = "temprature",
  Pulse = "pulse",
  Respiration = "respiration",
  BloodPressure = "blood_pressure",
  OxygenSaturation = "oxygen_saturation",
  PCV = "pcv",
}

export type Booking = {
  id: string;
  owner: Patient;
  doctorsAppointment: Slot;
  labAppointment?: Slot;
  tests?: Partial<Record<Test, any>>;
  timestamp: Timestamp;
};
