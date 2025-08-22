import { HistoryIcon, LayoutDashboard, Pencil, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full">
      <NavLink
        end={true}
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <LayoutDashboard className="w-8 h-8 md:w-5 md:h-5 md:m-0 m-2"  />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/configure"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <Pencil className="w-8 h-8 md:w-5 md:h-5 md:m-0 m-2" />
        <p className="hidden md:inline-block">Take test</p>
      </NavLink>

      <NavLink
        to="/dashboard/history"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <HistoryIcon className="w-8 h-8 md:w-5 md:h-5 md:m-0 m-2" />
        <p className="hidden md:inline-block">history</p>
      </NavLink>
      <NavLink
        to="/dashboard/leaderboard"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <Trophy className="w-8 h-8 md:w-5 md:h-5 md:m-0 m-2" />
        <p className="hidden md:inline-block">leader-Board</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
