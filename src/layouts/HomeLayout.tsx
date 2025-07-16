import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export function HomeLayout() {
  return (
    <div className="w-full h-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full overflow-hidden bg-zinc-100">
          <div className="w-full text-start">
            <SidebarTrigger className="cursor-pointer" />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
