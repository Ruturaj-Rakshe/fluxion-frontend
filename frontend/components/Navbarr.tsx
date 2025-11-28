"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 py-4">
      <nav
        className={cn(
          "bbh-sans-bartle bg-black/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 max-w-5xl w-full",
          className
        )}
      >
        {/* Navbar container */}
        <div className="flex items-center justify-between gap-6 px-6 py-4 md:px-8">
        {/* Brand */}
        <a href="/" className="text-white font-bold text-lg tracking-wide">
          Fluxion
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8 text-white text-sm">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">Web Development</HoveredLink>
                <HoveredLink href="/interface-design">Interface Design</HoveredLink>
                <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
                <HoveredLink href="/branding">Branding</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Anchors">
              <div className="grid grid-cols-2 gap-6 p-4 text-sm">
                <ProductItem
                  title="About Us"
                  href="/aboutUs"
                  src="/aboutUs.png"
                  description="Learn more about our mission and team"
                />
                <ProductItem
                  title="Contact Us"
                  href="/contact"
                  src="/contact.png"
                  description="Get in touch with our team"
                />
                <ProductItem
                  title="Cart"
                  href="/cartPage"
                  src="/checkout.png"
                  description="View items in your shopping cart"
                />
                <ProductItem
                  title="Home"
                  href="/"
                  src="/homepage.png"
                  description="Start your journey with us"
                />
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hobby">Small</HoveredLink>
                <HoveredLink href="/individual">Mini</HoveredLink>
              </div>
            </MenuItem>
          </Menu>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => router.push("/cartPage")}
            className="relative p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-0.5 p-2 hover:bg-white/10 rounded-lg transition"
              >
                <User size={20} />
                <span className="text-sm">{user?.name}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl py-2">
                  <button
                    onClick={() => {
                      router.push("/orders");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                  >
                    Profile
                  </button>
                  <hr className="border-white/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 transition flex items-center space-x-2 text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/signin")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-center leading-tight"
            >
              Sign<br />in
            </button>
          )}
        </div>

        {/* Mobile hamburger icon */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Cart Icon for Mobile */}
          <button
            onClick={() => router.push("/cartPage")}
            className="relative p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ShoppingCart size={20} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="text-white p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 space-y-4 text-white text-sm">
          {/* User Info for Mobile */}
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <User size={18} />
                <span className="font-semibold">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  router.push("/orders");
                  setIsOpen(false);
                }}
                className="text-left pl-6 hover:text-gray-300"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  router.push("/profile");
                  setIsOpen(false);
                }}
                className="text-left pl-6 hover:text-gray-300"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-left pl-6 hover:text-gray-300 text-red-400 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pb-3 border-b border-white/10">
              <button
                onClick={() => {
                  router.push("/signin");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-center leading-tight"
              >
                Sign<br />in
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <span className="font-semibold text-gray-300">Services</span>
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="font-semibold text-gray-300">Anchors</span>
            <HoveredLink href="/aboutUs">About Us</HoveredLink>
            <HoveredLink href="/contact">Contact Us</HoveredLink>
            <HoveredLink href="/cartPage">Cart</HoveredLink>
            <HoveredLink href="/">Home</HoveredLink>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="font-semibold text-gray-300">Pricing</span>
            <HoveredLink href="/hobby">Small</HoveredLink>
            <HoveredLink href="/individual">Mini</HoveredLink>
          </div>
        </div>
      )}
      </nav>
    </div>
  );
}
