import { Outlet } from "react-router";
import Sidebar from "./sidebar";
import BottomNav from "./bottom-nav";
import Header from "./header";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="pb-28 md:pb-8 md:pl-60 px-4 py-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
