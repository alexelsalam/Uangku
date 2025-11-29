import { Home, TrendingUp, BarChart3, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Nav = () => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "transaksi", icon: TrendingUp, label: "transaksi" },
    { id: "data", icon: BarChart3, label: "data" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#222222] rounded-full text-white">
      <div className="flex justify-center items-center px-4 py-2 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              to={`/${tab.id}`}
              key={tab.id}
              //isActive parameter dari react-router true/false
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg scale-105 "
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {/* <span className="text-xs font-medium">{tab.label}</span> */}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
