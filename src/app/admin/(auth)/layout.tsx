import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in | Kimondo Studio" };

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user && ["admin", "editor"].includes(session.user.role || "")) {
    redirect("/admin");
  }

  return <>{children}</>;
}
