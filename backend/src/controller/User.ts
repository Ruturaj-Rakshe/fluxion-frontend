import { prisma } from '../lib/prisma.ts';
import ZodSchemas from '../lib/zodValidation.ts';
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import xss from "xss";

class UserController {

	public async RegisterUser(req: Request, res: Response): Promise<void> {
		try {
			const data = ZodSchemas.RegisterUser.parse(req.body);
			
			// Sanitize inputs to prevent XSS
			const sanitizedEmail = xss(data.email.toLowerCase().trim());
			const sanitizedName = data.name ? xss(data.name.trim()) : "";
			
			const existingUser = await prisma.user.findUnique({
				where: { email: sanitizedEmail }
			});

			if (existingUser) {
				res.status(400).json({ message: 'User already exists' });
				return;
			}

			const hashedPassword = await bcrypt.hash(data.password, 12);

			const user = await prisma.user.create({
				data: {
					email: sanitizedEmail,
					name: sanitizedName,
					role: "USER", 
					password: hashedPassword
				}
			});

			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not configured");
			}
			const token = jwt.sign(
				{ userId: user.id, email: user.email, role: user.role },
				process.env.JWT_SECRET!,
				{ expiresIn: "1h" }
			);
		res.cookie("auth_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 1000 * 60 * 60, // 1 hour
		});			const { password, ...safeUser } = user;

			res.status(201).json({ message: "User registered successfully", user: safeUser, token });

		} catch (err: any) {

			if (err.name === "ZodError") {
				res.status(400).json({ errors: err.errors });
				return;
			}

			console.error("Registration error:", err);
			res.status(500).json({ message: "An error occurred during registration" });
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
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);			
		res.cookie("auth_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 1000 * 60 * 60, // 1 hour
				path: "/"
			});

		const { password, ...safeUser } = user;
		res.status(200).json({ message: "User logged in successfully", user: safeUser, token });

	} catch (err: any) {

		if (err.name === "ZodError") {
			res.status(400).json({ errors: err.errors });
			return;
		}

		console.error("Login error:", err);
		res.status(500).json({ message: "An error occurred during login" });
	}
}	async LogoutUser(req: Request, res: Response): Promise<void> {
		try {
			res.clearCookie("auth_token", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
			});
			res.status(200).json({ message: "Logged out" });
		} catch (err: any) {
			console.error("Logout error:", err);
			res.status(500).json({ message: "An error occurred during logout" });
		}
	}

	async getUserProfile(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;

			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				}
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			res.status(200).json({ message: "User profile fetched successfully", user });
		} catch (err: any) {
			console.error("Error fetching user profile:", err);
			res.status(500).json({
				message: "An error occurred while fetching user profile"
			});
		}
	}

	async updateUserProfile(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

		const data = ZodSchemas.UpdateUser.parse(req.body);

		const updateData: any = {};

		if (data.name !== undefined) {
			updateData.name = xss(data.name.trim()); // Sanitize name
		}

		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, 12);
		}			if (Object.keys(updateData).length === 0) {
				res.status(400).json({ message: "No valid fields to update" });
				return;
			}

			const updatedUser = await prisma.user.update({
				where: { id: userId },
				data: updateData,
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				}
			});

			res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
		} catch (err: any) {
			console.error("Error updating user profile:", err);

			if (err.name === "ZodError") {
				res.status(400).json({ errors: err.errors });
				return;
			}

			res.status(500).json({
				message: "An error occurred while updating user profile"
			});
		}
	}

	async deleteUserAccount(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			// Validate password 
			const { password } = req.body;
			if (!password) {
				res.status(400).json({
					message: "Password confirmation required to delete account"
				});
				return;
			}

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, password: true }
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				res.status(401).json({ message: "Invalid password" });
				return;
			}
			await prisma.user.delete({
				where: { id: userId }
			});

			res.status(200).json({
				message: "User account deleted successfully"
			});
		} catch (err: any) {
			console.error("Error deleting user account:", err);
			res.status(500).json({
				message: "An error occurred while deleting user account"
			});
		}
	}

	async getUserById(req: Request, res: Response): Promise<void> {
		try {
			const targetUserId = req.params.id || "";
			const currentUserId = req.user?.id;

			const user = await prisma.user.findUnique({
				where: { id: targetUserId },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				}
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			// Hide email unless viewing own profile 
			const isOwnProfile = currentUserId === targetUserId;
			// Get full user data to check role
			const currentUser = currentUserId ? await prisma.user.findUnique({
				where: { id: currentUserId },
				select: { role: true }
			}) : null;

			const isAdmin = currentUser?.role === "ADMIN";
			const responseUser = isOwnProfile || isAdmin
				? user
				: {
					id: user.id,
					name: user.name,
					role: user.role,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				};

			res.status(200).json({ message: "User profile fetched successfully", user: responseUser });
		} catch (err: any) {
			console.error("Error fetching user by ID:", err);

			res.status(500).json({
				message: "An error occurred while fetching user"
			});
		}
	}

	async updateUserRole(req: Request, res: Response): Promise<void> {
		try {
			const currentUserId = req.user?.id;
			if (!currentUserId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			// Check if current user is admin
			const currentUser = await prisma.user.findUnique({
				where: { id: currentUserId },
				select: { id: true, role: true }
			});
			if (!currentUser || currentUser.role !== "ADMIN") {
				res.status(403).json({ message: "Forbidden: Admin access required" });
				return;
			}

			const targetUserId = req.params.id || "";
			const { role } = req.body;

			// Validate role value
			const validRoles = ["USER", "ADMIN"] as const;
			if (!role || !validRoles.includes(role)) {
				res.status(400).json({
					message: "Invalid role. Must be USER or ADMIN"
				});
				return;
			}

			// Prevent admins from accidentally demoting themselves
			if (targetUserId === currentUser.id) {
				res.status(400).json({
					message: "Cannot modify your own role"
				});
				return;
			}

			const updatedUser = await prisma.user.update({
				where: { id: targetUserId },
				data: { role },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				}
			});

			res.status(200).json({ message: "User role updated successfully", user: updatedUser });
		} catch (err: any) {
			console.error("Error updating user role:", err);

			if (err.code === "P2025") {
				res.status(404).json({ message: "User not found" });
				return;
			}

			res.status(500).json({
				message: "An error occurred while updating user role"
			});
		}
	}

	async getAllUsers(req: Request, res: Response): Promise<void> {
		try {
			// Pagination params
			const page = Math.max(1, parseInt(req.query.page as string) || 1);
			const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
			const skip = (page - 1) * limit;

			// Search/filter params
			const search = (req.query.search as string)?.trim() || "";
			const role = req.query.role as string;

			// Build where clause
			const where: any = {};
			
			if (search) {
				where.OR = [
					{ email: { contains: search, mode: 'insensitive' } },
					{ name: { contains: search, mode: 'insensitive' } }
				];
			}

			if (role && ["USER", "ADMIN"].includes(role)) {
				where.role = role;
			}

			// Get total count for pagination metadata
			const total = await prisma.user.count({ where });

			// Fetch paginated users
			const users = await prisma.user.findMany({
				where,
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' }
			});

			res.status(200).json({
				message: "Users fetched successfully",
				users,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
					hasMore: skip + users.length < total
				}
			});
		} catch (err: any) {
			console.error("Error fetching all users:", err);
			res.status(500).json({
				message: "An error occurred while fetching users"
			});
		}

	}

}

export default new UserController();

// changePassword
// changePassword
// resetPassword
// sendVerificationEmail
// verifyEmail
//.............. account management ..............
// getAllUsers
// getUserById  -> done
// updateUserRole -> done

// ........... token management ............
// refreshToken
// revokeToken
// logoutAllDevices

// enable 2fa
// enable2FA
// verify2FA