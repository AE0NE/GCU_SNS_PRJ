import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/");

  return <SignupForm />;
}
