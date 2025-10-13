import { requireAdmin } from "@/utils/adminAuth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This function handles all authentication and authorization server-side
  await requireAdmin();

  return <>{children}</>;
}
