import { Patient, ROLES, Test, User } from "@/types";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

export function displayResult(key: Test, value: string, user: User) {
  let result = "-";

  switch (key) {
    case Test.BloodPressure:
      result = !!value ? `${value} mmHg` : result;
      break;
    case Test.OxygenSaturation:
      result = !!value ? `${value}%` : result;
      break;
    case Test.PCV:
      if (user.role === ROLES.PATIENT && !!result) {
        const numRes = Number(value);
        if ((user as Patient).gender === "female")
          result =
            numRes < 38
              ? "Low"
              : numRes <= 52
              ? "Normal"
              : numRes > 52
              ? "High"
              : "-";
        else
          result =
            numRes < 34
              ? "Low"
              : numRes <= 58
              ? "Normal"
              : numRes > 58
              ? "High"
              : "-";
      } else result = !!value ? `${value}%` : result;
      break;
    case Test.Pulse:
      result = !!value ? `${value} bpm` : result;
      break;
    case Test.Respiration:
      result = !!value ? `${value} breaths per minute` : result;
      break;
    case Test.Temprature:
      result = !!value ? `${value} °C` : result;
      break;
  }

  return result;
}