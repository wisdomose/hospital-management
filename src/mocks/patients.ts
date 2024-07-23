import { Patient, ROLES } from "@/types";
import { Timestamp } from "firebase/firestore";

export const patients: Patient[] = [
  {
    userId: "user-1",
    role: ROLES.PATIENT,
    displayName: "John Doe",
    email: "john.doe@example.com",
    phoneNo: "123-456-7890",
    gender: "Male",
    timestamp: Timestamp.fromDate(new Date("2024-07-01T10:00:00")),
  },
  {
    userId: "user-2",
    role: ROLES.PATIENT,
    displayName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNo: "987-654-3210",
    gender: "Female",
    timestamp: Timestamp.fromDate(new Date("2024-07-02T11:00:00")),
  },
  {
    userId: "user-3",
    role: ROLES.PATIENT,
    displayName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNo: "555-123-4567",
    gender: "Female",
    timestamp: Timestamp.fromDate(new Date("2024-07-03T12:00:00")),
  },
  {
    userId: "user-4",
    role: ROLES.PATIENT,
    displayName: "Bob Brown",
    email: "bob.brown@example.com",
    phoneNo: "111-222-3333",
    gender: "Male",
    timestamp: Timestamp.fromDate(new Date("2024-07-04T13:00:00")),
  },
  {
    userId: "user-5",
    role: ROLES.PATIENT,
    displayName: "Charlie Davis",
    email: "charlie.davis@example.com",
    phoneNo: "444-555-6666",
    gender: "Male",
    timestamp: Timestamp.fromDate(new Date("2024-07-05T14:00:00")),
  },
];
