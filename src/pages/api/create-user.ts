import { COLLECTION, Patient, ROLES } from "@/types";
import * as admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { getAuth as getAuth2 } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
  connectFirestoreEmulator,
  setDoc,
  doc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { firebaseConfig } from "@/lib";
import { connectStorageEmulator } from "firebase/storage";
import { connectAuthEmulator } from "firebase/auth";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Pick<Patient, "displayName" | "email" | "gender" | "phoneNo"> & {
    password: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(200).send("API up and running");
    // const {
    //   displayName = "test iyoriobhe wisdom",
    //   phoneNo = "09054057103",
    //   email = "student@gmail.com",
    //   password = "password",
    // } = req.body;
    const { displayName, email, password, phoneNo, gender } = req.body;

    const admin2 =
      admin.apps.length > 0
        ? admin.app("admin")
        : admin.initializeApp(
            {
              // TODO: don't put this in production level code
              credential: admin.credential.cert({
                projectId: process.env.projectId,
                clientEmail: process.env.clientEmail,
                privateKey: process.env.privateKey,
              }),
            },
            "admin"
          );

    initializeClientApp(firebaseConfig);
    const db = getFirestore();

    try {
      if (process.env.NODE_ENV === "development") {
        const auth = getAuth2();
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      emailVerified: false,
      disabled: false,
      email,
      password,
      displayName,
    });

    const data = {
      userId: userRecord.uid,
      role: ROLES["PATIENT"],
      displayName,
      email,
      phoneNo,
      gender,
      timestamp: serverTimestamp(),
    };

    const result = await setDoc(doc(db, COLLECTION.USERS, data.userId), data);

    res.status(200).json(doc);
  } catch (error: any) {
    res.status(400).send(error?.response?.data ?? error.message);
  }
}
