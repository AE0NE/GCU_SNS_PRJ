import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="plain" size="sm">
        로그아웃
      </Button>
    </form>
  );
}
