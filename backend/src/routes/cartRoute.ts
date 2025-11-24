import express from "express";
import CartController from "../controller/cart.ts";
import AuthMiddleware from "../middleware/auth.ts";

class CartRoutes {
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        // All cart routes require authentication
        this.router.get("/", AuthMiddleware.authenticateToken, CartController.getCart);
        this.router.post("/add", AuthMiddleware.authenticateToken, CartController.addToCart);
        this.router.put("/update/:tempelateId", AuthMiddleware.authenticateToken, CartController.updateCartItem);
        this.router.delete("/remove/:tempelateId", AuthMiddleware.authenticateToken, CartController.removeFromCart);
        this.router.delete("/clear", AuthMiddleware.authenticateToken, CartController.clearCart);
        this.router.post("/checkout", AuthMiddleware.authenticateToken, CartController.checkout);
    }
}

export default new CartRoutes().router;
