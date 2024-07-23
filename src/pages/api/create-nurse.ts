import { COLLECTION, ROLES, Staff } from "@/types";
import * as admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
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
import { firebaseConfig } from "@/lib";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Pick<Staff, "displayName" | "email"> & {
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

    const {
      email = "nurse@hospital.com",
      password = "password",
      displayName = "Jane Doe",
    } = req.body;

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
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        // connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      email,
      password,
      displayName,
      emailVerified: false,
      disabled: false,
    });

    const data = {
      userId: userRecord.uid,
      role: ROLES["NURSE"],
      email,
      displayName,
      timestamp: serverTimestamp(),
    };
    const result = await setDoc(doc(db, COLLECTION.USERS, data.userId), data);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).send(error?.response?.data ?? error.message);
  }
}
