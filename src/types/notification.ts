import { Timestamp } from "firebase/firestore";

export type NotificationType = "";

export type Notification = {
  id: string;
  read: boolean;
  type: NotificationType;
  notification: string;
  timestamp: Timestamp;
};
