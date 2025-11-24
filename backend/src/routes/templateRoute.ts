import express from "express";
import Tempelate from "../controller/Template.ts";
import AuthMiddleware from "../middleware/auth.ts";
class TemplateRoutes {
    router = express.Router();

    constructor() {
        this.init();
    }
  
    private init() {
        this.router.post("/add-template", AuthMiddleware.isAdmin, Tempelate.addTemplate);
        this.router.delete("/delete-template/:id", AuthMiddleware.isAdmin, Tempelate.deleteTemplate);
        this.router.put("/update-template/:id", AuthMiddleware.isAdmin, Tempelate.updateTempelate);
        this.router.get("/get-template/:id", Tempelate.getTemplateById);
        this.router.get("/get-all-templates", Tempelate.getAllTemplates);
    }
}

export default new TemplateRoutes().router;