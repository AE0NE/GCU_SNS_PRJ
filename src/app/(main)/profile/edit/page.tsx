import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { EditProfileForm } from "./EditProfileForm";

export default async function EditProfilePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return <EditProfileForm profile={currentUser} />;
}
