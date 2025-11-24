import express from "express";
import userController from "../controller/User.ts";
import AuthMiddleware from "../middleware/auth.ts";

class UserRoutes { 
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        this.router.post("/signup", userController.RegisterUser);
        this.router.post("/signin", userController.LoginUser);

        this.router.get("/get-profile", AuthMiddleware.authenticateToken, userController.getUserProfile);
        this.router.put("/update-profile", AuthMiddleware.authenticateToken, userController.updateUserProfile);
        this.router.delete("/delete-account", AuthMiddleware.authenticateToken, userController.deleteUserAccount);
        this.router.post("/logout", AuthMiddleware.authenticateToken, userController.LogoutUser);
        this.router.get("/get-user/:id", AuthMiddleware.authenticateToken, userController.getUserById);

        // Admin-only routes
        this.router.get("/get-all-users", AuthMiddleware.isAdmin, userController.getAllUsers);
        this.router.put("/update-user-role/:id", AuthMiddleware.isAdmin, userController.updateUserRole);

    }
}

export default new UserRoutes().router;
