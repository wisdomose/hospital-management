import { Timestamp } from "firebase/firestore";

export enum ROLES {
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  SCIENTIST = "SCIENTIST",
  PATIENT = "PATIENT",
}

export type Staff = {
  userId: string;
  role: ROLES;
  displayName: string;
  email: string;
  timestamp: Timestamp;
};

export type Patient = {
  userId: string;
  role: ROLES;
  displayName: string;
  email: string;
  phoneNo: string;
  gender: string;
  timestamp: Timestamp;
};

export type User = Staff | Patient;
