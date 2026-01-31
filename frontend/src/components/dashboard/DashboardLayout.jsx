export default function DashboardLayout({ children }) {
  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-5 py-10 space-y-10">
        {children}
      </div>
    </main>
  );
}
