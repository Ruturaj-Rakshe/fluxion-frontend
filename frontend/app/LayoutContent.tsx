"use client";

import { usePathname } from "next/navigation";
import { Footeer } from "@/components/Footeer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();


  const noFooter = ["/signin", "/signup", "/adminDashboard"];

  const hideFooter = noFooter.includes(pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {children}
        {!hideFooter && <Footeer />}
      </CartProvider>
    </AuthProvider>
  );
}
