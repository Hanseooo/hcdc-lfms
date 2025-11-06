"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import brandImg from "@/assets/images/hcdc_logo.png";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; 



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.logout();
      navigate("/login");
    }
    setOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
  ];

  auth?.user?.user_type === 'admin' ? navItems.push(
    { name: "Admin", path: "/admin" },
  ) : ""

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full shadow-md transition-all duration-300
        bg-linear-to-r from-[#3b0a0a] via-[#550f0f] to-[#2a0202]
        text-primary-foreground
        dark:backdrop-blur-md dark:bg-[rgba(40,0,0,0.35)] dark:border-b dark:border-white/10
      `}
    >
      <div className="container flex items-center justify-between py-3 px-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={brandImg}
            alt="HCDC Logo"
            width={36}
            height={36}
            className="rounded-md object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                onClick={() => handleNavigate(item.path)}
                className={`text-white hover:text-maroon-100 hover:bg-white/10 transition-colors ${
                  location.pathname === item.path
                    ? "underline underline-offset-4"
                    : ""
                }`}
              >
                {item.name}
              </Button>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="border-0 text-white hover:bg-white/10 hover:text-gray-200 transition-colors"
            >
              Logout
            </Button>
          </li>
        </ul>

        {/* Mobile Menu Popover */}
        <div className="sm:hidden">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="
                mt-2 w-48 rounded-xl border border-white/10 p-3 
                bg-linear-to-b from-[#3b0a0a]/95 to-[#1a0101]/95 
                backdrop-blur-md text-white shadow-xl
              "
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full justify-start text-white hover:bg-white/10 ${
                      location.pathname === item.path
                        ? "underline underline-offset-4"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Button>
                ))}
                <div className="border-t border-white/10 my-1"></div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-white hover:bg-white/10 hover:text-gray-200 transition-colors"
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
