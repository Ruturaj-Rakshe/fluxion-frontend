import Stripe from 'stripe';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class PaymentController {

    async createPayment(req: Request, res: Response): Promise<void> {

        console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
        console.log("Create Payment Request Body:", req.body);



        const { amount, paymentMethod } = req.body;
        const userId = req.user?.id;

        console.log("User ID:", userId);
        console.log("Amount:", amount);
        console.log("Payment Method:", paymentMethod);


        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            // Get user's cart items to store with payment intent
            const cart = await prisma.cart.findMany({
                where: { userId },
                include: {
                    tempelate: true,
                    tempelateDetail: true
                }
            });

            if (!cart || cart.length === 0) {
                res.status(400).json({ message: "Cart is empty" });
                return;
            }

            // Determine payment method types based on request
            const paymentMethodTypes: string[] = ['card'];
            
            if (paymentMethod === 'upi') {
                paymentMethodTypes.push('upi');
            }

            console.log("Creating payment intent with method types:", paymentMethodTypes);
            console.log("Stripe Key exists:", !!process.env.STRIPE_SECRET_KEY);

            // Create payment intent with metadata and payment method types
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: paymentMethodTypes,
                metadata: {
                    userId: userId,
                    cartItemCount: cart.length.toString(),
                    paymentMethod: paymentMethod || 'card'
                }
            });

            console.log("Payment Intent created:", paymentIntent.id);

            console.log("------------Reaching here   1---------------");
            res.status(200).json({ 
                message: "Payment intent created successfully", 
                clientSecret: paymentIntent.client_secret 
            });

            console.log("Payment Intent response sent", paymentIntent.client_secret);
            console.log("------------Reaching here 2---------------");


            return;
        } catch (error: any) {
            console.error("Create payment error:", error);
            console.error("Error details:", error.message);
            console.error("Stripe Key exists:", !!process.env.STRIPE_SECRET_KEY);
            res.status(500).json({ 
                message: "Internal server error", 
                error: error.message || "Unknown error" 
            });
            return;
        }
    }

    async webhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        

        if (!webhookSecret) {
            console.error('Webhook secret not configured');
            res.status(500).json({ message: "Webhook secret not configured" });
            return;
        }

        let event: Stripe.Event;

        try {
            // Verify webhook signature
            event = stripe.webhooks.constructEvent(
                req.body,
                sig!,
                webhookSecret
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            res.status(400).json({ message: `Webhook Error: ${err.message}` });
            return;
        }

        // Handle the event
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log(`PaymentIntent ${paymentIntent.id} succeeded for ${paymentIntent.amount}`);
                    
                    // Create order in database
                    await this.handlePaymentSuccess(paymentIntent);
                    break;

                case 'payment_intent.payment_failed':
                    const failedPayment = event.data.object as Stripe.PaymentIntent;
                    console.log(`Payment failed for ${failedPayment.id}`);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            res.status(200).json({ received: true });
            return;
        } catch (error) {
            console.error('Webhook handler error:', error);
            res.status(500).json({ message: "Webhook handler error" });
            return;
        }
    }

    private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const userId = paymentIntent.metadata.userId;

        if (!userId) {
            console.error('No userId in payment intent metadata');
            return;
        }

        try {
            // Get user's cart
            const cartItems = await prisma.cart.findMany({
                where: { userId },
                include: {
                    tempelate: true,
                    tempelateDetail: true
                }
            });

            if (!cartItems || cartItems.length === 0) {
                console.error('No cart items found for user:', userId);
                return;
            }

            // Create order with all cart items
            const order = await prisma.order.create({
                data: {
                    userId,
                    paymentId: paymentIntent.id,
                    paymentRef: `ref_${Date.now()}`,
                    status: 'COMPLETED',
                    total: paymentIntent.amount / 100, // Convert cents to dollars
                    orderItems: {
                        create: cartItems.map(item => ({
                            tempelateId: item.tempelateId,
                            tempelateDetailId: item.tempelateDetailId,
                            quantity: item.quantity,
                            price: item.tempelate.price
                        }))
                    }
                }
            });

            // await sendConfirmationEmail(userId, order);

            // Clear user's cart after successful order
            await prisma.cart.deleteMany({
                where: { userId }
            });

            console.log(`Order ${order.id} created successfully for payment ${paymentIntent.id}`);
        } catch (error) {
            console.error('Error creating order from webhook:', error);
            throw error;
        }
    }
}

export default new PaymentController();