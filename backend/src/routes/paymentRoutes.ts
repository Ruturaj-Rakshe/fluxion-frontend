import express from "express";
import paymentController from "../controller/payment.ts";
import AuthMiddleware from "../middleware/auth.ts";

class PaymentRoutes {
    public router = express.Router();

    constructor(){
        this.registerRoutes();
    }
    private registerRoutes() {
        // Create payment intent (requires authentication)
        this.router.post("/create-payment-intent", AuthMiddleware.authenticateToken, paymentController.createPayment);
        
        // Webhook (no auth - Stripe verifies signature)
        this.router.post("/webhook", express.raw({type: 'application/json'}), paymentController.webhook);
    }
}
export default new PaymentRoutes().router;