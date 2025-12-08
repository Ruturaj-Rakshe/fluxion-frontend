"use client";
import { useState, useEffect, use } from "react";
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
import { cartAPI } from "@/lib/api";
import { CartItem } from "@/lib/index";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe Publishable Key:', stripeKey ? 'Loaded ✓' : 'Missing ✗');

const stripePromise = loadStripe(stripeKey || '');

function CartPageContent() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalPrice: 0,
    itemCount: 0
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.cart) {
        setCartItems(response.cart);
      }
      if (response.summary) {
        setSummary(response.summary);
      }
      await refreshCart(); // Update navbar cart count
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        setError("Please login to view your cart");
        router.push("/signin");
      } else {
        setError("Failed to load cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const previousItems = cartItems;
    const previousSummary = summary;

    const updatedItems = cartItems.map((it) =>
      it.id === cartItemId ? { ...it, quantity: newQuantity } : it
    );

    // Recalculate summary locally
    const updatedTotalItems = updatedItems.reduce((s, i) => s + i.quantity, 0);
    const updatedTotalPrice = updatedItems.reduce(
      (s, i) => s + i.quantity * i.tempelate.price,
      0
    );

    setCartItems(updatedItems);
    setSummary({
      totalItems: updatedTotalItems,
      totalPrice: updatedTotalPrice,
      itemCount: updatedItems.length,
    });

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await cartAPI.updateCartItem(cartItemId, newQuantity);
      // update navbar badge
      await refreshCart();
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      alert(err.response?.data?.message || "Failed to update quantity");
      // revert to previous state
      setCartItems(previousItems);
      setSummary(previousSummary);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      // Refresh cart after removal
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearAllItems = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setSummary({ totalItems: 0, totalPrice: 0, itemCount: 0 });
      await refreshCart(); // Update navbar
    } catch (err) {
      console.error("Error clearing cart:", err);
      alert("Failed to clear cart. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    const confirmed = confirm(`Proceed with ${paymentMethod.toUpperCase()} payment for $${total.toFixed(2)}?`);
    if (!confirmed) return;

    try {
      setLoading(true);

      if (paymentMethod === 'card') {
        // Card Payment Flow
        const API_BASE_URL = "http://localhost:5000";
        const createPayment = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {

          amount: Math.round(total * 100),
          currency: 'usd',
          paymentMethod: 'card'
        }, {
          withCredentials: true
        });

        const paymentResponse = createPayment.data;
        const { clientSecret } = paymentResponse;

        console.log("publishable Key", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

        console.log("Client Secret received:", clientSecret);

        // Wait for Stripe to load
        if (!stripe) {
          console.error("Stripe.js has not loaded yet.");
          alert("Payment system is still loading. Please wait a moment and try again.");
          setLoading(false);
          return;
        }

        if (!elements) {
          console.error("Stripe Elements has not loaded yet.");
          alert("Payment form is still loading. Please wait a moment and try again.");
          setLoading(false);
          return;
        }

        // Wait for CardElement to be mounted (sometimes takes a moment)
        let cardElement = elements.getElement(CardElement);
        let retries = 0;
        const maxRetries = 5;
        
        while (!cardElement && retries < maxRetries) {
          console.log(`Waiting for CardElement to mount... (attempt ${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
          cardElement = elements.getElement(CardElement);
          retries++;
        }

        console.log("Card Element retrieved:", cardElement);

        if (!cardElement) {
          alert("Card input field is not ready. Please scroll to the card details section and ensure it's loaded, then try again.");
          setLoading(false);
          return;
        }

        console.log("Confirming card payment with client secret:", clientSecret);


        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          }
        });

        console.log("Payment confirmation result:", result);

        if (result.error) {
          console.error("Payment confirmation error:", result.error);
          alert(result.error.message || "Payment failed. Please try again.");
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          alert("Payment successful! Processing your order...");
          
          // Poll for order creation
          const paymentIntentId = result.paymentIntent.id;
          const maxAttempts = 10;
          let attempts = 0;
          
          const checkOrder = setInterval(async () => {
            attempts++;
            try {
              const { orderAPI } = await import("@/lib/api");
              const orderCheck = await orderAPI.getOrderByPaymentId(paymentIntentId);
              
              if (orderCheck.order) {
                clearInterval(checkOrder);
                alert(`Order created successfully! Order ID: ${orderCheck.order.id}`);
                await refreshCart();
                router.push("/orders");
              } else if (attempts >= maxAttempts) {
                clearInterval(checkOrder);
                alert("Order is being processed. Check your orders page in a moment.");
                await refreshCart();
                router.push("/orders");
              }
            } catch {
              if (attempts >= maxAttempts) {
                clearInterval(checkOrder);
                alert("Order is being processed. Check your orders page.");
                await refreshCart();
                router.push("/orders");
              }
            }
          }, 2000);
        }
      } else if (paymentMethod === 'upi') {
        // UPI Payment Flow with Stripe
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const createPayment = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {
          amount: Math.round(total * 100),
          currency: 'usd',
          paymentMethod: 'upi'
        }, {
          withCredentials: true
        });

        const { clientSecret } = createPayment.data;

        // For UPI, you need to use Payment Element instead of Card Element
        // Or redirect to Stripe's hosted payment page
        alert("UPI payment requires Stripe Payment Element. Please use Card payment for now, or integrate Razorpay for full UPI support.");
        setLoading(false);
      } else if (paymentMethod === 'netbanking') {
        // Net Banking Flow
        alert("Net Banking integration coming soon! Consider using Razorpay or Stripe for net banking.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error creating order:", err);
      if (err.response?.status === 401) {
        alert("Please login to checkout");
        router.push("/signin");
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || "Checkout failed. Please try again.");
        await fetchCart(); // Refresh cart in case items are no longer available
      } else {
        alert("Failed to create order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const subtotal = summary.totalPrice;
  const discount = subtotal > 100 ? 10 : 0;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes - discount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="min-h-screen bg-black text-white px-4 py-36">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center bbh-sans-bartle">Your Cart</h1>

          {loading ? (
            <p className="text-center text-gray-400">Loading cart...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Your cart is empty.</p>
              <Button
                onClick={() => router.push("/browsingPage")}
                className="bg-white text-black hover:bg-gray-200 hover:text-black font-semibold cursor-pointer"
              >
                Browse Templates
              </Button>
            </div>
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
                          src={item.tempelate.thumbnailUrl}
                          alt={item.tempelate.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg">{item.tempelate.title}</h2>
                        {item.tempelateDetail && (
                          <p className="text-sm text-gray-400">{item.tempelateDetail.header}</p>
                        )}
                        <p className="text-gray-400">${item.tempelate.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 bg-zinc-800 rounded min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                          {updatingItems.has(item.id) && (
                            <span className="text-xs text-gray-500">Updating...</span>
                          )}
                        </div>
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

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal ({summary.itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taxes (10%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-white bg-zinc-800'
                          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-xs font-medium">💳 Card</div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-white bg-zinc-800'
                          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-xs font-medium">📱 UPI</div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-white bg-zinc-800'
                          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-xs font-medium">🏦 Net Banking</div>
                    </button>
                  </div>
                </div>

                {/* Payment Details based on method */}
                {paymentMethod === 'card' && (
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <label className="block text-sm font-medium mb-2">Card Details</label>
                    {stripe && elements ? (
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#ffffff',
                              '::placeholder': {
                                color: '#9ca3af',
                              },
                            },
                            invalid: {
                              color: '#ef4444',
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="text-sm text-gray-400">Loading payment form...</div>
                    )}
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <label className="block text-sm font-medium mb-2">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                    />
                    <p className="text-xs text-gray-400 mt-2">Enter your UPI ID (e.g., phone@paytm, phone@gpay)</p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <label className="block text-sm font-medium mb-2">Select Bank</label>
                    <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white">
                      <option value="">Choose your bank</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={loading || (paymentMethod === 'card' && !stripe)}
                  className="w-full bg-white text-black hover:bg-gray-200 hover:text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : paymentMethod === 'card' && !stripe ? "Loading Payment..." : "Proceed to Checkout"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This will remove all items from your cart. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearAllItems}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Clear Cart
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

export default function CartPage() {
  return (
    <ProtectedRoute>
      <Elements stripe={stripePromise}>
        <CartPageContent />
      </Elements>
    </ProtectedRoute>
  );
}


// payment -> secretkey -> cvlientSecretKey -> 
