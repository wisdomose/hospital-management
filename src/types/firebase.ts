export enum COLLECTION {
  USERS = "USERS",
  SLOTS = "SLOTS",
  BOOKINGS = "BOOKINGS",
}

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};
