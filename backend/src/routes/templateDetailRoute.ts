import express from "express";
import TempelateDetailsController from "../controller/TemplateDetails.ts";
import AuthMiddleware from "../middleware/auth.ts";

class TemplateDetailRoutes {
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        // Public routes
        this.router.get("/get-by-template/:tempelateId", TempelateDetailsController.getTemplateDetails);
        this.router.get("/list-all", TempelateDetailsController.listTemplateDetails);

        // Admin-only routes
        this.router.post("/add/:tempelateId", AuthMiddleware.isAdmin, TempelateDetailsController.addTemplateDetail);
        this.router.put("/update/:id", AuthMiddleware.isAdmin, TempelateDetailsController.updateTemplateDetail);
        this.router.delete("/delete/:id", AuthMiddleware.isAdmin, TempelateDetailsController.deleteTemplateDetail);
    }
}

export default new TemplateDetailRoutes().router;
