import { Home, FileText, Bell, HelpCircle, User, LogOut } from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const menuItems: SidebarItem[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "reportes", label: "Reportes", icon: FileText },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "soporte", label: "Soporte", icon: HelpCircle },
  { id: "perfil", label: "Perfil", icon: User },
];

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeItem, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="bg-white h-screen w-[300px] flex flex-col fixed left-0 top-0 border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 pb-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-1">MediScan</h1>
            <p className="text-sm text-gray-500 font-medium">IA Médica</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-3 rounded-lg transition-all duration-200 tracking-[-0.72px] ${
                    isActive
                      ? "bg-[#207193] text-white shadow-lg"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-black hover:bg-red-50 hover:text-red-600 transition-all duration-200 tracking-[-0.72px]"
        >
          <LogOut className="w-6 h-6" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
