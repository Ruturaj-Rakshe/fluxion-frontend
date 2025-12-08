import Stripe from 'stripe';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts';
import { send } from 'process';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class PaymentController {

    async createPayment(req: Request, res: Response): Promise<void> {
        const amount = req.body?.amount;
        // user id 
        const userId = req.user?.id;

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

            // user -> cart-> fetch 

            if (!cart || cart.length === 0) {
                res.status(400).json({ message: "Cart is empty" });
                return;
            }

            // Create payment intent with metadata
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                metadata: {
                    userId: userId,
                    cartItemCount: cart.length.toString()
                }
            });

            res.status(200).json({ 
                message: "Payment intent created successfully", 
                clientSecret: paymentIntent.client_secret 
            });
            return;
        } catch (error) {
            console.error("Create payment error:", error);
            res.status(500).json({ message: "Internal server error", error });
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