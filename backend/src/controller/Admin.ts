import { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

class AdminController {

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            // Get total users
            const totalUsers = await prisma.user.count();

            // Get users created today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newUsersToday = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: today
                    }
                }
            });

            // Get users created in last 7 days for chart
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentUsers = await prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: sevenDaysAgo
                    }
                },
                select: {
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            // Group users by date
            const usersByDate: Record<string, number> = {};
            recentUsers.forEach(user => {
                const date = user.createdAt.toISOString().split('T')[0];
                if (date) {
                    usersByDate[date] = (usersByDate[date] || 0) + 1;
                }
            });

            // Get total orders
            const totalOrders = await prisma.order.count();

            // Get orders today
            const ordersToday = await prisma.order.count({
                where: {
                    createdAt: {
                        gte: today
                    }
                }
            });

            // Get total revenue
            const orders = await prisma.order.findMany({
                select: {
                    total: true
                }
            });
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

            // Get revenue this month
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthlyOrders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: firstDayOfMonth
                    }
                },
                select: {
                    total: true,
                    createdAt: true
                }
            });
            const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

            // Revenue by day this month
            const revenueByDate: Record<string, number> = {};
            monthlyOrders.forEach(order => {
                const date = order.createdAt.toISOString().split('T')[0];
                if (date) {
                    revenueByDate[date] = (revenueByDate[date] || 0) + order.total;
                }
            });

            // Get total templates
            const totalTemplates = await prisma.tempelate.count();
            const activeTemplates = await prisma.tempelate.count({
                where: { isActive: 'ACTIVE' }
            });
            const inactiveTemplates = await prisma.tempelate.count({
                where: { isActive: 'INACTIVE' }
            });

            // Get user role distribution
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' }
            });
            const userCount = await prisma.user.count({
                where: { role: 'USER' }
            });

            // Get verified vs unverified users
            const verifiedUsers = await prisma.user.count({
                where: { isEmailVerified: true }
            });
            const unverifiedUsers = await prisma.user.count({
                where: { isEmailVerified: false }
            });

            res.status(200).json({
                message: "Dashboard stats fetched successfully",
                stats: {
                    users: {
                        total: totalUsers,
                        newToday: newUsersToday,
                        byDate: usersByDate,
                        admins: adminCount,
                        regularUsers: userCount,
                        verified: verifiedUsers,
                        unverified: unverifiedUsers
                    },
                    orders: {
                        total: totalOrders,
                        today: ordersToday
                    },
                    revenue: {
                        total: totalRevenue,
                        monthly: monthlyRevenue,
                        byDate: revenueByDate
                    },
                    templates: {
                        total: totalTemplates,
                        active: activeTemplates,
                        inactive: inactiveTemplates
                    }
                }
            });

        } catch (err: any) {
            console.error("Error fetching dashboard stats:", err);
            res.status(500).json({
                message: "An error occurred while fetching dashboard stats"
            });
        }
    }

    async getRecentOrders(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            const recentOrders = await prisma.order.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    orderItems: {
                        include: {
                            tempelate: {
                                select: {
                                    title: true,
                                    price: true
                                }
                            }
                        }
                    }
                }
            });

            res.status(200).json({
                message: "Recent orders fetched successfully",
                orders: recentOrders
            });

        } catch (err: any) {
            console.error("Error fetching recent orders:", err);
            res.status(500).json({
                message: "An error occurred while fetching recent orders"
            });
        }
    }

    async getRecentUsers(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            const recentUsers = await prisma.user.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isEmailVerified: true,
                    createdAt: true
                }
            });

            res.status(200).json({
                message: "Recent users fetched successfully",
                users: recentUsers
            });

        } catch (err: any) {
            console.error("Error fetching recent users:", err);
            res.status(500).json({
                message: "An error occurred while fetching recent users"
            });
        }
    }
}

export default new AdminController();
