import { prisma } from '../lib/prisma.ts';
import ZodSchemas from '../lib/zodValidation.ts';
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {

    public async RegisterUser(req: Request, res: Response): Promise<void> {
        try {
            const data = ZodSchemas.RegisterUser.parse(req.body);

            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name || "",
                    role: data.role,
                    password: hashedPassword
                }
            });

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not configured");
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            const { password, ...safeUser } = user;

            res.status(201).json({ user: safeUser, token });

        } catch (err: any) {

            if (err.name === "ZodError") {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ message: err.message });
        }
    }


    public async LoginUser(req: Request, res: Response): Promise<void> {
        try {
            const data = ZodSchemas.LoginUser.parse(req.body);

            const user = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                res.status(400).json({ message: "Invalid email or password" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(
                data.password,
                user.password
            );

            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid email or password" });
                return;
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not configured");
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            const { password, ...safeUser } = user;
            res.status(200).json({ user: safeUser, token });

        } catch (err: any) {

            if (err.name === "ZodError") {
                res.status(400).json({ errors: err.errors });
                return;
            }

            res.status(500).json({ message: err.message });
        }
    }

    async LogoutUser(req: Request, res: Response): Promise<void> {
        try {
            // this will handle by frontend easily by deleting the token
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    
}

export default new UserController();
