import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

class AuthMiddleware {
    static authenticateToken(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.auth_token;

        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not configured" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; email: string; role: string };
            req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
            next();
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
    }    

    static isAdmin(req: Request, res: Response, next: NextFunction) {
        AuthMiddleware.authenticateToken(req, res, () => {
            // Then check if user has admin role
            if (req.user?.role === 'ADMIN') {
                next();
            } else {
                return res.status(403).json({ message: "Access denied. Admins only." });
            }
        });
    }

    static rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Stricter rate limiting for authentication endpoints
    static authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 login/signup attempts per 15 minutes
        message: "Too many authentication attempts. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Very strict rate limiting for password reset to prevent abuse
    static passwordResetLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Only 5 password reset requests per 15 minutes
        message: "Too many password reset attempts. Please try again in 15 minutes.",
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false, // Count all requests, even successful ones
    });

}

export default AuthMiddleware;  