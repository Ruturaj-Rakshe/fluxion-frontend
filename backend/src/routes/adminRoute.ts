import express from "express";
import adminController from "../controller/Admin.ts";
import AuthMiddleware from "../middleware/auth.ts";

class AdminRoutes {
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        // All admin routes require admin authentication
        this.router.get("/dashboard-stats", AuthMiddleware.isAdmin, adminController.getDashboardStats);
        this.router.get("/recent-orders", AuthMiddleware.isAdmin, adminController.getRecentOrders);
        this.router.get("/recent-users", AuthMiddleware.isAdmin, adminController.getRecentUsers);
    }
}

export default new AdminRoutes().router;
