"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Navbar } from "@/components/Navbarr";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "E-Commerce App Template",
      price: 49,
      image: "/eddd.jpg",
    },
    {
      id: 2,
      name: "Social Media App Template",
      price: 59,
      image: "/dd.png",
    },
  ]);

  const removeItem = (id: number) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal > 100 ? 10 : 0;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes - discount;

  const handleCheckout = () => {
    console.log("✅ Proceeding to checkout...");
    // You can add your payment redirect or logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center bbh-sans-bartle">Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty..</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg">{item.name}</h2>
                        <p className="text-gray-400">${item.price}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 h-fit">
                <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taxes (10%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-800 my-4"></div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

               
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold mt-4 cursor-pointer bbh-sans-bartle">
                      Checkout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="backdrop-blur-sm bg-zinc-900/80 border border-zinc-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to checkout?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Once you proceed, you’ll be redirected to the payment page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-white hover:bg-zinc-800 cursor-pointer">
                        Go Back
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCheckout}
                        className="bg-white text-black hover:bg-gray-200 cursor-pointer"
                      >
                        Yes, Checkout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
