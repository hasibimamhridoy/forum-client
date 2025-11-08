"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedForum({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  // const navigate = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return redirect("/auth/login");
  }

  return <div>{children}</div>;
}
