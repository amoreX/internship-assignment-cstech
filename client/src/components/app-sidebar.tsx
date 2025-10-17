import { Users, Upload, BarChart3, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth';

const menuItems = [
  {
    title: 'Agents',
    icon: Users,
    section: 'agents',
  },
  {
    title: 'Upload & Distribute',
    icon: Upload,
    section: 'upload',
  },
  {
    title: 'Distributions',
    icon: BarChart3,
    section: 'distributions',
  },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-semibold">Agent Distribution</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.section)}
                    isActive={activeSection === item.section}
                    data-testid={`nav-${item.section}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} data-testid="button-logout">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
