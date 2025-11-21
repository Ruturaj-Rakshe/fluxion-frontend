"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Link, Menu as MenuIcon, X } from "lucide-react"; // hamburger + close icons

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 bbh-sans-bartle bg-black/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10",
        className
      )}
    >
      {/* Navbar container */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        {/* Brand */}
        <Link href="/" className="text-white font-bold text-lg tracking-wide">
          Fluxion
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8 text-white text-sm">
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
        </div>

        {/* Mobile hamburger icon */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 space-y-4 text-white text-sm">
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
  );
}
