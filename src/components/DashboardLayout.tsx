import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function DashboardLayout({ activeItem, onNavigate, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#eaeaea]">
      <Sidebar 
        activeItem={activeItem} 
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <div className="ml-[300px] min-h-screen">
        {children}
      </div>
    </div>
  );
}
