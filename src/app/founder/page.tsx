import { prisma } from "@/lib/prisma";
import { FounderForm } from "./client";


export const dynamic = "force-dynamic";
export const metadata = {
  title: "Founder",
};

export default async function FounderPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <FounderForm
      title={settings?.founderPageTitle || "Write to the founder"}
      subtitle={settings?.founderPageSubtitle || "A direct line to the person behind the cloth."}
    />
  );
}
