export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-text">Moment</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
