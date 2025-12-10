"use client";
import { useState, useEffect } from "react";
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
import { cartAPI, paymentAPI, orderAPI } from "@/lib/api";
import { CartItem } from "@/lib/index";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm() {
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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.cart) {
        setCartItems(response.cart);
        setSummary({
          totalItems: response.cart.length,
          totalPrice: response.cart.reduce((sum: number, item: CartItem) => sum + item.tempelate.price * item.quantity, 0),
          itemCount: response.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        });
      }
      await refreshCart(); // Update navbar
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching cart:", err);
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      if ((error?.response?.status === 401)) {
        setError("Please login to view your cart");
        router.push("/signin");
      } else {
        setError(error?.response?.data?.message || "Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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
    } catch (err: unknown) {
      console.error("Error updating quantity:", err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error?.response?.data?.message || "Failed to update quantity");
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

    if (!stripe || !elements) {
      alert("Stripe has not loaded yet. Please try again.");
      return;
    }

    setProcessingPayment(true);
    setCardError(null);

    try {
      // Create payment intent - Stripe requires amount in cents
      const amountInCents = Math.round(total * 100);
      const response = await paymentAPI.createPaymentIntent(
        amountInCents,
        paymentMethod === 'upi' ? 'upi' : 'card'
      );

      console.log("Payment Intent Response:", response);

      if (!response.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      console.log("Client Secret received:", response.clientSecret);
      console.log("Proceeding with payment method:", paymentMethod);

      // Confirm payment based on method
      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element not found");
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          response.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (confirmError) {
          setCardError(confirmError.message || "Payment failed");
          throw new Error(confirmError.message);
        }

        if (paymentIntent?.status === 'succeeded') {
          // Poll for order creation
          await pollForOrder(paymentIntent.id);
        }
      } else if (paymentMethod === 'upi') {
        // UPI with Stripe requires Payment Element or redirect flow
        alert("UPI payments require Stripe Payment Element integration.\n\nFor now, please use Card payment or integrate Razorpay for native UPI support (GPay, PhonePe, Amazon Pay).");
        setProcessingPayment(false);
        return;
        // TODO: Implement Stripe Payment Element or Razorpay UPI integration
      } else if (paymentMethod === 'netbanking') {
        alert("Net Banking - Please implement with Razorpay or similar gateway");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const error = err as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
      
      // Check if email verification is required
      if (error?.response?.status === 403 && error?.response?.data?.error?.includes('verify your email')) {
        const goToProfile = confirm(
          "⚠️ Email Verification Required\n\n" +
          "You haven't verified your email yet. You need to verify your email before making a purchase.\n\n" +
          "Click OK to go to your profile and verify your email, or Cancel to stay here."
        );
        
        if (goToProfile) {
          router.push('/settingsPage');
        }
      } else {
        alert(error?.response?.data?.message || error?.message || "Payment failed. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const pollForOrder = async (paymentIntentId: string, maxAttempts = 10) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await orderAPI.getOrderByPaymentId(paymentIntentId);
        if (response?.order) {
          alert(`Order created successfully! Order ID: ${response.order.id}`);
          await refreshCart();
          router.push('/orders');
          return;
        }
      } catch {
        console.log(`Polling attempt ${i + 1}/${maxAttempts}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Webhook hasn't created order - create it manually for local dev
    try {
      console.log("Creating order manually (webhook not received)");
      const orderResponse = await orderAPI.createOrder({
        paymentId: paymentIntentId,
        paymentRef: `ref_${Date.now()}`
      });
      
      if (orderResponse?.order) {
        alert(`Order created successfully! Order ID: ${orderResponse.order.id}`);
        await refreshCart();
        router.push('/orders');
        return;
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
    
    alert("Payment successful! Order is being processed. Check your orders page.");
    router.push('/orders');
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
                          <span className="px-3 py-1 bg-zinc-800 rounded min-w-10 text-center">
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
                <div className="border-t border-zinc-700 pt-4 space-y-3">
                  <h3 className="font-semibold text-sm">Payment Method</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === 'card'
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === 'upi'
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        paymentMethod === 'netbanking'
                          ? 'bg-white text-black'
                          : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      Net Banking
                    </button>
                  </div>

                  {/* Card Payment Input */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Card Details</label>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
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
                      </div>
                      {cardError && (
                        <p className="text-red-500 text-sm">{cardError}</p>
                      )}
                    </div>
                  )}

                  {/* UPI Payment Input */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      />
                      <p className="text-xs text-gray-500">
                        Note: UPI payments redirect to payment gateway
                      </p>
                    </div>
                  )}

                  {/* Net Banking Input */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-white focus:outline-none focus:border-white"
                      >
                        <option value="">Select your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        Net Banking requires integration with payment gateway
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading || processingPayment || !stripe}
                  className="w-full bg-white text-black hover:bg-gray-200 hover:text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
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

function CartPageContent() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartPageContent />
    </ProtectedRoute>
  );
}


// payment -> secretkey -> cvlientSecretKey -> 
