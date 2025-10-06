"use client";

import { Button } from "@ui";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      Logout
    </Button>
  );
}
