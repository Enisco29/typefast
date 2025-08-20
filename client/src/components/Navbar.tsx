import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, logout } = useAppContext();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 text-lg md:text-xl font-semibold">
      {token ? (
        <>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/configure" onClick={closeMenu}>
            Practice
          </Link>
          <Link to="/history" onClick={closeMenu}>
            History
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="text-red-600 hover:text-red-800"
          >logout</button>
        </>
      ) : (
        <Link to="/auth" onClick={closeMenu}>
          Login
        </Link>
      )}
    </div>
  );

  return (
    <nav className="relative z-50 bg-white/80 backdrop-blur sm:p-6 supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <img
            src={logo}
            alt="logo"
            onClick={() => navigate("/")}
            className="h-9 w-auto cursor-pointer max-sm:max-w-[100px]"
          />

          {/* Desktop nav */}
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <>
          <div className="md:hidden absolute inset-x-0 top-16 border-b border-gray-200 bg-white shadow">
            <div className="px-4 py-4">
              <NavLinks />
            </div>
          </div>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/10" onClick={closeMenu} />
        </>
      )}
    </nav>
  );
};

export default Navbar;
