import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { AgentList } from '@/components/agent-list';
import { CsvUpload } from '@/components/csv-upload';
import { DistributionViewer } from '@/components/distribution-viewer';

import { ProtectedRoute } from '@/components/protected-route';
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('agents');

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <ProtectedRoute>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-background">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                {activeSection === 'agents' && <AgentList />}
                {activeSection === 'upload' && <CsvUpload />}
                {activeSection === 'distributions' && <DistributionViewer />}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
