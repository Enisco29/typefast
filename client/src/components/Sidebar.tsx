import { HistoryIcon, LayoutDashboard, Pencil, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="flex flex-col border-r border-gray-200 ">
      <NavLink
        end={true}
        to="/dashboard"
        className={({ isActive }) =>
          `nav-link  ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <LayoutDashboard className="w-7 h-7 md:w-5 md:h-5"  />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink
        to="/dashboard/configure"
        className={({ isActive }) =>
          `nav-link  ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <Pencil className="w-7 h-7 md:w-5 md:h-5" />
        <p className="hidden md:inline-block">Take test</p>
      </NavLink>

      <NavLink
        to="/dashboard/history"
        className={({ isActive }) =>
          `nav-link  ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <HistoryIcon className="w-7 h-7 md:w-5 md:h-5" />
        <p className="hidden md:inline-block">history</p>
      </NavLink>
      <NavLink
        to="/dashboard/leaderboard"
        className={({ isActive }) =>
          `nav-link  ${
            isActive && "bg-blue-300/10 border-r-4 border-blue-300"
          }`
        }
      >
        <Trophy className="w-7 h-7 md:w-5 md:h-5" />
        <p className="hidden md:inline-block">leader-Board</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
