import { Header } from "@/components/layout/Header";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main className="mx-auto flex w-full max-w-[var(--feed-max-width)] flex-1 flex-col sm:max-w-3xl">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
