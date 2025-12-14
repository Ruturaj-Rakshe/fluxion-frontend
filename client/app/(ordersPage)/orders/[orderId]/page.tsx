"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbarr";
import { orderAPI } from "@/lib/api";
import { Order } from "@/lib/index";
import { useRouter, useParams } from "next/navigation";
// import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
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
import Image from "next/image";

function OrderDetailsPageContent() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(orderId);
      if (response.order) {
        setOrder(response.order);
      }
    } catch (err: unknown) {
      console.error("Error fetching orders:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response === "object" &&
        (err as { response?: { status?: number } }).response?.status === 401
      ) {
        setError("Please login to view your orders");
        router.push("/signin");
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderAPI.cancelOrder(orderId);
      alert("Order cancelled successfully!");
      await fetchOrderDetails(); // Refresh order details
    } catch (err: unknown) {
      console.error("Error cancelling order:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === "object" &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        alert((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "PENDING":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "CANCELLED":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Order Info Card Skeleton */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>

          {/* Order Items Skeleton */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 bg-zinc-800/50 rounded-lg p-4">
                  <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-6 w-20 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-700 mt-6 pt-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-7 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <Navbar />
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500 text-xl mb-4">{error || "Order not found"}</p>
          <Button
            onClick={() => router.push("/orders")}
            className="bg-white text-black hover:bg-gray-200"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24">
          {/* Header */}
          <div className="mb-8">
            {/* <Button
              onClick={() => router.push("/orders")}
              variant="outline"
              className="mb-4 border-zinc-700 hover:bg-zinc-800"
            >
              ← Back to Orders
            </Button> */}
            <h1 className="text-3xl font-bold bbh-sans-bartle">Order Details</h1>
          </div>

          {/* Order Info Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Order ID</p>
                <p className="font-mono">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Order Date</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
              </div>
              {order.paymentId && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Payment ID</p>
                  <p className="font-mono text-sm">{order.paymentId}</p>
                </div>
              )}
              {order.paymentRef && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Payment Reference</p>
                  <p className="font-mono text-sm">{order.paymentRef}</p>
                </div>
              )}
            </div>

            {/* Cancel Order Button */}
            {order.status === "PENDING" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      Are you sure you want to cancel this order? This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">
                      Keep Order
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelOrder}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Cancel Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-zinc-800/50 rounded-lg p-4"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700 shrink-0">
                    <Image
                      src={item.tempelate.thumbnailUrl}
                      alt={item.tempelate.title}
                      fill
                      className="object-cover"

                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.tempelate.title}</h3>
                    {item.tempelateDetail && (
                      <p className="text-sm text-gray-400">
                        {item.tempelateDetail.header}
                      </p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">per item</p>
                    <p className="text-sm font-semibold mt-1">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-zinc-700 mt-6 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Order Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <OrderDetailsPageContent />
    </ProtectedRoute>
  );
}
