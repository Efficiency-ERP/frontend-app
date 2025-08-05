import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";

function DashboardLayout(){
    return(
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AppNavbar />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
			</SidebarProvider>
    );
}

export default DashboardLayout;