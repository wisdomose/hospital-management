"use client";
import { FiLogOut } from "react-icons/fi";
import { Button } from "./ui/button";
import { getAuth, signOut } from "firebase/auth";

export default function Logout() {
  const auth = getAuth();

  async function handler() {
    await signOut(auth);
    window.location.href = "/";
  }

  return (
    <Button onClick={handler} variant={"outline"}>
      <FiLogOut />
    </Button>
  );
}
