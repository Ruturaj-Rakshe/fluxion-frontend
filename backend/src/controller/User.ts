import { prisma } from '../lib/prisma.ts';
import ZodSchemas from '../lib/zodValidation.ts';
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import xss from "xss";
import { promises } from 'node:dns';
import emailService from '../services/emailService.ts';

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
			}); const { password, ...safeUser } = user;

			res.status(201).json({ message: "User registered successfully", user: safeUser });

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
			res.status(200).json({ message: "User logged in successfully", user: safeUser });

		} catch (err: any) {

			if (err.name === "ZodError") {
				res.status(400).json({ errors: err.errors });
				return;
			}

			console.error("Login error:", err);
			res.status(500).json({ message: "An error occurred during login" });
		}
	}
	async LogoutUser(req: Request, res: Response): Promise<void> {
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
					organization: true,
					contactNumber: true,
					address: true,
					avatarUrl: true,
					isEmailVerified: true,
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

		if (data.email !== undefined) {
			const sanitizedEmail = xss(data.email.toLowerCase().trim());
			
			// Check if email is already taken by another user
			const existingUser = await prisma.user.findUnique({
				where: { email: sanitizedEmail }
			});

			if (existingUser && existingUser.id !== userId) {
				res.status(400).json({ message: "Email is already in use" });
				return;
			}

			updateData.email = sanitizedEmail;
			// Reset email verification when email changes
			updateData.isEmailVerified = false;
		}

		if (data.organization !== undefined) {
			updateData.organization = xss(data.organization.trim());
		}

		if (data.contactNumber !== undefined) {
			updateData.contactNumber = xss(data.contactNumber.trim());
		}

		if (data.address !== undefined) {
			updateData.address = xss(data.address.trim());
		}

		if (data.avatarUrl !== undefined) {
			updateData.avatarUrl = xss(data.avatarUrl.trim());
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
					organization: true,
					contactNumber: true,
					address: true,
					avatarUrl: true,
					isEmailVerified: true,
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

			if (!targetUserId) {
				res.status(400).json({ message: "User ID is required" });
				return;
			}

			// Only allow users to view their own profile, or admins to view anyone
			if (currentUserId !== targetUserId && req.user?.role !== 'ADMIN') {
				res.status(403).json({ message: "Access denied" });
				return;
			}

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

			// Prevent demoting the last admin
			if (role === 'USER') {
				const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
				if (adminCount <= 1) {
					res.status(400).json({ message: "Cannot demote the last admin" });
					return;
				}
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

			// Search/filter params - sanitize and limit search input
			const search = ((req.query.search as string)?.trim() || "").substring(0, 100);
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

	async changePassword(req: Request, res: Response): Promise<void> {

		try{
			const userId = req.user?.id;
			if(!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const data = ZodSchemas.ChangePassword.safeParse(req.body);

			if(!data.success){
				res.status(400).json({ errors: data.error.issues });
				return;
			}

			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}
			})

			if(!user){
				res.status(404).json({ message: "User not found" });
				return;
			}

			const isCurrentPasswordValid = await bcrypt.compare(data.data.currentPassword, user.password);

			if(!isCurrentPasswordValid){
				res.status(400).json({ message: "Current password is incorrect" });
				return;
			}

			// Prevent changing to the same password
			const isSamePassword = await bcrypt.compare(data.data.newPassword, user.password);
			if(isSamePassword){
				res.status(400).json({ message: "New password must be different from current password" });
				return;
			}

			const newHashedPassword = await bcrypt.hash(data.data.newPassword, 12);
			
			// Update password
			await prisma.user.update({
				where: {
					id: userId
				},
				data: {
					password: newHashedPassword
				}
			});

			// Log password change event with IP and timestamp
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Password changed for user ${user.email} (ID: ${userId}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			// Send password changed notification email
			await emailService.sendPasswordChangedNotification(user.email, user.name || 'User');

			// Clear current auth token to force re-login
			res.clearCookie("auth_token", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/"
			});

			res.status(200).json({ 
				message: "Password changed successfully. Please log in again with your new password.",
				requiresReauth: true 
			});
		} catch (err: any) {
			console.error("Error changing password:", err);
			res.status(500).json({ message: "An error occurred while changing password" });
		}
	}

	async sendPasswordChangeOtp(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const data = ZodSchemas.ChangePassword.safeParse(req.body);

			if (!data.success) {
				res.status(400).json({ errors: data.error.issues });
				return;
			}

			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			// Verify current password
			const isCurrentPasswordValid = await bcrypt.compare(data.data.currentPassword, user.password);

			if (!isCurrentPasswordValid) {
				res.status(400).json({ message: "Current password is incorrect" });
				return;
			}

			// Prevent changing to the same password
			const isSamePassword = await bcrypt.compare(data.data.newPassword, user.password);
			if (isSamePassword) {
				res.status(400).json({ message: "New password must be different from current password" });
				return;
			}

			// Generate 6-digit OTP
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const hashedOtp = await bcrypt.hash(otp, 10);
			const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

			// Store the new password (hashed) and OTP temporarily
			const newHashedPassword = await bcrypt.hash(data.data.newPassword, 12);
			
			await prisma.user.update({
				where: { id: userId },
				data: {
					emailVerificationOTP: hashedOtp,
					otpExpiry: otpExpiry,
					pendingPasswordHash: newHashedPassword
				}
			});

			// Send OTP to user's email
			await emailService.sendVerificationOTP(user.email, user.name || 'User', otp);

			res.status(200).json({ 
				message: "OTP sent to your email. Please verify to complete password change."
			});
		} catch (err: any) {
			console.error("Error sending password change OTP:", err);
			res.status(500).json({ message: "An error occurred while processing your request" });
		}
	}

	async verifyPasswordChangeOtp(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const data = ZodSchemas.VerifyEmail.safeParse(req.body);

			if (!data.success) {
				res.status(400).json({ errors: data.error.issues });
				return;
			}

			const { otp } = data.data;

			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			// Check if OTP exists
			if (!user.emailVerificationOTP || !user.otpExpiry) {
				res.status(400).json({ message: "No OTP found. Please request a new one." });
				return;
			}

			// Check if OTP expired
			if (new Date() > user.otpExpiry) {
				await prisma.user.update({
					where: { id: userId },
					data: {
						emailVerificationOTP: null,
						otpExpiry: null
					}
				});
				res.status(400).json({ message: "OTP has expired. Please request a new one." });
				return;
			}

			// Verify OTP
			const isValidOTP = await bcrypt.compare(otp, user.emailVerificationOTP);

			if (!isValidOTP) {
				res.status(400).json({ message: "Invalid OTP" });
				return;
			}

			// Check if pending password exists
			if (!user.pendingPasswordHash) {
				res.status(400).json({ message: "No pending password change found. Please try again." });
				return;
			}

			// Update password with the pending hash and clear OTP
			await prisma.user.update({
				where: { id: userId },
				data: {
					password: user.pendingPasswordHash,
					emailVerificationOTP: null,
					otpExpiry: null,
					pendingPasswordHash: null
				}
			});

			// Log password change event
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Password change OTP verified for user ${user.email} (ID: ${userId}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			// Send password changed notification email
			await emailService.sendPasswordChangedNotification(user.email, user.name || 'User');

			res.status(200).json({ 
				message: "Password change verified successfully!"
			});
		} catch (err: any) {
			console.error("Error verifying password change OTP:", err);
			res.status(500).json({ message: "An error occurred while verifying OTP" });
		}
	}

	async forgotPassword(req: Request, res: Response): Promise<void> {
		try {
			const data = ZodSchemas.ForgotPassword.safeParse(req.body);

			if(!data.success) {
				res.status(400).json({ errors: data.error.issues });
				return;
			}

			const sanitizedEmail = xss(data.data.email.toLowerCase().trim());

			const user = await prisma.user.findUnique({
				where: { email: sanitizedEmail }
			});

			// Always return success to prevent email enumeration attacks
			if(!user) {
				// Add delay to prevent timing-based email enumeration
				await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
				res.status(200).json({ 
					message: "If an account with that email exists, a password reset link has been sent." 
				});
				return;
			}

			// Generate reset token (valid for 1 hour)
			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not configured");
			}

			const resetToken = jwt.sign(
				{ userId: user.id, email: user.email, purpose: 'password-reset' },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" }
			);

			// Store token hash in database (for additional security)
			const tokenHash = await bcrypt.hash(resetToken, 10);
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

			await prisma.user.update({
				where: { id: user.id },
				data: {
					resetToken: tokenHash,
					resetTokenExpiry: expiresAt
				}
			});

			// Log the reset request
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Password reset requested for ${user.email} (ID: ${user.id}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			// Send password reset email
			const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken);
			
			if (emailSent) {
				console.log(`[EMAIL] Password reset email sent successfully to ${user.email}`);
			} else {
				console.error(`[EMAIL] Failed to send password reset email to ${user.email}`);
				console.error(`[EMAIL] Please check email service configuration`);
			}

			res.status(200).json({ 
				message: "If an account with that email exists, a password reset link has been sent."
			});

		} catch (err: any) {
			console.error("Error in forgot password:", err);
			res.status(500).json({ message: "An error occurred while processing your request" });
		}
	}

	async resetPassword(req: Request, res: Response): Promise<void> {
		try {
			const data = ZodSchemas.ResetPassword.safeParse(req.body);

			if(!data.success) {
				res.status(400).json({ errors: data.error.issues });
				return;
			}

			const { token, newPassword } = data.data;

			// Verify token
			if (!process.env.JWT_SECRET) {
				throw new Error("JWT_SECRET is not configured");
			}

			let decoded: any;
			try {
				decoded = jwt.verify(token, process.env.JWT_SECRET);
			} catch (err) {
				res.status(400).json({ message: "Invalid or expired reset token" });
				return;
			}

			// Verify purpose
			if (decoded.purpose !== 'password-reset') {
				res.status(400).json({ message: "Invalid reset token" });
				return;
			}

			// Get user and verify token in database
			const user = await prisma.user.findUnique({
				where: { id: decoded.userId }
			});

			if (!user || !user.resetToken || !user.resetTokenExpiry) {
				res.status(400).json({ message: "Invalid or expired reset token" });
				return;
			}

			// Check if token expired
			if (new Date() > user.resetTokenExpiry) {
				res.status(400).json({ message: "Reset token has expired. Please request a new one." });
				return;
			}

			// Verify token hash
			const isValidToken = await bcrypt.compare(token, user.resetToken);
			if (!isValidToken) {
				res.status(400).json({ message: "Invalid reset token" });
				return;
			}

			// Check if new password is same as old password
			const isSamePassword = await bcrypt.compare(newPassword, user.password);
			if (isSamePassword) {
				res.status(400).json({ message: "New password must be different from your current password" });
				return;
			}

			// Hash new password and update user
			const hashedPassword = await bcrypt.hash(newPassword, 12);
			await prisma.user.update({
				where: { id: user.id },
				data: {
					password: hashedPassword,
					resetToken: null,
					resetTokenExpiry: null
				}
			});

			// Log password reset
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Password reset completed for ${user.email} (ID: ${user.id}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			// Send password changed notification email
			await emailService.sendPasswordChangedNotification(user.email, user.name || 'User');

			res.status(200).json({ 
				message: "Password has been reset successfully. You can now log in with your new password." 
			});

		} catch (err: any) {
			console.error("Error in reset password:", err);
			res.status(500).json({ message: "An error occurred while resetting your password" });
		}
	}

	async sendVerificationEmail(req: Request, res: Response): Promise<void> {
		try {
			console.log("Starting sendVerificationEmail process");
			const userId = req.user?.id;

			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}
			console.log("Sending verification email to user ID:", userId);
			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}
			console.log("User found:", user.email);
			// Check if already verified
			if (user.isEmailVerified) {
				res.status(400).json({ message: "Email is already verified" });
				return;
			}

			// Generate 6-digit OTP
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			console.log("Generated OTP:", otp);
			// Hash OTP before storing
			const hashedOTP = await bcrypt.hash(otp, 10);
			console.log("Hashed OTP:", hashedOTP);
			// Set expiry to 10 minutes from now
			const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
			console.log("OTP Expiry set to:", otpExpiry.toISOString());
			// Store OTP in database
			await prisma.user.update({
				where: { id: userId },
				data: {
					emailVerificationOTP: hashedOTP,
					otpExpiry: otpExpiry
				}
			});

			console.log(`Stored hashed OTP and expiry for user ID: ${userId}`);

			// Log the verification email request
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Email verification OTP requested for ${user.email} (ID: ${userId}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			// Send verification email
			const emailSent = await emailService.sendVerificationOTP(user.email, user.name || 'User', otp);

			if (emailSent) {
				console.log(`[EMAIL] Verification OTP sent successfully to ${user.email}`);
				res.status(200).json({ 
					message: "Verification code has been sent to your email. Please check your inbox." 
				});
			} else {
				console.error(`[EMAIL] Failed to send verification OTP to ${user.email}`);
				res.status(500).json({ 
					message: "Failed to send verification email. Please try again later." 
				});
			}

		} catch (err: any) {
			console.error("Error sending verification email:", err);
			res.status(500).json({ message: "An error occurred while sending verification email" });
		}
	}

	async verifyEmail(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

		const data = ZodSchemas.VerifyEmail.safeParse(req.body);

		if (!data.success) {
			res.status(400).json({ errors: data.error.issues });
			return;
		}

		const { otp } = data.data;

		const user = await prisma.user.findUnique({
			where: { id: userId }
		});			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			// Check if already verified
			if (user.isEmailVerified) {
				res.status(400).json({ message: "Email is already verified" });
				return;
			}

			// Check if OTP exists
			if (!user.emailVerificationOTP || !user.otpExpiry) {
				res.status(400).json({ message: "No verification code found. Please request a new one." });
				return;
			}

			// Check if OTP expired
			if (new Date() > user.otpExpiry) {
				// Clear expired OTP
				await prisma.user.update({
					where: { id: userId },
					data: {
						emailVerificationOTP: null,
						otpExpiry: null
					}
				});
				res.status(400).json({ message: "Verification code has expired. Please request a new one." });
				return;
			}

			// Verify OTP
			const isValidOTP = await bcrypt.compare(otp, user.emailVerificationOTP);

			if (!isValidOTP) {
				res.status(400).json({ message: "Invalid verification code" });
				return;
			}

			// Mark email as verified and clear OTP
			await prisma.user.update({
				where: { id: userId },
				data: {
					isEmailVerified: true,
					emailVerificationOTP: null,
					otpExpiry: null
				}
			});

			// Log successful verification
			const forwardedFor = req.headers['x-forwarded-for'];
			const realIp = req.headers['x-real-ip'];
			let ipAddress = 'unknown';
			
			if (typeof forwardedFor === 'string' && forwardedFor) {
				const parts = forwardedFor.split(',');
				if (parts.length > 0 && parts[0]) {
					ipAddress = parts[0].trim();
				}
			} else if (typeof realIp === 'string' && realIp) {
				ipAddress = realIp;
			} else if (req.socket.remoteAddress) {
				ipAddress = req.socket.remoteAddress;
			}

			console.log(`[SECURITY] Email verified successfully for ${user.email} (ID: ${userId}) from IP: ${ipAddress} at ${new Date().toISOString()}`);

			res.status(200).json({ 
				message: "Email verified successfully!",
				isEmailVerified: true
			});

		} catch (err: any) {
			console.error("Error verifying email:", err);
			res.status(500).json({ message: "An error occurred while verifying email" });
		}
	}
}

export default new UserController();

// changePassword -> done
// forgetPassword -> done
// resetPassword -> done
// sendVerificationEmail -> done
// verifyEmail -> done
//.............. account management ..............
// getAllUsers -> done
// getUserById  -> done
// updateUserRole -> done

// ........... token management ............
// refreshToken -> done
// revokeToken
// logoutAllDevices

// enable 2fa
// enable2FA
// verify2FA