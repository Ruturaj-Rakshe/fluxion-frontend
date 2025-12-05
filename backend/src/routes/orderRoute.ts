import express from "express";
import OrderController from "../controller/order.ts";
import AuthMiddleware from "../middleware/auth.ts";

class OrderRoutes {
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        // All order routes require authentication
        
        // Create order (checkout)
        this.router.post("/checkout", AuthMiddleware.authenticateToken, OrderController.createOrder);
        
        // Get user's orders
        this.router.get("/get-all-orders", AuthMiddleware.authenticateToken, OrderController.getUserOrders);
        
        // Get specific order
        this.router.get("/:orderId", AuthMiddleware.authenticateToken, OrderController.getOrderById);
        
        // Cancel order
        this.router.put("/:orderId/cancel", AuthMiddleware.authenticateToken, OrderController.cancelOrder);
        
        // Update order status (Admin only - for webhooks/admin panel)
        this.router.put("/:orderId/status", AuthMiddleware.isAdmin, OrderController.updateOrderStatus);
    }
}

export default new OrderRoutes().router;
