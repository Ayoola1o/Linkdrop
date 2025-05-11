import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}> {/* Default to closed on desktop, controlled by trigger */}
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar collapsible="icon"> {/* Or "offcanvas" or "none" */}
             <SidebarNav />
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 p-4 md:p-8 container mx-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
