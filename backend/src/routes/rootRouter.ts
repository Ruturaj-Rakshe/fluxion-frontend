import express from "express";
import userRoutes from "./userRoute.ts";
import tempelateRoutes from "./templateRoute.ts";
import tempelateDetailRoutes from "./templateDetailRoute.ts";
import cartRoutes from "./cartRoute.ts";
import orderRoutes from "./orderRoute.ts";
import adminRoutes from "./adminRoute.ts";
import paymentRoutes from "./paymentRoutes.ts";

class AppRoutes {
    public router = express.Router();

    constructor() {
        this.registerRoutes();

    }

    private registerRoutes() {
        this.router.use("/user", userRoutes);
        this.router.use("/templates", tempelateRoutes);
        this.router.use("/template-details", tempelateDetailRoutes);
        this.router.use("/cart", cartRoutes);
        this.router.use("/orders", orderRoutes);
        this.router.use("/admin", adminRoutes);
        this.router.use("/payment", paymentRoutes);
    }
}

export default new AppRoutes().router;
