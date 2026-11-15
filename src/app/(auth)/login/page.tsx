import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/");

  const { redirectTo } = await searchParams;

  return <LoginForm redirectTo={typeof redirectTo === "string" ? redirectTo : "/"} />;
}
