import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: {
    user: { name: string; email: string; image: string };
  } | null = await getServerSession();

  if (!session) {
    redirect("/");
  }

  let email: string = await session?.user?.email;

  const res = await fetch(`http://localhost:3001/api/users/email/${email}`);
  const data = await res.json();

  if (data.role === "user") {
    redirect("/");
  }

  return <>{children}</>;
}
