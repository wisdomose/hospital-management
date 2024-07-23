import {
  Booking,
  COLLECTION,
  Patient,
  ROLES,
  Slot,
  TimeSlot,
  User,
} from "@/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import UserService from "./User";

export default class BookingService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.findAll = this.findAll.bind(this);
    this.lab = this.lab.bind(this);
    this.create = this.create.bind(this);
    this.reschedule = this.reschedule.bind(this);
    this.tests = this.tests.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  async create(params: Slot) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userRef = doc(
          this.db,
          COLLECTION.USERS,
          this.auth.currentUser.uid
        );

        const booking = {
          owner: userRef,
          doctorsAppointment: params,
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(this.db, COLLECTION.BOOKINGS), booking);

        resolve(true);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async lab(id: string, params: Slot) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const bookingRef = doc(this.db, COLLECTION.BOOKINGS, id);

        const booking = {
          labAppointment: params,
        };
        await updateDoc(bookingRef, booking);
        resolve(true);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async tests(id: string, params: NonNullable<Booking["tests"]>) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const bookingRef = doc(this.db, COLLECTION.BOOKINGS, id);

        const booking = { tests: params };

        await updateDoc(bookingRef, booking);
        resolve(true);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async reschedule(
    id: string,
    params: { doctorsAppointment: TimeSlot } | { labAppointment: TimeSlot }
  ) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const bookingRef = doc(this.db, COLLECTION.BOOKINGS, id);

        const booking = { ...params };

        await updateDoc(bookingRef, booking);
        resolve(true);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async findOne(id: string) {
    return new Promise<Booking>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const bookRef = doc(this.db, COLLECTION.BOOKINGS, id);

        const querySnapshot = await getDoc(bookRef);

        if (querySnapshot.exists()) {
          const data = querySnapshot.data();
          const owner = await getDoc(data.owner);
          const booking = {
            ...data,
            id: querySnapshot.id,
            owner: owner.data(),
          };

          resolve(booking as unknown as Booking);
        } else throw new Error("No booking found");
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async findAll() {
    return new Promise<Booking[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();
        const profile = await userService.profile();

        const userRef = doc(
          this.db,
          COLLECTION.USERS,
          this.auth.currentUser.uid
        );

        const bookingCol = collection(this.db, COLLECTION.BOOKINGS);
        let q =
          profile.role === ROLES.PATIENT
            ? query(bookingCol, where("owner", "==", userRef))
            : profile.role === ROLES.SCIENTIST
            ? query(bookingCol)
            : query(bookingCol);

        const querySnapshot = await getDocs(q);

        let promises: Promise<Booking | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const owner = await getDoc(data.owner);

                  const booking = {
                    ...data,
                    id: doc.id,
                    owner: { userId: owner.id, ...(owner.data() ?? {}) },
                  } as Booking;
                  res(booking);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const applications = await Promise.all(promises);
        resolve(applications.filter((applications) => applications !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
