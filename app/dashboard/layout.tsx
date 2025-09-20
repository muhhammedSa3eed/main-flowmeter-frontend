import { AppSidebar } from '@/components/SideBar/app-sidebar';
import { SiteHeader } from '@/components/SideBar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {/* <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div> */}
            <div className="flex flex-col gap-4 py-0 md:gap-6 md:py-0">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
