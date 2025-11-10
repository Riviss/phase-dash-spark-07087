import { NavLink } from "react-router-dom";
import { 
  Activity, 
  Edit3, 
  CheckCircle, 
  Database, 
  Settings, 
  FileText, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/live", icon: Activity, label: "Live" },
  { to: "/pick", icon: Edit3, label: "Pick" },
  { to: "/qc", icon: CheckCircle, label: "QC" },
  { to: "/events", icon: Database, label: "Events" },
  { to: "/setup", icon: Settings, label: "Setup" },
  { to: "/logs", icon: FileText, label: "Logs" },
  { to: "/help", icon: HelpCircle, label: "Help" },
];

const LeftRail = () => {
  return (
    <aside className="flex w-16 flex-col items-center gap-1 border-r border-border bg-sidebar py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-md transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default LeftRail;
