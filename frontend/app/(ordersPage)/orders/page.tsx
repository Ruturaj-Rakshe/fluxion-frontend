"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbarr";
import { orderAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
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

interface OrderSummary {
  id: string;
  total: number;
  status: string;
  itemCount: number;
  items: Array<{
    template: string;
    model: string | null;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

function OrdersPageContent() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      if (response.orders) {
        setOrders(response.orders);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        setError("Please login to view your orders");
        router.push("/signin");
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId);
      await orderAPI.cancelOrder(orderId);
      alert("Order cancelled successfully!");
      await fetchOrders(); // Refresh orders
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } finally {
      setCancellingOrderId(null);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-28">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bbh-sans-bartle">My Orders</h1>
            <Button
              onClick={() => router.push("/browsingPage")}
              variant="outline"
              className="bg-white text-black hover:bg-gray-200"
            >
              Continue Shopping
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-4">No orders yet.</p>
              <Button
                onClick={() => router.push("/browsingPage")}
                className="bg-white text-black hover:bg-gray-200"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-800">
                    <div>
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="font-mono text-sm">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-400 font-semibold">
                      Items ({order.itemCount})
                    </p>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-zinc-800/50 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium">{item.template}</p>
                          {item.model && (
                            <p className="text-sm text-gray-400">{item.model}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      variant="outline"
                      className="flex-1 border-zinc-700 hover:bg-zinc-800"
                    >
                      View Details
                    </Button>
                    {order.status === "PENDING" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            disabled={cancellingOrderId === order.id}
                          >
                            {cancellingOrderId === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to cancel this order? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">
                              Keep Order
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}
