import express from "express";
import userController from "../controller/User.ts";
import AuthMiddleware from "../middleware/auth.ts";

class UserRoutes { 
    router = express.Router();

    constructor() {
        this.init();
    }

    private init() {
        this.router.post("/signup", AuthMiddleware.authLimiter, userController.RegisterUser);
        this.router.post("/signin", AuthMiddleware.authLimiter, userController.LoginUser);

        this.router.get("/get-profile", AuthMiddleware.authenticateToken, userController.getUserProfile);
        this.router.put("/update-profile", AuthMiddleware.authenticateToken, userController.updateUserProfile);
        this.router.delete("/delete-account", AuthMiddleware.authenticateToken, userController.deleteUserAccount);
        this.router.post("/logout", AuthMiddleware.authenticateToken, userController.LogoutUser);
        this.router.get("/get-user/:id", AuthMiddleware.authenticateToken, userController.getUserById);
        this.router.post("/change-password", AuthMiddleware.authenticateToken, userController.changePassword);

        // Password change with OTP verification (authenticated)
        this.router.post("/send-password-change-otp", AuthMiddleware.authenticateToken, AuthMiddleware.passwordResetLimiter, userController.sendPasswordChangeOtp);
        this.router.post("/verify-password-change-otp", AuthMiddleware.authenticateToken, AuthMiddleware.passwordResetLimiter, userController.verifyPasswordChangeOtp);

        // Email verification routes (authenticated)
        this.router.post("/send-verification-email", AuthMiddleware.authenticateToken,  userController.sendVerificationEmail);
        this.router.post("/verify-email", AuthMiddleware.authenticateToken, AuthMiddleware.passwordResetLimiter, userController.verifyEmail);

        // Password reset routes (public) - strict rate limiting
        this.router.post("/forgot-password", AuthMiddleware.passwordResetLimiter, userController.forgotPassword);
        this.router.post("/reset-password", AuthMiddleware.passwordResetLimiter, userController.resetPassword);

        // Admin-only routes
        this.router.get("/get-all-users", AuthMiddleware.isAdmin, userController.getAllUsers);
        this.router.put("/update-user-role/:id", AuthMiddleware.isAdmin, userController.updateUserRole);

    }
}

export default new UserRoutes().router;
